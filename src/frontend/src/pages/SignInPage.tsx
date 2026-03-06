import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

export default function SignInPage() {
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
              Welcome back
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Sign in securely with Internet Identity
            </p>
          </div>

          {/* Divider */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">
              Secure authentication
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Trust indicators */}
          <ul className="mb-7 space-y-2.5">
            {[
              "No password required",
              "Secured by cryptographic keys",
              "Your data, your control",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <Button
            size="lg"
            onClick={login}
            disabled={isLoading}
            data-ocid="signin.primary_button"
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
                Sign In with Internet Identity
              </>
            )}
          </Button>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              data-ocid="signin.signup.link"
              className="font-semibold text-primary hover:underline"
            >
              Create one
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
