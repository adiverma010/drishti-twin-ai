import type { RoadTraffic } from "../../services/trafficApi";

interface TrafficAlertsProps {
  roads: RoadTraffic[];
}

function getPriority(congestion: number) {
  if (congestion >= 85) {
    return 3;
  }

  if (congestion >= 75) {
    return 2;
  }

  if (congestion >= 45) {
    return 1;
  }

  return 0;
}

function TrafficAlerts({ roads }: TrafficAlertsProps) {
  const alerts = roads
    .filter((road) => road.congestion >= 45)
    .sort(
      (a, b) =>
        getPriority(b.congestion) -
        getPriority(a.congestion)
    );

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div>
        <h3 className="text-lg font-semibold text-white">
          Traffic Alerts
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Current roads requiring attention
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {alerts.map((road) => {
          const priority = getPriority(
            road.congestion
          );

          if (priority === 3) {
            return (
              <div
                key={road.road_id}
                className="rounded-lg border border-red-500/30 bg-red-500/10 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">
                    🚨
                  </span>

                  <div>
                    <p className="font-semibold text-red-400">
                      Critical congestion
                    </p>

                    <p className="mt-1 text-sm text-slate-300">
                      {road.road_name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Congestion: {road.congestion}% ·{" "}
                      Speed: {road.average_speed} km/h
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          if (priority === 2) {
            return (
              <div
                key={road.road_id}
                className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">
                    ⚠️
                  </span>

                  <div>
                    <p className="font-semibold text-orange-400">
                      High congestion
                    </p>

                    <p className="mt-1 text-sm text-slate-300">
                      {road.road_name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Congestion: {road.congestion}% ·{" "}
                      Speed: {road.average_speed} km/h
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={road.road_id}
              className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">
                  ⚠
                </span>

                <div>
                  <p className="font-semibold text-yellow-400">
                    Moderate congestion
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    {road.road_name}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Congestion: {road.congestion}% ·{" "}
                    Speed: {road.average_speed} km/h
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {alerts.length === 0 && (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">
                ✓
              </span>

              <div>
                <p className="font-semibold text-green-400">
                  Traffic conditions normal
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  No roads currently require attention.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrafficAlerts;