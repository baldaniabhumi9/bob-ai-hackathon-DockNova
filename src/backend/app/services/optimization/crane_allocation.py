"""
Crane Allocation Optimizer — greedy approach.

Why greedy instead of CP-SAT:
  The crane assignment problem for a single berth is structurally simple:
  given N available cranes (each with a throughput rate) and a fixed TEU
  workload, select 1..max_cranes to minimize service_duration_hours =
  workload / sum(selected_crane_capacities).  The optimal solution is
  always to use ALL available cranes (throughput only increases, duration
  only decreases), so a greedy "sort-by-capacity-descending, add until
  max" approach is provably optimal.  CP-SAT would be overkill — it adds
  solver overhead with no benefit for this problem shape.

  If future requirements introduce crane interference penalties (e.g.
  cranes too close together reduce individual throughput) or cross-berth
  sharing, upgrading to CP-SAT would be warranted.

Usage:
    from app.services.optimization.crane_allocation import optimize_crane_allocation
    result = optimize_crane_allocation(
        berth_id="B01",
        berth_name="Container Terminal Alpha",
        vessel_id="V004",
        vessel_name="Ever Given",
        workload_teu=800,
        cranes=cranes_at_berth,
    )
"""

from __future__ import annotations

import logging
from typing import Optional

from .models import (
    CraneAssignment,
    CraneMetricsSnapshot,
    CraneModel,
    CraneOptimizationResult,
    CraneStatus,
)

logger = logging.getLogger(__name__)

# Default bounds on how many cranes can serve a single vessel.
DEFAULT_MIN_CRANES = 1
DEFAULT_MAX_CRANES = 10  # effectively uncapped; will be clamped to available


def optimize_crane_allocation(
    berth_id: str,
    berth_name: str,
    vessel_id: str,
    vessel_name: str,
    workload_teu: float,
    cranes: list[CraneModel],
    min_cranes: int = DEFAULT_MIN_CRANES,
    max_cranes: Optional[int] = None,
) -> CraneOptimizationResult:
    """
    Optimally assign cranes at a berth to minimise service duration.

    Parameters
    ----------
    berth_id : str
        The berth being serviced.
    berth_name : str
        Human-readable berth name.
    vessel_id : str
        The vessel being loaded/unloaded.
    vessel_name : str
        Human-readable vessel name.
    workload_teu : float
        Total TEU containers to handle for this vessel.
    cranes : list[CraneModel]
        All cranes at this berth (any status).
    min_cranes : int
        Minimum cranes to assign per vessel (default 1).
    max_cranes : int | None
        Maximum cranes to assign.  Defaults to the count of
        non-MAINTENANCE cranes at the berth.

    Returns
    -------
    CraneOptimizationResult
        Assignments, before/after metrics, and improvement percentages.
    """
    # ----- filter to berth cranes only (safety) -----
    berth_cranes = [c for c in cranes if c.berth_id == berth_id]

    # Available = not in MAINTENANCE
    available_cranes = [
        c for c in berth_cranes if c.status != CraneStatus.MAINTENANCE
    ]

    # Clamp max_cranes to the physical number of available cranes
    physical_max = len(available_cranes)
    if max_cranes is None:
        max_cranes = physical_max
    else:
        max_cranes = min(max_cranes, physical_max)

    # Clamp min_cranes
    min_cranes = max(1, min(min_cranes, physical_max))

    # ----- "before" baseline: use min_cranes (worst realistic scenario) -----
    # Sort available cranes by throughput descending (best first)
    sorted_cranes = sorted(
        available_cranes, key=lambda c: c.capacity_teu_per_hour, reverse=True
    )

    def _compute_duration(selected: list[CraneModel]) -> float:
        """Service duration = workload / combined throughput."""
        if not selected or workload_teu <= 0:
            return 0.0
        combined = sum(c.capacity_teu_per_hour for c in selected)
        return workload_teu / combined if combined > 0 else float("inf")

    # Before: assign only min_cranes (simulate sub-optimal / manual baseline)
    before_selection = sorted_cranes[:min_cranes]
    before_duration = _compute_duration(before_selection)
    before_utilization = (
        (len(before_selection) / len(berth_cranes)) * 100
        if berth_cranes
        else 0.0
    )

    before_metrics = CraneMetricsSnapshot(
        total_cranes=len(berth_cranes),
        cranes_assigned=len(before_selection),
        avg_service_duration_hours=round(before_duration, 2),
        crane_utilization_pct=round(before_utilization, 2),
    )

    # ----- handle edge cases -----
    if not available_cranes:
        logger.warning(f"No available cranes at berth {berth_id}")
        return CraneOptimizationResult(
            assignments=[],
            before_metrics=before_metrics,
            after_metrics=CraneMetricsSnapshot(
                total_cranes=len(berth_cranes),
                cranes_assigned=0,
                avg_service_duration_hours=0,
                crane_utilization_pct=0,
            ),
            efficiency_gain_percentage=0.0,
            estimated_wait_time_reduction_hours=0.0,
            solver_status="NO_AVAILABLE_CRANES",
        )

    if workload_teu <= 0:
        logger.warning("Workload is zero — nothing to assign")
        return CraneOptimizationResult(
            assignments=[],
            before_metrics=before_metrics,
            after_metrics=CraneMetricsSnapshot(
                total_cranes=len(berth_cranes),
                cranes_assigned=0,
                avg_service_duration_hours=0,
                crane_utilization_pct=0,
            ),
            efficiency_gain_percentage=0.0,
            estimated_wait_time_reduction_hours=0.0,
            solver_status="NO_WORKLOAD",
        )

    # ----- greedy assignment: use as many as allowed (up to max_cranes) -----
    after_selection = sorted_cranes[:max_cranes]
    after_duration = _compute_duration(after_selection)
    after_utilization = (
        (len(after_selection) / len(berth_cranes)) * 100
        if berth_cranes
        else 0.0
    )

    after_metrics = CraneMetricsSnapshot(
        total_cranes=len(berth_cranes),
        cranes_assigned=len(after_selection),
        avg_service_duration_hours=round(after_duration, 2),
        crane_utilization_pct=round(after_utilization, 2),
    )

    # ----- build assignment -----
    assignment = CraneAssignment(
        vessel_id=vessel_id,
        vessel_name=vessel_name,
        berth_id=berth_id,
        berth_name=berth_name,
        crane_ids=[c.id for c in after_selection],
        crane_names=[c.name for c in after_selection],
        num_cranes=len(after_selection),
        combined_throughput_teu_per_hour=round(
            sum(c.capacity_teu_per_hour for c in after_selection), 2
        ),
        workload_teu=workload_teu,
        service_duration_hours=round(after_duration, 2),
    )

    # ----- compute improvements -----
    duration_reduction = max(0.0, before_duration - after_duration)
    if before_utilization > 0:
        efficiency_gain = (
            (after_utilization - before_utilization) / before_utilization
        ) * 100
    else:
        efficiency_gain = after_utilization

    return CraneOptimizationResult(
        assignments=[assignment],
        before_metrics=before_metrics,
        after_metrics=after_metrics,
        efficiency_gain_percentage=round(efficiency_gain, 2),
        estimated_wait_time_reduction_hours=round(duration_reduction, 2),
        solver_status="OPTIMAL",
    )
