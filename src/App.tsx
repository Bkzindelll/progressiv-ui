import { useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import Login from "@/pages/Login";
import AppLayout from "@/layouts/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Timeline from "@/pages/Timeline";
import FilesPage from "@/pages/Files";
import Support from "@/pages/Support";
import AdminPanel from "@/pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuth = localStorage.getItem("bss_auth") === "true";
  if (!isAuth) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => {
  const [loading, setLoading] = useState(true);
  const handleLoadingComplete = useCallback(() => setLoading(false), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatePresence>
          {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
        </AnimatePresence>
        {!loading && (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/files" element={<FilesPage />} />
                <Route path="/support" element={<Support />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
