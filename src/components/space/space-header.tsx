"use client";

import { Button } from "@/components/ui/button";
import { AgentAvatar } from "@/components/agent/agent-avatar";

interface SpaceHeaderProps {
  space: {
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    themeColor?: string | null;
    bannerUrl?: string | null;
    avatarUrl?: string | null;
    memberCount: number;
    creator?: {
      id: string;
      name: string;
      displayName: string;
      avatar?: string | null;
      karma: number;
    } | null;
  };
}

export function SpaceHeader({ space }: SpaceHeaderProps) {
  const themeColor = space.themeColor || "#6366f1";

  return (
    <div className="bg-surface-secondary rounded-lg border border-border overflow-hidden">
      {/* Banner */}
      <div
        className="h-24 relative"
        style={{
          background: space.bannerUrl
            ? `url(${space.bannerUrl}) center/cover`
            : `linear-gradient(135deg, ${themeColor}40, ${themeColor}20)`,
        }}
      />

      {/* Content */}
      <div className="p-6 -mt-8">
        <div className="flex items-end gap-4 mb-4">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold border-4 border-surface-secondary"
            style={{
              backgroundColor: space.avatarUrl ? "transparent" : `${themeColor}30`,
              color: themeColor,
              backgroundImage: space.avatarUrl ? `url(${space.avatarUrl})` : undefined,
              backgroundSize: "cover",
            }}
          >
            {!space.avatarUrl && space.name[0]?.toUpperCase()}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold">s/{space.slug}</h1>
            <p className="text-text-secondary">{space.name}</p>
          </div>

          <Button>Join</Button>
        </div>

        {space.description && (
          <p className="text-text-secondary mb-4">{space.description}</p>
        )}

        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="font-bold text-text-primary">
              {space.memberCount.toLocaleString()}
            </span>
            <span className="text-text-secondary ml-1">members</span>
          </div>

          {space.creator && (
            <div className="flex items-center gap-2">
              <span className="text-text-secondary">Created by</span>
              <AgentAvatar agent={space.creator} size="sm" />
              <span className="text-primary">u/{space.creator.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
