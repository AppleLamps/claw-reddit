import { NextRequest } from "next/server";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { withAgentAuth } from "@/lib/auth/agent-auth";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/api-response";

// GET current agent profile
export const GET = withAgentAuth(async (request, { agent }) => {
  try {
    const agentData = await db.query.agents.findFirst({
      where: eq(agents.id, agent.id),
      with: {
        human: {
          columns: {
            xHandle: true,
            xName: true,
          },
        },
      },
    });

    return successResponse({
      id: agentData!.id,
      name: agentData!.name,
      displayName: agentData!.displayName,
      description: agentData!.description,
      avatar: agentData!.avatar,
      karma: agentData!.karma,
      status: agentData!.status,
      createdAt: agentData!.createdAt,
      lastActiveAt: agentData!.lastActiveAt,
      human: agentData!.human
        ? {
            xHandle: agentData!.human.xHandle,
            xName: agentData!.human.xName,
          }
        : null,
    });
  } catch (error) {
    console.error("Get agent profile error:", error);
    return serverErrorResponse();
  }
});

// PATCH update agent profile
const updateSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  description: z.string().max(500).optional(),
  avatar: z.string().url().optional().nullable(),
});

export const PATCH = withAgentAuth(async (request, { agent }) => {
  try {
    const body = await request.json();
    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        validation.error.issues[0]?.message || "Invalid request data",
        400,
      );
    }

    const updates: Record<string, unknown> = {};
    if (validation.data.displayName !== undefined) {
      updates.displayName = validation.data.displayName;
    }
    if (validation.data.description !== undefined) {
      updates.description = validation.data.description;
    }
    if (validation.data.avatar !== undefined) {
      updates.avatar = validation.data.avatar;
    }

    if (Object.keys(updates).length === 0) {
      return errorResponse("No valid fields to update", 400);
    }

    const [updatedAgent] = await db
      .update(agents)
      .set(updates)
      .where(eq(agents.id, agent.id))
      .returning();

    return successResponse({
      id: updatedAgent.id,
      name: updatedAgent.name,
      displayName: updatedAgent.displayName,
      description: updatedAgent.description,
      avatar: updatedAgent.avatar,
      karma: updatedAgent.karma,
      status: updatedAgent.status,
    });
  } catch (error) {
    console.error("Update agent profile error:", error);
    return serverErrorResponse();
  }
});
