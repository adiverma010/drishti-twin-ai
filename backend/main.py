import asyncio

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from services.traffic_service import simulate_traffic
from services.prediction_service import predict_from_roads
from services.prediction_engine import record_traffic


app = FastAPI(title="Drishti TwinAI API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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


@app.websocket("/ws/traffic")
async def traffic_websocket(
    websocket: WebSocket,
):
    await websocket.accept()

    try:
        while True:
            # Generate one live traffic state.
            roads = simulate_traffic()

            # Store this state in prediction history.
            record_traffic(roads)

            # Generate predictions from the
            # same roads and stored history.
            predictions = predict_from_roads(
                roads
            )

            await websocket.send_json(
                {
                    "roads": [
                        road.model_dump()
                        for road in roads
                    ],
                    "predictions": predictions,
                }
            )

            await asyncio.sleep(2)

    except Exception:
        print(
            "Traffic WebSocket disconnected"
        )