"""
Integration tests for DockNova Vessels, Port Status, and Congestion API endpoints.

Tests:
  1. GET  /api/vessels -> 200 OK + ApiResponseEnvelope[list[Vessel]]
  2. GET  /api/vessels?status=WAITING -> 200 OK + filtered list
  3. GET  /api/port/status -> 200 OK + PortStatus fields
  4. GET  /api/congestion/forecast -> 200 OK + 24 hourly forecast entries
  5. POST /api/congestion/predict (empty/current state) -> 200 OK + CongestionForecast
  6. POST /api/congestion/predict (vesselId) -> 200 OK + CongestionForecast
  7. POST /api/congestion/predict (invalid vesselId) -> 200 OK + success=False error
"""

from __future__ import annotations

from datetime import datetime, timedelta
import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


def test_get_vessels_endpoint(client: TestClient) -> None:
    """Test GET /api/vessels returns 200 and camelCase vessel list."""
    response = client.get("/api/vessels")
    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert isinstance(payload["data"], list)
    assert len(payload["data"]) == 40

    vessel = payload["data"][0]
    assert "draftMeters" in vessel
    assert "lengthMeters" in vessel
    assert "estimatedHandlingHours" in vessel
    assert "status" in vessel


def test_get_vessels_status_filter(client: TestClient) -> None:
    """Test GET /api/vessels with status filter."""
    response = client.get("/api/vessels?status=WAITING")
    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert len(payload["data"]) > 0
    assert all(v["status"] == "WAITING" for v in payload["data"])


def test_get_port_status_endpoint(client: TestClient) -> None:
    """Test GET /api/port/status returns 200 and required camelCase fields."""
    response = client.get("/api/port/status")
    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    data = payload["data"]
    assert "totalVessels" in data
    assert "waitingVessels" in data
    assert "availableBerths" in data
    assert "availableCranes" in data
    assert "yardOccupancyPct" in data
    assert data["totalVessels"] == 40
    assert data["waitingVessels"] > 0
    assert data["availableBerths"] > 0
    assert data["availableCranes"] > 0


def test_get_congestion_forecast_24_hours(client: TestClient) -> None:
    """Test GET /api/congestion/forecast returns 24 hourly entries."""
    response = client.get("/api/congestion/forecast")
    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    data = payload["data"]
    assert isinstance(data, list)
    assert len(data) == 24

    for entry in data:
        assert "forecastTime" in entry
        assert "congestionProbability" in entry
        assert "predictedWaitTimeHours" in entry
        assert "riskLevel" in entry
        assert entry["riskLevel"] in ("LOW", "MEDIUM", "HIGH", "CRITICAL")
        assert 0.0 <= entry["congestionProbability"] <= 1.0
        assert entry["predictedWaitTimeHours"] >= 0.0
        if entry.get("hotspot"):
            assert "berthId" in entry["hotspot"]
            assert "predictedUtilizationPct" in entry["hotspot"]


def test_post_congestion_predict_current_state(client: TestClient) -> None:
    """Test POST /api/congestion/predict without vesselId evaluates current snapshot."""
    response = client.post("/api/congestion/predict", json={})
    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    data = payload["data"]
    assert "congestionProbability" in data
    assert "predictedWaitTimeHours" in data
    assert "riskLevel" in data

    forecast_dt = datetime.fromisoformat(data["forecastTime"])
    now = datetime.utcnow()
    assert now - timedelta(hours=1) <= forecast_dt <= now + timedelta(hours=48)


def test_post_congestion_predict_with_vessel(client: TestClient) -> None:
    """Test POST /api/congestion/predict with existing vesselId."""
    response = client.post("/api/congestion/predict", json={"vesselId": "V001"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    data = payload["data"]
    assert "congestionProbability" in data
    assert "predictedWaitTimeHours" in data
    assert "riskLevel" in data

    # Assert forecastTime is fresh near 'now', never a stale historical date (like synthetic ETA 2025-07-15)
    forecast_dt = datetime.fromisoformat(data["forecastTime"])
    now = datetime.utcnow()
    assert now - timedelta(hours=1) <= forecast_dt <= now + timedelta(hours=48)


def test_post_congestion_predict_invalid_vessel(client: TestClient) -> None:
    """Test POST /api/congestion/predict with non-existent vesselId returns error envelope."""
    response = client.post("/api/congestion/predict", json={"vesselId": "V999"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is False
    assert payload["data"] is None
    assert payload["error"] is not None
    assert payload["error"]["code"] == "VESSEL_NOT_FOUND"
