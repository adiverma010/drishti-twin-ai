import { useEffect, useState } from "react";

import StatCard from "../components/dashboard/StatCard";
import RoadStatusList from "../components/dashboard/RoadStatusList";
import TrafficMap from "../components/dashboard/TrafficMap";
import TrafficChart from "../components/dashboard/TrafficChart";
import TrafficAlerts from "../components/dashboard/TrafficAlerts";
import TrafficPrediction from "../components/dashboard/TrafficPrediction";

import {
  getTrafficRoads,
  getTrafficPredictions,
  connectTrafficWebSocket,
  type RoadTraffic,
  type TrafficPrediction as TrafficPredictionData,
} from "../services/trafficApi";

function Dashboard() {
  const [roads, setRoads] = useState<RoadTraffic[]>([]);

  const [predictions, setPredictions] =
    useState<TrafficPredictionData[]>([]);

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
    getTrafficRoads()
      .then((data) => {
        setRoads(data);
      })
      .catch(() => {
        setError(
          "Unable to load road traffic data."
        );
      });

    getTrafficPredictions()
      .then((data) => {
        setPredictions(data);
      })
      .catch(() => {
        setError(
          "Unable to load traffic predictions."
        );
      });

    const socket = connectTrafficWebSocket(
      (updatedRoads, updatedPredictions) => {
        setRoads(updatedRoads);

        setPredictions(updatedPredictions);

        setLastUpdated(new Date());

        const historyPoints = updatedRoads.map(
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
      }
    );

    return () => {
      socket.close();
    };
  }, []);

  /*
   * Calculate dashboard statistics
   * directly from the live road data.
   */

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

  if (error) {
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