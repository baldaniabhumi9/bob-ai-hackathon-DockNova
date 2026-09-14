"""
Per-berth operational risk scoring for DockNova.

This is a lightweight, formula-based module — it does NOT call predict_congestion()
or the trained ML model (which stays port-level).  It uses only data that is already
available per berth in the live state: occupancy status, the priority of the currently
assigned vessel, and crane availability at that berth.

Public API
----------
    get_per_berth_risk(berths, cranes, vessels) -> list[BerthRisk]

Formula (documented)
--------------------
    score = (occupancy_weight * 40)
          + (priority_weight  * 35)
          + (crane_pressure   * 25)

    Component details
    ~~~~~~~~~~~~~~~~~
    occupancy_weight  — reflects how much the berth is consuming capacity:
        OCCUPIED     → 1.00   (berth in active use)
        MAINTENANCE  → 0.60   (berth unavailable, adds scheduling pressure)
        AVAILABLE    → 0.00   (berth free, no risk contribution)

    priority_weight   — reflects urgency of the vessel at this berth (if any):
        HIGH vessel  → 1.00
        MEDIUM vessel→ 0.50
        LOW vessel   → 0.20
        no vessel    → 0.00

    crane_pressure    — fraction of this berth's cranes that are *not* operational
                        (MAINTENANCE or any non-OPERATIONAL / non-IDLE status):
        = 1 - (operational_or_idle / total_cranes_at_berth)
        If a berth has no cranes assigned at all → 0.0
        (no cranes means no crane-driven pressure; it may be a non-crane berth)

    Max possible score:
        OCCUPIED + HIGH + all cranes down  → 40 + 35 + 25 = 100
    Typical occupied berth, medium priority, one crane down out of 3:
        40 + 17.5 + 8.3 ≈ 66  → WARNING

Thresholds
~~~~~~~~~~
    NORMAL   : score < 50
    WARNING  : 50 ≤ score < 75
    CRITICAL : score ≥ 75
"""

from __future__ import annotations

from typing import Literal, Optional

from app.services.optimization.models import (
    BerthModel,
    BerthStatus,
    CamelModel,
    CraneModel,
    CraneStatus,
    Priority,
    VesselModel,
)

# ---------------------------------------------------------------------------
# Output model (camelCase-serialised via CamelModel for the API response)
# ---------------------------------------------------------------------------

RiskLevel = Literal["NORMAL", "WARNING", "CRITICAL"]


class BerthRisk(CamelModel):
    """
    Per-berth risk assessment derived from occupancy, vessel priority,
    and crane availability — no ML inference involved.
    """

    berth_id: str
    berth_name: str
    risk_score: float          # 0–100 (see formula above)
    risk_level: RiskLevel      # NORMAL / WARNING / CRITICAL
    utilization_pct: float     # 0 / 100 / MAINTENANCE → 60 (for display)
    occupancy_status: str      # AVAILABLE / OCCUPIED / MAINTENANCE
    vessel_id: Optional[str] = None
    vessel_name: Optional[str] = None
    vessel_priority: Optional[str] = None
    total_cranes: int          # cranes assigned to this berth
    operational_cranes: int    # cranes in OPERATIONAL or IDLE status


# ---------------------------------------------------------------------------
# Weights (module-level constants so tests can import and verify them)
# ---------------------------------------------------------------------------

OCCUPANCY_WEIGHT_MAX = 40.0   # points when fully occupied
PRIORITY_WEIGHT_MAX  = 35.0   # points for highest-priority vessel
CRANE_PRESSURE_MAX   = 25.0   # points when all cranes are down

_OCCUPANCY_FACTOR: dict[str, float] = {
    BerthStatus.OCCUPIED:    1.00,
    BerthStatus.MAINTENANCE: 0.60,
    BerthStatus.AVAILABLE:   0.00,
}

