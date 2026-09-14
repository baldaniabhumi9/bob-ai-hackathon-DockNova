"""
Tests for the ML congestion-prediction module.

Validates that:
1. predict_congestion() returns a valid CongestionForecast
2. congestion_probability is in [0, 1]
3. risk_level is one of LOW / MEDIUM / HIGH / CRITICAL
4. Repeated calls with the same input produce consistent (deterministic) output
5. hotspot is populated with real berth data
"""

from __future__ import annotations

import pytest

from app.services.ml.predict import CongestionForecast, predict_congestion


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

SAMPLE_STATE_HIGH: dict = {
    "vessel_arrivals": 8,
    "waiting_vessels": 6.5,
    "berth_utilization_pct": 72.0,
    "crane_utilization_pct": 68.0,
    "yard_occupancy_pct": 60.0,
    "avg_service_time_hours": 11.0,
    "hour_of_day": 14,
    "vessel_priority_avg": 2.3,
}

SAMPLE_STATE_LOW: dict = {
    "vessel_arrivals": 2,
    "waiting_vessels": 0.5,
    "berth_utilization_pct": 25.0,
    "crane_utilization_pct": 15.0,
    "yard_occupancy_pct": 20.0,
    "avg_service_time_hours": 6.0,
    "hour_of_day": 3,
    "vessel_priority_avg": 1.2,
}

VALID_RISK_LEVELS = {"LOW", "MEDIUM", "HIGH", "CRITICAL"}


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


class TestPredictCongestion:
    """Tests for the public predict_congestion() function."""

    def test_returns_congestion_forecast(self) -> None:
        """predict_congestion must return a CongestionForecast instance."""
        result = predict_congestion(SAMPLE_STATE_HIGH)
        assert isinstance(result, CongestionForecast)

    def test_probability_in_range(self) -> None:
        """congestion_probability must be in [0, 1]."""
        for state in (SAMPLE_STATE_HIGH, SAMPLE_STATE_LOW):
            result = predict_congestion(state)
            assert 0.0 <= result.congestion_probability <= 1.0, (
                f"probability {result.congestion_probability} out of [0, 1]"
            )

    def test_valid_risk_level(self) -> None:
        """risk_level must be one of the four defined levels."""
        for state in (SAMPLE_STATE_HIGH, SAMPLE_STATE_LOW):
            result = predict_congestion(state)
            assert result.risk_level in VALID_RISK_LEVELS, (
                f"unexpected risk_level: {result.risk_level}"
            )

    def test_wait_time_non_negative(self) -> None:
        """predicted_wait_time_hours must be >= 0."""
        result = predict_congestion(SAMPLE_STATE_HIGH)
        assert result.predicted_wait_time_hours >= 0.0

    def test_deterministic_output(self) -> None:
        """Same input must always produce the same output (no randomness)."""
        a = predict_congestion(SAMPLE_STATE_HIGH)
        b = predict_congestion(SAMPLE_STATE_HIGH)
        assert a.congestion_probability == b.congestion_probability
        assert a.predicted_wait_time_hours == b.predicted_wait_time_hours
        assert a.risk_level == b.risk_level

    def test_hotspot_populated(self) -> None:
        """hotspot should be populated with real berth data."""
        result = predict_congestion(SAMPLE_STATE_HIGH)
        assert result.hotspot is not None
        assert result.hotspot.berth_id  # non-empty
        assert result.hotspot.berth_name  # non-empty
        assert result.hotspot.predicted_utilization_pct >= 0.0

    def test_forecast_time_in_future(self) -> None:
        """forecast_time should be roughly now + 1 hour."""
        from datetime import datetime, timedelta

        result = predict_congestion(SAMPLE_STATE_HIGH)
        # Allow a generous window (±5 minutes) for clock differences
        now = datetime.utcnow()
        assert result.forecast_time > now
        assert result.forecast_time < now + timedelta(hours=2)

    def test_camel_case_serialisation(self) -> None:
        """JSON output must use camelCase keys (via CamelModel)."""
        result = predict_congestion(SAMPLE_STATE_HIGH)
        data = result.model_dump(by_alias=True)
        assert "congestionProbability" in data
        assert "predictedWaitTimeHours" in data
        assert "riskLevel" in data
        assert "forecastTime" in data
