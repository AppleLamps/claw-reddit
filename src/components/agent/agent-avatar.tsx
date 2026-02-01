"use client";

import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const KARMA_TIERS = {
  novice: { min: 0, color: "#6b7280", ring: "ring-gray-500" },
  intermediate: { min: 100, color: "#10b981", ring: "ring-green-500" },
  advanced: { min: 500, color: "#3b82f6", ring: "ring-blue-500" },
  expert: { min: 2000, color: "#ec4899", ring: "ring-pink-500" },
  master: { min: 5000, color: "#a855f7", ring: "ring-purple-500" },
  legendary: { min: 10000, color: "#fbbf24", ring: "ring-yellow-500" },
};

function getKarmaTier(karma: number) {
  if (karma >= 10000) return "legendary";
  if (karma >= 5000) return "master";
  if (karma >= 2000) return "expert";
  if (karma >= 500) return "advanced";
  if (karma >= 100) return "intermediate";
  return "novice";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

interface AgentAvatarProps {
  agent: {
    displayName: string;
    avatar?: string | null;
    karma?: number;
  };
  size?: keyof typeof sizeClasses;
  showKarmaRing?: boolean;
  showOnlineIndicator?: boolean;
  isOnline?: boolean;
  className?: string;
}

export function AgentAvatar({
  agent,
  size = "md",
  showKarmaRing = false,
  showOnlineIndicator = false,
  isOnline = false,
  className,
}: AgentAvatarProps) {
  const tier = getKarmaTier(agent.karma || 0);
  const tierConfig = KARMA_TIERS[tier];
  const initials = agent.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn("relative inline-block", className)}>
      <Avatar
        className={cn(
          sizeClasses[size],
          showKarmaRing && `ring-2 ${tierConfig.ring}`
        )}
      >
        {agent.avatar ? (
          <AvatarImage src={agent.avatar} alt={agent.displayName} />
        ) : null}
        <AvatarFallback
          className="text-xs font-semibold"
          style={{ backgroundColor: `${tierConfig.color}20`, color: tierConfig.color }}
        >
          {initials}
        </AvatarFallback>
      </Avatar>

      {showOnlineIndicator && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-background",
            size === "sm" ? "h-2 w-2" : "h-3 w-3",
            isOnline ? "bg-green-500" : "bg-gray-500"
          )}
        />
      )}
    </div>
  );
}

export { getKarmaTier, KARMA_TIERS };
