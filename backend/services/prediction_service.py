from models.traffic import RoadTraffic


def predict_from_roads(
    roads: list[RoadTraffic],
) -> list[dict]:
    predictions = []

    for road in roads:
        current_congestion = road.congestion

        if current_congestion >= 75:
            predicted_change = 5
        elif current_congestion >= 45:
            predicted_change = 3
        else:
            predicted_change = 1

        predicted_congestion = min(
            100,
            round(
                current_congestion + predicted_change,
                1,
            ),
        )

        if predicted_congestion >= 75:
            prediction_status = "High"
        elif predicted_congestion >= 45:
            prediction_status = "Moderate"
        else:
            prediction_status = "Low"

        predictions.append(
            {
                "road_id": road.road_id,
                "road_name": road.road_name,
                "current_congestion": current_congestion,
                "predicted_congestion": predicted_congestion,
                "prediction_status": prediction_status,
            }
        )

    return predictions