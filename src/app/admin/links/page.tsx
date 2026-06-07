import { redirect } from 'next/navigation';
import { Activity, Clock, TrendingUp, MousePointerClick, Smartphone, Monitor } from 'lucide-react';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import styles from './links.module.css';

type ClickRow = {
  id: number;
  slug: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
};

function parseDevice(ua: string | null): 'mobile' | 'desktop' {
  if (!ua) return 'desktop';
  return /mobile|android|iphone|ipad|ipod/i.test(ua) ? 'mobile' : 'desktop';
}

function shortenReferrer(ref: string): string {
  try {
    return new URL(ref).hostname.replace(/^www\./, '');
  } catch {
    return ref.slice(0, 40);
  }
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' }),
    time: d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
  };
}

export default async function LinksPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000).toISOString();

  const [{ count: totalCount }, { data: raw }] = await Promise.all([
    supabaseAdmin.from('link_clicks').select('*', { count: 'exact', head: true }),
    supabaseAdmin
      .from('link_clicks')
      .select('id, slug, utm_source, utm_medium, utm_campaign, referrer, user_agent, created_at')
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: false })
      .limit(500),
  ]);

  const clicks: ClickRow[] = (raw as ClickRow[] | null) ?? [];

  // Period counts
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(Date.now() - 7 * 86_400_000);
  const todayCount = clicks.filter(c => new Date(c.created_at) >= todayStart).length;
  const weekCount  = clicks.filter(c => new Date(c.created_at) >= sevenDaysAgo).length;
  const monthCount = clicks.length;

  // Source breakdown
  const sourceMap = new Map<string, number>();
  clicks.forEach(c => {
    const key = `${c.utm_source ?? '(ישיר)'}||${c.utm_medium ?? '—'}`;
    sourceMap.set(key, (sourceMap.get(key) ?? 0) + 1);
  });
  const sources = Array.from(sourceMap.entries())
    .map(([k, count]) => { const [src, med] = k.split('||'); return { src, med, count }; })
    .sort((a, b) => b.count - a.count);
  const maxSource = Math.max(...sources.map(s => s.count), 1);

  // Channel grouping: social / website / email / direct
  const channelMap = new Map<string, number>([
    ['רשתות חברתיות', 0],
    ['וואטסאפ', 0],
    ['דף האתר', 0],
    ['אימייל', 0],
    ['ישיר', 0],
  ]);
  clicks.forEach(c => {
    const src = c.utm_source?.toLowerCase() ?? '';
    if (['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin'].includes(src)) {
      channelMap.set('רשתות חברתיות', (channelMap.get('רשתות חברתיות') ?? 0) + 1);
    } else if (src === 'whatsapp') {
      channelMap.set('וואטסאפ', (channelMap.get('וואטסאפ') ?? 0) + 1);
    } else if (src === 'website') {
      channelMap.set('דף האתר', (channelMap.get('דף האתר') ?? 0) + 1);
    } else if (['email', 'newsletter', 'brevo'].includes(src)) {
      channelMap.set('אימייל', (channelMap.get('אימייל') ?? 0) + 1);
    } else {
      channelMap.set('ישיר', (channelMap.get('ישיר') ?? 0) + 1);
    }
  });
  const channels = Array.from(channelMap.entries())
    .map(([name, count]) => ({ name, count }))
    .filter(c => c.count > 0)
    .sort((a, b) => b.count - a.count);
  const maxChannel = Math.max(...channels.map(c => c.count), 1);

  // Campaign breakdown (top 5, non-null)
  const campaignMap = new Map<string, number>();
  clicks.forEach(c => {
    if (!c.utm_campaign) return;
    campaignMap.set(c.utm_campaign, (campaignMap.get(c.utm_campaign) ?? 0) + 1);
  });
  const campaigns = Array.from(campaignMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const maxCampaign = Math.max(...campaigns.map(c => c.count), 1);

  // Daily trend — last 30 days
  const dayMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000);
    dayMap.set(d.toISOString().slice(0, 10), 0);
  }
  clicks.forEach(c => {
    const key = c.created_at.slice(0, 10);
    if (dayMap.has(key)) dayMap.set(key, (dayMap.get(key) ?? 0) + 1);
  });
  const days = Array.from(dayMap.entries()).map(([date, count]) => ({ date, count }));
  const maxDay = Math.max(...days.map(d => d.count), 1);
  const todayKey = new Date().toISOString().slice(0, 10);

  const recentClicks = clicks.slice(0, 20);

  return (
    <div className={styles.page}>

      {/* HEADER */}
      <section className={styles.header}>
        <div>
          <h1 className={styles.title}>קישורים ולידים</h1>
          <p className={styles.subtitle}>מעקב קליקים ומקורות תנועה · /sefer → סיפרי ניב</p>
        </div>
        <div className={styles.headerIcon} aria-hidden="true">
          <MousePointerClick size={44} strokeWidth={1.5} />
        </div>
      </section>

      {/* KPI STRIP */}
      <section className={styles.kpiGrid}>
        <KpiCard label="סה״כ קליקים" value={totalCount ?? 0} sub="מכל הזמנים" accent="brand"   icon={<Activity size={16} strokeWidth={2.25} />} />
        <KpiCard label="היום"         value={todayCount}       sub="24 שעות"   accent="success" icon={<Clock size={16} strokeWidth={2.25} />} />
        <KpiCard label="7 ימים"       value={weekCount}        sub="שבוע אחרון" accent="info"  icon={<TrendingUp size={16} strokeWidth={2.25} />} />
        <KpiCard label="30 ימים"      value={monthCount}       sub="חודש אחרון" accent="warning" icon={<Activity size={16} strokeWidth={2.25} />} />
      </section>

      {/* CHANNEL SUMMARY */}
      {channels.length > 0 && (
        <article className={styles.panel}>
          <header className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>ערוצים — 30 יום</h2>
            <span className={styles.panelSub}>social / אתר / אימייל / ישיר</span>
          </header>
          <ul className={styles.channelList}>
            {channels.map((ch, i) => {
              const pct = Math.round((ch.count / monthCount) * 100);
              return (
                <li key={i} className={styles.channelItem}>
                  <span className={styles.channelName}>{ch.name}</span>
                  <span className={styles.channelBarTrack}>
                    <span className={styles.channelBarFill} style={{ width: `${Math.round((ch.count / maxChannel) * 100)}%` }} />
                  </span>
                  <span className={styles.channelCount}>{ch.count}</span>
                  <span className={styles.channelPct}>{pct}%</span>
                </li>
              );
            })}
          </ul>
        </article>
      )}

      {/* SOURCES + TREND */}
      <section className={styles.twoCol}>

        {/* Sources */}
        <article className={styles.panel}>
          <header className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>מקורות תנועה</h2>
            <span className={styles.panelSub}>30 יום אחרונים</span>
          </header>
          {sources.length === 0 ? (
            <p className={styles.empty}>עוד אין נתונים.</p>
          ) : (
            <ul className={styles.sourceList}>
              {sources.map((s, i) => (
                <li key={i} className={styles.sourceItem}>
                  <span className={styles.sourceLabel}>
                    <strong>{s.src}</strong>
                    {s.med !== '—' && <span className={styles.sourceMed}>{s.med}</span>}
                  </span>
                  <span className={styles.barTrack}>
                    <span className={styles.barFill} style={{ width: `${Math.round((s.count / maxSource) * 100)}%` }} />
                  </span>
                  <span className={styles.sourceCount}>{s.count}</span>
                </li>
              ))}
            </ul>
          )}

          {campaigns.length > 0 && (
            <>
              <hr className={styles.divider} />
              <h3 className={styles.subSectionTitle}>קמפיינים</h3>
              <ul className={styles.sourceList}>
                {campaigns.map((c, i) => (
                  <li key={i} className={styles.sourceItem}>
                    <span className={styles.sourceLabel}><strong>{c.name}</strong></span>
                    <span className={styles.barTrack}>
                      <span className={styles.barFillAlt} style={{ width: `${Math.round((c.count / maxCampaign) * 100)}%` }} />
                    </span>
                    <span className={styles.sourceCount}>{c.count}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </article>

        {/* Trend chart */}
        <article className={styles.panel}>
          <header className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>טרנד — 30 יום</h2>
            <span className={styles.panelSub}>כל עמודה = יום אחד</span>
          </header>
          <div className={styles.trendChart}>
            {days.map(d => {
              const pct = d.count === 0 ? 2 : Math.max(4, Math.round((d.count / maxDay) * 100));
              const isToday = d.date === todayKey;
              return (
                <div key={d.date} className={styles.trendDayCol} title={`${d.date}: ${d.count}`}>
                  <span
                    className={[
                      styles.trendBar,
                      isToday ? styles.trendBarToday : '',
                      d.count === 0 ? styles.trendBarZero : '',
                    ].join(' ')}
                    style={{ height: `${pct}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className={styles.trendLegend}>
            <span>30 יום אחרונים</span>
            <span>היום →</span>
          </div>
        </article>

      </section>

      {/* RECENT CLICKS TABLE */}
      <article className={styles.panel}>
        <header className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>קליקים אחרונים</h2>
          <span className={styles.panelSub}>{monthCount} ב-30 יום · מציג {recentClicks.length} אחרונים</span>
        </header>
        {recentClicks.length === 0 ? (
          <p className={styles.empty}>עדיין אין קליקים מוקלטים.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>תאריך</th>
                  <th>שעה</th>
                  <th>קישור</th>
                  <th>מקור</th>
                  <th>מדיום</th>
                  <th>קמפיין</th>
                  <th>מכשיר</th>
                  <th>referrer</th>
                </tr>
              </thead>
              <tbody>
                {recentClicks.map(c => {
                  const { date, time } = formatDateTime(c.created_at);
                  const device = parseDevice(c.user_agent);
                  return (
                    <tr key={c.id}>
                      <td className={styles.tdMono}>{date}</td>
                      <td className={styles.tdMono}>{time}</td>
                      <td><span className={styles.slugBadge}>{c.slug}</span></td>
                      <td>{c.utm_source ? <span className={styles.sourceBadge}>{c.utm_source}</span> : <span className={styles.na}>—</span>}</td>
                      <td className={styles.tdGray}>{c.utm_medium ?? <span className={styles.na}>—</span>}</td>
                      <td className={styles.tdGray}>{c.utm_campaign ?? <span className={styles.na}>—</span>}</td>
                      <td>
                        <span className={`${styles.deviceBadge} ${device === 'mobile' ? styles.deviceMobile : styles.deviceDesktop}`}>
                          {device === 'mobile' ? <Smartphone size={11} strokeWidth={2} /> : <Monitor size={11} strokeWidth={2} />}
                          {device === 'mobile' ? 'מובייל' : 'דסקטופ'}
                        </span>
                      </td>
                      <td className={styles.tdReferrer}>
                        {c.referrer ? shortenReferrer(c.referrer) : <span className={styles.na}>—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </article>

    </div>
  );
}

function KpiCard({
  label, value, sub, accent, icon,
}: {
  label: string;
  value: number;
  sub?: string;
  accent: 'brand' | 'success' | 'info' | 'warning';
  icon: React.ReactNode;
}) {
  const cls = {
    brand:   styles.kpiAccentBrand,
    success: styles.kpiAccentSuccess,
    info:    styles.kpiAccentInfo,
    warning: styles.kpiAccentWarning,
  }[accent];
  return (
    <div className={`${styles.kpiCard} ${cls}`}>
      <div className={styles.kpiLabel}><span className={styles.kpiIcon}>{icon}</span>{label}</div>
      <div className={styles.kpiValue}>{value.toLocaleString('he-IL')}</div>
      {sub && <div className={styles.kpiSub}>{sub}</div>}
    </div>
  );
}
