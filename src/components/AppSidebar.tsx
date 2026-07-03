import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid, Shield, DollarSign, Users, Key, Share2, BarChart3,
  RefreshCw, ClipboardCheck, Star, Puzzle, Lock, Settings, User,
  LogOut, ChevronDown, ChevronRight, Search, PanelLeftClose, PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ElementType;
}

interface NavGroup {
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "SaaS 應用管理",
    icon: LayoutGrid,
    children: [
      { label: "SaaS 目錄", href: "/" },
      { label: "授權管理", href: "/licenses" },
      { label: "費用分析", href: "/costs" },
    ],
  },
  {
    label: "社群帳號管理",
    icon: Users,
    children: [
      { label: "帳號列表", href: "/accounts" },
      { label: "交接管理", href: "/handover" },
    ],
  },
  { label: "OAuth/Token 管理", icon: Key, href: "/oauth" },
  { label: "團隊共享", icon: Share2, href: "/sharing" },
  { label: "用量監控", icon: BarChart3, href: "/usage" },
  { label: "到期轉換", icon: RefreshCw, href: "/renewal" },
  { label: "稽核合規", icon: ClipboardCheck, href: "/compliance" },
  { label: "特權帳號", icon: Star, href: "/privileged" },
  { label: "整合部署", icon: Puzzle, href: "/integrations" },
  { label: "權限管理", icon: Lock, href: "/permissions" },
  { label: "系統設定", icon: Settings, href: "/settings" },
];

function isGroupActive(group: NavGroup, path: string) {
  if (group.children) return group.children.some((c) => c.href === path);
  return group.href === path;
}

export default function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navGroups.forEach((g) => {
      if (g.children && isGroupActive(g, currentPath)) initial[g.label] = true;
    });
    // Default open first group
    if (Object.keys(initial).length === 0) initial["SaaS 應用管理"] = true;
    return initial;
  });

  const toggle = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground h-screen transition-all duration-300 flex-shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Search className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg text-sidebar-accent-foreground tracking-wide">
            VLT
          </span>
        )}
        <button
          onClick={onToggle}
          className="ml-auto text-sidebar-muted hover:text-sidebar-accent-foreground transition-colors"
        >
          {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* User */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-sidebar-primary flex items-center justify-center text-xs font-bold text-sidebar-primary-foreground">
              U
            </div>
            <div className="text-sm text-sidebar-accent-foreground">使用者</div>
          </div>
          <div className="mt-1 text-xs text-sidebar-muted">管理員</div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 space-y-0.5">
        {navGroups.map((group) => {
          const Icon = group.icon;
          const isOpen = openGroups[group.label];
          const hasChildren = !!group.children;
          const active = isGroupActive(group, currentPath);

          return (
            <div key={group.label}>
              <button
                onClick={() => {
                  if (hasChildren) {
                    toggle(group.label);
                  } else if (group.href) {
                    navigate(group.href);
                  }
                }}
                className={cn(
                  "flex items-center w-full px-4 py-2 text-sm hover:bg-sidebar-accent transition-colors",
                  collapsed && "justify-center px-0",
                  !hasChildren && active && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="ml-3 flex-1 text-left">{group.label}</span>
                    {hasChildren &&
                      (isOpen ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      ))}
                  </>
                )}
              </button>
              {hasChildren && isOpen && !collapsed && (
                <div className="ml-7 space-y-0.5">
                  {group.children!.map((child) => (
                    <button
                      key={child.href}
                      onClick={() => navigate(child.href)}
                      className={cn(
                        "block w-full text-left px-4 py-1.5 text-sm rounded-md transition-colors",
                        currentPath === child.href
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "hover:bg-sidebar-accent text-sidebar-foreground"
                      )}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border py-2">
        <button
          onClick={() => navigate("/profile")}
          className={cn(
            "flex items-center w-full px-4 py-2 text-sm hover:bg-sidebar-accent",
            collapsed && "justify-center px-0"
          )}
        >
          <User className="w-4 h-4" />
          {!collapsed && <span className="ml-3">個人設定</span>}
        </button>
        <button
          className={cn(
            "flex items-center w-full px-4 py-2 text-sm hover:bg-sidebar-accent",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="ml-3">登出</span>}
        </button>
      </div>
    </aside>
  );
}
