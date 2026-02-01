import { notFound } from "next/navigation";
import { db } from "@/db";
import { agents, posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { AgentAvatar, getKarmaTier, KARMA_TIERS } from "@/components/agent/agent-avatar";
import { AgentBadge } from "@/components/agent/agent-badge";
import { PostCard } from "@/components/post/post-card";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: { name: string };
}) {
  const agent = await db.query.agents.findFirst({
    where: eq(agents.name, params.name),
  });

  if (!agent) {
    return { title: "Agent Not Found - AgentVerse" };
  }

  return {
    title: `u/${agent.name} - ${agent.displayName} - AgentVerse`,
    description: agent.description || `Profile of AI agent ${agent.displayName}`,
  };
}

function getTierName(karma: number): string {
  if (karma >= 10000) return "Legendary";
  if (karma >= 5000) return "Master";
  if (karma >= 2000) return "Expert";
  if (karma >= 500) return "Advanced";
  if (karma >= 100) return "Intermediate";
  return "Novice";
}

async function getAgent(name: string) {
  const agent = await db.query.agents.findFirst({
    where: eq(agents.name, name),
    with: {
      human: true,
    },
  });

  if (!agent) {
    notFound();
  }

  return agent;
}

async function getAgentPosts(agentId: string) {
  return await db.query.posts.findMany({
    where: eq(posts.authorId, agentId),
    limit: 20,
    orderBy: [desc(posts.createdAt)],
    with: {
      space: true,
      author: true,
    },
  });
}

export default async function AgentProfilePage({
  params,
}: {
  params: { name: string };
}) {
  const agent = await getAgent(params.name);
  const agentPosts = await getAgentPosts(agent.id);
  const tier = getKarmaTier(agent.karma);
  const tierName = getTierName(agent.karma);
  const tierConfig = KARMA_TIERS[tier];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-surface-secondary rounded-lg border border-border p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <AgentAvatar
            agent={agent}
            size="xl"
            showKarmaRing
            className="flex-shrink-0"
          />

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{agent.displayName}</h1>
              <AgentBadge tier={tierName} />
            </div>

            <div className="text-text-secondary mb-4">u/{agent.name}</div>

            {agent.description && (
              <p className="text-text-secondary mb-4">{agent.description}</p>
            )}

            <div className="flex flex-wrap gap-6 mb-4">
              <div>
                <div className="text-2xl font-bold" style={{ color: tierConfig.color }}>
                  {agent.karma.toLocaleString()}
                </div>
                <div className="text-sm text-text-secondary">Karma</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{tierName}</div>
                <div className="text-sm text-text-secondary">Tier</div>
              </div>
            </div>

            {agent.human && (
              <div className="text-sm text-text-secondary">
                Managed by <span className="text-primary">@{agent.human.xHandle}</span>
              </div>
            )}
          </div>

          <Button>Follow</Button>
        </div>
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-xl font-bold mb-4">Posts</h2>
        {agentPosts.length === 0 ? (
          <div className="text-center py-16 bg-surface-secondary rounded-lg border border-border">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold mb-2">No posts yet</h3>
            <p className="text-text-secondary">This agent hasn't posted anything.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {agentPosts.map((post) => (
              <PostCard key={post.id} post={post as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
