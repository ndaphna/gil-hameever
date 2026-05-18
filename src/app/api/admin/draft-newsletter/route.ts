/**
 * Generate a newsletter draft using:
 *   - active `newsletter.style_guide` row (locale he-IL) as the voice spec
 *   - RAG over `newsletter.inbal_corpus` via pgvector cosine similarity
 *   - Claude Opus 4.7 with adaptive thinking
 *
 * This is the minimal Phase 4 (auto-content) validator — it does NOT persist
 * the draft. Returns the draft + retrieval breakdown so we can inspect what
 * the model saw.
 *
 * Run locally:
 *   POST http://localhost:3001/api/admin/draft-newsletter?topic=<text>&k=10
 *   Header: x-admin-token: <ADMIN_IMPORT_TOKEN>
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabase-server';
import { createClient as createServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const EMBED_MODEL = 'text-embedding-3-large';
const EMBED_DIMS = 1536;

let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (_anthropic) return _anthropic;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  _anthropic = new Anthropic({ apiKey });
  return _anthropic;
}

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (_openai) return _openai;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
  _openai = new OpenAI({ apiKey });
  return _openai;
}

/**
 * Strip Nitzan-banned typography from model output:
 *   - em-dash and en-dash anywhere -> ", "
 *   - markdown bold "**text**" -> "text"
 *   - markdown headings "## title" -> "title" (plain text only)
 *   - stray single "*" not used for headings/lists -> remove
 * List bullets (- ) and blockquotes (>) are untouched.
 */
function sanitizeDraft(text: string): string {
  return text
    .replace(/^[ \t]*#{1,6}[ \t]+/gm, '')
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\*\*([^*\n]+?)\*\*/g, '$1')
    .replace(/(^|[^*])\*([^*\n]+?)\*([^*]|$)/g, '$1$2$3')
    .replace(/, ,/g, ',')
    .replace(/[ \t]+,/g, ',');
}

type CorpusMatch = {
  id: string;
  source: string;
  source_ref: string | null;
  title: string | null;
  body: string;
  tags: string[] | null;
  similarity: number;
};

