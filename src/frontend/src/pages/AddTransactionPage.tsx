import ProtectedRoute from "@/components/app/ProtectedRoute";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddTransaction } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Utilities",
  "Other",
];

interface SuccessResult {
  amount: number;
  roundupAmount: number;
}

export default function AddTransactionPage() {
  const navigate = useNavigate();
  const { mutate: addTransaction, isPending } = useAddTransaction();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<SuccessResult | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setResult(null);

    const amountNum = Number.parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      setFormError("Please enter a valid amount greater than 0");
      return;
    }
    if (!category) {
      setFormError("Please select a category");
      return;
    }
    if (!description.trim()) {
      setFormError("Please enter a description");
      return;
    }

    addTransaction(
      { amount: amountNum, category, description: description.trim() },
      {
        onSuccess: (tx) => {
          setResult({ amount: tx.amount, roundupAmount: tx.roundupAmount });
          toast.success("Transaction added successfully!");
          setAmount("");
          setDescription("");
          setCategory("");
        },
        onError: (err) => {
          const msg =
            err instanceof Error ? err.message : "Failed to add transaction";
          setFormError(msg);
          toast.error("Failed to add transaction");
        },
      },
    );
  }

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => void navigate({ to: "/dashboard" })}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8"
        >
          {/* Title */}
          <div className="mb-7">
            <h1 className="font-display text-2xl font-extrabold text-foreground">
              Add Transaction
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Spare change is automatically rounded up and invested
            </p>
          </div>

          {/* Success Card */}
          <AnimatePresence>
            {result && (
              <motion.div
                data-ocid="add_transaction.success_state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6 rounded-xl border border-primary/40 bg-primary/10 p-4"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">
                      Transaction ₹{result.amount.toLocaleString("en-IN")}{" "}
                      added!
                    </p>
                    {result.roundupAmount > 0 ? (
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-primary">
                        <TrendingUp className="h-4 w-4" />₹
                        {result.roundupAmount} invested as roundup!
                      </p>
                    ) : (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        ₹{result.amount} was already a round number — no roundup
                        needed
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {formError && (
              <motion.div
                data-ocid="add_transaction.error_state"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mb-5"
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Amount */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="amount"
                className="text-sm font-semibold text-foreground"
              >
                Amount (₹)
              </Label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  data-ocid="add_transaction.amount.input"
                  className="pl-8 text-base font-semibold placeholder:font-normal"
                  required
                />
              </div>
              {amount && Number.parseFloat(amount) > 0 && (
                <p className="text-xs text-muted-foreground">
                  Roundup:{" "}
                  <span className="font-semibold text-primary">
                    ₹
                    {Math.ceil(Number.parseFloat(amount) / 10) * 10 -
                      Number.parseFloat(amount) ===
                    0
                      ? "0 (already round)"
                      : (
                          Math.ceil(Number.parseFloat(amount) / 10) * 10 -
                          Number.parseFloat(amount)
                        ).toFixed(2)}
                  </span>
                </p>
              )}
            </div>

            {/* Category */}
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-foreground">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  data-ocid="add_transaction.category.select"
                  className="w-full"
                >
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="description"
                className="text-sm font-semibold text-foreground"
              >
                Description
              </Label>
              <Input
                id="description"
                type="text"
                placeholder="e.g. Dinner at Barbeque Nation"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                data-ocid="add_transaction.description.input"
                className="text-base"
                required
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="add_transaction.submit_button"
              className="mt-2 h-12 gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-teal hover:bg-primary/90 disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2
                    data-ocid="add_transaction.loading_state"
                    className="h-5 w-5 animate-spin"
                  />
                  Adding Transaction...
                </>
              ) : (
                <>
                  <TrendingUp className="h-5 w-5" />
                  Add & Invest Roundup
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-5 rounded-xl border border-border bg-secondary/40 p-4"
        >
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            How Roundup Investing Works
          </h3>
          <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            <p>• Transaction ₹47 → Rounded to ₹50 → ₹3 invested</p>
            <p>• Transaction ₹100 → Already round → No roundup</p>
            <p>• 80% of roundups are auto-invested in your wallet</p>
          </div>
        </motion.div>

        <footer className="mt-10 border-t border-border pt-6 text-center">
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
