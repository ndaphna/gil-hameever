/**
 * Newsletter Dashboard — TypeScript types mirroring `newsletter` schema.
 * Keep in sync with `supabase/migrations/20260514_newsletter_dashboard_phase1.sql`.
 */

export type AppRole = 'admin' | 'campaign_manager' | 'content_creator';

export type DraftStatus = 'draft' | 'published' | 'archived';

export type ProgressState =
  | 'active'
  | 'paused'
  | 'completed'
  | 'unsubscribed'
  | 'bounced';

export type BroadcastStatus =
  | 'draft'
  | 'scheduled'
  | 'sending'
  | 'sent'
  | 'failed'
  | 'cancelled';

export type CorpusSource =
  | 'book'
  | 'website'
  | 'instagram'
  | 'newsletter'
  | 'manual';

export type TopicCandidateStatus =
  | 'pending'
  | 'selected'
  | 'rejected'
  | 'used'
  | 'expired';

export type ArticleStatus =
  | 'topic_pending'
  | 'topic_selected'
  | 'generating'
  | 'compliance_review'
  | 'awaiting_approval'
  | 'approved'
  | 'distributed'
  | 'rejected'
  | 'archived';

export type BrevoEventType =
  | 'delivered'
  | 'sent'
  | 'opened'
  | 'unique_opened'
  | 'click'
  | 'hard_bounce'
  | 'soft_bounce'
  | 'spam'
  | 'unsubscribed'
  | 'blocked'
  | 'error'
  | 'deferred'
  | 'proxy_open'
  | 'list_addition'
  | 'contact_updated';

export interface UserRole {
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface Sequence {
  id: string;
  name: string;
  brevo_list_id: number | null;
  is_active: boolean;
  total_emails: number | null;
  default_delay_days: number;
  created_at: string;
  updated_at: string;
}

export interface Subscriber {
  id: string;
  brevo_contact_id: number | null;
  email: string;
  first_name: string | null;
  last_name: string | null;
  attributes: Record<string, unknown>;
  brevo_list_ids: number[];
  signed_up_at: string | null;
  is_blocked: boolean;
  blocked_reason: string | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Signature {
  id: string;
  name: string;
  body_mjml: string;
  body_html: string | null;
  image_url: string | null;
  is_default: boolean;
  created_at: string;
}

export interface EmailDraft {
  id: string;
  sequence_id: string | null;
  order_key: number | null;
  subject: string;
  body_mjml: string | null;
  body_html: string | null;
  body_text: string | null;
  signature_id: string | null;
  brevo_template_id: number | null;
  delay_days: number | null;
  tags: string[];
  locale: string;
  status: DraftStatus;
  is_ai_generated: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailDraftVersion {
  id: number;
  draft_id: string;
  version: number;
  subject: string;
  body_mjml: string | null;
  body_html: string | null;
  changed_by: string | null;
  changed_at: string;
}

export interface SubscriberProgress {
  subscriber_id: string;
  sequence_id: string;
  current_order_key: number | null;
  next_eligible_at: string | null;
  last_sent_at: string | null;
  last_delivered_at: string | null;
  last_opened_at: string | null;
  last_clicked_at: string | null;
  state: ProgressState;
  pause_until: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailEvent {
  id: number;
  subscriber_id: string | null;
  draft_id: string | null;
  brevo_message_id: string | null;
  brevo_contact_id: number | null;
  brevo_template_id: number | null;
  email: string | null;
  event_type: BrevoEventType | string;
  event_at: string;
  link_url: string | null;
  reason: string | null;
  user_agent: string | null;
  ip: string | null;
  raw: Record<string, unknown>;
  received_at: string;
}

export interface Broadcast {
  id: string;
  subject: string;
  body_mjml: string | null;
  body_html: string | null;
  signature_id: string | null;
  target_filter: Record<string, unknown>;
  brevo_campaign_id: number | null;
  scheduled_for: string | null;
  sent_at: string | null;
  status: BroadcastStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface InbalCorpusEntry {
  id: string;
  source: CorpusSource;
  source_ref: string | null;
  title: string | null;
  body: string;
  locale: string;
  published_at: string | null;
  tags: string[];
  performance_metrics: Record<string, unknown> | null;
  embedding: number[] | null;
  created_at: string;
}

export interface StyleGuide {
  id: string;
  locale: string;
  version: number;
  content_md: string;
  is_active: boolean;
  notes: string | null;
  created_at: string;
}

export interface TopicTaxonomy {
  id: string;
  category: 'physiological' | 'emotional' | 'relational' | 'lifestyle' | string;
  topic: string;
  keywords_he: string[];
  keywords_en: string[];
  is_active: boolean;
  performance_score: number;
  created_at: string;
}

export interface TopicCandidate {
  id: string;
  taxonomy_id: string | null;
  title: string;
  summary: string | null;
  sources: unknown[];
  relevance_score: number | null;
  trendiness_score: number | null;
  freshness_score: number | null;
  novelty_score: number | null;
  combined_score: number | null;
  status: TopicCandidateStatus;
  selected_at: string | null;
  selected_by: string | null;
  created_at: string;
}

export interface ArticleImageOption {
  url: string;
  prompt: string;
  selected: boolean;
}

export interface ArticleDraft {
  id: string;
  topic_candidate_id: string | null;
  email_draft_id: string | null;
  status: ArticleStatus;
  title: string | null;
  body_mjml: string | null;
  body_html: string | null;
  outline: unknown | null;
  critique: unknown | null;
  compliance_flags: unknown | null;
  image_options: ArticleImageOption[];
  selected_image_url: string | null;
  generation_metadata: Record<string, unknown> | null;
  generation_cost_usd: number | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

/* ============================================================
 * Brevo webhook payload (incoming POST body)
 * Single-event shape; Brevo may also POST an array of these.
 * ============================================================ */

export interface BrevoWebhookEvent {
  event: BrevoEventType | string;
  email?: string;
  id?: number;
  date?: string;
  ts?: number;
  ts_event?: number;
  ts_epoch?: number;
  'message-id'?: string;
  subject?: string;
  tag?: string;
  link?: string;
  reason?: string;
  template_id?: number;
  campaign_id?: number;
  list_id?: number[] | number;
  user_agent?: string;
  ip?: string;
  X_Mailin_custom?: string;
  [key: string]: unknown;
}
