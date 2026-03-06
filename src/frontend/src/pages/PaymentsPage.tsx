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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  Home,
  Plus,
  Receipt,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const EMI_LS_KEY = "finrizz_emi_records";
const ELEC_LS_KEY = "finrizz_electricity_bills";

interface EMIRecord {
  id: string;
  loanName: string;
  principalAmount: number;
  monthlyEMI: number;
  remainingTenure: number;
  totalTenure: number;
  nextPaymentDate: string;
  loanType: "home" | "car" | "personal" | "education";
  paid: boolean;
}

interface ElectricityBill {
  id: string;
  billingPeriod: string;
  unitsConsumed: number;
  amountPaid: number;
  meterReading: string;
  addedOn: string;
}

const SAMPLE_EMI: EMIRecord[] = [
  {
    id: "emi1",
    loanName: "Home Loan",
    principalAmount: 4500000,
    monthlyEMI: 25000,
    remainingTenure: 240,
    totalTenure: 300,
    nextPaymentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    loanType: "home",
    paid: false,
  },
  {
    id: "emi2",
    loanName: "Car Loan",
    principalAmount: 800000,
    monthlyEMI: 8500,
    remainingTenure: 36,
    totalTenure: 48,
    nextPaymentDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    loanType: "car",
    paid: false,
  },
];

const SAMPLE_ELECTRICITY: ElectricityBill[] = [
  {
    id: "elec1",
    billingPeriod: "Feb 2026",
    unitsConsumed: 320,
    amountPaid: 2560,
    meterReading: "48920",
    addedOn: new Date().toISOString(),
  },
  {
    id: "elec2",
    billingPeriod: "Jan 2026",
    unitsConsumed: 290,
    amountPaid: 2320,
    meterReading: "48600",
    addedOn: new Date().toISOString(),
  },
];

const loanTypeIcons: Record<string, typeof Home> = {
  home: Home,
  car: Receipt,
  personal: Receipt,
  education: Receipt,
};

const loanTypeColors: Record<string, string> = {
  home: "text-emerald-700 bg-emerald-50 border-emerald-200",
  car: "text-blue-700 bg-blue-50 border-blue-200",
  personal: "text-purple-700 bg-purple-50 border-purple-200",
  education: "text-amber-700 bg-amber-50 border-amber-200",
};

