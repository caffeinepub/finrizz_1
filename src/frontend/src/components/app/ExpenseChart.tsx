import type { CategoryTotal } from "@/backend.d";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ExpenseChartProps {
  data: CategoryTotal[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#f97316",
  Transport: "#3b82f6",
  Shopping: "#a855f7",
  Entertainment: "#ec4899",
  Utilities: "#eab308",
  Other: "#94a3b8",
};

function getColor(category: string, index: number): string {
  return (
    CATEGORY_COLORS[category] ??
    ["#14b8a6", "#6366f1", "#22d3ee", "#f43f5e", "#84cc16"][index % 5]
  );
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { fill: string } }>;
}) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-card">
      <p className="text-sm font-semibold text-foreground">{item.name}</p>
      <p className="amount-display mt-0.5 text-lg font-bold text-primary">
        ₹{item.value.toLocaleString("en-IN")}
      </p>
    </div>
  );
};

export default function ExpenseChart({ data }: ExpenseChartProps) {
  if (!data.length) return null;

  const chartData = data.map((item, i) => ({
    name: item.category,
    value: item.total,
    fill: getColor(item.category, i),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={entry.fill}
              stroke="oklch(0.11 0.025 258)"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ color: "oklch(0.75 0.02 258)", fontSize: "12px" }}>
              {value}
            </span>
          )}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
