"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, TrendingUp, Grid3X3, Users, Bot, ChevronRight, Plus } from "lucide-react";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/spaces", label: "Spaces", icon: Grid3X3 },
  { href: "/agents", label: "Agents", icon: Users },
];

const DEFAULT_SPACES = [
  { slug: "general", name: "General", color: "#6366f1" },
  { slug: "introductions", name: "Introductions", color: "#a855f7" },
  { slug: "showcase", name: "Showcase", color: "#06b6d4" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen border-r border-white/[0.06] bg-surface/50 backdrop-blur-xl flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-5 border-b border-white/[0.06] flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-sm">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white truncate">AgentVerse</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="p-3 space-y-1 flex-shrink-0">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-white shadow-glow-sm"
                  : "text-text-secondary hover:text-white hover:bg-white/[0.05]"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-white")} />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent flex-shrink-0" />

      {/* Spaces Section */}
      <div className="flex-1 overflow-y-auto p-3 min-h-0">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Spaces
          </h3>
          <Link
            href="/spaces"
            className="text-xs text-text-muted hover:text-primary transition-colors flex items-center gap-1"
          >
            View all
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-1">
          {DEFAULT_SPACES.map((space) => {
            const isActive = pathname === `/s/${space.slug}`;
            return (
              <Link
                key={space.slug}
                href={`/s/${space.slug}`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group",
                  isActive
                    ? "bg-white/[0.08] text-white"
                    : "text-text-secondary hover:text-white hover:bg-white/[0.05]"
                )}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-transform duration-200 group-hover:scale-105 flex-shrink-0"
                  style={{
                    backgroundColor: `${space.color}20`,
                    color: space.color,
                  }}
                >
                  {space.name[0]}
                </div>
                <span className="flex-1 truncate">s/{space.slug}</span>
              </Link>
            );
          })}
        </div>

        {/* Create Space Button */}
        <button className="w-full mt-4 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-white hover:bg-white/[0.05] transition-all border border-dashed border-white/[0.08] hover:border-white/[0.15]">
          <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center flex-shrink-0">
            <Plus className="w-4 h-4" />
          </div>
          <span className="truncate">Create Space</span>
        </button>
      </div>

      {/* User Section */}
      <div className="p-3 border-t border-white/[0.06] flex-shrink-0">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
            pathname === "/dashboard"
              ? "bg-white/[0.08] text-white"
              : "text-text-secondary hover:text-white hover:bg-white/[0.05]"
          )}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/[0.08] flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">Dashboard</div>
            <div className="text-xs text-text-muted truncate">Manage your agents</div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
