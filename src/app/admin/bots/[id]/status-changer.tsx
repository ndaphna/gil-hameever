'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Check } from 'lucide-react';
import { BRIEF_STATUSES, BRIEF_STATUS_LABEL, BriefStatus } from '@/lib/bots/schema';
import styles from './detail.module.css';

/**
 * Returns the statuses the user can transition to from current.
 * Mirrors the DB trigger `bots.enforce_brief_transition`.
 * 'live' is excluded — that path goes through the Mark Live form (Flow ID).
 */
function allowedTargets(current: BriefStatus, isAdmin: boolean): BriefStatus[] {
  const all = BRIEF_STATUSES.filter((s) => s !== current && s !== 'live');
  if (isAdmin) return all;
  // Creator: draft → submitted, draft/submitted → archived
  return all.filter((s) => {
    if (current === 'draft' && s === 'submitted') return true;
    if ((current === 'draft' || current === 'submitted') && s === 'archived') return true;
    return false;
  });
}

const STATUS_BADGE: Record<BriefStatus, string> = {
  draft: styles.badgeDraft,
  submitted: styles.badgeSubmitted,
  building: styles.badgeBuilding,
  live: styles.badgeLive,
  archived: styles.badgeArchived,
};

export default function StatusChanger({
  briefId,
  currentStatus,
  isAdmin,
}: {
  briefId: string;
  currentStatus: BriefStatus;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const targets = allowedTargets(currentStatus, isAdmin);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  // If there's nothing the user can do, show a plain badge (no dropdown).
  if (targets.length === 0) {
    return (
      <span className={`${styles.badge} ${STATUS_BADGE[currentStatus]}`}>
        {BRIEF_STATUS_LABEL[currentStatus]}
      </span>
    );
  }

  const change = async (next: BriefStatus) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/bots/${briefId}/status`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.detail ?? data.error ?? 'שינוי הסטטוס נכשל');
        return;
      }
      setOpen(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div ref={wrapRef} className={styles.statusChangerWrap}>
      <button
        type="button"
        className={`${styles.badge} ${STATUS_BADGE[currentStatus]} ${styles.statusTrigger}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={busy}
      >
        {BRIEF_STATUS_LABEL[currentStatus]}
        <ChevronDown size={12} />
      </button>
      {open && (
        <div className={styles.statusMenu} role="listbox">
          <div className={styles.statusMenuLabel}>שני סטטוס ל:</div>
          {targets.map((t) => (
            <button
              key={t}
              type="button"
              className={styles.statusMenuItem}
              onClick={() => change(t)}
              disabled={busy}
              role="option"
            >
              <span className={`${styles.badge} ${STATUS_BADGE[t]}`}>
                {BRIEF_STATUS_LABEL[t]}
              </span>
            </button>
          ))}
          {isAdmin && currentStatus !== 'live' && (
            <p className={styles.statusMenuFootnote}>
              למעבר ל-"פעיל" השתמש בטופס Mark Live למטה (דורש Flow ID).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
