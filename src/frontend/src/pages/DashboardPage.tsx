import ExpenseChart from "@/components/app/ExpenseChart";
import LoadingSpinner from "@/components/app/LoadingSpinner";
import ProtectedRoute from "@/components/app/ProtectedRoute";
import TransactionCard from "@/components/app/TransactionCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useExpenseAnalysis,
  useInitializeSeedData,
  useTransactions,
  useWalletSummary,
} from "@/hooks/useQueries";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  DollarSign,
  PlusCircle,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function SummaryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <Skeleton className="mb-3 h-3 w-24" />
      <Skeleton className="h-9 w-36" />
    </div>
  );
}

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const navigate = useNavigate();

  const {
    data: transactions,
    isLoading: txLoading,
    error: txError,
  } = useTransactions();
  const { data: wallet, isLoading: walletLoading } = useWalletSummary();
  const { data: analysis, isLoading: analysisLoading } = useExpenseAnalysis();
  const { mutate: initSeedData, isPending: seeding } = useInitializeSeedData();

  // Redirect to landing if not authenticated
  useEffect(() => {
    if (!identity) {
      void navigate({ to: "/" });
    }
  }, [identity, navigate]);

  // Seed data on first login
  useEffect(() => {
    if (actor && !localStorage.getItem("finrizz_seeded")) {
      initSeedData(undefined, {
        onSuccess: () => {
          localStorage.setItem("finrizz_seeded", "1");
        },
      });
    }
  }, [actor, initSeedData]);

  const totalSpending =
    transactions?.reduce((sum, tx) => sum + tx.amount, 0) ?? 0;
  const recentTransactions = transactions?.slice(0, 5) ?? [];

  const isLoading = txLoading || walletLoading || analysisLoading || seeding;

  return (
    <ProtectedRoute>
      <div
        data-ocid="dashboard.page"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-extrabold text-foreground">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your financial overview at a glance
            </p>
          </div>
          <Link to="/add-transaction">
            <Button className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusCircle className="h-4 w-4" />
              Add Transaction
            </Button>
          </Link>
        </motion.div>

        {/* Error */}
        {txError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load transactions. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <motion.div
          className="mb-8 grid gap-4 sm:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {isLoading ? (
            <>
              <SummaryCardSkeleton />
              <SummaryCardSkeleton />
              <SummaryCardSkeleton />
            </>
          ) : (
            <>
              {/* Total Spending */}
              <motion.div
                data-ocid="dashboard.spending.card"
                variants={cardVariants}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Total Spending
                    </p>
                    <p className="amount-display mt-2 text-3xl font-extrabold text-foreground">
                      ₹{totalSpending.toLocaleString("en-IN")}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Across {transactions?.length ?? 0} transactions
                    </p>
                  </div>
                  <div className="rounded-xl bg-orange-500/15 p-2.5">
                    <DollarSign className="h-5 w-5 text-orange-400" />
                  </div>
                </div>
              </motion.div>

              {/* Total Invested */}
              <motion.div
                data-ocid="dashboard.invested.card"
                variants={cardVariants}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-primary/40 bg-primary/10 p-5 shadow-card glow-teal-sm transition-shadow hover:shadow-card-hover"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-primary/70">
                      Total Invested
                    </p>
                    <p className="amount-display mt-2 text-3xl font-extrabold text-primary">
                      ₹
                      {(wallet?.investedAmount ?? 0).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="mt-1 text-xs text-primary/60">
                      80% of roundups
                    </p>
                  </div>
                  <div className="rounded-xl bg-primary/20 p-2.5">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </motion.div>

              {/* Roundup Balance */}
              <motion.div
                data-ocid="dashboard.roundup.card"
                variants={cardVariants}
                whileHover={{ y: -3 }}
                className="rounded-2xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Roundup Balance
                    </p>
                    <p className="amount-display mt-2 text-3xl font-extrabold text-foreground">
                      ₹
                      {(wallet?.availableAmount ?? 0).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Available to invest
                    </p>
                  </div>
                  <div className="rounded-xl bg-secondary p-2.5">
                    <Wallet className="h-5 w-5 text-foreground" />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Charts + Recent Transactions */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-card lg:col-span-3"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-foreground">
                Recent Transactions
              </h2>
              <Link
                to="/add-transaction"
                className="text-xs font-medium text-primary hover:underline"
              >
                + Add New
              </Link>
            </div>

            {txLoading || seeding ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            ) : recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-3 rounded-2xl bg-muted p-4">
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No transactions yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Add your first transaction to get started
                </p>
                <Link to="/add-transaction">
                  <Button
                    size="sm"
                    className="mt-4 gap-2 rounded-lg bg-primary text-primary-foreground"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add Transaction
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {recentTransactions.map((tx, i) => (
                  <TransactionCard
                    key={String(tx.id)}
                    transaction={tx}
                    index={i}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Expense Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-card lg:col-span-2"
          >
            <h2 className="mb-2 font-display text-lg font-bold text-foreground">
              Spending by Category
            </h2>
            {analysisLoading || seeding ? (
              <div className="flex h-[280px] items-center justify-center">
                <LoadingSpinner size="lg" label="Loading chart..." />
              </div>
            ) : analysis?.categoryTotals?.length ? (
              <ExpenseChart data={analysis.categoryTotals} />
            ) : (
              <div className="flex h-[280px] flex-col items-center justify-center text-center">
                <div className="mb-3 rounded-2xl bg-muted p-4">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No data yet. Add transactions to see spending breakdown.
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Investment Wallet Summary */}
        {wallet && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5 shadow-card"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">
                  Investment Wallet
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Total roundup collected: ₹
                  {wallet.totalRoundup.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <Link to="/investments">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-primary/40 text-primary hover:bg-primary/10"
                >
                  <Wallet className="h-4 w-4" />
                  View Wallet
                </Button>
              </Link>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Invested (80%): ₹
                  {wallet.investedAmount.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span>
                  Available (20%): ₹
                  {wallet.availableAmount.toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{
                    width:
                      wallet.totalRoundup > 0
                        ? `${(wallet.investedAmount / wallet.totalRoundup) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
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
