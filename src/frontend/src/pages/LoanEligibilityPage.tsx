import ProtectedRoute from "@/components/app/ProtectedRoute";
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
import { Slider } from "@/components/ui/slider";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  Calculator,
  CreditCard,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface LoanResult {
  eligible: boolean;
  maxLoanAmount: number;
  suggestedEMI: number;
  monthlyCapacity: number;
  eligibilityStatus: "Excellent" | "Good" | "Fair" | "Poor";
  creditMultiplier: number;
}

interface LoanFormData {
  monthlyIncome: string;
  existingEMI: string;
  creditScore: number;
  requestedAmount: string;
  tenureMonths: string;
}

const LS_KEY = "finrizz_loan_result";

function getCreditStatus(score: number): LoanResult["eligibilityStatus"] {
  if (score >= 750) return "Excellent";
  if (score >= 650) return "Good";
  if (score >= 550) return "Fair";
  return "Poor";
}

function getCreditMultiplier(score: number): number {
  if (score >= 750) return 1.0;
  if (score >= 650) return 0.8;
  if (score >= 550) return 0.6;
  return 0.4;
}

function calculateLoan(form: LoanFormData): LoanResult {
  const income = Number.parseFloat(form.monthlyIncome) || 0;
  const existingEMI = Number.parseFloat(form.existingEMI) || 0;
  const requestedAmount = Number.parseFloat(form.requestedAmount) || 0;
  const tenure = Number.parseInt(form.tenureMonths) || 12;
  const score = form.creditScore;

  const creditMultiplier = getCreditMultiplier(score);
  const eligibilityStatus = getCreditStatus(score);

  const monthlyCapacity = income * 0.4 - existingEMI;
  const maxLoanAmount = Math.max(
    0,
    monthlyCapacity * tenure * creditMultiplier,
  );
  const suggestedEMI =
    requestedAmount > 0 && tenure > 0 ? requestedAmount / tenure : 0;
  const eligible = maxLoanAmount >= requestedAmount && monthlyCapacity > 0;

  return {
    eligible,
    maxLoanAmount,
    suggestedEMI,
    monthlyCapacity,
    eligibilityStatus,
    creditMultiplier,
  };
}

const statusConfig = {
  Excellent: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    bar: "bg-emerald-500",
    barWidth: "95%",
    icon: BadgeCheck,
  },
  Good: {
    color: "text-primary",
    bg: "bg-primary/8",
    border: "border-primary/25",
    bar: "bg-primary",
    barWidth: "72%",
    icon: TrendingUp,
  },
  Fair: {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    bar: "bg-amber-500",
    barWidth: "48%",
    icon: TrendingDown,
  },
  Poor: {
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    bar: "bg-red-500",
    barWidth: "22%",
    icon: XCircle,
  },
};

