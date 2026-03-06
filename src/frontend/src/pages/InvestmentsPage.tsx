import InvestmentCard from "@/components/app/InvestmentCard";
import LoadingSpinner from "@/components/app/LoadingSpinner";
import ProtectedRoute from "@/components/app/ProtectedRoute";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useInvestmentHistory, useWalletSummary } from "@/hooks/useQueries";
import {
  AlertCircle,
  Clock,
  PiggyBank,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";

function formatTimestamp(timestamp: bigint): string {
  return new Date(Number(timestamp / 1_000_000n)).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InvestmentsPage() {
  const {
    data: wallet,
    isLoading: walletLoading,
    error: walletError,
  } = useWalletSummary();
  const {
    data: history,
    isLoading: historyLoading,
    error: historyError,
  } = useInvestmentHistory();

  const isLoading = walletLoading || historyLoading;
  const hasError = walletError || historyError;

  const investedPct =
    wallet && wallet.totalRoundup > 0
      ? (wallet.investedAmount / wallet.totalRoundup) * 100
      : 0;

  return (
    <ProtectedRoute>
      <div
        data-ocid="investments.page"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-extrabold text-foreground">
            Investment Wallet
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your roundup investments are automatically growing
          </p>
        </motion.div>

        {/* Error */}
        {hasError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load investment data. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Loading */}
        {isLoading && (
          <div
            data-ocid="investments.loading_state"
            className="flex min-h-[40vh] flex-col items-center justify-center gap-4"
          >
            <LoadingSpinner size="lg" label="Loading wallet..." />
          </div>
        )}

        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-6"
          >
            {/* Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              {walletLoading ? (
                <>
                  <Skeleton className="h-32 rounded-2xl" />
                  <Skeleton className="h-32 rounded-2xl" />
                  <Skeleton className="h-32 rounded-2xl" />
                </>
              ) : (
                <>
                  <InvestmentCard
                    data-ocid="investments.total.card"
                    title="Total Roundup"
                    amount={wallet?.totalRoundup ?? 0}
                    icon={PiggyBank}
                    variant="default"
                    subtitle="Total spare change collected"
                  />
                  <InvestmentCard
                    data-ocid="investments.invested.card"
                    title="Invested Amount"
                    amount={wallet?.investedAmount ?? 0}
                    icon={TrendingUp}
                    variant="teal"
                    subtitle="80% of roundups — growing"
                  />
                  <InvestmentCard
                    data-ocid="investments.available.card"
                    title="Available Balance"
                    amount={wallet?.availableAmount ?? 0}
                    icon={Wallet}
                    variant="muted"
                    subtitle="20% of roundups — liquid"
                  />
                </>
              )}
            </div>

            {/* Progress Bar */}
            {wallet && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl border border-border bg-card p-5 shadow-card"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-base font-bold text-foreground">
                    Portfolio Allocation
                  </h2>
                  <span className="text-sm font-semibold text-primary">
                    {investedPct.toFixed(1)}% Invested
                  </span>
                </div>
                <Progress value={investedPct} className="h-3 rounded-full" />
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                    Invested: ₹
                    {wallet.investedAmount.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    (80%)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground" />
                    Available: ₹
                    {wallet.availableAmount.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}{" "}
                    (20%)
                  </div>
                </div>
              </motion.div>
            )}

            {/* Investment History */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              data-ocid="investments.history.list"
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="mb-5 flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-display text-lg font-bold text-foreground">
                  Investment History
                </h2>
              </div>

              {historyLoading ? (
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                </div>
              ) : !history?.length ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-3 rounded-2xl bg-muted p-4">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    No investment history yet
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Make transactions with non-round amounts to start investing
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {history.map((item, i) => (
                    <motion.div
                      key={`${String(item.timestamp)}-${i}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/15 p-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Roundup Investment
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTimestamp(item.timestamp)}
                          </p>
                        </div>
                      </div>
                      <p className="amount-display text-base font-bold text-primary">
                        +₹
                        {item.amount.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* How it works info */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-xl border border-border bg-secondary/30 p-5"
            >
              <h3 className="mb-3 text-sm font-bold text-foreground">
                How Roundup Investing Works
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    step: "1",
                    title: "You Spend",
                    desc: "Make any transaction — buying food, transport, shopping",
                  },
                  {
                    step: "2",
                    title: "We Round Up",
                    desc: "₹47 → rounds to ₹50 → ₹3 is your investment",
                  },
                  {
                    step: "3",
                    title: "Money Grows",
                    desc: "80% is invested, 20% stays liquid for you",
                  },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      {step}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
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
