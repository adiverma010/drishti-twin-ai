from pydantic import BaseModel


class RoadTraffic(BaseModel):
    road_id: str
    road_name: str
    vehicle_count: int
    average_speed: float
    congestion: float
    capacity: int
    status: str