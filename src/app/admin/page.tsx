/**
 * Admin dashboard — Inbal's home screen.
 *
 * Server-rendered: pulls subscriber count, recent users, newsletter stats
 * + the latest activity in one round-trip. Uses createClient() for the
 * session-aware queries (newsletter is RLS-gated to content_creator) and
 * supabaseAdmin only where bypassing RLS is required (auth.users counts).
 */
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Mail, Users, Send, Sparkles, ArrowLeft, Plus, Inbox, Bell } from 'lucide-react';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import styles from './dashboard.module.css';

type RecentUserRow = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
};

type RecentDraftRow = {
  id: string;
  subject: string;
  status: 'draft' | 'published' | 'archived';
  intended_for_automation: boolean;
  automation_config_id: string | null;
  brevo_template_id: number | null;
  updated_at: string;
  header_image_url: string | null;
};

function relativeDays(iso: string | null): string | null {
  if (!iso) return null;
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days <= 0) return 'היום';
  if (days === 1) return 'אתמול';
  if (days < 7) return `לפני ${days} ימים`;
  if (days < 30) return `לפני ${Math.floor(days / 7)} שבועות`;
  return `לפני ${Math.floor(days / 30)} חודשים`;
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
  });
}

function firstName(fullName: string | null | undefined, email: string | null | undefined): string {
  if (fullName && fullName.trim()) return fullName.trim().split(/\s+/)[0];
  if (email) return email.split('@')[0];
  return 'משתמשת';
}

