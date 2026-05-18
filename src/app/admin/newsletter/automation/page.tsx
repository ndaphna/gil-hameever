import Link from 'next/link';
import { ArrowRight, Repeat } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import AutomationConfigForm from './automation-config-form';
import styles from './automation.module.css';

type ConfigRow = {
  id: string;
  name: string;
  display_name: string;
  anchor_day: number;
  recipient_list_id: number;
  is_active: boolean;
  catch_up_spacing_hours: number;
  updated_at: string;
};

export default async function AutomationConfigPage() {
  const supabase = await createClient();

  const { data: config } = await supabase
    .schema('newsletter')
    .from('automation_config')
    .select('id, name, display_name, anchor_day, recipient_list_id, is_active, catch_up_spacing_hours, updated_at')
    .eq('name', 'welcome_series')
    .maybeSingle<ConfigRow>();

  // Aggregate counts across all queued sends (across drafts) for context.
  const [
    { count: pendingCount },
    { count: sentCount },
    { count: failedCount },
    { count: draftsInAutomation },
    { count: openedCount },
    { count: clickedCount },
    { count: unsubscribedCount },
  ] = await Promise.all([
    supabase
      .schema('newsletter')
      .from('automation_sends')
      .select('*', { count: 'exact', head: true })
      .is('sent_at', null)
      .is('failed_at', null),
    supabase
      .schema('newsletter')
      .from('automation_sends')
      .select('*', { count: 'exact', head: true })
      .not('sent_at', 'is', null),
    supabase
      .schema('newsletter')
      .from('automation_sends')
      .select('*', { count: 'exact', head: true })
      .not('failed_at', 'is', null),
    supabase
      .schema('newsletter')
      .from('email_drafts')
      .select('*', { count: 'exact', head: true })
      .not('automation_config_id', 'is', null),
    supabase
      .schema('newsletter')
      .from('email_events')
      .select('*', { count: 'exact', head: true })
      .in('event_type', ['opened', 'unique_opened']),
    supabase
      .schema('newsletter')
      .from('email_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'click'),
    supabase
      .schema('newsletter')
      .from('email_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'unsubscribed'),
  ]);

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>
            <Repeat size={22} strokeWidth={2} style={{ color: 'var(--nl-primary-500)' }} />
            הגדרות אוטומציה
          </h1>
          <p className={styles.subtitle}>
            הקונפיג של ה-evergreen sequence. עדכני את ה-anchor day כל פעם שמשנים את ה-flow ב-Brevo.
          </p>
        </div>
        <Link href="/admin/newsletter" className={styles.backLink}>
          <ArrowRight size={16} strokeWidth={2.25} />
          חזרה לרשימה
        </Link>
      </header>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>טיוטות באוטומציה</div>
          <div className={styles.statValue}>{draftsInAutomation ?? 0}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>שליחות ממתינות</div>
          <div className={styles.statValue}>{pendingCount ?? 0}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>נשלחו</div>
          <div className={styles.statValue}>{sentCount ?? 0}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>נכשלו</div>
          <div className={styles.statValue}>{failedCount ?? 0}</div>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>פתיחות (סה״כ)</div>
          <div className={styles.statValue}>{openedCount ?? 0}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>קליקים (סה״כ)</div>
          <div className={styles.statValue}>{clickedCount ?? 0}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>ביטולי מנוי</div>
          <div className={styles.statValue}>{unsubscribedCount ?? 0}</div>
        </div>
        <div className={styles.statCard} />
      </div>

      {config ? (
        <AutomationConfigForm initial={config} />
      ) : (
        <div className={styles.empty}>קונפיג לא נמצא. הריצי את המיגרציה.</div>
      )}
    </div>
  );
}
