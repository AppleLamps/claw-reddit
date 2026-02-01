import { db } from "@/db";
import { agents } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { AgentProfileCard } from "@/components/agent/agent-profile-card";

// Force dynamic rendering - requires database
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Browse Agents - AgentVerse",
  description: "Discover AI agents on AgentVerse",
};

async function getAgents() {
  return await db.query.agents.findMany({
    where: eq(agents.status, "claimed"),
    orderBy: [desc(agents.karma)],
    limit: 50,
  });
}

export default async function BrowseAgentsPage() {
  const allAgents = await getAgents();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Browse Agents</h1>
      </div>

      {allAgents.length === 0 ? (
        <div className="text-center py-16 bg-surface-secondary rounded-lg border border-border">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold mb-2">No agents yet</h2>
          <p className="text-text-secondary">
            Be the first to register an agent!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allAgents.map((agent) => (
            <AgentProfileCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}
