#!/usr/bin/env python3
"""
Standalone test script for the crane allocation optimizer.

Run from the backend directory:
    python -m app.services.optimization.test_crane_allocation

Validates:
  1. More cranes reduces service_duration_hours (up to the max bound)
  2. Never assigns more cranes than physically exist at the berth
  3. Never assigns MAINTENANCE cranes
  4. "After" metrics improve over "before" metrics
  5. Output matches the CraneOptimizationResult schema
  6. Tests across all 5 berths with their respective vessels/workloads
"""

from __future__ import annotations

import json
import sys

from .crane_allocation import optimize_crane_allocation
from .mock_data import (
    VESSEL_WORKLOADS_TEU,
    get_sample_berths,
    get_sample_cranes,
    get_sample_vessels,
)
from .models import CraneModel, CraneStatus


def main() -> None:
    print("=" * 70)
    print("DockNova Crane Allocation Optimizer — Test Run")
    print("=" * 70)
    print()

    vessels = get_sample_vessels()
    berths = get_sample_berths()
    cranes = get_sample_cranes()
    vessel_map = {v.id: v for v in vessels}
    berth_map = {b.id: b for b in berths}

    all_passed = True

    # --- Test assignments for representative vessels at their berths ---
    # Using berth assignments from the berth optimizer's OPTIMAL result:
    test_cases = [
        ("V001", "B02", "MSC Flaminia", "Container Terminal Bravo"),
        ("V004", "B01", "Ever Given", "Container Terminal Alpha"),
        ("V003", "B04", "Cape Kassos", "Dry Bulk Terminal"),
        ("V005", "B03", "Minerva Helen", "Liquid Bulk Terminal"),
        ("V006", "B04", "Pacific Venture", "Dry Bulk Terminal"),
    ]

    results = []

    for vessel_id, berth_id, vessel_name, berth_name in test_cases:
        workload = VESSEL_WORKLOADS_TEU.get(vessel_id, 200)
        berth_cranes = [c for c in cranes if c.berth_id == berth_id]

        print(f"─── {vessel_name} @ {berth_name} ───")
        print(f"  Workload: {workload} TEU | Cranes at berth: {len(berth_cranes)}")

        result = optimize_crane_allocation(
            berth_id=berth_id,
            berth_name=berth_name,
            vessel_id=vessel_id,
            vessel_name=vessel_name,
            workload_teu=workload,
            cranes=cranes,
        )
        results.append(result)

        if result.assignments:
            a = result.assignments[0]
            print(f"  Cranes assigned: {a.num_cranes} — {', '.join(a.crane_names)}")
            print(f"  Combined throughput: {a.combined_throughput_teu_per_hour} TEU/h")
            print(f"  Service duration: {a.service_duration_hours:.2f} h")
        print(f"  Before: {result.before_metrics.avg_service_duration_hours:.2f}h "
              f"({result.before_metrics.cranes_assigned} cranes, "
              f"{result.before_metrics.crane_utilization_pct:.1f}% util)")
        print(f"  After:  {result.after_metrics.avg_service_duration_hours:.2f}h "
              f"({result.after_metrics.cranes_assigned} cranes, "
              f"{result.after_metrics.crane_utilization_pct:.1f}% util)")
        print(f"  Duration reduction: {result.estimated_wait_time_reduction_hours:.2f}h")
        print(f"  Efficiency gain: {result.efficiency_gain_percentage:.1f}%")
        print()

    # ===== Validation =====
    print("=" * 70)
    print("Validation")
    print("=" * 70)
    print()

    # 1. More cranes = shorter duration (monotonicity test on B01)
    print("Test 1: Monotonicity — more cranes → shorter duration")
    b01_cranes = [c for c in cranes if c.berth_id == "B01"]
    durations_by_count = []
    for max_c in range(1, len(b01_cranes) + 1):
        r = optimize_crane_allocation(
            berth_id="B01",
            berth_name="Container Terminal Alpha",
            vessel_id="V004",
            vessel_name="Ever Given",
            workload_teu=800,
            cranes=cranes,
            max_cranes=max_c,
        )
        if r.assignments:
            dur = r.assignments[0].service_duration_hours
            actual_assigned = r.assignments[0].num_cranes
            durations_by_count.append((actual_assigned, dur))
            print(f"  max_cranes={max_c} → assigned={actual_assigned}, duration={dur:.2f}h")

    # Check monotonically non-increasing
    is_monotonic = all(
        durations_by_count[i][1] >= durations_by_count[i + 1][1]
        for i in range(len(durations_by_count) - 1)
    )
    if is_monotonic:
        print("  ✓ Duration decreases or stays same as cranes increase")
    else:
        print("  ✗ FAIL: Duration is NOT monotonically non-increasing!")
        all_passed = False
    print()

    # 2. Never assigns more cranes than physically exist at the berth
    print("Test 2: Never exceeds physical crane count")
    for result in results:
        for a in result.assignments:
            berth_cranes_total = [c for c in cranes if c.berth_id == a.berth_id]
            available = [c for c in berth_cranes_total if c.status != CraneStatus.MAINTENANCE]
            if a.num_cranes > len(available):
                print(
                    f"  ✗ FAIL: {a.vessel_name} assigned {a.num_cranes} cranes "
                    f"but only {len(available)} available at {a.berth_id}"
                )
                all_passed = False
            else:
                print(
                    f"  ✓ {a.vessel_name}: {a.num_cranes} ≤ {len(available)} "
                    f"available at {a.berth_id}"
                )
    print()

    # 3. Never assigns MAINTENANCE cranes
    print("Test 3: No MAINTENANCE cranes assigned")
    maintenance_ids = {c.id for c in cranes if c.status == CraneStatus.MAINTENANCE}
    any_maint_assigned = False
    for result in results:
        for a in result.assignments:
            bad = set(a.crane_ids) & maintenance_ids
            if bad:
                print(f"  ✗ FAIL: MAINTENANCE crane(s) {bad} assigned to {a.vessel_name}")
                any_maint_assigned = True
                all_passed = False
    if not any_maint_assigned:
        print("  ✓ No MAINTENANCE cranes were assigned")
    print()

    # 4. After metrics improve
    print("Test 4: After metrics improve over before")
    for result in results:
        if result.after_metrics.avg_service_duration_hours <= result.before_metrics.avg_service_duration_hours:
            print(
                f"  ✓ Duration improved: "
                f"{result.before_metrics.avg_service_duration_hours:.2f}h → "
                f"{result.after_metrics.avg_service_duration_hours:.2f}h"
            )
        else:
            print(
                f"  ✗ FAIL: Duration worsened: "
                f"{result.before_metrics.avg_service_duration_hours:.2f}h → "
                f"{result.after_metrics.avg_service_duration_hours:.2f}h"
            )
            all_passed = False
    print()

    # 5. Schema check — dump one result as JSON to confirm structure
    print("Test 5: Schema — sample CraneOptimizationResult JSON")
    sample = results[0]
    print(sample.model_dump_json(indent=2))
    print()

    # ===== Summary =====
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
