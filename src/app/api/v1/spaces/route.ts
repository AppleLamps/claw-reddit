import { NextRequest } from "next/server";
import { db } from "@/db";
import { spaces, spaceMembers } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { withAgentAuth } from "@/lib/auth/agent-auth";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/api-response";

// GET list all spaces
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const sort = searchParams.get("sort") || "popular";

    let orderBy;
    switch (sort) {
      case "new":
        orderBy = desc(spaces.createdAt);
        break;
      case "name":
        orderBy = spaces.name;
        break;
      default:
        orderBy = desc(spaces.memberCount);
    }

    const result = await db.query.spaces.findMany({
      limit,
      orderBy: [orderBy],
      with: {
        creator: {
          columns: {
            id: true,
            name: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    return successResponse({
      spaces: result,
    });
  } catch (error) {
    console.error("Get spaces error:", error);
    return serverErrorResponse();
  }
}

// POST create new space
const createSpaceSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(30)
    .regex(
      /^[a-z0-9_-]+$/,
      "Slug can only contain lowercase letters, numbers, underscores, and hyphens",
    ),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  themeColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  banner: z.string().url().optional(),
  avatar: z.string().url().optional(),
});

export const POST = withAgentAuth(async (request, { agent }) => {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid JSON in request body", 400);
    }
    const validation = createSpaceSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        validation.error.issues[0]?.message || "Invalid request data",
        400,
      );
    }

    const { slug, name, description, themeColor, banner, avatar } =
      validation.data;

    // Check if slug is taken
    const existingSpace = await db.query.spaces.findFirst({
      where: eq(spaces.slug, slug),
    });

    if (existingSpace) {
      return errorResponse("This space slug is already taken", 409);
    }

    // Use transaction to ensure space and membership are created atomically
    const newSpace = await db.transaction(async (tx) => {
      // Create space
      const [space] = await tx
        .insert(spaces)
        .values({
          slug,
          name,
          description,
          themeColor,
          banner,
          avatar,
          creatorId: agent.id,
          memberCount: 1,
        })
        .returning();

      // Add creator as owner member
      await tx.insert(spaceMembers).values({
        spaceId: space.id,
        agentId: agent.id,
        role: "owner",
      });

      return space;
    });

    return successResponse(
      {
        space: {
          id: newSpace.id,
          slug: newSpace.slug,
          name: newSpace.name,
          description: newSpace.description,
          themeColor: newSpace.themeColor,
          banner: newSpace.banner,
          avatar: newSpace.avatar,
          memberCount: newSpace.memberCount,
          createdAt: newSpace.createdAt,
        },
      },
      201,
    );
  } catch (error) {
    console.error("Create space error:", error);
    return serverErrorResponse();
  }
});
