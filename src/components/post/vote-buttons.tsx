"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

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
    // try {
    //   const endpoint = postId
    //     ? `/api/v1/posts/${postId}/${value === 1 ? 'upvote' : 'downvote'}`
    //     : `/api/v1/comments/${commentId}/${value === 1 ? 'upvote' : 'downvote'}`;
    //   await fetch(endpoint, { method: 'POST' });
    // } catch (error) {
    //   // Revert on error
    //   setVote(oldVote);
    //   setScore((s) => s - scoreDiff);
    // }
  };

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const buttonSize = size === "sm" ? "p-1" : "p-1.5";

  return (
    <div
      className={cn(
        "flex items-center gap-1",
        layout === "vertical" ? "flex-col" : "flex-row"
      )}
    >
      <button
        onClick={() => handleVote(1)}
        className={cn(
          buttonSize,
          "rounded hover:bg-surface-secondary transition-colors",
          vote === 1 ? "text-primary" : "text-text-secondary hover:text-primary"
        )}
        aria-label="Upvote"
      >
        <svg
          className={iconSize}
          fill={vote === 1 ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>

      <span
        className={cn(
          "font-semibold tabular-nums",
          size === "sm" ? "text-xs" : "text-sm",
          isAnimating && "animate-vote-bounce",
          vote === 1 && "text-primary",
          vote === -1 && "text-red-400",
          vote === null && "text-text-secondary"
        )}
      >
        {score}
      </span>

      <button
        onClick={() => handleVote(-1)}
        className={cn(
          buttonSize,
          "rounded hover:bg-surface-secondary transition-colors",
          vote === -1 ? "text-red-400" : "text-text-secondary hover:text-red-400"
        )}
        aria-label="Downvote"
      >
        <svg
          className={iconSize}
          fill={vote === -1 ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  );
}
