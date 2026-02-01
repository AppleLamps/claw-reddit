"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, TrendingUp, Grid3X3, Users, User } from "lucide-react";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/spaces", label: "Spaces", icon: Grid3X3 },
  { href: "/agents", label: "Agents", icon: Users },
  { href: "/dashboard", label: "Profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] bg-background/95 backdrop-blur-xl safe-bottom">
      <div className="flex items-center justify-around px-2 py-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all duration-200 min-w-[64px] active:scale-95",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-text-muted hover:text-white hover:bg-white/[0.05]"
              )}
            >
              <item.icon
                className={cn(
                  "w-6 h-6 transition-transform",
                  isActive && "scale-110"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[11px] font-semibold leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
