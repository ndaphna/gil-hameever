'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './MemoryPanel.module.css';

type Memory = {
  context_summary: string | null;
  current_stage: string | null;
  active_symptoms: string[];
  things_tried: Array<{ action: string; outcome?: string }>;
  last_distilled_at: string | null;
  updated_at: string;
};

const STAGE_HEBREW: Record<string, string> = {
  pre_menopause:  'טרום-מעבר',
  perimenopause:  'פרי-מנופאוזה',
  menopause:      'מנופאוזה',
  postmenopause:  'פוסט-מנופאוזה',
  unknown:        'לא ברור עדיין',
};

export function MemoryPanel() {
  const [open, setOpen] = useState(false);
  const [memory, setMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('/api/aliza/memory')
      .then(r => r.ok ? r.json() : { memory: null })
      .then(j => setMemory(j.memory))
      .catch(() => setMemory(null))
      .finally(() => setLoading(false));
  }, [open]);

  const handleForget = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setLoading(true);
    const resp = await fetch('/api/aliza/memory', { method: 'DELETE' });
    if (resp.ok) {
      setMemory(null);
      setConfirming(false);
    }
    setLoading(false);
  };

  // Portal target: <body>. Avoids being clipped by any ancestor with
  // overflow:hidden or transform (e.g. the chat shell's overflow:hidden).
  const drawerNode = open ? (
    <div className={styles.overlay} onClick={() => setOpen(false)}>
      <aside
        className={styles.drawer}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="מה עליזה זוכרת עליי"
      >
            <div className={styles.header}>
              <h2 className={styles.title}>מה עליזה זוכרת עליי</h2>
              <button
                type="button"
                className={styles.close}
                onClick={() => setOpen(false)}
                aria-label="סגור"
              >
                ✕
              </button>
            </div>

            <div className={styles.body}>
              {loading && <p className={styles.muted}>טוען...</p>}

              {!loading && (() => {
                // "Empty" = no row OR row exists but has no distilled content.
                // (A row is created at message #1; the distiller fills it at message #6.)
                const isEmpty = !memory
                  || (!memory.context_summary
                      && (!memory.active_symptoms || memory.active_symptoms.length === 0)
                      && (!memory.things_tried || memory.things_tried.length === 0)
                      && (!memory.current_stage || memory.current_stage === 'unknown'));
                if (!isEmpty) return null;
                return (
                  <>
                    <p className={styles.muted}>עליזה עוד לא יודעת עלייך כלום.</p>
                    <p className={styles.muted} style={{ fontSize: 13, opacity: 0.7, marginTop: 8 }}>
                      אחרי 6 הודעות בשיחה, היא תזקק לעצמה סיכום של מה שחשוב לדעת עלייך, מה שניסית, ואיך לעזור לך טוב יותר. הכל יופיע כאן בפעם הבאה שתפתחי את הפאנל.
                    </p>
                  </>
                );
              })()}

              {!loading && memory && (memory.context_summary || (memory.active_symptoms && memory.active_symptoms.length > 0) || (memory.things_tried && memory.things_tried.length > 0)) && (
                <>
                  {memory.current_stage && memory.current_stage !== 'unknown' && (
                    <section className={styles.section}>
                      <h3>שלב</h3>
                      <p>{STAGE_HEBREW[memory.current_stage] ?? memory.current_stage}</p>
                    </section>
                  )}

                  {memory.active_symptoms?.length > 0 && (
                    <section className={styles.section}>
                      <h3>תסמינים פעילים</h3>
                      <ul className={styles.tagList}>
                        {memory.active_symptoms.map(s => (
                          <li key={s} className={styles.tag}>{s}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {memory.context_summary && (
                    <section className={styles.section}>
                      <h3>סיכום</h3>
                      <p className={styles.summary}>{memory.context_summary}</p>
                    </section>
                  )}

                  {memory.things_tried?.length > 0 && (
                    <section className={styles.section}>
                      <h3>כלים שכבר ניסית</h3>
                      <ul className={styles.list}>
                        {memory.things_tried.map((t, i) => (
                          <li key={i}>
                            <strong>{t.action}</strong>
                            {t.outcome && <span className={styles.outcome}> ← {t.outcome}</span>}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  <button
                    type="button"
                    className={`${styles.forget} ${confirming ? styles.confirming : ''}`}
                    onClick={handleForget}
                    disabled={loading}
                  >
                    {confirming ? 'בטוחה? לחצי שוב כדי לאשר' : 'שכחי הכל'}
                  </button>
                </>
              )}
        </div>
      </aside>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label="מה עליזה זוכרת עליי"
      >
        💭 מה עליזה זוכרת עליי
      </button>
      {drawerNode && typeof document !== 'undefined'
        ? createPortal(drawerNode, document.body)
        : null}
    </>
  );
}
