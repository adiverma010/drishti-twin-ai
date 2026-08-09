from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.traffic_service import simulate_traffic
from services.prediction_service import predict_from_roads
from services.prediction_engine import record_traffic
from services.recommendation_service import (
    generate_recommendations,
)
from services.what_if_service import (
    simulate_what_if,
)


app = FastAPI(title="Drishti TwinAI API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "project": "Drishti TwinAI",
        "status": "Backend Running",
        "version": "1.0.0",
    }


@app.get("/api/traffic/overview")
def traffic_overview():
    return {
        "active_vehicles": 1248,
        "congestion": 67,
        "average_speed": 42,
        "active_alerts": 8,
    }


@app.get("/api/traffic/roads")
def traffic_roads():
    return simulate_traffic()


@app.get("/api/traffic/predictions")
def traffic_predictions():
    roads = simulate_traffic()

    record_traffic(roads)

    return predict_from_roads(roads)


@app.get("/api/traffic/recommendations")
def traffic_recommendations():
    roads = simulate_traffic()

    record_traffic(roads)

    predictions = predict_from_roads(
        roads
    )

    return generate_recommendations(
        roads,
        predictions,
    )
@app.get("/api/traffic/dashboard")
def traffic_dashboard():
    roads = simulate_traffic()

    record_traffic(roads)

    predictions = predict_from_roads(
        roads
    )

    recommendations = generate_recommendations(
        roads,
        predictions,
    )

    return {
        "roads": roads,
        "predictions": predictions,
        "recommendations": recommendations,
    }

@app.get("/api/traffic/what-if/{road_id}")
def traffic_what_if(
    road_id: str,
    change: float = 15,
):
    roads = simulate_traffic()

    road = next(
        (
            item
            for item in roads
            if item.road_id == road_id
        ),
        None,
    )

    if road is None:
        return {
            "error": f"Road {road_id} not found."
        }

    return simulate_what_if(
        road,
        change,
    )