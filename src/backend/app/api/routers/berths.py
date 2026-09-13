"""
Router for Berth Optimization endpoints.

Exposes:
  POST /api/optimization/berths
"""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, status

from app.services.optimization.berth_allocation import optimize_berth_allocation
from app.data.loader import (
    REFERENCE_TIME,
    get_berth_models,
    get_vessel_models,
)
from app.services.optimization.models import (
    ApiErrorDetail,
    ApiResponseEnvelope,
    BerthOptimizationRequest,
    OptimizationResult,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/optimization", tags=["Berth Optimization"])


@router.post(
    "/berths",
    response_model=ApiResponseEnvelope[OptimizationResult],
    status_code=status.HTTP_200_OK,
    summary="Optimize Berth Allocations",
    description="Runs the Google OR-Tools CP-SAT solver to optimize vessel-to-berth assignments.",
)
def optimize_berths(
    request: Optional[BerthOptimizationRequest] = None,
) -> ApiResponseEnvelope[OptimizationResult]:
    """
    Run berth allocation optimization.
    Optionally filters by vessel_ids; defaults to all waiting/scheduled vessels.
    """
    all_vessels = get_vessel_models()
    all_berths = get_berth_models()

    vessels_to_optimize = all_vessels
    if request and request.vessel_ids:
        vessel_id_set = set(request.vessel_ids)
        vessels_to_optimize = [v for v in all_vessels if v.id in vessel_id_set]

        if not vessels_to_optimize:
            return ApiResponseEnvelope[OptimizationResult](
                success=False,
                data=None,
                error=ApiErrorDetail(
                    code="VESSELS_NOT_FOUND",
                    message="None of the specified vessel IDs were found in the scheduling pool.",
                    details={"requested_vessel_ids": request.vessel_ids},
                ),
            )

    result = optimize_berth_allocation(
        vessels=vessels_to_optimize,
        berths=all_berths,
        reference_time=REFERENCE_TIME,
    )

    return ApiResponseEnvelope[OptimizationResult](
        success=True,
        data=result,
        error=None,
    )
