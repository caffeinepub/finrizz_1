import ProtectedRoute from "@/components/app/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Plus,
  Trash2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const LS_KEY = "finrizz_subscriptions";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: "monthly" | "quarterly" | "yearly";
  category: "entertainment" | "utilities" | "productivity" | "other";
  lastUsed: string; // ISO date string
  cancelled: boolean;
  addedOn: string;
}

const SAMPLE_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    amount: 649,
    billingCycle: "monthly",
    category: "entertainment",
    lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    cancelled: false,
    addedOn: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Amazon Prime",
    amount: 1499,
    billingCycle: "yearly",
    category: "entertainment",
    lastUsed: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    cancelled: false,
    addedOn: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Spotify",
    amount: 119,
    billingCycle: "monthly",
    category: "entertainment",
    lastUsed: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
    cancelled: false,
    addedOn: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Notion",
    amount: 800,
    billingCycle: "monthly",
    category: "productivity",
    lastUsed: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    cancelled: false,
    addedOn: new Date().toISOString(),
  },
  {
    id: "5",
    name: "GitHub Pro",
    amount: 750,
    billingCycle: "monthly",
    category: "productivity",
    lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    cancelled: false,
    addedOn: new Date().toISOString(),
  },
];

function isZombie(lastUsed: string): boolean {
  const daysSince =
    (Date.now() - new Date(lastUsed).getTime()) / (1000 * 60 * 60 * 24);
  return daysSince > 60;
}

function getMonthlyEquivalent(sub: Subscription): number {
  if (sub.billingCycle === "monthly") return sub.amount;
  if (sub.billingCycle === "quarterly") return sub.amount / 3;
  return sub.amount / 12;
}

const categoryColors: Record<string, string> = {
  entertainment: "text-pink-700 bg-pink-50 border-pink-200",
  utilities: "text-yellow-700 bg-yellow-50 border-yellow-200",
  productivity: "text-blue-700 bg-blue-50 border-blue-200",
  other: "text-slate-600 bg-slate-100 border-slate-200",
};

