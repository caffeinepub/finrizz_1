import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  CreditCard,
  Loader2,
  PieChart,
  Receipt,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import { type Variants, motion } from "motion/react";
import { useEffect } from "react";

const features = [
  {
    icon: PieChart,
    title: "AI Expense Analyzer",
    description:
      "Intelligent categorization and analysis of your spending patterns with personalized financial advice.",
  },
  {
    icon: TrendingUp,
    title: "Micro-Investment Roundup",
    description:
      "Every transaction automatically rounds up and invests the spare change into your portfolio.",
  },
  {
    icon: CreditCard,
    title: "Loan Eligibility",
    description:
      "Instant loan eligibility calculator with credit score analysis and EMI estimation.",
  },
  {
    icon: Receipt,
    title: "Bills & Payments",
    description:
      "Track EMI payments, electricity bills, and detect zombie subscriptions draining your wallet.",
  },
  {
    icon: Zap,
    title: "Real-Time Insights",
    description:
      "Instant visibility into your financial health with charts, trends, and AI-driven recommendations.",
  },
  {
    icon: Shield,
    title: "Decentralized & Secure",
    description:
      "Built on the Internet Computer Protocol — your data is sovereign, private, and tamper-proof.",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function LandingPage() {
  const { identity, isInitializing, isLoggingIn, login } =
    useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity && !isInitializing) {
      void navigate({ to: "/dashboard" });
    }
  }, [identity, isInitializing, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/assets/generated/hero-background.dim_1600x900.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 z-0 bg-background/88" />
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.52 0.13 220 / 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border/40 px-6 py-4 backdrop-blur-sm sm:px-10">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/uploads/WhatsApp-Image-2026-03-07-at-2.12.33-AM-1.jpeg"
              alt="FinRizz"
              className="h-9 w-9 rounded-full object-cover"
            />
            <span className="font-display text-2xl font-extrabold tracking-tight">
              <span className="text-gradient-teal">Fin</span>
              <span className="text-foreground">Rizz</span>
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={login}
            disabled={isLoggingIn || isInitializing}
            className="border-border/60 text-foreground hover:border-primary/50 hover:bg-primary/8 hover:text-primary"
          >
            {isLoggingIn || isInitializing ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : null}
            Sign In
          </Button>
        </header>

        {/* Hero Section */}
        <motion.section
          className="mx-auto max-w-5xl px-6 pb-20 pt-16 text-center sm:px-10 sm:pt-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <BarChart3 className="h-3 w-3" />
              AI-Powered Finance Platform
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-display mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="text-foreground">Money that</span>
            <br />
            <span className="text-gradient-teal">works for you.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            FinRizz is your AI-powered finance assistant — track every rupee,
            invest your spare change automatically, manage loans and bills, and
            unlock intelligent insights about your financial future.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              data-ocid="landing.login.primary_button"
              className="h-12 gap-3 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-teal hover:bg-primary/90 disabled:opacity-60"
            >
              {isLoggingIn || isInitializing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  Get Started — It&apos;s Free
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Secured by Internet Identity · No password needed
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4"
          >
            {[
              { label: "Avg. Monthly Savings", value: "₹2,400" },
              { label: "Roundup Investments", value: "100% Auto" },
              { label: "AI Advice Accuracy", value: "94.7%" },
            ].map((stat) => (
              <div key={stat.label} className="bank-card rounded-2xl p-4">
                <p className="amount-display text-2xl font-extrabold text-foreground sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.section>

        {/* Features Grid */}
        <section className="mx-auto max-w-6xl px-6 pb-24 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h2 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
              Everything you need to manage your finances
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Professional-grade tools, simplified for everyone
            </p>
          </motion.div>

          <motion.div
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                className="bank-card rounded-2xl p-6"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/12 p-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border px-6 py-6 text-center sm:px-10">
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
    </div>
  );
}
