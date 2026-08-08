import random
from models.traffic import RoadTraffic


roads = [
    RoadTraffic(
        road_id="R01",
        road_name="Ring Road - Sector A",
        vehicle_count=120,
        average_speed=42,
        congestion=35,
        capacity=250,
        status="Moderate",
    ),
    RoadTraffic(
        road_id="R02",
        road_name="Main Boulevard",
        vehicle_count=210,
        average_speed=24,
        congestion=72,
        capacity=250,
        status="Heavy",
    ),
    RoadTraffic(
        road_id="R03",
        road_name="Airport Road",
        vehicle_count=80,
        average_speed=52,
        congestion=18,
        capacity=300,
        status="Low",
    ),
    RoadTraffic(
        road_id="R04",
        road_name="City Center Road",
        vehicle_count=175,
        average_speed=30,
        congestion=58,
        capacity=220,
        status="Moderate",
    ),
]


def simulate_traffic() -> list[RoadTraffic]:
    global roads

    updated_roads = []

    for road in roads:
        vehicle_change = random.randint(-12, 15)

        new_vehicle_count = max(
            0,
            min(
                road.vehicle_count + vehicle_change,
                road.capacity,
            ),
        )

        congestion = (new_vehicle_count / road.capacity) * 100

        speed = max(
            10,
            60 - (congestion * 0.45) + random.uniform(-3, 3),
        )

        if congestion >= 75:
            status = "Heavy"
        elif congestion >= 45:
            status = "Moderate"
        else:
            status = "Low"

        updated_roads.append(
            RoadTraffic(
                road_id=road.road_id,
                road_name=road.road_name,
                vehicle_count=new_vehicle_count,
                average_speed=round(speed, 1),
                congestion=round(congestion, 1),
                capacity=road.capacity,
                status=status,
            )
        )

    roads = updated_roads

    return roads