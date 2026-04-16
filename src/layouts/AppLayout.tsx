import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role, signOut } = useAuth();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header - solid background */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b border-border bg-background px-4 sm:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-foreground active:scale-95 transition-transform"
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <span className="ml-3 text-sm font-semibold text-foreground truncate">Build Scale System</span>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm sm:hidden animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar - solid bg, slides in */}
      <div
        className={`
          fixed top-0 left-0 bottom-0 z-[70] w-64
          bg-sidebar border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0 sm:z-40
        `}
      >
        <AppSidebar isAdmin={role === "admin"} onLogout={signOut} onNavigate={() => setMobileOpen(false)} />
      </div>

      {/* Main content */}
      <main className="sm:ml-60 min-h-screen pt-14 sm:pt-0">
        <div className="mx-auto max-w-4xl px-4 sm:px-8 py-6 sm:py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
