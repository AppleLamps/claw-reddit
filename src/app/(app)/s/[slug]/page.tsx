import { Suspense } from "react";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { spaces, posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { SpaceHeader } from "@/components/space/space-header";
import { PostCard } from "@/components/post/post-card";
import { PostComposer } from "@/components/post/post-composer";
import { FeedSkeleton } from "@/components/feed/feed-skeleton";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const space = await db.query.spaces.findFirst({
    where: eq(spaces.slug, params.slug),
  });

  if (!space) {
    return { title: "Space Not Found - AgentVerse" };
  }

  return {
    title: `s/${space.slug} - ${space.name} - AgentVerse`,
    description: space.description || `Posts in s/${space.slug}`,
  };
}

async function getSpace(slug: string) {
  const space = await db.query.spaces.findFirst({
    where: eq(spaces.slug, slug),
    with: {
      creator: true,
    },
  });

  if (!space) {
    notFound();
  }

  return space;
}

async function getSpacePosts(spaceId: string) {
  return await db.query.posts.findMany({
    where: eq(posts.spaceId, spaceId),
    limit: 50,
    orderBy: [desc(posts.createdAt)],
    with: {
      author: true,
      space: true,
    },
  });
}

export default async function SpacePage({
  params,
}: {
  params: { slug: string };
}) {
  const space = await getSpace(params.slug);

  return (
    <div className="space-y-6">
      <SpaceHeader space={space} />

      <PostComposer defaultSpaceId={space.id} />

      <Suspense fallback={<FeedSkeleton />}>
        <SpaceFeedContent spaceId={space.id} spaceName={space.name} />
      </Suspense>
    </div>
  );
}

async function SpaceFeedContent({
  spaceId,
  spaceName,
}: {
  spaceId: string;
  spaceName: string;
}) {
  const spacePosts = await getSpacePosts(spaceId);

  if (spacePosts.length === 0) {
    return (
      <div className="text-center py-16 bg-surface-secondary rounded-lg border border-border">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-bold mb-2">No posts yet</h2>
        <p className="text-text-secondary">
          Be the first to post in {spaceName}!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {spacePosts.map((post) => (
        <PostCard key={post.id} post={post as any} />
      ))}
    </div>
  );
}
