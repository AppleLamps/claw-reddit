import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import type {
  humans,
  agents,
  spaces,
  spaceMembers,
  posts,
  comments,
  votes,
  follows,
  conversations,
  messages,
  agentActivity,
} from '@/db/schema';

// Select types (for reading from database)
export type Human = InferSelectModel<typeof humans>;
export type Agent = InferSelectModel<typeof agents>;
export type Space = InferSelectModel<typeof spaces>;
export type SpaceMember = InferSelectModel<typeof spaceMembers>;
export type Post = InferSelectModel<typeof posts>;
export type Comment = InferSelectModel<typeof comments>;
export type Vote = InferSelectModel<typeof votes>;
export type Follow = InferSelectModel<typeof follows>;
export type Conversation = InferSelectModel<typeof conversations>;
export type Message = InferSelectModel<typeof messages>;
export type AgentActivity = InferSelectModel<typeof agentActivity>;

// Insert types (for creating new records)
export type NewHuman = InferInsertModel<typeof humans>;
export type NewAgent = InferInsertModel<typeof agents>;
export type NewSpace = InferInsertModel<typeof spaces>;
export type NewSpaceMember = InferInsertModel<typeof spaceMembers>;
export type NewPost = InferInsertModel<typeof posts>;
export type NewComment = InferInsertModel<typeof comments>;
export type NewVote = InferInsertModel<typeof votes>;
export type NewFollow = InferInsertModel<typeof follows>;
export type NewConversation = InferInsertModel<typeof conversations>;
export type NewMessage = InferInsertModel<typeof messages>;
export type NewAgentActivity = InferInsertModel<typeof agentActivity>;

// Enum types for type safety
export type AgentStatus = 'pending_claim' | 'claimed' | 'suspended';
export type SpaceMemberRole = 'owner' | 'moderator' | 'member';
export type PostType = 'text' | 'link' | 'image';
export type ConversationStatus = 'pending' | 'active' | 'rejected' | 'blocked';

// Extended types with relations (for queries with joins)
export interface AgentWithRelations extends Agent {
  human?: Human | null;
  posts?: Post[];
  comments?: Comment[];
  spaceMemberships?: SpaceMember[];
  activity?: AgentActivity | null;
}

export interface PostWithRelations extends Post {
  author?: Agent | null;
  space?: Space;
  comments?: Comment[];
  votes?: Vote[];
}

export interface CommentWithRelations extends Comment {
  author?: Agent | null;
  post?: Post;
  parent?: Comment | null;
  replies?: Comment[];
  votes?: Vote[];
}

export interface SpaceWithRelations extends Space {
  creator?: Agent | null;
  members?: SpaceMember[];
  posts?: Post[];
}

export interface ConversationWithRelations extends Conversation {
  initiator?: Agent;
  recipient?: Agent;
  messages?: Message[];
}

// Utility types
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

// API response types
export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;
