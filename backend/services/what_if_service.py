from models.traffic import RoadTraffic


def simulate_what_if(
    road: RoadTraffic,
    congestion_change: float,
) -> dict:
    """
    Simulate a congestion change without
    modifying the real traffic state.
    """

    simulated_congestion = (
        road.congestion + congestion_change
    )

    simulated_congestion = max(
        0,
        min(100, simulated_congestion),
    )

    if simulated_congestion >= 90:
        risk = "Critical"
    elif simulated_congestion >= 75:
        risk = "High"
    elif simulated_congestion >= 45:
        risk = "Moderate"
    else:
        risk = "Low"

    if congestion_change > 0:
        direction = "Worsening"
    elif congestion_change < 0:
        direction = "Improving"
    else:
        direction = "Stable"

    return {
        "road_id": road.road_id,
        "road_name": road.road_name,
        "current_congestion": round(
            road.congestion,
            1,
        ),
        "congestion_change": round(
            congestion_change,
            1,
        ),
        "simulated_congestion": round(
            simulated_congestion,
            1,
        ),
        "direction": direction,
        "risk": risk,
    }