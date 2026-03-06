import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface InvestmentCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  variant?: "default" | "teal" | "muted";
  subtitle?: string;
  "data-ocid"?: string;
}

const variantStyles = {
  default: "border-border bg-card",
  teal: "border-primary/40 bg-primary/10 glow-teal-sm",
  muted: "border-border bg-secondary/40",
};

const iconVariantStyles = {
  default: "bg-secondary text-foreground",
  teal: "bg-primary/20 text-primary",
  muted: "bg-muted text-muted-foreground",
};

export default function InvestmentCard({
  title,
  amount,
  icon: Icon,
  variant = "default",
  subtitle,
  "data-ocid": ocid,
}: InvestmentCardProps) {
  return (
    <motion.div
      data-ocid={ocid}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={cn(
        "rounded-2xl border p-5 shadow-card transition-shadow hover:shadow-card-hover",
        variantStyles[variant],
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="amount-display mt-2 text-3xl font-extrabold text-foreground">
            ₹{amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            "ml-4 shrink-0 rounded-xl p-2.5",
            iconVariantStyles[variant],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
