import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile toggle */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b border-border bg-background/80 backdrop-blur-sm px-4 sm:hidden">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <span className="ml-3 text-sm font-semibold text-foreground">Build Scale System</span>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm sm:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`${mobileOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 transition-transform duration-300 z-50`}>
        <AppSidebar isAdmin={role === "admin"} onLogout={signOut} />
      </div>

      {/* Main content */}
      <main className="sm:ml-60 min-h-screen pt-14 sm:pt-0">
        <div className="mx-auto max-w-4xl px-4 sm:px-8 py-8 sm:py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
