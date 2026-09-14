"""
Emergency Simulation Router — POST /api/emergency/simulate

Exposes the emergency disruption simulation service as an HTTP endpoint.
Accepts a body with disruption_type and optional target_id / value,
runs the simulation, and returns an EmergencySimulationResult wrapped
in the standard ApiResponseEnvelope.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, status

from app.services.optimization.models import ApiResponseEnvelope
from app.services.optimization.emergency_simulation import (
    EmergencySimulationRequest,
    EmergencySimulationResult,
    simulate_emergency,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/emergency", tags=["Emergency"])


@router.post(
    "/simulate",
    response_model=ApiResponseEnvelope[EmergencySimulationResult],
    status_code=status.HTTP_200_OK,
    summary="Emergency Disruption Simulation",
    description=(
        "Simulate a port disruption and receive a before/after snapshot comparing "
        "congestion metrics before and after the disruption is applied. "
        "Supports 5 disruption types: CRANE_FAILURE, BERTH_CLOSURE, WEATHER_DELAY, "
        "STAFF_SHORTAGE, and EQUIPMENT_BREAKDOWN. No real data is modified."
    ),
)
def simulate_emergency_endpoint(
    body: EmergencySimulationRequest,
) -> ApiResponseEnvelope[EmergencySimulationResult]:
    """
    Emergency disruption simulation endpoint.

    - ``disruptionType``  : required — one of the 5 DisruptionType values
    - ``targetId``        : crane ID (CRANE_FAILURE) or berth ID
                            (BERTH_CLOSURE, EQUIPMENT_BREAKDOWN)
    - ``value``           : delay hours (WEATHER_DELAY) or reduction %
                            (STAFF_SHORTAGE, EQUIPMENT_BREAKDOWN)
    """
    result: EmergencySimulationResult = simulate_emergency(body)

    return ApiResponseEnvelope[EmergencySimulationResult](
        success=True,
        data=result,
        error=None,
    )
