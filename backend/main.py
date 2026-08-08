import asyncio

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from services.traffic_service import simulate_traffic


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
        "version": "1.0.0"
    }


@app.get("/api/traffic/overview")
def traffic_overview():
    roads = simulate_traffic()

    active_vehicles = sum(
        road.vehicle_count for road in roads
    )

    average_speed = round(
        sum(road.average_speed for road in roads) / len(roads),
        1,
    )

    congestion = round(
        sum(road.congestion for road in roads) / len(roads),
        1,
    )

    active_alerts = sum(
        1 for road in roads
        if road.status == "Heavy"
    )

    return {
        "active_vehicles": active_vehicles,
        "congestion": congestion,
        "average_speed": average_speed,
        "active_alerts": active_alerts,
    }

@app.get("/api/traffic/roads")
def traffic_roads():
    return simulate_traffic()


@app.websocket("/ws/traffic")
async def traffic_websocket(websocket: WebSocket):
    await websocket.accept()

    try:
        while True:
            roads = simulate_traffic()

            await websocket.send_json({
                "roads": [road.model_dump() for road in roads]
            })

            await asyncio.sleep(2)

    except Exception:
        print("Traffic WebSocket disconnected")