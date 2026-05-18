'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Wand2, Save, Check } from 'lucide-react';
import { renderPreviewHtml } from '@/lib/newsletter/render-preview';
import styles from './new.module.css';

type GenerateResponse = {
  ok: true;
  topic: string;
  style_guide_version: number;
  draft_md: string;
  draft_chars: number;
  retrieved: Array<{
    source: string;
    source_ref: string | null;
    title: string | null;
    similarity: number;
    preview: string;
  }>;
  elapsed_ms: number;
  truncated?: boolean;
};

type GenerateError = { error: string; detail?: string };

type SubjectStyle = 'question' | 'paradox' | 'specific' | 'open_loop' | 'direct';

type SubjectVariant = {
  text: string;
  style: SubjectStyle;
  char_count: number;
  rationale: string;
};

type SubjectsResponse = {
  ok: true;
  subjects: SubjectVariant[];
  elapsed_ms: number;
};

const STYLE_LABEL: Record<SubjectStyle, string> = {
  question: 'שאלה',
  paradox: 'פראדוקס',
  specific: 'ספציפי',
  open_loop: 'open loop',
  direct: 'ישיר',
};

const STYLE_CLASS: Record<SubjectStyle, string> = {
  question: 'subjectStyleQuestion',
  paradox: 'subjectStyleParadox',
  specific: 'subjectStyleSpecific',
  open_loop: 'subjectStyleOpenLoop',
  direct: 'subjectStyleDirect',
};

function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

