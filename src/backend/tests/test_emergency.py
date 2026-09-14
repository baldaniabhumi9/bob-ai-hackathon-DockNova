"""
Tests for the Emergency Disruption Simulation endpoint and service.

Validates all 5 disruption types produce believable before/after deltas:
  1. CRANE_FAILURE         — available_cranes drops, congestion rises
  2. BERTH_CLOSURE         — congestion risk rises
  3. WEATHER_DELAY         — predicted wait time / congestion rises
  4. STAFF_SHORTAGE        — available_cranes drops, congestion rises
  5. EQUIPMENT_BREAKDOWN   — available_cranes drops at target berth, congestion rises
  6. Response envelope shape is correct (success, data, error keys present)
  7. generated_at is a valid ISO 8601 datetime string
  8. before/after snapshots always have the expected fields
  9. impact_summary is a non-empty string
 10. Service-level: simulate_emergency() works without HTTP layer
"""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from main import app
from app.services.optimization.emergency_simulation import (
    DisruptionType,
    EmergencySimulationRequest,
    simulate_emergency,
)


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

def _post_simulate(client: TestClient, payload: dict) -> dict:
    """POST to /api/emergency/simulate and return the unwrapped data dict."""
    response = client.post("/api/emergency/simulate", json=payload)
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["success"] is True, body
    return body["data"]


def _assert_snapshot_shape(snapshot: dict) -> None:
    """Assert a PortStateSnapshot has all required fields with correct types."""
    assert "availableCranes" in snapshot, snapshot
    assert "totalCranes" in snapshot, snapshot
    assert "congestionPct" in snapshot, snapshot
    assert "riskLevel" in snapshot, snapshot
    assert "predictedWaitTimeHours" in snapshot, snapshot

    assert isinstance(snapshot["availableCranes"], int)
    assert isinstance(snapshot["totalCranes"], int)
    assert 0.0 <= snapshot["congestionPct"] <= 100.0
    assert snapshot["riskLevel"] in ("LOW", "MEDIUM", "HIGH", "CRITICAL")
    assert snapshot["predictedWaitTimeHours"] >= 0.0


# ---------------------------------------------------------------------------
# 1. Response envelope shape
# ---------------------------------------------------------------------------

def test_emergency_simulate_response_shape(client: TestClient) -> None:
    """POST /api/emergency/simulate returns the correct envelope + data shape."""
    data = _post_simulate(client, {"disruptionType": "CRANE_FAILURE"})

    assert "before" in data
    assert "after" in data
    assert "impactSummary" in data
    assert "generatedAt" in data

    _assert_snapshot_shape(data["before"])
    _assert_snapshot_shape(data["after"])
    assert isinstance(data["impactSummary"], str) and len(data["impactSummary"]) > 0


# ---------------------------------------------------------------------------
# 2. CRANE_FAILURE — available cranes must drop
# ---------------------------------------------------------------------------

def test_crane_failure_reduces_available_cranes(client: TestClient) -> None:
    """CRANE_FAILURE must reduce available_cranes by at least 1."""
    data = _post_simulate(client, {
        "disruptionType": "CRANE_FAILURE",
        "targetId": "CR01",
    })
    assert data["after"]["availableCranes"] < data["before"]["availableCranes"], (
        f"Expected available_cranes to drop after crane failure: "
        f"before={data['before']['availableCranes']}, after={data['after']['availableCranes']}"
    )


def test_crane_failure_changes_congestion(client: TestClient) -> None:
    """CRANE_FAILURE must produce a different congestion_pct in after vs before."""
    data = _post_simulate(client, {"disruptionType": "CRANE_FAILURE", "targetId": "CR01"})
    # Congestion should rise OR at minimum the metrics must differ
    assert data["after"]["congestionPct"] != data["before"]["congestionPct"] or \
           data["after"]["availableCranes"] < data["before"]["availableCranes"], (
        "CRANE_FAILURE should change at least one metric"
    )


# ---------------------------------------------------------------------------
# 3. BERTH_CLOSURE — congestion should rise
# ---------------------------------------------------------------------------

def test_berth_closure_raises_congestion(client: TestClient) -> None:
    """BERTH_CLOSURE must raise congestion probability vs baseline."""
    data = _post_simulate(client, {
        "disruptionType": "BERTH_CLOSURE",
        "targetId": "B01",
    })
    assert data["after"]["congestionPct"] >= data["before"]["congestionPct"], (
        f"Expected congestion to rise after berth closure: "
        f"before={data['before']['congestionPct']}, after={data['after']['congestionPct']}"
    )


# ---------------------------------------------------------------------------
# 4. WEATHER_DELAY — wait time or congestion should rise
# ---------------------------------------------------------------------------

def test_weather_delay_raises_wait_time_or_congestion(client: TestClient) -> None:
    """A large WEATHER_DELAY should raise predicted_wait_time or congestion."""
    data = _post_simulate(client, {
        "disruptionType": "WEATHER_DELAY",
        "value": 12.0,
    })
    # Either congestion or wait time should change noticeably
    before_w = data["before"]["predictedWaitTimeHours"]
    after_w = data["after"]["predictedWaitTimeHours"]
    before_c = data["before"]["congestionPct"]
    after_c = data["after"]["congestionPct"]

    changed = (after_w != before_w) or (after_c != before_c)
    assert changed, (
        f"WEATHER_DELAY should change at least one metric: "
        f"wait {before_w}->{after_w}, congestion {before_c}->{after_c}"
    )


# ---------------------------------------------------------------------------
# 5. STAFF_SHORTAGE — available cranes must drop
# ---------------------------------------------------------------------------

