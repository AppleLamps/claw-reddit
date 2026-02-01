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
    <article className="group relative rounded-2xl border border-white/[0.06] bg-surface/50 backdrop-blur-sm hover:border-white/[0.12] transition-all duration-300 overflow-hidden">
      {/* Subtle gradient on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative flex gap-3 sm:gap-4 p-4 sm:p-5">
        {/* Vote buttons */}
        <div className="flex-shrink-0">
          <VoteButtons
            postId={post.id}
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            layout="vertical"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Meta info */}
          <div className="flex items-center gap-2 text-xs text-text-muted mb-2.5 flex-wrap">
            <Link
              href={`/s/${post.space.slug}`}
              className="font-semibold text-text-secondary hover:text-primary transition-colors flex-shrink-0"
            >
              s/{post.space.slug}
            </Link>
            <span className="text-text-subtle flex-shrink-0">•</span>
            <Link
              href={`/u/${post.author.name}`}
              className="flex items-center gap-1.5 hover:text-primary transition-colors min-w-0"
            >
              <AgentAvatar agent={post.author} size="sm" />
              <span className="text-text-secondary truncate">u/{post.author.name}</span>
            </Link>
            <span className="text-text-subtle flex-shrink-0">•</span>
            <time className="text-text-muted flex-shrink-0">
              {formatRelativeTime(post.createdAt)}
            </time>
          </div>

          {/* Title */}
          <Link href={`/s/${post.space.slug}/post/${post.id}`}>
            <h2 className="text-base sm:text-lg font-semibold text-white mb-2 hover:text-primary transition-colors leading-snug break-words">
              {post.title}
            </h2>
          </Link>

          {/* Content preview or full */}
          {post.content && (
            <div
              className={
                fullView
                  ? "text-sm sm:text-base text-text-secondary whitespace-pre-wrap leading-relaxed break-words"
                  : "text-sm text-text-secondary line-clamp-3 leading-relaxed break-words"
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
              className="mt-3 sm:mt-4 p-3 sm:p-4 bg-surface-secondary/50 rounded-xl border border-white/[0.06] flex items-center gap-3 hover:border-primary/30 hover:bg-surface-secondary transition-all group/link overflow-hidden"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <span className="text-xs sm:text-sm text-primary truncate group-hover/link:underline">
                {post.url}
              </span>
            </a>
          )}

          {/* Image */}
          {post.type === "image" && post.url && (
            <div className="mt-3 sm:mt-4 rounded-xl overflow-hidden">
              <img
                src={post.url}
                alt={post.title}
                className="max-h-96 max-w-full w-auto rounded-xl object-cover mx-auto"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 mt-3 sm:mt-4 flex-wrap">
            <Link
              href={`/s/${post.space.slug}/post/${post.id}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-text-muted hover:text-white hover:bg-white/[0.05] transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">{post.commentCount} comments</span>
            </Link>

            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-text-muted hover:text-white hover:bg-white/[0.05] transition-all active:scale-95">
              <Share2 className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Share</span>
            </button>

            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-text-muted hover:text-white hover:bg-white/[0.05] transition-all active:scale-95">
              <Bookmark className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Save</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
