"""SQLAlchemy table models for DockNova operational data."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class VesselRecord(Base):
    __tablename__ = "vessels"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    imo: Mapped[str] = mapped_column(String(32), nullable=False, unique=True)
    type: Mapped[str] = mapped_column(String(48), nullable=False)
    eta: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    etd: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False)
    draft_meters: Mapped[float] = mapped_column(Float, nullable=False)
    length_meters: Mapped[float] = mapped_column(Float, nullable=False)
    priority: Mapped[str] = mapped_column(String(32), nullable=False)
    estimated_handling_hours: Mapped[float] = mapped_column(Float, nullable=False)


class BerthRecord(Base):
    __tablename__ = "berths"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    code: Mapped[str] = mapped_column(String(32), nullable=False, unique=True)
    max_draft_meters: Mapped[float] = mapped_column(Float, nullable=False)
    max_length_meters: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False)
    current_vessel_id: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    compatible_vessel_types: Mapped[list[str]] = mapped_column(JSONB, nullable=False)
    availability_start: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    availability_end: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class CraneRecord(Base):
    __tablename__ = "cranes"

    id: Mapped[str] = mapped_column(String(32), primary_key=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    berth_id: Mapped[str] = mapped_column(String(32), ForeignKey("berths.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False)
    capacity_teu_per_hour: Mapped[float] = mapped_column(Float, nullable=False)


class VesselWorkloadRecord(Base):
    __tablename__ = "vessel_workloads"

    vessel_id: Mapped[str] = mapped_column(String(32), ForeignKey("vessels.id"), primary_key=True)
    workload_teu: Mapped[float] = mapped_column(Float, nullable=False)


class HistoricalMetricRecord(Base):
    __tablename__ = "historical_metrics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    vessel_arrivals: Mapped[float] = mapped_column(Float, nullable=False)
    waiting_vessels: Mapped[float] = mapped_column(Float, nullable=False)
    berth_utilization_pct: Mapped[float] = mapped_column(Float, nullable=False)
    crane_utilization_pct: Mapped[float] = mapped_column(Float, nullable=False)
    yard_occupancy_pct: Mapped[float] = mapped_column(Float, nullable=False)
    avg_service_time_hours: Mapped[float] = mapped_column(Float, nullable=False)
    hour_of_day: Mapped[int] = mapped_column(Integer, nullable=False)
    vessel_priority_avg: Mapped[float] = mapped_column(Float, nullable=False)
    congestion_label: Mapped[int] = mapped_column(Integer, nullable=False)
    wait_time_hours: Mapped[float] = mapped_column(Float, nullable=False)


class AlternativePortRecord(Base):
    __tablename__ = "alternative_ports"

    port_id: Mapped[str] = mapped_column(String(32), primary_key=True)
    port_name: Mapped[str] = mapped_column(String(160), nullable=False)
    congestion_level: Mapped[str] = mapped_column(String(32), nullable=False)
    predicted_wait_time_hours: Mapped[float] = mapped_column(Float, nullable=False)
    travel_time_hours: Mapped[float] = mapped_column(Float, nullable=False)
    travel_cost_usd: Mapped[float] = mapped_column(Float, nullable=False)
    available_berths: Mapped[int] = mapped_column(Integer, nullable=False)
