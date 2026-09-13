#!/usr/bin/env python3
"""
Standalone test script for the route recommendation service.

Run from the backend directory:
    python -m app.services.optimization.test_route_recommendation

Validates:
  1. REROUTE is recommended when net time saved > threshold
  2. STAY is recommended when travel time erases savings
  3. STAY when all alternatives are worse
  4. Output matches RouteRecommendation schema
  5. Reasoning string is non-empty
"""

from __future__ import annotations

import sys

from app.data.loader import get_alternative_ports, get_vessel_models
from .models import AlternativePort, Recommendation
from .route_recommendation import recommend_route


def main() -> None:
    print("=" * 70)
    print("DockNova Route Recommendation — Test Run")
    print("=" * 70)
    print()

    vessels = get_vessel_models()
    all_passed = True

    # --- Test 1: Default scenario (HIGH congestion, 8.5h wait) ---
    print("Test 1: Default scenario (HIGH congestion, 8.5h wait)")
    rec = recommend_route(
        vessel_id=vessels[0].id,
        vessel_name=vessels[0].name,
    )
    print(f"  Recommendation: {rec.recommendation.value}")
    print(f"  Time saved:     {rec.time_saved_hours:.2f}h")
    print(f"  Reasoning:      {rec.reasoning}")
    if rec.best_alternative:
        print(f"  Best alt:       {rec.best_alternative.port_name}")
    print()

    # --- Test 2: Very high wait → should REROUTE ---
    print("Test 2: Very high wait (20h) → expect REROUTE")
    rec_high = recommend_route(
        vessel_id="V004",
        vessel_name="Ever Given",
        current_wait_time_hours=20.0,
        current_congestion="CRITICAL",
    )
    print(f"  Recommendation: {rec_high.recommendation.value}")
    print(f"  Time saved:     {rec_high.time_saved_hours:.2f}h")
    if rec_high.recommendation != Recommendation.REROUTE:
        print("  ✗ FAIL: Expected REROUTE with 20h wait")
        all_passed = False
    else:
        print("  ✓ Correctly recommends REROUTE")
    print()

    # --- Test 3: Very low wait → should STAY ---
    print("Test 3: Very low wait (1h) → expect STAY")
    rec_low = recommend_route(
        vessel_id="V002",
        vessel_name="Stena Impala",
        current_wait_time_hours=1.0,
        current_congestion="LOW",
    )
    print(f"  Recommendation: {rec_low.recommendation.value}")
    print(f"  Time saved:     {rec_low.time_saved_hours:.2f}h")
    if rec_low.recommendation != Recommendation.STAY:
        print("  ✗ FAIL: Expected STAY with only 1h wait")
        all_passed = False
    else:
        print("  ✓ Correctly recommends STAY")
    print()

    # --- Test 4: All alternatives worse (huge travel times) ---
    print("Test 4: All alternatives have massive travel times → STAY")
    bad_alts = [
        AlternativePort(
            port_id="PORT-FAR",
            port_name="Very Far Port",
            congestion_level="LOW",
            predicted_wait_time_hours=0.5,
            travel_time_hours=50.0,
            travel_cost_usd=200000,
            available_berths=10,
        ),
    ]
    rec_bad = recommend_route(
        vessel_id="V003",
        vessel_name="Cape Kassos",
        current_wait_time_hours=5.0,
        alternatives=bad_alts,
    )
    print(f"  Recommendation: {rec_bad.recommendation.value}")
    print(f"  Time saved:     {rec_bad.time_saved_hours:.2f}h")
    if rec_bad.recommendation != Recommendation.STAY:
        print("  ✗ FAIL: Expected STAY when alternatives are worse")
        all_passed = False
    else:
        print("  ✓ Correctly recommends STAY")
    print()

    # --- Test 5: Reasoning is non-empty ---
    print("Test 5: Reasoning strings are non-empty")
    for label, r in [("default", rec), ("high", rec_high), ("low", rec_low), ("bad", rec_bad)]:
        if not r.reasoning.strip():
            print(f"  ✗ FAIL: {label} has empty reasoning")
            all_passed = False
        else:
            print(f"  ✓ {label}: '{r.reasoning[:60]}...'")
    print()

    # --- Test 6: Schema — dump JSON ---
    print("Test 6: Sample RouteRecommendation JSON")
    print(rec.model_dump_json(indent=2))
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
