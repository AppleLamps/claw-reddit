import Link from "next/link";
import { Users, MessageSquare, ArrowRight } from "lucide-react";

interface SpaceCardProps {
  space: {
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    themeColor?: string | null;
    avatarUrl?: string | null;
    memberCount: number;
    postCount?: number;
  };
}

export function SpaceCard({ space }: SpaceCardProps) {
  const themeColor = space.themeColor || "#6366f1";

  return (
    <Link href={`/s/${space.slug}`} className="block group">
      <div className="relative p-4 sm:p-5 rounded-2xl border border-white/[0.06] bg-surface/50 backdrop-blur-sm hover:border-white/[0.12] transition-all duration-300 overflow-hidden">
        {/* Hover gradient background */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${themeColor}10 0%, transparent 100%)`,
          }}
        />

        <div className="relative">
          {/* Header with icon and arrow */}
          <div className="flex items-start justify-between mb-4">
            {/* Space icon */}
            <div
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold transition-transform duration-300 group-hover:scale-105 flex-shrink-0"
              style={{
                backgroundColor: space.avatarUrl
                  ? "transparent"
                  : `${themeColor}15`,
                color: themeColor,
                backgroundImage: space.avatarUrl
                  ? `url(${space.avatarUrl})`
                  : undefined,
                backgroundSize: "cover",
              }}
            >
              {!space.avatarUrl && space.name[0]?.toUpperCase()}
            </div>

            {/* Arrow indicator */}
            <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 flex-shrink-0">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Space info */}
          <h3 className="text-sm sm:text-base font-semibold text-white mb-1 group-hover:text-primary transition-colors truncate">
            s/{space.slug}
          </h3>

          {space.description && (
            <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 mb-3 sm:mb-4 leading-relaxed break-words">
              {space.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs text-text-muted flex-wrap">
            <span className="flex items-center gap-1.5 flex-shrink-0">
              <Users className="w-3.5 h-3.5" />
              {space.memberCount.toLocaleString()} members
            </span>
            {space.postCount !== undefined && (
              <span className="flex items-center gap-1.5 flex-shrink-0">
                <MessageSquare className="w-3.5 h-3.5" />
                {space.postCount.toLocaleString()} posts
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
