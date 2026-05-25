import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, FileText, ExternalLink, Pencil } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import {
  BRIEF_STATUS_LABEL,
  BRIEF_TYPE_LABEL,
  BotBriefRow,
  BriefAssetRow,
  BriefStatus,
  POST_SCOPE_LABEL,
} from '@/lib/bots/schema';
import { getBrevoTemplateName } from '@/lib/bots/brevo-templates';
import MarkLiveForm from './mark-live-form';
import StatusChanger from './status-changer';
import styles from './detail.module.css';

const STATUS_BADGE: Record<BriefStatus, string> = {
  draft: styles.badgeDraft,
  submitted: styles.badgeSubmitted,
  building: styles.badgeBuilding,
  live: styles.badgeLive,
  archived: styles.badgeArchived,
};

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const SIGNED_URL_TTL = 60 * 60;

export const dynamic = 'force-dynamic';

export default async function BotBriefDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: brief } = await supabase
    .schema('bots')
    .from('briefs')
    .select('*')
    .eq('id', id)
    .single<BotBriefRow>();

  if (!brief) notFound();

  const { data: assetRows } = await supabase
    .schema('bots')
    .from('brief_assets')
    .select('*')
    .eq('brief_id', id)
    .order('created_at', { ascending: true });

  const assets: Array<BriefAssetRow & { signed_url: string | null }> = await Promise.all(
    ((assetRows ?? []) as BriefAssetRow[]).map(async (a) => {
      const { data } = await supabaseAdmin.storage
        .from('bot-brief-assets')
        .createSignedUrl(a.storage_path, SIGNED_URL_TTL);
      return { ...a, signed_url: data?.signedUrl ?? null };
    }),
  );

  const { data: isAdmin } = await supabase
    .schema('newsletter')
    .rpc('has_role', { required: 'admin' });

  const brevoTemplateName = brief.brevo_template_id
    ? await getBrevoTemplateName(brief.brevo_template_id)
    : null;

  return (
    <div className={styles.page}>
      <Link href="/admin/bots" className={styles.backLink}>
        <ArrowRight size={16} />
        חזרה לרשימה
      </Link>

      <div className={styles.headerCard}>
        <div className={styles.headerTop}>
          <h1>{brief.title}</h1>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {brief.status === 'draft' && (
              <Link href={`/admin/bots/${brief.id}/edit`} className={styles.editBtn}>
                <Pencil size={14} />
                ערוך
              </Link>
            )}
            <StatusChanger
              briefId={brief.id}
              currentStatus={brief.status}
              isAdmin={isAdmin === true}
            />
          </div>
        </div>
        <div className={styles.headerMeta}>
          <span>{BRIEF_TYPE_LABEL[brief.type]}</span>
          <span>·</span>
          <span>נוצר {formatDate(brief.created_at)}</span>
          {brief.submitted_at && (
            <>
              <span>·</span>
              <span>הוגש {formatDate(brief.submitted_at)}</span>
            </>
          )}
          {brief.live_at && (
            <>
              <span>·</span>
              <span>פעיל מ-{formatDate(brief.live_at)}</span>
            </>
          )}
        </div>
      </div>

      <Section title="טריגר">
        {brief.type === 'comment_to_dm' ? (
          <>
            <FieldRow label="היקף">{POST_SCOPE_LABEL[brief.post_scope]}</FieldRow>
            {brief.post_scope === 'specific_post' && (
              <FieldRow label="פוסט">
                {brief.post_url ? (
                  <a href={brief.post_url} target="_blank" rel="noreferrer" className={styles.link}>
                    {brief.post_url}
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <em>—</em>
                )}
              </FieldRow>
            )}
            <FieldRow label="מילות מפתח">
              <div className={styles.keywords}>
                {(brief.keyword_triggers ?? []).map((kw) => (
                  <span key={kw} className={styles.keywordChip}>
                    {kw}
                  </span>
                ))}
              </div>
            </FieldRow>
          </>
        ) : (
          <FieldRow label="תיאור הסטורי">{brief.story_label}</FieldRow>
        )}
      </Section>

      <Section title="הודעת DM">
        <pre className={styles.dmBlock}>{brief.dm_message}</pre>
      </Section>

      {(brief.lead_magnet_url || assets.length > 0 || brief.cta_button_text) && (
        <Section title="Lead magnet + כפתור">
          {brief.cta_button_text && (
            <FieldRow label="טקסט הכפתור">
              <strong>{brief.cta_button_text}</strong>
            </FieldRow>
          )}
          {brief.lead_magnet_url && (
            <FieldRow label="לינק חיצוני">
              <a href={brief.lead_magnet_url} target="_blank" rel="noreferrer" className={styles.link}>
                {brief.lead_magnet_url}
                <ExternalLink size={12} />
              </a>
            </FieldRow>
          )}
          {assets.length > 0 && (
            <div className={styles.assetList}>
              {assets.map((a) => (
                <a
                  key={a.id}
                  href={a.signed_url ?? '#'}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.assetCard}
                >
                  <FileText size={20} />
                  <div>
                    <strong>{a.filename}</strong>
                    <span>{a.kind} · {formatSize(a.size_bytes)}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </Section>
      )}

      {brief.followup_dm_message && (
        <Section title="תזכורת ב-DM (ManyChat)">
          <FieldRow label="דיליי">{brief.followup_dm_delay_minutes} דקות</FieldRow>
          <FieldRow label="תנאי">רק למי שלא לחץ על ה-CTA</FieldRow>
          <FieldRow label="הודעה">
            <pre className={styles.dmBlock}>{brief.followup_dm_message}</pre>
          </FieldRow>
        </Section>
      )}

      {brief.followup_enabled && (
        <Section title="Follow-up אימייל">
          <FieldRow label="טמפלייט Brevo">
            {brevoTemplateName ?? `#${brief.brevo_template_id ?? '?'}`}
          </FieldRow>
          <FieldRow label="דיליי">{brief.followup_delay_hours} שעות</FieldRow>
        </Section>
      )}

      {brief.notes && (
        <Section title="הערות">
          <p className={styles.notes}>{brief.notes}</p>
        </Section>
      )}

      {brief.status === 'live' && (
        <Section title="ManyChat">
          <FieldRow label="Flow ID">
            <code>{brief.manychat_flow_id}</code>
          </FieldRow>
          <FieldRow label="Tag">
            <code>{brief.manychat_tag}</code>
          </FieldRow>
        </Section>
      )}

      {isAdmin === true && (brief.status === 'submitted' || brief.status === 'building') && (
        <Section title="סימון Live">
          <MarkLiveForm briefId={brief.id} initialTagSuggestion={brief.manychat_tag} />
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.fieldRow}>
      <span className={styles.fieldLabel}>{label}</span>
      <div>{children}</div>
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
