"""
Unit tests for DockNova optimization services.

Validates:
  1. berth_allocation never double-books a berth
  2. crane_allocation respects min/max crane bounds and status rules
  3. route_recommendation only returns REROUTE when time_saved_hours > 0
"""

from __future__ import annotations

import pytest

from app.data.loader import (
    REFERENCE_TIME,
    get_berth_models,
    get_crane_models,
    get_vessel_models,
    get_vessel_workloads,
)
from app.services.optimization.berth_allocation import optimize_berth_allocation
from app.services.optimization.crane_allocation import optimize_crane_allocation
from app.services.optimization.models import CraneStatus, Recommendation
from app.services.optimization.route_recommendation import recommend_route


def test_berth_allocation_no_double_booking() -> None:
    """Assert berth_allocation never double-books a berth."""
    vessels = get_vessel_models()
    berths = get_berth_models()

    result = optimize_berth_allocation(
        vessels=vessels,
        berths=berths,
        reference_time=REFERENCE_TIME,
    )

    assert result.solver_status in ("OPTIMAL", "FEASIBLE")
    assert len(result.assignments) > 0

    # Group assignments by berth_id
    by_berth: dict[str, list] = {}
    for a in result.assignments:
        by_berth.setdefault(a.berth_id, []).append(a)

    # Verify no overlaps on any berth
    for bid, assignments in by_berth.items():
        sorted_assignments = sorted(assignments, key=lambda a: a.start_time)
        for i in range(len(sorted_assignments) - 1):
            assert sorted_assignments[i].end_time <= sorted_assignments[i + 1].start_time, (
                f"Overlap on berth {bid}: {sorted_assignments[i].vessel_id} ends at "
                f"{sorted_assignments[i].end_time}, but {sorted_assignments[i+1].vessel_id} "
                f"starts at {sorted_assignments[i+1].start_time}"
            )


def test_crane_allocation_respects_bounds() -> None:
    """Assert crane_allocation respects min/max crane bounds and crane status."""
    cranes = get_crane_models()

    # Test with max_cranes = 1
    result_max1 = optimize_crane_allocation(
        berth_id="B01",
        berth_name="Container Terminal Alpha",
        vessel_id="V004",
        vessel_name="Ardmore Seawolf",
        workload_teu=400.0,
        cranes=cranes,
        min_cranes=1,
        max_cranes=1,
    )
    assert len(result_max1.assignments) == 1
    assert result_max1.assignments[0].num_cranes <= 1

    # Test with default bounds (available count)
    b01_available = [c for c in cranes if c.berth_id == "B01" and c.status != CraneStatus.MAINTENANCE]
    result_default = optimize_crane_allocation(
        berth_id="B01",
        berth_name="Container Terminal Alpha",
        vessel_id="V004",
        vessel_name="Ardmore Seawolf",
        workload_teu=400.0,
        cranes=cranes,
    )
    assert len(result_default.assignments) == 1
    assigned_count = result_default.assignments[0].num_cranes
    assert 1 <= assigned_count <= len(b01_available)

    # Assert no MAINTENANCE cranes were assigned
    maint_ids = {c.id for c in cranes if c.status == CraneStatus.MAINTENANCE}
    assigned_ids = set(result_default.assignments[0].crane_ids)
    assert not (assigned_ids & maint_ids), "MAINTENANCE crane was assigned!"


def test_route_recommendation_reroute_time_saved() -> None:
    """Assert route_recommendation only returns REROUTE when time_saved_hours > 0."""
    vessels = get_vessel_models()
    vessel = vessels[0]

    # Case 1: Default scenario
    rec_default = recommend_route(vessel_id=vessel.id, vessel_name=vessel.name)
    if rec_default.recommendation == Recommendation.REROUTE:
        assert rec_default.time_saved_hours > 0
    else:
        assert rec_default.recommendation == Recommendation.STAY

    # Case 2: High wait (20h) -> expects REROUTE and time_saved_hours > 0
    rec_high = recommend_route(
        vessel_id=vessel.id,
        vessel_name=vessel.name,
        current_wait_time_hours=20.0,
        current_congestion="CRITICAL",
    )
    assert rec_high.recommendation == Recommendation.REROUTE
    assert rec_high.time_saved_hours > 0
    assert rec_high.best_alternative is not None

    # Case 3: Low wait (1h) -> expects STAY and time_saved_hours <= 0
    rec_low = recommend_route(
        vessel_id=vessel.id,
        vessel_name=vessel.name,
        current_wait_time_hours=1.0,
        current_congestion="LOW",
    )
    assert rec_low.recommendation == Recommendation.STAY
    assert rec_low.time_saved_hours <= 0
    assert rec_low.best_alternative is not None
