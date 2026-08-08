import { useEffect, useState } from "react";
import StatCard from "../components/dashboard/StatCard";
import RoadStatusList from "../components/dashboard/RoadStatusList";
import TrafficMap from "../components/dashboard/TrafficMap";
import TrafficChart from "../components/dashboard/TrafficChart";

import {
  getTrafficOverview,
  getTrafficRoads,
  connectTrafficWebSocket,
  type RoadTraffic,
} from "../services/trafficApi";


interface TrafficOverview {
  active_vehicles: number;
  congestion: number;
  average_speed: number;
  active_alerts: number;
}


function Dashboard() {
  const [roads, setRoads] = useState<RoadTraffic[]>([]);
  const [traffic, setTraffic] = useState<TrafficOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
const [trafficHistory, setTrafficHistory] = useState<
  { time: string; congestion: number }[]
>([]);

  useEffect(() => {
    // Get initial traffic overview
    getTrafficOverview()
      .then((data) => {
        setTraffic(data);
      })
      .catch(() => {
        setError("Unable to connect to traffic backend.");
      });


    // Get initial road data
    getTrafficRoads()
      .then((data) => {
        setRoads(data);
      })
      .catch(() => {
        setError("Unable to load road traffic data.");
      });


    // Connect to live traffic WebSocket
    const socket = connectTrafficWebSocket((updatedRoads) => {
  setRoads(updatedRoads);
  setLastUpdated(new Date());

  const activeVehicles = updatedRoads.reduce(
    (total, road) => total + road.vehicle_count,
    0
  );

  const averageSpeed =
    updatedRoads.reduce(
      (total, road) => total + road.average_speed,
      0
    ) / updatedRoads.length;

  const congestion =
    updatedRoads.reduce(
      (total, road) => total + road.congestion,
      0
    ) / updatedRoads.length;
    const historyPoint = {
  time: new Date().toLocaleTimeString(),
  congestion: Number(congestion.toFixed(1)),
};

setTrafficHistory((previous) => [
  ...previous.slice(-19),
  historyPoint,
]);

  const activeAlerts = updatedRoads.filter(
    (road) => road.status === "Heavy"
  ).length;

  setTraffic({
    active_vehicles: activeVehicles,
    congestion: Number(congestion.toFixed(1)),
    average_speed: Number(averageSpeed.toFixed(1)),
    active_alerts: activeAlerts,
  });
});

    // Close WebSocket when Dashboard is removed
    return () => {
      socket.close();
    };
  }, []);


  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }


  if (!traffic) {
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


      {/* Traffic Statistics */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Active Vehicles"
          value={traffic.active_vehicles.toLocaleString()}
          description="Across monitored roads"
        />

        <StatCard
          title="Congestion"
          value={`${traffic.congestion}%`}
          description="Current city congestion"
        />

        <StatCard
          title="Average Speed"
          value={`${traffic.average_speed} km/h`}
          description="Across monitored roads"
        />

        <StatCard
          title="Active Alerts"
          value={traffic.active_alerts.toString()}
          description="Require attention"
        />

      </div>

<div className="mt-6">
 <TrafficMap roads={roads} />
</div>

      {/* Live Road Status */}
      <div className="mt-6">
        <RoadStatusList roads={roads} />
      </div>
      <div className="mt-6">
  <TrafficChart data={trafficHistory} />
</div>

    </div>
  );
}


export default Dashboard;