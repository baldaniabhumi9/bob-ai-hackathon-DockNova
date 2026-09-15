"""PostgreSQL-backed reads for DockNova seed data."""

from __future__ import annotations

from typing import Callable, TypeVar

import pandas as pd
from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, is_database_configured
from app.core.db_models import (
    AlternativePortRecord,
    BerthRecord,
    CraneRecord,
    HistoricalMetricRecord,
    VesselRecord,
    VesselWorkloadRecord,
)
from app.services.optimization.models import (
    AlternativePort,
    BerthModel,
    BerthStatus,
    CraneModel,
    CraneStatus,
    Priority,
    VesselModel,
    VesselStatus,
)

T = TypeVar("T")


def is_available() -> bool:
    """Return True when DB config exists and the core tables are queryable."""
    if not is_database_configured() or SessionLocal is None:
        return False
    try:
        with SessionLocal() as db:
            db.execute(select(func.count()).select_from(VesselRecord)).scalar_one()
        return True
    except SQLAlchemyError:
        return False


def _with_session(fn: Callable[[Session], T]) -> T | None:
    if not is_database_configured() or SessionLocal is None:
        return None
    try:
        with SessionLocal() as db:
            return fn(db)
    except SQLAlchemyError:
        return None


def get_vessel_models() -> list[VesselModel] | None:
    def query(db: Session) -> list[VesselModel]:
        records = db.scalars(select(VesselRecord).order_by(VesselRecord.id)).all()
        if not records:
            return []
        return [
            VesselModel(
                id=row.id,
                name=row.name,
                imo=row.imo,
                type=row.type,
                eta=row.eta,
                etd=row.etd,
                status=VesselStatus(row.status),
                draft_meters=row.draft_meters,
                length_meters=row.length_meters,
                priority=Priority(row.priority),
                estimated_handling_hours=row.estimated_handling_hours,
            )
            for row in records
        ]

    return _with_session(query)


def get_berth_models() -> list[BerthModel] | None:
    def query(db: Session) -> list[BerthModel]:
        records = db.scalars(select(BerthRecord).order_by(BerthRecord.id)).all()
        if not records:
            return []
        return [
            BerthModel(
                id=row.id,
                name=row.name,
                code=row.code,
                max_draft_meters=row.max_draft_meters,
                max_length_meters=row.max_length_meters,
                status=BerthStatus(row.status),
                current_vessel_id=row.current_vessel_id,
                compatible_vessel_types=list(row.compatible_vessel_types),
                availability_start=row.availability_start,
                availability_end=row.availability_end,
            )
            for row in records
        ]

    return _with_session(query)


def get_crane_models() -> list[CraneModel] | None:
    def query(db: Session) -> list[CraneModel]:
        records = db.scalars(select(CraneRecord).order_by(CraneRecord.id)).all()
        if not records:
            return []
        return [
            CraneModel(
                id=row.id,
                name=row.name,
                berth_id=row.berth_id,
                status=CraneStatus(row.status),
                capacity_teu_per_hour=row.capacity_teu_per_hour,
            )
            for row in records
        ]

    return _with_session(query)


def get_vessel_workloads() -> dict[str, float] | None:
    def query(db: Session) -> dict[str, float]:
        records = db.scalars(select(VesselWorkloadRecord).order_by(VesselWorkloadRecord.vessel_id)).all()
        if not records:
            return {}
        return {row.vessel_id: row.workload_teu for row in records}

    return _with_session(query)


def get_historical_metrics() -> pd.DataFrame | None:
    def query(db: Session) -> pd.DataFrame:
        records = db.scalars(select(HistoricalMetricRecord).order_by(HistoricalMetricRecord.timestamp)).all()
        rows = [
            {
                "timestamp": row.timestamp,
                "vessel_arrivals": row.vessel_arrivals,
                "waiting_vessels": row.waiting_vessels,
                "berth_utilization_pct": row.berth_utilization_pct,
                "crane_utilization_pct": row.crane_utilization_pct,
                "yard_occupancy_pct": row.yard_occupancy_pct,
                "avg_service_time_hours": row.avg_service_time_hours,
                "hour_of_day": row.hour_of_day,
                "vessel_priority_avg": row.vessel_priority_avg,
                "congestion_label": row.congestion_label,
                "wait_time_hours": row.wait_time_hours,
            }
            for row in records
        ]
        return pd.DataFrame(rows)

    return _with_session(query)


def get_alternative_ports() -> list[AlternativePort] | None:
    def query(db: Session) -> list[AlternativePort]:
        records = db.scalars(select(AlternativePortRecord).order_by(AlternativePortRecord.port_id)).all()
        if not records:
            return []
        return [
            AlternativePort(
                port_id=row.port_id,
                port_name=row.port_name,
                congestion_level=row.congestion_level,
                predicted_wait_time_hours=row.predicted_wait_time_hours,
                travel_time_hours=row.travel_time_hours,
                travel_cost_usd=row.travel_cost_usd,
                available_berths=row.available_berths,
            )
            for row in records
        ]

    return _with_session(query)
