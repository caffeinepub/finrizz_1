import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useLocation } from "@tanstack/react-router";
import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Receipt,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const navLinks = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    ocid: "navbar.dashboard.link",
  },
  {
    to: "/add-transaction",
    label: "Add Transaction",
    icon: PlusCircle,
    ocid: "navbar.add_transaction.link",
  },
  {
    to: "/insights",
    label: "Insights",
    icon: TrendingUp,
    ocid: "navbar.insights.link",
  },
  {
    to: "/investments",
    label: "Investments",
    icon: Wallet,
    ocid: "navbar.investments.link",
  },
  {
    to: "/payments",
    label: "Payments",
    icon: Receipt,
    ocid: "navbar.payments.link",
  },
  {
    to: "/loan",
    label: "Loans",
    icon: CreditCard,
    ocid: "navbar.loan.link",
  },
  {
    to: "/subscriptions",
    label: "Subscriptions",
    icon: CreditCard,
    ocid: "navbar.subscriptions.link",
  },
];

export default function Navbar() {
  const { clear } = useInternetIdentity();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/dashboard"
          data-ocid="navbar.logo.link"
          className="flex items-center gap-2.5"
        >
          <img
            src="/assets/uploads/WhatsApp-Image-2026-03-07-at-2.12.33-AM-1.jpeg"
            alt="FinRizz"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="font-display text-xl font-extrabold tracking-tight">
            <span className="text-gradient-teal">Fin</span>
            <span className="text-foreground">Rizz</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 xl:flex">
          {navLinks.map(({ to, label, icon: Icon, ocid }) => (
            <Link
              key={to}
              to={to}
              data-ocid={ocid}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-150 ${
                isActive(to)
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Mid-size nav (md to xl) */}
        <nav className="hidden items-center gap-0.5 md:flex xl:hidden">
          {navLinks.slice(0, 4).map(({ to, label, icon: Icon, ocid }) => (
            <Link
              key={to}
              to={to}
              data-ocid={ocid}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-150 ${
                isActive(to)
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout + Mobile */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clear()}
            data-ocid="navbar.logout.button"
            className="hidden items-center gap-2 text-xs text-muted-foreground hover:text-destructive md:flex"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-16 border-b border-border bg-background/97 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map(({ to, label, icon: Icon, ocid }) => (
                <Link
                  key={to}
                  to={to}
                  data-ocid={ocid}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all ${
                    isActive(to)
                      ? "bg-primary/12 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  clear();
                  setMobileOpen(false);
                }}
                data-ocid="navbar.logout.button"
                className="mt-2 flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
