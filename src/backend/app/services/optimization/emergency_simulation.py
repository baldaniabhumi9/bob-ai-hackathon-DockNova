"""
Emergency Disruption Simulation Service for DockNova.

Simulates 5 types of port disruptions by modifying copies of real port data
and re-running the congestion prediction model to produce before/after
snapshots.

Disruption types:
  CRANE_FAILURE         — a target crane goes offline
  BERTH_CLOSURE         — a target berth becomes unavailable
  WEATHER_DELAY         — a delay in hours applied to all incoming vessel ETAs
  STAFF_SHORTAGE        — a percentage reduction applied to overall crane throughput
  EQUIPMENT_BREAKDOWN   — a percentage reduction applied to a specific berth's crane count

This module DOES NOT modify any real dataset or production state.
All operations are pure in-memory; results are ephemeral.

Public API:
    simulate_emergency(request: EmergencySimulationRequest) -> EmergencySimulationResult
"""

from __future__ import annotations

import copy
import math
from datetime import datetime, timedelta
from enum import Enum
from typing import Optional

from .models import (
    BerthModel,
    BerthStatus,
    CamelModel,
    CraneModel,
    CraneStatus,
    Priority,
    VesselModel,
    VesselStatus,
)


# ---------------------------------------------------------------------------
# Pydantic I/O models
# ---------------------------------------------------------------------------


class DisruptionType(str, Enum):
    CRANE_FAILURE = "CRANE_FAILURE"
    BERTH_CLOSURE = "BERTH_CLOSURE"
    WEATHER_DELAY = "WEATHER_DELAY"
    STAFF_SHORTAGE = "STAFF_SHORTAGE"
    EQUIPMENT_BREAKDOWN = "EQUIPMENT_BREAKDOWN"


class EmergencySimulationRequest(CamelModel):
    """
    Input for the emergency disruption simulation endpoint.

    - disruption_type  : one of the 5 DisruptionType values
    - target_id        : crane ID (CRANE_FAILURE) or berth ID
                         (BERTH_CLOSURE, EQUIPMENT_BREAKDOWN)
    - value            : hours for WEATHER_DELAY;
                         reduction % (0–100) for STAFF_SHORTAGE or
                         EQUIPMENT_BREAKDOWN
    """

    disruption_type: DisruptionType
    target_id: Optional[str] = None
    value: Optional[float] = None


class PortStateSnapshot(CamelModel):
    """
    A snapshot of key port metrics at a given point in time.

    Used for both 'before' and 'after' comparisons.
    """

    available_cranes: int
    total_cranes: int
    congestion_pct: float            # 0–100; from predict_congestion probability × 100
    risk_level: str                  # LOW | MEDIUM | HIGH | CRITICAL
    predicted_wait_time_hours: float


class EmergencySimulationResult(CamelModel):
    """
    Complete result of an emergency simulation run.

    Shape matches the required response envelope data:
      { before, after, impact_summary, generated_at }
    """

    before: PortStateSnapshot
    after: PortStateSnapshot
    impact_summary: str
    generated_at: datetime


# ---------------------------------------------------------------------------
# Feature-vector builder for predict_congestion()
# ---------------------------------------------------------------------------

_PRIORITY_WEIGHTS = {Priority.HIGH: 3, Priority.MEDIUM: 2, Priority.LOW: 1}


