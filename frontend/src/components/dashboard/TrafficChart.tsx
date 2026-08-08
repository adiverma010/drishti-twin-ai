import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrafficHistoryPoint {
  time: string;
  congestion: number;
  roadId: string;
}

interface TrafficChartProps {
  data: TrafficHistoryPoint[];
}

function TrafficChart({ data }: TrafficChartProps) {
  const [selectedRoad, setSelectedRoad] = useState("ALL");

  const filteredData =
    selectedRoad === "ALL"
      ? data
      : data.filter((point) => point.roadId === selectedRoad);

  const recentData = filteredData.slice(-10);

  const firstCongestion =
    recentData.length > 0
      ? recentData[0].congestion
      : 0;

  const latestCongestion =
    recentData.length > 0
      ? recentData[recentData.length - 1].congestion
      : 0;

  const peakCongestion =
    recentData.length > 0
      ? Math.max(
          ...recentData.map((point) => point.congestion)
        )
      : 0;

  const congestionChange =
    latestCongestion - firstCongestion;

  let trend = "Stable";

  if (congestionChange >= 5) {
    trend = "Worsening";
  } else if (congestionChange <= -5) {
    trend = "Improving";
  }

  let severity = "Low";

  if (peakCongestion >= 75) {
    severity = "Severe";
  } else if (peakCongestion >= 45) {
    severity = "Moderate";
  }

  const selectedRoadName =
    selectedRoad === "R01"
      ? "Ring Road - Sector A"
      : selectedRoad === "R02"
      ? "Main Boulevard"
      : selectedRoad === "R03"
      ? "Airport Road"
      : selectedRoad === "R04"
      ? "City Center Road"
      : "All monitored roads";

  let insight = "";

  if (trend === "Worsening") {
    insight = `${selectedRoadName} is experiencing worsening congestion.`;
  } else if (trend === "Improving") {
    insight = `${selectedRoadName} is showing improving traffic conditions.`;
  } else {
    insight = `${selectedRoadName} traffic conditions are currently stable.`;
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-white">
          Congestion Trend
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Recent traffic congestion history
        </p>

        <select
          value={selectedRoad}
          onChange={(event) =>
            setSelectedRoad(event.target.value)
          }
          className="mt-4 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none"
        >
          <option value="ALL">All Roads</option>
          <option value="R01">
            Ring Road - Sector A
          </option>
          <option value="R02">
            Main Boulevard
          </option>
          <option value="R03">
            Airport Road
          </option>
          <option value="R04">
            City Center Road
          </option>
        </select>
      </div>

      {/* Traffic Insights */}
      <div className="mt-4 rounded-lg border border-slate-800 bg-slate-800/50 p-4">
        <p className="text-sm text-slate-400">
          Traffic Trend
        </p>

        <div className="mt-1 flex items-center gap-2">
          <span
            className={`text-lg font-semibold ${
              trend === "Worsening"
                ? "text-red-400"
                : trend === "Improving"
                ? "text-green-400"
                : "text-yellow-400"
            }`}
          >
            {trend}
          </span>

          <span className="text-sm text-slate-400">
            {congestionChange > 0 ? "+" : ""}
            {congestionChange.toFixed(1)}%
          </span>
        </div>

        {/* Peak */}
        <div className="mt-3 border-t border-slate-700 pt-3">
          <p className="text-sm text-slate-400">
            Peak Congestion
          </p>

          <p className="mt-1 text-xl font-semibold text-red-400">
            {peakCongestion.toFixed(1)}%
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Severity:{" "}
            <span
              className={
                severity === "Severe"
                  ? "font-semibold text-red-400"
                  : severity === "Moderate"
                  ? "font-semibold text-yellow-400"
                  : "font-semibold text-green-400"
              }
            >
              {severity}
            </span>
          </p>
        </div>

        {/* Insight */}
        <div className="mt-3 border-t border-slate-700 pt-3">
          <p className="text-sm text-slate-400">
            Traffic Insight
          </p>

          <p className="mt-1 text-sm text-slate-200">
            {insight}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 h-[300px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={filteredData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
            />

            <XAxis
              dataKey="time"
              stroke="#94a3b8"
            />

            <YAxis
              domain={[0, 100]}
              stroke="#94a3b8"
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="congestion"
              stroke="#22d3ee"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TrafficChart;