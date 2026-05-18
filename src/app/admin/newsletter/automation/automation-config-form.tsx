'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Check, Info } from 'lucide-react';
import styles from './automation.module.css';

type Config = {
  id: string;
  name: string;
  display_name: string;
  anchor_day: number;
  recipient_list_id: number;
  is_active: boolean;
  catch_up_spacing_hours: number;
  updated_at: string;
};

export default function AutomationConfigForm({ initial }: { initial: Config }) {
  const router = useRouter();

  const [anchorDay, setAnchorDay] = useState(initial.anchor_day);
  const [recipientListId, setRecipientListId] = useState(initial.recipient_list_id);
  const [displayName, setDisplayName] = useState(initial.display_name);
  const [isActive, setIsActive] = useState(initial.is_active);
  const [catchUpSpacing, setCatchUpSpacing] = useState(initial.catch_up_spacing_hours);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isDirty =
    anchorDay !== initial.anchor_day ||
    recipientListId !== initial.recipient_list_id ||
    displayName !== initial.display_name ||
    isActive !== initial.is_active ||
    catchUpSpacing !== initial.catch_up_spacing_hours;

  async function save() {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/admin/newsletter/automation-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: initial.name,
          anchor_day: anchorDay,
          recipient_list_id: recipientListId,
          display_name: displayName,
          is_active: isActive,
          catch_up_spacing_hours: catchUpSpacing,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.detail ? `${json.error}: ${json.detail}` : json.error);
        return;
      }
      setSuccess('הקונפיג עודכן.');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>{initial.display_name}</h2>

      <div className={styles.infoBox}>
        <Info size={14} strokeWidth={2.25} />
        <span>
          <strong>anchor_day</strong> = סה״כ ימים מהרישום עד ה-Send האחרון בסדרת ה-welcome ב-Brevo. כל ניוזלטר שמוכנס לאוטומציה נשלח <strong>anchor_day + delay של הניוזלטר</strong> ימים מהרישום של כל מנויה.
        </span>
      </div>

      <div className={styles.fieldsRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="display_name">שם תצוגה</label>
          <input
            id="display_name"
            type="text"
            className={styles.input}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled={isSaving}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="anchor_day">
            anchor_day (ימים מהרישום ועד סוף הסדרה ב-Brevo)
          </label>
          <input
            id="anchor_day"
            type="number"
            min={0}
            max={365}
            className={styles.input}
            value={anchorDay}
            onChange={(e) => setAnchorDay(Number(e.target.value))}
            disabled={isSaving}
          />
        </div>
      </div>

      <div className={styles.fieldsRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="list_id">Brevo list ID</label>
          <input
            id="list_id"
            type="number"
            className={styles.input}
            value={recipientListId}
            onChange={(e) => setRecipientListId(Number(e.target.value))}
            disabled={isSaving}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="is_active">פעיל</label>
          <label className={styles.toggleRow}>
            <input
              id="is_active"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={isSaving}
            />
            <span>{isActive ? 'מקבל ניוזלטרים חדשים' : 'מושהה'}</span>
          </label>
        </div>
      </div>

      <div className={styles.fieldsRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="catch_up">
            spacing למנויות ותיקות (שעות)
          </label>
          <input
            id="catch_up"
            type="number"
            min={1}
            max={168}
            className={styles.input}
            value={catchUpSpacing}
            onChange={(e) => setCatchUpSpacing(Number(e.target.value))}
            disabled={isSaving}
          />
          <p style={{ margin: 'var(--nl-space-2) 0 0', fontSize: 'var(--nl-text-xs)', color: 'var(--nl-gray-500)' }}>
            מנויה שכבר עברה את החלון מקבלת ניוזלטרים בקאצ׳-אפ במרווח הזה. ברירת מחדל 24 שעות.
          </p>
        </div>
        <div className={styles.field} />
      </div>

      <div className={styles.actions}>
        <div style={{ flex: 1, fontSize: 'var(--nl-text-xs)', color: 'var(--nl-gray-500)' }}>
          עודכן: {new Date(initial.updated_at).toLocaleString('he-IL')}
        </div>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={save}
          disabled={isSaving || !isDirty}
        >
          {isSaving ? (
            <><span className={styles.spinner} aria-hidden="true" />שומרת</>
          ) : (
            <><Save size={14} strokeWidth={2.25} />שמרי</>
          )}
        </button>
      </div>

      {error && <div className={styles.statusError}>{error}</div>}
      {success && (
        <div className={styles.statusSuccess}>
          <Check size={16} strokeWidth={2.5} />
          {success}
        </div>
      )}
    </div>
  );
}