export default async function AdminDashboardPage() {
  const supabase = await createServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Greet by the logged-in user's first name; fall back to email local-part.
  const { data: profile } = await supabase
    .from('user_profile')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle<{ full_name: string | null }>();
  const greetingName = firstName(profile?.full_name, user.email);

  // -- Newsletter stats (gated by RLS to content_creator) --
  const [
    { count: pendingApprovalCount },
    { count: totalDraftsCount },
    { count: publishedCount },
    { data: lastSentRow },
    { data: recentDrafts },
  ] = await Promise.all([
    supabase
      .schema('newsletter')
      .from('email_drafts')
      .select('*', { count: 'exact', head: true })
      .eq('intended_for_automation', true)
      .is('automation_config_id', null),
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
      .select('broadcast_sent_at, subject')
      .not('broadcast_sent_at', 'is', null)
      .order('broadcast_sent_at', { ascending: false })
      .limit(1)
      .maybeSingle<{ broadcast_sent_at: string | null; subject: string }>(),
    supabase
      .schema('newsletter')
      .from('email_drafts')
      .select(
        'id, subject, status, intended_for_automation, automation_config_id, brevo_template_id, updated_at, header_image_url',
      )
      .order('updated_at', { ascending: false })
      .limit(5),
  ]);

  // -- Subscriber stats (bypass RLS — auth.users) --
  const sevenDaysAgoIso = new Date(Date.now() - 7 * 86_400_000).toISOString();
  let totalSubscribers = 0;
  let newThisWeek = 0;
  let recentUsers: RecentUserRow[] = [];
  try {
    const { count: totalRes } = await supabaseAdmin
      .from('user_profile')
      .select('*', { count: 'exact', head: true });
    const { count: weekRes } = await supabaseAdmin
      .from('user_profile')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgoIso);
    const { data: rec } = await supabaseAdmin
      .from('user_profile')
      .select('id, email, full_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5);
    totalSubscribers = totalRes ?? 0;
    newThisWeek = weekRes ?? 0;
    recentUsers = (rec as RecentUserRow[] | null) ?? [];
  } catch {
    // Counts are decorative on the dashboard; failure shouldn't break the page.
  }

  const drafts = (recentDrafts as RecentDraftRow[] | null) ?? [];
  const lastSentRel = relativeDays(lastSentRow?.broadcast_sent_at ?? null);

  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1 className={styles.heroTitle}>
            שלום {greetingName} <span className={styles.heroWave} aria-hidden="true">👋🏻</span>
          </h1>
          <p className={styles.heroLede}>
            {(pendingApprovalCount ?? 0) > 0
              ? `${pendingApprovalCount} ${(pendingApprovalCount ?? 0) === 1 ? 'טיוטה ממתינה' : 'טיוטות ממתינות'} לאישורך`
              : 'אין טיוטות שמחכות לך כרגע'}
            {newThisWeek > 0 && ` · ${newThisWeek} מנויות חדשות השבוע`}
            {lastSentRel && ` · המייל האחרון נשלח ${lastSentRel}`}
          </p>
          <div className={styles.heroActions}>
            <Link href="/admin/newsletter/new" className={styles.heroPrimaryBtn}>
              <Plus size={16} strokeWidth={2.5} />
              טיוטה חדשה
            </Link>
            {(pendingApprovalCount ?? 0) > 0 && (
              <Link
                href="/admin/newsletter?status=pending_approval"
                className={styles.heroSecondaryBtn}
              >
                <Bell size={14} strokeWidth={2.25} />
                עברי על הממתינות לאישור
              </Link>
            )}
          </div>
        </div>
        <div className={styles.heroDecor} aria-hidden="true">
          <Sparkles size={56} strokeWidth={1.5} />
        </div>
      </section>

      {/* KPI STRIP */}
      <section className={styles.kpiGrid}>
        <KpiCard
          label="ממתינות לאישור"
          value={pendingApprovalCount ?? 0}
          accent="warning"
          icon={<Bell size={16} strokeWidth={2.25} />}
        />
        <KpiCard
          label="טיוטות פתוחות"
          value={totalDraftsCount ?? 0}
          accent="info"
          icon={<Inbox size={16} strokeWidth={2.25} />}
        />
        <KpiCard
          label="פורסמו"
          value={publishedCount ?? 0}
          accent="success"
          icon={<Send size={16} strokeWidth={2.25} />}
        />
        <KpiCard
          label="סה״כ מנויות"
          value={totalSubscribers}
          sub={newThisWeek > 0 ? `+${newThisWeek} השבוע` : 'יציב השבוע'}
          accent="brand"
          icon={<Users size={16} strokeWidth={2.25} />}
        />
      </section>

      {/* TWO-COLUMN ACTIVITY */}
      <section className={styles.activityGrid}>
        <article className={styles.panel}>
          <header className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>
              <Mail size={16} strokeWidth={2.25} />
              טיוטות אחרונות
            </h2>
            <Link href="/admin/newsletter" className={styles.panelLink}>
              לכל הטיוטות
              <ArrowLeft size={14} strokeWidth={2.25} />
            </Link>
          </header>
          {drafts.length === 0 ? (
            <p className={styles.emptyRow}>עוד אין טיוטות. התחילי אחת.</p>
          ) : (
            <ul className={styles.activityList}>
              {drafts.map((d) => {
                const thumb = d.header_image_url;
                return (
                  <li key={d.id} className={styles.activityItem}>
                    <Link
                      href={`/admin/newsletter/${d.id}`}
                      className={styles.activityLink}
                    >
                      <span
                        className={`${styles.draftThumb} ${thumb ? '' : styles.draftThumbEmpty}`}
                        aria-hidden="true"
                        style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}
                      >
                        {!thumb && <Mail size={16} strokeWidth={2} />}
                      </span>
                      <span className={styles.activityBody}>
                        <span className={styles.activitySubject}>
                          {d.subject || '(ללא נושא)'}
                        </span>
                        <span className={styles.activityMeta}>
                          {d.intended_for_automation && !d.automation_config_id && (
                            <span className={styles.tagPending}>ממתינה לאישור</span>
                          )}
                          {d.automation_config_id && (
                            <span className={styles.tagAutomation}>באוטומציה</span>
                          )}
                          {d.brevo_template_id && (
                            <span className={styles.tagSynced}>סונכרן</span>
                          )}
                          <span className={styles.activityDate}>
                            עודכן {shortDate(d.updated_at)}
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </article>

        <article className={styles.panel}>
          <header className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>
              <Users size={16} strokeWidth={2.25} />
              מנויות אחרונות
            </h2>
            <Link href="/admin/users" className={styles.panelLink}>
              לכל המנויות
              <ArrowLeft size={14} strokeWidth={2.25} />
            </Link>
          </header>
          {recentUsers.length === 0 ? (
            <p className={styles.emptyRow}>עוד אין נתונים על מנויות אחרונות.</p>
          ) : (
            <ul className={styles.activityList}>
              {recentUsers.map((u) => (
                <li key={u.id} className={styles.activityItem}>
                  <span className={styles.userAvatar} aria-hidden="true">
                    {(u.full_name?.[0] ?? u.email[0] ?? '·').toUpperCase()}
                  </span>
                  <span className={styles.activityBody}>
                    <span className={styles.activitySubject}>
                      {u.full_name || u.email.split('@')[0]}
                    </span>
                    <span className={styles.activityMeta}>
                      <span className={styles.userEmail}>{u.email}</span>
                      <span className={styles.activityDate}>
                        {relativeDays(u.created_at) ?? shortDate(u.created_at)}
                      </span>
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: number;
  sub?: string;
  accent: 'brand' | 'success' | 'info' | 'warning';
  icon: React.ReactNode;
}) {
  const accentClass =
    accent === 'brand'
      ? styles.kpiAccentBrand
      : accent === 'success'
        ? styles.kpiAccentSuccess
        : accent === 'info'
          ? styles.kpiAccentInfo
          : styles.kpiAccentWarning;
  return (
    <div className={`${styles.kpiCard} ${accentClass}`}>
      <div className={styles.kpiLabel}>
        <span className={styles.kpiIcon}>{icon}</span>
        {label}
      </div>
      <div className={styles.kpiValue}>{value.toLocaleString('he-IL')}</div>
      {sub && <div className={styles.kpiSub}>{sub}</div>}
    </div>
  );
}
