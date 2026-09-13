#!/usr/bin/env python3
"""
Standalone test script for the 72-hour operations plan generator.

Run from the backend directory:
    python -m app.services.optimization.test_operations_plan

Validates:
  1. Plan only includes vessels within the 72-hour window
  2. All assigned vessels have valid berth IDs from the berth pool
  3. No two entries share overlapping berth time slots
  4. Crane counts are plausible (> 0 for assigned vessels)
  5. Status derivation is correct (SCHEDULED / IN_PROGRESS / DELAYED)
  6. Output matches OperationsPlanResult schema
"""

from __future__ import annotations

import sys
from datetime import datetime, timedelta

from .mock_data import (
    REFERENCE_TIME,
    get_sample_berths,
    get_sample_cranes,
    get_sample_vessels,
)
from .models import PlanEntryStatus
from .operations_plan import generate_operations_plan


def main() -> None:
    print("=" * 70)
    print("DockNova 72-Hour Operations Plan — Test Run")
    print("=" * 70)
    print()

    vessels = get_sample_vessels(REFERENCE_TIME)
    berths = get_sample_berths(REFERENCE_TIME)
    cranes = get_sample_cranes()
    all_passed = True

    # --- Generate plan ---
    print("Generating 72-hour operations plan...")
    plan = generate_operations_plan(
        vessels=vessels,
        berths=berths,
        cranes=cranes,
        reference_time=REFERENCE_TIME,
    )
    print(f"Plan generated: {plan.total_vessels} vessels, "
          f"{plan.scheduled_count} scheduled, "
          f"{plan.in_progress_count} in-progress, "
          f"{plan.delayed_count} delayed")
    print()

    # --- Display entries ---
    print(f"Plan Entries ({len(plan.entries)}):")
    print("-" * 70)
    for e in plan.entries:
        print(
            f"  {e.vessel_name:<25} | {e.berth_name:<25} | "
            f"{e.start_time.strftime('%H:%M')}–{e.end_time.strftime('%H:%M')} | "
            f"Cranes: {e.crane_count} | {e.service_duration_hours:.1f}h | "
            f"{e.status.value}"
        )
    print()

    # --- Test 1: Only vessels within 72h window ---
    print("Test 1: All entries within 72-hour window")
    horizon_end = REFERENCE_TIME + timedelta(hours=72)
    out_of_window = [e for e in plan.entries if e.eta > horizon_end]
    if out_of_window:
        print(f"  ✗ FAIL: {len(out_of_window)} entries outside 72h window")
        all_passed = False
    else:
        print(f"  ✓ All {len(plan.entries)} entries within 72h window")
    print()

    # --- Test 2: Valid berth IDs ---
    print("Test 2: All assigned vessels have valid berth IDs")
    valid_berth_ids = {b.id for b in berths} | {"UNASSIGNED"}
    bad_berths = [e for e in plan.entries if e.berth_id not in valid_berth_ids]
    if bad_berths:
        print(f"  ✗ FAIL: {len(bad_berths)} entries with unknown berth IDs")
        all_passed = False
    else:
        print(f"  ✓ All berth IDs are valid")
    print()

    # --- Test 3: No overlapping berth assignments ---
    print("Test 3: No overlapping berth time slots")
    by_berth: dict[str, list] = {}
    for e in plan.entries:
        if e.berth_id != "UNASSIGNED":
            by_berth.setdefault(e.berth_id, []).append(e)

    overlap_found = False
    for bid, entries in by_berth.items():
        sorted_entries = sorted(entries, key=lambda e: e.start_time)
        for i in range(len(sorted_entries) - 1):
            if sorted_entries[i].end_time > sorted_entries[i + 1].start_time:
                print(
                    f"  ✗ OVERLAP on {bid}: {sorted_entries[i].vessel_name} "
                    f"ends {sorted_entries[i].end_time.strftime('%H:%M')}, "
                    f"but {sorted_entries[i+1].vessel_name} starts "
                    f"{sorted_entries[i+1].start_time.strftime('%H:%M')}"
                )
                overlap_found = True
                all_passed = False

    if not overlap_found:
        print("  ✓ No overlapping assignments")
    print()

    # --- Test 4: Crane counts > 0 for assigned vessels ---
    print("Test 4: Crane counts are plausible")
    assigned_entries = [e for e in plan.entries if e.berth_id != "UNASSIGNED"]
    zero_cranes = [e for e in assigned_entries if e.crane_count == 0]
    if zero_cranes:
        print(f"  ✗ FAIL: {len(zero_cranes)} assigned vessels have 0 cranes")
        for e in zero_cranes:
            print(f"    → {e.vessel_name} at {e.berth_name}")
        all_passed = False
    else:
        print(f"  ✓ All {len(assigned_entries)} assigned vessels have cranes")
    print()

    # --- Test 5: Status derivation ---
    print("Test 5: Status derivation")
    for e in plan.entries:
        delay_h = (e.start_time - e.eta).total_seconds() / 3600
        if e.berth_id == "UNASSIGNED":
            expected = PlanEntryStatus.DELAYED
        elif delay_h > 2.0:
            expected = PlanEntryStatus.DELAYED
        elif e.start_time <= REFERENCE_TIME:
            expected = PlanEntryStatus.IN_PROGRESS
        else:
            expected = PlanEntryStatus.SCHEDULED

        if e.status != expected:
            print(
                f"  ✗ FAIL: {e.vessel_name} has status {e.status.value} "
                f"but expected {expected.value} (delay={delay_h:.1f}h)"
            )
            all_passed = False
        else:
            print(f"  ✓ {e.vessel_name}: {e.status.value} (delay={delay_h:.1f}h)")
    print()

    # --- Test 6: Schema — dump sample JSON ---
    print("Test 6: Sample OperationsPlanResult JSON (first 2 entries)")
    # Dump plan with only first 2 entries for readability
    import json
    d = plan.model_dump(mode="json")
    d["entries"] = d["entries"][:2]
    print(json.dumps(d, indent=2, default=str))
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
