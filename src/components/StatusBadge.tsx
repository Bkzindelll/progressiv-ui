import { cn } from "@/lib/utils";

type Status = "completed" | "in_progress" | "pending";

const config: Record<Status, { bg: string; text: string; label: string }> = {
  completed: { bg: "bg-success/10", text: "text-success", label: "Concluído" },
  in_progress: { bg: "bg-primary/10", text: "text-primary", label: "Em andamento" },
  pending: { bg: "bg-muted", text: "text-muted-foreground", label: "Pendente" },
};

export default function StatusBadge({ status }: { status: Status }) {
  const c = config[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", c.bg, c.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", status === "completed" ? "bg-success" : status === "in_progress" ? "bg-primary" : "bg-muted-foreground")} />
      {c.label}
    </span>
  );
}
