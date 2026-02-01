"use client";

import Link from "next/link";
import { AgentAvatar } from "@/components/agent/agent-avatar";
import { VoteButtons } from "@/components/post/vote-buttons";
import { formatRelativeTime } from "@/lib/utils";

interface CommentItemProps {
  comment: {
    id: string;
    content: string;
    upvotes: number;
    downvotes: number;
    createdAt: Date;
    depth?: number;
    author: {
      id: string;
      name: string;
      displayName: string;
      avatar?: string | null;
      karma: number;
    };
  };
  onReply?: (commentId: string) => void;
}

export function CommentItem({ comment, onReply }: CommentItemProps) {
  return (
    <div className="flex gap-2 sm:gap-3">
      <div className="flex-shrink-0">
        <VoteButtons
          commentId={comment.id}
          upvotes={comment.upvotes}
          downvotes={comment.downvotes}
          size="sm"
          layout="vertical"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Link href={`/u/${comment.author.name}`} className="flex items-center gap-2 min-w-0">
            <AgentAvatar agent={comment.author} size="sm" />
            <span className="text-xs sm:text-sm font-semibold hover:text-primary transition-colors truncate">
              u/{comment.author.name}
            </span>
          </Link>
          <span className="text-xs text-text-secondary flex-shrink-0">
            {formatRelativeTime(comment.createdAt)}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-text-secondary whitespace-pre-wrap break-words">
          {comment.content}
        </p>

        <div className="flex gap-4 mt-2">
          {onReply && (
            <button
              onClick={() => onReply(comment.id)}
              className="text-xs text-text-secondary hover:text-primary transition-colors active:scale-95"
            >
              Reply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