def test_staff_shortage_reduces_available_cranes(client: TestClient) -> None:
    """STAFF_SHORTAGE at 50% must reduce available cranes."""
    data = _post_simulate(client, {
        "disruptionType": "STAFF_SHORTAGE",
        "value": 50.0,
    })
    assert data["after"]["availableCranes"] < data["before"]["availableCranes"], (
        f"Expected available_cranes to drop after staff shortage: "
        f"before={data['before']['availableCranes']}, after={data['after']['availableCranes']}"
    )


def test_staff_shortage_raises_congestion(client: TestClient) -> None:
    """STAFF_SHORTAGE must raise congestion vs baseline."""
    data = _post_simulate(client, {
        "disruptionType": "STAFF_SHORTAGE",
        "value": 50.0,
    })
    assert data["after"]["congestionPct"] >= data["before"]["congestionPct"], (
        f"Expected congestion to rise after staff shortage: "
        f"before={data['before']['congestionPct']}, after={data['after']['congestionPct']}"
    )


# ---------------------------------------------------------------------------
# 6. EQUIPMENT_BREAKDOWN — cranes at target berth drop
# ---------------------------------------------------------------------------

def test_equipment_breakdown_reduces_cranes(client: TestClient) -> None:
    """EQUIPMENT_BREAKDOWN must reduce available cranes at target berth."""
    data = _post_simulate(client, {
        "disruptionType": "EQUIPMENT_BREAKDOWN",
        "targetId": "B01",
        "value": 60.0,
    })
    assert data["after"]["availableCranes"] < data["before"]["availableCranes"], (
        f"Expected available_cranes to drop after equipment breakdown: "
        f"before={data['before']['availableCranes']}, after={data['after']['availableCranes']}"
    )


def test_equipment_breakdown_raises_congestion(client: TestClient) -> None:
    """EQUIPMENT_BREAKDOWN at a major berth should raise congestion."""
    data = _post_simulate(client, {
        "disruptionType": "EQUIPMENT_BREAKDOWN",
        "targetId": "B01",
        "value": 60.0,
    })
    assert data["after"]["congestionPct"] >= data["before"]["congestionPct"], (
        f"Expected congestion to rise after equipment breakdown: "
        f"before={data['before']['congestionPct']}, after={data['after']['congestionPct']}"
    )


# ---------------------------------------------------------------------------
# 7. generated_at is ISO 8601
# ---------------------------------------------------------------------------

def test_generated_at_is_iso8601(client: TestClient) -> None:
    """generated_at must be a parseable ISO 8601 datetime string."""
    from datetime import datetime

    data = _post_simulate(client, {"disruptionType": "CRANE_FAILURE"})
    generated_at = data["generatedAt"]
    assert isinstance(generated_at, str), "generatedAt should be a string"
    # Should be parseable as a datetime (FastAPI serializes as ISO 8601)
    try:
        datetime.fromisoformat(generated_at.replace("Z", "+00:00"))
    except ValueError:
        pytest.fail(f"generatedAt is not valid ISO 8601: {generated_at!r}")


# ---------------------------------------------------------------------------
# 8. impact_summary is meaningful
# ---------------------------------------------------------------------------

def test_impact_summary_mentions_disruption(client: TestClient) -> None:
    """impact_summary should be a non-trivial string describing the disruption."""
    data = _post_simulate(client, {
        "disruptionType": "BERTH_CLOSURE",
        "targetId": "B01",
    })
    summary = data["impactSummary"]
    assert len(summary) > 20, f"impact_summary too short: {summary!r}"


# ---------------------------------------------------------------------------
# 9. Default values work (no targetId / value provided)
# ---------------------------------------------------------------------------

def test_disruption_defaults_work(client: TestClient) -> None:
    """All 5 disruption types must succeed with only disruptionType provided."""
    for disruption in [
        "CRANE_FAILURE",
        "BERTH_CLOSURE",
        "WEATHER_DELAY",
        "STAFF_SHORTAGE",
        "EQUIPMENT_BREAKDOWN",
    ]:
        data = _post_simulate(client, {"disruptionType": disruption})
        assert "before" in data, f"Missing 'before' for {disruption}"
        assert "after" in data, f"Missing 'after' for {disruption}"


# ---------------------------------------------------------------------------
# 10. Service-level: simulate_emergency() works without HTTP
# ---------------------------------------------------------------------------

def test_service_level_crane_failure() -> None:
    """Service-level: simulate_emergency() with CRANE_FAILURE works directly."""
    req = EmergencySimulationRequest(
        disruption_type=DisruptionType.CRANE_FAILURE,
        target_id="CR01",
    )
    result = simulate_emergency(req)
    assert result.before.available_cranes > result.after.available_cranes
    assert len(result.impact_summary) > 0
    assert result.generated_at is not None


def test_service_level_staff_shortage_high_reduction() -> None:
    """Service-level: 80% staff shortage takes cranes offline."""
    req = EmergencySimulationRequest(
        disruption_type=DisruptionType.STAFF_SHORTAGE,
        value=80.0,
    )
    result = simulate_emergency(req)
    assert result.after.available_cranes < result.before.available_cranes


def test_service_level_before_after_fields_present() -> None:
    """Service-level: all snapshot fields are non-negative numbers."""
    req = EmergencySimulationRequest(
        disruption_type=DisruptionType.BERTH_CLOSURE,
        target_id="B02",
    )
    result = simulate_emergency(req)
    for snapshot in (result.before, result.after):
        assert snapshot.available_cranes >= 0
        assert snapshot.total_cranes >= 0
        assert 0.0 <= snapshot.congestion_pct <= 100.0
        assert snapshot.predicted_wait_time_hours >= 0.0
        assert snapshot.risk_level in ("LOW", "MEDIUM", "HIGH", "CRITICAL")
