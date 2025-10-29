import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface TrendLineChartProps {
  data: Array<{ x: string | number; y: number }>;
  stroke?: string;
  height?: number;
}

export function TrendLineChart({ data, stroke = "#2563eb", height = 220 }: TrendLineChartProps) {
  const chartData = data.map((d) => ({ name: d.x, value: d.y }));
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={stroke} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