export default function NewDraftPage() {
  const router = useRouter();

  const [topic, setTopic] = useState('');
  const [k, setK] = useState(10);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [tagsRaw, setTagsRaw] = useState('');
  const [intendedForAutomation, setIntendedForAutomation] = useState(true);
  const [intendedDelay, setIntendedDelay] = useState(8);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [genStatus, setGenStatus] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [wasAiGenerated, setWasAiGenerated] = useState(false);

  const [subjectSuggestions, setSubjectSuggestions] = useState<SubjectVariant[] | null>(null);
  const [isGeneratingSubjects, setIsGeneratingSubjects] = useState(false);
  const [subjectsError, setSubjectsError] = useState<string | null>(null);

  const previewHtml = useMemo(() => renderPreviewHtml(body), [body]);

  // Warn before navigating away when there's unsaved generated content.
  const hasUnsavedDraft = body.trim().length > 0 && !saveSuccess;
  useEffect(() => {
    if (!hasUnsavedDraft) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedDraft]);

  async function handleGenerate() {
    if (!topic.trim()) {
      setGenError('צריך להזין נושא');
      return;
    }
    setIsGenerating(true);
    setGenError(null);
    setGenStatus('מייצרת טיוטה בקול של ענבל. זה לוקח 30 עד 90 שניות...');
    try {
      const url = `/api/admin/draft-newsletter?topic=${encodeURIComponent(
        topic.trim(),
      )}&k=${k}`;
      const res = await fetch(url, { method: 'POST' });
      const json = (await res.json()) as GenerateResponse | GenerateError;
      if (!res.ok || !('ok' in json)) {
        const err = json as GenerateError;
        setGenError(
          err.detail
            ? `${err.error}: ${err.detail}`
            : err.error || `שגיאה ${res.status}`,
        );
        setGenStatus(null);
        return;
      }
      setBody(json.draft_md);
      if (!subject.trim()) {
        setSubject(json.topic);
      }
      setWasAiGenerated(true);
      const truncatedNote = json.truncated
        ? ' ⚠️ הטיוטה נחתכה ב-max_tokens (הטקסט לא הושלם). נסי שוב או פצלי לנושא צר יותר.'
        : '';
      setGenStatus(
        `נוצר בהצלחה. ${json.draft_chars} תווים, ${(json.elapsed_ms / 1000).toFixed(
          1,
        )} שניות, ${json.retrieved.length} קטעים מהקורפוס.${truncatedNote}`,
      );
    } catch (err) {
      setGenError(err instanceof Error ? err.message : String(err));
      setGenStatus(null);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleGenerateSubjects() {
    if (!body.trim()) {
      setSubjectsError('צריך גוף ניוזלטר לפני שמייצרים כותרות');
      return;
    }
    setIsGeneratingSubjects(true);
    setSubjectsError(null);
    try {
      const res = await fetch('/api/admin/newsletter/generate-subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body_text: body, topic: topic.trim() || undefined }),
      });
      const json = (await res.json()) as SubjectsResponse | GenerateError;
      if (!res.ok || !('ok' in json)) {
        const err = json as GenerateError;
        setSubjectsError(
          err.detail ? `${err.error}: ${err.detail}` : err.error || `שגיאה ${res.status}`,
        );
        return;
      }
      setSubjectSuggestions(json.subjects);
    } catch (err) {
      setSubjectsError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsGeneratingSubjects(false);
    }
  }

  async function handleSave() {
    if (!subject.trim()) {
      setSaveError('צריך להזין נושא לפני שמירה');
      return;
    }
    if (!body.trim()) {
      setSaveError('הטיוטה ריקה');
      return;
    }
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      const res = await fetch('/api/admin/newsletter/save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          body_text: body,
          tags: parseTags(tagsRaw),
          locale: 'he-IL',
          is_ai_generated: wasAiGenerated,
          intended_for_automation: intendedForAutomation,
          intended_automation_delay_days: intendedForAutomation ? intendedDelay : null,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setSaveError(json.detail ? `${json.error}: ${json.detail}` : json.error);
        return;
      }
      setSaveSuccess('נשמר. מעבירה אותך לטיוטה...');
      setTimeout(() => router.push(`/admin/newsletter/${json.id}`), 600);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>טיוטה חדשה</h1>
        <p className={styles.subtitle}>
          הזיני נושא, ה-AI יבנה טיוטה בקול של ענבל. תוכלי לערוך לפני שמירה.
        </p>
      </header>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          <span className={styles.stepNum}>1</span>
          הפקה אוטומטית
        </h2>

        <div className={styles.fieldRow}>
          <div className={styles.field} style={{ flex: 1, minWidth: 240 }}>
            <label className={styles.label} htmlFor="topic">
              נושא הניוזלטר
            </label>
            <input
              id="topic"
              type="text"
              className={styles.input}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="לדוגמה: שינה מופרעת בגיל המעבר"
              disabled={isGenerating}
            />
          </div>

          <div className={`${styles.field} ${styles.kField}`}>
            <label className={styles.label} htmlFor="k">
              קטעי קורפוס: <span className={styles.kValue}>{k}</span>
            </label>
            <div className={styles.kSliderRow}>
              <input
                id="k"
                type="range"
                className={styles.kSlider}
                min={3}
                max={20}
                value={k}
                onChange={(e) => setK(Number(e.target.value))}
                disabled={isGenerating}
              />
            </div>
            <div className={styles.hint}>כמה קטעים מתוך הקורפוס לשלוח למודל</div>
          </div>

          <div className={styles.field}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
            >
              {isGenerating ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  מייצרת
                </>
              ) : (
                <>
                  <Sparkles size={16} strokeWidth={2.25} />
                  צרי טיוטה
                </>
              )}
            </button>
          </div>
        </div>

        {genStatus && !genError && (
          <div className={styles.statusLine}>{genStatus}</div>
        )}
        {genError && <div className={styles.statusError}>{genError}</div>}
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          <span className={styles.stepNum}>2</span>
          עריכה ותצוגה מקדימה
          {hasUnsavedDraft && <span className={styles.unsavedPill}>לא נשמר עדיין</span>}
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
            placeholder="כותרת המייל ששולחים"
          />

          <div style={{ marginTop: 'var(--nl-space-3)', display: 'flex', gap: 'var(--nl-space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleGenerateSubjects}
              disabled={isGeneratingSubjects || !body.trim()}
            >
              {isGeneratingSubjects ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  מציעה כותרות
                </>
              ) : (
                <>
                  <Wand2 size={14} strokeWidth={2.25} />
                  {subjectSuggestions ? 'הצעות חדשות' : 'הציעי לי 5 כותרות'}
                </>
              )}
            </button>
            {!body.trim() && (
              <span className={styles.hint}>צרי טיוטה קודם ואז אציע כותרות מתאימות</span>
            )}
          </div>

          {subjectsError && <div className={styles.statusError}>{subjectsError}</div>}

          {subjectSuggestions && subjectSuggestions.length > 0 && (
            <div className={styles.subjectsList}>
              {subjectSuggestions.map((s, i) => {
                const isSelected = subject === s.text;
                return (
                  <label
                    key={i}
                    className={`${styles.subjectOption} ${isSelected ? styles.subjectOptionSelected : ''}`}
                  >
                    <input
                      type="radio"
                      name="subject-suggestion"
                      className={styles.subjectRadio}
                      checked={isSelected}
                      onChange={() => setSubject(s.text)}
                    />
                    <div className={styles.subjectBody}>
                      <div className={styles.subjectText}>{s.text}</div>
                      <div className={styles.subjectMeta}>
                        <span className={`${styles.subjectStyleBadge} ${styles[STYLE_CLASS[s.style]]}`}>
                          {STYLE_LABEL[s.style]}
                        </span>
                        <span className={styles.subjectCharCount}>{s.char_count} תווים</span>
                      </div>
                      {s.rationale && <div className={styles.subjectRationale}>{s.rationale}</div>}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.editorGrid}>
          <div className={styles.editorPane}>
            <div className={styles.paneHeader}>עריכה</div>
            <textarea
              className={styles.textarea}
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
              }}
              placeholder="הטיוטה תופיע כאן אחרי הפקה אוטומטית, או הקלידי ידנית"
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

        <div className={styles.metaRow}>
          <div className={`${styles.field} ${styles.metaCol}`}>
            <label className={styles.label} htmlFor="tags">
              תגיות (מופרדות בפסיק)
            </label>
            <input
              id="tags"
              type="text"
              className={styles.input}
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              placeholder="שינה, גיל המעבר, מנגנונים"
            />
          </div>
        </div>

        <div
          style={{
            background: 'var(--nl-gray-50)',
            border: '1px solid var(--nl-gray-200)',
            borderRadius: 'var(--nl-radius)',
            padding: 'var(--nl-space-4)',
            marginTop: 'var(--nl-space-4)',
          }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--nl-space-2)', cursor: 'pointer', marginBottom: intendedForAutomation ? 'var(--nl-space-3)' : 0 }}>
            <input
              type="checkbox"
              checked={intendedForAutomation}
              onChange={(e) => setIntendedForAutomation(e.target.checked)}
            />
            <span style={{ fontWeight: 'var(--nl-weight-medium)', color: 'var(--nl-gray-800)' }}>
              מיועד להוספה לסדרת ה-Welcome (ענבל תאשר לפני שזה יוצא)
            </span>
          </label>
          {intendedForAutomation && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nl-space-3)' }}>
              <label htmlFor="intended-delay" style={{ fontSize: 'var(--nl-text-sm)', color: 'var(--nl-gray-600)' }}>
                דיליי מהשלב האחרון (ימים):
              </label>
              <input
                id="intended-delay"
                type="number"
                min={1}
                max={365}
                value={intendedDelay}
                onChange={(e) => setIntendedDelay(Number(e.target.value))}
                style={{
                  width: 80,
                  padding: 'var(--nl-space-2)',
                  border: '1px solid var(--nl-gray-300)',
                  borderRadius: 'var(--nl-radius)',
                  fontSize: 'var(--nl-text-base)',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => router.push('/admin/newsletter')}
            disabled={isSaving}
          >
            ביטול
          </button>
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleSave}
            disabled={isSaving || !body.trim() || !subject.trim()}
          >
            {isSaving ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                שומרת
              </>
            ) : (
              <>
                <Save size={16} strokeWidth={2.25} />
                שמרי כטיוטה
              </>
            )}
          </button>
        </div>
        {saveSuccess && (
          <div className={styles.statusSuccess}>
            <Check size={16} strokeWidth={2.5} style={{ verticalAlign: '-3px', marginInlineEnd: 6 }} />
            {saveSuccess}
          </div>
        )}

        {saveError && <div className={styles.statusError}>{saveError}</div>}
      </div>
    </div>
  );
}
