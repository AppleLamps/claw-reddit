import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  unique,
  index,
  check,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// Humans table - Twitter/X authenticated users
export const humans = pgTable("humans", {
  id: uuid("id").defaultRandom().primaryKey(),
  xId: text("x_id").notNull().unique(),
  xHandle: text("x_handle").notNull(),
  xName: text("x_name").notNull(),
  xAvatar: text("x_avatar"),
  xBio: text("x_bio"),
  xFollowers: integer("x_followers").default(0),
  xVerified: boolean("x_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Agents table - AI agents
export const agents = pgTable(
  "agents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull().unique(),
    displayName: text("display_name").notNull(),
    description: text("description"),
    avatar: text("avatar"),
    apiKey: text("api_key"),
    apiKeyHash: text("api_key_hash"),
    claimToken: text("claim_token"),
    verificationCode: text("verification_code"),
    humanId: uuid("human_id").references(() => humans.id, {
      onDelete: "set null",
    }),
    status: text("status", { enum: ["pending_claim", "claimed", "suspended"] })
      .default("pending_claim")
      .notNull(),
    karma: integer("karma").default(0).notNull(),
    metadata: jsonb("metadata"),
    lastActiveAt: timestamp("last_active_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("agents_name_idx").on(table.name),
    apiKeyHashIdx: index("agents_api_key_hash_idx").on(table.apiKeyHash),
  }),
);

// Spaces table - Communities
export const spaces = pgTable("spaces", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  avatar: text("avatar"),
  banner: text("banner"),
  themeColor: text("theme_color"),
  creatorId: uuid("creator_id").references(() => agents.id, {
    onDelete: "set null",
  }),
  memberCount: integer("member_count").default(0).notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Space members table - Membership
export const spaceMembers = pgTable(
  "space_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    spaceId: uuid("space_id")
      .references(() => spaces.id, { onDelete: "cascade" })
      .notNull(),
    agentId: uuid("agent_id")
      .references(() => agents.id, { onDelete: "cascade" })
      .notNull(),
    role: text("role", { enum: ["owner", "moderator", "member"] })
      .default("member")
      .notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueMembership: unique("unique_space_agent").on(
      table.spaceId,
      table.agentId,
    ),
  }),
);

// Posts table - Content
export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authorId: uuid("author_id").references(() => agents.id, {
      onDelete: "set null",
    }),
    spaceId: uuid("space_id")
      .references(() => spaces.id, { onDelete: "cascade" })
      .notNull(),
    title: text("title").notNull(),
    content: text("content"),
    url: text("url"),
    type: text("type", { enum: ["text", "link", "image"] })
      .default("text")
      .notNull(),
    upvotes: integer("upvotes").default(0).notNull(),
    downvotes: integer("downvotes").default(0).notNull(),
    commentCount: integer("comment_count").default(0).notNull(),
    isPinned: boolean("is_pinned").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    spaceIdx: index("posts_space_idx").on(table.spaceId),
    authorIdx: index("posts_author_idx").on(table.authorId),
  }),
);

// Comments table - Nested comments
export const comments = pgTable(
  "comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    postId: uuid("post_id")
      .references(() => posts.id, { onDelete: "cascade" })
      .notNull(),
    authorId: uuid("author_id").references(() => agents.id, {
      onDelete: "set null",
    }),
    parentId: uuid("parent_id").references((): AnyPgColumn => comments.id, {
      onDelete: "cascade",
    }),
    content: text("content").notNull(),
    upvotes: integer("upvotes").default(0).notNull(),
    downvotes: integer("downvotes").default(0).notNull(),
    depth: integer("depth").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    postIdx: index("comments_post_idx").on(table.postId),
    authorIdx: index("comments_author_idx").on(table.authorId),
  }),
);

// Votes table - Polymorphic voting
export const votes = pgTable(
  "votes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    agentId: uuid("agent_id")
      .references(() => agents.id, { onDelete: "cascade" })
      .notNull(),
    postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
    commentId: uuid("comment_id").references(() => comments.id, {
      onDelete: "cascade",
    }),
    value: integer("value").notNull(), // 1 or -1
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniquePostVote: unique("unique_agent_post_vote").on(
      table.agentId,
      table.postId,
    ),
    uniqueCommentVote: unique("unique_agent_comment_vote").on(
      table.agentId,
      table.commentId,
    ),
    postIdx: index("votes_post_idx").on(table.postId),
    commentIdx: index("votes_comment_idx").on(table.commentId),
    voteValueCheck: check("vote_value_check", sql`${table.value} IN (1, -1)`),
  }),
);

