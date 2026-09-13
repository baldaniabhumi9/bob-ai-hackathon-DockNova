"""
Router for Crane Optimization endpoints.

Exposes:
  POST /api/optimization/cranes
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, status

from app.services.optimization.crane_allocation import optimize_crane_allocation
from app.services.optimization.mock_data import (
    VESSEL_WORKLOADS_TEU,
    get_sample_berths,
    get_sample_cranes,
    get_sample_vessels,
)
from app.services.optimization.models import (
    ApiErrorDetail,
    ApiResponseEnvelope,
    CraneOptimizationRequest,
    CraneOptimizationResult,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/optimization", tags=["Crane Optimization"])

# Default mapping of berths to their scheduled primary vessel
BERTH_DEFAULT_VESSELS: dict[str, str] = {
    "B01": "V004",  # Ever Given (800 TEU)
    "B02": "V001",  # MSC Flaminia (450 TEU)
    "B03": "V002",  # Stena Impala (120 TEU)
    "B04": "V003",  # Cape Kassos (350 TEU)
    "B05": "V006",  # Pacific Venture (200 TEU)
}


@router.post(
    "/cranes",
    response_model=ApiResponseEnvelope[CraneOptimizationResult],
    status_code=status.HTTP_200_OK,
    summary="Optimize Crane Allocation",
    description="Optimizes crane assignment and throughput for a specific berth and its assigned workload.",
)
def optimize_cranes(
    request: CraneOptimizationRequest,
) -> ApiResponseEnvelope[CraneOptimizationResult]:
    """
    Run crane allocation optimization for a given berth_id.
    """
    berths = {b.id: b for b in get_sample_berths()}
    if request.berth_id not in berths:
        return ApiResponseEnvelope[CraneOptimizationResult](
            success=False,
            data=None,
            error=ApiErrorDetail(
                code="BERTH_NOT_FOUND",
                message=f"Berth '{request.berth_id}' not found.",
                details={"available_berths": list(berths.keys())},
            ),
        )

    berth = berths[request.berth_id]
    cranes_at_berth = [c for c in get_sample_cranes() if c.berth_id == request.berth_id]

    if not cranes_at_berth:
        return ApiResponseEnvelope[CraneOptimizationResult](
            success=False,
            data=None,
            error=ApiErrorDetail(
                code="NO_CRANES_AT_BERTH",
                message=f"No cranes found assigned to berth '{request.berth_id}'.",
                details={"berth_id": request.berth_id},
            ),
        )

    # Determine vessel and workload for this berth
    vessels = {v.id: v for v in get_sample_vessels()}
    vessel_id = BERTH_DEFAULT_VESSELS.get(request.berth_id, "V001")
    vessel = vessels.get(vessel_id, list(vessels.values())[0])
    workload_teu = VESSEL_WORKLOADS_TEU.get(vessel.id, 450.0)

    result = optimize_crane_allocation(
        berth_id=berth.id,
        berth_name=berth.name,
        vessel_id=vessel.id,
        vessel_name=vessel.name,
        workload_teu=workload_teu,
        cranes=cranes_at_berth,
    )

    return ApiResponseEnvelope[CraneOptimizationResult](
        success=True,
        data=result,
        error=None,
    )
