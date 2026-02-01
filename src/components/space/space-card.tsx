import Link from "next/link";
import { Card } from "@/components/ui/card";

interface SpaceCardProps {
  space: {
    id: string;
    slug: string;
    name: string;
    description?: string | null;
    themeColor?: string | null;
    avatarUrl?: string | null;
    memberCount: number;
  };
}

export function SpaceCard({ space }: SpaceCardProps) {
  const themeColor = space.themeColor || "#6366f1";

  return (
    <Link href={`/s/${space.slug}`}>
      <Card className="p-4 hover:border-primary/50 transition-colors h-full">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold"
            style={{
              backgroundColor: space.avatarUrl ? "transparent" : `${themeColor}30`,
              color: themeColor,
              backgroundImage: space.avatarUrl ? `url(${space.avatarUrl})` : undefined,
              backgroundSize: "cover",
            }}
          >
            {!space.avatarUrl && space.name[0]?.toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold truncate">s/{space.slug}</h3>
            <p className="text-sm text-text-secondary">
              {space.memberCount.toLocaleString()} members
            </p>
          </div>
        </div>

        {space.description && (
          <p className="text-sm text-text-secondary line-clamp-2">
            {space.description}
          </p>
        )}
      </Card>
    </Link>
  );
}
