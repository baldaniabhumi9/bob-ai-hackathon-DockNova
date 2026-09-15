"""Seed PostgreSQL with DockNova demo data without duplicating records."""

from __future__ import annotations

from sqlalchemy import select

from app.core.database import SessionLocal, is_database_configured
from app.core.db_models import (
    AlternativePortRecord,
    BerthRecord,
    CraneRecord,
    HistoricalMetricRecord,
    VesselRecord,
    VesselWorkloadRecord,
)
from app.data import loader


def seed_database() -> dict[str, int]:
    """Upsert deterministic DockNova seed records into PostgreSQL."""
    if not is_database_configured() or SessionLocal is None:
        raise RuntimeError("DATABASE_URL is not configured. Set it before seeding.")

    counts = {
        "vessels": 0,
        "berths": 0,
        "cranes": 0,
        "vessel_workloads": 0,
        "historical_metrics": 0,
        "alternative_ports": 0,
    }

    with SessionLocal() as db:
        for vessel in loader._seed_vessel_models():
            db.merge(VesselRecord(
                id=vessel.id,
                name=vessel.name,
                imo=vessel.imo,
                type=vessel.type,
                eta=vessel.eta,
                etd=vessel.etd,
                status=vessel.status.value,
                draft_meters=vessel.draft_meters,
                length_meters=vessel.length_meters,
                priority=vessel.priority.value,
                estimated_handling_hours=vessel.estimated_handling_hours,
            ))
            counts["vessels"] += 1

        for berth in loader._seed_berth_models():
            db.merge(BerthRecord(
                id=berth.id,
                name=berth.name,
                code=berth.code,
                max_draft_meters=berth.max_draft_meters,
                max_length_meters=berth.max_length_meters,
                status=berth.status.value,
                current_vessel_id=berth.current_vessel_id,
                compatible_vessel_types=berth.compatible_vessel_types,
                availability_start=berth.availability_start,
                availability_end=berth.availability_end,
            ))
            counts["berths"] += 1

        for crane in loader._seed_crane_models():
            db.merge(CraneRecord(
                id=crane.id,
                name=crane.name,
                berth_id=crane.berth_id,
                status=crane.status.value,
                capacity_teu_per_hour=crane.capacity_teu_per_hour,
            ))
            counts["cranes"] += 1

        for vessel_id, workload_teu in loader._seed_vessel_workloads().items():
            db.merge(VesselWorkloadRecord(
                vessel_id=vessel_id,
                workload_teu=workload_teu,
            ))
            counts["vessel_workloads"] += 1

        existing_metrics = db.execute(select(HistoricalMetricRecord.id).limit(1)).first()
        if existing_metrics is None:
            for row in loader._seed_historical_metrics().to_dict(orient="records"):
                db.add(HistoricalMetricRecord(**row))
                counts["historical_metrics"] += 1

        for port in loader._seed_alternative_ports():
            db.merge(AlternativePortRecord(
                port_id=port.port_id,
                port_name=port.port_name,
                congestion_level=port.congestion_level,
                predicted_wait_time_hours=port.predicted_wait_time_hours,
                travel_time_hours=port.travel_time_hours,
                travel_cost_usd=port.travel_cost_usd,
                available_berths=port.available_berths,
            ))
            counts["alternative_ports"] += 1

        db.commit()

    return counts


if __name__ == "__main__":
    result = seed_database()
    print("Seeded DockNova PostgreSQL data:")
    for table, count in result.items():
        print(f"- {table}: {count}")
