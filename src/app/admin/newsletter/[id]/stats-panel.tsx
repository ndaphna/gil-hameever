import { BarChart3, Mail, Eye, MousePointerClick, AlertTriangle, UserMinus, Shield } from 'lucide-react';
import styles from './edit.module.css';

export type DraftEmailStats = {
  delivered_count: number;
  unique_opened_count: number;
  total_opens_count: number;
  unique_clicked_count: number;
  total_clicks_count: number;
  bounced_count: number;
  unsubscribed_count: number;
  spam_count: number;
  blocked_count: number;
  first_event_at: string | null;
  last_event_at: string | null;
};

export type TopLink = { link_url: string; click_count: number };

type Props = {
  stats: DraftEmailStats;
  topLinks: TopLink[];
  automationSent: number;
  broadcastSentAt: string | null;
};

function pct(num: number, denom: number): string {
  if (!denom || denom <= 0) return '—';
  const v = (num / denom) * 100;
  return `${v.toFixed(1)}%`;
}

function fmtDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleString('he-IL') : '—';
}

export default function StatsPanel({ stats, topLinks, automationSent, broadcastSentAt }: Props) {
  const delivered = Number(stats.delivered_count ?? 0);
  const opens = Number(stats.unique_opened_count ?? 0);
  const clicks = Number(stats.unique_clicked_count ?? 0);
  const bounces = Number(stats.bounced_count ?? 0);
  const unsubs = Number(stats.unsubscribed_count ?? 0);
  const spam = Number(stats.spam_count ?? 0);
  const blocked = Number(stats.blocked_count ?? 0);

  const totalEvents =
    delivered + opens + clicks + bounces + unsubs + spam + blocked;
  if (totalEvents === 0 && automationSent === 0 && !broadcastSentAt) {
    return null; // No sends yet, no events — hide the panel completely.
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <BarChart3 size={16} strokeWidth={2.25} style={{ color: 'var(--nl-gray-500)' }} />
        סטטיסטיקות שליחה
      </h2>

      <div className={styles.statsGrid}>
        <div className={styles.statTile}>
          <div className={styles.statTileLabel}>
            <Mail size={14} strokeWidth={2.25} />
            הגיעו ל-inbox
          </div>
          <div className={styles.statTileValue}>{delivered}</div>
        </div>
        <div className={styles.statTile}>
          <div className={styles.statTileLabel}>
            <Eye size={14} strokeWidth={2.25} />
            פתחו
          </div>
          <div className={styles.statTileValue}>
            {opens}{' '}
            <span className={styles.statTilePct}>({pct(opens, delivered)})</span>
          </div>
          {Number(stats.total_opens_count ?? 0) > opens && (
            <div className={styles.statTileSub}>{stats.total_opens_count} פתיחות סה״כ</div>
          )}
        </div>
        <div className={styles.statTile}>
          <div className={styles.statTileLabel}>
            <MousePointerClick size={14} strokeWidth={2.25} />
            לחצו
          </div>
          <div className={styles.statTileValue}>
            {clicks}{' '}
            <span className={styles.statTilePct}>({pct(clicks, delivered)})</span>
          </div>
          {Number(stats.total_clicks_count ?? 0) > clicks && (
            <div className={styles.statTileSub}>{stats.total_clicks_count} קליקים סה״כ</div>
          )}
        </div>
        <div className={`${styles.statTile} ${styles.statTileWarn}`}>
          <div className={styles.statTileLabel}>
            <AlertTriangle size={14} strokeWidth={2.25} />
            נכשלו
          </div>
          <div className={styles.statTileValue}>
            {bounces}{' '}
            <span className={styles.statTilePct}>({pct(bounces, delivered + bounces)})</span>
          </div>
        </div>
        <div className={`${styles.statTile} ${styles.statTileWarn}`}>
          <div className={styles.statTileLabel}>
            <UserMinus size={14} strokeWidth={2.25} />
            ביטלו מנוי
          </div>
          <div className={styles.statTileValue}>{unsubs}</div>
        </div>
        <div className={`${styles.statTile} ${styles.statTileWarn}`}>
          <div className={styles.statTileLabel}>
            <Shield size={14} strokeWidth={2.25} />
            ספאם / חסום
          </div>
          <div className={styles.statTileValue}>{spam + blocked}</div>
        </div>
      </div>

      <div className={styles.statsFooterRow}>
        <span>
          <strong>שליחות:</strong>{' '}
          {automationSent} מאוטומציה
          {broadcastSentAt ? ` · broadcast ב-${fmtDate(broadcastSentAt)}` : ''}
        </span>
        {stats.first_event_at && (
          <span>
            <strong>טווח אירועים:</strong> {fmtDate(stats.first_event_at)} — {fmtDate(stats.last_event_at)}
          </span>
        )}
      </div>

      {topLinks.length > 0 && (
        <div className={styles.topLinksBlock}>
          <h3 className={styles.topLinksTitle}>קישורים מובילים</h3>
          <ol className={styles.topLinksList}>
            {topLinks.map((l) => (
              <li key={l.link_url} className={styles.topLinkItem}>
                <span className={styles.topLinkUrl}>{l.link_url}</span>
                <span className={styles.topLinkCount}>{l.click_count}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
