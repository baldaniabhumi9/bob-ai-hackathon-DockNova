"""
Router for Vessel data endpoints.

Exposes:
  GET /api/vessels
"""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, Query, status

from app.data.loader import get_vessel_models
from app.services.optimization.models import (
    ApiResponseEnvelope,
    VesselModel,
    VesselStatus,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/vessels", tags=["Vessels"])


@router.get(
    "",
    response_model=ApiResponseEnvelope[list[VesselModel]],
    status_code=status.HTTP_200_OK,
    summary="Get All Vessels",
    description="Returns all vessels in the port scheduling pool with optional status filtering.",
)
@router.get(
    "/",
    response_model=ApiResponseEnvelope[list[VesselModel]],
    status_code=status.HTTP_200_OK,
    include_in_schema=False,
)
def get_vessels(
    status: Optional[VesselStatus] = Query(
        default=None,
        description="Optional filter by vessel status (SCHEDULED, WAITING, BERTHED, DEPARTED)",
    ),
) -> ApiResponseEnvelope[list[VesselModel]]:
    """
    Retrieve vessel models from the data loader, optionally filtered by status.
    """
    vessels = get_vessel_models()
    if status is not None:
        vessels = [v for v in vessels if v.status == status]

    return ApiResponseEnvelope[list[VesselModel]](
        success=True,
        data=vessels,
        error=None,
    )
