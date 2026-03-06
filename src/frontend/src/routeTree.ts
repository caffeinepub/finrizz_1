import {
  createRootRoute,
  createRoute,
  type createRouter,
} from "@tanstack/react-router";
import RootLayout from "./layouts/RootLayout";
import AddTransactionPage from "./pages/AddTransactionPage";
import DashboardPage from "./pages/DashboardPage";
import InsightsPage from "./pages/InsightsPage";
import InvestmentsPage from "./pages/InvestmentsPage";
import LandingPage from "./pages/LandingPage";
import LoanEligibilityPage from "./pages/LoanEligibilityPage";
import PaymentsPage from "./pages/PaymentsPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";

const rootRoute = createRootRoute({ component: RootLayout });

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const addTransactionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/add-transaction",
  component: AddTransactionPage,
});

const insightsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/insights",
  component: InsightsPage,
});

const investmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/investments",
  component: InvestmentsPage,
});

const loanRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/loan",
  component: LoanEligibilityPage,
});

const subscriptionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/subscriptions",
  component: SubscriptionsPage,
});

const paymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payments",
  component: PaymentsPage,
});

export const routeTree = rootRoute.addChildren([
  landingRoute,
  dashboardRoute,
  addTransactionRoute,
  insightsRoute,
  investmentsRoute,
  loanRoute,
  subscriptionsRoute,
  paymentsRoute,
]);

export type Router = ReturnType<typeof createRouter<typeof routeTree>>;