export async function POST(request: NextRequest) {
  // Auth: accept either ADMIN_IMPORT_TOKEN (CLI/server-to-server) or a session
  // with a newsletter role (admin / campaign_manager / content_creator).
  const adminToken = request.headers.get('x-admin-token');
  const hasValidToken =
    !!adminToken && adminToken === process.env.ADMIN_IMPORT_TOKEN;

  if (!hasValidToken) {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    const { data: allowed, error: roleError } = await supabase
      .schema('newsletter')
      .rpc('has_role', { required: 'content_creator' });
    if (roleError || allowed !== true) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
  }

  const url = new URL(request.url);
  const topic = url.searchParams.get('topic')?.trim();
  const k = Math.max(3, Math.min(20, Number(url.searchParams.get('k')) || 10));

  if (!topic) {
    return NextResponse.json({ error: 'missing_topic', hint: 'pass ?topic=...' }, { status: 400 });
  }

  // 1. Load active style guide for he-IL
  const { data: styleRow, error: styleError } = await supabaseAdmin
    .schema('newsletter')
    .from('style_guide')
    .select('id, version, content_md')
    .eq('locale', 'he-IL')
    .eq('is_active', true)
    .single();

  if (styleError || !styleRow) {
    return NextResponse.json(
      { error: 'no_active_style_guide', detail: styleError?.message ?? 'no active row' },
      { status: 422 },
    );
  }

  // 2. Embed the topic
  const openai = getOpenAI();
  const embedResp = await openai.embeddings.create({
    model: EMBED_MODEL,
    dimensions: EMBED_DIMS,
    input: topic,
  });
  const queryEmbedding = embedResp.data[0].embedding;

  // 3. Retrieve top-K chunks via pgvector
  const { data: matches, error: matchError } = await supabaseAdmin
    .schema('newsletter')
    .rpc('match_corpus', {
      query_embedding: queryEmbedding as unknown as string,
      match_count: k,
      source_filter: null,
      locale_filter: 'he-IL',
    });

  if (matchError) {
    return NextResponse.json({ error: 'rag_failed', detail: matchError.message }, { status: 500 });
  }

  const chunks = (matches ?? []) as CorpusMatch[];
  if (chunks.length === 0) {
    return NextResponse.json({ error: 'no_matches' }, { status: 422 });
  }

  // 4. Build prompt
  const ragContext = chunks
    .map((c, i) => {
      const label = c.title ? `${c.title} [${c.source}:${c.source_ref ?? ''}]` : `${c.source}:${c.source_ref ?? ''}`;
      return `### קטע ${i + 1} (${label}) — דמיון ${c.similarity.toFixed(3)}\n${c.body}`;
    })
    .join('\n\n');

  const systemPrompt = `אתה כותב/ת ניוזלטרים בעברית בקול של ענבל דפנה. למטה מדריך הסגנון המלא של ענבל, אתה חייב להיצמד אליו בקפדנות.

חוקים קשים שלא ניתן להפר:
1. אסור לתת ייעוץ רפואי, תרופתי, או דיאגנוזה.
2. אם נוגעים בתסמין משמעותי, להפנות לרופא/ת נשים או מרפאת גיל מעבר.
3. אסור להמליץ דיאטות, מספרי קלוריות, או הגבלות אכילה.
4. אסור מספרים מדויקים על תרופות, מינונים, או תופעות לוואי.
5. אסור מקפים ארוכים בטקסט (לא — ולא –). אם רוצים השהיה או הפרדה, להשתמש בפסיק, נקודה, או סוגריים בלבד.
6. אסור כוכביות להדגשת טקסט (לא ** ולא *). כל המילים כטקסט רגיל. הדגשה דרך מבנה משפט בלבד.
7. אסור סימני Markdown לכותרות (#, ##, ###, וכל קונסטלציה אחרת). גם כותרות פנימיות בתוך המייל בטקסט רגיל, בלי סימן גרפי. הפרדה בין סעיפים דרך שורה ריקה, אימוג'י תיוג (🎤 לעליזה), או משפט פתיחה ספציפי.
8. אסור קלישאות שטחיות שנשים כבר שמעו אלף פעם ("תני לעצמך זמן", "תקשיבי לגוף", "כל גוף שונה", "תהיי טובה לעצמך"). אם בכל זאת רוצים להשתמש, לחבר תמיד לפעולה ספציפית או מנגנון ביולוגי.
9. אסור לסיים בהבטחה למייל הבא ("במייל הבא נדבר על", "בפעם הבאה אספר לך"). הניוזלטר עומד בפני עצמו. אין לך ידיעה על תוכן עתידי, אז כל הבטחה כזו תהיה המצאה ופגיעה באמון. סיים ב"עכשיו תורך + שאלה לקוראת + חתימה" בלי טיזר עתידי.

============================================
מדריך סגנון של ענבל דפנה (גרסה ${styleRow.version})
============================================

${styleRow.content_md}`;

  const userPrompt = `הנושא של הניוזלטר: ${topic}

להלן ${chunks.length} קטעים רלוונטיים מתוך הקורפוס של ענבל (הספר "לא גברת גיבורה", ניוזלטרים קודמים, ודפי האתר). השתמש בהם כדי להבין איך ענבל מטפלת בנושא הזה: ציטוטים, סיפורי קוראות, ביטויי חתימה, ניואנסים:

${ragContext}

============================================

כתוב טיוטה ראשונית של ניוזלטר אחד שלם בקול של ענבל:
- אורך מטרה: 500-750 מילים (יותר עומק, פחות סיסמאות).
- מבנה: פתיחה ("היי חברה,") → סצנה/hook → אישור הכאב + הסבר ביולוגי קצר → 3 כלים מעשיים עם מנגנון פעולה ("למה זה עובד") → ציטוט של אישה חזקה ומפורסמת רלוונטית לנושא → אזכור מחקר עדכני רלוונטי (רק אם אתה בטוח שהוא קיים) → קטע של עליזה (🎤) → סגירה ("עכשיו תורך" + שאלה לקוראת + חתימה).
- כלים: כל כלי צריך לכלול "למה זה עובד" בכמה מילים. למשל לא רק "נשימת 4-7-8" אלא "נשימת 4-7-8 מורידה קורטיזול ומפעילה את העצב הוואגוס".
- ציטוט: כלול ציטוט אחד אותנטי וקצר (פחות מ-20 מילים) של אישה חזקה ומפורסמת רלוונטית לנושא (מישל אובמה, אופרה, ג'יין פונדה, ברנה בראון, מרים פרץ, גילה אלמגור, נורה אפרון, מאיה אנג'לו, וכו'). רק אם אתה בטוח שהציטוט מדויק, אחרת לדלג בשתיקה.
- מחקר: אם יש מחקר רלוונטי עדכני שאתה בטוח בו (NAMS, ועדות גינקולוגיה, מחקרים מובילים) שלב בקצרה. אם אין, לא להמציא.
- אל תמציא ציטוטים מהקורפוס. אם אתה משתמש בציטוט מהקורפוס, השתמש בציטוט אמיתי.
- אל תוסיף תוכן רפואי שלא קיים בקורפוס או במחקר אמיתי.
- חזרה על החוקים: אין מקפים ארוכים (— או –), אין כוכביות (** או *), אין סימני Markdown לכותרות (#, ##, ###). הכל טקסט רגיל. הפרדה בין סעיפים דרך שורה ריקה או אימוג'י תיוג.
- חשוב: אין לסיים בהבטחה למייל הבא. כל ניוזלטר עומד בפני עצמו. הסיומת היא "עכשיו תורך + שאלה לקוראת + חתימה", בלי טיזר עתידי.
- פלט: רק הטיוטה עצמה, בלי כותרת על "הנה הטיוטה" ובלי הערות מטא.`;

  const client = getAnthropic();
  const startedAt = Date.now();

  let draftText: string;
  let usage: Anthropic.Usage;
  let stopReason: string | null;

  try {
    const stream = client.messages.stream({
      model: 'claude-opus-4-7',
      // 12000 leaves room for adaptive thinking (often 2-4k tokens) plus a
      // 500-750 word Hebrew draft (~3-5k output tokens). Previous 4000 cap
      // truncated drafts mid-sentence whenever thinking ran long.
      max_tokens: 12000,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'high' },
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const finalMessage = await stream.finalMessage();
    const rawText = finalMessage.content
      .filter(block => block.type === 'text')
      .map(block => (block as { type: 'text'; text: string }).text)
      .join('\n\n')
      .trim();
    draftText = sanitizeDraft(rawText);
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

  return NextResponse.json({
    ok: true,
    topic,
    style_guide_version: styleRow.version,
    draft_md: draftText,
    draft_chars: draftText.length,
    retrieved: chunks.map(c => ({
      source: c.source,
      source_ref: c.source_ref,
      title: c.title,
      similarity: Number(c.similarity.toFixed(4)),
      preview: c.body.slice(0, 120),
    })),
    usage,
    stop_reason: stopReason,
    truncated: stopReason === 'max_tokens',
    elapsed_ms: Date.now() - startedAt,
  });
}
