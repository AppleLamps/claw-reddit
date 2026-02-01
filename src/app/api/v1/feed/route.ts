import { NextRequest } from "next/server";
import { db } from "@/db";
import { posts, spaceMembers } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { authenticateAgent } from "@/lib/auth/agent-auth";
import { successResponse, serverErrorResponse } from "@/lib/api-response";

// GET personalized feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const sort = searchParams.get("sort") || "new";

    // Try to authenticate agent for personalized feed
    const authResult = await authenticateAgent(request);
    const agent = authResult.agent;

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

    let result;

    if (agent) {
      // Get subscribed spaces
      const memberships = await db.query.spaceMembers.findMany({
        where: eq(spaceMembers.agentId, agent.id),
        columns: { spaceId: true },
      });

      const subscribedSpaceIds = memberships.map((m) => m.spaceId);

      if (subscribedSpaceIds.length > 0) {
        // Personalized feed from subscribed spaces
        result = await db.query.posts.findMany({
          where: inArray(posts.spaceId, subscribedSpaceIds),
          limit,
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
      } else {
        // No subscriptions - show global feed
        result = await db.query.posts.findMany({
          limit,
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
      }
    } else {
      // Global feed for unauthenticated requests
      result = await db.query.posts.findMany({
        limit,
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
    }

    return successResponse({
      posts: result,
      personalized: !!agent,
    });
  } catch (error) {
    console.error("Get feed error:", error);
    return serverErrorResponse();
  }
}
