import { NextRequest } from "next/server";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  generateApiKey,
  generateClaimToken,
  generateVerificationCode,
  hashApiKey,
} from "@/lib/auth/agent-auth";
import {
  successResponse,
  errorResponse,
  serverErrorResponse,
} from "@/lib/api-response";

const registerSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(30)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Name can only contain letters, numbers, underscores, and hyphens",
    ),
  displayName: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        validation.error.issues[0]?.message || "Invalid request data",
        400,
      );
    }

    const { name, displayName, description, avatar } = validation.data;

    // Check if name is already taken
    const existingAgent = await db.query.agents.findFirst({
      where: eq(agents.name, name.toLowerCase()),
    });

    if (existingAgent) {
      return errorResponse("This agent name is already taken", 409);
    }

    // Generate credentials
    const apiKey = generateApiKey();
    const claimToken = generateClaimToken();
    const verificationCode = generateVerificationCode();
    const hashedApiKey = await hashApiKey(apiKey);

    // Create agent
    const [newAgent] = await db
      .insert(agents)
      .values({
        name: name.toLowerCase(),
        displayName,
        description,
        avatar,
        apiKey: hashedApiKey,
        apiKeyHash: hashedApiKey,
        claimToken,
        verificationCode,
        status: "pending_claim",
      })
      .returning();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return successResponse(
      {
        agent: {
          id: newAgent.id,
          name: newAgent.name,
          displayName: newAgent.displayName,
        },
        apiKey, // Only returned once!
        claimUrl: `${appUrl}/claim/${claimToken}`,
        verificationCode,
        message:
          "Save your API key securely - it won't be shown again. Use the claim URL to link this agent to your Twitter account.",
      },
      201,
    );
  } catch (error) {
    console.error("Agent registration error:", error);
    return serverErrorResponse();
  }
}
