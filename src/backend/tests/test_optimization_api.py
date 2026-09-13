"""
API Integration tests for DockNova Optimization Endpoints using FastAPI TestClient.

Validates:
  1. POST /api/optimization/berths -> 200 OK + camelCase OptimizationResult
  2. POST /api/optimization/cranes -> 200 OK + camelCase CraneOptimizationResult
  3. POST /api/routes/recommend    -> 200 OK + camelCase RouteRecommendation
  4. GET /api/operations/72-hour   -> 200 OK + list of OperationsPlanEntry
"""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


def test_berth_optimization_endpoint(client: TestClient) -> None:
    """Test POST /api/optimization/berths returns 200 and correctly shaped data."""
    response = client.post("/api/optimization/berths", json={})
    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    data = payload["data"]
    assert "assignments" in data
    assert "efficiencyGainPercentage" in data
    assert "estimatedWaitTimeReductionHours" in data
    assert isinstance(data["assignments"], list)


def test_crane_optimization_endpoint(client: TestClient) -> None:
    """Test POST /api/optimization/cranes returns 200 and correctly shaped data."""
    response = client.post("/api/optimization/cranes", json={"berthId": "B01"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    data = payload["data"]
    assert "assignments" in data
    assert len(data["assignments"]) > 0
    assignment = data["assignments"][0]
    assert "combinedThroughputTEUPerHour" in assignment
    assert "craneIds" in assignment


def test_route_recommendation_endpoint(client: TestClient) -> None:
    """Test POST /api/routes/recommend returns 200 and non-null bestAlternative."""
    response = client.post("/api/routes/recommend", json={"vesselId": "V001"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    data = payload["data"]
    assert "recommendation" in data
    assert "bestAlternative" in data
    assert data["bestAlternative"] is not None
    assert "portName" in data["bestAlternative"]


def test_operations_plan_endpoint(client: TestClient) -> None:
    """Test GET /api/operations/72-hour returns 200 and list of entries."""
    response = client.get("/api/operations/72-hour")
    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    data = payload["data"]
    assert isinstance(data, list)
    assert len(data) > 0
    entry = data[0]
    assert "vesselName" in entry
    assert "craneCount" in entry
    assert "serviceDurationHours" in entry