def _build_port_state(
    vessels: list[VesselModel],
    berths: list[BerthModel],
    cranes: list[CraneModel],
    overrides: Optional[dict] = None,
) -> dict:
    """
    Build the ``current_state`` dict expected by ``predict_congestion()``.

    Keys match FEATURE_COLUMNS in app/services/ml/features.py:
      vessel_arrivals, waiting_vessels, berth_utilization_pct,
      crane_utilization_pct, yard_occupancy_pct,
      avg_service_time_hours, hour_of_day, vessel_priority_avg

    Parameters
    ----------
    overrides : dict | None
        Optional key overrides applied on top of the computed values.
        Used by disruption handlers that must directly influence ML features
        (e.g. STAFF_SHORTAGE raises crane_utilization_pct to model overload).
    """
    waiting = [
        v for v in vessels
        if v.status in (VesselStatus.WAITING, VesselStatus.SCHEDULED)
    ]
    waiting_count = len(waiting)

    # Berth utilization: occupied berths / usable berths
    usable_berths = [b for b in berths if b.status != BerthStatus.MAINTENANCE]
    occupied_berths = sum(1 for b in usable_berths if b.status == BerthStatus.OCCUPIED)
    berth_util = (
        round(occupied_berths / len(usable_berths) * 100, 2)
        if usable_berths else 0.0
    )

    # Crane utilization: OPERATIONAL cranes as a fraction of all cranes —
    # represents how busy the crane pool is (high = cranes are saturated).
    total_cranes = len(cranes)
    operational_cranes = sum(
        1 for c in cranes if c.status == CraneStatus.OPERATIONAL
    )
    crane_util = (
        round(operational_cranes / total_cranes * 100, 2)
        if total_cranes > 0 else 0.0
    )

    # Yard occupancy: heuristic from waiting vessel pressure
    yard_occupancy = min(95.0, waiting_count * 7.5)

    # Average service time from vessel handling estimates
    avg_service = (
        sum(v.estimated_handling_hours for v in waiting) / waiting_count
        if waiting_count > 0 else 12.0
    )

    # Priority average (HIGH=3, MEDIUM=2, LOW=1)
    priority_avg = (
        sum(_PRIORITY_WEIGHTS.get(v.priority, 2) for v in waiting) / waiting_count
        if waiting_count > 0 else 2.0
    )

    state = {
        "vessel_arrivals": waiting_count,
        "waiting_vessels": waiting_count,
        "berth_utilization_pct": berth_util,
        "crane_utilization_pct": crane_util,
        "yard_occupancy_pct": yard_occupancy,
        "avg_service_time_hours": avg_service,
        "hour_of_day": datetime.utcnow().hour,
        "vessel_priority_avg": round(priority_avg, 2),
    }

    if overrides:
        state.update(overrides)

    return state


# ---------------------------------------------------------------------------
# Snapshot builder
# ---------------------------------------------------------------------------


def _snapshot(
    vessels: list[VesselModel],
    berths: list[BerthModel],
    cranes: list[CraneModel],
    feature_overrides: Optional[dict] = None,
) -> PortStateSnapshot:
    """
    Compute a PortStateSnapshot by calling predict_congestion()
    with the port state derived from the given data copies.

    Parameters
    ----------
    feature_overrides : dict | None
        Optional ML feature overrides applied on top of the computed state.
        Used when a disruption's effect must be expressed directly in feature
        space (e.g. STAFF_SHORTAGE raises crane_utilization_pct to model
        overload; WEATHER_DELAY increases vessel_arrivals to model compression).
    """
    from app.services.ml.predict import predict_congestion  # lazy import

    state = _build_port_state(vessels, berths, cranes, overrides=feature_overrides)
    forecast = predict_congestion(state)

    available_cranes = sum(
        1 for c in cranes
        if c.status in (CraneStatus.OPERATIONAL, CraneStatus.IDLE)
    )
    total_cranes = len(cranes)

    return PortStateSnapshot(
        available_cranes=available_cranes,
        total_cranes=total_cranes,
        congestion_pct=round(forecast.congestion_probability * 100, 2),
        risk_level=forecast.risk_level,
        predicted_wait_time_hours=round(forecast.predicted_wait_time_hours, 2),
    )


# ---------------------------------------------------------------------------
# Disruption applicators — each returns modified deep copies
# ---------------------------------------------------------------------------


def _apply_crane_failure(
    vessels: list[VesselModel],
    berths: list[BerthModel],
    cranes: list[CraneModel],
    target_id: Optional[str],
) -> tuple[list[VesselModel], list[BerthModel], list[CraneModel]]:
    """Take target crane offline (MAINTENANCE). Default: first OPERATIONAL crane."""
    cranes_copy = [copy.copy(c) for c in cranes]

    target = None
    if target_id:
        target = next((c for c in cranes_copy if c.id == target_id), None)
    if target is None:
        # Fall back to first OPERATIONAL crane
        target = next(
            (c for c in cranes_copy if c.status == CraneStatus.OPERATIONAL), None
        )

    if target is not None:
        target.status = CraneStatus.MAINTENANCE

    return vessels, berths, cranes_copy