_PRIORITY_FACTOR: dict[str, float] = {
    Priority.HIGH:   1.00,
    Priority.MEDIUM: 0.50,
    Priority.LOW:    0.20,
}

_RISK_THRESHOLDS: list[tuple[float, RiskLevel]] = [
    (75.0, "CRITICAL"),
    (50.0, "WARNING"),
    (0.0,  "NORMAL"),
]


def _score_to_level(score: float) -> RiskLevel:
    for threshold, level in _RISK_THRESHOLDS:
        if score >= threshold:
            return level
    return "NORMAL"


# ---------------------------------------------------------------------------
# Main scoring function
# ---------------------------------------------------------------------------

def get_per_berth_risk(
    berths: list[BerthModel],
    cranes: list[CraneModel],
    vessels: list[VesselModel],
) -> list[BerthRisk]:
    """
    Compute a risk score for each berth.

    Parameters
    ----------
    berths  : list of all BerthModel objects (from live_state or loader)
    cranes  : list of all CraneModel objects (from live_state or loader)
    vessels : list of all VesselModel objects (from live_state or loader)

    Returns
    -------
    list[BerthRisk] in the same order as `berths`
    """
    # Build lookup: vessel_id → vessel (for priority lookup)
    vessel_map: dict[str, VesselModel] = {v.id: v for v in vessels}

    # Build lookup: berth_id → cranes at that berth
    cranes_by_berth: dict[str, list[CraneModel]] = {}
    for crane in cranes:
        cranes_by_berth.setdefault(crane.berth_id, []).append(crane)

    results: list[BerthRisk] = []

    for berth in berths:
        # ── 1. Occupancy component ──────────────────────────────────────────
        occ_factor = _OCCUPANCY_FACTOR.get(berth.status, 0.0)
        occupancy_component = occ_factor * OCCUPANCY_WEIGHT_MAX

        # Utilisation % for display (binary from status, not from ML)
        if berth.status == BerthStatus.OCCUPIED:
            util_pct = 100.0
        elif berth.status == BerthStatus.MAINTENANCE:
            util_pct = 60.0   # maintenance blocks the berth
        else:
            util_pct = 0.0

        # ── 2. Vessel priority component ────────────────────────────────────
        assigned_vessel: Optional[VesselModel] = None
        if berth.current_vessel_id:
            assigned_vessel = vessel_map.get(berth.current_vessel_id)

        if assigned_vessel:
            prio_factor = _PRIORITY_FACTOR.get(assigned_vessel.priority, 0.0)
        else:
            prio_factor = 0.0
        priority_component = prio_factor * PRIORITY_WEIGHT_MAX

        # ── 3. Crane pressure component ──────────────────────────────────────
        berth_cranes = cranes_by_berth.get(berth.id, [])
        total_cranes = len(berth_cranes)

        operational_cranes = sum(
            1 for c in berth_cranes
            if c.status in (CraneStatus.OPERATIONAL, CraneStatus.IDLE)
        )

        if total_cranes > 0:
            crane_pressure = 1.0 - (operational_cranes / total_cranes)
        else:
            crane_pressure = 0.0   # no cranes assigned → no crane-driven pressure

        crane_component = crane_pressure * CRANE_PRESSURE_MAX

        # ── Final score & level ──────────────────────────────────────────────
        score = round(occupancy_component + priority_component + crane_component, 2)
        level = _score_to_level(score)

        results.append(
            BerthRisk(
                berth_id=berth.id,
                berth_name=berth.name,
                risk_score=score,
                risk_level=level,
                utilization_pct=util_pct,
                occupancy_status=berth.status.value,
                vessel_id=assigned_vessel.id if assigned_vessel else None,
                vessel_name=assigned_vessel.name if assigned_vessel else None,
                vessel_priority=assigned_vessel.priority.value if assigned_vessel else None,
                total_cranes=total_cranes,
                operational_cranes=operational_cranes,
            )
        )

    return results
