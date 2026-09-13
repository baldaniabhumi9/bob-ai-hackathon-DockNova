"""
Berth Allocation Optimizer using Google OR-Tools CP-SAT.

Solves the Berth Allocation Problem (BAP):
  Given a set of waiting/inbound vessels and available berths, assign each
  vessel to a compatible berth time-slot that minimizes total weighted
  waiting time and maximizes berth utilization, subject to:

    1. Compatibility: vessel draft ≤ berth max draft, vessel length ≤ berth
       max length, vessel type ∈ berth compatible types.
    2. No double-booking: a berth cannot serve two vessels simultaneously
       (enforced via CP-SAT NoOverlap constraints).
    3. Priority: HIGH-priority vessels are weighted 3×, MEDIUM 2×, LOW 1×
       in the objective so they receive earlier/better slots.

Usage:
    from app.services.optimization import optimize_berth_allocation
    result = optimize_berth_allocation(vessels, berths, reference_time)
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta
from typing import Optional

# pyrefly: ignore [missing-import]
from ortools.sat.python import cp_model

from .models import (
    BerthAssignment,
    BerthModel,
    BerthStatus,
    MetricsSnapshot,
    OptimizationResult,
    Priority,
    VesselModel,
    VesselStatus,
)

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Priority weights — higher weight = solver tries harder to schedule early
# ---------------------------------------------------------------------------
PRIORITY_WEIGHTS: dict[Priority, int] = {
    Priority.HIGH: 3,
    Priority.MEDIUM: 2,
    Priority.LOW: 1,
}

# Time granularity in minutes for the solver's internal time axis.
TIME_SLOT_MINUTES = 15

# Maximum solver wall-clock time in seconds.
DEFAULT_SOLVER_TIME_LIMIT_SECONDS = 30.0


# ---------------------------------------------------------------------------
# Helper: continuous time ↔ discrete slot conversion
# ---------------------------------------------------------------------------

def _minutes_from_reference(t: datetime, ref: datetime) -> int:
    """Return the number of minutes between *t* and *ref* (can be negative)."""
    return int((t - ref).total_seconds() / 60)


def _slots_from_minutes(minutes: int) -> int:
    """Convert minutes to solver time-slots (ceiling division)."""
    return max(0, -(-minutes // TIME_SLOT_MINUTES))  # ceil div


def _datetime_from_slots(slots: int, ref: datetime) -> datetime:
    """Convert solver time-slots back to a datetime."""
    return ref + timedelta(minutes=slots * TIME_SLOT_MINUTES)


# ---------------------------------------------------------------------------
# Compatibility check
# ---------------------------------------------------------------------------

def _is_compatible(vessel: VesselModel, berth: BerthModel) -> bool:
    """Return True if the vessel can physically use this berth."""
    if berth.status == BerthStatus.MAINTENANCE:
        return False
    if vessel.draft_meters > berth.max_draft_meters:
        return False
    if vessel.length_meters > berth.max_length_meters:
        return False
    if vessel.type not in berth.compatible_vessel_types:
        return False
    return True


# ---------------------------------------------------------------------------
# "Before" metrics (current state snapshot)
# ---------------------------------------------------------------------------

def _compute_before_metrics(
    vessels: list[VesselModel],
    berths: list[BerthModel],
    reference_time: datetime,
) -> MetricsSnapshot:
    """
    Compute metrics from the *current* (pre-optimization) state.

    - waiting_vessels: count of WAITING or SCHEDULED vessels
    - avg_waiting_time_hours: mean of (reference_time − eta) for waiting
      vessels, clamped to ≥ 0 (vessels that haven't arrived yet count as 0)
    - berth_utilization_pct: % of non-maintenance berths that are OCCUPIED
    """
    waiting = [v for v in vessels if v.status in (VesselStatus.WAITING, VesselStatus.SCHEDULED)]
    wait_count = len(waiting)

    if wait_count > 0:
        total_wait_hrs = sum(
            max(0.0, (reference_time - v.eta).total_seconds() / 3600)
            for v in waiting
        )
        avg_wait = total_wait_hrs / wait_count
    else:
        avg_wait = 0.0

    usable_berths = [b for b in berths if b.status != BerthStatus.MAINTENANCE]
    if usable_berths:
        occupied = sum(1 for b in usable_berths if b.status == BerthStatus.OCCUPIED)
        utilization = (occupied / len(usable_berths)) * 100
    else:
        utilization = 0.0

    return MetricsSnapshot(
        waiting_vessels=wait_count,
        avg_waiting_time_hours=round(avg_wait, 2),
        berth_utilization_pct=round(utilization, 2),
    )


# ---------------------------------------------------------------------------
# "After" metrics (post-optimization snapshot)
# ---------------------------------------------------------------------------

def _compute_after_metrics(
    assignments: list[BerthAssignment],
    vessels: list[VesselModel],
    berths: list[BerthModel],
    reference_time: datetime,
    horizon_slots: int,
) -> MetricsSnapshot:
    """
    Compute metrics from the optimized assignment plan.

    - waiting_vessels: vessels NOT assigned (still waiting)
    - avg_waiting_time_hours: for assigned vessels, mean of
      (assignment.start_time − vessel.eta), clamped ≥ 0
    - berth_utilization_pct: total assigned hours / (total berth-hours in
      planning horizon) × 100
    """
    assigned_ids = {a.vessel_id for a in assignments}
    vessel_map = {v.id: v for v in vessels}
    unassigned_count = sum(
        1 for v in vessels
        if v.status in (VesselStatus.WAITING, VesselStatus.SCHEDULED)
        and v.id not in assigned_ids
    )

    if assignments:
        total_wait_hrs = sum(
            max(0.0, (a.start_time - vessel_map[a.vessel_id].eta).total_seconds() / 3600)
            for a in assignments
        )
        avg_wait = total_wait_hrs / len(assignments)
    else:
        avg_wait = 0.0

    # Berth utilization: sum of assigned durations / (# usable berths × horizon)
    usable_berths = [b for b in berths if b.status != BerthStatus.MAINTENANCE]
    horizon_hours = (horizon_slots * TIME_SLOT_MINUTES) / 60
    total_berth_hours = len(usable_berths) * horizon_hours if usable_berths else 1.0

    total_assigned_hours = sum(
        (a.end_time - a.start_time).total_seconds() / 3600
        for a in assignments
    )
    utilization = min(100.0, (total_assigned_hours / total_berth_hours) * 100)

    return MetricsSnapshot(
        waiting_vessels=unassigned_count,
        avg_waiting_time_hours=round(avg_wait, 2),
        berth_utilization_pct=round(utilization, 2),
    )


# ---------------------------------------------------------------------------
# Main optimizer
# ---------------------------------------------------------------------------

def optimize_berth_allocation(
    vessels: list[VesselModel],
    berths: list[BerthModel],
    reference_time: Optional[datetime] = None,
    time_limit_seconds: float = DEFAULT_SOLVER_TIME_LIMIT_SECONDS,
) -> OptimizationResult:
    """
    Optimize berth allocation using CP-SAT.

    Parameters
    ----------
    vessels : list[VesselModel]
        All vessels; only WAITING and SCHEDULED vessels are considered for
        assignment.
    berths : list[BerthModel]
        All berths; MAINTENANCE berths are excluded automatically.
    reference_time : datetime, optional
        The "now" reference for computing time offsets.  Defaults to
        ``datetime.utcnow()``.
    time_limit_seconds : float
        Maximum solver wall-clock time.

    Returns
    -------
    OptimizationResult
        Assignments, before/after metrics, and improvement percentages.
    """
    if reference_time is None:
        reference_time = datetime.utcnow()

    # ----- filter inputs -----
    active_vessels = [
        v for v in vessels
        if v.status in (VesselStatus.WAITING, VesselStatus.SCHEDULED)
    ]
    usable_berths = [
        b for b in berths
        if b.status != BerthStatus.MAINTENANCE
    ]

    # ----- compute "before" metrics -----
    before = _compute_before_metrics(vessels, berths, reference_time)

    if not active_vessels or not usable_berths:
        logger.warning("No active vessels or usable berths — returning empty result.")
        after = MetricsSnapshot(waiting_vessels=len(active_vessels),
                                avg_waiting_time_hours=0, berth_utilization_pct=0)
        return OptimizationResult(
            assignments=[],
            before_metrics=before,
            after_metrics=after,
            efficiency_gain_percentage=0.0,
            estimated_wait_time_reduction_hours=0.0,
            solver_status="NO_INPUT",
        )

    # ----- planning horizon (in slots) -----
    earliest_eta = min(v.eta for v in active_vessels)
    latest_possible_end = max(
        v.eta + timedelta(hours=v.estimated_handling_hours * 2)  # generous
        for v in active_vessels
    )
    horizon_minutes = _minutes_from_reference(latest_possible_end, reference_time)
    horizon_slots = _slots_from_minutes(horizon_minutes) + 1  # +1 for safety

    # ----- precompute compatibility matrix -----
    compat: dict[str, list[str]] = {}  # vessel_id -> [berth_id, ...]
    for v in active_vessels:
        compat[v.id] = [b.id for b in usable_berths if _is_compatible(v, b)]

    # ----- build CP-SAT model -----
    model = cp_model.CpModel()

    # Decision variables:
    #   x[v, b]      : BoolVar — 1 if vessel v is assigned to berth b
    #   start[v, b]  : IntVar — start slot
    #   interval[v, b]: IntervalVar (optional, active only when x[v,b]=1)

    x: dict[tuple[str, str], cp_model.IntVar] = {}
    start_vars: dict[tuple[str, str], cp_model.IntVar] = {}
    interval_vars: dict[tuple[str, str], cp_model.IntervalVar] = {}

    # Per-berth interval lists for NoOverlap
    berth_intervals: dict[str, list[cp_model.IntervalVar]] = {
        b.id: [] for b in usable_berths
    }

    for v in active_vessels:
        duration_slots = _slots_from_minutes(
            int(v.estimated_handling_hours * 60)
        )
        # Earliest the vessel can start (its ETA relative to reference_time)
        earliest_start = max(
            0, _slots_from_minutes(_minutes_from_reference(v.eta, reference_time))
        )

        for bid in compat[v.id]:
            key = (v.id, bid)

            x[key] = model.new_bool_var(f"x_{v.id}_{bid}")
            start_vars[key] = model.new_int_var(
                earliest_start, horizon_slots, f"start_{v.id}_{bid}"
            )
            interval_vars[key] = model.new_optional_fixed_size_interval_var(
                start_vars[key],
                duration_slots,
                x[key],
                f"interval_{v.id}_{bid}",
            )
            berth_intervals[bid].append(interval_vars[key])

    # Constraint: each vessel assigned to at most one berth
    for v in active_vessels:
        model.add_at_most_one(
            x[(v.id, bid)] for bid in compat[v.id]
        )

    # Constraint: no two vessels overlap on the same berth
    for bid, intervals in berth_intervals.items():
        if len(intervals) >= 2:
            model.add_no_overlap(intervals)

    # Objective: minimize weighted waiting (start − earliest_start) and
    # maximize the number of assigned vessels.
    # We combine:
    #   minimize  Σ  priority_weight[v] * (start[v,b] − earliest_start[v]) * x[v,b]
    #   maximize  Σ  BIG_BONUS * x[v,b]          (prefer assigning more vessels)
    #
    # Rewrite as a single minimization:
    #   minimize  Σ  weight * (start - earliest) * x  −  BIG_BONUS * x

    BIG_BONUS = horizon_slots * 10  # large enough to prefer assignment over skip

    objective_terms: list[cp_model.LinearExpr] = []

    for v in active_vessels:
        weight = PRIORITY_WEIGHTS[v.priority]
        earliest_start = max(
            0, _slots_from_minutes(_minutes_from_reference(v.eta, reference_time))
        )
        for bid in compat[v.id]:
            key = (v.id, bid)

            # wait_slots = start - earliest_start (≥ 0 by domain)
            wait_slot = model.new_int_var(0, horizon_slots, f"wait_{v.id}_{bid}")
            model.add(wait_slot == start_vars[key] - earliest_start).only_enforce_if(x[key])
            model.add(wait_slot == 0).only_enforce_if(x[key].negated())

            # Weighted wait cost
            cost = model.new_int_var(0, horizon_slots * weight, f"cost_{v.id}_{bid}")
            model.add(cost == wait_slot * weight).only_enforce_if(x[key])
            model.add(cost == 0).only_enforce_if(x[key].negated())

            objective_terms.append(cost)

            # Bonus for assigning (negative cost = reward)
            bonus = model.new_int_var(-BIG_BONUS, 0, f"bonus_{v.id}_{bid}")
            model.add(bonus == -BIG_BONUS).only_enforce_if(x[key])
            model.add(bonus == 0).only_enforce_if(x[key].negated())
            objective_terms.append(bonus)

    model.minimize(sum(objective_terms))

    # ----- solve -----
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = time_limit_seconds
    solver.parameters.log_search_progress = False

    status = solver.solve(model)
    status_name = solver.status_name(status)
    logger.info(f"CP-SAT solver status: {status_name}")

    # ----- extract assignments -----
    assignments: list[BerthAssignment] = []

    if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        vessel_map = {v.id: v for v in active_vessels}
        berth_map = {b.id: b for b in usable_berths}

        for v in active_vessels:
            for bid in compat[v.id]:
                key = (v.id, bid)
                if solver.value(x[key]):
                    s = solver.value(start_vars[key])
                    duration_slots = _slots_from_minutes(
                        int(v.estimated_handling_hours * 60)
                    )
                    assignments.append(
                        BerthAssignment(
                            vessel_id=v.id,
                            vessel_name=v.name,
                            berth_id=bid,
                            berth_name=berth_map[bid].name,
                            start_time=_datetime_from_slots(s, reference_time),
                            end_time=_datetime_from_slots(s + duration_slots, reference_time),
                        )
                    )
                    break  # vessel assigned once

    # Sort assignments by start_time for readability
    assignments.sort(key=lambda a: a.start_time)

    # ----- compute "after" metrics -----
    after = _compute_after_metrics(
        assignments, vessels, berths, reference_time, horizon_slots
    )

    # ----- compute improvement deltas -----
    wait_reduction = max(0.0, before.avg_waiting_time_hours - after.avg_waiting_time_hours)
    if before.berth_utilization_pct > 0:
        efficiency_gain = (
            (after.berth_utilization_pct - before.berth_utilization_pct)
            / before.berth_utilization_pct
        ) * 100
    else:
        efficiency_gain = after.berth_utilization_pct  # from 0% to X%

    return OptimizationResult(
        assignments=assignments,
        before_metrics=before,
        after_metrics=after,
        efficiency_gain_percentage=round(efficiency_gain, 2),
        estimated_wait_time_reduction_hours=round(wait_reduction, 2),
        solver_status=status_name,
    )
