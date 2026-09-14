"""
Alias router for port status endpoints.
"""

from app.routers.port import PortStatus, router

__all__ = ["router", "PortStatus"]
