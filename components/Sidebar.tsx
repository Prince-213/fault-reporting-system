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
  LightbulbIcon,
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
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4",
          active
            ? "text-foreground"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      />
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
            <a
              href="/"
              className="text-2xl font-bold flex items-center space-x-2 text-[#050040]"
            >
              <LightbulbIcon size={32} />
              <h1>Faultee</h1>
            </a>
          </button>
        </div>

        {/* Main Navigation */}

        
        <div className="flex flex-col gap-1 mt-5">
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
      
        
        </div>

      
      </div>
    </aside>
  );
}
