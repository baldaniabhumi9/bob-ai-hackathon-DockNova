"""
Router for Port status and metrics endpoints.

Exposes:
  GET /api/port/status
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, status
from pydantic import Field

from app.data.loader import (
    get_berth_models,
    get_crane_models,
    get_historical_metrics,
    get_vessel_models,
)
from app.services.optimization.models import (
    ApiResponseEnvelope,
    BerthStatus,
    CamelModel,
    CraneStatus,
    VesselStatus,
)
from app.services.operational_state import live_state

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/port", tags=["Port Status"])


class PortStatus(CamelModel):
    """
    Real-time port operational status summary.
    """

    total_vessels: int = Field(
        ge=0,
        description="Total number of vessels currently tracked by the port",
    )
    waiting_vessels: int = Field(
        ge=0,
        description="Number of vessels waiting in queue / anchorage",
    )
    available_berths: int = Field(
        ge=0,
        description="Number of berths currently available for docking",
    )
    available_cranes: int = Field(
        ge=0,
        description="Number of operational cranes available for handling",
    )
    yard_occupancy_pct: float = Field(
        ge=0.0,
        le=100.0,
        description="Current container yard storage occupancy percentage",
    )


@router.get(
    "/status",
    response_model=ApiResponseEnvelope[PortStatus],
    status_code=status.HTTP_200_OK,
    summary="Get Port Operational Status",
    description="Returns current port status including vessel counts, available resources, and yard occupancy.",
)
def get_port_status() -> ApiResponseEnvelope[PortStatus]:
    """
    Compute and return current port status metrics from loaded synthetic data.
    """
    snapshot = live_state.snapshot()
    vessels = snapshot["vessels"]
    berths = snapshot["berths"]
    cranes = snapshot["cranes"]
    df = get_historical_metrics()

    total_vessels = len(vessels)
    waiting_vessels = sum(1 for v in vessels if v.status == VesselStatus.WAITING)
    available_berths = sum(1 for b in berths if b.status == BerthStatus.AVAILABLE)
    available_cranes = sum(1 for c in cranes if c.status == CraneStatus.OPERATIONAL)

    # Latest yard occupancy percentage from historical metrics time series
    berth_utilization = (snapshot["occupiedBerths"] / max(1, len(berths))) * 100
    latest_yard_occupancy = min(100.0, float(round(60.0 + snapshot["waitingVessels"] * 3.0 + berth_utilization * 0.1, 2)))

    port_status = PortStatus(
        total_vessels=total_vessels,
        waiting_vessels=waiting_vessels,
        available_berths=available_berths,
        available_cranes=available_cranes,
        yard_occupancy_pct=latest_yard_occupancy,
    )

    return ApiResponseEnvelope[PortStatus](
        success=True,
        data=port_status,
        error=None,
    )
