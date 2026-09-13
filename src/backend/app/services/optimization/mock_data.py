"""
Mock port data for testing the berth allocation optimizer.

Provides 8 sample vessels and 5 sample berths with realistic dimensions,
types, priorities, and timing spread over a 24-hour window.

This file is used when Shalvi's app/data/loader.py is not yet available.
Replace with real data loader calls once the data layer is integrated.
"""

from __future__ import annotations

from datetime import datetime, timedelta

from .models import BerthModel, BerthStatus, Priority, VesselModel, VesselStatus

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
