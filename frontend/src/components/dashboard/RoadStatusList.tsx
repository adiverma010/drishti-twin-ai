import type { RoadTraffic } from "../../services/trafficApi";

interface RoadStatusListProps {
  roads: RoadTraffic[];
}

function RoadStatusList({ roads }: RoadStatusListProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h3 className="text-lg font-semibold text-white">
        Road Status
      </h3>

      <div className="mt-4 space-y-3">
        {roads.map((road) => (
          <div
            key={road.road_id}
            className="flex items-center justify-between rounded-lg bg-slate-800/60 p-4"
          >
            <div>
              <p className="font-medium text-white">
                {road.road_name}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                {road.vehicle_count} vehicles ·{" "}
                {road.average_speed} km/h
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                {road.congestion}%
              </p>

              <p className="text-sm text-slate-400">
                {road.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoadStatusList;