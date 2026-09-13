"""
Router for Route Recommendation endpoints.

Exposes:
  POST /api/routes/recommend
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, status

from app.services.optimization.mock_data import get_sample_vessels
from app.services.optimization.models import (
    ApiErrorDetail,
    ApiResponseEnvelope,
    RouteRecommendation,
    RouteRecommendationRequest,
)
from app.services.optimization.route_recommendation import recommend_route

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/routes", tags=["Route Recommendation"])


@router.post(
    "/recommend",
    response_model=ApiResponseEnvelope[RouteRecommendation],
    status_code=status.HTTP_200_OK,
    summary="Recommend Vessel Route / Alternative Port",
    description="Analyzes destination port congestion against alternative nearby ports and recommends STAY or REROUTE.",
)
def get_route_recommendation(
    request: RouteRecommendationRequest,
) -> ApiResponseEnvelope[RouteRecommendation]:
    """
    Produce a STAY or REROUTE recommendation for the specified vessel_id.
    """
    vessels = {v.id: v for v in get_sample_vessels()}

    if request.vessel_id not in vessels:
        return ApiResponseEnvelope[RouteRecommendation](
            success=False,
            data=None,
            error=ApiErrorDetail(
                code="VESSEL_NOT_FOUND",
                message=f"Vessel with ID '{request.vessel_id}' was not found.",
                details={"available_vessel_ids": list(vessels.keys())},
            ),
        )

    vessel = vessels[request.vessel_id]
    result = recommend_route(
        vessel_id=vessel.id,
        vessel_name=vessel.name,
    )

    return ApiResponseEnvelope[RouteRecommendation](
        success=True,
        data=result,
        error=None,
    )
