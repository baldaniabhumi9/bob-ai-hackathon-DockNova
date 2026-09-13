"""
Route Recommendation Service.

Compares the current port's predicted wait time against alternative ports,
factoring in travel time and an equivalent cost penalty, to determine whether
a vessel should STAY or REROUTE.

Decision logic:
  net_time_saved = current_wait − (alt_wait + alt_travel_time)
  If net_time_saved > REROUTE_THRESHOLD_HOURS → REROUTE
  Else → STAY

The cost penalty converts travel_cost_usd to an equivalent time penalty
using a configurable $/hour rate, so expensive reroutes are penalised
even if they save raw waiting time.

Usage:
    from app.services.optimization.route_recommendation import recommend_route
    rec = recommend_route(vessel_id="V001", vessel_name="MSC Flaminia")
"""

from __future__ import annotations

import logging
from typing import Optional

from .models import (
    AlternativePort,
    Recommendation,
    RouteRecommendation,
)
from app.data.loader import (
    CURRENT_PORT_CONGESTION,
    CURRENT_PORT_NAME,
    CURRENT_PORT_WAIT_TIME_HOURS,
    get_alternative_ports,
)

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Tunables
# ---------------------------------------------------------------------------

# Minimum net hours saved before we recommend rerouting.
REROUTE_THRESHOLD_HOURS = 1.0

# Cost-to-time conversion: how many USD per hour of vessel operating cost.
# Large container ships cost ~$5,000–$8,000/hour to operate.
# At COST_PER_HOUR = 5000, a $30,000 travel cost = 6h penalty.
COST_PER_HOUR_USD = 5000.0


# ---------------------------------------------------------------------------
# Core logic
# ---------------------------------------------------------------------------

def _effective_total_time(alt: AlternativePort) -> float:
    """
    Effective total time at an alternative port, including travel
    and a cost-based penalty.
    """
    cost_penalty_hours = alt.travel_cost_usd / COST_PER_HOUR_USD
    return alt.predicted_wait_time_hours + alt.travel_time_hours + cost_penalty_hours


def recommend_route(
    vessel_id: str,
    vessel_name: str,
    current_port_name: Optional[str] = None,
    current_congestion: Optional[str] = None,
    current_wait_time_hours: Optional[float] = None,
    alternatives: Optional[list[AlternativePort]] = None,
) -> RouteRecommendation:
    """
    Produce a route recommendation for a vessel.

    Parameters
    ----------
    vessel_id : str
    vessel_name : str
    current_port_name : str, optional
        Defaults to mock CURRENT_PORT_NAME.
    current_congestion : str, optional
        Congestion level (LOW/MEDIUM/HIGH/CRITICAL).
        Falls back to mock CURRENT_PORT_CONGESTION.
    current_wait_time_hours : float, optional
        Predicted wait at current port.
        Falls back to mock CURRENT_PORT_WAIT_TIME_HOURS.
    alternatives : list[AlternativePort], optional
        Falls back to mock get_alternative_ports().

    Returns
    -------
    RouteRecommendation
    """
    port_name = current_port_name or CURRENT_PORT_NAME
    congestion = current_congestion or CURRENT_PORT_CONGESTION
    wait_hours = (
        current_wait_time_hours
        if current_wait_time_hours is not None
        else CURRENT_PORT_WAIT_TIME_HOURS
    )
    alts = alternatives if alternatives is not None else get_alternative_ports()

    if not alts:
        return RouteRecommendation(
            vessel_id=vessel_id,
            vessel_name=vessel_name,
            current_port=port_name,
            current_congestion=congestion,
            current_wait_time_hours=wait_hours,
            alternatives=[],
            best_alternative=None,
            time_saved_hours=0.0,
            recommendation=Recommendation.STAY,
            reasoning="No alternative ports available for comparison.",
        )

    # Evaluate each alternative
    scored: list[tuple[AlternativePort, float]] = []
    for alt in alts:
        eff_time = _effective_total_time(alt)
        net_saved = wait_hours - eff_time
        scored.append((alt, net_saved))

    # Sort by most time saved (descending)
    scored.sort(key=lambda x: x[1], reverse=True)
    best_alt, best_saved = scored[0]

    # Decision
    if best_saved >= REROUTE_THRESHOLD_HOURS:
        recommendation = Recommendation.REROUTE
        reasoning = (
            f"Rerouting to {best_alt.port_name} saves {best_saved:.1f}h net. "
            f"Current wait at {port_name} is {wait_hours:.1f}h "
            f"(congestion: {congestion}). "
            f"{best_alt.port_name} has {best_alt.predicted_wait_time_hours:.1f}h wait "
            f"+ {best_alt.travel_time_hours:.1f}h travel, with {best_alt.available_berths} "
            f"available berths and {best_alt.congestion_level} congestion."
        )
    else:
        recommendation = Recommendation.STAY
        if best_saved <= 0:
            reasoning = (
                f"No alternative port offers time savings. "
                f"Best option ({best_alt.port_name}) would add "
                f"{abs(best_saved):.1f}h after accounting for travel time and cost. "
                f"Stay at {port_name}."
            )
        else:
            reasoning = (
                f"Best alternative ({best_alt.port_name}) saves only "
                f"{best_saved:.1f}h — below the {REROUTE_THRESHOLD_HOURS}h threshold. "
                f"Not worth the disruption and fuel cost. Stay at {port_name}."
            )

    return RouteRecommendation(
        vessel_id=vessel_id,
        vessel_name=vessel_name,
        current_port=port_name,
        current_congestion=congestion,
        current_wait_time_hours=wait_hours,
        alternatives=alts,
        best_alternative=best_alt,
        time_saved_hours=round(best_saved, 2),
        recommendation=recommendation,
        reasoning=reasoning,
    )
