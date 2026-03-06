import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Loader2,
  PieChart,
  Shield,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

const features = [
  {
    icon: TrendingUp,
    label: "Automatic micro-investments",
    description: "Round-up spare change on every transaction",
  },
  {
    icon: PieChart,
    label: "AI expense insights",
    description: "Smart analysis of your spending patterns",
  },
  {
    icon: Wallet,
    label: "Loan & bill management",
    description: "Track EMIs, subscriptions, and utility bills",
  },
];

export default function SignUpPage() {
  const { identity, isInitializing, isLoggingIn, login } =
    useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity && !isInitializing) {
      void navigate({ to: "/dashboard" });
    }
  }, [identity, isInitializing, navigate]);

  const isLoading = isLoggingIn || isInitializing;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bank-card rounded-2xl p-8">
          {/* Logo + Brand */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border shadow-sm">
              <img
                src="/assets/uploads/WhatsApp-Image-2026-03-07-at-2.12.33-AM-1.jpeg"
                alt="FinRizz"
                className="h-14 w-14 object-cover"
              />
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
              FinRizz
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="font-display text-2xl font-extrabold text-foreground">
              Create your account
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Get started with Internet Identity — no password required
            </p>
          </div>

          {/* Features list */}
          <ul className="mb-7 space-y-3">
            {features.map(({ icon: Icon, label, description }) => (
              <li
                key={label}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-background px-4 py-3"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {description}
                  </p>
                </div>
                <CheckCircle2 className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-primary" />
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <Button
            size="lg"
            onClick={login}
            disabled={isLoading}
            data-ocid="signup.primary_button"
            className="h-12 w-full gap-2.5 rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {isInitializing ? "Initializing..." : "Connecting..."}
              </>
            ) : (
              <>
                <Shield className="h-5 w-5" />
                Get Started — It&apos;s Free
              </>
            )}
          </Button>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/signin"
              data-ocid="signup.signin.link"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Security note */}
        <p className="mt-5 text-center text-xs text-muted-foreground">
          Protected by Internet Computer Protocol · Decentralized &amp;
          tamper-proof
        </p>
      </motion.div>
    </div>
  );
}
