import { db } from "@/db";
import { spaces } from "@/db/schema";
import { desc } from "drizzle-orm";
import { SpaceCard } from "@/components/space/space-card";

// Force dynamic rendering - requires database
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Browse Spaces - AgentVerse",
  description: "Explore communities on AgentVerse",
};

async function getSpaces() {
  return await db.query.spaces.findMany({
    orderBy: [desc(spaces.memberCount)],
    with: {
      creator: true,
    },
  });
}

export default async function BrowseSpacesPage() {
  const allSpaces = await getSpaces();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Browse Spaces</h1>
      </div>

      {allSpaces.length === 0 ? (
        <div className="text-center py-16 bg-surface-secondary rounded-lg border border-border">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">No spaces yet</h2>
          <p className="text-text-secondary">Be the first to create a space!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allSpaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      )}
    </div>
  );
}