def _apply_berth_closure(
    vessels: list[VesselModel],
    berths: list[BerthModel],
    cranes: list[CraneModel],
    target_id: Optional[str],
) -> tuple[list[VesselModel], list[BerthModel], list[CraneModel]]:
    """Mark target berth MAINTENANCE (unavailable). Default: first AVAILABLE berth."""
    berths_copy = [copy.copy(b) for b in berths]

    target = None
    if target_id:
        target = next((b for b in berths_copy if b.id == target_id), None)
    if target is None:
        target = next(
            (b for b in berths_copy if b.status == BerthStatus.AVAILABLE), None
        )

    if target is not None:
        target.status = BerthStatus.MAINTENANCE

    return vessels, berths_copy, cranes


def _apply_weather_delay(
    vessels: list[VesselModel],
    berths: list[BerthModel],
    cranes: list[CraneModel],
    delay_hours: float,
) -> tuple[list[VesselModel], list[BerthModel], list[CraneModel], dict]:
    """
    Push all incoming vessel ETAs forward by delay_hours.

    Weather delays cause vessels to accumulate in the anchorage — all
    waiting vessels now arrive in a compressed future window, dramatically
    increasing vessel arrival density and yard occupancy.  Since the ML
    model's ``predict_congestion`` uses ``vessel_arrivals`` and
    ``yard_occupancy_pct`` as key features, we model this via direct
    feature overrides that reflect the arrival compression effect.
    """
    delay_hours = max(0.0, delay_hours)
    delta = timedelta(hours=delay_hours)
    vessels_copy = []
    for v in vessels:
        vc = copy.copy(v)
        if vc.status in (VesselStatus.WAITING, VesselStatus.SCHEDULED):
            vc.eta = vc.eta + delta
            vc.etd = vc.etd + delta
        vessels_copy.append(vc)

    # Feature overrides: weather delay compresses arrivals and fills the yard.
    # arrival_factor scales with delay: a 12h delay roughly doubles arrival pressure.
    base_waiting = sum(
        1 for v in vessels
        if v.status in (VesselStatus.WAITING, VesselStatus.SCHEDULED)
    )
    arrival_factor = 1.0 + (delay_hours / 12.0)  # 12h → 2×, 24h → 3×, etc.
    boosted_arrivals = round(base_waiting * arrival_factor)
    boosted_yard = min(95.0, base_waiting * 7.5 * arrival_factor)
    avg_svc = (
        sum(v.estimated_handling_hours for v in vessels_copy
            if v.status in (VesselStatus.WAITING, VesselStatus.SCHEDULED))
        / boosted_arrivals
        if boosted_arrivals > 0 else 12.0
    )

    overrides = {
        "vessel_arrivals": boosted_arrivals,
        "waiting_vessels": boosted_arrivals,
        "yard_occupancy_pct": boosted_yard,
        "avg_service_time_hours": avg_svc,
    }
    return vessels_copy, berths, cranes, overrides


def _apply_staff_shortage(
    vessels: list[VesselModel],
    berths: list[BerthModel],
    cranes: list[CraneModel],
    reduction_pct: float,
) -> tuple[list[VesselModel], list[BerthModel], list[CraneModel], dict]:
    """
    Simulate a staff shortage by taking the bottom fraction of cranes offline
    and elevating crane utilization to reflect overload on remaining cranes.

    When staff is reduced, fewer cranes operate but each remaining crane
    handles a larger workload share — modelled as an increased
    ``crane_utilization_pct`` feature override (cranes are saturated).
    """
    reduction_pct = max(0.0, min(99.0, reduction_pct))
    cranes_copy = [copy.copy(c) for c in cranes]

    # Mark the lowest-capacity share of OPERATIONAL cranes offline.
    operational = [c for c in cranes_copy if c.status == CraneStatus.OPERATIONAL]
    n_offline = math.ceil(len(operational) * (reduction_pct / 100.0))
    operational_sorted = sorted(operational, key=lambda c: c.capacity_teu_per_hour)
    for c in operational_sorted[:n_offline]:
        c.status = CraneStatus.MAINTENANCE

    # Feature override: remaining cranes are saturated — crane utilization
    # rises above normal as fewer cranes handle the same vessel demand.
    # Model: utilization = min(100, base_util / (1 - reduction_pct/100)).
    total = len(cranes_copy)
    remaining_operational = sum(
        1 for c in cranes_copy if c.status == CraneStatus.OPERATIONAL
    )
    base_util = (remaining_operational / total * 100) if total > 0 else 0.0
    # Invert: remaining cranes carry the full load → utilization amplified
    load_factor = 1.0 / max(0.01, 1.0 - (reduction_pct / 100.0))
    boosted_util = min(100.0, base_util * load_factor)

    overrides = {"crane_utilization_pct": round(boosted_util, 2)}
    return vessels, berths, cranes_copy, overrides


