import { motion } from "framer-motion";
import { Users, TrendingUp, DollarSign, Activity, CalendarDays, Loader2 } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import MetricCard from "@/components/MetricCard";
import { useMyClientData } from "@/hooks/useClientData";
import { useAuth } from "@/contexts/AuthContext";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading } = useMyClientData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 sm:space-y-8">
      <motion.div variants={fadeUp} className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Olá, {user?.user_metadata?.full_name || user?.email?.split("@")[0]} 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          Acompanhe a evolução do seu projeto em tempo real.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="glass-card rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Projeto Ativo</p>
            <h2 className="text-base sm:text-lg font-semibold text-foreground truncate">{data?.project_name || "Aguardando configuração"}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">{data?.status || "Não iniciado"}</span>
          </div>
        </div>

        <ProgressBar value={data?.progress || 0} />

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 text-sm">
          {data?.next_delivery && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span className="truncate">Próxima entrega: <span className="text-foreground font-medium">{data.next_delivery}</span></span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-4 w-4 shrink-0" />
            <span>Atualizado: {data?.updated_at ? new Date(data.updated_at).toLocaleDateString("pt-BR") : "—"}</span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Métricas do Projeto</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <MetricCard label="Leads" value={data?.leads || 0} icon={Users} />
          <MetricCard label="Conversões" value={data?.conversions || 0} icon={TrendingUp} />
          <MetricCard label="Receita" value={data?.revenue || 0} prefix="R$ " icon={DollarSign} />
        </div>
      </motion.div>

      <motion.p variants={fadeUp} className="text-xs text-muted-foreground text-center pt-2 sm:pt-4">
        Seu sistema está sendo construído com dedicação total.
      </motion.p>
    </motion.div>
  );
}
