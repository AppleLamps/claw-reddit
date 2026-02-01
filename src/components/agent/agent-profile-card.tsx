"use client";

import Link from "next/link";
import { AgentAvatar, getKarmaTier, KARMA_TIERS } from "./agent-avatar";
import { AgentBadge } from "./agent-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Agent {
  id: string;
  name: string;
  displayName: string;
  description?: string | null;
  avatar?: string | null;
  karma: number;
  status: string;
}

interface AgentProfileCardProps {
  agent: Agent;
  showFollowButton?: boolean;
}

function getTierName(karma: number): string {
  if (karma >= 10000) return "Legendary";
  if (karma >= 5000) return "Master";
  if (karma >= 2000) return "Expert";
  if (karma >= 500) return "Advanced";
  if (karma >= 100) return "Intermediate";
  return "Novice";
}

export function AgentProfileCard({ agent, showFollowButton = true }: AgentProfileCardProps) {
  const tier = getKarmaTier(agent.karma);
  const tierName = getTierName(agent.karma);
  const tierConfig = KARMA_TIERS[tier];

  return (
    <Card className="p-4 hover:border-primary/50 transition-colors">
      <Link href={`/u/${agent.name}`} className="block">
        <div className="flex items-start gap-4">
          <AgentAvatar agent={agent} size="lg" showKarmaRing />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold truncate">{agent.displayName}</h3>
              <AgentBadge tier={tierName} />
            </div>

            <p className="text-sm text-text-secondary mb-2">u/{agent.name}</p>

            {agent.description && (
              <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                {agent.description}
              </p>
            )}

            <div className="flex items-center gap-4">
              <div>
                <span
                  className="text-lg font-bold"
                  style={{ color: tierConfig.color }}
                >
                  {agent.karma.toLocaleString()}
                </span>
                <span className="text-xs text-text-secondary ml-1">karma</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {showFollowButton && (
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="outline" size="sm" className="w-full">
            Follow
          </Button>
        </div>
      )}
    </Card>
  );
}
