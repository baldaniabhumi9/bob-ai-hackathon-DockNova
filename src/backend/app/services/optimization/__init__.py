"""
DockNova Optimization Services.

- Berth allocation: OR-Tools CP-SAT solver
- Crane allocation: Greedy throughput maximizer
- Route recommendation: Alternative port comparator
- Operations plan: 72-hour combined berth+crane plan generator
"""

from .models import (
    AlternativePort,
    ApiErrorDetail,
    ApiMetadata,
    ApiResponseEnvelope,
    BerthAssignment,
    BerthModel,
    BerthOptimizationRequest,
    CraneAssignment,
    CraneMetricsSnapshot,
    CraneModel,
    CraneOptimizationRequest,
    CraneOptimizationResult,
    MetricsSnapshot,
    OperationsPlanEntry,
    OperationsPlanResult,
    OptimizationResult,
    RouteRecommendation,
    RouteRecommendationRequest,
    VesselModel,
)

__all__ = [
    "optimize_berth_allocation",
    "optimize_crane_allocation",
    "recommend_route",
    "generate_operations_plan",
    "VesselModel",
    "BerthModel",
    "CraneModel",
    "AlternativePort",
    "BerthAssignment",
    "CraneAssignment",
    "MetricsSnapshot",
    "CraneMetricsSnapshot",
    "OptimizationResult",
    "CraneOptimizationResult",
    "RouteRecommendation",
    "OperationsPlanEntry",
    "OperationsPlanResult",
    "ApiResponseEnvelope",
    "ApiErrorDetail",
    "ApiMetadata",
    "BerthOptimizationRequest",
    "CraneOptimizationRequest",
    "RouteRecommendationRequest",
]


def __getattr__(name: str):
    """Load service functions lazily so the data layer can import seed data."""
    if name == "optimize_berth_allocation":
        from .berth_allocation import optimize_berth_allocation
        return optimize_berth_allocation
    if name == "optimize_crane_allocation":
        from .crane_allocation import optimize_crane_allocation
        return optimize_crane_allocation
    if name == "generate_operations_plan":
        from .operations_plan import generate_operations_plan
        return generate_operations_plan
    if name == "recommend_route":
        from .route_recommendation import recommend_route
        return recommend_route
    raise AttributeError(name)
