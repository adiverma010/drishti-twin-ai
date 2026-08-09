const API_BASE_URL = "http://127.0.0.1:8000";

export interface RoadTraffic {
  road_id: string;
  road_name: string;
  vehicle_count: number;
  average_speed: number;
  congestion: number;
  capacity: number;
  status: string;
}

export interface TrafficPrediction {
  road_id: string;
  road_name: string;
  current_congestion: number;
  predicted_congestion: number;
  prediction_status: string;
  confidence: string;
}

export interface TrafficRecommendation {
  road_id: string;
  road_name: string;
  priority: string;
  current_congestion: number;
  predicted_congestion: number;
  recommended_action: string;
  alternative_road: string | null;
}

export async function getTrafficRoads(): Promise<
  RoadTraffic[]
> {
  const response = await fetch(
    `${API_BASE_URL}/api/traffic/roads`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch traffic roads"
    );
  }

  return response.json();
}

export async function getTrafficPredictions(): Promise<
  TrafficPrediction[]
> {
  const response = await fetch(
    `${API_BASE_URL}/api/traffic/predictions`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch traffic predictions"
    );
  }

  return response.json();
}

export async function getTrafficRecommendations(): Promise<
  TrafficRecommendation[]
> {
  const response = await fetch(
    `${API_BASE_URL}/api/traffic/recommendations`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch traffic recommendations"
    );
  }

  return response.json();
}

export function connectTrafficWebSocket(
  onUpdate: (
    roads: RoadTraffic[],
    predictions: TrafficPrediction[],
    recommendations: TrafficRecommendation[]
  ) => void
) {
  const socket = new WebSocket(
    "ws://127.0.0.1:8000/ws/traffic"
  );

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    onUpdate(
      data.roads,
      data.predictions,
      data.recommendations
    );
  };

  socket.onerror = () => {
    console.error(
      "Traffic WebSocket connection failed"
    );
  };

  return socket;
}