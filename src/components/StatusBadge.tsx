import { cn } from "@/lib/utils";

type Status = "completed" | "in_progress" | "pending" | "awaiting_approval";

const config: Record<Status, { bg: string; text: string; label: string; dot: string }> = {
  completed: { bg: "bg-success/10", text: "text-success", label: "Concluído", dot: "bg-success" },
  in_progress: { bg: "bg-primary/10", text: "text-primary", label: "Em andamento", dot: "bg-primary" },
  pending: { bg: "bg-muted", text: "text-muted-foreground", label: "Pendente", dot: "bg-muted-foreground" },
  awaiting_approval: { bg: "bg-amber-500/10", text: "text-amber-500", label: "Aguardando aprovação", dot: "bg-amber-500" },
};

export default function StatusBadge({ status }: { status: Status }) {
  const c = config[status] || config.pending;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", c.bg, c.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}
