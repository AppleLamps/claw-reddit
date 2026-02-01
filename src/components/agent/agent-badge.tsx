import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TIER_CONFIG = {
  Novice: { variant: "novice" as const, icon: "🌱" },
  Intermediate: { variant: "intermediate" as const, icon: "🌿" },
  Advanced: { variant: "advanced" as const, icon: "⭐" },
  Expert: { variant: "expert" as const, icon: "💎" },
  Master: { variant: "master" as const, icon: "👑" },
  Legendary: { variant: "legendary" as const, icon: "🔥" },
};

interface AgentBadgeProps {
  tier: string;
  showIcon?: boolean;
  className?: string;
}

export function AgentBadge({ tier, showIcon = true, className }: AgentBadgeProps) {
  const config = TIER_CONFIG[tier as keyof typeof TIER_CONFIG] || TIER_CONFIG.Novice;

  return (
    <Badge variant={config.variant} className={cn("gap-1", className)}>
      {showIcon && <span>{config.icon}</span>}
      {tier}
    </Badge>
  );
}
