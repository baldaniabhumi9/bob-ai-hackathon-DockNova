"""
Pydantic models for the optimization services (berth + crane allocation).

Mirrors the shared TypeScript schemas from src/shared/types/index.ts
with Python-native naming conventions internally and camelCase serialization externally.
"""

from __future__ import annotations

import uuid
from datetime import datetime
from enum import Enum
from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel, ConfigDict, Field


# ---------------------------------------------------------------------------
# CamelCase Alias Generator & Base Model
# ---------------------------------------------------------------------------

def to_camel_case(string: str) -> str:
    """
    Convert snake_case field names to camelCase for JSON serialization.
    Preserves exact casing for shared TypeScript interfaces (e.g. capacityTEUPerHour).
    """
    custom_map = {
        "capacity_teu_per_hour": "capacityTEUPerHour",
        "workload_teu": "workloadTEU",
        "combined_throughput_teu_per_hour": "combinedThroughputTEUPerHour",
    }
    if string in custom_map:
        return custom_map[string]
    components = string.split("_")
    return components[0] + "".join(x.capitalize() for x in components[1:])


class CamelModel(BaseModel):
    """
    Base model that serializes to camelCase while accepting both
    snake_case and camelCase during input/instantiation.
    """

    model_config = ConfigDict(
        alias_generator=to_camel_case,
        populate_by_name=True,
        from_attributes=True,
        extra="ignore",
    )



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

class VesselModel(CamelModel):
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


class BerthModel(CamelModel):
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

class BerthAssignment(CamelModel):
    """A single vessel-to-berth assignment produced by the optimizer."""

    vessel_id: str
    vessel_name: str
    berth_id: str
    berth_name: str
    start_time: datetime
    end_time: datetime


class MetricsSnapshot(CamelModel):
    """
    Operational metrics snapshot — used for before/after comparison.
    """

    waiting_vessels: int = Field(ge=0)
    avg_waiting_time_hours: float = Field(ge=0)
    berth_utilization_pct: float = Field(ge=0, le=100)


class OptimizationResult(CamelModel):
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


# ---------------------------------------------------------------------------
# Crane-related Enumerations
# ---------------------------------------------------------------------------

class CraneStatus(str, Enum):
    """Matches shared Crane.status: 'OPERATIONAL' | 'IDLE' | 'MAINTENANCE'."""
    OPERATIONAL = "OPERATIONAL"
    IDLE = "IDLE"
    MAINTENANCE = "MAINTENANCE"


# ---------------------------------------------------------------------------
# Crane Input Model
# ---------------------------------------------------------------------------

class CraneModel(CamelModel):
    """
    Crane available at a berth.

    Matches the shared Crane interface:
      id, name, berthId, status, capacityTEUPerHour
    """

    id: str
    name: str
    berth_id: str
    status: CraneStatus
    capacity_teu_per_hour: float = Field(
        gt=0,
        description="Crane throughput in TEU per hour",
    )


# ---------------------------------------------------------------------------
# Crane Output Models
# ---------------------------------------------------------------------------

class CraneAssignment(CamelModel):
    """A single crane assignment for a vessel at a berth."""

    vessel_id: str
    vessel_name: str
    berth_id: str
    berth_name: str
    crane_ids: list[str]
    crane_names: list[str]
    num_cranes: int = Field(ge=0)
    combined_throughput_teu_per_hour: float = Field(ge=0)
    workload_teu: float = Field(ge=0)
    service_duration_hours: float = Field(ge=0)


class CraneMetricsSnapshot(CamelModel):
    """
    Crane-specific operational metrics — used for before/after comparison.
    """

    total_cranes: int = Field(ge=0)
    cranes_assigned: int = Field(ge=0)
    avg_service_duration_hours: float = Field(ge=0)
    crane_utilization_pct: float = Field(ge=0, le=100)


class CraneOptimizationResult(CamelModel):
    """
    Complete crane optimization output.

    Aligns with the shared OptimisationResult interface:
      id, timestamp, efficiencyGainPercentage, estimatedWaitTimeReductionHours
    and extends it with crane-specific assignments and before/after metrics.
    """

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    assignments: list[CraneAssignment]
    before_metrics: CraneMetricsSnapshot
    after_metrics: CraneMetricsSnapshot
    efficiency_gain_percentage: float = Field(
        description="Percentage improvement in crane utilization",
    )
    estimated_wait_time_reduction_hours: float = Field(
        description="Reduction in average service duration (hours)",
    )
    solver_status: str = Field(
        default="UNKNOWN",
        description="Algorithm status string",
    )


