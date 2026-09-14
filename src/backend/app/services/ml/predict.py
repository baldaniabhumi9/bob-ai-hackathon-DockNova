"""
Congestion prediction inference module.

Exposes ``predict_congestion(current_state)`` which loads the pre-trained
models from disk and returns a ``CongestionForecast`` Pydantic model.

Risk-level thresholds
~~~~~~~~~~~~~~~~~~~~~
Derived from the distribution of congestion_probability across the
historical dataset (~32% positive rate):

    congestion_probability   risk_level
    ─────────────────────    ──────────
           < 0.25            LOW        — normal operations
      0.25 – 0.50            MEDIUM     — monitor closely
      0.50 – 0.75            HIGH       — activate contingency
           ≥ 0.75            CRITICAL   — immediate intervention

Rationale: the 0.25 cut-off roughly corresponds to the lower quartile
of the congested observations, 0.50 is the natural decision boundary,
and 0.75 captures the upper quartile where wait times are typically
>15 hours — well above operational tolerance.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Optional

import joblib
import numpy as np

# NOTE: app.data.loader is imported lazily inside functions to avoid a
# circular import chain: loader → optimization/models → optimization/__init__
# → operations_plan → loader.
from app.services.ml.features import FEATURE_COLUMNS, dict_to_feature_vector
from app.services.optimization.models import CamelModel

# ---------------------------------------------------------------------------
# Pydantic response model — reuses CamelModel for camelCase JSON output
# ---------------------------------------------------------------------------


class HotspotInfo(CamelModel):
    """Berth identified as the most congested hotspot."""
    berth_id: str
    berth_name: str
    predicted_utilization_pct: float


class CongestionForecast(CamelModel):
    """
    Output of ``predict_congestion()``.

    Matches the CongestionForecast schema from docs/PROJECT_CONTRACT.md §4
    (to be added) with camelCase serialisation via CamelModel.
    """
    forecast_time: datetime
    congestion_probability: float      # 0.0 – 1.0
    predicted_wait_time_hours: float   # hours
    risk_level: str                    # LOW | MEDIUM | HIGH | CRITICAL
    hotspot: Optional[HotspotInfo] = None


# ---------------------------------------------------------------------------
# Risk-level thresholds (see module docstring for rationale)
# ---------------------------------------------------------------------------

_RISK_THRESHOLDS = [
    (0.75, "CRITICAL"),
    (0.50, "HIGH"),
    (0.25, "MEDIUM"),
]


def _risk_level(probability: float) -> str:
    """Map congestion probability to a risk level string."""
    for threshold, level in _RISK_THRESHOLDS:
        if probability >= threshold:
            return level
    return "LOW"


# ---------------------------------------------------------------------------
# Model loading (lazy singleton — loaded once per process)
# ---------------------------------------------------------------------------

_DATA_DIR = Path(__file__).resolve().parents[2] / "data"

_CLASSIFIER_PATH = _DATA_DIR / "congestion_model.pkl"
_REGRESSOR_PATH  = _DATA_DIR / "wait_time_model.pkl"
_SCALER_PATH     = _DATA_DIR / "feature_scaler.pkl"

_clf = None
_reg = None
_scaler = None


def _load_models() -> None:
    """Load the trained artefacts into module-level singletons."""
    global _clf, _reg, _scaler

    if _clf is not None:
        return  # already loaded

    if not _CLASSIFIER_PATH.exists():
        raise FileNotFoundError(
            f"Trained classifier not found at {_CLASSIFIER_PATH}. "
            "Run 'python3 -m app.services.ml.train' first."
        )

    _clf    = joblib.load(_CLASSIFIER_PATH)
    _reg    = joblib.load(_REGRESSOR_PATH)
    _scaler = joblib.load(_SCALER_PATH)


def reload_models() -> None:
    """Force-reload models from disk (useful after retraining)."""
    global _clf, _reg, _scaler
    _clf = _reg = _scaler = None
    _load_models()


# ---------------------------------------------------------------------------
# Hotspot identification
# ---------------------------------------------------------------------------

def _identify_hotspot(berth_utilization_pct: float) -> Optional[HotspotInfo]:
    """
    Identify the berth with the highest predicted utilisation.

    Uses real berth data from ``loader.get_berths()`` and distributes the
    overall ``berth_utilization_pct`` across berths with a simple heuristic:
    occupied berths get a higher share, available ones get less.
    """
    from app.data.loader import get_berths  # lazy import (see module-level note)
    berths = get_berths()
    if not berths:
        return None

    # Score each berth: occupied > available > maintenance
    status_weights = {"OCCUPIED": 1.5, "AVAILABLE": 1.0, "MAINTENANCE": 0.3}
    scored: list[tuple[dict, float]] = []
    for b in berths:
        w = status_weights.get(b.get("status", "AVAILABLE"), 1.0)
        # Berths with fewer compatible types are more specialised → higher pressure
        type_penalty = 1.0 + (4 - len(b.get("compatible_vessel_types", ["CONTAINER"]))) * 0.15
        score = w * type_penalty
        scored.append((b, score))

    # The berth with the highest score is the hotspot
    scored.sort(key=lambda t: t[1], reverse=True)
    top_berth, top_score = scored[0]
    total_score = sum(s for _, s in scored) or 1.0

    predicted_util = min(100.0, berth_utilization_pct * (top_score / total_score) * len(berths))

    return HotspotInfo(
        berth_id=top_berth["id"],
        berth_name=top_berth["name"],
        predicted_utilization_pct=round(predicted_util, 2),
    )


def _fallback_forecast(current_state: dict[str, Any]) -> CongestionForecast:
    """Deterministic operational fallback when trained artifacts are unavailable."""
    waiting = max(0.0, float(current_state.get("waiting_vessels", 0.0)))
    berth = max(0.0, float(current_state.get("berth_utilization_pct", 0.0)))
    crane = max(0.0, float(current_state.get("crane_utilization_pct", 0.0)))
    workload = max(0.0, float(current_state.get("avg_service_time_hours", 0.0)))
    probability = min(1.0, max(0.0, waiting * 0.06 + berth * 0.004 + crane * 0.002 + workload * 0.01))
    return CongestionForecast(
        forecast_time=datetime.utcnow() + timedelta(hours=1),
        congestion_probability=round(probability, 4),
        predicted_wait_time_hours=round(waiting * 1.5 + max(0.0, berth - 60.0) * 0.08, 2),
        risk_level=_risk_level(probability),
        hotspot=_identify_hotspot(berth),
    )


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def predict_congestion(current_state: dict[str, Any]) -> CongestionForecast:
    """
    Predict congestion probability and expected wait time for the given
    port state snapshot.

    Parameters
    ----------
    current_state : dict
        Keys matching FEATURE_COLUMNS:
            vessel_arrivals, waiting_vessels, berth_utilization_pct,
            crane_utilization_pct, yard_occupancy_pct,
            avg_service_time_hours, hour_of_day, vessel_priority_avg

    Returns
    -------
    CongestionForecast
        Pydantic model with congestion_probability, predicted_wait_time_hours,
        risk_level, hotspot, and forecast_time.
    """
    try:
        _load_models()
    except FileNotFoundError:
        return _fallback_forecast(current_state)

    # Build feature vector and scale
    X_raw = dict_to_feature_vector(current_state)
    X_scaled = _scaler.transform(X_raw)

    # Classifier: probability of congestion
    proba = _clf.predict_proba(X_scaled)[0]
    # Class 1 = congested
    congestion_prob = float(proba[1]) if len(proba) > 1 else float(proba[0])

    # Regressor: predicted wait time
    wait_time = float(_reg.predict(X_scaled)[0])
    wait_time = max(0.0, wait_time)  # clamp to non-negative

    # Risk level
    risk = _risk_level(congestion_prob)

    # Hotspot
    berth_util = float(current_state.get("berth_utilization_pct", 50.0))
    hotspot = _identify_hotspot(berth_util)

    return CongestionForecast(
        forecast_time=datetime.utcnow() + timedelta(hours=1),
        congestion_probability=round(congestion_prob, 4),
        predicted_wait_time_hours=round(wait_time, 2),
        risk_level=risk,
        hotspot=hotspot,
    )
