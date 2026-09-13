"""
Mock port data for testing optimization services.

Provides:
  - 8 sample vessels and 5 sample berths (for berth allocation)
  - 12 sample cranes across 5 berths (for crane allocation)
  - Vessel workload data in TEU (for crane allocation)

All data uses realistic dimensions, types, priorities, and timing.
This file is used when Shalvi's app/data/loader.py is not yet available.
Replace with real data loader calls once the data layer is integrated.
"""

from __future__ import annotations

from datetime import datetime, timedelta

from .models import (
    BerthModel,
    BerthStatus,
    CraneModel,
    CraneStatus,
    Priority,
    VesselModel,
    VesselStatus,
)

# ---------------------------------------------------------------------------
# Reference time: "now" for the mock scenario
# ---------------------------------------------------------------------------
REFERENCE_TIME = datetime(2025, 7, 15, 6, 0, 0)  # 06:00 UTC

# ---------------------------------------------------------------------------
# Sample Vessels
# ---------------------------------------------------------------------------

def get_sample_vessels(reference_time: datetime | None = None) -> list[VesselModel]:
    """Return 8 sample vessels with staggered ETAs over 24 hours."""
    t0 = reference_time or REFERENCE_TIME
    return [
        VesselModel(
            id="V001",
            name="MSC Flaminia",
            imo="9467419",
            type="CONTAINER",
            eta=t0 + timedelta(hours=0),
            etd=t0 + timedelta(hours=18),
            status=VesselStatus.WAITING,
            draft_meters=14.5,
            length_meters=316.0,
            priority=Priority.HIGH,
            estimated_handling_hours=16,
        ),
        VesselModel(
            id="V002",
            name="Stena Impala",
            imo="9235261",
            type="TANKER",
            eta=t0 + timedelta(hours=1),
            etd=t0 + timedelta(hours=13),
            status=VesselStatus.WAITING,
            draft_meters=11.2,
            length_meters=183.0,
            priority=Priority.MEDIUM,
            estimated_handling_hours=10,
        ),
        VesselModel(
            id="V003",
            name="Cape Kassos",
            imo="9361789",
            type="BULK",
            eta=t0 + timedelta(hours=2),
            etd=t0 + timedelta(hours=20),
            status=VesselStatus.WAITING,
            draft_meters=17.0,
            length_meters=292.0,
            priority=Priority.LOW,
            estimated_handling_hours=14,
        ),
        VesselModel(
            id="V004",
            name="Ever Given",
            imo="9811000",
            type="CONTAINER",
            eta=t0 + timedelta(hours=3),
            etd=t0 + timedelta(hours=21),
            status=VesselStatus.SCHEDULED,
            draft_meters=16.0,
            length_meters=400.0,
            priority=Priority.HIGH,
            estimated_handling_hours=18,
        ),
        VesselModel(
            id="V005",
            name="Minerva Helen",
            imo="9293073",
            type="TANKER",
            eta=t0 + timedelta(hours=4),
            etd=t0 + timedelta(hours=14),
            status=VesselStatus.WAITING,
            draft_meters=12.5,
            length_meters=244.0,
            priority=Priority.MEDIUM,
            estimated_handling_hours=8,
        ),
        VesselModel(
            id="V006",
            name="Pacific Venture",
            imo="9401851",
            type="RORO",
            eta=t0 + timedelta(hours=5),
            etd=t0 + timedelta(hours=15),
            status=VesselStatus.SCHEDULED,
            draft_meters=8.5,
            length_meters=199.0,
            priority=Priority.LOW,
            estimated_handling_hours=8,
        ),
        VesselModel(
            id="V007",
            name="CMA CGM Marco Polo",
            imo="9454412",
            type="CONTAINER",
            eta=t0 + timedelta(hours=8),
            etd=t0 + timedelta(hours=24),
            status=VesselStatus.WAITING,
            draft_meters=15.5,
            length_meters=396.0,
            priority=Priority.HIGH,
            estimated_handling_hours=16,
        ),
        VesselModel(
            id="V008",
            name="Nordic Hawk",
            imo="9504983",
            type="BULK",
            eta=t0 + timedelta(hours=10),
            etd=t0 + timedelta(hours=22),
            status=VesselStatus.SCHEDULED,
            draft_meters=13.0,
            length_meters=229.0,
            priority=Priority.MEDIUM,
            estimated_handling_hours=10,
        ),
    ]


