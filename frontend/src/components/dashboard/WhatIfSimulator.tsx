import { useState } from "react";

import {
  type RoadTraffic,
} from "../../services/trafficApi";

interface WhatIfResult {
  road_id: string;
  road_name: string;
  current_congestion: number;
  congestion_change: number;
  simulated_congestion: number;
  direction: string;
  risk: string;
}

interface WhatIfSimulatorProps {
  roads: RoadTraffic[];
}

function WhatIfSimulator({
  roads,
}: WhatIfSimulatorProps) {
  const [selectedRoad, setSelectedRoad] =
    useState("");

  const [change, setChange] =
    useState(15);

  const [result, setResult] =
    useState<WhatIfResult | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const simulateScenario = async () => {
    if (!selectedRoad) {
      setError("Please select a road.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/traffic/what-if/${selectedRoad}?change=${change}`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to run simulation."
        );
      }

      const data: WhatIfResult =
        await response.json();

      setResult(data);
    } catch {
      setError(
        "Unable to run what-if simulation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div>
        <h3 className="text-lg font-semibold text-white">
          What-If Traffic Simulator
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Simulate how congestion changes could
          affect a monitored road.
        </p>
      </div>

      {/* Controls */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-400">
            Select Road
          </label>

          <select
            value={selectedRoad}
            onChange={(event) =>
              setSelectedRoad(
                event.target.value
              )
            }
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">
              Choose a road
            </option>

            {roads.map((road) => (
              <option
                key={road.road_id}
                value={road.road_id}
              >
                {road.road_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-slate-400">
            Congestion Change
          </label>

          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min="-30"
              max="30"
              step="1"
              value={change}
              onChange={(event) =>
                setChange(
                  Number(event.target.value)
                )
              }
              className="w-full"
            />

            <span
              className={`w-16 text-right text-sm font-semibold ${
                change > 0
                  ? "text-red-400"
                  : change < 0
                  ? "text-green-400"
                  : "text-slate-400"
              }`}
            >
              {change > 0 ? "+" : ""}
              {change}%
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Negative values improve traffic.
            Positive values worsen traffic.
          </p>
        </div>
      </div>

      {/* Simulate Button */}
      <button
        onClick={simulateScenario}
        disabled={loading}
        className="mt-5 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Simulating..."
          : "Run Simulation"}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-5 rounded-lg border border-slate-800 bg-slate-800/50 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-medium text-white">
                {result.road_name}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                What-if simulation result
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                result.risk === "Critical"
                  ? "bg-red-500/10 text-red-400"
                  : result.risk === "High"
                  ? "bg-orange-500/10 text-orange-400"
                  : result.risk === "Moderate"
                  ? "bg-yellow-500/10 text-yellow-400"
                  : "bg-green-500/10 text-green-400"
              }`}
            >
              {result.risk} Risk
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-lg bg-slate-900 p-3">
              <p className="text-xs text-slate-500">
                Current
              </p>

              <p className="mt-1 text-xl font-semibold text-white">
                {result.current_congestion.toFixed(
                  1
                )}
                %
              </p>
            </div>

            <div className="rounded-lg bg-slate-900 p-3">
              <p className="text-xs text-slate-500">
                Change
              </p>

              <p
                className={`mt-1 text-xl font-semibold ${
                  result.congestion_change > 0
                    ? "text-red-400"
                    : result.congestion_change < 0
                    ? "text-green-400"
                    : "text-slate-300"
                }`}
              >
                {result.congestion_change > 0
                  ? "+"
                  : ""}
                {result.congestion_change.toFixed(
                  1
                )}
                %
              </p>
            </div>

            <div className="rounded-lg bg-slate-900 p-3">
              <p className="text-xs text-slate-500">
                Simulated
              </p>

              <p className="mt-1 text-xl font-semibold text-cyan-400">
                {result.simulated_congestion.toFixed(
                  1
                )}
                %
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-700 pt-4">
            <p className="text-sm text-slate-400">
              Scenario Impact
            </p>

            <p
              className={`mt-1 font-semibold ${
                result.direction === "Worsening"
                  ? "text-red-400"
                  : result.direction ===
                    "Improving"
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              {result.direction}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default WhatIfSimulator;