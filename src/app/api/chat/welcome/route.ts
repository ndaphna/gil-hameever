/**
 * Personalized welcome generator for the chat page.
 *
 * Returns 1-2 Hebrew sentences from Aliza, grounded in the user's memory +
 * recent journal insights. Cached client-side for 6h to avoid spamming
 * the model on every page reload.
 *
 * GET /api/chat/welcome
 *   → { text: string, mood: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabaseAdmin } from '@/lib/supabase-server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { loadAlizaMemory } from '@/lib/aliza/memory';
import { ALIZA_HARD_RULES, sanitizeAlizaOutput } from '@/lib/aliza/guardrails';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Sonnet 4.6 for the welcome line. Haiku 4.5 produced anglicisms and
// Hebrew grammar slips (e.g. "כללים" / "כלליים", missing intensifiers) that
// shipped to the user. The cost delta is ~$0.003 per generation, cached
// 6h client-side — negligible in exchange for native Hebrew.
const MODEL = 'claude-sonnet-4-6';

let _client: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  _client = new Anthropic({ apiKey });
  return _client;
}

const STATIC_FALLBACK = {
  text: 'היי. אני עליזה, האלטר אגו של ענבל. איך את היום?',
  mood: 'greeting',
};

export async function GET(_req: NextRequest) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const [profileResult, memory, recentInsights] = await Promise.all([
    supabaseAdmin
      .from('user_profile')
      .select('first_name, name')
      .eq('id', user.id)
      .maybeSingle(),
    loadAlizaMemory(user.id),
    supabaseAdmin
      .from('journal_insights')
      .select('type, title, description, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3),
  ]);

  const firstName = ((profileResult.data?.first_name || profileResult.data?.name) ?? '').toString().trim();
  const insights = recentInsights.data ?? [];

  // Cold start: no memory + no insights → static greeting (personalized only with name).
  if (!memory?.context_summary && insights.length === 0) {
    return NextResponse.json({
      text: firstName ? `היי ${firstName}. אני עליזה, האלטר אגו של ענבל. איך את היום?` : STATIC_FALLBACK.text,
      mood: 'greeting',
    });
  }

  const systemPrompt = `את עליזה, האלטר אגו של ענבל דפנה, יועצת AI לגיל המעבר.
משימתך: לחבר ברכת פתיחה לחלון הצ'אט, 1-2 משפטים בלבד, בעברית טבעית של דוברת ישראלית.

חוקים מוחלטים לברכה הזו:
- אם יש שם, פני בו ("היי {שם},").
- אם יש מידע על תסמין פעיל או מגמה ביומן, התייחסי אליו בעדינות ("ראיתי שהשבוע..." / "מאז שדיברנו...").
- בלי חתימה, בלי "באהבה", בלי שם בסוף. הברכה מסתיימת בשאלה או במשפט סיום טבעי.
- עברית של דוברת ישראלית, לא תרגום מאנגלית. דוגמאות:
  - לא "לא דברים כללים" (אנגליציזם וגם דקדוק שגוי) → כן "לא סתם דברים כלליים".
  - לא "להישאר על המסלול" → כן "להתמיד".
  - לא "תיקחי את זה לרופאה" → כן "הביאי את זה לרופאה".
- מילה כללית/כלליים (general) נכתבת עם שתי יו"דים. "כללים" זה rules, לא general.

${ALIZA_HARD_RULES}

החזירי JSON תקין בלבד: {"text":"...","mood":"greeting|empathetic|curious|supportive"}`;

  const userPrompt = `שם המשתמשת: ${firstName || '(לא ידוע)'}.
זיכרון נוכחי: ${JSON.stringify({
  current_stage: memory?.current_stage,
  active_symptoms: memory?.active_symptoms,
  context_summary: memory?.context_summary,
}, null, 2)}
תובנות אחרונות מהיומן:
${insights.map(i => `[${i.type}] ${i.title}: ${i.description}`).join('\n') || '(אין)'}

החזירי ברכת פתיחה.`;

  try {
    const resp = await getAnthropic().messages.create({
      model: MODEL,
      max_tokens: 200,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });
    const rawText = resp.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('')
      .trim()
      .replace(/^```(?:json)?\s*/, '')
      .replace(/```\s*$/, '');
    const parsed = JSON.parse(rawText) as { text?: string; mood?: string };
    const cleaned = sanitizeAlizaOutput(parsed.text ?? STATIC_FALLBACK.text).slice(0, 300);
    return NextResponse.json({
      text: cleaned || STATIC_FALLBACK.text,
      mood: parsed.mood ?? 'greeting',
    });
  } catch (err) {
    console.warn('⚠️ Welcome generation failed, falling back:', err);
    return NextResponse.json({
      text: firstName ? `היי ${firstName}. אני עליזה, האלטר אגו של ענבל. איך את היום?` : STATIC_FALLBACK.text,
      mood: 'greeting',
    });
  }
}
