
interface TrafficPredictionData {
  road_id: string;
  road_name: string;
  current_congestion: number;
  predicted_congestion: number;
  prediction_status: string;
}

interface TrafficPredictionProps {
  predictions: TrafficPredictionData[];
}

function TrafficPrediction({
  predictions,
}: TrafficPredictionProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div>
        <h3 className="text-lg font-semibold text-white">
          Traffic Forecast
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Short-term congestion prediction
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {predictions.map((prediction) => {
          const change =
            prediction.predicted_congestion -
            prediction.current_congestion;

          const isHigh =
            prediction.prediction_status === "High";

          return (
            <div
              key={prediction.road_id}
              className="rounded-lg border border-slate-800 bg-slate-800/50 p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-white">
                    {prediction.road_name}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Current:{" "}
                    {prediction.current_congestion.toFixed(1)}%
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-sm text-slate-400">
                    Predicted
                  </p>

                  <p
                    className={`text-2xl font-bold ${
                      isHigh
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {prediction.predicted_congestion.toFixed(1)}%
                  </p>

                  <p
                    className={`text-sm ${
                      change > 0
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {change > 0 ? "+" : ""}
                    {change.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="mt-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    isHigh
                      ? "bg-red-500/10 text-red-400"
                      : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {prediction.prediction_status}
                </span>
              </div>
            </div>
          );
        })}

        {predictions.length === 0 && (
          <div className="rounded-lg border border-slate-800 bg-slate-800/50 p-4">
            <p className="text-sm text-slate-400">
              No prediction data available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrafficPrediction;