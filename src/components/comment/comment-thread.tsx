"use client";

import { useState } from "react";
import { CommentItem } from "./comment-item";
import { CommentComposer } from "./comment-composer";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  parentId?: string | null;
  depth?: number;
  author: {
    id: string;
    name: string;
    displayName: string;
    avatar?: string | null;
    karma: number;
  };
}

interface CommentThreadProps {
  comments: Comment[];
  postId?: string;
  maxDepth?: number;
}

function buildCommentTree(comments: Comment[]): Comment[] {
  const commentMap = new Map<string, Comment & { children: Comment[] }>();
  const rootComments: (Comment & { children: Comment[] })[] = [];

  // First pass: create map with children array
  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, children: [], depth: 0 });
  });

  // Second pass: build tree
  comments.forEach((comment) => {
    const node = commentMap.get(comment.id)!;
    if (comment.parentId && commentMap.has(comment.parentId)) {
      const parent = commentMap.get(comment.parentId)!;
      node.depth = (parent.depth || 0) + 1;
      parent.children.push(node);
    } else {
      rootComments.push(node);
    }
  });

  return rootComments;
}

function CommentNode({
  comment,
  depth = 0,
  maxDepth = 5,
  onReply,
  replyingTo,
  postId,
}: {
  comment: Comment & { children?: Comment[] };
  depth?: number;
  maxDepth?: number;
  onReply: (commentId: string | null) => void;
  replyingTo: string | null;
  postId?: string;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const hasChildren = comment.children && comment.children.length > 0;

  return (
    <div className={cn(depth > 0 && "ml-4 pl-4 border-l-2 border-border")}>
      {/* Collapse toggle for threads */}
      {hasChildren && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-xs text-text-secondary hover:text-primary mb-2"
        >
          {isCollapsed ? "[+] Expand" : "[-] Collapse"}
        </button>
      )}

      {!isCollapsed && (
        <>
          <CommentItem
            comment={comment}
            onReply={depth < maxDepth ? () => onReply(comment.id) : undefined}
          />

          {/* Reply composer */}
          {replyingTo === comment.id && postId && (
            <div className="ml-8 mt-2">
              <CommentComposer
                postId={postId}
                parentId={comment.id}
                onCancel={() => onReply(null)}
              />
            </div>
          )}

          {/* Children */}
          {hasChildren && (
            <div className="mt-4 space-y-4">
              {(comment.children as (Comment & { children?: Comment[] })[]).map((child) => (
                <CommentNode
                  key={child.id}
                  comment={child}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                  onReply={onReply}
                  replyingTo={replyingTo}
                  postId={postId}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function CommentThread({ comments, postId, maxDepth = 5 }: CommentThreadProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const tree = buildCommentTree(comments);

  if (tree.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {tree.map((comment) => (
        <CommentNode
          key={comment.id}
          comment={comment as Comment & { children?: Comment[] }}
          maxDepth={maxDepth}
          onReply={setReplyingTo}
          replyingTo={replyingTo}
          postId={postId}
        />
      ))}
    </div>
  );
}
