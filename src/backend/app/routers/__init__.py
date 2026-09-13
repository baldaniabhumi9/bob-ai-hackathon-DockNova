"""
Alias package for app.api.routers.
"""

from app.api.routers import (
    berths_router,
    cranes_router,
    operations_router,
    routes_router,
)

__all__ = [
    "berths_router",
    "cranes_router",
    "routes_router",
    "operations_router",
]
