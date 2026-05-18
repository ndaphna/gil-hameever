import Link from 'next/link';
import { Mail, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import styles from './newsletter.module.css';

type DraftStatus = 'draft' | 'published' | 'archived';

type EmailDraftRow = {
  id: string;
  subject: string;
  status: DraftStatus;
  tags: string[];
  locale: string;
  is_ai_generated: boolean;
  brevo_template_id: number | null;
  created_at: string;
  updated_at: string;
  intended_for_automation: boolean;
  automation_config_id: string | null;
  header_image_url: string | null;
  body_text: string | null;
};

const STATUS_LABEL: Record<DraftStatus, string> = {
  draft: 'טיוטה',
  published: 'פורסם',
  archived: 'בארכיון',
};

const STATUS_BADGE_CLASS: Record<DraftStatus, string> = {
  draft: styles.badgeDraft,
  published: styles.badgePublished,
  archived: styles.badgeArchived,
};

type FilterValue = DraftStatus | 'all' | 'pending_approval';

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'הכל' },
  { value: 'pending_approval', label: 'ממתינות לאישור' },
  { value: 'draft', label: 'טיוטות' },
  { value: 'published', label: 'פורסמו' },
  { value: 'archived', label: 'בארכיון' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('he-IL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function NewsletterIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const rawStatus = params.status;
  const activeFilter: FilterValue =
    rawStatus === 'draft' ||
    rawStatus === 'published' ||
    rawStatus === 'archived' ||
    rawStatus === 'pending_approval'
      ? rawStatus
      : 'all';

  const supabase = await createClient();

  let query = supabase
    .schema('newsletter')
    .from('email_drafts')
    .select(
      'id, subject, status, tags, locale, is_ai_generated, brevo_template_id, created_at, updated_at, intended_for_automation, automation_config_id, header_image_url, body_text',
    )
    .order('updated_at', { ascending: false })
    .limit(200);

  if (activeFilter === 'pending_approval') {
    query = query.eq('intended_for_automation', true).is('automation_config_id', null);
  } else if (activeFilter !== 'all') {
    query = query.eq('status', activeFilter);
  }

  const { data, error } = await query;
  const drafts = (data ?? []) as EmailDraftRow[];

  // Counts for stat cards — small SELECTs (count-only, no rows shipped).
  const [
    { count: totalCount },
    { count: draftCount },
    { count: publishedCount },
    { count: pendingApprovalCount },
  ] = await Promise.all([
    supabase.schema('newsletter').from('email_drafts').select('*', { count: 'exact', head: true }),
    supabase
      .schema('newsletter')
      .from('email_drafts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'draft'),
    supabase
      .schema('newsletter')
      .from('email_drafts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published'),
    supabase
      .schema('newsletter')
      .from('email_drafts')
      .select('*', { count: 'exact', head: true })
      .eq('intended_for_automation', true)
      .is('automation_config_id', null),
  ]);

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1>טיוטות ניוזלטר</h1>
          <p>נהלי, ערכי ושלחי את כל הניוזלטרים של ענבל ממקום אחד</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link
            href="/admin/newsletter/automation"
            className={styles.newButton}
            style={{ background: 'var(--nl-surface)', color: 'var(--nl-gray-700)', border: '1px solid var(--nl-gray-300)' }}
          >
            הגדרות אוטומציה
          </Link>
          <Link href="/admin/newsletter/new" className={styles.newButton}>
            <Plus size={16} strokeWidth={2.5} />
            טיוטה חדשה
          </Link>
        </div>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>סך הכל</div>
          <div className={styles.statValue}>{totalCount ?? 0}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>ממתינות לאישור</div>
          <div className={styles.statValue}>{pendingApprovalCount ?? 0}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>טיוטות</div>
          <div className={styles.statValue}>{draftCount ?? 0}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>פורסמו</div>
          <div className={styles.statValue}>{publishedCount ?? 0}</div>
        </div>
      </div>

      <nav className={styles.filters} aria-label="סינון לפי סטטוס">
        <span className={styles.filterLabel}>סטטוס</span>
        {FILTER_OPTIONS.map((opt) => {
          const isActive = opt.value === activeFilter;
          const href =
            opt.value === 'all' ? '/admin/newsletter' : `/admin/newsletter?status=${opt.value}`;
          return (
            <Link
              key={opt.value}
              href={href}
              className={`${styles.filterLink} ${isActive ? styles.filterLinkActive : ''}`}
            >
              {opt.label}
            </Link>
          );
        })}
      </nav>

      {error && (
        <div className={styles.errorBox}>שגיאה בטעינת הטיוטות: {error.message}</div>
      )}

      {!error && drafts.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Mail size={28} strokeWidth={1.75} />
          </div>
          <h2 className={styles.emptyTitle}>
            {activeFilter === 'all' ? 'עוד אין טיוטות' : 'אין טיוטות בסטטוס הזה'}
          </h2>
          <p className={styles.emptyText}>
            {activeFilter === 'all'
              ? 'התחילי בטיוטה ראשונה. ה-AI יציע גוף ניוזלטר בקול של ענבל וגם 5 כותרות לבחירה.'
              : 'נסי לבחור סטטוס אחר, או צרי טיוטה חדשה.'}
          </p>
          {activeFilter === 'all' && (
            <Link href="/admin/newsletter/new" className={styles.newButton}>
              <Plus size={16} strokeWidth={2.5} />
              צרי טיוטה ראשונה
            </Link>
          )}
        </div>
      ) : !error ? (
        <div className={styles.cardGrid}>
          {drafts.map((d) => {
            const excerpt = (d.body_text ?? '')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 140);
            return (
              <Link
                key={d.id}
                href={`/admin/newsletter/${d.id}`}
                className={styles.draftCard}
              >
                <div
                  className={`${styles.draftCardThumb} ${d.header_image_url ? '' : styles.draftCardThumbEmpty}`}
                  style={
                    d.header_image_url
                      ? { backgroundImage: `url(${d.header_image_url})` }
                      : undefined
                  }
                  aria-hidden="true"
                >
                  {!d.header_image_url && (
                    <Mail size={28} strokeWidth={1.5} />
                  )}
                </div>
                <div className={styles.draftCardBody}>
                  <h3 className={styles.draftCardSubject}>
                    {d.subject || '(ללא נושא)'}
                  </h3>
                  {excerpt && (
                    <p className={styles.draftCardExcerpt}>{excerpt}…</p>
                  )}
                  <div className={styles.draftCardBadges}>
                    <span className={`${styles.badge} ${STATUS_BADGE_CLASS[d.status]}`}>
                      {STATUS_LABEL[d.status]}
                    </span>
                    {d.intended_for_automation && !d.automation_config_id && (
                      <span
                        className={styles.badge}
                        style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' }}
                      >
                        🔔 ממתינה
                      </span>
                    )}
                    {d.automation_config_id && (
                      <span
                        className={styles.badge}
                        style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' }}
                      >
                        באוטומציה
                      </span>
                    )}
                    {d.is_ai_generated && (
                      <span className={`${styles.badge} ${styles.badgeAi}`}>AI</span>
                    )}
                    {d.brevo_template_id !== null && (
                      <span className={`${styles.badge} ${styles.badgeSynced}`}>
                        Brevo
                      </span>
                    )}
                  </div>
                  {d.tags && d.tags.length > 0 && (
                    <div className={styles.draftCardTags}>
                      {d.tags.slice(0, 4).map((t) => (
                        <span key={t} className={styles.tagChip}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className={styles.draftCardFooter}>
                    <span>עודכן {formatDate(d.updated_at)}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
