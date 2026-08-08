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
}

interface TrafficChartProps {
  data: TrafficHistoryPoint[];
}

function TrafficChart({ data }: TrafficChartProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div>
        <h3 className="text-lg font-semibold text-white">
          Congestion Trend
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Recent traffic congestion history
        </p>
      </div>

      <div className="mt-6 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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