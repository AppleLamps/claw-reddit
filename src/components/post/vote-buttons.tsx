"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

interface VoteButtonsProps {
  postId?: string;
  commentId?: string;
  upvotes: number;
  downvotes: number;
  userVote?: number | null;
  layout?: "vertical" | "horizontal";
  size?: "sm" | "md";
}

export function VoteButtons({
  postId,
  commentId,
  upvotes,
  downvotes,
  userVote = null,
  layout = "vertical",
  size = "md",
}: VoteButtonsProps) {
  const [vote, setVote] = useState<number | null>(userVote);
  const [score, setScore] = useState(upvotes - downvotes);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleVote = async (value: number) => {
    const newVote = vote === value ? null : value;
    const oldVote = vote;

    // Optimistic update
    setVote(newVote);
    setIsAnimating(true);

    // Calculate new score
    let scoreDiff = 0;
    if (oldVote === 1) scoreDiff -= 1;
    if (oldVote === -1) scoreDiff += 1;
    if (newVote === 1) scoreDiff += 1;
    if (newVote === -1) scoreDiff -= 1;
    setScore((s) => s + scoreDiff);

    setTimeout(() => setIsAnimating(false), 300);

    // API call would go here
  };

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const buttonPadding = size === "sm" ? "p-1" : "p-1.5";

  return (
    <div
      className={cn(
        "flex items-center",
        layout === "vertical" ? "flex-col gap-0.5" : "flex-row gap-1"
      )}
    >
      <button
        onClick={() => handleVote(1)}
        className={cn(
          buttonPadding,
          "rounded-lg transition-all duration-200",
          vote === 1
            ? "text-primary bg-primary/10"
            : "text-text-muted hover:text-primary hover:bg-white/[0.05]"
        )}
        aria-label="Upvote"
      >
        <ChevronUp
          className={cn(
            iconSize,
            "transition-transform",
            vote === 1 && "scale-110"
          )}
          strokeWidth={vote === 1 ? 3 : 2}
        />
      </button>

      <span
        className={cn(
          "font-semibold tabular-nums min-w-[2ch] text-center",
          size === "sm" ? "text-xs" : "text-sm",
          isAnimating && "animate-vote-bounce",
          vote === 1 && "text-primary",
          vote === -1 && "text-error",
          vote === null && "text-text-secondary"
        )}
      >
        {score}
      </span>

      <button
        onClick={() => handleVote(-1)}
        className={cn(
          buttonPadding,
          "rounded-lg transition-all duration-200",
          vote === -1
            ? "text-error bg-error/10"
            : "text-text-muted hover:text-error hover:bg-white/[0.05]"
        )}
        aria-label="Downvote"
      >
        <ChevronDown
          className={cn(
            iconSize,
            "transition-transform",
            vote === -1 && "scale-110"
          )}
          strokeWidth={vote === -1 ? 3 : 2}
        />
      </button>
    </div>
  );
}
