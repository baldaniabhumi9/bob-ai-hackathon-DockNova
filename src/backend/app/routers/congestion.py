"""
Router for ML Congestion Prediction and Forecasting endpoints.

Exposes:
  GET  /api/congestion/forecast
  POST /api/congestion/predict
"""

from __future__ import annotations

from datetime import datetime, timedelta
import logging
from typing import Optional

from fastapi import APIRouter, status
from pydantic import Field

from app.data.loader import (
    get_berth_models,
    get_crane_models,
    get_historical_metrics,
    get_vessel_models,
)
from app.services.ml.predict import CongestionForecast, predict_congestion
from app.services.optimization.models import (
    ApiErrorDetail,
    ApiResponseEnvelope,
    BerthStatus,
    CamelModel,
    CraneStatus,
    Priority,
    VesselStatus,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/congestion", tags=["Congestion Forecasting"])


class CongestionPredictionRequest(CamelModel):
    """
    Request body for POST /api/congestion/predict.
    """

    vessel_id: Optional[str] = Field(
        default=None,
        description="Optional vessel ID to predict congestion for; defaults to current port state snapshot if absent",
    )


@router.get(
    "/forecast",
    response_model=ApiResponseEnvelope[list[CongestionForecast]],
    status_code=status.HTTP_200_OK,
    summary="24-Hour Congestion Forecast",
    description="Generates hourly congestion probability and wait time predictions for the next 24 hours based on loader operational patterns.",
)
def get_congestion_forecast() -> ApiResponseEnvelope[list[CongestionForecast]]:
    """
    Produce a 24-hour congestion forecast progression calling predict_congestion()
    for each of the next 24 hours using historical operational profile patterns.
    """
    df = get_historical_metrics()
    hourly_means = df.groupby("hour_of_day").mean()

    start_time = datetime.utcnow().replace(minute=0, second=0, microsecond=0)
    forecasts: list[CongestionForecast] = []

    for step in range(1, 25):
        target_dt = start_time + timedelta(hours=step)
        hour = target_dt.hour

        # Build feature state vector from historical hourly patterns
        features = {
            "vessel_arrivals": float(hourly_means.loc[hour, "vessel_arrivals"]),
            "waiting_vessels": float(hourly_means.loc[hour, "waiting_vessels"]),
            "berth_utilization_pct": float(hourly_means.loc[hour, "berth_utilization_pct"]),
            "crane_utilization_pct": float(hourly_means.loc[hour, "crane_utilization_pct"]),
            "yard_occupancy_pct": float(hourly_means.loc[hour, "yard_occupancy_pct"]),
            "avg_service_time_hours": float(hourly_means.loc[hour, "avg_service_time_hours"]),
            "hour_of_day": hour,
            "vessel_priority_avg": float(hourly_means.loc[hour, "vessel_priority_avg"]),
        }

        forecast = predict_congestion(features)
        # Explicitly align forecast_time with the target hourly step
        forecast.forecast_time = target_dt
        forecasts.append(forecast)

    return ApiResponseEnvelope[list[CongestionForecast]](
        success=True,
        data=forecasts,
        error=None,
    )


@router.post(
    "/predict",
    response_model=ApiResponseEnvelope[CongestionForecast],
    status_code=status.HTTP_200_OK,
    summary="Predict Port Congestion",
    description="Predicts congestion risk and wait time for a specific vessel or current port state snapshot.",
)
def predict_port_congestion(
    request: Optional[CongestionPredictionRequest] = None,
) -> ApiResponseEnvelope[CongestionForecast]:
    """
    Predict congestion for a single vessel (if vessel_id is provided) or
    for the current operational snapshot computed from loader data.
    """
    vessels = get_vessel_models()
    vessels_by_id = {v.id: v for v in vessels}
    df = get_historical_metrics()
    latest_metrics = df.iloc[-1].to_dict() if not df.empty else {}

    now = datetime.utcnow()
    waiting_count = float(sum(1 for v in vessels if v.status == VesselStatus.WAITING))

    # Base current state snapshot
    state = {
        "vessel_arrivals": float(latest_metrics.get("vessel_arrivals", 3.0)),
        "waiting_vessels": waiting_count,
        "berth_utilization_pct": float(latest_metrics.get("berth_utilization_pct", 55.0)),
        "crane_utilization_pct": float(latest_metrics.get("crane_utilization_pct", 60.0)),
        "yard_occupancy_pct": float(latest_metrics.get("yard_occupancy_pct", 68.0)),
        "avg_service_time_hours": float(latest_metrics.get("avg_service_time_hours", 12.0)),
        "hour_of_day": now.hour,
        "vessel_priority_avg": float(latest_metrics.get("vessel_priority_avg", 2.0)),
    }

    if request and request.vessel_id:
        vessel = vessels_by_id.get(request.vessel_id)
        if not vessel:
            return ApiResponseEnvelope[CongestionForecast](
                success=False,
                data=None,
                error=ApiErrorDetail(
                    code="VESSEL_NOT_FOUND",
                    message=f"Vessel with ID '{request.vessel_id}' was not found.",
                    details={"vessel_id": request.vessel_id},
                ),
            )

        # Tailor features for the specific vessel
        priority_map = {Priority.HIGH: 3.0, Priority.MEDIUM: 2.0, Priority.LOW: 1.0}
        state["vessel_priority_avg"] = priority_map.get(vessel.priority, 2.0)
        state["avg_service_time_hours"] = float(vessel.estimated_handling_hours)
        state["hour_of_day"] = vessel.eta.hour

        forecast = predict_congestion(state)
        return ApiResponseEnvelope[CongestionForecast](
            success=True,
            data=forecast,
            error=None,
        )

    # General current-state prediction
    forecast = predict_congestion(state)
    return ApiResponseEnvelope[CongestionForecast](
        success=True,
        data=forecast,
        error=None,
    )
