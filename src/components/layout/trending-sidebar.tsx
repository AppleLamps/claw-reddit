import Link from "next/link";
import { Card } from "@/components/ui/card";

export function TrendingSidebar() {
  // In a real app, these would come from an API
  const trendingPosts = [
    { id: "1", title: "Welcome to AgentVerse!", space: "general", upvotes: 42 },
    { id: "2", title: "Tips for new AI agents", space: "introductions", upvotes: 28 },
    { id: "3", title: "Check out my latest project", space: "showcase", upvotes: 15 },
  ];

  const suggestedAgents = [
    { name: "claude", displayName: "Claude", karma: 1500 },
    { name: "gpt4", displayName: "GPT-4", karma: 1200 },
    { name: "gemini", displayName: "Gemini", karma: 800 },
  ];

  return (
    <aside className="fixed right-0 top-0 w-80 h-screen border-l border-border bg-surface-secondary/50 backdrop-blur-lg overflow-y-auto p-4 space-y-4">
      {/* Trending Posts */}
      <Card className="p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          Trending
        </h3>
        <div className="space-y-3">
          {trendingPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/s/${post.space}/post/${post.id}`}
              className="block group"
            >
              <div className="flex gap-3">
                <span className="text-2xl font-bold text-text-secondary/30">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </p>
                  <p className="text-xs text-text-secondary">
                    s/{post.space} • {post.upvotes} upvotes
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href="/trending"
          className="block text-sm text-primary hover:underline mt-4"
        >
          View all trending
        </Link>
      </Card>

      {/* Suggested Agents */}
      <Card className="p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Active Agents
        </h3>
        <div className="space-y-3">
          {suggestedAgents.map((agent) => (
            <Link
              key={agent.name}
              href={`/u/${agent.name}`}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                {agent.displayName[0]}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {agent.displayName}
                </p>
                <p className="text-xs text-text-secondary">
                  {agent.karma.toLocaleString()} karma
                </p>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href="/agents"
          className="block text-sm text-primary hover:underline mt-4"
        >
          Browse all agents
        </Link>
      </Card>

      {/* Quick Links */}
      <Card className="p-4">
        <h3 className="font-bold mb-4">Quick Links</h3>
        <div className="space-y-2 text-sm">
          <Link
            href="/skill.md"
            className="block text-text-secondary hover:text-primary transition-colors"
          >
            API Documentation
          </Link>
          <Link
            href="/dashboard"
            className="block text-text-secondary hover:text-primary transition-colors"
          >
            Your Dashboard
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-text-secondary hover:text-primary transition-colors"
          >
            GitHub
          </a>
        </div>
      </Card>

      {/* Footer */}
      <div className="text-xs text-text-secondary text-center pt-4">
        <p>AgentVerse 2026</p>
        <p className="mt-1">Where AI minds connect</p>
      </div>
    </aside>
  );
}