const BILLING_LABELS: Record<string, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    billingCycle: "monthly" as Subscription["billingCycle"],
    category: "entertainment" as Subscription["category"],
    lastUsed: new Date().toISOString().split("T")[0],
  });

  // Load from localStorage or seed
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try {
        setSubs(JSON.parse(saved) as Subscription[]);
      } catch {
        setSubs(SAMPLE_SUBSCRIPTIONS);
      }
    } else {
      setSubs(SAMPLE_SUBSCRIPTIONS);
      localStorage.setItem(LS_KEY, JSON.stringify(SAMPLE_SUBSCRIPTIONS));
    }
  }, []);

  function saveSubs(updated: Subscription[]) {
    setSubs(updated);
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
  }

  function handleAdd() {
    if (!form.name || !form.amount) return;
    const newSub: Subscription = {
      id: Date.now().toString(),
      name: form.name,
      amount: Number.parseFloat(form.amount),
      billingCycle: form.billingCycle,
      category: form.category,
      lastUsed: new Date(form.lastUsed).toISOString(),
      cancelled: false,
      addedOn: new Date().toISOString(),
    };
    saveSubs([...subs, newSub]);
    setForm({
      name: "",
      amount: "",
      billingCycle: "monthly",
      category: "entertainment",
      lastUsed: new Date().toISOString().split("T")[0],
    });
    setDialogOpen(false);
  }

  function handleCancel(id: string) {
    saveSubs(subs.map((s) => (s.id === id ? { ...s, cancelled: true } : s)));
  }

  const activeSubs = subs.filter((s) => !s.cancelled);
  const zombieSubs = activeSubs.filter((s) => isZombie(s.lastUsed));
  const totalMonthly = activeSubs.reduce(
    (sum, s) => sum + getMonthlyEquivalent(s),
    0,
  );
  const zombieMonthly = zombieSubs.reduce(
    (sum, s) => sum + getMonthlyEquivalent(s),
    0,
  );

  const ocidMap: Record<number, string> = {
    0: "subscriptions.item.1",
    1: "subscriptions.item.2",
    2: "subscriptions.item.3",
    3: "subscriptions.item.4",
    4: "subscriptions.item.5",
  };

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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex items-start justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/12 p-2.5">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-extrabold text-foreground">
                Subscriptions
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Track recurring charges and detect zombie subscriptions
              </p>
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                data-ocid="subscriptions.add.button"
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-lg font-bold">
                  Add Subscription
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-semibold">
                    Subscription Name
                  </Label>
                  <Input
                    placeholder="e.g. Netflix"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    data-ocid="subscriptions.name.input"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-semibold">Amount (₹)</Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      type="number"
                      placeholder="649"
                      value={form.amount}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, amount: e.target.value }))
                      }
                      data-ocid="subscriptions.amount.input"
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold">
                      Billing Cycle
                    </Label>
                    <Select
                      value={form.billingCycle}
                      onValueChange={(v) =>
                        setForm((f) => ({
                          ...f,
                          billingCycle: v as Subscription["billingCycle"],
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold">Category</Label>
                    <Select
                      value={form.category}
                      onValueChange={(v) =>
                        setForm((f) => ({
                          ...f,
                          category: v as Subscription["category"],
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entertainment">
                          Entertainment
                        </SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="productivity">
                          Productivity
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-semibold">Last Used</Label>
                  <Input
                    type="date"
                    value={form.lastUsed}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, lastUsed: e.target.value }))
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  data-ocid="subscriptions.add.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAdd}
                  disabled={!form.name || !form.amount}
                  data-ocid="subscriptions.add.confirm_button"
                >
                  Add Subscription
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Monthly Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-4 grid gap-3 sm:grid-cols-3"
        >
          <div className="bank-card rounded-2xl p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Monthly Total
            </p>
            <p className="amount-display mt-1.5 text-2xl font-extrabold text-foreground">
              ₹
              {totalMonthly.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
          <div className="bank-card rounded-2xl p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Active Subscriptions
            </p>
            <p className="amount-display mt-1.5 text-2xl font-extrabold text-foreground">
              {activeSubs.length}
            </p>
          </div>
          <div
            className={`rounded-2xl border p-4 ${zombieSubs.length > 0 ? "border-amber-200 bg-amber-50" : "bank-card"}`}
          >
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Zombie Subs Waste
            </p>
            <p
              className={`amount-display mt-1.5 text-2xl font-extrabold ${zombieSubs.length > 0 ? "text-amber-700" : "text-foreground"}`}
            >
              ₹
              {zombieMonthly.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
              /mo
            </p>
          </div>
        </motion.div>

        {/* Zombie Alert Banner */}
        <AnimatePresence>
          {zombieSubs.length > 0 && (
            <motion.div
              data-ocid="subscriptions.zombie_alert.card"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-amber-700">
                  {zombieSubs.length} zombie subscription
                  {zombieSubs.length > 1 ? "s" : ""} detected
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  You haven&apos;t used these services in 60+ days. Cancel them
                  to save ₹
                  {zombieMonthly.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                  /month.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subscriptions List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="bank-card rounded-2xl p-5"
        >
          <h2 className="mb-4 font-display text-lg font-bold text-foreground">
            Active Subscriptions
          </h2>

          {activeSubs.length === 0 ? (
            <div
              data-ocid="subscriptions.empty_state"
              className="py-10 text-center"
            >
              <div className="mb-3 inline-flex rounded-2xl bg-muted/60 p-4">
                <Zap className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No active subscriptions
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Add your first subscription above
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <AnimatePresence>
                {activeSubs.map((sub, i) => {
                  const zombie = isZombie(sub.lastUsed);
                  const monthly = getMonthlyEquivalent(sub);
                  const daysSince = Math.floor(
                    (Date.now() - new Date(sub.lastUsed).getTime()) /
                      (1000 * 60 * 60 * 24),
                  );
                  const ocid = ocidMap[i] ?? `subscriptions.item.${i + 1}`;

                  return (
                    <motion.div
                      key={sub.id}
                      data-ocid={ocid}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8, height: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3.5 transition-all ${
                        zombie
                          ? "border-amber-200 bg-amber-50/60"
                          : "border-border bg-secondary/25 hover:bg-secondary/40"
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`rounded-lg border p-2 ${categoryColors[sub.category]}`}
                        >
                          <Zap className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {sub.name}
                            </p>
                            {zombie && (
                              <Badge className="shrink-0 border border-amber-200 bg-amber-50 text-amber-700 text-xs px-1.5 py-0">
                                Zombie
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className={`text-xs font-medium border rounded px-1.5 py-0.5 ${categoryColors[sub.category]}`}
                            >
                              {sub.category}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {BILLING_LABELS[sub.billingCycle]}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Last used {daysSince}d ago
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-4 flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <p className="amount-display text-sm font-bold text-foreground">
                            ₹{sub.amount.toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ₹
                            {monthly.toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                            })}
                            /mo
                          </p>
                        </div>
                        {zombie && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(sub.id)}
                            data-ocid="subscriptions.cancel.button"
                            className="h-8 gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 text-xs text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Cancel
                          </Button>
                        )}
                        {!zombie && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Cancelled */}
        {subs.some((s) => s.cancelled) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 rounded-2xl border border-border bg-secondary/20 p-5"
          >
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Cancelled
            </h3>
            <div className="flex flex-col gap-2">
              {subs
                .filter((s) => s.cancelled)
                .map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3 opacity-50"
                  >
                    <p className="text-sm line-through text-muted-foreground">
                      {sub.name}
                    </p>
                    <p className="amount-display text-sm text-muted-foreground line-through">
                      ₹{sub.amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
            </div>
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
