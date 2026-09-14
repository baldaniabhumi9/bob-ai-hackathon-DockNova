"""
What-If Simulation Service for DockNova.

Runs the berth allocation optimizer against a combination of:
  - The *current* real vessel fleet (from app.data.loader)
  - Optional extra simulated vessels (caller-supplied or auto-generated)

This module DOES NOT modify the real dataset or any production state.
It is a pure in-memory simulation — the result is ephemeral.

Public API:
    run_simulation(extra_vessels, extra_vessel_count) -> SimulationResponse
"""

from __future__ import annotations

import random
import uuid
from datetime import datetime, timedelta
from typing import Optional

from .berth_allocation import optimize_berth_allocation
from .models import (
    BerthModel,
    CamelModel,
    OptimizationResult,
    Priority,
    VesselModel,
    VesselStatus,
)

# ---------------------------------------------------------------------------
# Simulation-specific I/O models (camelCase-serialised via CamelModel)
# ---------------------------------------------------------------------------


class SimulationRequest(CamelModel):
    """
    Input for the what-if simulation endpoint.

    - extra_vessel_count : how many random extra vessels to auto-generate
                           (ignored if extra_vessels is supplied)
    - extra_vessels      : caller-supplied vessel overrides — if provided,
                           these are used directly (no auto-generation)
    """

    extra_vessel_count: int = 3
    extra_vessels: Optional[list[VesselModel]] = None


class SimulationResponse(CamelModel):
    """
    Simulation result — wraps an OptimizationResult plus metadata about
    the simulated fleet that was fed into the solver.
    """

    simulation_id: str
    total_vessels_in_simulation: int
    real_vessel_count: int
    simulated_vessel_count: int
    optimization_result: OptimizationResult


# ---------------------------------------------------------------------------
# Extra vessel generation (mirrors generate_synthetic_data.py distributions)
# ---------------------------------------------------------------------------

_VESSEL_TYPES = ["CONTAINER", "TANKER", "BULK", "RORO"]

# (draft_min, draft_max, length_min, length_max, handling_min, handling_max)
_TYPE_PROFILES: dict[str, tuple[float, float, float, float, float, float]] = {
    "CONTAINER": (12.0, 17.0, 200.0, 420.0, 10.0, 24.0),
    "TANKER":    (8.0,  13.0, 150.0, 280.0,  6.0, 14.0),
    "BULK":      (10.0, 18.0, 180.0, 340.0,  8.0, 20.0),
    "RORO":      (5.0,  10.0, 150.0, 230.0,  6.0, 12.0),
}

_PRIORITY_CHOICES = [Priority.HIGH, Priority.MEDIUM, Priority.MEDIUM, Priority.LOW]


def _generate_extra_vessels(
    n: int,
    reference_time: datetime,
    seed: Optional[int] = None,
) -> list[VesselModel]:
    """
    Generate *n* random vessels that mimic the synthetic distribution.

    IDs are prefixed with 'SIM-' to distinguish them from real vessels.
    All generated vessels have status=WAITING so the solver actually queues them.
    """
    rng = random.Random(seed)
    vessels: list[VesselModel] = []

    for i in range(n):
        vtype = rng.choice(_VESSEL_TYPES)
        d_min, d_max, l_min, l_max, h_min, h_max = _TYPE_PROFILES[vtype]

        # ETA within the next 12–36 hours (near-term demand surge scenario)
        eta_offset_hours = rng.uniform(0.5, 36.0)
        eta = reference_time + timedelta(hours=eta_offset_hours)
        handling_hours = round(rng.uniform(h_min, h_max), 1)
        etd = eta + timedelta(hours=handling_hours + rng.uniform(1, 4))

        priority = rng.choice(_PRIORITY_CHOICES)
        draft = round(rng.uniform(d_min, d_max), 1)
        length = round(rng.uniform(l_min, l_max))
        imo = str(rng.randint(9100000, 9999999))

        vessels.append(
            VesselModel(
                id=f"SIM-{i+1:03d}-{uuid.uuid4().hex[:6]}",
                name=f"Simulated Vessel {i + 1}",
                imo=imo,
                type=vtype,
                eta=eta,
                etd=etd,
                status=VesselStatus.WAITING,
                draft_meters=draft,
                length_meters=length,
                priority=priority,
                estimated_handling_hours=handling_hours,
            )
        )

    return vessels


# ---------------------------------------------------------------------------
# Main simulation runner
# ---------------------------------------------------------------------------


def run_simulation(
    extra_vessels: Optional[list[VesselModel]] = None,
    extra_vessel_count: int = 3,
    reference_time: Optional[datetime] = None,
    seed: Optional[int] = None,
) -> SimulationResponse:
    """
    Run the berth allocation optimizer against real + simulated vessels.

    Parameters
    ----------
    extra_vessels : list[VesselModel] | None
        Caller-supplied extra vessels.  If provided, ``extra_vessel_count``
        is ignored.  Each vessel is included as-is (status is preserved).
    extra_vessel_count : int
        Number of vessels to auto-generate when ``extra_vessels`` is None.
    reference_time : datetime | None
        Planning horizon reference.  Defaults to ``datetime.utcnow()``.
    seed : int | None
        Optional RNG seed for reproducible auto-generated vessels.

    Returns
    -------
    SimulationResponse
        Contains the full OptimizationResult plus fleet composition metadata.
    """
    # Lazy import to avoid circular dependency at module load time
    from app.data.loader import get_berth_models, get_vessel_models

    ref = reference_time or datetime.utcnow()

    # --- real fleet ---
    real_vessels: list[VesselModel] = list(get_vessel_models())
    real_berths: list[BerthModel] = list(get_berth_models())

    # --- simulated extra vessels ---
    if extra_vessels is not None:
        sim_vessels = list(extra_vessels)
    else:
        sim_vessels = _generate_extra_vessels(
            n=max(0, extra_vessel_count),
            reference_time=ref,
            seed=seed,
        )

    combined_vessels = real_vessels + sim_vessels

    # Run the optimizer (read-only; does not mutate loader caches)
    opt_result: OptimizationResult = optimize_berth_allocation(
        vessels=combined_vessels,
        berths=real_berths,
        reference_time=ref,
    )

    return SimulationResponse(
        simulation_id=str(uuid.uuid4()),
        total_vessels_in_simulation=len(combined_vessels),
        real_vessel_count=len(real_vessels),
        simulated_vessel_count=len(sim_vessels),
        optimization_result=opt_result,
    )
