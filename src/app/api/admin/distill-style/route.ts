/**
 * Style distillation v1: read the full `newsletter.inbal_corpus`, send it to
 * Claude Opus 4.7, extract Inbal's voice into a markdown style guide, store
 * it as a new row in `newsletter.style_guide`.
 *
 * The resulting row is `is_active=false` — Nitzan reviews and edits before
 * activating, per the locked architecture decision.
 *
 * Run locally:
 *   POST http://localhost:3001/api/admin/distill-style
 *   Header: x-admin-token: <ADMIN_IMPORT_TOKEN>
 *
 * Optional query params:
 *   locale=he-IL   — locale of the style guide (default he-IL)
 *   activate=1     — insert with is_active=true (NOT recommended; bypass review)
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (_anthropic) return _anthropic;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  _anthropic = new Anthropic({ apiKey });
  return _anthropic;
}

type CorpusRow = {
  source: string;
  source_ref: string | null;
  title: string | null;
  body: string;
  tags: string[] | null;
  performance_metrics: { open_rate?: number; click_rate?: number } | null;
};

function formatCorpus(rows: CorpusRow[]): string {
  const grouped: Record<string, CorpusRow[]> = { book: [], newsletter: [], website: [] };
  for (const r of rows) {
    (grouped[r.source] ?? (grouped[r.source] = [])).push(r);
  }

  const sections: string[] = [];

  if (grouped.book.length > 0) {
    sections.push(
      '# מקור: הספר "לא גברת גיבורה" (ענבל דפנה)\n\n' +
        grouped.book
          .map(r => `## ${r.title ?? ''} [${r.source_ref ?? ''}]\n${r.body}`)
          .join('\n\n---\n\n'),
    );
  }

  if (grouped.newsletter.length > 0) {
    sections.push(
      '# מקור: ניוזלטרים\n\n' +
        grouped.newsletter
          .map(r => `## ${r.title ?? ''} [${r.source_ref ?? ''}]\n${r.body}`)
          .join('\n\n---\n\n'),
    );
  }

  if (grouped.website.length > 0) {
    sections.push(
      '# מקור: דפי האתר gilhameever.com\n\n' +
        grouped.website
          .map(r => `## ${r.title ?? ''} [${r.source_ref ?? ''}]\n${r.body}`)
          .join('\n\n---\n\n'),
    );
  }

  return sections.join('\n\n========================================\n\n');
}

const SYSTEM_PROMPT = `אתה אנליסט סגנון מומחה. המשימה: לחלץ את הקול הכתוב של ענבל דפנה מתוך הקורפוס שיצורף, ולכתוב מדריך סגנון מקיף בעברית שיוכל לשמש מודל AI אחר ליצירת תוכן חדש בקול הזה.

הקפד על:
- אבחנה חדה בין מה שמאפיין את הקול לבין מה שגנרי
- ציטוטים קצרים מהקורפוס כהוכחה (לא להמציא)
- כללים פעולים: מה לעשות, מה לא לעשות
- הבחנה בין שלוש דמויות בעולם התוכן: ענבל (המחברת/המנחה), עליזה שנקין (דמות פנימית הומוריסטית), והקוראת (אישה 50+)

הפלט: Markdown בעברית, RTL, מובנה לפי הסעיפים שיצוינו בהמשך.`;

const USER_INSTRUCTIONS = `להלן הקורפוס המלא של כתבי ענבל דפנה — הספר "לא גברת גיבורה", ניוזלטרים שפורסמו ברשימת הדיוור, ודפי לידים באתר gilhameever.com.

חלץ מתוכו מדריך סגנון מקיף בעברית, במבנה הבא בדיוק (Markdown, RTL, כותרות ## לכל סעיף):

## 1. טון ואנרגיה
מה הטמפרטורה הרגשית? פורמלי/לא פורמלי? איפה היא מציבה את עצמה ביחס לקוראת (חברה, מנטורית, חברה לדרך, אחות גדולה)?

## 2. ריתמוס משפטים ומבנה
אורך משפט ממוצע (קצרים-בינוניים-ארוכים)? שימוש בקטעים שבורים, סוגריים, מקפים? איך פסקאות מתחלקות? איך משולבים סימני שאלה רטוריים?

## 3. אוצר מילים ופניה לקוראת
פניה ב"את" (יחיד) או "אתן" (רבים)? איזה מילים חוזרות? איזו עברית — מדוברת, ספרותית, ערבוב? איזה ביטויים מהשפה הרפואית/הגוף נכנסים?

## 4. דמויות וקולות
- **ענבל (הקול המוביל)** — איך היא מציגה את עצמה, מתי היא משתפת מהחיים שלה, איך היא מנחה?
- **עליזה שנקין** — מה תפקידה? מתי היא מופיעה? איזה רגיסטר? איזה ביטויים אופייניים לה?
- **קוראות לדוגמה (ענת, דינה...)** — איך משולבים סיפורי מקרה? מה תפקידם הרטורי?

## 5. דפוסי פתיחה
איך מתחילים ניוזלטר/פרק/פסקה? איזו פנייה ראשונה? איזה hooks חוזרים?

## 6. דפוסי סגירה והנעה לפעולה
איך מסיימים? איזו הזמנה לפעולה (CTA)? איך כוללים את חתימת ענבל? איך עוברים מתוכן לקריאה לפעולה?

## 7. נושאים מרכזיים וזוויות אופייניות
איזה נושאים חוזרים? באיזו זווית? מה לעולם לא ייאמר ככה ומה תמיד ייאמר ככה?

## 8. ביטויי חתימה (signature phrases)
רשימת 10-20 ביטויים/משפטים/מילים שמאפיינים את הקול ולא ייתפסו בשום מקום אחר. ציטוט מילולי + הקשר.

## 9. כללים קשים (hard rules)
חובה לכלול / אסור לכלול:
- כל אזכור של אליזה/עליזה/הסוכן ה-AI: **אסור** לתת ייעוץ רפואי, תרופתי, או לקבוע דיאגנוזה. תמיד להמליץ להתייעץ עם רופא.
- שפה כוללת לנשים בגיל מעבר — לא מרחמת, לא משפילה, לא תינוקית.
- מה לא לעשות בכלל (לא לזלזל בכאב, לא להמליץ דיאטות, לא לתת מספרים מדויקים על תופעות לוואי...).

## 10. דוגמה מלאה
פסקה אחת באורך ~150 מילים שכתובה בקול של ענבל לחלוטין — לא ציטוט מהקורפוס, אלא חיקוי מדויק שלך לדגום בו את כל הסעיפים למעלה.

---

חשוב:
- כל ציטוט מהקורפוס בתוך גרשיים כפולים, קצר (פחות מ-15 מילים).
- אם חסר מידע על נקודה מסוימת — כתוב במפורש "לא ניתן לקבוע מהקורפוס".
- אורך מטרה: 2,000-3,500 מילים.

הקורפוס המלא נמצא בהודעה הבאה.`;

export async function POST(request: NextRequest) {
  const adminToken = request.headers.get('x-admin-token');
  if (!adminToken || adminToken !== process.env.ADMIN_IMPORT_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const locale = url.searchParams.get('locale') || 'he-IL';
  const activate = url.searchParams.get('activate') === '1';

  const { data: rows, error: selectError } = await supabaseAdmin
    .schema('newsletter')
    .from('inbal_corpus')
    .select('source, source_ref, title, body, tags, performance_metrics')
    .eq('locale', locale)
    .order('source')
    .order('source_ref');

  if (selectError) {
    return NextResponse.json({ error: 'select_failed', detail: selectError.message }, { status: 500 });
  }

  if (!rows || rows.length === 0) {
    return NextResponse.json({ error: 'empty_corpus', locale }, { status: 422 });
  }

  const corpus = formatCorpus(rows as CorpusRow[]);
  const corpusChars = corpus.length;

  const client = getAnthropic();
  const startedAt = Date.now();

  let finalText: string;
  let usage: Anthropic.Usage;
  let stopReason: string | null;

  try {
    const stream = client.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'high' },
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: USER_INSTRUCTIONS },
            { type: 'text', text: `=== הקורפוס המלא (${corpusChars.toLocaleString()} תווים) ===\n\n${corpus}` },
          ],
        },
      ],
    });

    const finalMessage = await stream.finalMessage();
    finalText = finalMessage.content
      .filter(block => block.type === 'text')
      .map(block => (block as { type: 'text'; text: string }).text)
      .join('\n\n')
      .trim();
    usage = finalMessage.usage;
    stopReason = finalMessage.stop_reason;
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: 'anthropic_api_error', status: err.status, detail: err.message },
        { status: 502 },
      );
    }
    throw err;
  }

  if (!finalText) {
    return NextResponse.json({ error: 'empty_response', stop_reason: stopReason }, { status: 502 });
  }

  // Determine next version for this locale.
  const { data: versionRows, error: versionError } = await supabaseAdmin
    .schema('newsletter')
    .from('style_guide')
    .select('version')
    .eq('locale', locale)
    .order('version', { ascending: false })
    .limit(1);

  if (versionError) {
    return NextResponse.json({ error: 'version_lookup_failed', detail: versionError.message }, { status: 500 });
  }

  const nextVersion = (versionRows?.[0]?.version ?? 0) + 1;

  // If activating, deactivate prior actives to satisfy the partial unique index.
  if (activate) {
    const { error: deactivateError } = await supabaseAdmin
      .schema('newsletter')
      .from('style_guide')
      .update({ is_active: false })
      .eq('locale', locale)
      .eq('is_active', true);
    if (deactivateError) {
      return NextResponse.json({ error: 'deactivate_prior_failed', detail: deactivateError.message }, { status: 500 });
    }
  }

  const notesObj = {
    generator: 'distill-style v1',
    model: 'claude-opus-4-7',
    effort: 'high',
    corpus_rows: rows.length,
    corpus_chars: corpusChars,
    elapsed_ms: Date.now() - startedAt,
    usage,
    stop_reason: stopReason,
  };

  const { data: inserted, error: insertError } = await supabaseAdmin
    .schema('newsletter')
    .from('style_guide')
    .insert({
      locale,
      version: nextVersion,
      content_md: finalText,
      is_active: activate,
      notes: JSON.stringify(notesObj),
    })
    .select('id, version, is_active, locale')
    .single();

  if (insertError) {
    return NextResponse.json({ error: 'insert_failed', detail: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    style_guide: inserted,
    corpus_rows: rows.length,
    corpus_chars: corpusChars,
    output_chars: finalText.length,
    elapsed_ms: Date.now() - startedAt,
    usage,
    stop_reason: stopReason,
  });
}