# ---------------------------------------------------------------------------
# Sample Berths
# ---------------------------------------------------------------------------

def get_sample_berths(reference_time: datetime | None = None) -> list[BerthModel]:
    """Return 5 sample berths with varying capacities and compatibility."""
    t0 = reference_time or REFERENCE_TIME
    return [
        BerthModel(
            id="B01",
            name="Container Terminal Alpha",
            code="CT-A",
            max_draft_meters=18.0,
            max_length_meters=420.0,
            status=BerthStatus.AVAILABLE,
            compatible_vessel_types=["CONTAINER"],
            availability_start=t0,
            availability_end=t0 + timedelta(hours=48),
        ),
        BerthModel(
            id="B02",
            name="Container Terminal Bravo",
            code="CT-B",
            max_draft_meters=16.0,
            max_length_meters=350.0,
            status=BerthStatus.AVAILABLE,
            compatible_vessel_types=["CONTAINER"],
            availability_start=t0,
            availability_end=t0 + timedelta(hours=48),
        ),
        BerthModel(
            id="B03",
            name="Liquid Bulk Terminal",
            code="LB-1",
            max_draft_meters=15.0,
            max_length_meters=280.0,
            status=BerthStatus.AVAILABLE,
            compatible_vessel_types=["TANKER"],
            availability_start=t0,
            availability_end=t0 + timedelta(hours=48),
        ),
        BerthModel(
            id="B04",
            name="Dry Bulk Terminal",
            code="DB-1",
            max_draft_meters=18.0,
            max_length_meters=320.0,
            status=BerthStatus.AVAILABLE,
            compatible_vessel_types=["BULK", "RORO"],
            availability_start=t0,
            availability_end=t0 + timedelta(hours=48),
        ),
        BerthModel(
            id="B05",
            name="Multi-Purpose Quay",
            code="MP-1",
            max_draft_meters=14.0,
            max_length_meters=260.0,
            status=BerthStatus.AVAILABLE,
            compatible_vessel_types=["CONTAINER", "TANKER", "BULK", "RORO"],
            availability_start=t0,
            availability_end=t0 + timedelta(hours=48),
        ),
    ]


# ---------------------------------------------------------------------------
# Sample Cranes (matching shared Crane interface)
# ---------------------------------------------------------------------------

def get_sample_cranes() -> list[CraneModel]:
    """
    Return 12 sample cranes distributed across the 5 berths.

    Distribution:
      B01 (Container Terminal Alpha):  3 STS gantry cranes
      B02 (Container Terminal Bravo):  2 STS gantry cranes
      B03 (Liquid Bulk Terminal):      2 loading arms
      B04 (Dry Bulk Terminal):         3 grab cranes
      B05 (Multi-Purpose Quay):        2 mobile harbour cranes
    """
    return [
        # --- B01: Container Terminal Alpha (3 cranes) ---
        CraneModel(
            id="CR01",
            name="STS Gantry Alpha-1",
            berth_id="B01",
            status=CraneStatus.OPERATIONAL,
            capacity_teu_per_hour=30,
        ),
        CraneModel(
            id="CR02",
            name="STS Gantry Alpha-2",
            berth_id="B01",
            status=CraneStatus.OPERATIONAL,
            capacity_teu_per_hour=28,
        ),
        CraneModel(
            id="CR03",
            name="STS Gantry Alpha-3",
            berth_id="B01",
            status=CraneStatus.MAINTENANCE,
            capacity_teu_per_hour=30,
        ),
        # --- B02: Container Terminal Bravo (2 cranes) ---
        CraneModel(
            id="CR04",
            name="STS Gantry Bravo-1",
            berth_id="B02",
            status=CraneStatus.OPERATIONAL,
            capacity_teu_per_hour=25,
        ),
        CraneModel(
            id="CR05",
            name="STS Gantry Bravo-2",
            berth_id="B02",
            status=CraneStatus.OPERATIONAL,
            capacity_teu_per_hour=25,
        ),
        # --- B03: Liquid Bulk Terminal (2 cranes / loading arms) ---
        CraneModel(
            id="CR06",
            name="Loading Arm LB-1A",
            berth_id="B03",
            status=CraneStatus.OPERATIONAL,
            capacity_teu_per_hour=15,
        ),
        CraneModel(
            id="CR07",
            name="Loading Arm LB-1B",
            berth_id="B03",
            status=CraneStatus.OPERATIONAL,
            capacity_teu_per_hour=15,
        ),
        # --- B04: Dry Bulk Terminal (3 cranes) ---
        CraneModel(
            id="CR08",
            name="Grab Crane DB-1A",
            berth_id="B04",
            status=CraneStatus.OPERATIONAL,
            capacity_teu_per_hour=20,
        ),
        CraneModel(
            id="CR09",
            name="Grab Crane DB-1B",
            berth_id="B04",
            status=CraneStatus.OPERATIONAL,
            capacity_teu_per_hour=18,
        ),
        CraneModel(
            id="CR10",
            name="Grab Crane DB-1C",
            berth_id="B04",
            status=CraneStatus.IDLE,
            capacity_teu_per_hour=20,
        ),
        # --- B05: Multi-Purpose Quay (2 cranes) ---
        CraneModel(
            id="CR11",
            name="Mobile Harbour Crane MP-1A",
            berth_id="B05",
            status=CraneStatus.OPERATIONAL,
            capacity_teu_per_hour=18,
        ),
        CraneModel(
            id="CR12",
            name="Mobile Harbour Crane MP-1B",
            berth_id="B05",
            status=CraneStatus.OPERATIONAL,
            capacity_teu_per_hour=18,
        ),
    ]


