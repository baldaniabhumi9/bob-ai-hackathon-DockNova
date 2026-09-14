"""
Feature engineering for the congestion prediction model.

Reads historical_metrics.csv via the data loader and produces a feature
matrix (X) plus target vectors (y_cls for congestion classification,
y_reg for wait-time regression).

Feature columns (order matches model training):
    vessel_arrivals, waiting_vessels, berth_utilization_pct,
    crane_utilization_pct, yard_occupancy_pct, avg_service_time_hours,
    hour_of_day, vessel_priority_avg

Scaling: StandardScaler fitted on the training split — persisted alongside
the trained model artefacts so that predict.py can reuse it at inference.
"""

from __future__ import annotations

from typing import Tuple

import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

from pathlib import Path as _Path

# Direct CSV path — avoids a circular import through loader.py → optimization/__init__.py
_CSV_PATH = _Path(__file__).resolve().parents[2] / "data" / "synthetic" / "historical_metrics.csv"


def _load_historical_metrics() -> pd.DataFrame:
    """Load the historical metrics CSV (standalone, avoids circular imports)."""
    df = pd.read_csv(_CSV_PATH)
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    return df

# Ordered list of feature column names expected by the model.
FEATURE_COLUMNS: list[str] = [
    "vessel_arrivals",
    "waiting_vessels",
    "berth_utilization_pct",
    "crane_utilization_pct",
    "yard_occupancy_pct",
    "avg_service_time_hours",
    "hour_of_day",
    "vessel_priority_avg",
]

# Target columns
CLASSIFIER_TARGET = "congestion_label"       # binary: 0 = normal, 1 = congested
REGRESSOR_TARGET  = "wait_time_hours"         # continuous: avg wait in hours


def build_feature_matrix(
    df: pd.DataFrame | None = None,
) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Build X, y_cls, y_reg from the historical metrics DataFrame.

    Parameters
    ----------
    df : pd.DataFrame, optional
        Override for testing. Defaults to ``get_historical_metrics()``.

    Returns
    -------
    X       : np.ndarray  — shape (n, 8)
    y_cls   : np.ndarray  — shape (n,)  binary congestion label
    y_reg   : np.ndarray  — shape (n,)  wait-time hours
    """
    if df is None:
        df = _load_historical_metrics()

    X = df[FEATURE_COLUMNS].to_numpy(dtype=np.float64)
    y_cls = df[CLASSIFIER_TARGET].to_numpy(dtype=np.int64)
    y_reg = df[REGRESSOR_TARGET].to_numpy(dtype=np.float64)

    return X, y_cls, y_reg


def fit_scaler(X_train: np.ndarray) -> StandardScaler:
    """
    Fit a StandardScaler on the training features and return it.
    """
    scaler = StandardScaler()
    scaler.fit(X_train)
    return scaler


def dict_to_feature_vector(state: dict) -> np.ndarray:
    """
    Convert a ``current_state`` dict (same keys as FEATURE_COLUMNS) to a
    1-row feature array suitable for prediction.

    Missing keys default to 0.0.
    """
    row = [float(state.get(col, 0.0)) for col in FEATURE_COLUMNS]
    return np.array([row], dtype=np.float64)
