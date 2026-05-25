'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import EmojiPicker, { insertAtCursor } from './emoji-picker';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Save,
  Trash2,
  Upload,
  Sparkles,
} from 'lucide-react';
import {
  BriefDraftInput,
  BriefType,
  BRIEF_TYPE_LABEL,
  PostScope,
  POST_SCOPE_LABEL,
  parseKeywordList,
  validateForSubmit,
} from '@/lib/bots/schema';
import styles from './new.module.css';

export type WizardState = BriefDraftInput;

export type UploadedAsset = {
  id: string;
  filename: string;
  storage_path: string;
};

type BrevoTemplate = {
  id: number;
  name: string;
  subject: string;
};

const TOTAL_STEPS = 7;

const DEFAULT_DM_TEMPLATE = `היי {{first_name}},

ברוכה הבאה למועדון _______________.
בגיל המעבר________________.
זה מה שמפריד בינינו לבין ____________, ועליזה מבקשת למסור שהיא ____________________________________.😅

ריכזתי לך כאן מידע פשוט וברור על _____________ חשובים דווקא עכשיו, איך להתחיל בלי להיבהל, ומה כדאי לדעת לפני שאת _______________.

תתחילי קטן.
הגוף שלך לא צריך עונש.
הוא צריך שתחזרי להיות בצד שלו.

חיבוק,
ענבל`;

const INITIAL: WizardState = {
  title: '',
  type: 'comment_to_dm',
  post_scope: 'all_posts_and_reels',
  post_url: null,
  keyword_triggers: [],
  story_label: null,
  dm_message: DEFAULT_DM_TEMPLATE,
  cta_button_text: 'תני לי גישה',
  lead_magnet_url: null,
  followup_dm_message: DEFAULT_DM_TEMPLATE,
  followup_dm_delay_minutes: 10,
  brevo_template_id: null,
  followup_delay_hours: 24,
  followup_enabled: false,
  notes: null,
};

export default function NewBriefWizardPage() {
  return <BriefWizard />;
}

