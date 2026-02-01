import { auth } from "./config";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { humans } from "@/db/schema";
import { redirect } from "next/navigation";

/**
 * Get the current server session
 */
export async function getServerSession() {
  return await auth();
}

/**
 * Get the current authenticated human
 * Returns the full human record or null if not authenticated
 */
export async function getCurrentHuman() {
  try {
    const session = await getServerSession();

    if (!session?.user?.humanId) {
      return null;
    }

    const human = await db.query.humans.findFirst({
      where: eq(humans.id, session.user.humanId),
    });

    return human || null;
  } catch (error) {
    console.error("Error fetching current human:", error);
    return null;
  }
}

/**
 * Get the current human with their agents
 */
export async function getCurrentHumanWithAgents() {
  try {
    const session = await getServerSession();

    if (!session?.user?.humanId) {
      return null;
    }

    const human = await db.query.humans.findFirst({
      where: eq(humans.id, session.user.humanId),
      with: {
        agents: true,
      },
    });

    return human || null;
  } catch (error) {
    console.error("Error fetching current human with agents:", error);
    return null;
  }
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}

/**
 * Require human - redirects to login if not authenticated or human not found
 */
export async function requireHuman() {
  const human = await getCurrentHuman();

  if (!human) {
    redirect("/login");
  }

  return human;
}
