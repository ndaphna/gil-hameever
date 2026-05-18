/**
 * Generate 5 subject-line variants for a newsletter body.
 *
 * Auth: session must have a newsletter role.
 *
 * POST /api/admin/newsletter/generate-subjects
 * Body: { body_text: string, topic?: string }
 * Returns: { ok: true, subjects: Array<{ text, style, char_count, rationale }> }
 *
 * Model: Claude Sonnet 4.6 (fast + cheap — typically <$0.01 per call).
 *
 * Prompt design is informed by two skills installed at user level:
 *   - email-copywriting (8-part formula, Part 1: HOOK pattern)
 *   - copywriting (clarity > cleverness, specificity > vagueness,
 *     customer-language)
 * Plus the Inbal style_guide hard rules already enforced project-wide.
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient as createServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type GenerateBody = {
  body_text?: unknown;
  topic?: unknown;
};

type SubjectVariant = {
  text: string;
  style: 'question' | 'paradox' | 'specific' | 'open_loop' | 'direct';
  char_count: number;
  rationale: string;
};

let _anthropic: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (_anthropic) return _anthropic;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  _anthropic = new Anthropic({ apiKey });
  return _anthropic;
}

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

const SYSTEM_PROMPT = `אתה כותב/ת subject lines למייל בעברית בקול של ענבל דפנה, כותבת ניוזלטרים לנשים בגיל המעבר (50+).

מטרה: להגדיל את אחוז ההקלקה (open rate) מבלי לפגוע באמון.

עקרונות:
1. אורך: 30 עד 50 תווים. זה החיתוך של תצוגה מקדימה ברוב מכשירי המובייל.
2. ספציפיות עדיפה על קלעריות, קלעריות עדיפה על "חכמות". העדף מספר קונקרטי או תופעה ספציפית על כותרת מופשטת.
3. שפת הלקוחה: כתוב/י איך שאישה בת 55 מדברת על עצמה לחברה. לא איך שמותג מדבר אליה.
4. בקול של ענבל: חמה, ישירה, נשית, לא יומרנית, לא מרצה. את/אישית, לא רבים.
5. אסור clickbait מטעה. הכותרת חייבת לשקף את התוכן.
6. אסור הבטחות רפואיות, מספרי מינון, או תיאור תרופות.
7. אסור מקפים ארוכים (— או –) או כוכביות (** או *).
8. אסור סימני קריאה (!). הם נראים זולים.
9. אסור CAPS לטינית להדגשה.
10. הימנעי מקלישאות שטחיות ("תני לעצמך זמן", "תקשיבי לגוף", "כל גוף שונה") אלא אם הן מחוברות לפעולה ספציפית.

חמישה סגנונות שונים שאני רוצה לראות, אחת מכל סוג:

א. question — שאלה ישירה לקוראת.
   דוגמה: "למה את מתעוררת בשלוש לפנות בוקר?"

ב. paradox — סתירה / ניגוד שעוצר את העין.
   דוגמה: "הרופאה אמרה שאני בריאה. אני יודעת שלא."

ג. specific — מספר או נתון קונקרטי.
   דוגמה: "37 לילות עם 3 שעות שינה"

ד. open_loop — חצי סיפור שמכריח להמשיך.
   דוגמה: "התקשרה אליי קוראת. מה שאמרה הפתיע אותי."

ה. direct — הבטחה ברורה של הערך במייל.
   דוגמה: "שלושה כלים לבריחה משבע בבוקר"

החזר JSON בלבד, ללא טקסט מסביב, בפורמט הזה בדיוק:
{
  "subjects": [
    {"text": "...", "style": "question", "char_count": 42, "rationale": "..."},
    {"text": "...", "style": "paradox", "char_count": 38, "rationale": "..."},
    {"text": "...", "style": "specific", "char_count": 33, "rationale": "..."},
    {"text": "...", "style": "open_loop", "char_count": 47, "rationale": "..."},
    {"text": "...", "style": "direct", "char_count": 36, "rationale": "..."}
  ]
}

rationale הוא משפט קצר (10-15 מילים בעברית) שמסביר למה הכותרת הזו תעבוד על קוראת ספציפית. עזרה לבחירה.`;

function extractJson(raw: string): unknown {
  // Sonnet usually returns clean JSON, but be tolerant of code fences.
  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenceMatch ? fenceMatch[1].trim() : trimmed;
  return JSON.parse(candidate);
}

function sanitizeSubject(text: string): string {
  return text
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\*\*([^*\n]+?)\*\*/g, '$1')
    .replace(/(^|[^*])\*([^*\n]+?)\*([^*]|$)/g, '$1$2$3')
    .replace(/!+/g, '')
    .trim();
}

export async function POST(request: NextRequest) {
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

  let payload: GenerateBody;
  try {
    payload = (await request.json()) as GenerateBody;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const bodyText = asString(payload.body_text).trim();
  const topic = asString(payload.topic).trim();
  if (!bodyText) {
    return NextResponse.json(
      { error: 'missing_body', hint: 'pass body_text — the newsletter body to derive subjects from' },
      { status: 400 },
    );
  }

  const userPrompt = `${topic ? `נושא הניוזלטר: ${topic}\n\n` : ''}גוף הניוזלטר:

${bodyText}

החזר/י חמש הצעות subject line לפי הפורמט שהוגדר במערכת.`;

  const client = getAnthropic();
  const startedAt = Date.now();

  let rawResponse: string;
  let usage: Anthropic.Usage;
  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });
    rawResponse = message.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('')
      .trim();
    usage = message.usage;
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: 'anthropic_api_error', status: err.status, detail: err.message },
        { status: 502 },
      );
    }
    throw err;
  }

  let parsed: { subjects?: Array<Partial<SubjectVariant>> };
  try {
    parsed = extractJson(rawResponse) as typeof parsed;
  } catch {
    return NextResponse.json(
      { error: 'parse_failed', raw: rawResponse.slice(0, 500) },
      { status: 502 },
    );
  }

  if (!parsed.subjects || !Array.isArray(parsed.subjects)) {
    return NextResponse.json(
      { error: 'unexpected_shape', raw: rawResponse.slice(0, 500) },
      { status: 502 },
    );
  }

  const subjects: SubjectVariant[] = parsed.subjects
    .map((s) => {
      const text = sanitizeSubject(asString(s.text));
      return {
        text,
        style: (s.style ?? 'direct') as SubjectVariant['style'],
        char_count: text.length,
        rationale: asString(s.rationale),
      };
    })
    .filter((s) => s.text.length > 0);

  if (subjects.length === 0) {
    return NextResponse.json({ error: 'no_subjects_returned' }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    subjects,
    usage,
    elapsed_ms: Date.now() - startedAt,
  });
}
