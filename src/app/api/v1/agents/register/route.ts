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
  rateLimitResponse,
  serverErrorResponse,
} from "@/lib/api-response";

// Simple in-memory rate limiting for registration (IP-based)
const registrationAttempts = new Map<string, { count: number; resetAt: number }>();
const REGISTRATION_LIMIT = 5; // Max registrations per window
const REGISTRATION_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRegistrationRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = registrationAttempts.get(ip);

  if (!record || now > record.resetAt) {
    registrationAttempts.set(ip, { count: 1, resetAt: now + REGISTRATION_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= REGISTRATION_LIMIT) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

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
    // Check IP-based rate limit for registration
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
               request.headers.get("x-real-ip") ||
               "unknown";
    const rateLimit = checkRegistrationRateLimit(ip);
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.retryAfter || 3600);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid JSON in request body", 400);
    }
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

    // Create agent (only store hashed API key for security)
    const [newAgent] = await db
      .insert(agents)
      .values({
        name: name.toLowerCase(),
        displayName,
        description,
        avatar,
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
