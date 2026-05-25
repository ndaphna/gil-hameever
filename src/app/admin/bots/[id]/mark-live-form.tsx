'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket } from 'lucide-react';
import styles from './detail.module.css';

export default function MarkLiveForm({
  briefId,
  initialTagSuggestion,
}: {
  briefId: string;
  initialTagSuggestion: string | null;
}) {
  const router = useRouter();
  const [flowId, setFlowId] = useState('');
  const [tag, setTag] = useState(initialTagSuggestion ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string[] | null>(null);

  const handle = async () => {
    if (!flowId.trim()) {
      setError('חובה להדביק Flow ID');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/bots/${briefId}/mark-live`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          manychat_flow_id: flowId.trim(),
          manychat_tag: tag.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'mark_live_failed');
      setResult(data.manychat?.warnings ?? []);
      setTimeout(() => router.refresh(), 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'הסימון נכשל');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.markLiveForm}>
      <p>אחרי שבנית את ה-flow ב-ManyChat — הדביק כאן את ה-ID + הגדר tag לסנכרון Brevo.</p>
      <label className={styles.fieldLabel}>ManyChat Flow ID</label>
      <input
        type="text"
        className={styles.input}
        placeholder="content20221121143034_123456"
        value={flowId}
        onChange={(e) => setFlowId(e.target.value)}
        dir="ltr"
      />
      <label className={styles.fieldLabel} style={{ marginTop: 8 }}>
        Tag לסנכרון (אופציונלי — יווצר אוטומטית אם ריק)
      </label>
      <input
        type="text"
        className={styles.input}
        placeholder="bot-something-abc123"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        dir="ltr"
      />
      {error && <div className={styles.errorBox}>{error}</div>}
      {result !== null && result.length > 0 && (
        <div className={styles.warningBox}>
          <strong>הערות:</strong>
          <ul>
            {result.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        className={`${styles.markLiveBtn}`}
        onClick={handle}
        disabled={submitting}
      >
        <Rocket size={16} />
        {submitting ? 'מסמן...' : 'Mark Live'}
      </button>
    </div>
  );
}
