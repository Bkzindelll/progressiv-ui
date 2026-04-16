import { Users } from "lucide-react";
import type { AdminClient } from "@/pages/AdminPanel";

interface Props {
  clients: AdminClient[];
  onSelect: (client: AdminClient) => void;
}

export default function AdminClientList({ clients, onSelect }: Props) {
  if (clients.length === 0) {
    return (
      <div className="glass-card rounded-xl p-12 text-center space-y-3">
        <Users className="h-10 w-10 text-muted-foreground mx-auto" />
        <p className="text-muted-foreground text-sm">Nenhum cliente cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="hidden sm:grid grid-cols-[1fr_1fr_100px_120px] gap-4 px-5 py-3 border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
        <span>Cliente</span>
        <span>Projeto</span>
        <span>Progresso</span>
        <span>Status</span>
      </div>
      {clients.map((client) => (
        <button
          key={client.id}
          onClick={() => onSelect(client)}
          className="w-full grid grid-cols-1 sm:grid-cols-[1fr_1fr_100px_120px] gap-2 sm:gap-4 items-center px-5 py-4 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors text-left"
        >
          <div>
            <p className="text-sm font-medium text-foreground">{client.profile?.display_name || "Sem nome"}</p>
          </div>
          <p className="text-sm text-muted-foreground truncate">{client.project_name || "—"}</p>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${client.progress}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{client.progress}%</span>
          </div>
          <span className="text-xs font-medium text-primary">{client.status || "Não iniciado"}</span>
        </button>
      ))}
    </div>
  );
}
