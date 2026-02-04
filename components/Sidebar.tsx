"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart2,
  BookOpen,
  ChevronDown,
  Code2,
  FileText,
  Home,
  LayoutGrid,
  Settings,
  Users,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

function SidebarItem({ icon: Icon, label, href, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-secondary text-secondary-foreground"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      <Icon className={cn("h-4 w-4", active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} />
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-sidebar p-4 pt-6">
      <div className="flex flex-col gap-6">
        {/* Org Switcher / Logo Area */}
        <div className="px-2">
          <button className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:opacity-80">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-[10px] font-bold text-primary-foreground">
              PC
            </div>
            <span>Precision Chronicles</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Main Navigation */}
        <div className="flex flex-col gap-1">
          <SidebarItem
            icon={Home}
            label="Overview"
            href="/admin"
            active={pathname === "/admin"}
          />
          <SidebarItem
            icon={FileText}
            label="Complaints"
            href="/admin/complaints"
            active={pathname.startsWith("/admin/complaints")}
          />
          <SidebarItem
             icon={Users}
             label="Team"
             href="/admin/team"
             active={pathname.startsWith("/admin/team")}
           />
          <SidebarItem
            icon={Users}
            label="Audience"
            href="/admin/audience"
            active={pathname === "/admin/audience"}
          />
           <SidebarItem
            icon={BarChart2}
            label="Metrics"
            href="/admin/metrics"
            active={pathname === "/admin/metrics"}
          />
          <SidebarItem
            icon={LayoutGrid}
            label="Templates"
            href="/admin/templates"
            active={pathname === "/admin/templates"}
          />
          <SidebarItem
             icon={Code2}
             label="Logs"
             href="/admin/logs"
             active={pathname === "/admin/logs"}
           />
        </div>

        {/* Secondary / Bottom Navigation */}
        <div className="mt-auto flex flex-col gap-1">
           <SidebarItem
            icon={BookOpen}
            label="Documentation"
            href="/docs"
          />
          <SidebarItem
            icon={Settings}
            label="Settings"
            href="/settings"
            active={pathname === "/settings"}
          />
          
          <div className="mt-4 flex items-center gap-3 px-2 py-2">
             <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800" />
             <div className="flex flex-col">
                 <span className="text-xs font-medium">User</span>
                 <span className="text-[10px] text-muted-foreground">user@example.com</span>
             </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
