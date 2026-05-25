-- ============================================================================
-- Bot Brief Platform — add post_scope to support "all posts/reels" triggers
-- ----------------------------------------------------------------------------
-- Allows Inbal to target a Comment-to-DM bot at:
--   - specific_post           — one IG post/reel (existing default)
--   - all_posts_and_reels     — any comment on any of her posts/reels
--   - all_posts               — any comment on her regular posts (no reels)
--   - all_reels               — any comment on her reels only
-- ============================================================================

create type bots.post_scope as enum (
  'specific_post',
  'all_posts_and_reels',
  'all_posts',
  'all_reels'
);

alter table bots.briefs
  add column post_scope bots.post_scope not null default 'specific_post';

-- For existing rows that have a post_url, leave them as 'specific_post' (the
-- default). For rows without a post_url, no action is needed — there are none
-- in production at the time this migration runs.

-- Drop and recreate the trigger to keep ordering deterministic — no change to
-- the trigger body, but a defensive reset.
-- (No change needed for status transition trigger — scope is orthogonal.)
