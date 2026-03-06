import ExpenseChart from "@/components/app/ExpenseChart";
import LoadingSpinner from "@/components/app/LoadingSpinner";
import ProtectedRoute from "@/components/app/ProtectedRoute";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useExpenseAnalysis } from "@/hooks/useQueries";
import { AlertCircle, Lightbulb, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

const CustomBarTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bank-card rounded-xl px-4 py-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="amount-display mt-0.5 text-lg font-bold text-primary">
        ₹{payload[0].value.toLocaleString("en-IN")}
      </p>
    </div>
  );
};

export default function InsightsPage() {
  const { data: analysis, isLoading, error } = useExpenseAnalysis();

  return (
    <ProtectedRoute>
      <div
        data-ocid="insights.page"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-extrabold text-foreground">
            Expense Insights
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-powered analysis of your spending patterns
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <Alert
            data-ocid="insights.error_state"
            variant="destructive"
            className="mb-6"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load insights. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Loading */}
        {isLoading && (
          <div
            data-ocid="insights.loading_state"
            className="flex min-h-[40vh] flex-col items-center justify-center gap-4"
          >
            <LoadingSpinner size="lg" label="Analyzing your expenses..." />
          </div>
        )}

        {/* Skeleton while loading */}
        {isLoading && (
          <div className="flex flex-col gap-6">
            <Skeleton className="h-28 rounded-2xl" />
            <div className="grid gap-6 lg:grid-cols-2">
              <Skeleton className="h-80 rounded-2xl" />
              <Skeleton className="h-80 rounded-2xl" />
            </div>
          </div>
        )}

        {!isLoading && analysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-6"
          >
            {/* AI Advice Card */}
            <motion.div
              data-ocid="insights.advice.card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-primary/25 bg-primary/6 p-6 shadow-bank"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-primary/15 p-3">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">
                    AI Financial Advice
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {analysis.advice ||
                      "Add more transactions to receive personalized financial advice."}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Pie Chart */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bank-card rounded-2xl p-5"
              >
                <h2 className="mb-4 font-display text-lg font-bold text-foreground">
                  Spending by Category
                </h2>
                {analysis.categoryTotals.length > 0 ? (
                  <ExpenseChart data={analysis.categoryTotals} />
                ) : (
                  <div className="flex h-[280px] flex-col items-center justify-center text-center">
                    <p className="text-sm text-muted-foreground">
                      No data yet. Add transactions to see breakdown.
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Bar Chart: Monthly Spending */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bank-card rounded-2xl p-5"
              >
                <h2 className="mb-4 font-display text-lg font-bold text-foreground">
                  Monthly Spending
                </h2>
                {analysis.monthlySpending.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      data={analysis.monthlySpending}
                      margin={{ top: 4, right: 4, bottom: 0, left: -10 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        tick={{
                          fill: "#64748b",
                          fontSize: 11,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{
                          fill: "#64748b",
                          fontSize: 11,
                        }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `₹${v}`}
                      />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Bar
                        dataKey="total"
                        fill="#3b82f6"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-[280px] flex-col items-center justify-center text-center">
                    <TrendingUp className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No monthly data available yet.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Category Totals Table */}
            {analysis.categoryTotals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bank-card rounded-2xl p-5"
              >
                <h2 className="mb-5 font-display text-lg font-bold text-foreground">
                  Category Breakdown
                </h2>
                <div className="flex flex-col gap-3">
                  {[...analysis.categoryTotals]
                    .sort((a, b) => b.total - a.total)
                    .map((item, i) => {
                      const total = analysis.categoryTotals.reduce(
                        (s, c) => s + c.total,
                        0,
                      );
                      const pct = total > 0 ? (item.total / total) * 100 : 0;
                      const color = getColor(item.category, i);
                      return (
                        <div
                          key={item.category}
                          className="flex flex-col gap-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block h-2.5 w-2.5 rounded-full"
                                style={{ background: color }}
                              />
                              <span className="text-sm font-medium text-foreground">
                                {item.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground">
                                {pct.toFixed(1)}%
                              </span>
                              <span className="amount-display text-sm font-bold text-foreground">
                                ₹{item.total.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                duration: 0.8,
                                ease: "easeOut",
                                delay: i * 0.05,
                              }}
                              className="h-full rounded-full"
                              style={{ background: color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        <footer className="mt-12 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
