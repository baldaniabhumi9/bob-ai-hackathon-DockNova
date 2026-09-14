"""
API Routers for DockNova Backend.
"""

from .berths import router as berths_router
from .cranes import router as cranes_router
from .emergency import router as emergency_router
from .operations import router as operations_router
from .routes import router as routes_router
from .simulation import router as simulation_router

__all__ = [
    "berths_router",
    "cranes_router",
    "emergency_router",
    "routes_router",
    "operations_router",
    "simulation_router",
]
