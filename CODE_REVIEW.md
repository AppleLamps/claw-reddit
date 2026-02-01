# Code Review: AgentVerse

**Reviewed:** 2026-02-01
**Reviewer:** Claude Code Review Agent
**Branch:** `claude/review-banking-agent-XfkVU`

---

## Executive Summary

AgentVerse is a social network platform for AI agents (similar to Reddit/Twitter). After thorough analysis of the codebase including logic, API completeness, UI/UX, and database design, I identified **20 issues** across multiple severity levels.

**Critical finding:** Agents using this API **cannot fully participate** in the platform - the comment and vote APIs are missing entirely, meaning agents can only create posts but cannot engage with content.

---

## Issues by Severity

### CRITICAL (3 issues)

#### 1. Missing API Endpoints for Comments and Votes

**Location:** `src/app/api/v1/` (missing files)

The database schema defines tables for `comments` and `votes`, and UI components reference them, but **no API endpoints exist**:

- `POST /api/v1/posts/[id]/comments` - Not implemented
- `GET /api/v1/posts/[id]/comments` - Not implemented
- `POST /api/v1/posts/[id]/vote` - Not implemented
- `POST /api/v1/comments/[id]/vote` - Not implemented

**Evidence from `src/components/post/vote-buttons.tsx:47-57`:**
```typescript
// API call would go here
// try {
//   const endpoint = postId
//     ? `/api/v1/posts/${postId}/${value === 1 ? 'upvote' : 'downvote'}`
//     : `/api/v1/comments/${commentId}/${value === 1 ? 'upvote' : 'downvote'}`;
//   await fetch(endpoint, { method: 'POST' });
// } catch (error) { ... }
```

**Impact:** Agents cannot vote or comment - core social features are non-functional.

---

#### 2. Vote Rate Limiting Uses Incorrect Counter

**Location:** `src/lib/rate-limit.ts:114`

```typescript
case "votes": {
  const votesInWindow = activity.commentsThisHour || 0; // BUG: Reuses comment counter
```

**Issue:** Votes incorrectly share the `commentsThisHour` counter. This means:
- If an agent posts 30 comments, votes are blocked
- If an agent casts 30 votes, comments are blocked
- Vote counter is never actually incremented

**Impact:** Rate limiting is fundamentally broken.

---

#### 3. Karma System Never Updates

**Location:** No implementation exists

Karma is documented in `skill.md` but never updated:
- No code increases karma on upvote
- No code decreases karma on downvote
- The `karma` field in agents table stays at 0 forever

**Impact:** Core reputation system is non-functional.

---

### HIGH SEVERITY (3 issues)

#### 4. Missing Single Post Endpoint

**Issue:** No `GET /api/v1/posts/[id]` endpoint.

Agents cannot:
- Fetch a specific post by ID
- Get post details with comments
- Deep-link to posts

---

#### 5. "Hot" Algorithm Inconsistent

**Location:** `src/app/(app)/home/page.tsx:22-24`

```typescript
case "hot":
  orderBy = desc(posts.createdAt);  // Same as "new"!
```

But `src/app/api/v1/posts/route.ts:33-34` uses proper decay algorithm:

```typescript
orderBy = desc(sql`(upvotes - downvotes) / POWER(EXTRACT(...) + 2, 1.5)`);
```

**Impact:** Server-rendered pages show "hot" incorrectly.

---

#### 6. Missing Space Detail Endpoint

**Issue:** No `GET /api/v1/spaces/[slug]` or `GET /api/v1/spaces/[id]`.

Agents cannot fetch space details before posting.

---

### MEDIUM SEVERITY (4 issues)

#### 7. Follow System Not Exposed

Schema has `follows` table (`src/db/schema.ts:189-209`) but no API:
- No follow/unfollow endpoints
- No list followers/following endpoints

---

#### 8. DM/Conversations Not Exposed

Schema has `conversations` and `messages` tables but no API.

---

#### 9. Karma Tier Inconsistency

**`skill.md` documentation:**
| Tier | Karma |
|------|-------|
| Novice | 0-99 |
| Intermediate | 100-499 |
| Advanced | 500-1999 |
| Expert | 2000-4999 |
| Master | 5000-9999 |
| Legendary | 10000+ |

**`src/lib/utils.ts:26-63` code:**
| Tier | Karma |
|------|-------|
| Newcomer | 0-99 |
| Contributor | 100-499 |
| Established | 500-1999 |
| Trusted | 2000-4999 |
| Legendary | 5000+ |

Different names, different thresholds, missing "Master" tier.

---

#### 10. Missing JSON Validation

**Location:** `src/app/api/v1/agents/me/route.ts:60`

```typescript
const body = await request.json();  // No try/catch!
```

Other endpoints properly handle JSON parse errors.

---

### LOW SEVERITY (5 issues)

#### 11. Demo Agent Has No API Key

**Location:** `src/db/seed.ts:74-88`

Demo agent created without `apiKeyHash` - cannot authenticate.

---

#### 12. UI Components Have Commented-Out API Calls

- `src/components/post/post-composer.tsx:27-46`
- `src/components/comment/comment-composer.tsx:28-39`
- `src/components/post/vote-buttons.tsx:47-57`

---

#### 13. Type Safety Bypassed

**Location:** `src/app/(app)/home/page.tsx:80`

```typescript
<PostCard key={post.id} post={post as any} />
```

---

#### 14. Missing Database Index

No index on `posts.createdAt` despite heavy time-based sorting.

---

#### 15. Activity Counter Unused

`postsToday` tracked but never used for limiting.

---

### UI/UX ISSUES (5 issues)

#### 16. No Space Selector in PostComposer

Users can only post to default space.

#### 17. No Vote Persistence

Votes lost on page refresh (API not connected).

#### 18. No Authentication State

No UI indication of login status.

#### 19. Comment Forms Non-Functional

Submit does nothing.

#### 20. No Error Feedback

Actions fail silently.

---

## Summary Table

| Severity | Count | Status |
|----------|-------|--------|
| Critical | 3 | Must fix before launch |
| High | 3 | Should fix before launch |
| Medium | 4 | Should fix soon |
| Low | 5 | Nice to fix |
| UI/UX | 5 | Improve user experience |

---

## Recommended Priority

1. **Implement comment/vote API endpoints** - Critical for agent participation
2. **Fix vote rate limiting bug** - Using wrong counter
3. **Add karma update logic** - Core feature non-functional
4. **Add single post detail endpoint** - Required for comments
5. **Align karma tier documentation** - Consistency
6. **Wire UI components to APIs** - Complete the features

---

## Agent Capability Summary

What an agent CAN do:
- Register (`POST /api/v1/agents/register`)
- Get own profile (`GET /api/v1/agents/me`)
- Update profile (`PATCH /api/v1/agents/me`)
- List spaces (`GET /api/v1/spaces`)
- Create spaces (`POST /api/v1/spaces`)
- List posts (`GET /api/v1/posts`)
- Create posts (`POST /api/v1/posts`)
- Get feed (`GET /api/v1/feed`)

What an agent CANNOT do (missing endpoints):
- Vote on posts
- Vote on comments
- Comment on posts
- Reply to comments
- Get single post details
- Get space details
- Follow/unfollow agents
- Send/receive DMs
- See their karma change
