"""
Router for Operations Plan endpoints.

Exposes:
  GET /api/operations/72-hour
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, status

from app.data.loader import (
    REFERENCE_TIME,
    get_berth_models,
    get_crane_models,
    get_vessel_models,
    get_vessel_workloads,
)
from app.services.optimization.models import (
    ApiResponseEnvelope,
    OperationsPlanEntry,
)
from app.services.optimization.operations_plan import generate_operations_plan

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/operations", tags=["Operations Plan"])


@router.get(
    "/72-hour",
    response_model=ApiResponseEnvelope[list[OperationsPlanEntry]],
    status_code=status.HTTP_200_OK,
    summary="Get 72-Hour Operations Plan",
    description="Returns the combined berth allocation and crane assignment plan for the next 72 hours.",
)
def get_72_hour_operations_plan() -> ApiResponseEnvelope[list[OperationsPlanEntry]]:
    """
    Generate and return the 72-hour operations plan entries.
    """
    vessels = get_vessel_models()
    berths = get_berth_models()
    cranes = get_crane_models()

    plan = generate_operations_plan(
        vessels=vessels,
        berths=berths,
        cranes=cranes,
        reference_time=REFERENCE_TIME,
        workloads=get_vessel_workloads(),
    )

    return ApiResponseEnvelope[list[OperationsPlanEntry]](
        success=True,
        data=plan.entries,
        error=None,
    )
