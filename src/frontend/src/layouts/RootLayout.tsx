import Navbar from "@/components/app/Navbar";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Outlet, useLocation } from "@tanstack/react-router";

export default function RootLayout() {
  const { identity } = useInternetIdentity();
  const location = useLocation();
  const isAuthPage = ["/", "/signin", "/signup"].includes(location.pathname);
  const showNavbar = !!identity && !isAuthPage;

  return (
    <div className="min-h-screen navy-grid bg-background">
      {showNavbar && <Navbar />}
      <main className={showNavbar ? "pt-16" : ""}>
        <Outlet />
      </main>
    </div>
  );
}
