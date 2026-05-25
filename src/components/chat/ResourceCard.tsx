'use client';

import Link from 'next/link';
import styles from './ResourceCard.module.css';

export type ResourceCardData = {
  slug: string;
  url: string;
  hebrew_title: string;
  short_desc: string;
  format: 'guide' | 'checklist' | 'protocol' | 'tool' | 'video';
  gated?: boolean;
};

const FORMAT_LABEL: Record<ResourceCardData['format'], string> = {
  guide: 'מדריך',
  checklist: 'צ׳קליסט',
  protocol: 'פרוטוקול',
  tool: 'כלי',
  video: 'וידאו',
};

const FORMAT_EMOJI: Record<ResourceCardData['format'], string> = {
  guide: '📖',
  checklist: '✅',
  protocol: '🌿',
  tool: '🛠️',
  video: '🎬',
};

export function ResourceCard({ data }: { data: ResourceCardData }) {
  return (
    <Link href={data.url} className={styles.card} target="_blank" rel="noopener">
      <div className={styles.icon} aria-hidden="true">{FORMAT_EMOJI[data.format]}</div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.formatBadge}>{FORMAT_LABEL[data.format]}</span>
          {data.gated && <span className={styles.gatedBadge}>הרשמה</span>}
        </div>
        <h4 className={styles.title}>{data.hebrew_title}</h4>
        <p className={styles.desc}>{data.short_desc}</p>
      </div>
      <div className={styles.cta} aria-hidden="true">←</div>
    </Link>
  );
}
