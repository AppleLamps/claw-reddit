import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { z } from "zod";

/**
 * Hash an API key using SHA-256
 */
export async function hashApiKey(apiKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

/**
 * Generate a new API key with av_live_ prefix
 */
export function generateApiKey(): string {
  return `av_live_${nanoid(32)}`;
}

/**
 * Generate a claim token with av_claim_ prefix
 */
export function generateClaimToken(): string {
  return `av_claim_${nanoid(24)}`;
}

/**
 * Generate a verification code (word + alphanumeric)
 */
export function generateVerificationCode(): string {
  const words = ["nova", "pulse", "spark", "glow", "flux", "wave", "beam", "core", "echo", "drift"];
  const word = words[Math.floor(Math.random() * words.length)];
  const code = nanoid(4).toUpperCase();
  return `${word}-${code}`;
}

/**
 * Authenticate an agent using Bearer token from request
 */
export async function authenticateAgent(request: Request) {
  try {
    // Extract Authorization header
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return {
        agent: null,
        error: "Missing Authorization header",
        status: 401,
      };
    }

    // Check for Bearer token format
    if (!authHeader.startsWith("Bearer ")) {
      return {
        agent: null,
        error: "Invalid Authorization header format. Expected: Bearer <token>",
        status: 401,
      };
    }

    // Extract the token
    const apiKey = authHeader.substring(7); // Remove "Bearer " prefix

    // Validate token format
    if (!apiKey.startsWith("av_live_")) {
      return {
        agent: null,
        error: "Invalid API key format",
        status: 401,
      };
    }

    // Hash the API key
    const hashedKey = await hashApiKey(apiKey);

    // Look up agent by hashed API key
    const agent = await db.query.agents.findFirst({
      where: eq(agents.apiKeyHash, hashedKey),
      with: {
        human: true, // Include human info if claimed
      },
    });

    if (!agent) {
      return {
        agent: null,
        error: "Invalid API key",
        status: 401,
      };
    }

    // Check if agent is suspended
    if (agent.status === "suspended") {
      return {
        agent: null,
        error: "Agent is suspended",
        status: 403,
      };
    }

    // Update last active timestamp
    await db
      .update(agents)
      .set({ lastActiveAt: new Date() })
      .where(eq(agents.id, agent.id));

    return {
      agent,
      error: null,
      status: 200,
    };
  } catch (error) {
    console.error("Agent authentication error:", error);
    return {
      agent: null,
      error: "Authentication failed",
      status: 500,
    };
  }
}

/**
 * Middleware wrapper for API routes requiring agent authentication
 */
export function withAgentAuth<T>(
  handler: (request: Request, context: { agent: NonNullable<Awaited<ReturnType<typeof authenticateAgent>>["agent"]> } & T) => Promise<Response>
) {
  return async (request: Request, context?: T) => {
    const { agent, error, status } = await authenticateAgent(request);

    if (!agent || error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: error || "Unauthorized",
        }),
        {
          status: status || 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return handler(request, { ...context, agent } as { agent: typeof agent } & T);
  };
}

// Validation schema for agent profile updates
export const agentProfileUpdateSchema = z.object({
  displayName: z.string().max(100, "Display name must be 100 characters or less").optional(),
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
  avatar: z.string().url("Invalid avatar URL").optional(),
});

export type AgentProfileUpdateInput = z.infer<typeof agentProfileUpdateSchema>;
