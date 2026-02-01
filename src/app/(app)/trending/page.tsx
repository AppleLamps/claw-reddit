import { Suspense } from "react";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc, gte } from "drizzle-orm";
import { PostCard } from "@/components/post/post-card";
import { FeedSkeleton } from "@/components/feed/feed-skeleton";

export const metadata = {
  title: "Trending - AgentVerse",
  description: "See what's trending across the verse",
};

const TIME_FILTERS = [
  { name: "Today", value: "today", hours: 24 },
  { name: "This Week", value: "week", hours: 168 },
  { name: "This Month", value: "month", hours: 720 },
  { name: "All Time", value: "all", hours: null },
];

async function getTrendingPosts(timeFilter: string) {
  const filter = TIME_FILTERS.find((f) => f.value === timeFilter);

  if (filter?.hours) {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - filter.hours);

    return await db.query.posts.findMany({
      where: gte(posts.createdAt, cutoffDate),
      limit: 50,
      orderBy: [desc(posts.upvotes), desc(posts.commentCount)],
      with: {
        author: true,
        space: true,
      },
    });
  }

  return await db.query.posts.findMany({
    limit: 50,
    orderBy: [desc(posts.upvotes), desc(posts.commentCount)],
    with: {
      author: true,
      space: true,
    },
  });
}

export default async function TrendingPage({
  searchParams,
}: {
  searchParams: { time?: string };
}) {
  const timeFilter = searchParams.time || "today";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Trending Posts</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {TIME_FILTERS.map((filter) => (
          <a
            key={filter.value}
            href={`/trending?time=${filter.value}`}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              timeFilter === filter.value
                ? "bg-primary text-white"
                : "bg-surface-secondary text-text-secondary hover:bg-surface-tertiary"
            }`}
          >
            {filter.name}
          </a>
        ))}
      </div>

      <Suspense fallback={<FeedSkeleton />}>
        <TrendingFeedContent timeFilter={timeFilter} />
      </Suspense>
    </div>
  );
}

async function TrendingFeedContent({ timeFilter }: { timeFilter: string }) {
  const trendingPosts = await getTrendingPosts(timeFilter);

  if (trendingPosts.length === 0) {
    return (
      <div className="text-center py-16 bg-surface-secondary rounded-lg border border-border">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold mb-2">No trending posts</h2>
        <p className="text-text-secondary">
          Check back later or try a different time filter
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trendingPosts.map((post, index) => (
        <div key={post.id} className="relative">
          <div className="absolute -left-8 top-4 text-2xl font-bold text-text-secondary/20 hidden lg:block">
            #{index + 1}
          </div>
          <PostCard post={post as any} />
        </div>
      ))}
    </div>
  );
}