export default function PaymentsPage() {
  const [emiRecords, setEmiRecords] = useState<EMIRecord[]>([]);
  const [electricityBills, setElectricityBills] = useState<ElectricityBill[]>(
    [],
  );
  const [emiDialogOpen, setEmiDialogOpen] = useState(false);
  const [elecDialogOpen, setElecDialogOpen] = useState(false);

  const [emiForm, setEmiForm] = useState({
    loanName: "",
    principalAmount: "",
    monthlyEMI: "",
    remainingTenure: "",
    totalTenure: "",
    nextPaymentDate: new Date().toISOString().split("T")[0],
    loanType: "personal" as EMIRecord["loanType"],
  });

  const [elecForm, setElecForm] = useState({
    billingPeriod: "",
    unitsConsumed: "",
    amountPaid: "",
    meterReading: "",
  });

  useEffect(() => {
    const savedEMI = localStorage.getItem(EMI_LS_KEY);
    if (savedEMI) {
      try {
        setEmiRecords(JSON.parse(savedEMI) as EMIRecord[]);
      } catch {
        setEmiRecords(SAMPLE_EMI);
      }
    } else {
      setEmiRecords(SAMPLE_EMI);
      localStorage.setItem(EMI_LS_KEY, JSON.stringify(SAMPLE_EMI));
    }

    const savedElec = localStorage.getItem(ELEC_LS_KEY);
    if (savedElec) {
      try {
        setElectricityBills(JSON.parse(savedElec) as ElectricityBill[]);
      } catch {
        setElectricityBills(SAMPLE_ELECTRICITY);
      }
    } else {
      setElectricityBills(SAMPLE_ELECTRICITY);
      localStorage.setItem(ELEC_LS_KEY, JSON.stringify(SAMPLE_ELECTRICITY));
    }
  }, []);

  function saveEMI(updated: EMIRecord[]) {
    setEmiRecords(updated);
    localStorage.setItem(EMI_LS_KEY, JSON.stringify(updated));
  }

  function saveElec(updated: ElectricityBill[]) {
    setElectricityBills(updated);
    localStorage.setItem(ELEC_LS_KEY, JSON.stringify(updated));
  }

  function handleAddEMI() {
    if (!emiForm.loanName || !emiForm.monthlyEMI) return;
    const newEMI: EMIRecord = {
      id: Date.now().toString(),
      loanName: emiForm.loanName,
      principalAmount: Number.parseFloat(emiForm.principalAmount) || 0,
      monthlyEMI: Number.parseFloat(emiForm.monthlyEMI),
      remainingTenure: Number.parseInt(emiForm.remainingTenure) || 12,
      totalTenure: Number.parseInt(emiForm.totalTenure) || 12,
      nextPaymentDate: emiForm.nextPaymentDate,
      loanType: emiForm.loanType,
      paid: false,
    };
    saveEMI([...emiRecords, newEMI]);
    setEmiForm({
      loanName: "",
      principalAmount: "",
      monthlyEMI: "",
      remainingTenure: "",
      totalTenure: "",
      nextPaymentDate: new Date().toISOString().split("T")[0],
      loanType: "personal",
    });
    setEmiDialogOpen(false);
  }

  function handleMarkEMIPaid(id: string) {
    const updated = emiRecords.map((r) => {
      if (r.id !== id) return r;
      // Advance next payment by 1 month, decrement remaining
      const next = new Date(r.nextPaymentDate);
      next.setMonth(next.getMonth() + 1);
      return {
        ...r,
        nextPaymentDate: next.toISOString().split("T")[0],
        remainingTenure: Math.max(0, r.remainingTenure - 1),
        paid: true,
      };
    });
    saveEMI(updated);
  }

  function handleAddElec() {
    if (!elecForm.billingPeriod || !elecForm.amountPaid) return;
    const newBill: ElectricityBill = {
      id: Date.now().toString(),
      billingPeriod: elecForm.billingPeriod,
      unitsConsumed: Number.parseFloat(elecForm.unitsConsumed) || 0,
      amountPaid: Number.parseFloat(elecForm.amountPaid),
      meterReading: elecForm.meterReading,
      addedOn: new Date().toISOString(),
    };
    saveElec([newBill, ...electricityBills]);
    setElecForm({
      billingPeriod: "",
      unitsConsumed: "",
      amountPaid: "",
      meterReading: "",
    });
    setElecDialogOpen(false);
  }

  const totalEMI = emiRecords.reduce((s, r) => s + r.monthlyEMI, 0);

  const emiOcidMap: Record<number, string> = {
    0: "payments.emi.item.1",
    1: "payments.emi.item.2",
    2: "payments.emi.item.3",
  };

  const elecOcidMap: Record<number, string> = {
    0: "payments.electricity.item.1",
    1: "payments.electricity.item.2",
    2: "payments.electricity.item.3",
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
          className="mb-6 flex items-center gap-3"
        >
          <div className="rounded-xl bg-primary/12 p-2.5">
            <Receipt className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-extrabold text-foreground">
              Payments
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Manage EMIs and utility bills in one place
            </p>
          </div>
        </motion.div>

        {/* Total Monthly Obligations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-5 rounded-2xl border border-primary/25 bg-primary/6 p-4 shadow-bank"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Monthly EMI Obligations
              </p>
              <p className="amount-display mt-1 text-3xl font-extrabold text-primary">
                ₹{totalEMI.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="rounded-xl bg-primary/12 p-3">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <Tabs defaultValue="emi">
            <TabsList className="mb-5 w-full rounded-xl bg-secondary/40">
              <TabsTrigger
                value="emi"
                data-ocid="payments.emi.tab"
                className="flex-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                EMI Payments
              </TabsTrigger>
              <TabsTrigger
                value="electricity"
                data-ocid="payments.electricity.tab"
                className="flex-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Electricity Bills
              </TabsTrigger>
            </TabsList>

            {/* EMI Tab */}
            <TabsContent value="emi">
              <div className="bank-card rounded-2xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-foreground">
                    EMI Records
                  </h2>
                  <Dialog open={emiDialogOpen} onOpenChange={setEmiDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        data-ocid="payments.emi.add.button"
                        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add EMI
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="font-display text-lg font-bold">
                          Add EMI Record
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-4 py-2">
                        <div className="flex flex-col gap-2">
                          <Label className="text-sm font-semibold">
                            Loan Name
                          </Label>
                          <Input
                            placeholder="e.g. Home Loan"
                            value={emiForm.loanName}
                            onChange={(e) =>
                              setEmiForm((f) => ({
                                ...f,
                                loanName: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-2">
                            <Label className="text-sm font-semibold">
                              Monthly EMI (₹)
                            </Label>
                            <Input
                              type="number"
                              placeholder="10,000"
                              value={emiForm.monthlyEMI}
                              onChange={(e) =>
                                setEmiForm((f) => ({
                                  ...f,
                                  monthlyEMI: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-sm font-semibold">
                              Loan Type
                            </Label>
                            <Select
                              value={emiForm.loanType}
                              onValueChange={(v) =>
                                setEmiForm((f) => ({
                                  ...f,
                                  loanType: v as EMIRecord["loanType"],
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="home">Home</SelectItem>
                                <SelectItem value="car">Car</SelectItem>
                                <SelectItem value="personal">
                                  Personal
                                </SelectItem>
                                <SelectItem value="education">
                                  Education
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-2">
                            <Label className="text-sm font-semibold">
                              Remaining (months)
                            </Label>
                            <Input
                              type="number"
                              placeholder="24"
                              value={emiForm.remainingTenure}
                              onChange={(e) =>
                                setEmiForm((f) => ({
                                  ...f,
                                  remainingTenure: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-sm font-semibold">
                              Total Tenure (months)
                            </Label>
                            <Input
                              type="number"
                              placeholder="36"
                              value={emiForm.totalTenure}
                              onChange={(e) =>
                                setEmiForm((f) => ({
                                  ...f,
                                  totalTenure: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="text-sm font-semibold">
                            Next Payment Date
                          </Label>
                          <Input
                            type="date"
                            value={emiForm.nextPaymentDate}
                            onChange={(e) =>
                              setEmiForm((f) => ({
                                ...f,
                                nextPaymentDate: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setEmiDialogOpen(false)}
                          data-ocid="payments.emi.cancel_button"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddEMI}
                          disabled={!emiForm.loanName || !emiForm.monthlyEMI}
                          data-ocid="payments.emi.confirm_button"
                        >
                          Add EMI
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {emiRecords.length === 0 ? (
                  <div
                    data-ocid="payments.emi.empty_state"
                    className="py-10 text-center"
                  >
                    <div className="mb-3 inline-flex rounded-2xl bg-muted/60 p-4">
                      <Receipt className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      No EMI records
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Add your first EMI record above
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {emiRecords.map((emi, i) => {
                      const LoanIcon = loanTypeIcons[emi.loanType] ?? Receipt;
                      const paidPct =
                        emi.totalTenure > 0
                          ? ((emi.totalTenure - emi.remainingTenure) /
                              emi.totalTenure) *
                            100
                          : 0;
                      const daysToNext = Math.floor(
                        (new Date(emi.nextPaymentDate).getTime() - Date.now()) /
                          (1000 * 60 * 60 * 24),
                      );
                      const ocid =
                        emiOcidMap[i] ?? `payments.emi.item.${i + 1}`;
                      return (
                        <motion.div
                          key={emi.id}
                          data-ocid={ocid}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="rounded-xl border border-border bg-secondary/25 p-4"
                        >
                          <div className="mb-3 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`rounded-xl border p-2.5 ${loanTypeColors[emi.loanType]}`}
                              >
                                <LoanIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  {emi.loanName}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Badge
                                    className={`text-xs px-1.5 py-0 border ${loanTypeColors[emi.loanType]}`}
                                  >
                                    {emi.loanType}
                                  </Badge>
                                  <span
                                    className={`text-xs ${daysToNext <= 5 ? "text-amber-700 font-semibold" : "text-muted-foreground"}`}
                                  >
                                    Due in {daysToNext}d
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="amount-display text-lg font-extrabold text-foreground">
                                ₹{emi.monthlyEMI.toLocaleString("en-IN")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                per month
                              </p>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="mb-3">
                            <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                              <span>
                                {emi.totalTenure - emi.remainingTenure} EMIs
                                paid
                              </span>
                              <span>{emi.remainingTenure} remaining</span>
                            </div>
                            <Progress
                              value={paidPct}
                              className="h-2 rounded-full"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              Next:{" "}
                              {new Date(emi.nextPaymentDate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkEMIPaid(emi.id)}
                              className="h-7 gap-1.5 rounded-lg border-primary/35 px-3 text-xs text-primary hover:bg-primary/8"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Mark Paid
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Electricity Tab */}
            <TabsContent value="electricity">
              <div className="bank-card rounded-2xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-foreground">
                    Electricity Bills
                  </h2>
                  <Dialog
                    open={elecDialogOpen}
                    onOpenChange={setElecDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        data-ocid="payments.electricity.add.button"
                        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Bill
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="font-display text-lg font-bold">
                          Add Electricity Bill
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-4 py-2">
                        <div className="flex flex-col gap-2">
                          <Label className="text-sm font-semibold">
                            Billing Period
                          </Label>
                          <Input
                            placeholder="e.g. Mar 2026"
                            value={elecForm.billingPeriod}
                            onChange={(e) =>
                              setElecForm((f) => ({
                                ...f,
                                billingPeriod: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-2">
                            <Label className="text-sm font-semibold">
                              Units Consumed
                            </Label>
                            <Input
                              type="number"
                              placeholder="320"
                              value={elecForm.unitsConsumed}
                              onChange={(e) =>
                                setElecForm((f) => ({
                                  ...f,
                                  unitsConsumed: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-sm font-semibold">
                              Amount Paid (₹)
                            </Label>
                            <Input
                              type="number"
                              placeholder="2560"
                              value={elecForm.amountPaid}
                              onChange={(e) =>
                                setElecForm((f) => ({
                                  ...f,
                                  amountPaid: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label className="text-sm font-semibold">
                            Meter Reading
                          </Label>
                          <Input
                            placeholder="e.g. 48920"
                            value={elecForm.meterReading}
                            onChange={(e) =>
                              setElecForm((f) => ({
                                ...f,
                                meterReading: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setElecDialogOpen(false)}
                          data-ocid="payments.electricity.cancel_button"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddElec}
                          disabled={
                            !elecForm.billingPeriod || !elecForm.amountPaid
                          }
                          data-ocid="payments.electricity.confirm_button"
                        >
                          Add Bill
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Mini trend chart */}
                {electricityBills.length >= 2 && (
                  <div className="mb-4 flex items-end gap-1 h-12 overflow-hidden">
                    {[...electricityBills]
                      .reverse()
                      .slice(0, 6)
                      .map((bill, i, arr) => {
                        const max = Math.max(...arr.map((b) => b.amountPaid));
                        const pct =
                          max > 0 ? (bill.amountPaid / max) * 100 : 50;
                        return (
                          <div
                            key={bill.id}
                            className="flex flex-1 flex-col items-center gap-0.5"
                          >
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${pct}%` }}
                              transition={{
                                duration: 0.6,
                                delay: i * 0.08,
                                ease: "easeOut",
                              }}
                              className="w-full min-h-[4px] rounded-t-sm bg-primary/50"
                            />
                            <span className="text-[9px] text-muted-foreground truncate w-full text-center">
                              {bill.billingPeriod.split(" ")[0]}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )}

                {electricityBills.length === 0 ? (
                  <div
                    data-ocid="payments.electricity.empty_state"
                    className="py-10 text-center"
                  >
                    <div className="mb-3 inline-flex rounded-2xl bg-muted/60 p-4">
                      <Zap className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      No bills recorded
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Add your first electricity bill above
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {electricityBills.map((bill, i) => {
                      const ocid =
                        elecOcidMap[i] ?? `payments.electricity.item.${i + 1}`;
                      return (
                        <motion.div
                          key={bill.id}
                          data-ocid={ocid}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between rounded-xl border border-border bg-secondary/25 px-4 py-3.5"
                        >
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-2">
                              <Zap className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {bill.billingPeriod}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {bill.unitsConsumed} units · Meter:{" "}
                                {bill.meterReading || "—"}
                              </p>
                            </div>
                          </div>
                          <p className="amount-display text-base font-bold text-foreground">
                            ₹{bill.amountPaid.toLocaleString("en-IN")}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

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
