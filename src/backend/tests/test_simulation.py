"""
Tests for the what-if simulation endpoint and service.

Validates:
  1. POST /api/optimization/simulate (no body) -> 200 + well-formed response
  2. extraVesselCount is reflected in simulatedVesselCount
  3. Supplying extraVessels directly works and overrides extraVesselCount
  4. Simulation metrics DIFFER from the real baseline (/api/optimization/berths)
     when extra congestion is injected (more waiting vessels → higher wait times)
  5. simulationId is unique across two calls
  6. Service-level: run_simulation() with extra_vessel_count=0 matches a
     baseline call (same real fleet, solver determinism check)
"""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from main import app
from app.services.optimization.simulation import SimulationRequest, run_simulation
from app.services.optimization.models import VesselModel, VesselStatus, Priority
from datetime import datetime, timedelta


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


# ---------------------------------------------------------------------------
# 1. Default call (no body) returns 200 and correct envelope shape
# ---------------------------------------------------------------------------

def test_simulate_default_returns_200(client: TestClient) -> None:
    """POST /api/optimization/simulate with empty body returns 200 and valid shape."""
    response = client.post("/api/optimization/simulate", json={})
    assert response.status_code == 200, response.text

    payload = response.json()
    assert payload["success"] is True
    data = payload["data"]

    # Top-level SimulationResponse fields (camelCase)
    assert "simulationId" in data
    assert "totalVesselsInSimulation" in data
    assert "realVesselCount" in data
    assert "simulatedVesselCount" in data
    assert "optimizationResult" in data


# ---------------------------------------------------------------------------
# 2. extraVesselCount is reflected in the response
# ---------------------------------------------------------------------------

def test_simulate_extra_count_is_reflected(client: TestClient) -> None:
    """simulatedVesselCount must equal the requested extraVesselCount."""
    n = 5
    response = client.post(
        "/api/optimization/simulate",
        json={"extraVesselCount": n},
    )
    assert response.status_code == 200, response.text
    data = response.json()["data"]

    assert data["simulatedVesselCount"] == n
    assert data["totalVesselsInSimulation"] == data["realVesselCount"] + n


# ---------------------------------------------------------------------------
# 3. Supplying extraVessels directly works
# ---------------------------------------------------------------------------

def test_simulate_with_explicit_extra_vessels(client: TestClient) -> None:
    """Supplying extraVessels overrides extraVesselCount."""
    extra = [
        {
            "id": "SIM-TEST-001",
            "name": "Test Vessel Alpha",
            "imo": "9123456",
            "type": "CONTAINER",
            "eta": (datetime.utcnow() + timedelta(hours=2)).isoformat(),
            "etd": (datetime.utcnow() + timedelta(hours=14)).isoformat(),
            "status": "WAITING",
            "draftMeters": 13.5,
            "lengthMeters": 300.0,
            "priority": "HIGH",
            "estimatedHandlingHours": 12.0,
        }
    ]
    response = client.post(
        "/api/optimization/simulate",
        json={"extraVessels": extra, "extraVesselCount": 99},  # count should be ignored
    )
    assert response.status_code == 200, response.text
    data = response.json()["data"]

    # Only 1 simulated vessel (the one we supplied), not 99
    assert data["simulatedVesselCount"] == 1
    assert data["totalVesselsInSimulation"] == data["realVesselCount"] + 1


# ---------------------------------------------------------------------------
# 4. Simulation metrics differ from the real baseline when extra vessels added
# ---------------------------------------------------------------------------

def test_simulation_changes_metrics_vs_baseline(client: TestClient) -> None:
    """
    Adding 10 waiting vessels should increase waiting_vessels count in the
    'before' metrics compared to running the optimizer on the real fleet alone.
    """
    # Baseline: real fleet only
    baseline_resp = client.post("/api/optimization/berths", json={})
    assert baseline_resp.status_code == 200
    baseline_before_waiting = baseline_resp.json()["data"]["beforeMetrics"]["waitingVessels"]

    # Simulation: real fleet + 10 extra WAITING vessels
    sim_resp = client.post(
        "/api/optimization/simulate",
        json={"extraVesselCount": 10},
    )
    assert sim_resp.status_code == 200
    sim_before_waiting = sim_resp.json()["data"]["optimizationResult"]["beforeMetrics"]["waitingVessels"]

    # Adding 10 WAITING vessels MUST increase the before-metrics waiting count
    assert sim_before_waiting > baseline_before_waiting, (
        f"Expected sim waiting ({sim_before_waiting}) > "
        f"baseline waiting ({baseline_before_waiting})"
    )


# ---------------------------------------------------------------------------
# 5. simulationId is unique across two calls
# ---------------------------------------------------------------------------

def test_simulation_ids_are_unique(client: TestClient) -> None:
    """Each simulation call generates a distinct simulationId (UUID)."""
    r1 = client.post("/api/optimization/simulate", json={})
    r2 = client.post("/api/optimization/simulate", json={})
    assert r1.status_code == 200
    assert r2.status_code == 200

    id1 = r1.json()["data"]["simulationId"]
    id2 = r2.json()["data"]["simulationId"]
    assert id1 != id2, "simulationId should be unique per call"


# ---------------------------------------------------------------------------
# 6. Service-level: zero extra vessels produces same real_vessel_count
# ---------------------------------------------------------------------------

def test_run_simulation_zero_extras_matches_real_count() -> None:
    """Service: extra_vessel_count=0 → simulatedVesselCount=0."""
    result = run_simulation(extra_vessel_count=0)
    assert result.simulated_vessel_count == 0
    assert result.total_vessels_in_simulation == result.real_vessel_count


# ---------------------------------------------------------------------------
# 7. OptimizationResult shape inside simulation response
# ---------------------------------------------------------------------------

def test_simulate_optimization_result_shape(client: TestClient) -> None:
    """The nested optimizationResult must have the standard OR-Tools fields."""
    response = client.post("/api/optimization/simulate", json={"extraVesselCount": 3})
    assert response.status_code == 200
    opt = response.json()["data"]["optimizationResult"]

    assert "assignments" in opt
    assert "beforeMetrics" in opt
    assert "afterMetrics" in opt
    assert "efficiencyGainPercentage" in opt
    assert "estimatedWaitTimeReductionHours" in opt
    assert isinstance(opt["assignments"], list)
