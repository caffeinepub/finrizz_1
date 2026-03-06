import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, PieChart, Shield, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
      <div className="absolute inset-0 z-0 bg-background/70" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 sm:px-10">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/generated/finrizz-logo-transparent.dim_120x120.png"
              alt="FinRizz"
              className="h-9 w-9"
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
            className="border-primary/40 text-primary hover:bg-primary/10"
          >
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
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <Zap className="h-3 w-3" />
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
            invest your spare change automatically, and unlock intelligent
            insights about your financial future.
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
              className="h-14 gap-3 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-teal hover:bg-primary/90 hover:shadow-teal-lg disabled:opacity-60"
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
            className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-6"
          >
            {[
              { label: "Avg. Monthly Savings", value: "₹2,400" },
              { label: "Roundup Investments", value: "100% Auto" },
              { label: "AI Advice Accuracy", value: "94.7%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-sm"
              >
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
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map(({ icon: Icon, title, description }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/15 p-3">
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
