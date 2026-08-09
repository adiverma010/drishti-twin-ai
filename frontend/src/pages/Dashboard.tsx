import { useEffect, useState } from "react";

import StatCard from "../components/dashboard/StatCard";
import RoadStatusList from "../components/dashboard/RoadStatusList";
import TrafficMap from "../components/dashboard/TrafficMap";
import TrafficChart from "../components/dashboard/TrafficChart";
import TrafficAlerts from "../components/dashboard/TrafficAlerts";
import TrafficPrediction from "../components/dashboard/TrafficPrediction";
import WhatIfSimulator from "../components/dashboard/WhatIfSimulator";

import {
  getTrafficDashboard,
  type RoadTraffic,
  type TrafficPrediction as TrafficPredictionData,
  type TrafficRecommendation,
} from "../services/trafficApi";

function Dashboard() {
  const [roads, setRoads] = useState<RoadTraffic[]>([]);

  const [predictions, setPredictions] =
    useState<TrafficPredictionData[]>([]);

  const [recommendations, setRecommendations] =
    useState<TrafficRecommendation[]>([]);

  const [trafficHistory, setTrafficHistory] =
    useState<
      {
        time: string;
        congestion: number;
        roadId: string;
      }[]
    >([]);

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadTrafficData = async () => {
      try {
        const data = await getTrafficDashboard();

        if (cancelled) {
          return;
        }

        setRoads(data.roads);
        setPredictions(data.predictions);
        setRecommendations(data.recommendations);
        setLastUpdated(new Date());

        const historyPoints = data.roads.map(
          (road) => ({
            time: new Date().toLocaleTimeString(),
            congestion: road.congestion,
            roadId: road.road_id,
          })
        );

        setTrafficHistory((previous) => [
          ...previous,
          ...historyPoints,
        ]);

        setError(null);
      } catch {
        if (!cancelled) {
          setError(
            "Unable to load live traffic data."
          );
        }
      }
    };

    loadTrafficData();

    const interval = window.setInterval(
      loadTrafficData,
      2000
    );

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const activeVehicles = roads.reduce(
    (total, road) =>
      total + road.vehicle_count,
    0
  );

  const averageCongestion =
    roads.length > 0
      ? roads.reduce(
          (total, road) =>
            total + road.congestion,
          0
        ) / roads.length
      : 0;

  const averageSpeed =
    roads.length > 0
      ? roads.reduce(
          (total, road) =>
            total + road.average_speed,
          0
        ) / roads.length
      : 0;

  const activeAlerts = roads.filter(
    (road) => road.congestion >= 45
  ).length;

  if (error && roads.length === 0) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
        <p className="text-red-400">
          {error}
        </p>
      </div>
    );
  }

  if (roads.length === 0) {
    return (
      <div>
        <p className="text-slate-400">
          Loading traffic data...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Dashboard Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">
          Dashboard
        </h2>

        <p className="mt-2 text-slate-400">
          Real-time traffic overview
        </p>

        {lastUpdated && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

            <span className="text-green-400">
              LIVE
            </span>

            <span className="text-slate-500">
              • Updated{" "}
              {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        )}

        {error && (
          <p className="mt-2 text-sm text-yellow-400">
            Temporary update issue. Showing the
            latest available traffic data.
          </p>
        )}
      </div>

      {/* Live Traffic Statistics */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active Vehicles"
          value={activeVehicles.toLocaleString()}
          description="Across monitored roads"
        />

        <StatCard
          title="Congestion"
          value={`${averageCongestion.toFixed(1)}%`}
          description="Current monitored roads"
        />

        <StatCard
          title="Average Speed"
          value={`${averageSpeed.toFixed(1)} km/h`}
          description="Across monitored roads"
        />

        <StatCard
          title="Active Alerts"
          value={activeAlerts.toString()}
          description="Require attention"
        />
      </div>

      {/* Digital Twin Map */}
      <div className="mt-6">
        <TrafficMap roads={roads} />
      </div>

      {/* Congestion Analytics */}
      <div className="mt-6">
        <TrafficChart data={trafficHistory} />
      </div>

      {/* Traffic Forecast */}
      <div className="mt-6">
        <TrafficPrediction
          predictions={predictions}
        />
      </div>

      {/* What-If Traffic Simulation */}
      <div className="mt-6">
        <WhatIfSimulator roads={roads} />
      </div>

      {/* AI Traffic Recommendations */}
      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div>
          <h3 className="text-lg font-semibold text-white">
            AI Traffic Recommendations
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Recommended actions based on live
            traffic conditions and predictions
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {recommendations.map(
            (recommendation) => (
              <div
                key={recommendation.road_id}
                className="rounded-lg border border-slate-800 bg-slate-800/50 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-medium text-white">
                      {recommendation.road_name}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Current:{" "}
                      {recommendation.current_congestion.toFixed(
                        1
                      )}
                      % → Predicted:{" "}
                      {recommendation.predicted_congestion.toFixed(
                        1
                      )}
                      %
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                      recommendation.priority ===
                      "Critical"
                        ? "bg-red-500/10 text-red-400"
                        : recommendation.priority ===
                          "High"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-slate-500/10 text-slate-300"
                    }`}
                  >
                    {recommendation.priority}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-200">
                  {
                    recommendation.recommended_action
                  }
                </p>

                {recommendation.alternative_road && (
                  <p className="mt-2 text-sm text-cyan-400">
                    Suggested alternative:{" "}
                    {
                      recommendation.alternative_road
                    }
                  </p>
                )}
              </div>
            )
          )}

          {recommendations.length === 0 && (
            <div className="rounded-lg border border-slate-800 bg-slate-800/50 p-4">
              <p className="text-sm text-slate-400">
                No immediate traffic
                recommendations. Current traffic
                conditions are manageable.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Traffic Alerts */}
      <div className="mt-6">
        <TrafficAlerts roads={roads} />
      </div>

      {/* Road Status */}
      <div className="mt-6">
        <RoadStatusList roads={roads} />
      </div>
    </div>
  );
}

export default Dashboard;