export default function LoanEligibilityPage() {
  const [form, setForm] = useState<LoanFormData>({
    monthlyIncome: "",
    existingEMI: "",
    creditScore: 700,
    requestedAmount: "",
    tenureMonths: "36",
  });
  const [result, setResult] = useState<LoanResult | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Load persisted result
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          form: LoanFormData;
          result: LoanResult;
        };
        setForm(parsed.form);
        setResult(parsed.result);
        setHasSubmitted(true);
      } catch {
        // ignore
      }
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const computed = calculateLoan(form);
    setResult(computed);
    setHasSubmitted(true);
    localStorage.setItem(LS_KEY, JSON.stringify({ form, result: computed }));
  }

  const statusCfg = result ? statusConfig[result.eligibilityStatus] : null;
  const StatusIcon = statusCfg?.icon ?? BadgeCheck;

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/12 p-2.5">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-extrabold text-foreground">
                Loan Eligibility
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Calculate how much you qualify for based on your income and
                credit profile
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="bank-card rounded-2xl p-6 lg:col-span-3"
          >
            <h2 className="mb-5 font-display text-lg font-bold text-foreground">
              Your Details
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Monthly Income */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-foreground">
                  Monthly Income (₹)
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    type="number"
                    min="0"
                    placeholder="50,000"
                    value={form.monthlyIncome}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, monthlyIncome: e.target.value }))
                    }
                    data-ocid="loan.income.input"
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              {/* Existing EMI */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-foreground">
                  Existing Monthly EMI (₹)
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.existingEMI}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, existingEMI: e.target.value }))
                    }
                    data-ocid="loan.emi.input"
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Credit Score Slider */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-foreground">
                    Credit Score (CIBIL)
                  </Label>
                  <span className="font-display text-xl font-extrabold text-primary">
                    {form.creditScore}
                  </span>
                </div>
                <Slider
                  min={300}
                  max={900}
                  step={10}
                  value={[form.creditScore]}
                  onValueChange={([v]) =>
                    setForm((f) => ({ ...f, creditScore: v }))
                  }
                  data-ocid="loan.credit_score.input"
                  className="mt-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>300 — Poor</span>
                  <span
                    className={`${statusConfig[getCreditStatus(form.creditScore)].color} font-semibold`}
                  >
                    {getCreditStatus(form.creditScore)}
                  </span>
                  <span>900 — Excellent</span>
                </div>
              </div>

              {/* Requested Loan Amount */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-foreground">
                  Requested Loan Amount (₹)
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    type="number"
                    min="0"
                    placeholder="5,00,000"
                    value={form.requestedAmount}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        requestedAmount: e.target.value,
                      }))
                    }
                    data-ocid="loan.amount.input"
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              {/* Tenure */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-foreground">
                  Loan Tenure
                </Label>
                <Select
                  value={form.tenureMonths}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, tenureMonths: v }))
                  }
                >
                  <SelectTrigger data-ocid="loan.tenure.select">
                    <SelectValue placeholder="Select tenure..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 months (1 year)</SelectItem>
                    <SelectItem value="24">24 months (2 years)</SelectItem>
                    <SelectItem value="36">36 months (3 years)</SelectItem>
                    <SelectItem value="48">48 months (4 years)</SelectItem>
                    <SelectItem value="60">60 months (5 years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                data-ocid="loan.submit_button"
                className="mt-1 h-12 gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-teal hover:bg-primary/90"
              >
                <Calculator className="h-5 w-5" />
                Check Eligibility
              </Button>
            </form>
          </motion.div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {hasSubmitted && result && statusCfg ? (
                <motion.div
                  data-ocid="loan.result.card"
                  key="result"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col gap-4"
                >
                  {/* Eligibility Status */}
                  <div
                    className={`rounded-2xl border p-5 ${statusCfg.bg} ${statusCfg.border}`}
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className={`rounded-xl p-2.5 ${statusCfg.bg}`}>
                        <StatusIcon className={`h-5 w-5 ${statusCfg.color}`} />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Credit Status
                        </p>
                        <p
                          className={`font-display text-xl font-extrabold ${statusCfg.color}`}
                        >
                          {result.eligibilityStatus}
                        </p>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div className="mb-2 h-2 overflow-hidden rounded-full bg-border/40">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: statusCfg.barWidth }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${statusCfg.bar}`}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      CIBIL Score: {form.creditScore} · Multiplier:{" "}
                      {(result.creditMultiplier * 100).toFixed(0)}%
                    </p>
                  </div>

                  {/* Eligibility Decision */}
                  <div
                    className={`rounded-2xl border p-5 ${result.eligible ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {result.eligible ? (
                        <BadgeCheck className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <p
                        className={`font-semibold text-sm ${result.eligible ? "text-emerald-700" : "text-red-700"}`}
                      >
                        {result.eligible
                          ? "Loan Approved in Principle"
                          : "Loan Not Recommended"}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {result.eligible
                        ? "Your income and credit profile supports this loan."
                        : "Your repayment capacity or credit score may be insufficient."}
                    </p>
                  </div>

                  {/* Key Metrics */}
                  <div className="bank-card rounded-2xl p-5 flex flex-col gap-4">
                    <h3 className="font-display text-sm font-bold text-foreground uppercase tracking-wider">
                      Key Numbers
                    </h3>
                    {[
                      {
                        label: "Max Eligible Loan",
                        value: `₹${result.maxLoanAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
                        highlight: true,
                      },
                      {
                        label: "Monthly Repayment Capacity",
                        value: `₹${result.monthlyCapacity.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
                        highlight: false,
                      },
                      {
                        label: `Suggested EMI (${form.tenureMonths} mo)`,
                        value: `₹${result.suggestedEMI.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
                        highlight: false,
                      },
                    ].map(({ label, value, highlight }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between"
                      >
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p
                          className={`amount-display text-sm font-bold ${highlight ? "text-primary" : "text-foreground"}`}
                        >
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bank-card flex flex-col items-center justify-center rounded-2xl p-8 text-center"
                >
                  <div className="mb-4 rounded-2xl bg-primary/8 p-5">
                    <CreditCard className="h-10 w-10 text-primary/60" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Enter your details
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Fill in the form to calculate your loan eligibility
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

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
