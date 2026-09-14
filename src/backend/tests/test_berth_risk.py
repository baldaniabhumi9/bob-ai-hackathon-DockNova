"""
Tests for the per-berth risk scoring service and endpoint.

Validates:
  1. All berths receive a risk score
  2. Scores are not all identical (variance exists across the 8 berths)
  3. Risk level thresholds are applied correctly (NORMAL/WARNING/CRITICAL)
  4. Score is bounded [0, 100]
  5. camelCase serialisation of BerthRisk model
  6. GET /api/port/berth-risk returns 200 with expected shape
  7. Service-level: get_per_berth_risk() works without HTTP layer
  8. A fully-OCCUPIED + HIGH-priority + all-cranes-down berth hits CRITICAL
  9. A fully-AVAILABLE + no-vessel + all-cranes-operational berth hits NORMAL
 10. Threshold boundary: score exactly at 75 → CRITICAL, at 50 → WARNING
"""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from main import app
from app.services.optimization.berth_risk import (
    OCCUPANCY_WEIGHT_MAX,
    PRIORITY_WEIGHT_MAX,
    CRANE_PRESSURE_MAX,
    BerthRisk,
    get_per_berth_risk,
    _score_to_level,
)
from app.services.optimization.models import (
    BerthModel,
    BerthStatus,
    CraneModel,
    CraneStatus,
    Priority,
    VesselModel,
    VesselStatus,
)
from app.data.loader import get_berth_models, get_crane_models, get_vessel_models


@pytest.fixture(scope="module")
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture(scope="module")
def berth_risks() -> list[BerthRisk]:
    """Compute per-berth risks once at module scope for efficiency."""
    berths = get_berth_models()
    cranes = get_crane_models()
    vessels = get_vessel_models()
    return get_per_berth_risk(berths, cranes, vessels)


# ---------------------------------------------------------------------------
# 1. All berths receive a risk score
# ---------------------------------------------------------------------------

def test_all_berths_have_risk_score(berth_risks):
    berths = get_berth_models()
    assert len(berth_risks) == len(berths), (
        f"Expected {len(berths)} BerthRisk entries, got {len(berth_risks)}"
    )
    for risk in berth_risks:
        assert risk.berth_id, "berth_id must be non-empty"
        assert risk.berth_name, "berth_name must be non-empty"


# ---------------------------------------------------------------------------
# 2. Scores are not all identical
# ---------------------------------------------------------------------------

def test_scores_vary_across_berths(berth_risks):
    scores = [r.risk_score for r in berth_risks]
    unique_scores = set(scores)
    assert len(unique_scores) > 1, (
        f"All berths have the same risk score ({scores[0]}); "
        "scores must vary based on berth state."
    )


# ---------------------------------------------------------------------------
# 3. Risk level thresholds applied correctly
# ---------------------------------------------------------------------------

def test_risk_level_thresholds(berth_risks):
    for risk in berth_risks:
        score = risk.risk_score
        if score >= 75.0:
            assert risk.risk_level == "CRITICAL", (
                f"Berth {risk.berth_id}: score={score} → expected CRITICAL, got {risk.risk_level}"
            )
        elif score >= 50.0:
            assert risk.risk_level == "WARNING", (
                f"Berth {risk.berth_id}: score={score} → expected WARNING, got {risk.risk_level}"
            )
        else:
            assert risk.risk_level == "NORMAL", (
                f"Berth {risk.berth_id}: score={score} → expected NORMAL, got {risk.risk_level}"
            )


# ---------------------------------------------------------------------------
# 4. Scores bounded [0, 100]
# ---------------------------------------------------------------------------

def test_scores_bounded(berth_risks):
    for risk in berth_risks:
        assert 0.0 <= risk.risk_score <= 100.0, (
            f"Berth {risk.berth_id}: score {risk.risk_score} out of [0, 100]"
        )


# ---------------------------------------------------------------------------
# 5. camelCase serialisation of BerthRisk model
# ---------------------------------------------------------------------------

def test_camel_case_serialisation(berth_risks):
    payload = berth_risks[0].model_dump(by_alias=True)
    assert "berthId" in payload, f"Expected 'berthId' key, got keys: {list(payload.keys())}"
    assert "berthName" in payload
    assert "riskScore" in payload
    assert "riskLevel" in payload
    assert "utilizationPct" in payload
    assert "occupancyStatus" in payload
    assert "totalCranes" in payload
    assert "operationalCranes" in payload


# ---------------------------------------------------------------------------
# 6. HTTP endpoint: GET /api/port/berth-risk
# ---------------------------------------------------------------------------

def test_berth_risk_endpoint_returns_200(client):
    resp = client.get("/api/port/berth-risk")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}: {resp.text}"