def _apply_equipment_breakdown(
    vessels: list[VesselModel],
    berths: list[BerthModel],
    cranes: list[CraneModel],
    target_id: Optional[str],
    reduction_pct: float,
) -> tuple[list[VesselModel], list[BerthModel], list[CraneModel]]:
    """
    Take reduction_pct % of cranes at target_id berth offline.

    If target_id is not specified, applies to the berth with the most cranes.
    """
    reduction_pct = max(0.0, min(99.0, reduction_pct))
    cranes_copy = [copy.copy(c) for c in cranes]

    # Determine target berth
    if not target_id:
        # Find berth with most OPERATIONAL cranes
        from collections import Counter
        counts = Counter(
            c.berth_id for c in cranes_copy if c.status == CraneStatus.OPERATIONAL
        )
        target_id = counts.most_common(1)[0][0] if counts else None

    if target_id:
        berth_cranes = [
            c for c in cranes_copy
            if c.berth_id == target_id and c.status == CraneStatus.OPERATIONAL
        ]
        n_offline = max(1, math.ceil(len(berth_cranes) * (reduction_pct / 100.0)))
        # Take lowest-capacity cranes offline first
        berth_cranes_sorted = sorted(
            berth_cranes, key=lambda c: c.capacity_teu_per_hour
        )
        for c in berth_cranes_sorted[:n_offline]:
            c.status = CraneStatus.MAINTENANCE

    return vessels, berths, cranes_copy


# ---------------------------------------------------------------------------
# Impact summary generator
# ---------------------------------------------------------------------------


def _generate_impact_summary(
    request: EmergencySimulationRequest,
    before: PortStateSnapshot,
    after: PortStateSnapshot,
    vessels: list[VesselModel],
    berths: list[BerthModel],
    cranes: list[CraneModel],
) -> str:
    """Generate a plain-English impact summary describing what changed and why."""
    congestion_delta = after.congestion_pct - before.congestion_pct
    wait_delta = after.predicted_wait_time_hours - before.predicted_wait_time_hours
    crane_delta = before.available_cranes - after.available_cranes

    disruption = request.disruption_type
    target = request.target_id or "unspecified target"
    value = request.value

    direction = "raises" if congestion_delta > 0 else "reduces"
    congestion_change = f"from {before.congestion_pct:.1f}% to {after.congestion_pct:.1f}%"
    wait_change = (
        f"increasing expected wait time by {wait_delta:.1f}h"
        if wait_delta > 0.1
        else f"reducing expected wait time by {abs(wait_delta):.1f}h"
        if wait_delta < -0.1
        else "with minimal impact on wait times"
    )

    if disruption == DisruptionType.CRANE_FAILURE:
        crane_name = next(
            (c.name for c in cranes if c.id == (request.target_id or "")),
            request.target_id or "the target crane",
        )
        return (
            f"Crane {crane_name} failure takes {crane_delta} crane(s) offline, "
            f"{direction} port congestion risk {congestion_change}, {wait_change}. "
            f"Remaining capacity: {after.available_cranes}/{after.total_cranes} cranes operational."
        )

    elif disruption == DisruptionType.BERTH_CLOSURE:
        berth_name = next(
            (b.name for b in berths if b.id == (request.target_id or "")),
            request.target_id or "the target berth",
        )
        return (
            f"Closure of {berth_name} removes a berthing slot from service, "
            f"{direction} congestion risk {congestion_change}, {wait_change}."
        )

    elif disruption == DisruptionType.WEATHER_DELAY:
        delay = value or 0.0
        return (
            f"A {delay:.0f}-hour weather delay pushes all incoming vessel ETAs forward, "
            f"compressing future berth demand and {direction} congestion risk "
            f"{congestion_change}, {wait_change}."
        )

    elif disruption == DisruptionType.STAFF_SHORTAGE:
        pct = value or 0.0
        return (
            f"A {pct:.0f}% staff shortage reduces crane throughput and takes "
            f"{crane_delta} crane(s) offline, {direction} congestion risk "
            f"{congestion_change}, {wait_change}. "
            f"Available cranes drop from {before.available_cranes} to {after.available_cranes}."
        )

    elif disruption == DisruptionType.EQUIPMENT_BREAKDOWN:
        berth_name = next(
            (b.name for b in berths if b.id == (request.target_id or "")),
            request.target_id or "the target berth",
        )
        pct = value or 0.0
        return (
            f"Equipment breakdown at {berth_name} reduces crane count by ~{pct:.0f}%, "
            f"taking {crane_delta} crane(s) offline, {direction} congestion risk "
            f"{congestion_change}, {wait_change}."
        )

    return (
        f"Disruption {disruption.value} applied; congestion {direction} {congestion_change}."
    )


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------


