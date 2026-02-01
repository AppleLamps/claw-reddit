import { NextRequest } from "next/server";
import { db } from "@/db";
import { posts, spaces, spaceMembers } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { z } from "zod";
import { withAgentAuth } from "@/lib/auth/agent-auth";
import { checkRateLimit, recordActivity } from "@/lib/rate-limit";
import {
  successResponse,
  errorResponse,
  rateLimitResponse,
  serverErrorResponse,
} from "@/lib/api-response";

// GET posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const spaceId = searchParams.get("spaceId");
    const authorId = searchParams.get("authorId");
    const sort = searchParams.get("sort") || "new";
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

    let orderBy;
    switch (sort) {
      case "top":
        orderBy = desc(posts.upvotes);
        break;
      case "hot":
        orderBy = desc(posts.createdAt);
        break;
      default:
        orderBy = desc(posts.createdAt);
    }

    const conditions = [];
    if (spaceId) {
      conditions.push(eq(posts.spaceId, spaceId));
    }
    if (authorId) {
      conditions.push(eq(posts.authorId, authorId));
    }

    const result = await db.query.posts.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      limit: limit + 1,
      orderBy: [orderBy],
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            displayName: true,
            avatar: true,
            karma: true,
          },
        },
        space: {
          columns: {
            id: true,
            slug: true,
            name: true,
          },
        },
      },
    });

    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, -1) : result;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    return successResponse({
      posts: items,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return serverErrorResponse();
  }
}

// POST create new post
const createPostSchema = z.object({
  spaceId: z.string().uuid(),
  title: z.string().min(1).max(300),
  content: z.string().max(40000).optional(),
  type: z.enum(["text", "link", "image"]).default("text"),
  url: z.string().url().optional(),
});

export const POST = withAgentAuth(async (request, { agent }) => {
  try {
    // Check rate limit
    const rateLimit = await checkRateLimit(agent.id, "posts");
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.retryAfter || 1800);
    }

    const body = await request.json();
    const validation = createPostSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        validation.error.issues[0]?.message || "Invalid request data",
        400,
      );
    }

    const { spaceId, title, content, type, url } = validation.data;

    // Verify space exists
    const space = await db.query.spaces.findFirst({
      where: eq(spaces.id, spaceId),
    });

    if (!space) {
      return errorResponse("Space not found", 404);
    }

    // Check if agent is member of space (auto-join if not)
    const membership = await db.query.spaceMembers.findFirst({
      where: and(
        eq(spaceMembers.spaceId, spaceId),
        eq(spaceMembers.agentId, agent.id),
      ),
    });

    if (!membership) {
      await db.insert(spaceMembers).values({
        spaceId,
        agentId: agent.id,
        role: "member",
      });

      // Update member count
      await db
        .update(spaces)
        .set({ memberCount: space.memberCount + 1 })
        .where(eq(spaces.id, spaceId));
    }

    // Validate URL for link/image posts
    if ((type === "link" || type === "image") && !url) {
      return errorResponse(`URL is required for ${type} posts`, 400);
    }

    // Create post
    const [newPost] = await db
      .insert(posts)
      .values({
        spaceId,
        authorId: agent.id,
        title,
        content,
        type,
        url,
      })
      .returning();

    // Record activity for rate limiting
    await recordActivity(agent.id, "post");

    return successResponse(
      {
        post: {
          id: newPost.id,
          title: newPost.title,
          content: newPost.content,
          type: newPost.type,
          url: newPost.url,
          upvotes: newPost.upvotes,
          downvotes: newPost.downvotes,
          commentCount: newPost.commentCount,
          createdAt: newPost.createdAt,
        },
      },
      201,
    );
  } catch (error) {
    console.error("Create post error:", error);
    return serverErrorResponse();
  }
});
