"""
Alias router for congestion prediction endpoints.
"""

from app.routers.congestion import CongestionPredictionRequest, router

__all__ = ["router", "CongestionPredictionRequest"]