def simulate_emergency(
    request: EmergencySimulationRequest,
) -> EmergencySimulationResult:
    """
    Run an emergency disruption simulation.

    Loads real port data, computes a 'before' snapshot, applies the
    requested disruption to in-memory copies, computes an 'after' snapshot,
    and returns both alongside an impact summary.

    Parameters
    ----------
    request : EmergencySimulationRequest
        The disruption type and optional parameters (target_id, value).

    Returns
    -------
    EmergencySimulationResult
        { before, after, impact_summary, generated_at }
    """
    from app.data.loader import get_berth_models, get_crane_models, get_vessel_models

    vessels: list[VesselModel] = list(get_vessel_models())
    berths: list[BerthModel] = list(get_berth_models())
    cranes: list[CraneModel] = list(get_crane_models())

    # --- BEFORE snapshot ---
    before = _snapshot(vessels, berths, cranes)

    # --- Apply disruption ---
    # Some disruptions return a 4-tuple (v, b, c, feature_overrides) when
    # the disruption effect is best expressed via direct ML feature overrides
    # rather than purely through modified data objects.
    dt = request.disruption_type
    feature_overrides: dict = {}

    if dt == DisruptionType.CRANE_FAILURE:
        v2, b2, c2 = _apply_crane_failure(vessels, berths, cranes, request.target_id)

    elif dt == DisruptionType.BERTH_CLOSURE:
        v2, b2, c2 = _apply_berth_closure(vessels, berths, cranes, request.target_id)

    elif dt == DisruptionType.WEATHER_DELAY:
        delay = float(request.value or 6.0)
        v2, b2, c2, feature_overrides = _apply_weather_delay(vessels, berths, cranes, delay)

    elif dt == DisruptionType.STAFF_SHORTAGE:
        pct = float(request.value or 30.0)
        v2, b2, c2, feature_overrides = _apply_staff_shortage(vessels, berths, cranes, pct)

    elif dt == DisruptionType.EQUIPMENT_BREAKDOWN:
        pct = float(request.value or 50.0)
        v2, b2, c2 = _apply_equipment_breakdown(
            vessels, berths, cranes, request.target_id, pct
        )

    else:
        # Should never happen — Pydantic validates the enum
        v2, b2, c2 = vessels, berths, cranes

    # --- AFTER snapshot ---
    after = _snapshot(v2, b2, c2, feature_overrides=feature_overrides or None)

    # --- Impact summary ---
    summary = _generate_impact_summary(request, before, after, vessels, berths, cranes)

    return EmergencySimulationResult(
        before=before,
        after=after,
        impact_summary=summary,
        generated_at=datetime.utcnow(),
    )
