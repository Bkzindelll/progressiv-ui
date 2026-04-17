import { motion } from "framer-motion";
import { Users, TrendingUp, DollarSign, Activity, CalendarDays, Loader2, Clock } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import MetricCard from "@/components/MetricCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import CountdownTimer from "@/components/CountdownTimer";
import { useMyClientData, useRecentActivity } from "@/hooks/useClientData";
import { useAuth } from "@/contexts/AuthContext";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const statusColors: Record<string, string> = {
  completed: "bg-green-500",
  in_progress: "bg-primary",
  pending: "bg-muted-foreground",
};

const statusLabels: Record<string, string> = {
  completed: "Concluído",
  in_progress: "Em andamento",
  pending: "Pendente",
};

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading } = useMyClientData();
  const { activities, loading: loadingActivities } = useRecentActivity(data?.id);

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

      {/* Project Card */}
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

      {/* Countdown Timer */}
      {data?.end_date && (
        <motion.div variants={fadeUp}>
          <CountdownTimer startDate={data.start_date} endDate={data.end_date} />
        </motion.div>
      )}

      {/* Metrics */}
      <motion.div variants={fadeUp}>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Métricas do Projeto</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <MetricCard label="Leads" value={data?.leads || 0} icon={Users} />
          <MetricCard label="Conversões" value={data?.conversions || 0} icon={TrendingUp} />
          <MetricCard label="Receita" value={data?.revenue || 0} prefix="R$ " icon={DollarSign} />
        </div>
      </motion.div>

      {/* Analytics Growth Bar */}
      <motion.div variants={fadeUp}>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Crescimento</p>
        <div className="glass-card rounded-xl p-4 sm:p-6 space-y-4">
          <GrowthBar label="Leads" value={data?.leads || 0} max={Math.max(data?.leads || 1, 300)} color="bg-primary" />
          <GrowthBar label="Conversões" value={data?.conversions || 0} max={Math.max(data?.conversions || 1, 100)} color="bg-green-500" />
          <GrowthBar label="Receita" value={data?.revenue || 0} max={Math.max(data?.revenue || 1, 50000)} color="bg-amber-500" prefix="R$ " />
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={fadeUp}>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Últimas Movimentações</p>
        <div className="glass-card rounded-xl p-4 sm:p-6">
          {loadingActivities ? (
            <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
          ) : activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhuma atividade ainda.</p>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />
              <div className="space-y-4">
                {activities.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-3 relative"
                  >
                    <div className={`h-4 w-4 rounded-full shrink-0 mt-0.5 ${a.status ? statusColors[a.status] || "bg-primary" : "bg-primary"} ring-2 ring-background z-10`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{a.description}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString("pt-BR")}</span>
                        {a.status && (
                          <span className="text-xs text-muted-foreground ml-2">• {statusLabels[a.status] || a.status}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <motion.p variants={fadeUp} className="text-xs text-muted-foreground text-center pt-2 sm:pt-4">
        Seu sistema está sendo construído com dedicação total.
      </motion.p>
    </motion.div>
  );
}

function GrowthBar({ label, value, max, color, prefix = "" }: { label: string; value: number; max: number; color: string; prefix?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">
          {prefix}<AnimatedCounter value={value} />
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
