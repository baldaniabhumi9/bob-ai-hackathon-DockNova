"""
Pydantic models for the berth allocation optimization service.

Mirrors the shared TypeScript schemas from src/shared/types/index.ts
with Python-native naming conventions and additional optimization fields.
"""

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Enumerations
# ---------------------------------------------------------------------------

class VesselStatus(str, Enum):
    SCHEDULED = "SCHEDULED"
    WAITING = "WAITING"
    BERTHED = "BERTHED"
    DEPARTED = "DEPARTED"


class BerthStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    OCCUPIED = "OCCUPIED"
    MAINTENANCE = "MAINTENANCE"


class Priority(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


# ---------------------------------------------------------------------------
# Input Models
# ---------------------------------------------------------------------------

class VesselModel(BaseModel):
    """
    Vessel waiting for or scheduled at the port.

    Matches the shared Vessel interface:
      id, name, imo, type, eta, etd, status, draftMeters, lengthMeters
    plus optimization-specific fields (priority, estimated_handling_hours).
    """

    id: str
    name: str
    imo: str
    type: str  # e.g. CONTAINER, TANKER, BULK, RORO
    eta: datetime  # Estimated Time of Arrival
    etd: datetime  # Estimated Time of Departure
    status: VesselStatus
    draft_meters: float = Field(ge=0, description="Vessel draft in meters")
    length_meters: float = Field(ge=0, description="Vessel LOA in meters")

    # Optimization-specific fields
    priority: Priority = Priority.MEDIUM
    estimated_handling_hours: float = Field(
        default=12.0,
        ge=1.0,
        description="Estimated hours the vessel needs at the berth",
    )


class BerthModel(BaseModel):
    """
    Berth available for vessel assignment.

    Matches the shared Berth interface:
      id, name, code, maxDraftMeters, maxLengthMeters, status, currentVesselId
    plus optimization-specific fields (compatible_vessel_types, availability windows).
    """

    id: str
    name: str
    code: str
    max_draft_meters: float = Field(ge=0)
    max_length_meters: float = Field(ge=0)
    status: BerthStatus
    current_vessel_id: Optional[str] = None

    # Optimization-specific fields
    compatible_vessel_types: list[str] = Field(
        default_factory=lambda: ["CONTAINER", "TANKER", "BULK", "RORO"],
        description="Vessel types this berth can accommodate",
    )
    availability_start: Optional[datetime] = None
    availability_end: Optional[datetime] = None


# ---------------------------------------------------------------------------
# Output Models
# ---------------------------------------------------------------------------

class BerthAssignment(BaseModel):
    """A single vessel-to-berth assignment produced by the optimizer."""

    vessel_id: str
    vessel_name: str
    berth_id: str
    berth_name: str
    start_time: datetime
    end_time: datetime


class MetricsSnapshot(BaseModel):
    """
    Operational metrics snapshot — used for before/after comparison.
    """

    waiting_vessels: int = Field(ge=0)
    avg_waiting_time_hours: float = Field(ge=0)
    berth_utilization_pct: float = Field(ge=0, le=100)


class OptimizationResult(BaseModel):
    """
    Complete optimization output.

    Aligns with the shared OptimisationResult interface:
      id, timestamp, efficiencyGainPercentage, estimatedWaitTimeReductionHours
    and extends it with detailed assignments and before/after metrics.
    """

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    assignments: list[BerthAssignment]
    before_metrics: MetricsSnapshot
    after_metrics: MetricsSnapshot
    efficiency_gain_percentage: float = Field(
        description="Percentage improvement in berth utilization",
    )
    estimated_wait_time_reduction_hours: float = Field(
        description="Reduction in average waiting time (hours)",
    )
    solver_status: str = Field(
        default="UNKNOWN",
        description="OR-Tools solver status string",
    )
