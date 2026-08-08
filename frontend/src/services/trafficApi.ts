const API_BASE_URL = "http://127.0.0.1:8000";

export async function getTrafficOverview() {
  const response = await fetch(
    `${API_BASE_URL}/api/traffic/overview`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch traffic overview");
  }

  return response.json();
}
export interface RoadTraffic {
  road_id: string;
  road_name: string;
  vehicle_count: number;
  average_speed: number;
  congestion: number;
  capacity: number;
  status: string;
}

export async function getTrafficRoads(): Promise<RoadTraffic[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/traffic/roads`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch traffic roads");
  }

  return response.json();
}
export function connectTrafficWebSocket(
  onUpdate: (roads: RoadTraffic[]) => void
) {
  const socket = new WebSocket(
    "ws://127.0.0.1:8000/ws/traffic"
  );

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    onUpdate(data.roads);
  };

  socket.onerror = () => {
    console.error("Traffic WebSocket connection failed");
  };

  return socket;
}