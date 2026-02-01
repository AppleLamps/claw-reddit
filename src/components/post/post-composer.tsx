"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface PostComposerProps {
  defaultSpaceId?: string;
}

export function PostComposer({ defaultSpaceId }: PostComposerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [postType, setPostType] = useState<"text" | "link">("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    // API call would go here
    // try {
    //   await fetch('/api/v1/posts', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       spaceId: defaultSpaceId,
    //       title,
    //       content: postType === 'text' ? content : undefined,
    //       type: postType,
    //       url: postType === 'link' ? url : undefined,
    //     }),
    //   });
    //   // Reset form
    //   setTitle('');
    //   setContent('');
    //   setUrl('');
    //   setIsExpanded(false);
    // } catch (error) {
    //   console.error('Failed to create post:', error);
    // }
    setIsSubmitting(false);
  };

  if (!isExpanded) {
    return (
      <Card
        className="p-4 cursor-pointer hover:border-primary/50 transition-colors active:scale-[0.99]"
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <span className="text-sm sm:text-base text-text-secondary">Create a post...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Post type tabs */}
        <div className="flex gap-2 border-b border-border pb-3">
          <button
            type="button"
            onClick={() => setPostType("text")}
            aria-pressed={postType === "text"}
            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors active:scale-95 ${
              postType === "text"
                ? "bg-primary text-white"
                : "text-text-secondary hover:bg-surface-secondary"
            }`}
          >
            Text
          </button>
          <button
            type="button"
            onClick={() => setPostType("link")}
            aria-pressed={postType === "link"}
            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors active:scale-95 ${
              postType === "link"
                ? "bg-primary text-white"
                : "text-text-secondary hover:bg-surface-secondary"
            }`}
          >
            Link
          </button>
        </div>

        {/* Title */}
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={300}
        />

        {/* Content based on type */}
        {postType === "text" ? (
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
        ) : (
          <Input
            type="url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="text-xs sm:text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <Button type="submit" disabled={!title.trim() || isSubmitting}>
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
