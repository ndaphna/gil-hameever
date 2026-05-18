'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Archive, Check, Pencil, Send, Download, Calendar, Zap, X, Clock, Repeat, ListPlus, ImagePlus, RefreshCw, Trash2, Mail, Eye } from 'lucide-react';
import { renderPreviewHtml } from '@/lib/newsletter/render-preview';
import styles from './edit.module.css';

type DraftStatus = 'draft' | 'published' | 'archived';

export type InitialDraft = {
  id: string;
  subject: string;
  body_text: string;
  tags: string[];
  locale: string;
  status: DraftStatus;
  brevo_template_id: number | null;
  broadcast_scheduled_at: string | null;
  broadcast_sent_at: string | null;
  brevo_campaign_id: number | null;
  automation_config_id: string | null;
  automation_delay_days: number | null;
  automation_order: number | null;
  automation_enqueued_at: string | null;
  automation_stats: { pending: number; sent: number; failed: number };
  intended_for_automation: boolean;
  intended_automation_delay_days: number | null;
  header_image_url: string | null;
  header_image_prompt: string | null;
  header_image_provider: string | null;
};

type HeaderImageStyle = 'realistic' | 'illustration' | 'landscape' | 'infographic';

const HEADER_STYLE_LABELS: Record<HeaderImageStyle, string> = {
  landscape: 'נוף',
  illustration: 'איור',
  realistic: 'ריאליסטית',
  infographic: 'אינפוגרפיקה',
};

const STATUS_LABEL: Record<DraftStatus, string> = {
  draft: 'טיוטה',
  published: 'פורסם',
  archived: 'בארכיון',
};

function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

