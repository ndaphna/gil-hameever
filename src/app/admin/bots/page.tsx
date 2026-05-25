import Link from 'next/link';
import { Bot, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { BriefStatus, BriefType } from '@/lib/bots/schema';
import BriefsList from './briefs-list';
import styles from './bots.module.css';

type BriefSummary = {
  id: string;
  title: string;
  type: BriefType;
  status: BriefStatus;
  created_by: string;
  created_at: string;
  submitted_at: string | null;
  live_at: string | null;
};

type FilterValue = BriefStatus | 'all';

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'הכל' },
  { value: 'draft', label: 'טיוטות' },
  { value: 'submitted', label: 'הוגשו' },
  { value: 'building', label: 'בבנייה' },
  { value: 'live', label: 'פעילים' },
  { value: 'archived', label: 'בארכיון' },
];

export const dynamic = 'force-dynamic';

export default async function BotsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const rawStatus = params.status ?? 'all';
  const active: FilterValue = (FILTER_OPTIONS.find((o) => o.value === rawStatus)?.value ?? 'all') as FilterValue;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: isAdminFlag } = user
    ? await supabase.schema('newsletter').rpc('has_role', { required: 'admin' })
    : { data: false };

  let query = supabase
    .schema('bots')
    .from('briefs')
    .select('id,title,type,status,created_by,created_at,submitted_at,live_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (active !== 'all') {
    query = query.eq('status', active);
  }

  const { data, error } = await query;
  const briefs = (data ?? []) as BriefSummary[];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>בריפים לבוטים</h1>
          <p>מבקש להקים בוט חדש ב-ManyChat? מלאי בריף ואני מקבל הכל מסודר.</p>
        </div>
        <Link href="/admin/bots/new" className={styles.newBtn}>
          <Plus size={16} />
          בריף חדש
        </Link>
      </div>

      <div className={styles.filterBar}>
        {FILTER_OPTIONS.map((opt) => (
          <Link
            key={opt.value}
            href={opt.value === 'all' ? '/admin/bots' : `/admin/bots?status=${opt.value}`}
            className={`${styles.filterPill} ${
              active === opt.value ? styles.filterPillActive : ''
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      {error ? (
        <div className={styles.empty}>
          <h2>שגיאה בטעינה</h2>
          <p>{error.message}</p>
        </div>
      ) : briefs.length === 0 ? (
        <div className={styles.empty}>
          <Bot size={32} aria-hidden="true" />
          <h2>אין בריפים עדיין</h2>
          <p>פתחי בריף חדש כדי לתת לי את כל המידע שצריך לבניית הבוט.</p>
          <Link href="/admin/bots/new" className={styles.newBtn}>
            <Plus size={16} />
            צור בריף ראשון
          </Link>
        </div>
      ) : (
        <BriefsList
          briefs={briefs}
          currentUserId={user?.id ?? ''}
          isAdmin={isAdminFlag === true}
        />
      )}
    </div>
  );
}
