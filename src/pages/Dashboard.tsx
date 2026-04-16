import { motion } from "framer-motion";
import { Users, TrendingUp, DollarSign, Activity, CalendarDays, Zap } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import MetricCard from "@/components/MetricCard";
import { clientData } from "@/lib/mockData";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Dashboard() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={fadeUp} className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">
          Olá, {clientData.name} 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          Acompanhe a evolução do seu projeto em tempo real.
        </p>
      </motion.div>

      {/* Project Status Card */}
      <motion.div variants={fadeUp} className="glass-card rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Projeto Ativo</p>
            <h2 className="text-lg font-semibold text-foreground">{clientData.project}</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">{clientData.status}</span>
          </div>
        </div>

        <ProgressBar value={clientData.progress} />

        <div className="flex flex-col sm:flex-row gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>Próxima entrega: <span className="text-foreground font-medium">{clientData.nextDelivery}</span></span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span>{clientData.lastUpdate}</span>
          </div>
        </div>

        <div className="rounded-lg bg-primary/5 border border-primary/10 px-4 py-3 flex items-center gap-3">
          <Zap className="h-4 w-4 text-primary shrink-0" />
          <p className="text-sm text-foreground">
            Execução em andamento — Nova etapa liberada
          </p>
        </div>
      </motion.div>

      {/* Metrics */}
      <motion.div variants={fadeUp}>
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Métricas do Projeto</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard label="Leads" value={clientData.metrics.leads} icon={Users} trend="+12% esta semana" />
          <MetricCard label="Conversões" value={clientData.metrics.conversions} icon={TrendingUp} trend="+8% esta semana" />
          <MetricCard label="Receita" value={clientData.metrics.revenue} prefix="R$ " icon={DollarSign} trend="+18% este mês" />
        </div>
      </motion.div>

      {/* Footer message */}
      <motion.p variants={fadeUp} className="text-xs text-muted-foreground text-center pt-4">
        Seu sistema está sendo construído com dedicação total.
      </motion.p>
    </motion.div>
  );
}
