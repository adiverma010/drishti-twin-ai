from models.traffic import RoadTraffic

from services.prediction_engine import (
    predict_next_congestion,
)


def predict_from_roads(
    roads: list[RoadTraffic],
) -> list[dict]:
    predictions = []

    for road in roads:
        (
            predicted_congestion,
            confidence,
        ) = predict_next_congestion(road)

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
                "current_congestion": road.congestion,
                "predicted_congestion": predicted_congestion,
                "prediction_status": prediction_status,
                "confidence": confidence,
            }
        )

    return predictions