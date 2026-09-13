"""
72-Hour Operations Plan Generator.

Combines berth allocation and crane allocation outputs to produce a
unified, actionable operations plan for all vessels arriving within the
next 72 hours.

Does NOT reimplement berth or crane logic — imports and calls the
existing optimize_berth_allocation() and optimize_crane_allocation().

Usage:
    from app.services.optimization.operations_plan import generate_operations_plan
    plan = generate_operations_plan(vessels, berths, cranes, reference_time)
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta
from typing import Optional

from app.data.loader import get_vessel_workloads
from .berth_allocation import optimize_berth_allocation
from .crane_allocation import optimize_crane_allocation
from .models import (
    BerthModel,
    CraneModel,
    OperationsPlanEntry,
    OperationsPlanResult,
    PlanEntryStatus,
    VesselModel,
    VesselStatus,
)

logger = logging.getLogger(__name__)

# Default planning horizon
PLANNING_HORIZON_HOURS = 72

# If a vessel's scheduled start is pushed more than this many hours
# past its ETA, mark it DELAYED.
DELAY_THRESHOLD_HOURS = 2.0


def _determine_status(
    vessel: VesselModel,
    start_time: datetime,
    reference_time: datetime,
) -> PlanEntryStatus:
    """
    Derive an entry's status from timing:
      - SCHEDULED: start_time is in the future
      - IN_PROGRESS: start_time ≤ now < end_time  (approximated via ETA)
      - DELAYED: start_time is pushed > DELAY_THRESHOLD past ETA
    """
    delay_hours = (start_time - vessel.eta).total_seconds() / 3600

    if delay_hours > DELAY_THRESHOLD_HOURS:
        return PlanEntryStatus.DELAYED

    if start_time <= reference_time:
        return PlanEntryStatus.IN_PROGRESS

    return PlanEntryStatus.SCHEDULED


def _recommended_action(status: PlanEntryStatus, vessel: VesselModel) -> str:
    """Generate a human-readable recommended action string."""
    if status == PlanEntryStatus.DELAYED:
        return (
            f"ALERT: {vessel.name} is delayed. Consider priority upgrade "
            f"or berth reassignment to reduce congestion impact."
        )
    elif status == PlanEntryStatus.IN_PROGRESS:
        return f"Monitor {vessel.name} — currently being serviced."
    else:
        return f"Proceed as planned. {vessel.name} scheduled for berth arrival."


def generate_operations_plan(
    vessels: list[VesselModel],
    berths: list[BerthModel],
    cranes: list[CraneModel],
    reference_time: Optional[datetime] = None,
    workloads: Optional[dict[str, float]] = None,
) -> OperationsPlanResult:
    """
    Generate a 72-hour operations plan.

    Parameters
    ----------
    vessels : list[VesselModel]
        All known vessels.
    berths : list[BerthModel]
        All berths at the port.
    cranes : list[CraneModel]
        All cranes at the port.
    reference_time : datetime, optional
        "Now" reference.  Defaults to datetime.utcnow().
    workloads : dict[str, float], optional
        vessel_id → TEU workload mapping.  Falls back to
        get_vessel_workloads() from loader.

    Returns
    -------
    OperationsPlanResult
    """
    if reference_time is None:
        reference_time = datetime.utcnow()

    if workloads is None:
        workloads = get_vessel_workloads()

    horizon_end = reference_time + timedelta(hours=PLANNING_HORIZON_HOURS)

    # --- filter vessels within the 72-hour window ---
    window_vessels = [
        v for v in vessels
        if v.status in (VesselStatus.WAITING, VesselStatus.SCHEDULED)
        and v.eta <= horizon_end
    ]

    if not window_vessels:
        return OperationsPlanResult(
            entries=[],
            recommendations_count=0,
            total_vessels=0,
            scheduled_count=0,
            in_progress_count=0,
            delayed_count=0,
        )

    # --- Step 1: run berth allocation ---
    berth_result = optimize_berth_allocation(
        vessels=window_vessels,
        berths=berths,
        reference_time=reference_time,
    )

    # Build a map: vessel_id → BerthAssignment
    berth_assignment_map = {a.vessel_id: a for a in berth_result.assignments}

    # --- Step 2: for each assigned vessel, run crane allocation ---
    berth_map = {b.id: b for b in berths}
    vessel_map = {v.id: v for v in window_vessels}

    entries: list[OperationsPlanEntry] = []

    for vessel in window_vessels:
        ba = berth_assignment_map.get(vessel.id)
        if not ba:
            # Vessel could not be assigned a berth — mark as delayed
            entries.append(OperationsPlanEntry(
                vessel_id=vessel.id,
                vessel_name=vessel.name,
                vessel_type=vessel.type,
                priority=vessel.priority,
                eta=vessel.eta,
                etd=vessel.etd,
                berth_id="UNASSIGNED",
                berth_name="No berth available",
                start_time=vessel.eta,
                end_time=vessel.etd,
                crane_count=0,
                crane_ids=[],
                service_duration_hours=0,
                workload_teu=workloads.get(vessel.id, 0),
                status=PlanEntryStatus.DELAYED,
                recommended_action=(
                    f"CRITICAL: No berth assigned to {vessel.name}. "
                    f"Consider rerouting or expediting current berth occupants."
                ),
            ))
            continue

        # Run crane allocation for this vessel at its assigned berth
        vessel_workload = workloads.get(vessel.id, 200)  # default 200 TEU
        crane_result = optimize_crane_allocation(
            berth_id=ba.berth_id,
            berth_name=ba.berth_name,
            vessel_id=vessel.id,
            vessel_name=vessel.name,
            workload_teu=vessel_workload,
            cranes=cranes,
        )

        # Extract crane assignment details
        if crane_result.assignments:
            ca = crane_result.assignments[0]
            crane_count = ca.num_cranes
            crane_ids = ca.crane_ids
            service_duration = ca.service_duration_hours
        else:
            crane_count = 0
            crane_ids = []
            service_duration = vessel.estimated_handling_hours

        # Determine status
        status = _determine_status(vessel, ba.start_time, reference_time)
        action = _recommended_action(status, vessel)

        entries.append(OperationsPlanEntry(
            vessel_id=vessel.id,
            vessel_name=vessel.name,
            vessel_type=vessel.type,
            priority=vessel.priority,
            eta=vessel.eta,
            etd=vessel.etd,
            berth_id=ba.berth_id,
            berth_name=ba.berth_name,
            start_time=ba.start_time,
            end_time=ba.end_time,
            crane_count=crane_count,
            crane_ids=crane_ids,
            service_duration_hours=round(service_duration, 2),
            workload_teu=vessel_workload,
            status=status,
            recommended_action=action,
        ))

    # Sort entries by start_time
    entries.sort(key=lambda e: e.start_time)

    # Count statuses
    scheduled = sum(1 for e in entries if e.status == PlanEntryStatus.SCHEDULED)
    in_progress = sum(1 for e in entries if e.status == PlanEntryStatus.IN_PROGRESS)
    delayed = sum(1 for e in entries if e.status == PlanEntryStatus.DELAYED)
    recommendations = sum(
        1 for e in entries if e.status == PlanEntryStatus.DELAYED
    )

    return OperationsPlanResult(
        entries=entries,
        recommendations_count=recommendations,
        total_vessels=len(entries),
        scheduled_count=scheduled,
        in_progress_count=in_progress,
        delayed_count=delayed,
    )
