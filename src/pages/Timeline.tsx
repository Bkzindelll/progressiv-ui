import { motion } from "framer-motion";
import { timelineSteps } from "@/lib/mockData";
import StatusBadge from "@/components/StatusBadge";
import { CalendarDays, User, MessageSquare } from "lucide-react";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Timeline() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={fadeUp} className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Timeline do Projeto</h1>
        <p className="text-sm text-muted-foreground">Acompanhe cada etapa da construção.</p>
      </motion.div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-6">
          {timelineSteps.map((step, i) => (
            <motion.div key={step.id} variants={fadeUp} className="relative flex gap-5">
              {/* Dot */}
              <div className="relative z-10 mt-1">
                <div
                  className={`h-10 w-10 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    step.status === "completed"
                      ? "border-success bg-success/10 text-success"
                      : step.status === "in_progress"
                      ? "border-primary bg-primary/10 text-primary animate-pulse-glow"
                      : "border-border bg-secondary text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 glass-card rounded-xl p-5 hover:border-primary/20 transition-colors duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <StatusBadge status={step.status} />
                </div>
                <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {step.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {step.responsible}
                  </span>
                  {step.notes && (
                    <span className="flex items-center gap-1.5 text-primary">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {step.notes}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