# ---------------------------------------------------------------------------
# Vessel workload data (TEU containers to handle)
# ---------------------------------------------------------------------------

# Maps vessel_id -> number of TEU containers to load/unload.
# Used by the crane allocation optimizer.
VESSEL_WORKLOADS_TEU: dict[str, float] = {
    "V001": 450,   # MSC Flaminia (CONTAINER, HIGH priority)
    "V002": 120,   # Stena Impala (TANKER — smaller TEU equivalent)
    "V003": 350,   # Cape Kassos (BULK)
    "V004": 800,   # Ever Given (CONTAINER, HIGH priority, mega-vessel)
    "V005": 100,   # Minerva Helen (TANKER)
    "V006": 200,   # Pacific Venture (RORO)
    "V007": 650,   # CMA CGM Marco Polo (CONTAINER, HIGH priority)
    "V008": 280,   # Nordic Hawk (BULK)
}


# ---------------------------------------------------------------------------
# Alternative Ports for Route Recommendation
# ---------------------------------------------------------------------------

from .models import AlternativePort  # noqa: E402 (appended import)

# Current port identity & mock congestion
CURRENT_PORT_ID = "PORT-DKN"
CURRENT_PORT_NAME = "DockNova Terminal"
CURRENT_PORT_CONGESTION = "HIGH"  # Mock: our port is congested
CURRENT_PORT_WAIT_TIME_HOURS = 8.5  # Avg wait for incoming vessels


def get_alternative_ports() -> list[AlternativePort]:
    """
    Return 3 alternative ports with mock congestion/capacity/cost data.

    These represent nearby ports a vessel could be rerouted to when
    the current port is congested.
    """
    return [
        AlternativePort(
            port_id="PORT-MUN",
            port_name="Mumbai Port (JNPT)",
            congestion_level="MEDIUM",
            predicted_wait_time_hours=3.5,
            travel_time_hours=6.0,
            travel_cost_usd=45000,
            available_berths=3,
        ),
        AlternativePort(
            port_id="PORT-KAN",
            port_name="Kandla Port",
            congestion_level="LOW",
            predicted_wait_time_hours=1.0,
            travel_time_hours=12.0,
            travel_cost_usd=72000,
            available_berths=5,
        ),
        AlternativePort(
            port_id="PORT-HAZ",
            port_name="Hazira Port",
            congestion_level="LOW",
            predicted_wait_time_hours=2.0,
            travel_time_hours=4.0,
            travel_cost_usd=30000,
            available_berths=2,
        ),
    ]

