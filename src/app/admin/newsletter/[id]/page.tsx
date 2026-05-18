import Link from 'next/link';
import { ArrowRight, Clock, FileText, Sparkles, Send, History, FileX } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import DraftEditor, { type InitialDraft } from './draft-editor';
import StatsPanel, { type DraftEmailStats, type TopLink } from './stats-panel';
import styles from './edit.module.css';

type DraftRow = {
  id: string;
  subject: string;
  body_text: string | null;
  tags: string[] | null;
  locale: string;
  status: 'draft' | 'published' | 'archived';
  is_ai_generated: boolean;
  brevo_template_id: number | null;
  broadcast_scheduled_at: string | null;
  broadcast_sent_at: string | null;
  brevo_campaign_id: number | null;
  automation_config_id: string | null;
  automation_delay_days: number | null;
  automation_order: number | null;
  automation_enqueued_at: string | null;
  intended_for_automation: boolean;
  intended_automation_delay_days: number | null;
  header_image_url: string | null;
  header_image_prompt: string | null;
  header_image_provider: string | null;
  created_at: string;
  updated_at: string;
};

const STATUS_LABEL: Record<DraftRow['status'], string> = {
  draft: 'טיוטה',
  published: 'פורסם',
  archived: 'בארכיון',
};

const STATUS_CLASS: Record<DraftRow['status'], string> = {
  draft: styles.statusDraft,
  published: styles.statusPublished,
  archived: styles.statusArchived,
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('he-IL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function NewsletterDraftEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: draft, error } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .select(
      'id, subject, body_text, tags, locale, status, is_ai_generated, brevo_template_id, broadcast_scheduled_at, broadcast_sent_at, brevo_campaign_id, automation_config_id, automation_delay_days, automation_order, automation_enqueued_at, intended_for_automation, intended_automation_delay_days, header_image_url, header_image_prompt, header_image_provider, created_at, updated_at',
    )
    .eq('id', id)
    .maybeSingle<DraftRow>();

  if (error || !draft) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundIcon}>
          <FileX size={28} strokeWidth={1.75} />
        </div>
        <h2 className={styles.notFoundTitle}>הטיוטה לא נמצאה</h2>
        <p className={styles.notFoundText}>
          ייתכן שהקישור שגוי, או שהטיוטה נמחקה.
        </p>
        <Link href="/admin/newsletter" className={styles.backLink}>
          <ArrowRight size={16} strokeWidth={2.25} />
          חזרה לרשימה
        </Link>
      </div>
    );
  }

  const { count: versionCount } = await supabase
    .schema('newsletter')
    .from('email_draft_versions')
    .select('*', { count: 'exact', head: true })
    .eq('draft_id', id);

  // Aggregate automation send stats for this draft (cheap COUNT queries).
  let automationStats = { pending: 0, sent: 0, failed: 0 };
  if (draft.automation_config_id) {
    const [{ count: pending }, { count: sent }, { count: failed }] = await Promise.all([
      supabase
        .schema('newsletter')
        .from('automation_sends')
        .select('*', { count: 'exact', head: true })
        .eq('draft_id', draft.id)
        .is('sent_at', null)
        .is('failed_at', null),
      supabase
        .schema('newsletter')
        .from('automation_sends')
        .select('*', { count: 'exact', head: true })
        .eq('draft_id', draft.id)
        .not('sent_at', 'is', null),
      supabase
        .schema('newsletter')
        .from('automation_sends')
        .select('*', { count: 'exact', head: true })
        .eq('draft_id', draft.id)
        .not('failed_at', 'is', null),
    ]);
    automationStats = {
      pending: pending ?? 0,
      sent: sent ?? 0,
      failed: failed ?? 0,
    };
  }

  const initial: InitialDraft = {
    id: draft.id,
    subject: draft.subject,
    body_text: draft.body_text ?? '',
    tags: draft.tags ?? [],
    locale: draft.locale,
    status: draft.status,
    brevo_template_id: draft.brevo_template_id,
    broadcast_scheduled_at: draft.broadcast_scheduled_at,
    broadcast_sent_at: draft.broadcast_sent_at,
    brevo_campaign_id: draft.brevo_campaign_id,
    automation_config_id: draft.automation_config_id,
    automation_delay_days: draft.automation_delay_days,
    automation_order: draft.automation_order,
    automation_enqueued_at: draft.automation_enqueued_at,
    automation_stats: automationStats,
    intended_for_automation: draft.intended_for_automation,
    intended_automation_delay_days: draft.intended_automation_delay_days,
    header_image_url: draft.header_image_url,
    header_image_prompt: draft.header_image_prompt,
    header_image_provider: draft.header_image_provider,
  };

  // Email stats (aggregates over newsletter.email_events for this draft).
  const [{ data: statsRows }, { data: topLinks }] = await Promise.all([
    supabase.schema('newsletter').rpc('draft_email_stats', { p_draft_id: draft.id }),
    supabase.schema('newsletter').rpc('draft_top_links', { p_draft_id: draft.id, p_limit: 5 }),
  ]);
  const emailStats: DraftEmailStats = (statsRows as DraftEmailStats[] | null)?.[0] ?? {
    delivered_count: 0,
    unique_opened_count: 0,
    total_opens_count: 0,
    unique_clicked_count: 0,
    total_clicks_count: 0,
    bounced_count: 0,
    unsubscribed_count: 0,
    spam_count: 0,
    blocked_count: 0,
    first_event_at: null,
    last_event_at: null,
  };

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{draft.subject || '(ללא נושא)'}</h1>
          <div className={styles.metaRow}>
            <span className={`${styles.statusPill} ${STATUS_CLASS[draft.status]}`}>
              {STATUS_LABEL[draft.status]}
            </span>
            <span className={styles.metaItem}>
              <FileText size={13} className={styles.metaIcon} strokeWidth={2} />
              נוצר {formatDate(draft.created_at)}
            </span>
            <span className={styles.metaItem}>
              <Clock size={13} className={styles.metaIcon} strokeWidth={2} />
              עודכן {formatDate(draft.updated_at)}
            </span>
            <span className={styles.metaItem}>
              <History size={13} className={styles.metaIcon} strokeWidth={2} />
              {versionCount ?? 0} גרסאות
            </span>
            {draft.is_ai_generated && (
              <span className={styles.metaItem}>
                <Sparkles size={13} className={styles.metaIcon} strokeWidth={2} />
                AI
              </span>
            )}
            {draft.brevo_template_id !== null && (
              <span className={styles.metaItem}>
                <Send size={13} className={styles.metaIcon} strokeWidth={2} />
                Brevo #{draft.brevo_template_id}
              </span>
            )}
          </div>
        </div>
        <Link href="/admin/newsletter" className={styles.backLink}>
          <ArrowRight size={16} strokeWidth={2.25} />
          חזרה לרשימה
        </Link>
      </header>

      <DraftEditor initial={initial} />

      <StatsPanel
        stats={emailStats}
        topLinks={(topLinks as TopLink[] | null) ?? []}
        automationSent={automationStats.sent}
        broadcastSentAt={draft.broadcast_sent_at}
      />
    </div>
  );
}