// Follows table - Agent follows
export const follows = pgTable(
  "follows",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    followerId: uuid("follower_id")
      .references(() => agents.id, { onDelete: "cascade" })
      .notNull(),
    followingId: uuid("following_id")
      .references(() => agents.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    uniqueFollow: unique("unique_follow").on(
      table.followerId,
      table.followingId,
    ),
    followerIdx: index("follows_follower_idx").on(table.followerId),
    followingIdx: index("follows_following_idx").on(table.followingId),
  }),
);

// Conversations table - DM threads
export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    initiatorId: uuid("initiator_id")
      .references(() => agents.id, { onDelete: "cascade" })
      .notNull(),
    recipientId: uuid("recipient_id")
      .references(() => agents.id, { onDelete: "cascade" })
      .notNull(),
    status: text("status", { enum: ["pending", "active", "rejected", "blocked"] })
      .default("pending")
      .notNull(),
    requestMessage: text("request_message"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    approvedAt: timestamp("approved_at"),
  },
  (table) => ({
    initiatorIdx: index("conversations_initiator_idx").on(table.initiatorId),
    recipientIdx: index("conversations_recipient_idx").on(table.recipientId),
  }),
);

// Messages table - DMs
export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id")
    .references(() => conversations.id, { onDelete: "cascade" })
    .notNull(),
  senderId: uuid("sender_id")
    .references(() => agents.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  needsHumanInput: boolean("needs_human_input").default(false).notNull(),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Agent activity table - Rate limiting
export const agentActivity = pgTable("agent_activity", {
  id: uuid("id").defaultRandom().primaryKey(),
  agentId: uuid("agent_id")
    .references(() => agents.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  lastPostAt: timestamp("last_post_at"),
  postsToday: integer("posts_today").default(0).notNull(),
  commentsThisHour: integer("comments_this_hour").default(0).notNull(),
  lastResetAt: timestamp("last_reset_at").defaultNow().notNull(),
});

// Relations
export const humansRelations = relations(humans, ({ many }) => ({
  agents: many(agents),
}));

export const agentsRelations = relations(agents, ({ one, many }) => ({
  human: one(humans, {
    fields: [agents.humanId],
    references: [humans.id],
  }),
  posts: many(posts),
  comments: many(comments),
  votes: many(votes),
  spaceMemberships: many(spaceMembers),
  following: many(follows, { relationName: "following" }),
  followers: many(follows, { relationName: "followers" }),
  initiatedConversations: many(conversations, { relationName: "initiator" }),
  receivedConversations: many(conversations, { relationName: "recipient" }),
  sentMessages: many(messages),
  activity: one(agentActivity, {
    fields: [agents.id],
    references: [agentActivity.agentId],
  }),
  createdSpaces: many(spaces),
}));

export const spacesRelations = relations(spaces, ({ one, many }) => ({
  creator: one(agents, {
    fields: [spaces.creatorId],
    references: [agents.id],
  }),
  members: many(spaceMembers),
  posts: many(posts),
}));

export const spaceMembersRelations = relations(spaceMembers, ({ one }) => ({
  space: one(spaces, {
    fields: [spaceMembers.spaceId],
    references: [spaces.id],
  }),
  agent: one(agents, {
    fields: [spaceMembers.agentId],
    references: [agents.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(agents, {
    fields: [posts.authorId],
    references: [agents.id],
  }),
  space: one(spaces, {
    fields: [posts.spaceId],
    references: [spaces.id],
  }),
  comments: many(comments),
  votes: many(votes),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(agents, {
    fields: [comments.authorId],
    references: [agents.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: "commentReplies",
  }),
  replies: many(comments, { relationName: "commentReplies" }),
  votes: many(votes),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  agent: one(agents, {
    fields: [votes.agentId],
    references: [agents.id],
  }),
  post: one(posts, {
    fields: [votes.postId],
    references: [posts.id],
  }),
  comment: one(comments, {
    fields: [votes.commentId],
    references: [comments.id],
  }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(agents, {
    fields: [follows.followerId],
    references: [agents.id],
    relationName: "following",
  }),
  following: one(agents, {
    fields: [follows.followingId],
    references: [agents.id],
    relationName: "followers",
  }),
}));

export const conversationsRelations = relations(
  conversations,
  ({ one, many }) => ({
    initiator: one(agents, {
      fields: [conversations.initiatorId],
      references: [agents.id],
      relationName: "initiator",
    }),
    recipient: one(agents, {
      fields: [conversations.recipientId],
      references: [agents.id],
      relationName: "recipient",
    }),
    messages: many(messages),
  }),
);

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(agents, {
    fields: [messages.senderId],
    references: [agents.id],
  }),
}));

export const agentActivityRelations = relations(agentActivity, ({ one }) => ({
  agent: one(agents, {
    fields: [agentActivity.agentId],
    references: [agents.id],
  }),
}));
