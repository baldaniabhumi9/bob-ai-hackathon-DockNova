"""Single source of seed data used by the existing DockNova services."""

from __future__ import annotations

from datetime import datetime, timedelta

import pandas as pd

from app.services.optimization import mock_data
from app.services.optimization.models import BerthModel, CraneModel, VesselModel, VesselStatus

REFERENCE_TIME = datetime.utcnow().replace(minute=0, second=0, microsecond=0)
CURRENT_PORT_NAME = mock_data.CURRENT_PORT_NAME
CURRENT_PORT_CONGESTION = mock_data.CURRENT_PORT_CONGESTION
CURRENT_PORT_WAIT_TIME_HOURS = mock_data.CURRENT_PORT_WAIT_TIME_HOURS


def _postgres():
    try:
        from app.data import postgres_repository
    except ImportError:
        return None
    return postgres_repository if postgres_repository.is_available() else None


def _seed_vessel_models(reference_time: datetime | None = None) -> list[VesselModel]:
    reference = reference_time or REFERENCE_TIME
    seed_vessels = mock_data.get_sample_vessels(reference)
    vessels = list(seed_vessels)
    for index in range(32):
        template = seed_vessels[index % len(seed_vessels)]
        eta = reference + timedelta(hours=12 + index * 2)
        vessels.append(template.model_copy(update={
            "id": f"V{index + 9:03d}",
            "name": f"{template.name} {index + 1:02d}",
            "imo": str(9700000 + index),
            "eta": eta,
            "etd": eta + timedelta(hours=template.estimated_handling_hours + 2),
            "status": VesselStatus.SCHEDULED,
        }))
    return vessels


def get_vessel_models(reference_time: datetime | None = None) -> list[VesselModel]:
    if reference_time is None:
        repo = _postgres()
        if repo:
            vessels = repo.get_vessel_models()
            if vessels:
                return vessels
    return _seed_vessel_models(reference_time)


def _seed_berth_models(reference_time: datetime | None = None) -> list[BerthModel]:
    return mock_data.get_sample_berths(reference_time or REFERENCE_TIME)


def get_berth_models(reference_time: datetime | None = None) -> list[BerthModel]:
    if reference_time is None:
        repo = _postgres()
        if repo:
            berths = repo.get_berth_models()
            if berths:
                return berths
    return _seed_berth_models(reference_time)


def _seed_crane_models() -> list[CraneModel]:
    return mock_data.get_sample_cranes()


def get_crane_models() -> list[CraneModel]:
    repo = _postgres()
    if repo:
        cranes = repo.get_crane_models()
        if cranes:
            return cranes
    return _seed_crane_models()


def _seed_vessel_workloads() -> dict[str, float]:
    workloads = dict(mock_data.VESSEL_WORKLOADS_TEU)
    for index in range(32):
        template_id = f"V{index % 8 + 1:03d}"
        workloads[f"V{index + 9:03d}"] = workloads[template_id]
    return workloads


def get_vessel_workloads() -> dict[str, float]:
    repo = _postgres()
    if repo:
        workloads = repo.get_vessel_workloads()
        if workloads:
            return workloads
    return _seed_vessel_workloads()


def _seed_alternative_ports():
    return mock_data.get_alternative_ports()


def get_alternative_ports():
    repo = _postgres()
    if repo:
        ports = repo.get_alternative_ports()
        if ports:
            return ports
    return _seed_alternative_ports()


def get_berths() -> list[dict]:
    return [berth.model_dump(mode="json", by_alias=False) for berth in get_berth_models()]


def _seed_historical_metrics() -> pd.DataFrame:
    """Return a deterministic profile derived from the seed scenario."""
    rows: list[dict] = []
    for hour in range(24):
        arrivals = 1.0 + (hour % 6) * 0.35
        waiting = 1.0 + (hour % 5) * 0.6
        berth_utilization = min(92.0, 35.0 + waiting * 8.0)
        crane_utilization = min(90.0, 30.0 + waiting * 7.0)
        yard_occupancy = min(88.0, 58.0 + hour * 0.4)
        service_time = 8.0 + waiting * 0.8
        priority = 1.5 + (hour % 3) * 0.25
        rows.append({
            "timestamp": REFERENCE_TIME.replace(hour=hour),
            "vessel_arrivals": arrivals,
            "waiting_vessels": waiting,
            "berth_utilization_pct": berth_utilization,
            "crane_utilization_pct": crane_utilization,
            "yard_occupancy_pct": yard_occupancy,
            "avg_service_time_hours": service_time,
            "hour_of_day": hour,
            "vessel_priority_avg": priority,
            "congestion_label": int(berth_utilization >= 65.0),
            "wait_time_hours": max(0.0, waiting * 1.5),
        })
    return pd.DataFrame(rows)


def get_historical_metrics() -> pd.DataFrame:
    repo = _postgres()
    if repo:
        metrics = repo.get_historical_metrics()
        if metrics is not None and not metrics.empty:
            return metrics
    return _seed_historical_metrics()
