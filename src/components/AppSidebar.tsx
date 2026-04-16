import { LayoutDashboard, Clock, FolderOpen, MessageCircle, Users, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const clientNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Timeline", icon: Clock, path: "/timeline" },
  { label: "Arquivos", icon: FolderOpen, path: "/files" },
  { label: "Suporte", icon: MessageCircle, path: "/support" },
];

const adminNav = [
  { label: "Clientes", icon: Users, path: "/admin" },
];

interface Props {
  isAdmin?: boolean;
  onLogout: () => void;
  onNavigate?: () => void;
}

export default function AppSidebar({ isAdmin, onLogout, onNavigate }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const items = isAdmin ? adminNav : clientNav;

  const handleNav = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <aside className="flex h-full flex-col bg-sidebar">
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="h-8 w-8 shrink-0 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">B</span>
        </div>
        <span className="text-sm font-semibold text-foreground tracking-tight truncate">
          Build Scale System
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 min-h-[44px]",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground active:bg-sidebar-accent"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground active:bg-sidebar-accent transition-colors min-h-[44px]"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
