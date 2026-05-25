'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import {
  BRIEF_STATUS_LABEL,
  BRIEF_TYPE_LABEL,
  BriefStatus,
  BriefType,
} from '@/lib/bots/schema';
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

const STATUS_BADGE_CLASS: Record<BriefStatus, string> = {
  draft: styles.badgeDraft,
  submitted: styles.badgeSubmitted,
  building: styles.badgeBuilding,
  live: styles.badgeLive,
  archived: styles.badgeArchived,
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function BriefsList({
  briefs,
  currentUserId,
  isAdmin,
}: {
  briefs: BriefSummary[];
  currentUserId: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const canDelete = (b: BriefSummary) =>
    isAdmin || (b.created_by === currentUserId && b.status === 'draft');

  const deletableBriefs = useMemo(() => briefs.filter(canDelete), [briefs, currentUserId, isAdmin]);
  const allSelected = deletableBriefs.length > 0 && deletableBriefs.every((b) => selected.has(b.id));

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(deletableBriefs.map((b) => b.id)));
    }
  };

  const handleDelete = async () => {
    if (selected.size === 0) return;
    const count = selected.size;
    const ok = window.confirm(
      `למחוק ${count} ${count === 1 ? 'בריף' : 'בריפים'}? פעולה זו לא ניתנת לביטול.`,
    );
    if (!ok) return;

    setDeleting(true);
    try {
      const res = await fetch('/api/admin/bots/bulk-delete', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.detail ?? data.error ?? 'מחיקה נכשלה');
        return;
      }
      setSelected(new Set());
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {deletableBriefs.length > 0 && (
        <div className={styles.bulkBar}>
          <label className={styles.bulkSelectAll}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              disabled={deleting}
            />
            {allSelected ? 'נקה בחירה' : 'בחר הכל'}
            {selected.size > 0 && (
              <span className={styles.bulkCount}>· {selected.size} מסומנים</span>
            )}
          </label>
          {selected.size > 0 && (
            <button
              type="button"
              className={styles.bulkDeleteBtn}
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 size={14} />
              {deleting ? 'מוחק...' : `מחק ${selected.size}`}
            </button>
          )}
        </div>
      )}

      <div className={styles.list}>
        {briefs.map((b) => {
          const selectable = canDelete(b);
          const isSelected = selected.has(b.id);
          const target = b.status === 'draft' ? `/admin/bots/${b.id}/edit` : `/admin/bots/${b.id}`;
          return (
            <div
              key={b.id}
              className={`${styles.row} ${isSelected ? styles.rowSelected : ''}`}
            >
              {selectable && (
                <input
                  type="checkbox"
                  className={styles.rowCheckbox}
                  checked={isSelected}
                  onChange={() => toggle(b.id)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`בחר את ${b.title}`}
                  disabled={deleting}
                />
              )}
              <Link href={target} className={styles.rowLink}>
                <div className={styles.rowMain}>
                  <div className={styles.rowTitle}>{b.title}</div>
                  <div className={styles.rowMeta}>
                    <span>{BRIEF_TYPE_LABEL[b.type]}</span>
                    <span>·</span>
                    <span>נוצר: {formatDate(b.created_at)}</span>
                    {b.submitted_at && (
                      <>
                        <span>·</span>
                        <span>הוגש: {formatDate(b.submitted_at)}</span>
                      </>
                    )}
                    {b.live_at && (
                      <>
                        <span>·</span>
                        <span>עלה לאוויר: {formatDate(b.live_at)}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`${styles.badge} ${STATUS_BADGE_CLASS[b.status]}`}>
                  {BRIEF_STATUS_LABEL[b.status]}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
