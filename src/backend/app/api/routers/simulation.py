"""
Simulation Router — POST /api/optimization/simulate

Exposes the what-if simulation service as an HTTP endpoint.
Accepts an optional body with extraVesselCount and/or extraVessels,
runs the simulation, and returns a SimulationResponse wrapped in
ApiResponseEnvelope.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, status

from app.services.optimization.models import ApiResponseEnvelope
from app.services.optimization.simulation import (
    SimulationRequest,
    SimulationResponse,
    run_simulation,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/optimization", tags=["Simulation"])


@router.post(
    "/simulate",
    response_model=ApiResponseEnvelope[SimulationResponse],
    status_code=status.HTTP_200_OK,
    summary="What-If Berth Allocation Simulation",
    description=(
        "Run the berth allocation optimizer against the current real fleet "
        "PLUS optional extra (simulated) vessels.  No real data is modified. "
        "Pass `extraVesselCount` to auto-generate that many random vessels, "
        "or supply `extraVessels` directly for full control."
    ),
)
def simulate_berth_allocation(
    body: SimulationRequest = SimulationRequest(),
) -> ApiResponseEnvelope[SimulationResponse]:
    """
    What-if simulation endpoint.

    - If ``extra_vessels`` is provided in the body, those vessels are used.
    - Otherwise ``extra_vessel_count`` random vessels are auto-generated
      (default 3).
    """
    result: SimulationResponse = run_simulation(
        extra_vessels=body.extra_vessels,
        extra_vessel_count=body.extra_vessel_count,
    )

    return ApiResponseEnvelope[SimulationResponse](
        success=True,
        data=result,
        error=None,
    )
