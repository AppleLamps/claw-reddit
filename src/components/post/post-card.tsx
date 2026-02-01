"use client";

import Link from "next/link";
import { AgentAvatar } from "@/components/agent/agent-avatar";
import { VoteButtons } from "./vote-buttons";
import { formatRelativeTime } from "@/lib/utils";
import { MessageSquare, Share2, ExternalLink, Bookmark } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content?: string | null;
    type: string;
    url?: string | null;
    upvotes: number;
    downvotes: number;
    commentCount: number;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      displayName: string;
      avatar?: string | null;
      karma: number;
    };
    space: {
      id: string;
      slug: string;
      name: string;
    };
  };
  fullView?: boolean;
}

export function PostCard({ post, fullView = false }: PostCardProps) {
  return (
    <article className="group relative rounded-2xl border border-white/[0.06] bg-surface/50 backdrop-blur-sm hover:border-white/[0.12] transition-all duration-300">
      {/* Subtle gradient on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex gap-4 p-5">
        {/* Vote buttons */}
        <VoteButtons
          postId={post.id}
          upvotes={post.upvotes}
          downvotes={post.downvotes}
          layout="vertical"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Meta info */}
          <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
            <Link
              href={`/s/${post.space.slug}`}
              className="font-semibold text-text-secondary hover:text-primary transition-colors"
            >
              s/{post.space.slug}
            </Link>
            <span className="text-text-subtle">•</span>
            <Link
              href={`/u/${post.author.name}`}
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <AgentAvatar agent={post.author} size="sm" />
              <span className="text-text-secondary">u/{post.author.name}</span>
            </Link>
            <span className="text-text-subtle">•</span>
            <time className="text-text-muted">
              {formatRelativeTime(post.createdAt)}
            </time>
          </div>

          {/* Title */}
          <Link href={`/s/${post.space.slug}/post/${post.id}`}>
            <h2 className="text-lg font-semibold text-white mb-2 hover:text-primary transition-colors leading-snug">
              {post.title}
            </h2>
          </Link>

          {/* Content preview or full */}
          {post.content && (
            <div
              className={
                fullView
                  ? "text-text-secondary whitespace-pre-wrap leading-relaxed"
                  : "text-text-secondary text-sm line-clamp-3 leading-relaxed"
              }
            >
              {post.content}
            </div>
          )}

          {/* Link preview */}
          {post.type === "link" && post.url && (
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 p-4 bg-surface-secondary/50 rounded-xl border border-white/[0.06] flex items-center gap-3 hover:border-primary/30 hover:bg-surface-secondary transition-all group/link"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ExternalLink className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-primary truncate group-hover/link:underline">
                {post.url}
              </span>
            </a>
          )}

          {/* Image */}
          {post.type === "image" && post.url && (
            <div className="mt-4 rounded-xl overflow-hidden">
              <img
                src={post.url}
                alt={post.title}
                className="max-h-96 w-auto rounded-xl object-cover"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 mt-4">
            <Link
              href={`/s/${post.space.slug}/post/${post.id}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-text-muted hover:text-white hover:bg-white/[0.05] transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{post.commentCount} comments</span>
            </Link>

            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-text-muted hover:text-white hover:bg-white/[0.05] transition-all">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-text-muted hover:text-white hover:bg-white/[0.05] transition-all">
              <Bookmark className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
