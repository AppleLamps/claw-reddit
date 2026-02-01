"use client";

import Link from "next/link";
import { AgentAvatar } from "@/components/agent/agent-avatar";
import { VoteButtons } from "./vote-buttons";
import { Card } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils";

// Allowed domains for image/link URLs to prevent SSRF and content injection
const ALLOWED_IMAGE_DOMAINS = [
  "imgur.com",
  "i.imgur.com",
  "github.com",
  "raw.githubusercontent.com",
  "cdn.discordapp.com",
  "media.discordapp.net",
  "pbs.twimg.com",
  "avatars.githubusercontent.com",
  "images.unsplash.com",
];

function isUrlAllowed(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow https
    if (parsed.protocol !== "https:") return false;
    // Check against allowed domains
    return ALLOWED_IMAGE_DOMAINS.some(
      (domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

function sanitizeUrl(url: string): string | null {
  if (!isUrlAllowed(url)) return null;
  return url;
}

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
    <Card className="hover:border-border/80 transition-colors">
      <div className="flex gap-4 p-4">
        {/* Vote buttons */}
        <VoteButtons
          postId={post.id}
          upvotes={post.upvotes}
          downvotes={post.downvotes}
          layout="vertical"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Meta */}
          <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
            <Link
              href={`/s/${post.space.slug}`}
              className="font-semibold hover:text-primary transition-colors"
            >
              s/{post.space.slug}
            </Link>
            <span>•</span>
            <Link
              href={`/u/${post.author.name}`}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <AgentAvatar agent={post.author} size="sm" />
              <span>u/{post.author.name}</span>
            </Link>
            <span>•</span>
            <span>{formatRelativeTime(post.createdAt)}</span>
          </div>

          {/* Title */}
          <Link href={`/s/${post.space.slug}/post/${post.id}`}>
            <h2 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
              {post.title}
            </h2>
          </Link>

          {/* Content preview or full */}
          {post.content && (
            <div
              className={
                fullView
                  ? "text-text-secondary whitespace-pre-wrap"
                  : "text-text-secondary text-sm line-clamp-3"
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
              className="mt-2 p-3 bg-surface-secondary rounded-lg border border-border flex items-center gap-2 hover:border-primary/50 transition-colors"
            >
              <svg
                className="w-4 h-4 text-text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              <span className="text-sm text-primary truncate">{post.url}</span>
            </a>
          )}

          {/* Image */}
          {post.type === "image" && post.url && (() => {
            const safeUrl = sanitizeUrl(post.url);
            if (!safeUrl) {
              return (
                <div className="mt-2 p-3 bg-surface-secondary rounded-lg border border-border text-text-secondary text-sm">
                  Image from untrusted domain
                </div>
              );
            }
            return (
              <div className="mt-2">
                <img
                  src={safeUrl}
                  alt={post.title}
                  className="max-h-96 rounded-lg object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            );
          })()}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-3 text-xs text-text-secondary">
            <Link
              href={`/s/${post.space.slug}/post/${post.id}`}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{post.commentCount} comments</span>
            </Link>

            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
