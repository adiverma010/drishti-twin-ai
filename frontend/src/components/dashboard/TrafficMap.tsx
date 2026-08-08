import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import type { RoadTraffic } from "../../services/trafficApi";

interface TrafficMapProps {
  roads: RoadTraffic[];
}

const roadLocations: Record<string, [number, number]> = {
  R01: [28.6139, 77.2090],
  R02: [28.6280, 77.2195],
  R03: [28.5562, 77.1000],
  R04: [28.6328, 77.2197],
};
const roadSegments: Record<
  string,
  [number, number][]
> = {
  R01: [
    [28.6139, 77.2090],
    [28.6185, 77.2140],
    [28.6230, 77.2180],
  ],

  R02: [
    [28.6280, 77.2195],
    [28.6320, 77.2240],
    [28.6360, 77.2290],
  ],

  R03: [
    [28.5562, 77.1000],
    [28.5600, 77.1060],
    [28.5640, 77.1120],
  ],

  R04: [
    [28.6328, 77.2197],
    [28.6280, 77.2150],
    [28.6230, 77.2110],
  ],
};

function getStatusColor(status: string) {
  if (status === "Heavy") {
    return "red";
  }

  if (status === "Moderate") {
    return "orange";
  }

  return "green";
}

function TrafficMap({ roads }: TrafficMapProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800">
        <div className="absolute left-4 top-4 z-[1000] rounded-lg bg-slate-900/90 px-4 py-3 text-sm text-white shadow-lg">
  <p className="mb-2 font-semibold">
    Traffic Level
  </p>

  <div className="space-y-1">
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded-full bg-green-500" />
      <span>Low</span>
    </div>

    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded-full bg-orange-500" />
      <span>Moderate</span>
    </div>

    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded-full bg-red-500" />
      <span>Heavy</span>
    </div>
  </div>
</div>
      <MapContainer
        center={[28.6139, 77.2090]}
        zoom={12}
        scrollWheelZoom={true}
        className="h-[500px] w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {roads.map((road) => {
          const position = roadLocations[road.road_id];

          if (!position) {
            return null;
          }

          return (
  <>
    <Polyline
      positions={roadSegments[road.road_id]}
      pathOptions={{
        color: getStatusColor(road.status),
        weight: 6,
        opacity: 0.9,
      }}
    />

    <CircleMarker
      key={road.road_id}
      center={position}
      radius={10}
      pathOptions={{
        color: getStatusColor(road.status),
        fillColor: getStatusColor(road.status),
        fillOpacity: 0.7,
      }}
    >
      <Popup>
        <strong>{road.road_name}</strong>
        <br />
        Vehicles: {road.vehicle_count}
        <br />
        Speed: {road.average_speed} km/h
        <br />
        Congestion: {road.congestion}%
        <br />
        Status: {road.status}
      </Popup>
    </CircleMarker>
  </>
);
        })}
      </MapContainer>
    </div>
  );
}

export default TrafficMap;