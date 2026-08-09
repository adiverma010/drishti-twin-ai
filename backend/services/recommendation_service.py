from models.traffic import RoadTraffic


def generate_recommendations(
    roads: list[RoadTraffic],
    predictions: list[dict],
) -> list[dict]:
    recommendations = []

    prediction_map = {
        prediction["road_id"]: prediction
        for prediction in predictions
    }

    for road in roads:
        prediction = prediction_map.get(
            road.road_id
        )

        if not prediction:
            continue

        current_congestion = road.congestion

        predicted_congestion = prediction[
            "predicted_congestion"
        ]

        congestion_change = (
            predicted_congestion
            - current_congestion
        )

        # Ignore roads that are not expected
        # to reach significant congestion.
        if predicted_congestion < 75:
            continue

        alternative_roads = [
            alternative
            for alternative in roads
            if (
                alternative.road_id != road.road_id
                and alternative.congestion < 60
            )
        ]

        alternative = None

        if alternative_roads:
            alternative = min(
                alternative_roads,
                key=lambda item: item.congestion,
            )

        # Determine recommendation priority
        # using both predicted congestion
        # and how quickly it is increasing.
        if (
            predicted_congestion >= 90
            or congestion_change >= 6
        ):
            priority = "Critical"

            action = (
                "Immediate traffic intervention "
                "recommended."
            )

        elif (
            predicted_congestion >= 75
            or congestion_change >= 3
        ):
            priority = "High"

            action = (
                "Traffic diversion should be "
                "considered."
            )

        else:
            priority = "Moderate"

            action = (
                "Monitor traffic conditions "
                "closely."
            )

        if alternative:
            recommendation = (
                f"{action} "
                f"Consider diverting traffic from "
                f"{road.road_name} toward "
                f"{alternative.road_name}."
            )
        else:
            recommendation = (
                f"{action} "
                f"No suitable low-congestion "
                f"alternative road is currently "
                f"available."
            )

        recommendations.append(
            {
                "road_id": road.road_id,
                "road_name": road.road_name,
                "priority": priority,
                "current_congestion":
                    round(current_congestion, 1),
                "predicted_congestion":
                    round(predicted_congestion, 1),
                "congestion_change":
                    round(congestion_change, 1),
                "recommended_action":
                    recommendation,
                "alternative_road": (
                    alternative.road_name
                    if alternative
                    else None
                ),
            }
        )

    priority_order = {
        "Critical": 0,
        "High": 1,
        "Moderate": 2,
    }

    recommendations.sort(
        key=lambda item:
            priority_order[item["priority"]]
    )

    return recommendations