import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Users, Plus, ArrowLeft, Loader2 } from "lucide-react";
import AdminClientList from "@/components/admin/AdminClientList";
import AdminClientEditor from "@/components/admin/AdminClientEditor";
import AdminCreateClient from "@/components/admin/AdminCreateClient";

export interface AdminClient {
  id: string;
  user_id: string;
  project_name: string | null;
  status: string | null;
  progress: number;
  next_delivery: string | null;
  start_date: string | null;
  end_date: string | null;
  leads: number;
  conversions: number;
  revenue: number;
  updated_at: string;
  profile?: { display_name: string | null; avatar_url: string | null };
  email?: string;
}

export default function AdminPanel() {
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [selectedClient, setSelectedClient] = useState<AdminClient | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-list-clients");
    if (error || !data) {
      setLoading(false);
      return;
    }
    setClients(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const handleSelectClient = (client: AdminClient) => {
    setSelectedClient(client);
    setView("edit");
  };

  const handleBack = () => {
    setView("list");
    setSelectedClient(null);
    fetchClients();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {view === "list" && (
            <>
              <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>
              <p className="text-sm text-muted-foreground">Gerencie todos os clientes e seus projetos.</p>
            </>
          )}
          {view === "create" && (
            <button onClick={handleBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Voltar para lista
            </button>
          )}
          {view === "edit" && (
            <button onClick={handleBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Voltar para lista
            </button>
          )}
        </div>
        {view === "list" && (
          <button
            onClick={() => setView("create")}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity glow-primary"
          >
            <Plus className="h-4 w-4" /> Novo Cliente
          </button>
        )}
      </div>

      {loading && view === "list" ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {view === "list" && (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AdminClientList clients={clients} onSelect={handleSelectClient} />
            </motion.div>
          )}
          {view === "create" && (
            <motion.div key="create" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <AdminCreateClient onCreated={handleBack} />
            </motion.div>
          )}
          {view === "edit" && selectedClient && (
            <motion.div key="edit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <AdminClientEditor client={selectedClient} onUpdated={fetchClients} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