export default function DraftEditor({ initial }: { initial: InitialDraft }) {
  const router = useRouter();

  const [subject, setSubject] = useState(initial.subject);
  const [body, setBody] = useState(initial.body_text);
  const [tagsRaw, setTagsRaw] = useState(initial.tags.join(', '));
  const [status, setStatus] = useState<DraftStatus>(initial.status);
  const [locale] = useState(initial.locale);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const [brevoTemplateId, setBrevoTemplateId] = useState<number | null>(
    initial.brevo_template_id,
  );
  const [initialSubject, setInitialSubject] = useState(initial.subject);

  const [isPulling, setIsPulling] = useState(false);
  const [pullError, setPullError] = useState<string | null>(null);
  const [pullSuccess, setPullSuccess] = useState<string | null>(null);

  const [broadcastScheduledAt, setBroadcastScheduledAt] = useState<string | null>(
    initial.broadcast_scheduled_at,
  );
  const [broadcastSentAt, setBroadcastSentAt] = useState<string | null>(
    initial.broadcast_sent_at,
  );
  const [brevoCampaignId, setBrevoCampaignId] = useState<number | null>(
    initial.brevo_campaign_id,
  );
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastError, setBroadcastError] = useState<string | null>(null);
  const [broadcastSuccess, setBroadcastSuccess] = useState<string | null>(null);
  const [scheduledInputOpen, setScheduledInputOpen] = useState(false);
  const [scheduledLocal, setScheduledLocal] = useState(''); // datetime-local string

  const [automationConfigId, setAutomationConfigId] = useState<string | null>(
    initial.automation_config_id,
  );
  const [automationDelayDays, setAutomationDelayDays] = useState<number | null>(
    initial.automation_delay_days,
  );
  const [automationOrder, setAutomationOrder] = useState<number | null>(
    initial.automation_order,
  );
  const [automationStats, setAutomationStats] = useState(initial.automation_stats);
  const [intendedForAutomation, setIntendedForAutomation] = useState(
    initial.intended_for_automation,
  );
  const [delayInput, setDelayInput] = useState<number>(
    initial.intended_automation_delay_days ?? 8,
  );
  const [isAutomating, setIsAutomating] = useState(false);
  const [automationError, setAutomationError] = useState<string | null>(null);
  const [automationSuccess, setAutomationSuccess] = useState<string | null>(null);

  const [headerImageUrl, setHeaderImageUrl] = useState<string | null>(
    initial.header_image_url,
  );
  const [headerImagePrompt, setHeaderImagePrompt] = useState<string>(
    initial.header_image_prompt ?? '',
  );
  const [headerImageStyle, setHeaderImageStyle] = useState<HeaderImageStyle>('landscape');
  const [headerImageProvider, setHeaderImageProvider] = useState<string | null>(
    initial.header_image_provider,
  );
  const [isImageBusy, setIsImageBusy] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageSuccess, setImageSuccess] = useState<string | null>(null);

  const [testRecipientsRaw, setTestRecipientsRaw] = useState<string>(
    'nitzandaphna@gmail.com, inbal@gilhameever.com',
  );
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [testSuccess, setTestSuccess] = useState<string | null>(null);

  const [previewFirstName, setPreviewFirstName] = useState<string>('ענבל');
  const [previewHtmlFull, setPreviewHtmlFull] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const previewHtml = useMemo(() => renderPreviewHtml(body), [body]);

  const isDirty =
    subject !== initialSubject ||
    body !== initial.body_text ||
    status !== initial.status ||
    tagsRaw !== initial.tags.join(', ');

  async function save(overrideStatus?: DraftStatus) {
    if (!subject.trim()) {
      setSaveError('צריך נושא');
      return;
    }
    if (!body.trim()) {
      setSaveError('הטיוטה ריקה');
      return;
    }
    const effectiveStatus = overrideStatus ?? status;
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      const res = await fetch(
        `/api/admin/newsletter/${initial.id}/update`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: subject.trim(),
            body_text: body,
            tags: parseTags(tagsRaw),
            locale,
            status: effectiveStatus,
          }),
        },
      );
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setSaveError(json.detail ? `${json.error}: ${json.detail}` : json.error);
        return;
      }
      if (overrideStatus) {
        setStatus(overrideStatus);
      }
      setSaveSuccess(`נשמר. גרסה ${json.version}.`);
      router.refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSaving(false);
    }
  }

  async function broadcast(mode: 'now' | 'scheduled') {
    if (isDirty) {
      setBroadcastError('יש לשמור שינויים לפני שליחה');
      return;
    }
    if (!brevoTemplateId) {
      setBroadcastError('צריך לסנכרן לתבנית ב-Brevo קודם');
      return;
    }
    let scheduledIso: string | undefined;
    if (mode === 'scheduled') {
      if (!scheduledLocal) {
        setBroadcastError('בחרי תאריך ושעה');
        return;
      }
      const when = new Date(scheduledLocal); // datetime-local → local-time Date
      if (isNaN(when.getTime())) {
        setBroadcastError('תאריך לא תקין');
        return;
      }
      if (when.getTime() < Date.now() + 60_000) {
        setBroadcastError('התזמון חייב להיות לפחות דקה מהעכשיו');
        return;
      }
      scheduledIso = when.toISOString();
    }
    const confirmMsg =
      mode === 'now'
        ? `לשלוח את "${subject}" עכשיו לכל הנמענות ברשימה הראשית?`
        : `לתזמן את "${subject}" לשליחה ב-${new Date(scheduledLocal).toLocaleString('he-IL')}?`;
    if (!window.confirm(confirmMsg)) return;

    setIsBroadcasting(true);
    setBroadcastError(null);
    setBroadcastSuccess(null);
    try {
      const res = await fetch(
        `/api/admin/newsletter/${initial.id}/broadcast`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode, scheduled_at: scheduledIso }),
        },
      );
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setBroadcastError(json.detail ? `${json.error}: ${json.detail}` : json.error);
        return;
      }
      setBrevoCampaignId(json.campaign_id);
      if (mode === 'now') {
        const now = new Date().toISOString();
        setBroadcastSentAt(now);
        setBroadcastScheduledAt(null);
        setStatus('published');
        setBroadcastSuccess('נשלח בהצלחה לכל הרשימה.');
      } else {
        setBroadcastScheduledAt(json.scheduled_at);
        setBroadcastSentAt(null);
        setScheduledInputOpen(false);
        setBroadcastSuccess(
          `מתוזמן ל-${new Date(json.scheduled_at).toLocaleString('he-IL')}.`,
        );
      }
      router.refresh();
    } catch (err) {
      setBroadcastError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsBroadcasting(false);
    }
  }

  async function cancelBroadcast() {
    if (!window.confirm('לבטל את התזמון של השליחה?')) return;
    setIsBroadcasting(true);
    setBroadcastError(null);
    setBroadcastSuccess(null);
    try {
      const res = await fetch(
        `/api/admin/newsletter/${initial.id}/cancel-broadcast`,
        { method: 'POST' },
      );
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setBroadcastError(json.detail ? `${json.error}: ${json.detail}` : json.error);
        return;
      }
      setBroadcastScheduledAt(null);
      setBrevoCampaignId(null);
      setBroadcastSuccess('התזמון בוטל.');
      router.refresh();
    } catch (err) {
      setBroadcastError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsBroadcasting(false);
    }
  }

  async function approveToAutomation() {
    if (isDirty) {
      setAutomationError('יש לשמור שינויים לפני אישור');
      return;
    }
    if (delayInput < 1 || delayInput > 365) {
      setAutomationError('דיליי בין 1 ל-365 ימים');
      return;
    }
    if (!window.confirm(`לאשר את "${subject}" כשלב חדש בסוף סדרת ה-Welcome עם דיליי של ${delayInput} ימים?\n\nהפעולה תסנכרן ל-Brevo, תכניס לסדרה ותסמן כפורסם.`)) {
      return;
    }
    setIsAutomating(true);
    setAutomationError(null);
    setAutomationSuccess(null);
    try {
      const res = await fetch(
        `/api/admin/newsletter/${initial.id}/approve-to-automation`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ delay_days: delayInput }),
        },
      );
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setAutomationError(json.detail ? `${json.error}: ${json.detail}` : json.error);
        return;
      }
      setAutomationConfigId(json.automation_order ? 'enqueued' : null);
      setAutomationOrder(json.automation_order);
      setAutomationDelayDays(json.delay_days);
      setAutomationStats({
        pending: json.sends_inserted,
        sent: 0,
        failed: 0,
      });
      setIntendedForAutomation(false);
      setStatus('published');
      if (json.brevo_template_id) setBrevoTemplateId(json.brevo_template_id);
      setAutomationSuccess(
        `אושר ופורסם. שלב #${json.automation_order}, ${json.sends_inserted} נרשמו בתור (${json.sends_retroactive} catch-up למנויות ותיקות, ${json.sends_future} מתוזמנות לפי הלוח שלהן).`,
      );
      router.refresh();
    } catch (err) {
      setAutomationError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsAutomating(false);
    }
  }

  async function clearAutomationIntent() {
    if (!window.confirm('להסיר את הסימון "מיועדת לאוטומציה"? הטיוטה תישאר כטיוטה רגילה.')) {
      return;
    }
    setIsAutomating(true);
    setAutomationError(null);
    setAutomationSuccess(null);
    try {
      const res = await fetch(
        `/api/admin/newsletter/${initial.id}/update`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: subject.trim(),
            body_text: body,
            tags: tagsRaw.split(',').map((t) => t.trim()).filter(Boolean),
            locale,
            status,
            intended_for_automation: false,
          }),
        },
      );
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setAutomationError(json.detail ? `${json.error}: ${json.detail}` : json.error);
        return;
      }
      setIntendedForAutomation(false);
      setAutomationSuccess('הוסר הסימון. הטיוטה רגילה.');
      router.refresh();
    } catch (err) {
      setAutomationError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsAutomating(false);
    }
  }

  async function enqueueAutomation() {
    if (isDirty) {
      setAutomationError('יש לשמור שינויים לפני הוספה לאוטומציה');
      return;
    }
    if (!brevoTemplateId) {
      setAutomationError('צריך לסנכרן לתבנית ב-Brevo קודם');
      return;
    }
    if (delayInput < 1 || delayInput > 365) {
      setAutomationError('דיליי בין 1 ל-365 ימים');
      return;
    }
    if (!window.confirm(`להוסיף את "${subject}" כשלב חדש בסוף "דיוור ברוכה הבאה" עם דיליי של ${delayInput} ימים מהשלב האחרון?`)) {
      return;
    }
    setIsAutomating(true);
    setAutomationError(null);
    setAutomationSuccess(null);
    try {
      const res = await fetch(
        `/api/admin/newsletter/${initial.id}/enqueue-automation`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ delay_days: delayInput }),
        },
      );
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setAutomationError(json.detail ? `${json.error}: ${json.detail}` : json.error);
        return;
      }
      setAutomationConfigId(json.config_id);
      setAutomationDelayDays(json.delay_days);
      setAutomationOrder(json.automation_order);
      setAutomationStats({
        pending: json.sends_inserted,
        sent: 0,
        failed: 0,
      });
      setAutomationSuccess(
        `נוסף כשלב #${json.automation_order}. ${json.sends_inserted} נרשמו בתור (${json.sends_retroactive} catch-up, ${json.sends_future} עתידיות, ${json.total_subscribers} סה״כ).`,
      );
      router.refresh();
    } catch (err) {
      setAutomationError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsAutomating(false);
    }
  }

  async function dequeueAutomation() {
    if (!window.confirm('להוציא מהאוטומציה? שליחות שעוד לא נשלחו יבוטלו. היסטוריית שליחות נשמרת לסטטיסטיקות.')) {
      return;
    }
    setIsAutomating(true);
    setAutomationError(null);
    setAutomationSuccess(null);
    try {
      const res = await fetch(
        `/api/admin/newsletter/${initial.id}/dequeue-automation`,
        { method: 'POST' },
      );
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setAutomationError(json.detail ? `${json.error}: ${json.detail}` : json.error);
        return;
      }
      setAutomationConfigId(null);
      setAutomationDelayDays(null);
      setAutomationOrder(null);
      setAutomationStats((s) => ({ ...s, pending: 0 }));
      setAutomationSuccess(`הוסר מהאוטומציה. ${json.pending_deleted} בוטלו, ${json.kept_history} בהיסטוריה.`);
      router.refresh();
    } catch (err) {
      setAutomationError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsAutomating(false);
    }
  }

  async function refreshFullPreview() {
    setIsPreviewLoading(true);
    setPreviewError(null);
    try {
      const res = await fetch(
        `/api/admin/newsletter/${initial.id}/preview`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject,
            body_text: body,
            header_image_url: headerImageUrl,
            first_name: previewFirstName,
          }),
        },
      );
      if (!res.ok) {
        const text = await res.text();
        setPreviewError(`${res.status}: ${text.slice(0, 200)}`);
        return;
      }
      const html = await res.text();
      setPreviewHtmlFull(html);
    } catch (err) {
      setPreviewError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsPreviewLoading(false);
    }
  }

  async function sendTest() {
    if (isDirty) {
      setTestError('יש לשמור שינויים לפני שליחת טסט');
      return;
    }
    const recipients = testRecipientsRaw
      .split(/[,\s;]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (recipients.length === 0) {
      setTestError('צריך כתובת מייל אחת לפחות');
      return;
    }
    setIsSendingTest(true);
    setTestError(null);
    setTestSuccess(null);
    try {
      const res = await fetch(
        `/api/admin/newsletter/${initial.id}/send-test`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipients }),
        },
      );
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setTestError(json.detail ? `${json.error}: ${json.detail}` : json.error);
        return;
      }
      if (json.template_id && json.template_id !== brevoTemplateId) {
        setBrevoTemplateId(json.template_id);
      }
      setTestSuccess(`נשלח טסט אל ${json.sent_to.join(', ')}.`);
      router.refresh();
    } catch (err) {
      setTestError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSendingTest(false);
    }
  }

  async function generateHeaderImage() {
    setIsImageBusy(true);
    setImageError(null);
    setImageSuccess(null);
    try {
      const res = await fetch(
        `/api/admin/newsletter/${initial.id}/generate-image`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: headerImagePrompt.trim() || undefined,
            style: headerImageStyle,
          }),
        },
      );
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setImageError(json.detail ? `${json.error}: ${json.detail}` : json.error);
        return;
      }
      setHeaderImageUrl(json.url);
      setHeaderImagePrompt(json.prompt);
      setHeaderImageProvider(json.provider);
      setImageSuccess('התמונה נוצרה. אם פורסם ל-Brevo, סנכרני שוב.');
      router.refresh();
    } catch (err) {
      setImageError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsImageBusy(false);
    }
  }

  async function deleteHeaderImage() {
    if (!window.confirm('להסיר את תמונת הראש?')) return;
    setIsImageBusy(true);
    setImageError(null);
    setImageSuccess(null);
    try {
      const res = await fetch(
        `/api/admin/newsletter/${initial.id}/header-image`,
        { method: 'DELETE' },
      );
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setImageError(json.detail ? `${json.error}: ${json.detail}` : json.error);
        return;
      }
      setHeaderImageUrl(null);
      setHeaderImagePrompt('');
      setHeaderImageProvider(null);
      setImageSuccess('הוסרה.');
      router.refresh();
    } catch (err) {
      setImageError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsImageBusy(false);
    }
  }

  async function pullFromBrevo() {
    if (isDirty) {
      setPullError('יש לשמור שינויים לפני משיכה מ-Brevo');
      return;
    }
    setIsPulling(true);
    setPullError(null);
    setPullSuccess(null);
    try {
      const res = await fetch(
        `/api/admin/newsletter/${initial.id}/pull-from-brevo`,
        { method: 'POST' },
      );
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setPullError(json.detail ? `${json.error}: ${json.detail}` : json.error);
        return;
      }
      if (json.subject_changed) {
        setSubject(json.subject);
        setInitialSubject(json.subject);
        setPullSuccess(`נמשך מ-Brevo. הנושא עודכן ל: "${json.subject}".`);
      } else {
        setPullSuccess('הנושא ב-Brevo זהה לזה שבאתר. אין מה לעדכן.');
      }
      router.refresh();
    } catch (err) {
      setPullError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsPulling(false);
    }
  }

  const broadcastBlockedReason: string | null = (() => {
    if (broadcastSentAt) return null; // shown as completion state, not a block
    if (isDirty) return 'שמרי שינויים לפני שליחה';
    if (!body.trim() || !subject.trim()) return 'חסר נושא או גוף';
    return null;
  })();

  return (
    <>
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <Pencil size={16} strokeWidth={2.25} style={{ color: 'var(--nl-gray-500)' }} />
        עריכה
        {isDirty && <span className={styles.dirtyHint}>שינויים לא נשמרו</span>}
      </h2>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="subject">
          שורת נושא של המייל
        </label>
        <input
          id="subject"
          type="text"
          className={styles.input}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div className={styles.editorGrid}>
        <div className={styles.editorPane}>
          <div className={styles.paneHeader}>עריכה</div>
          <textarea
            className={styles.textarea}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className={styles.editorPane}>
          <div className={styles.paneHeader}>תצוגה מקדימה</div>
          <div
            className={styles.preview}
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </div>
      </div>

      <div className={styles.fieldsRow} style={{ marginTop: '1rem' }}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="tags">
            תגיות (מופרדות בפסיק)
          </label>
          <input
            id="tags"
            type="text"
            className={styles.input}
            value={tagsRaw}
            onChange={(e) => setTagsRaw(e.target.value)}
            placeholder="שינה, גיל המעבר"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="status">
            סטטוס
          </label>
          <select
            id="status"
            className={styles.select}
            value={status}
            onChange={(e) => setStatus(e.target.value as DraftStatus)}
          >
            <option value="draft">{STATUS_LABEL.draft}</option>
            <option value="published">{STATUS_LABEL.published}</option>
            <option value="archived">{STATUS_LABEL.archived}</option>
          </select>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => router.push('/admin/newsletter')}
          disabled={isSaving || isPulling || isBroadcasting || isAutomating}
        >
          חזרה לרשימה
        </button>
        <button
          type="button"
          className={styles.dangerButton}
          onClick={() => save('archived')}
          disabled={isSaving || isPulling || isBroadcasting || isAutomating || status === 'archived'}
        >
          <Archive size={14} strokeWidth={2.25} />
          ארכבי
        </button>
        <div className={styles.actionsSpacer} />
        {brevoTemplateId !== null && (
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={pullFromBrevo}
            disabled={isSaving || isPulling || isBroadcasting || isAutomating || isDirty}
            title={isDirty ? 'שמרי שינויים לפני משיכה' : 'משוך את הנושא הנוכחי מ-Brevo'}
          >
            {isPulling ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                מושכת
              </>
            ) : (
              <>
                <Download size={14} strokeWidth={2.25} />
                משכי מ-Brevo
              </>
            )}
          </button>
        )}
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => save()}
          disabled={isSaving || isPulling || isBroadcasting || isAutomating || !isDirty || !body.trim() || !subject.trim()}
        >
          {isSaving ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              שומרת
            </>
          ) : (
            <>
              <Save size={14} strokeWidth={2.25} />
              שמרי שינויים
            </>
          )}
        </button>
      </div>

      {brevoTemplateId !== null && (
        <div className={styles.syncedBadgeRow}>
          <span className={styles.syncedBadge}>
            <Check size={12} strokeWidth={2.75} />
            תבנית Brevo #{brevoTemplateId}
          </span>
        </div>
      )}

      {saveError && <div className={styles.statusError}>{saveError}</div>}
      {saveSuccess && (
        <div className={styles.statusSuccess}>
          <Check size={16} strokeWidth={2.5} />
          {saveSuccess}
        </div>
      )}
      {pullError && <div className={styles.statusError}>{pullError}</div>}
      {pullSuccess && (
        <div className={styles.statusSuccess}>
          <Check size={16} strokeWidth={2.5} />
          {pullSuccess}
        </div>
      )}
    </div>

    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <ImagePlus size={16} strokeWidth={2.25} style={{ color: 'var(--nl-gray-500)' }} />
        תמונת ראש
      </h2>

      {headerImageUrl && (
        <>
          <div className={styles.imagePreviewWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={headerImageUrl}
              alt="תמונת ראש שנוצרה"
              className={styles.imagePreview}
            />
          </div>
          {headerImageProvider && (
            <div className={styles.imageMeta}>
              ספק: {headerImageProvider} · {headerImageUrl}
            </div>
          )}
        </>
      )}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="header-image-prompt">
          פרומפט (אופציונלי, באנגלית — השאירי ריק כדי לתת ל-Sonnet לכתוב מהנושא והגוף)
        </label>
        <textarea
          id="header-image-prompt"
          className={styles.promptTextarea}
          value={headerImagePrompt}
          onChange={(e) => setHeaderImagePrompt(e.target.value)}
          placeholder="e.g. Soft window light spilling over an open journal and a steaming mug, warm muted palette"
          spellCheck={false}
          disabled={isImageBusy}
        />
      </div>

      <div className={styles.fieldsRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="header-image-style">
            סגנון
          </label>
          <select
            id="header-image-style"
            className={styles.select}
            value={headerImageStyle}
            onChange={(e) => setHeaderImageStyle(e.target.value as HeaderImageStyle)}
            disabled={isImageBusy}
          >
            {(Object.keys(HEADER_STYLE_LABELS) as HeaderImageStyle[]).map((k) => (
              <option key={k} value={k}>{HEADER_STYLE_LABELS[k]}</option>
            ))}
          </select>
        </div>
        <div className={styles.field} style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={generateHeaderImage}
            disabled={isImageBusy || isSaving || isPulling || isBroadcasting || isAutomating}
            style={{ width: '100%' }}
          >
            {isImageBusy ? (
              <><span className={styles.spinner} aria-hidden="true" />מייצרת... 10-20 שניות</>
            ) : headerImageUrl ? (
              <><RefreshCw size={14} strokeWidth={2.25} />צרי מחדש</>
            ) : (
              <><ImagePlus size={14} strokeWidth={2.25} />צרי תמונה</>
            )}
          </button>
        </div>
      </div>

      {headerImageUrl && (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.dangerButton}
            onClick={deleteHeaderImage}
            disabled={isImageBusy || isSaving || isPulling || isBroadcasting || isAutomating}
          >
            <Trash2 size={14} strokeWidth={2.25} />
            הסירי
          </button>
        </div>
      )}

      {imageError && <div className={styles.statusError}>{imageError}</div>}
      {imageSuccess && (
        <div className={styles.statusSuccess}>
          <Check size={16} strokeWidth={2.5} />
          {imageSuccess}
        </div>
      )}
    </div>

    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <Eye size={16} strokeWidth={2.25} style={{ color: 'var(--nl-gray-500)' }} />
        תצוגה מקדימה של המייל המלא
      </h2>

      <p style={{ margin: '0 0 1rem 0', color: 'var(--nl-gray-600)', fontSize: 'var(--nl-text-sm)' }}>
        בדיוק מה שהנמענת תראה בתיבה, כולל באנר, תמונת ראש, ברכה, גוף, חתימה ופוטר. עובד גם על שינויים שעוד לא נשמרו.
      </p>

      <div className={styles.fieldsRow}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="preview-first-name">
            שם לתצוגה (ריק = "היי," בלי שם)
          </label>
          <input
            id="preview-first-name"
            type="text"
            className={styles.input}
            value={previewFirstName}
            onChange={(e) => setPreviewFirstName(e.target.value)}
            placeholder="ענבל"
            disabled={isPreviewLoading}
          />
        </div>
        <div className={styles.field} style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={refreshFullPreview}
            disabled={isPreviewLoading || !subject.trim() || !body.trim()}
            style={{ width: '100%' }}
          >
            {isPreviewLoading ? (
              <><span className={styles.spinner} aria-hidden="true" />טוענת</>
            ) : previewHtmlFull ? (
              <><RefreshCw size={14} strokeWidth={2.25} />רענני תצוגה</>
            ) : (
              <><Eye size={14} strokeWidth={2.25} />טעני תצוגה</>
            )}
          </button>
        </div>
      </div>

      {previewHtmlFull && (
        <div className={styles.fullPreviewFrameWrap}>
          <iframe
            title="תצוגה מקדימה של המייל"
            srcDoc={previewHtmlFull}
            className={styles.fullPreviewFrame}
            sandbox="allow-same-origin"
          />
        </div>
      )}

      {previewError && <div className={styles.statusError}>{previewError}</div>}
    </div>

    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <Mail size={16} strokeWidth={2.25} style={{ color: 'var(--nl-gray-500)' }} />
        שליחת טסט
      </h2>

      <p style={{ margin: '0 0 1rem 0', color: 'var(--nl-gray-600)', fontSize: 'var(--nl-text-sm)' }}>
        מסנכרן ל-Brevo את הגרסה המעודכנת (כולל תמונת הראש) ושולח עותק טסט לכתובות שלמטה. אם כתובת לא ברשימה ב-Brevo, הברכה תהיה "היי," בלי שם.
      </p>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="test-recipients">
          כתובות (מופרדות בפסיק, עד 10)
        </label>
        <input
          id="test-recipients"
          type="text"
          className={styles.input}
          value={testRecipientsRaw}
          onChange={(e) => setTestRecipientsRaw(e.target.value)}
          placeholder="nitzandaphna@gmail.com, inbal@gilhameever.com"
          disabled={isSendingTest}
          dir="ltr"
        />
      </div>

      <div className={styles.actions}>
        <div className={styles.actionsSpacer} />
        <button
          type="button"
          className={styles.primaryButton}
          onClick={sendTest}
          disabled={
            isSendingTest || isSaving || isPulling || isBroadcasting || isAutomating ||
            isDirty || !subject.trim() || !body.trim()
          }
        >
          {isSendingTest ? (
            <><span className={styles.spinner} aria-hidden="true" />שולחת טסט</>
          ) : (
            <><Mail size={14} strokeWidth={2.25} />שלחי טסט</>
          )}
        </button>
      </div>

      {testError && <div className={styles.statusError}>{testError}</div>}
      {testSuccess && (
        <div className={styles.statusSuccess}>
          <Check size={16} strokeWidth={2.5} />
          {testSuccess}
        </div>
      )}
    </div>

    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <Send size={16} strokeWidth={2.25} style={{ color: 'var(--nl-gray-500)' }} />
        שליחה לרשימה
      </h2>

      {broadcastSentAt ? (
        <div className={styles.broadcastStateBox}>
          <div className={styles.broadcastStateRow}>
            <Check size={16} strokeWidth={2.5} style={{ color: 'var(--nl-success-fg)' }} />
            <span><strong>נשלח</strong> ב-{new Date(broadcastSentAt).toLocaleString('he-IL')}</span>
          </div>
          {brevoCampaignId !== null && (
            <div className={styles.broadcastMeta}>קמפיין Brevo #{brevoCampaignId}</div>
          )}
        </div>
      ) : broadcastScheduledAt ? (
        <>
          <div className={styles.broadcastStateBox}>
            <div className={styles.broadcastStateRow}>
              <Clock size={16} strokeWidth={2.5} style={{ color: 'var(--nl-warning-fg)' }} />
              <span><strong>מתוזמן</strong> ל-{new Date(broadcastScheduledAt).toLocaleString('he-IL')}</span>
            </div>
            {brevoCampaignId !== null && (
              <div className={styles.broadcastMeta}>קמפיין Brevo #{brevoCampaignId}</div>
            )}
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.dangerButton}
              onClick={cancelBroadcast}
              disabled={isBroadcasting || isSaving || isPulling || isAutomating}
            >
              {isBroadcasting ? (
                <><span className={styles.spinner} aria-hidden="true" />מבטלת</>
              ) : (
                <><X size={14} strokeWidth={2.25} />בטלי תזמון</>
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          <p style={{ margin: '0 0 1rem 0', color: 'var(--nl-gray-600)', fontSize: 'var(--nl-text-sm)' }}>
            השליחה תצא אל הרשימה הראשית (״רשימה מגלי השראה״) בתבנית המסונכרנת.
          </p>

          {broadcastBlockedReason && (
            <div className={styles.statusError} style={{ marginTop: 0, marginBottom: 'var(--nl-space-3)' }}>
              {broadcastBlockedReason}
            </div>
          )}

          {scheduledInputOpen ? (
            <div className={styles.field}>
              <label className={styles.label} htmlFor="scheduled-at">
                מתי לשלוח (זמן מקומי)
              </label>
              <input
                id="scheduled-at"
                type="datetime-local"
                className={styles.input}
                value={scheduledLocal}
                onChange={(e) => setScheduledLocal(e.target.value)}
                disabled={isBroadcasting}
              />
              <div className={styles.actions} style={{ marginTop: 'var(--nl-space-3)' }}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => {
                    setScheduledInputOpen(false);
                    setScheduledLocal('');
                  }}
                  disabled={isBroadcasting}
                >
                  ביטול
                </button>
                <div className={styles.actionsSpacer} />
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => broadcast('scheduled')}
                  disabled={
                    isBroadcasting || !!broadcastBlockedReason || !scheduledLocal
                  }
                >
                  {isBroadcasting ? (
                    <><span className={styles.spinner} aria-hidden="true" />מתזמנת</>
                  ) : (
                    <><Calendar size={14} strokeWidth={2.25} />אשרי תזמון</>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => {
                  setScheduledInputOpen(true);
                  setBroadcastError(null);
                }}
                disabled={isBroadcasting || isAutomating || !!broadcastBlockedReason}
              >
                <Calendar size={14} strokeWidth={2.25} />
                תזמני שליחה
              </button>
              <div className={styles.actionsSpacer} />
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => broadcast('now')}
                disabled={isBroadcasting || isAutomating || !!broadcastBlockedReason}
              >
                {isBroadcasting ? (
                  <><span className={styles.spinner} aria-hidden="true" />שולחת</>
                ) : (
                  <><Zap size={14} strokeWidth={2.25} />שלחי עכשיו</>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {broadcastError && <div className={styles.statusError}>{broadcastError}</div>}
      {broadcastSuccess && (
        <div className={styles.statusSuccess}>
          <Check size={16} strokeWidth={2.5} />
          {broadcastSuccess}
        </div>
      )}
    </div>

    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <Repeat size={16} strokeWidth={2.25} style={{ color: 'var(--nl-gray-500)' }} />
        אוטומציית דיוור ברוכה הבאה
      </h2>

      {automationConfigId ? (
        <>
          <div className={styles.broadcastStateBox}>
            <div className={styles.broadcastStateRow}>
              <Check size={16} strokeWidth={2.5} style={{ color: 'var(--nl-success-fg)' }} />
              <span>
                <strong>שלב #{automationOrder}</strong> בסדרה · דיליי של {automationDelayDays} ימים מהשלב הקודם
              </span>
            </div>
            <div className={styles.broadcastMeta}>
              {automationStats.pending} ממתינות · {automationStats.sent} נשלחו · {automationStats.failed} נכשלו
            </div>
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.dangerButton}
              onClick={dequeueAutomation}
              disabled={isAutomating || isSaving || isPulling || isBroadcasting}
            >
              {isAutomating ? (
                <><span className={styles.spinner} aria-hidden="true" />מסירה</>
              ) : (
                <><X size={14} strokeWidth={2.25} />הסירי מהאוטומציה</>
              )}
            </button>
          </div>
        </>
      ) : intendedForAutomation ? (
        <>
          <div
            className={styles.broadcastStateBox}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.12) 0%, rgba(255, 215, 0, 0.25) 100%)',
              border: '1px solid #f5c542',
            }}
          >
            <div className={styles.broadcastStateRow}>
              <strong>🔔 ממתינה לאישור ענבל</strong>
            </div>
            <div className={styles.broadcastMeta}>
              כשתאשרי — הטיוטה תסונכרן ל-Brevo, תתווסף לסוף הסדרה עם דיליי שתבחרי, ותסומן כפורסמה.
            </div>
          </div>

          {isDirty && (
            <div className={styles.statusError} style={{ marginTop: 0, marginBottom: 'var(--nl-space-3)' }}>
              יש לשמור שינויים לפני אישור
            </div>
          )}
          {!subject.trim() || !body.trim() ? (
            <div className={styles.statusError} style={{ marginTop: 0, marginBottom: 'var(--nl-space-3)' }}>
              חסר נושא או גוף
            </div>
          ) : null}

          <div className={styles.fieldsRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="delay">
                דיליי מהשלב האחרון (ימים)
              </label>
              <input
                id="delay"
                type="number"
                min={1}
                max={365}
                className={styles.input}
                value={delayInput}
                onChange={(e) => setDelayInput(Number(e.target.value))}
                disabled={isAutomating}
              />
            </div>
            <div className={styles.field} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={approveToAutomation}
                disabled={
                  isAutomating || isSaving || isPulling || isBroadcasting ||
                  isDirty || !subject.trim() || !body.trim()
                }
                style={{ width: '100%' }}
              >
                {isAutomating ? (
                  <><span className={styles.spinner} aria-hidden="true" />מאשרת</>
                ) : (
                  <><Check size={14} strokeWidth={2.25} />אשרי והכניסי לסדרה</>
                )}
              </button>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={clearAutomationIntent}
              disabled={isAutomating || isSaving || isPulling || isBroadcasting}
            >
              בטלי כוונה (השאירי כטיוטה רגילה)
            </button>
          </div>
        </>
      ) : (
        <>
          <p style={{ margin: '0 0 1rem 0', color: 'var(--nl-gray-600)', fontSize: 'var(--nl-text-sm)' }}>
            הטיוטה לא סומנה כמיועדת לסדרה. אפשר להוסיף ידנית כאן, או להחזיר את הסימון בעורך.
          </p>

          {broadcastBlockedReason && (
            <div className={styles.statusError} style={{ marginTop: 0, marginBottom: 'var(--nl-space-3)' }}>
              {broadcastBlockedReason}
            </div>
          )}

          <div className={styles.fieldsRow}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="delay">
                דיליי (ימים אחרי השלב האחרון)
              </label>
              <input
                id="delay"
                type="number"
                min={1}
                max={365}
                className={styles.input}
                value={delayInput}
                onChange={(e) => setDelayInput(Number(e.target.value))}
                disabled={isAutomating}
              />
            </div>
            <div className={styles.field} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={enqueueAutomation}
                disabled={
                  isAutomating || isSaving || isPulling || isBroadcasting || !!broadcastBlockedReason
                }
                style={{ width: '100%' }}
              >
                {isAutomating ? (
                  <><span className={styles.spinner} aria-hidden="true" />מוסיפה</>
                ) : (
                  <><ListPlus size={14} strokeWidth={2.25} />הכניסי לאוטומציה</>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {automationError && <div className={styles.statusError}>{automationError}</div>}
      {automationSuccess && (
        <div className={styles.statusSuccess}>
          <Check size={16} strokeWidth={2.5} />
          {automationSuccess}
        </div>
      )}
    </div>
    </>
  );
}
