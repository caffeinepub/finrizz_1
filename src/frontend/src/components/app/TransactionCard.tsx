import type { Transaction } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface TransactionCardProps {
  transaction: Transaction;
  index?: number;
}

const categoryConfig: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  Food: {
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
  },
  Transport: {
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  Shopping: {
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  Entertainment: {
    color: "text-pink-700",
    bg: "bg-pink-50",
    border: "border-pink-200",
  },
  Utilities: {
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  Other: {
    color: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-200",
  },
};

function getCategoryConfig(category: string) {
  return (
    categoryConfig[category] ?? {
      color: "text-slate-600",
      bg: "bg-slate-100",
      border: "border-slate-200",
    }
  );
}

function formatTimestamp(timestamp: bigint): string {
  return new Date(Number(timestamp / 1_000_000n)).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const ocidMap: Record<number, string> = {
  0: "transaction.item.1",
  1: "transaction.item.2",
  2: "transaction.item.3",
  3: "transaction.item.4",
  4: "transaction.item.5",
};

export default function TransactionCard({
  transaction,
  index = 0,
}: TransactionCardProps) {
  const cfg = getCategoryConfig(transaction.category);
  const ocid = ocidMap[index] ?? `transaction.item.${index + 1}`;

  return (
    <motion.div
      data-ocid={ocid}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center justify-between rounded-xl border border-border bg-secondary/40 px-4 py-3.5 transition-all hover:bg-secondary/60 hover:shadow-card"
    >
      {/* Left: Category badge + description */}
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "shrink-0 rounded-lg border px-2.5 py-1 text-xs font-semibold",
            cfg.color,
            cfg.bg,
            cfg.border,
          )}
        >
          {transaction.category}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {transaction.description}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatTimestamp(transaction.timestamp)}
          </p>
        </div>
      </div>

      {/* Right: Amount + roundup */}
      <div className="ml-4 shrink-0 text-right">
        <p className="amount-display text-base font-bold text-foreground">
          ₹{transaction.amount.toLocaleString("en-IN")}
        </p>
        {transaction.roundupAmount > 0 && (
          <p className="flex items-center justify-end gap-1 text-xs font-medium text-primary">
            <TrendingUp className="h-3 w-3" />₹{transaction.roundupAmount}{" "}
            invested
          </p>
        )}
      </div>
    </motion.div>
  );
}
