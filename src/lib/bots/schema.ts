/**
 * Type + validation for bot briefs.
 *
 * No zod in the project — validators are hand-written and match the migration
 * at supabase/migrations/20260522_bot_briefs.sql.
 */

export type BriefType = 'comment_to_dm' | 'story_reply' | 'story_mention';
export type BriefStatus = 'draft' | 'submitted' | 'building' | 'live' | 'archived';
export type AssetKind = 'image' | 'pdf' | 'video' | 'other';
export type PostScope = 'specific_post' | 'all_posts_and_reels' | 'all_posts' | 'all_reels';

export const BRIEF_TYPES: BriefType[] = ['comment_to_dm', 'story_reply', 'story_mention'];
export const BRIEF_STATUSES: BriefStatus[] = ['draft', 'submitted', 'building', 'live', 'archived'];
export const POST_SCOPES: PostScope[] = [
  'specific_post',
  'all_posts_and_reels',
  'all_posts',
  'all_reels',
];

export const BRIEF_TYPE_LABEL: Record<BriefType, string> = {
  comment_to_dm: 'תגובה לפוסט → DM',
  story_reply: 'מענה לסטורי',
  story_mention: 'אזכור בסטורי',
};

export const BRIEF_STATUS_LABEL: Record<BriefStatus, string> = {
  draft: 'טיוטה',
  submitted: 'הוגש',
  building: 'בבנייה',
  live: 'פעיל',
  archived: 'בארכיון',
};

export const POST_SCOPE_LABEL: Record<PostScope, string> = {
  specific_post: 'פוסט/ריל ספציפי',
  all_posts_and_reels: 'כל הפוסטים והרילז\'ים',
  all_posts: 'כל הפוסטים (לא רילז\'ים)',
  all_reels: 'כל הרילז\'ים בלבד',
};

export type BotBriefRow = {
  id: string;
  created_by: string;
  title: string;
  type: BriefType;
  status: BriefStatus;
  post_scope: PostScope;
  post_url: string | null;
  keyword_triggers: string[];
  story_label: string | null;
  dm_message: string | null;
  cta_button_text: string | null;
  lead_magnet_url: string | null;
  followup_dm_message: string | null;
  followup_dm_delay_minutes: number;
  brevo_template_id: number | null;
  followup_delay_hours: number;
  followup_enabled: boolean;
  manychat_flow_id: string | null;
  manychat_tag: string | null;
  notes: string | null;
  created_at: string;
  submitted_at: string | null;
  live_at: string | null;
  archived_at: string | null;
  updated_at: string;
};

export type BriefAssetRow = {
  id: string;
  brief_id: string;
  kind: AssetKind;
  storage_path: string;
  filename: string;
  mime: string;
  size_bytes: number;
  uploaded_by: string | null;
  created_at: string;
};

export type BriefDraftInput = {
  title: string;
  type: BriefType;
  post_scope: PostScope;
  post_url: string | null;
  keyword_triggers: string[];
  story_label: string | null;
  dm_message: string | null;
  cta_button_text: string | null;
  lead_magnet_url: string | null;
  followup_dm_message: string | null;
  followup_dm_delay_minutes: number;
  brevo_template_id: number | null;
  followup_delay_hours: number;
  followup_enabled: boolean;
  notes: string | null;
};

/** Regex for Instagram post / reel URLs. Permissive — we only block obvious junk. */
const INSTAGRAM_URL_RE =
  /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|reels|tv)\/[A-Za-z0-9_-]+\/?(?:\?.*)?$/i;

export function isInstagramPostUrl(url: string): boolean {
  return INSTAGRAM_URL_RE.test(url.trim());
}

/** Validate input for SAVING a brief in DRAFT state. Lenient: any field can be empty. */
export function validateDraft(input: Partial<BriefDraftInput>): { ok: true } | { ok: false; error: string } {
  if (!input.title || !input.title.trim()) {
    return { ok: false, error: 'חובה לתת שם לבריף' };
  }
  if (input.title.length > 200) {
    return { ok: false, error: 'שם הבריף ארוך מדי (מקסימום 200 תווים)' };
  }
  if (!input.type || !BRIEF_TYPES.includes(input.type)) {
    return { ok: false, error: 'סוג בריף לא תקין' };
  }
  return { ok: true };
}

/** Validate input for SUBMITTING a brief. Strict: required fields per type. */
export function validateForSubmit(input: Partial<BriefDraftInput>): { ok: true } | { ok: false; error: string } {
  const draftCheck = validateDraft(input);
  if (!draftCheck.ok) return draftCheck;

  if (!input.dm_message || !input.dm_message.trim()) {
    return { ok: false, error: 'חובה לכתוב את הודעת ה-DM שתישלח' };
  }
  if (input.dm_message.length > 1000) {
    return { ok: false, error: 'הודעת ה-DM ארוכה מדי (מקסימום 1000 תווים)' };
  }
  if (input.cta_button_text && input.cta_button_text.length > 40) {
    return { ok: false, error: 'טקסט הכפתור ארוך מדי (מקסימום 40 תווים)' };
  }
  if (input.followup_dm_message && input.followup_dm_message.length > 1000) {
    return { ok: false, error: 'הודעת ה-follow-up ארוכה מדי (מקסימום 1000 תווים)' };
  }
  if (
    input.followup_dm_delay_minutes !== undefined &&
    (input.followup_dm_delay_minutes < 1 || input.followup_dm_delay_minutes > 10080)
  ) {
    return { ok: false, error: 'דיליי ה-follow-up DM חייב להיות בין דקה ל-7 ימים' };
  }

  if (input.type === 'comment_to_dm') {
    const scope = input.post_scope ?? 'specific_post';
    if (scope === 'specific_post') {
      if (!input.post_url) {
        return { ok: false, error: 'חובה להוסיף לינק לפוסט' };
      }
      if (!isInstagramPostUrl(input.post_url)) {
        return { ok: false, error: 'הלינק לא נראה כמו פוסט/ריל באינסטגרם' };
      }
    }
    if (!input.keyword_triggers || input.keyword_triggers.length === 0) {
      return { ok: false, error: 'חובה להגדיר לפחות מילת מפתח אחת' };
    }
  }

  if (input.type === 'story_reply' || input.type === 'story_mention') {
    if (!input.story_label || !input.story_label.trim()) {
      return { ok: false, error: 'חובה לתאר את הסטורי הרלוונטי' };
    }
  }

  if (input.followup_enabled) {
    if (!input.brevo_template_id || input.brevo_template_id <= 0) {
      return { ok: false, error: 'חובה לבחור טמפלייט אימייל ל-follow-up' };
    }
    if (!input.followup_delay_hours || input.followup_delay_hours < 1) {
      return { ok: false, error: 'דיליי ל-follow-up חייב להיות לפחות שעה' };
    }
  }

  return { ok: true };
}

/** Normalize a free-text keyword list (newlines, commas) into a clean array. */
export function parseKeywordList(raw: string): string[] {
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length <= 60);
}

/** Slug a brief title into a ManyChat-safe tag. */
export function deriveTag(title: string, briefId: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^\w֐-׿\s-]/g, '') // keep Hebrew + word chars
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  const idSuffix = briefId.replace(/-/g, '').slice(0, 6);
  return base ? `bot-${base}-${idSuffix}` : `bot-${idSuffix}`;
}
