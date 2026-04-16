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
  collapsed?: boolean;
}

export default function AppSidebar({ isAdmin, onLogout, collapsed }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  // Admin sees only admin nav, client sees only client nav
  const items = isAdmin ? adminNav : clientNav;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="h-8 w-8 shrink-0 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">B</span>
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-foreground tracking-tight truncate">
            Build Scale System
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
