"""
Train congestion-prediction and wait-time-regression models.

Models
------
1. **Classifier** — predicts ``congestion_probability`` (probability that
   the port is in a congested state in the next hour).
2. **Regressor** — predicts ``wait_time_hours`` (expected average vessel
   wait time in the current state).

Algorithm choice
~~~~~~~~~~~~~~~~
XGBoost was the primary choice, but ``import xgboost`` fails on this
macOS environment due to a missing ``libomp`` (OpenMP runtime) dynamic
library — a known issue with Homebrew-less installs on Apple Silicon.
We therefore fall back to scikit-learn's RandomForest ensemble models,
which deliver comparable performance on this 2 016-row dataset without
any native dependency issues.

Artefacts persisted to ``app/data/``:
    congestion_model.pkl  — fitted RandomForestClassifier
    wait_time_model.pkl   — fitted RandomForestRegressor
    feature_scaler.pkl    — fitted StandardScaler (shared by both models)

Usage
~~~~~
    python3 -m app.services.ml.train      # from src/backend/
"""

from __future__ import annotations

import sys
from pathlib import Path

import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    mean_absolute_error,
)
from sklearn.model_selection import train_test_split

from app.services.ml.features import build_feature_matrix, fit_scaler

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

_DATA_DIR = Path(__file__).resolve().parents[2] / "data"  # app/data/

CLASSIFIER_PATH = _DATA_DIR / "congestion_model.pkl"
REGRESSOR_PATH  = _DATA_DIR / "wait_time_model.pkl"
SCALER_PATH     = _DATA_DIR / "feature_scaler.pkl"

# ---------------------------------------------------------------------------
# Training
# ---------------------------------------------------------------------------

def train_models(
    test_size: float = 0.2,
    random_state: int = 42,
) -> dict:
    """
    Train both models, serialise them to disk, and return metrics.

    Returns
    -------
    dict with keys:
        classifier_accuracy, classifier_f1,
        regressor_mae,
        algorithm, classifier_path, regressor_path, scaler_path
    """
    # 1. Build feature matrix from historical data
    X, y_cls, y_reg = build_feature_matrix()

    # 2. Train/test split (shared split so evaluation is comparable)
    X_train, X_test, y_cls_train, y_cls_test, y_reg_train, y_reg_test = (
        train_test_split(
            X, y_cls, y_reg,
            test_size=test_size,
            random_state=random_state,
            stratify=y_cls,  # maintain ~32% positive rate in both splits
        )
    )

    # 3. Fit scaler on training data only
    scaler = fit_scaler(X_train)
    X_train_scaled = scaler.transform(X_train)
    X_test_scaled  = scaler.transform(X_test)

    # 4a. Classifier — RandomForestClassifier
    clf = RandomForestClassifier(
        n_estimators=200,
        max_depth=12,
        min_samples_leaf=4,
        class_weight="balanced",  # handle ~32% positive rate
        random_state=random_state,
        n_jobs=-1,
    )
    clf.fit(X_train_scaled, y_cls_train)

    y_cls_pred = clf.predict(X_test_scaled)
    cls_accuracy = accuracy_score(y_cls_test, y_cls_pred)
    cls_f1       = f1_score(y_cls_test, y_cls_pred)

    # 4b. Regressor — RandomForestRegressor
    reg = RandomForestRegressor(
        n_estimators=200,
        max_depth=12,
        min_samples_leaf=4,
        random_state=random_state,
        n_jobs=-1,
    )
    reg.fit(X_train_scaled, y_reg_train)

    y_reg_pred = reg.predict(X_test_scaled)
    reg_mae    = mean_absolute_error(y_reg_test, y_reg_pred)

    # 5. Persist artefacts
    _DATA_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(clf,    CLASSIFIER_PATH)
    joblib.dump(reg,    REGRESSOR_PATH)
    joblib.dump(scaler, SCALER_PATH)

    metrics = {
        "algorithm": "scikit-learn RandomForest (XGBoost unavailable — libomp missing on macOS)",
        "classifier_accuracy": round(cls_accuracy, 4),
        "classifier_f1": round(cls_f1, 4),
        "regressor_mae": round(reg_mae, 4),
        "classifier_path": str(CLASSIFIER_PATH),
        "regressor_path": str(REGRESSOR_PATH),
        "scaler_path": str(SCALER_PATH),
    }
    return metrics


# ---------------------------------------------------------------------------
# CLI entry-point
# ---------------------------------------------------------------------------

def main() -> None:
    print("=" * 60)
    print("DockNova ML — Training congestion & wait-time models")
    print("=" * 60)

    metrics = train_models()

    print(f"\nAlgorithm : {metrics['algorithm']}")
    print(f"\n--- Classifier (congestion_label) ---")
    print(f"  Accuracy : {metrics['classifier_accuracy']}")
    print(f"  F1 Score : {metrics['classifier_f1']}")
    print(f"\n--- Regressor (wait_time_hours) ---")
    print(f"  MAE      : {metrics['regressor_mae']} hours")
    print(f"\nArtefacts saved:")
    print(f"  {metrics['classifier_path']}")
    print(f"  {metrics['regressor_path']}")
    print(f"  {metrics['scaler_path']}")
    print("=" * 60)


if __name__ == "__main__":
    main()
