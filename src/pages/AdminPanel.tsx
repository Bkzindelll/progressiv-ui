import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Users, TrendingUp, DollarSign, Percent } from "lucide-react";

export default function AdminPanel() {
  const [progress, setProgress] = useState(68);
  const [leads, setLeads] = useState(1248);
  const [conversions, setConversions] = useState(187);
  const [revenue, setRevenue] = useState(45890);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>
        <p className="text-sm text-muted-foreground">Controle manual dos dados do cliente.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <InputCard label="Progresso (%)" icon={Percent} value={progress} onChange={setProgress} max={100} />
        <InputCard label="Leads" icon={Users} value={leads} onChange={setLeads} />
        <InputCard label="Conversões" icon={TrendingUp} value={conversions} onChange={setConversions} />
        <InputCard label="Receita (R$)" icon={DollarSign} value={revenue} onChange={setRevenue} />
      </div>

      <button
        onClick={handleSave}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity glow-primary"
      >
        <Save className="h-4 w-4" />
        {saved ? "Salvo ✓" : "Salvar Alterações"}
      </button>
    </motion.div>
  );
}

function InputCard({
  label,
  icon: Icon,
  value,
  onChange,
  max,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <div className="glass-card rounded-xl p-5 space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      <input
        type="number"
        value={value}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-lg font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
      />
    </div>
  );
}