# ---------------------------------------------------------------------------
# Route Recommendation Models
# ---------------------------------------------------------------------------

class Recommendation(str, Enum):
    """Whether the vessel should stay at the current port or reroute."""
    STAY = "STAY"
    REROUTE = "REROUTE"


class AlternativePort(CamelModel):
    """An alternative port for route recommendation comparison."""

    port_id: str
    port_name: str
    congestion_level: str  # LOW / MEDIUM / HIGH / CRITICAL
    predicted_wait_time_hours: float = Field(ge=0)
    travel_time_hours: float = Field(ge=0)
    travel_cost_usd: float = Field(ge=0)
    available_berths: int = Field(ge=0)


class RouteRecommendation(CamelModel):
    """
    Route recommendation output for a specific vessel.

    No direct equivalent in shared/types/index.ts — this is a backend-
    only model for the optimization service. The frontend can consume it
    via the API as JSON.
    """

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    vessel_id: str
    vessel_name: str
    current_port: str
    current_congestion: str  # LOW / MEDIUM / HIGH / CRITICAL
    current_wait_time_hours: float = Field(ge=0)
    alternatives: list[AlternativePort]
    best_alternative: Optional[AlternativePort] = None
    time_saved_hours: float = Field(
        description="Net time saved by rerouting (negative = rerouting is worse)",
    )
    recommendation: Recommendation
    reasoning: str


# ---------------------------------------------------------------------------
# Operations Plan Models
# ---------------------------------------------------------------------------

class PlanEntryStatus(str, Enum):
    """Status of a single entry in the 72-hour operations plan."""
    SCHEDULED = "SCHEDULED"
    IN_PROGRESS = "IN_PROGRESS"
    DELAYED = "DELAYED"
    COMPLETED = "COMPLETED"


class OperationsPlanEntry(CamelModel):
    """
    A single entry in the 72-hour operations plan.

    Combines berth allocation and crane allocation outputs into
    an actionable per-vessel plan item.
    """

    vessel_id: str
    vessel_name: str
    vessel_type: str
    priority: Priority
    eta: datetime
    etd: datetime
    berth_id: str
    berth_name: str
    start_time: datetime
    end_time: datetime
    crane_count: int = Field(ge=0)
    crane_ids: list[str] = Field(default_factory=list)
    service_duration_hours: float = Field(ge=0)
    workload_teu: float = Field(ge=0)
    status: PlanEntryStatus
    recommended_action: str


class OperationsPlanResult(CamelModel):
    """
    Complete 72-hour operations plan.

    Aligns with the shared OperationsPlan interface:
      id, generatedAt, validForHours, recommendationsCount, status
    and extends it with detailed per-vessel plan entries.
    """

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    valid_for_hours: int = 72
    entries: list[OperationsPlanEntry]
    recommendations_count: int = Field(ge=0)
    status: str = "DRAFT"  # DRAFT | APPROVED | ACTIVE
    total_vessels: int = Field(ge=0)
    scheduled_count: int = Field(ge=0)
    in_progress_count: int = Field(ge=0)
    delayed_count: int = Field(ge=0)


# ---------------------------------------------------------------------------
# API Envelope & Request Models
# ---------------------------------------------------------------------------

T = TypeVar("T")


class ApiErrorDetail(CamelModel):
    """Error detail block in the API response envelope."""
    code: str
    message: str
    details: Optional[dict[str, Any]] = None


class ApiMetadata(CamelModel):
    """Metadata block in the API response envelope."""
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    request_id: Optional[str] = None


class ApiResponseEnvelope(CamelModel, Generic[T]):
    """
    Standard API response envelope conforming to docs/PROJECT_CONTRACT.md §4.
    """
    success: bool = True
    data: Optional[T] = None
    error: Optional[ApiErrorDetail] = None
    metadata: ApiMetadata = Field(default_factory=ApiMetadata)


class BerthOptimizationRequest(CamelModel):
    """Request payload for POST /api/optimization/berths."""
    vessel_ids: Optional[list[str]] = Field(
        default=None,
        description="Optional list of vessel IDs to filter/optimize; defaults to all waiting/scheduled vessels",
    )


class CraneOptimizationRequest(CamelModel):
    """Request payload for POST /api/optimization/cranes."""
    berth_id: str = Field(
        description="ID of the berth to optimize crane allocation for",
    )


class RouteRecommendationRequest(CamelModel):
    """Request payload for POST /api/routes/recommend."""
    vessel_id: str = Field(
        description="ID of the vessel to compute route recommendation for",
    )
