from collections import defaultdict, deque

from models.traffic import RoadTraffic


# Keep the latest 10 congestion readings
# for every road.
traffic_history: dict[str, deque[float]] = defaultdict(
    lambda: deque(maxlen=10)
)


def record_traffic(
    roads: list[RoadTraffic],
) -> None:
    """
    Store the latest congestion reading
    for each road.
    """

    for road in roads:
        traffic_history[road.road_id].append(
            road.congestion
        )


def predict_next_congestion(
    road: RoadTraffic,
) -> tuple[float, str]:
    """
    Predict the next congestion value using
    the recent traffic trend.
    """

    history = traffic_history[road.road_id]

    # We need at least two readings
    # to calculate a trend.
    if len(history) < 2:
        return (
            round(road.congestion, 1),
            "Low",
        )

    previous = history[-2]
    current = history[-1]

    trend = current - previous

    # Prevent unrealistic jumps.
    trend = max(-8, min(8, trend))

    predicted = road.congestion + trend

    predicted = max(
        0,
        min(100, predicted),
    )

    # Confidence is based on how clearly
    # traffic is moving in one direction.
    if abs(trend) >= 3:
        confidence = "High"
    elif abs(trend) >= 1:
        confidence = "Medium"
    else:
        confidence = "Low"

    return (
        round(predicted, 1),
        confidence,
    )