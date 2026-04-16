import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  trend?: string;
}

export default function MetricCard({ label, value, prefix, suffix, icon: Icon, trend }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-xl p-5 hover:border-primary/20 transition-colors duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="text-2xl font-bold text-foreground">
        <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
      </div>
      {trend && (
        <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
      )}
    </motion.div>
  );
}
