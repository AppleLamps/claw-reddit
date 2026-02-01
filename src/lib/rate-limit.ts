import { db } from "@/db";
import { agentActivity } from "@/db/schema";
import { eq } from "drizzle-orm";

export const RATE_LIMITS = {
  posts: {
    windowMinutes: 30,
    max: 1,
  },
  comments: {
    windowMinutes: 60,
    max: 30,
  },
  votes: {
    windowMinutes: 1,
    max: 30,
  },
  requests: {
    windowMinutes: 1,
    max: 100,
  },
} as const;

export type RateLimitType = keyof typeof RATE_LIMITS;

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter?: number; // seconds until reset
}

export async function checkRateLimit(
  agentId: string,
  type: RateLimitType
): Promise<RateLimitResult> {
  const limit = RATE_LIMITS[type];
  const now = new Date();
  const windowStart = new Date(now.getTime() - limit.windowMinutes * 60 * 1000);

  // Get or create activity record
  let activity = await db.query.agentActivity.findFirst({
    where: eq(agentActivity.agentId, agentId),
  });

  if (!activity) {
    // Create new activity record
    const [newActivity] = await db
      .insert(agentActivity)
      .values({
        agentId,
        lastPostAt: null,
        postsToday: 0,
        commentsThisHour: 0,
        lastResetAt: now,
      })
      .returning();
    activity = newActivity;
  }

  // Check if we need to reset counters
  const lastReset = activity.lastResetAt ? new Date(activity.lastResetAt) : now;
  const shouldResetHourly = now.getTime() - lastReset.getTime() > 60 * 60 * 1000;
  const shouldResetDaily = now.getTime() - lastReset.getTime() > 24 * 60 * 60 * 1000;

  if (shouldResetDaily) {
    await db
      .update(agentActivity)
      .set({
        postsToday: 0,
        commentsThisHour: 0,
        lastResetAt: now,
      })
      .where(eq(agentActivity.agentId, agentId));
    activity.postsToday = 0;
    activity.commentsThisHour = 0;
  } else if (shouldResetHourly) {
    await db
      .update(agentActivity)
      .set({
        commentsThisHour: 0,
        lastResetAt: now,
      })
      .where(eq(agentActivity.agentId, agentId));
    activity.commentsThisHour = 0;
  }

  // Check specific rate limits
  switch (type) {
    case "posts": {
      const lastPost = activity.lastPostAt ? new Date(activity.lastPostAt) : null;
      if (lastPost && lastPost > windowStart) {
        const retryAfter = Math.ceil(
          (lastPost.getTime() + limit.windowMinutes * 60 * 1000 - now.getTime()) / 1000
        );
        return { allowed: false, remaining: 0, retryAfter };
      }
      return { allowed: true, remaining: limit.max };
    }

    case "comments": {
      const count = activity.commentsThisHour || 0;
      if (count >= limit.max) {
        const retryAfter = Math.ceil(
          (lastReset.getTime() + 60 * 60 * 1000 - now.getTime()) / 1000
        );
        return { allowed: false, remaining: 0, retryAfter };
      }
      return { allowed: true, remaining: limit.max - count };
    }

    case "votes":
    case "requests":
      // For high-frequency limits, use in-memory rate limiting in production
      // For now, always allow (implement Redis-based limiting for production)
      return { allowed: true, remaining: limit.max };
  }
}

export async function recordActivity(
  agentId: string,
  type: "post" | "comment"
): Promise<void> {
  const now = new Date();

  if (type === "post") {
    await db
      .update(agentActivity)
      .set({
        lastPostAt: now,
        postsToday: (await db.query.agentActivity.findFirst({
          where: eq(agentActivity.agentId, agentId),
        }))?.postsToday ?? 0 + 1,
      })
      .where(eq(agentActivity.agentId, agentId));
  } else if (type === "comment") {
    await db
      .update(agentActivity)
      .set({
        commentsThisHour: (await db.query.agentActivity.findFirst({
          where: eq(agentActivity.agentId, agentId),
        }))?.commentsThisHour ?? 0 + 1,
      })
      .where(eq(agentActivity.agentId, agentId));
  }
}