export function BriefWizard({
  initialBriefId = null,
  initialState,
  initialAssets,
  mode = 'create',
}: {
  initialBriefId?: string | null;
  initialState?: WizardState;
  initialAssets?: UploadedAsset[];
  mode?: 'create' | 'edit';
} = {}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(initialState ?? INITIAL);
  const [briefId, setBriefId] = useState<string | null>(initialBriefId);
  const [savingStatus, setSavingStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [keywordInput, setKeywordInput] = useState('');
  const [assets, setAssets] = useState<UploadedAsset[]>(initialAssets ?? []);
  const [uploading, setUploading] = useState(false);
  const [templates, setTemplates] = useState<BrevoTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Lazy-load Brevo templates when the user gets near step 6
  useEffect(() => {
    if (step < 5 || templates.length > 0 || templatesLoading) return;
    setTemplatesLoading(true);
    fetch('/api/admin/bots/brevo-templates', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setTemplates(d.templates as BrevoTemplate[]);
      })
      .finally(() => setTemplatesLoading(false));
  }, [step, templates.length, templatesLoading]);

  const update = <K extends keyof WizardState>(key: K, value: WizardState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  // -------- persistence --------
  const persistDraft = async (): Promise<string | null> => {
    setSavingStatus('שומר...');
    setError(null);
    try {
      if (!briefId) {
        const res = await fetch('/api/admin/bots', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(state),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error ?? 'save_failed');
        setBriefId(data.id);
        setSavingStatus(`נשמר · ${new Date().toLocaleTimeString('he-IL')}`);
        return data.id as string;
      }
      const res = await fetch(`/api/admin/bots/${briefId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(state),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'save_failed');
      setSavingStatus(`נשמר · ${new Date().toLocaleTimeString('he-IL')}`);
      return briefId;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'שמירה נכשלה';
      setError(msg);
      setSavingStatus('');
      return null;
    }
  };

  // -------- navigation --------
  const goNext = async () => {
    setError(null);
    const stepCheck = validateStep(step, state);
    if (!stepCheck.ok) {
      setError(stepCheck.error);
      return;
    }
    // Create/update draft when entering asset upload territory (step ≥ 5)
    if (step >= 4 && !briefId) {
      const id = await persistDraft();
      if (!id) return;
    } else if (briefId) {
      const id = await persistDraft();
      if (!id) return;
    }
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const goBack = () => {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async () => {
    setError(null);
    const finalCheck = validateForSubmit(state);
    if (!finalCheck.ok) {
      setError(finalCheck.error);
      return;
    }
    setSubmitting(true);
    try {
      const id = briefId ?? (await persistDraft());
      if (!id) throw new Error('שמירה נכשלה לפני הגשה');
      const res = await fetch(`/api/admin/bots/${id}/submit`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'submit_failed');
      setDone(true);
      setTimeout(() => router.push(`/admin/bots/${id}`), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'הגשה נכשלה');
    } finally {
      setSubmitting(false);
    }
  };

  // -------- file upload --------
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    let id = briefId;
    if (!id) {
      id = await persistDraft();
      if (!id) return;
    }
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      for (const f of Array.from(files)) form.append('files', f);
      const res = await fetch(`/api/admin/bots/${id}/assets`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'upload_failed');
      setAssets((prev) => [...prev, ...(data.assets as UploadedAsset[])]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'העלאה נכשלה');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAsset = async (assetId: string) => {
    if (!briefId) return;
    const res = await fetch(`/api/admin/bots/${briefId}/assets/${assetId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setAssets((prev) => prev.filter((a) => a.id !== assetId));
    }
  };

  // -------- render --------
  if (done) {
    return (
      <div className={styles.page}>
        <div className={styles.successPanel}>
          <h2>הבריף הוגש</h2>
          <p>ניצן קיבל הודעה במייל ובוואטסאפ. מעבירה אותך לעמוד הבריף...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>{mode === 'edit' ? 'עריכת טיוטה' : 'בריף בוט חדש'}</h1>
        <p>
          {mode === 'edit'
            ? 'את עורכת טיוטה קיימת. השינויים נשמרים אוטומטית כשעוברים בין שלבים.'
            : 'מלאי את הפרטים — הבוט יוקם בתוך 24 שעות, לרוב הרבה פחות.'}
        </p>
      </div>

      <StepBar
        current={step}
        total={TOTAL_STEPS}
        onStepClick={async (n) => {
          if (n === step) return;
          // Persist current state before jumping so the user doesn't lose changes
          if (state.title && state.type) {
            await persistDraft();
          }
          setStep(n);
          setError(null);
        }}
      />

      <div className={styles.card}>
        {step === 1 && <Step1Type state={state} update={update} />}
        {step === 2 && <Step2Trigger state={state} update={update} />}
        {step === 3 && (
          <Step3Keywords
            state={state}
            update={update}
            keywordInput={keywordInput}
            setKeywordInput={setKeywordInput}
          />
        )}
        {step === 4 && <Step4Message state={state} update={update} />}
        {step === 5 && (
          <Step5Asset
            state={state}
            update={update}
            assets={assets}
            uploading={uploading}
            onUpload={handleUpload}
            onRemove={handleRemoveAsset}
          />
        )}
        {step === 6 && (
          <Step6Followup
            state={state}
            update={update}
            templates={templates}
            templatesLoading={templatesLoading}
          />
        )}
        {step === 7 && <Step7Review state={state} assets={assets} templates={templates} />}

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={goBack}
            className={styles.btn}
            disabled={step === 1 || submitting}
          >
            <ChevronRight size={16} />
            הקודם
          </button>
          <div style={{ display: 'flex', gap: 'var(--nl-space-3)' }}>
            <button
              type="button"
              onClick={persistDraft}
              className={styles.btn}
              disabled={!state.title || !state.type || submitting}
            >
              <Save size={16} />
              שמור טיוטה
            </button>
            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={goNext}
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={submitting}
              >
                הבא
                <ChevronLeft size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={submitting}
              >
                <Send size={16} />
                {submitting ? 'מגיש...' : 'הגש בריף'}
              </button>
            )}
          </div>
        </div>

        <div className={styles.statusBar}>{savingStatus}</div>
      </div>
    </div>
  );
}

// ---------------- Sub-components ----------------

function StepBar({
  current,
  total,
  onStepClick,
}: {
  current: number;
  total: number;
  onStepClick: (n: number) => void;
}) {
  const items = Array.from({ length: total }, (_, i) => i + 1);
  const labels = ['סוג', 'טריגר', 'מילות מפתח', 'הודעה', 'לינק', 'המשך', 'סקירה'];
  return (
    <div className={styles.stepBar}>
      {items.map((n, idx) => (
        <span
          key={n}
          style={{ display: 'inline-flex', alignItems: 'center', flex: idx < total - 1 ? 1 : '0 0 auto' }}
        >
          <button
            type="button"
            className={`${styles.stepDot} ${styles.stepDotClickable} ${
              n === current ? styles.stepDotActive : n < current ? styles.stepDotDone : ''
            }`}
            onClick={() => onStepClick(n)}
            aria-label={`עבור לשלב ${n}: ${labels[n - 1] ?? ''}`}
            aria-current={n === current ? 'step' : undefined}
            title={labels[n - 1]}
          >
            {n}
          </button>
          {idx < total - 1 && (
            <span
              className={`${styles.stepConnector} ${n < current ? styles.stepConnectorDone : ''}`}
            />
          )}
        </span>
      ))}
    </div>
  );
}

function Step1Type({
  state,
  update,
}: {
  state: WizardState;
  update: <K extends keyof WizardState>(k: K, v: WizardState[K]) => void;
}) {
  const types: { value: BriefType; sub: string }[] = [
    { value: 'comment_to_dm', sub: 'מי שמגיב על פוסט מקבל DM אוטומטי' },
    { value: 'story_reply', sub: 'מי שעונה לסטורי שלך מקבל DM' },
    { value: 'story_mention', sub: 'מי שמאזכר אותך בסטורי מקבל DM' },
  ];
  return (
    <>
      <h2>סוג הבוט</h2>
      <p className={styles.hint}>בוחרת את סוג הטריגר — תוכלי לשנות בהמשך.</p>
      <div className={styles.field}>
        <label className={styles.label}>
          <span className={styles.required}>*</span> שם פנימי לבריף
        </label>
        <input
          type="text"
          className={styles.input}
          placeholder="למשל: מסע נשים 50 - לידים מפוסט אינסטה"
          value={state.title}
          onChange={(e) => update('title', e.target.value)}
        />
        <span className={styles.helperText}>זה השם שלך פנימי. הוא לא נראה לאף אחת מהמשתמשות.</span>
      </div>
      <div className={styles.choices}>
        {types.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`${styles.choice} ${state.type === t.value ? styles.choiceSelected : ''}`}
            onClick={() => update('type', t.value)}
          >
            <span className={styles.choiceTitle}>{BRIEF_TYPE_LABEL[t.value]}</span>
            <span className={styles.choiceSub}>{t.sub}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function Step2Trigger({
  state,
  update,
}: {
  state: WizardState;
  update: <K extends keyof WizardState>(k: K, v: WizardState[K]) => void;
}) {
  if (state.type === 'comment_to_dm') {
    const scopes: { value: PostScope; sub: string }[] = [
      { value: 'all_posts_and_reels', sub: 'כל פוסט וכל ריל באינסטגרם — הבוט יזהה את מילות המפתח בתגובות' },
      { value: 'all_reels', sub: 'רק רילז\'ים' },
      { value: 'all_posts', sub: 'רק פוסטים רגילים' },
      { value: 'specific_post', sub: 'פוסט אחד ספציפי — תצטרכי להדביק לינק' },
    ];
    return (
      <>
        <h2>על אילו פוסטים הבוט יפעל?</h2>
        <p className={styles.hint}>
          ברירת המחדל: על כל הפוסטים והרילז\'ים — הבוט יזהה את מילות המפתח שתגדירי בשלב הבא.
        </p>
        <div className={styles.choices} style={{ marginBottom: 'var(--nl-space-5)' }}>
          {scopes.map((s) => (
            <button
              key={s.value}
              type="button"
              className={`${styles.choice} ${
                state.post_scope === s.value ? styles.choiceSelected : ''
              }`}
              onClick={() => update('post_scope', s.value)}
            >
              <span className={styles.choiceTitle}>{POST_SCOPE_LABEL[s.value]}</span>
              <span className={styles.choiceSub}>{s.sub}</span>
            </button>
          ))}
        </div>

        {state.post_scope === 'specific_post' && (
          <div className={styles.field}>
            <label className={styles.label}>
              <span className={styles.required}>*</span> כתובת URL לפוסט/ריל
            </label>
            <input
              type="url"
              className={styles.input}
              placeholder="https://www.instagram.com/p/..."
              value={state.post_url ?? ''}
              onChange={(e) => update('post_url', e.target.value || null)}
            />
            <span className={styles.helperText}>
              הלינק המלא לפוסט או לריל. לא צריך לתייג מראש ב-ManyChat.
            </span>
          </div>
        )}
      </>
    );
  }
  return (
    <>
      <h2>תיאור הסטורי</h2>
      <p className={styles.hint}>
        סטוריס חיים רק 24 שעות, אז במקום לינק תני תיאור קצר של הסטורי הרלוונטי.
      </p>
      <div className={styles.field}>
        <label className={styles.label}>
          <span className={styles.required}>*</span> תיאור הסטורי
        </label>
        <input
          type="text"
          className={styles.input}
          placeholder="למשל: סטורי על מדריך פרי-מנופאוז שיועלה ב-2026-05-25"
          value={state.story_label ?? ''}
          onChange={(e) => update('story_label', e.target.value || null)}
        />
        <span className={styles.helperText}>
          אם הסטורי כבר עולה, גם זה בסדר — תוסיפי בהערות בסוף.
        </span>
      </div>
    </>
  );
}

function Step3Keywords({
  state,
  update,
  keywordInput,
  setKeywordInput,
}: {
  state: WizardState;
  update: <K extends keyof WizardState>(k: K, v: WizardState[K]) => void;
  keywordInput: string;
  setKeywordInput: (v: string) => void;
}) {
  if (state.type !== 'comment_to_dm') {
    return (
      <>
        <h2>מילות מפתח</h2>
        <p className={styles.hint}>
          לא רלוונטי לסטוריס — נמשיך לשלב הבא. (אנחנו כן רושמים את הסטוריז ל-trigger כללי.)
        </p>
      </>
    );
  }
  const add = () => {
    const list = parseKeywordList(keywordInput);
    if (list.length === 0) return;
    update('keyword_triggers', Array.from(new Set([...state.keyword_triggers, ...list])));
    setKeywordInput('');
  };
  const remove = (kw: string) => {
    update(
      'keyword_triggers',
      state.keyword_triggers.filter((k) => k !== kw),
    );
  };
  return (
    <>
      <h2>מילות מפתח לתגובה</h2>
      <p className={styles.hint}>
        הוסיפי מילים שמי שמגיב עליהן בפוסט יקבל DM. אל תוסיפי וריאציות מיותרות — ManyChat מטפל
        בהטיות אוטומטית.
      </p>
      <div className={styles.field}>
        <label className={styles.label}>
          <span className={styles.required}>*</span> הוספת מילות מפתח
        </label>
        <input
          type="text"
          className={styles.input}
          placeholder="למשל: מדריך, רוצה, אני"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              add();
            }
          }}
          onBlur={add}
        />
        <span className={styles.helperText}>אנטר או פסיק כדי להוסיף.</span>
        <div className={styles.keywordList}>
          {state.keyword_triggers.map((kw) => (
            <span key={kw} className={styles.keywordChip}>
              {kw}
              <button type="button" aria-label={`הסר ${kw}`} onClick={() => remove(kw)}>
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

function Step4Message({
  state,
  update,
}: {
  state: WizardState;
  update: <K extends keyof WizardState>(k: K, v: WizardState[K]) => void;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const handleEmoji = (emoji: string) => {
    const { value, cursor } = insertAtCursor(taRef.current, state.dm_message ?? '', emoji);
    update('dm_message', value);
    requestAnimationFrame(() => {
      if (taRef.current) {
        taRef.current.focus();
        taRef.current.setSelectionRange(cursor, cursor);
      }
    });
  };
  return (
    <>
      <h2>הודעת ה-DM</h2>
      <p className={styles.hint}>
        זאת ההודעה שהבוט ישלח אוטומטית. אפשר להשתמש ב-<code>{`{{first_name}}`}</code> כדי לכלול
        את שם הנמענת. מילאתי לך תבנית — תחליפי את הקווים בתוכן הספציפי.
      </p>
      <div className={styles.field}>
        <label className={styles.label}>
          <span className={styles.required}>*</span> טקסט ההודעה
        </label>
        <div className={styles.textareaToolbar}>
          <EmojiPicker onPick={handleEmoji} />
        </div>
        <textarea
          ref={taRef}
          className={styles.textarea}
          value={state.dm_message ?? ''}
          onChange={(e) => update('dm_message', e.target.value)}
          maxLength={1000}
          rows={16}
        />
        <span className={styles.helperText}>
          {(state.dm_message ?? '').length} / 1000 תווים
        </span>
      </div>
    </>
  );
}

function Step5Asset({
  state,
  update,
  assets,
  uploading,
  onUpload,
  onRemove,
}: {
  state: WizardState;
  update: <K extends keyof WizardState>(k: K, v: WizardState[K]) => void;
  assets: UploadedAsset[];
  uploading: boolean;
  onUpload: (files: FileList | null) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}) {
  return (
    <>
      <h2>הלינק / הקובץ שיישלח</h2>
      <p className={styles.hint}>
        אפשר לתת לינק חיצוני (גוגל-דרייב, דף נחיתה) או להעלות PDF / תמונה ישירות.
      </p>
      <div className={styles.field}>
        <label className={styles.label}>לינק חיצוני</label>
        <input
          type="url"
          className={styles.input}
          placeholder="https://..."
          value={state.lead_magnet_url ?? ''}
          onChange={(e) => update('lead_magnet_url', e.target.value || null)}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>טקסט הכפתור ב-DM</label>
        <input
          type="text"
          className={styles.input}
          placeholder='למשל: "תני לי גישה לדוח" או "אני רוצה את המדריך"'
          value={state.cta_button_text ?? ''}
          onChange={(e) => update('cta_button_text', e.target.value || null)}
          maxLength={40}
        />
        <span className={styles.helperText}>
          זה הטקסט שיופיע על הכפתור בתוך ה-DM שילחץ עליו ומפנה ללינק/קובץ. אם משאירים ריק — לא יהיה כפתור, רק טקסט.
        </span>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>או העלאת קבצים</label>
        <label className={styles.uploadBtn}>
          <Upload size={16} />
          {uploading ? 'מעלה...' : 'בחרי קבצים (PDF, תמונה, וידאו)'}
          <input
            type="file"
            multiple
            accept="image/*,application/pdf,video/mp4,video/quicktime"
            onChange={(e) => onUpload(e.target.files)}
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </label>
        {assets.length > 0 && (
          <div className={styles.assets}>
            {assets.map((a) => (
              <div key={a.id} className={styles.assetRow}>
                <span>{a.filename}</span>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => onRemove(a.id)}
                  aria-label={`הסר ${a.filename}`}
                >
                  <Trash2 size={14} />
                  הסר
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Step6Followup({
  state,
  update,
  templates,
  templatesLoading,
}: {
  state: WizardState;
  update: <K extends keyof WizardState>(k: K, v: WizardState[K]) => void;
  templates: BrevoTemplate[];
  templatesLoading: boolean;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const handleEmoji = (emoji: string) => {
    const { value, cursor } = insertAtCursor(
      taRef.current,
      state.followup_dm_message ?? '',
      emoji,
    );
    update('followup_dm_message', value);
    requestAnimationFrame(() => {
      if (taRef.current) {
        taRef.current.focus();
        taRef.current.setSelectionRange(cursor, cursor);
      }
    });
  };
  return (
    <>
      <h2>הודעות המשך</h2>
      <p className={styles.hint}>
        אחרי שה-DM הראשון נשלח, אפשר להמשיך עם הודעת תזכורת ב-DM (ל-followers שלא לחצו על
        הכפתור) ו/או עם אימייל המשך אחרי שהן יוצרות איתך קשר.
      </p>

      <h3 style={{ margin: 'var(--nl-space-2) 0 var(--nl-space-3)', fontSize: 'var(--nl-text-base)' }}>
        תזכורת ב-DM (תוך ManyChat)
      </h3>
      <div className={styles.field}>
        <label className={styles.label}>טקסט ההודעה</label>
        <div className={styles.textareaToolbar}>
          <EmojiPicker onPick={handleEmoji} />
        </div>
        <textarea
          ref={taRef}
          className={styles.textarea}
          value={state.followup_dm_message ?? ''}
          onChange={(e) => update('followup_dm_message', e.target.value || null)}
          maxLength={1000}
          rows={16}
        />
        <span className={styles.helperText}>
          {(state.followup_dm_message ?? '').length} / 1000 תווים · אם משאירים ריק — לא תישלח תזכורת ·{' '}
          <code>{`{{first_name}}`}</code> = שם הנמענת
        </span>
      </div>
      {state.followup_dm_message && (
        <div className={styles.field}>
          <label className={styles.label}>דיליי לפני התזכורת (בדקות)</label>
          <input
            type="number"
            className={styles.input}
            min={1}
            max={10080}
            value={state.followup_dm_delay_minutes}
            onChange={(e) =>
              update('followup_dm_delay_minutes', Number.parseInt(e.target.value, 10) || 10)
            }
          />
          <span className={styles.helperText}>בין דקה ל-7 ימים. ברירת מחדל: 10 דקות.</span>
        </div>
      )}

      <h3 style={{ margin: 'var(--nl-space-5) 0 var(--nl-space-3)', fontSize: 'var(--nl-text-base)' }}>
        אימייל המשך (דרך Brevo)
      </h3>
      <div className={styles.toggleRow}>
        <div>
          <strong>הפעלת אימייל המשך</strong>
          <span>אחרי שמשתמשת מקבלת DM ונרשמת ב-ManyChat</span>
        </div>
        <button
          type="button"
          className={`${styles.switch} ${state.followup_enabled ? styles.switchOn : ''}`}
          onClick={() => update('followup_enabled', !state.followup_enabled)}
          aria-pressed={state.followup_enabled}
          aria-label="הפעלת follow-up"
        />
      </div>

      {state.followup_enabled && (
        <>
          <div className={styles.field}>
            <label className={styles.label}>
              <span className={styles.required}>*</span> טמפלייט Brevo
            </label>
            <select
              className={styles.select}
              value={state.brevo_template_id ?? ''}
              onChange={(e) =>
                update(
                  'brevo_template_id',
                  e.target.value ? Number.parseInt(e.target.value, 10) : null,
                )
              }
              disabled={templatesLoading}
            >
              <option value="">{templatesLoading ? 'טוען טמפלייטים...' : 'בחרי טמפלייט'}</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>דיליי בשעות</label>
            <input
              type="number"
              className={styles.input}
              min={1}
              max={720}
              value={state.followup_delay_hours}
              onChange={(e) =>
                update('followup_delay_hours', Number.parseInt(e.target.value, 10) || 24)
              }
            />
            <span className={styles.helperText}>בין שעה ל-30 ימים.</span>
          </div>
        </>
      )}

      <div className={styles.field}>
        <label className={styles.label}>הערות נוספות (לא חובה)</label>
        <textarea
          className={styles.textarea}
          placeholder="כל מה שתרצי שניצן יידע: שינויי טון, וריאציות, אילוצים..."
          value={state.notes ?? ''}
          onChange={(e) => update('notes', e.target.value || null)}
        />
      </div>
    </>
  );
}

function Step7Review({
  state,
  assets,
  templates,
}: {
  state: WizardState;
  assets: UploadedAsset[];
  templates: BrevoTemplate[];
}) {
  const templateName = state.brevo_template_id
    ? templates.find((t) => t.id === state.brevo_template_id)?.name ?? `#${state.brevo_template_id}`
    : null;

  return (
    <>
      <h2>
        <Sparkles size={20} style={{ display: 'inline', marginInlineEnd: 8 }} />
        סקירה אחרונה
      </h2>
      <p className={styles.hint}>בדקי שהכל מדויק. אחרי לחיצה על "הגש" — ניצן מקבל הודעה.</p>

      <div className={styles.summary}>
        <div className={styles.summaryGroup}>
          <h3>סוג + שם</h3>
          <p>
            <strong>{state.title}</strong>
            <br />
            {BRIEF_TYPE_LABEL[state.type]}
          </p>
        </div>

        <div className={styles.summaryGroup}>
          <h3>טריגר</h3>
          {state.type === 'comment_to_dm' ? (
            <p>
              היקף: {POST_SCOPE_LABEL[state.post_scope]}
              {state.post_scope === 'specific_post' && state.post_url && (
                <>
                  <br />
                  לינק: {state.post_url}
                </>
              )}
              <br />
              מילות מפתח: {state.keyword_triggers.join(', ') || '—'}
            </p>
          ) : (
            <p>{state.story_label}</p>
          )}
        </div>

        <div className={styles.summaryGroup}>
          <h3>הודעת DM</h3>
          <p>{state.dm_message}</p>
        </div>

        {(state.lead_magnet_url || assets.length > 0 || state.cta_button_text) && (
          <div className={styles.summaryGroup}>
            <h3>Lead magnet + כפתור</h3>
            <p>
              {state.cta_button_text && <>טקסט הכפתור: <strong>{state.cta_button_text}</strong><br /></>}
              {state.lead_magnet_url && <>לינק: {state.lead_magnet_url}<br /></>}
              {assets.length > 0 && <>קבצים: {assets.map((a) => a.filename).join(', ')}</>}
            </p>
          </div>
        )}

        {state.followup_dm_message && (
          <div className={styles.summaryGroup}>
            <h3>תזכורת ב-DM</h3>
            <p>
              דיליי: {state.followup_dm_delay_minutes} דקות
              <br />
              {state.followup_dm_message}
            </p>
          </div>
        )}

        {state.followup_enabled && (
          <div className={styles.summaryGroup}>
            <h3>Follow-up אימייל</h3>
            <p>
              טמפלייט: {templateName ?? '—'}
              <br />
              דיליי: {state.followup_delay_hours} שעות
            </p>
          </div>
        )}

        {state.notes && (
          <div className={styles.summaryGroup}>
            <h3>הערות</h3>
            <p>{state.notes}</p>
          </div>
        )}
      </div>
    </>
  );
}

// ---------------- helpers ----------------

function validateStep(step: number, state: WizardState): { ok: true } | { ok: false; error: string } {
  if (step === 1) {
    if (!state.title.trim()) return { ok: false, error: 'חובה לתת שם לבריף' };
    return { ok: true };
  }
  if (step === 2) {
    if (state.type === 'comment_to_dm') {
      if (state.post_scope === 'specific_post' && !state.post_url) {
        return { ok: false, error: 'חובה להוסיף לינק לפוסט (בחרת פוסט ספציפי)' };
      }
    } else if (!state.story_label?.trim()) {
      return { ok: false, error: 'חובה לתאר את הסטורי' };
    }
    return { ok: true };
  }
  if (step === 3) {
    if (state.type === 'comment_to_dm' && state.keyword_triggers.length === 0) {
      return { ok: false, error: 'חובה להוסיף לפחות מילת מפתח אחת' };
    }
    return { ok: true };
  }
  if (step === 4) {
    if (!state.dm_message?.trim()) {
      return { ok: false, error: 'חובה לכתוב הודעת DM' };
    }
    return { ok: true };
  }
  return { ok: true };
}
