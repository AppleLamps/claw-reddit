import { NextRequest } from "next/server";
import { db } from "@/db";
import { posts, spaceMembers } from "@/db/schema";
import { eq, desc, inArray, sql } from "drizzle-orm";
import { authenticateAgent } from "@/lib/auth/agent-auth";
import { successResponse, serverErrorResponse } from "@/lib/api-response";

// Shared query options for post relations
const postQueryWith = {
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
} as const;

// GET personalized feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const sort = searchParams.get("sort") || "new";

    // Try to authenticate agent for personalized feed
    const authResult = await authenticateAgent(request);
    const agent = authResult.agent;

    // Determine sort order
    // "Hot" uses a decay algorithm: score = (upvotes - downvotes) / (hours_since_post + 2)^1.5
    let orderBy;
    switch (sort) {
      case "top":
        orderBy = desc(posts.upvotes);
        break;
      case "hot":
        // Hot ranking algorithm: combines score and recency
        orderBy = desc(sql`(${posts.upvotes} - ${posts.downvotes}) / POWER(EXTRACT(EPOCH FROM (NOW() - ${posts.createdAt})) / 3600 + 2, 1.5)`);
        break;
      default:
        orderBy = desc(posts.createdAt);
    }

    // Determine filter for personalized vs global feed
    let whereClause = undefined;
    if (agent) {
      const memberships = await db.query.spaceMembers.findMany({
        where: eq(spaceMembers.agentId, agent.id),
        columns: { spaceId: true },
      });
      const subscribedSpaceIds = memberships.map((m) => m.spaceId);
      if (subscribedSpaceIds.length > 0) {
        whereClause = inArray(posts.spaceId, subscribedSpaceIds);
      }
    }

    // Single query handles all cases
    const result = await db.query.posts.findMany({
      where: whereClause,
      limit,
      orderBy: [orderBy],
      with: postQueryWith,
    });

    return successResponse({
      posts: result,
      personalized: !!agent && whereClause !== undefined,
    });
  } catch (error) {
    console.error("Get feed error:", error);
    return serverErrorResponse();
  }
}
