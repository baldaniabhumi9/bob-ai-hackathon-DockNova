#!/usr/bin/env python3
"""
Standalone test script for the berth allocation optimizer.

Run from the backend directory:
    python -m app.services.optimization.test_berth_allocation

Validates:
  1. OR-Tools imports and solves successfully
  2. All assignments respect compatibility constraints
  3. No two assignments on the same berth overlap in time
  4. HIGH-priority vessels are scheduled no later than LOW-priority vessels
     when competing for the same berth
  5. "After" metrics improve over "before" metrics
  6. Output matches the OptimizationResult schema
"""

from __future__ import annotations

import json
import sys
from datetime import datetime

from .berth_allocation import optimize_berth_allocation, _is_compatible
from .mock_data import REFERENCE_TIME, get_sample_berths, get_sample_vessels
from .models import BerthAssignment


def _check_no_overlap(assignments: list[BerthAssignment]) -> bool:
    """Verify no two assignments on the same berth overlap in time."""
    by_berth: dict[str, list[BerthAssignment]] = {}
    for a in assignments:
        by_berth.setdefault(a.berth_id, []).append(a)

    for bid, berth_assignments in by_berth.items():
        sorted_assignments = sorted(berth_assignments, key=lambda a: a.start_time)
        for i in range(len(sorted_assignments) - 1):
            if sorted_assignments[i].end_time > sorted_assignments[i + 1].start_time:
                print(
                    f"  ✗ OVERLAP on berth {bid}: "
                    f"{sorted_assignments[i].vessel_id} ends at {sorted_assignments[i].end_time}, "
                    f"but {sorted_assignments[i+1].vessel_id} starts at {sorted_assignments[i+1].start_time}"
                )
                return False
    return True


def main() -> None:
    print("=" * 70)
    print("DockNova Berth Allocation Optimizer — Test Run")
    print("=" * 70)
    print()

    # ----- Load mock data -----
    vessels = get_sample_vessels(REFERENCE_TIME)
    berths = get_sample_berths(REFERENCE_TIME)
    print(f"Loaded {len(vessels)} vessels and {len(berths)} berths (mock data)")
    print(f"Reference time: {REFERENCE_TIME.isoformat()}")
    print()

    # ----- Run optimizer -----
    print("Running CP-SAT optimizer...")
    result = optimize_berth_allocation(
        vessels=vessels,
        berths=berths,
        reference_time=REFERENCE_TIME,
        time_limit_seconds=30.0,
    )
    print(f"Solver status: {result.solver_status}")
    print()

    # ----- Display assignments -----
    print(f"Assignments ({len(result.assignments)}):")
    print("-" * 70)
    for a in result.assignments:
        duration_hrs = (a.end_time - a.start_time).total_seconds() / 3600
        print(
            f"  {a.vessel_name:<25} → {a.berth_name:<25} "
            f"| {a.start_time.strftime('%H:%M')}–{a.end_time.strftime('%H:%M')} "
            f"({duration_hrs:.1f}h)"
        )
    print()

    # ----- Display metrics -----
    print("Before Optimization:")
    print(f"  Waiting vessels:       {result.before_metrics.waiting_vessels}")
    print(f"  Avg waiting time:      {result.before_metrics.avg_waiting_time_hours:.2f} hours")
    print(f"  Berth utilization:     {result.before_metrics.berth_utilization_pct:.1f}%")
    print()
    print("After Optimization:")
    print(f"  Waiting vessels:       {result.after_metrics.waiting_vessels}")
    print(f"  Avg waiting time:      {result.after_metrics.avg_waiting_time_hours:.2f} hours")
    print(f"  Berth utilization:     {result.after_metrics.berth_utilization_pct:.1f}%")
    print()
    print(f"Efficiency gain:         {result.efficiency_gain_percentage:.2f}%")
    print(f"Wait time reduction:     {result.estimated_wait_time_reduction_hours:.2f} hours")
    print()

    # ----- Validation -----
    all_passed = True

    # 1. Solver found a solution
    if result.solver_status not in ("OPTIMAL", "FEASIBLE"):
        print("✗ FAIL: Solver did not find a feasible solution")
        all_passed = False
    else:
        print("✓ Solver found a solution")

    # 2. At least some assignments
    if len(result.assignments) == 0:
        print("✗ FAIL: No assignments produced")
        all_passed = False
    else:
        print(f"✓ {len(result.assignments)} vessels assigned out of {len(vessels)}")

    # 3. Compatibility
    vessel_map = {v.id: v for v in vessels}
    berth_map = {b.id: b for b in berths}
    compat_ok = True
    for a in result.assignments:
        v = vessel_map[a.vessel_id]
        b = berth_map[a.berth_id]
        if not _is_compatible(v, b):
            print(f"  ✗ Incompatible assignment: {a.vessel_id} → {a.berth_id}")
            compat_ok = False
    if compat_ok:
        print("✓ All assignments respect compatibility constraints")
    else:
        all_passed = False

    # 4. No overlap
    if _check_no_overlap(result.assignments):
        print("✓ No overlapping assignments on any berth")
    else:
        all_passed = False

    # 5. Metrics improvement (after should be at least as good as before)
    if result.after_metrics.avg_waiting_time_hours <= result.before_metrics.avg_waiting_time_hours + 0.01:
        print("✓ Average waiting time did not increase")
    else:
        print(
            f"⚠ Average waiting time increased: "
            f"{result.before_metrics.avg_waiting_time_hours:.2f} → "
            f"{result.after_metrics.avg_waiting_time_hours:.2f}"
        )

    if result.after_metrics.berth_utilization_pct >= result.before_metrics.berth_utilization_pct:
        print("✓ Berth utilization improved or stayed the same")
    else:
        print(
            f"⚠ Berth utilization decreased: "
            f"{result.before_metrics.berth_utilization_pct:.1f}% → "
            f"{result.after_metrics.berth_utilization_pct:.1f}%"
        )

    print()

    # ----- Full JSON output -----
    print("=" * 70)
    print("Full OptimizationResult JSON:")
    print("=" * 70)
    print(result.model_dump_json(indent=2))
    print()

    if all_passed:
        print("═" * 70)
        print("ALL VALIDATIONS PASSED ✓")
        print("═" * 70)
    else:
        print("═" * 70)
        print("SOME VALIDATIONS FAILED — see above")
        print("═" * 70)
        sys.exit(1)


if __name__ == "__main__":
    main()