def test_berth_risk_endpoint_envelope_shape(client):
    data = client.get("/api/port/berth-risk").json()
    assert data["success"] is True
    assert isinstance(data["data"], list)
    assert len(data["data"]) > 0


def test_berth_risk_endpoint_all_berths_present(client):
    berths = get_berth_models()
    data = client.get("/api/port/berth-risk").json()
    returned_ids = {entry["berthId"] for entry in data["data"]}
    expected_ids = {b.id for b in berths}
    assert returned_ids == expected_ids, (
        f"Endpoint missing berths: {expected_ids - returned_ids}"
    )


def test_berth_risk_endpoint_fields(client):
    data = client.get("/api/port/berth-risk").json()
    entry = data["data"][0]
    required_keys = {
        "berthId", "berthName", "riskScore", "riskLevel",
        "utilizationPct", "occupancyStatus", "totalCranes", "operationalCranes",
    }
    missing = required_keys - set(entry.keys())
    assert not missing, f"Missing keys in response: {missing}"


# ---------------------------------------------------------------------------
# 7. Service-level: works without HTTP layer
# ---------------------------------------------------------------------------

def test_service_level_returns_list():
    berths = get_berth_models()
    cranes = get_crane_models()
    vessels = get_vessel_models()
    risks = get_per_berth_risk(berths, cranes, vessels)
    assert isinstance(risks, list)
    assert all(isinstance(r, BerthRisk) for r in risks)


# ---------------------------------------------------------------------------
# 8. Fully OCCUPIED + HIGH-priority + all-cranes-down → CRITICAL
# ---------------------------------------------------------------------------

def test_worst_case_is_critical():
    """
    OCCUPIED(40) + HIGH(35) + all-cranes-down(25) = 100 → CRITICAL
    """
    berth = BerthModel(
        id="TEST-B01",
        name="Test Critical Berth",
        code="TB-1",
        max_draft_meters=18.0,
        max_length_meters=420.0,
        status=BerthStatus.OCCUPIED,
        current_vessel_id="TEST-V01",
        compatible_vessel_types=["CONTAINER"],
    )
    crane = CraneModel(
        id="TEST-CR01",
        name="Test Crane (down)",
        berth_id="TEST-B01",
        status=CraneStatus.MAINTENANCE,
        capacity_teu_per_hour=30,
    )
    vessel = VesselModel(
        id="TEST-V01",
        name="Critical Test Vessel",
        imo="9999999",
        type="CONTAINER",
        eta="2025-07-15T06:00:00",
        etd="2025-07-16T00:00:00",
        status=VesselStatus.HANDLING,
        draft_meters=14.0,
        length_meters=300.0,
        priority=Priority.HIGH,
        estimated_handling_hours=16.0,
    )

    risks = get_per_berth_risk([berth], [crane], [vessel])
    assert len(risks) == 1
    r = risks[0]
    # Max score = 40 + 35 + 25 = 100
    assert r.risk_score == pytest.approx(100.0, abs=0.1)
    assert r.risk_level == "CRITICAL"


# ---------------------------------------------------------------------------
# 9. AVAILABLE + no vessel + all-cranes-operational → NORMAL
# ---------------------------------------------------------------------------

def test_best_case_is_normal():
    """
    AVAILABLE(0) + no vessel(0) + all-cranes-up(0) = 0 → NORMAL
    """
    berth = BerthModel(
        id="TEST-B02",
        name="Test Normal Berth",
        code="TB-2",
        max_draft_meters=18.0,
        max_length_meters=420.0,
        status=BerthStatus.AVAILABLE,
        compatible_vessel_types=["CONTAINER"],
    )
    crane = CraneModel(
        id="TEST-CR02",
        name="Test Crane (operational)",
        berth_id="TEST-B02",
        status=CraneStatus.OPERATIONAL,
        capacity_teu_per_hour=30,
    )

    risks = get_per_berth_risk([berth], [crane], [])
    assert len(risks) == 1
    r = risks[0]
    assert r.risk_score == pytest.approx(0.0, abs=0.1)
    assert r.risk_level == "NORMAL"


# ---------------------------------------------------------------------------
# 10. Threshold boundary conditions
# ---------------------------------------------------------------------------

def test_threshold_boundary_exactly_75_is_critical():
    assert _score_to_level(75.0) == "CRITICAL"


def test_threshold_boundary_exactly_50_is_warning():
    assert _score_to_level(50.0) == "WARNING"


def test_threshold_boundary_just_below_50_is_normal():
    assert _score_to_level(49.99) == "NORMAL"


def test_threshold_boundary_just_below_75_is_warning():
    assert _score_to_level(74.99) == "WARNING"


def test_threshold_boundary_zero_is_normal():
    assert _score_to_level(0.0) == "NORMAL"


def test_threshold_boundary_100_is_critical():
    assert _score_to_level(100.0) == "CRITICAL"
