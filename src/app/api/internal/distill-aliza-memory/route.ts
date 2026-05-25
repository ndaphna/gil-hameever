/**
 * Incremental distiller for Aliza per-user memory.
 *
 * Triggered fire-and-forget by /api/chat every 6 user messages. Uses
 * Haiku 4.5 (cheap, fast) to compress recent chat + journal into the
 * structured aliza_user_memory row.
 *
 * Auth: x-admin-token header must match ADMIN_IMPORT_TOKEN. This is an
 * internal endpoint, never exposed to end-users.
 *
 * Body: { userId: string, trigger: 'incremental' }
 */

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { supabaseAdmin } from '@/lib/supabase-server';
import { loadAlizaMemory, persistDistilledMemory } from '@/lib/aliza/memory';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 500;

let _client: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set');
  _client = new Anthropic({ apiKey });
  return _client;
}

const SYSTEM_PROMPT = `את עוזרת זיקוק זיכרון של עליזה, יועצת AI לגיל המעבר.
משימתך: לקרוא את ההודעות האחרונות + הזיכרון הנוכחי + רישומי היומן, ולעדכן את הסיכום המבני של מה שעליזה יודעת על המשתמשת.

חוקים:
1. החזירי JSON תקין בלבד, ללא טקסט נוסף, ללא markdown, ללא code fences.
2. ה-context_summary חייב להיות 3-8 שורות בולטים בעברית, מקסימום 600 תווים בסה"כ. ענייני, לא רגשני.
3. things_tried: כלים שהמשתמשת אמרה שניסתה (אם אמרה). מקסימום 6 פריטים.
4. preferences: אם משתמע מהשיחה שהיא מעדיפה טון מסוים, ציינו. אחרת השאירי ריק.
5. אם אין שינוי משמעותי לעומת הזיכרון הנוכחי, החזירי את אותם ערכים.
6. אל תמציאי. רק מה שמשתמע בבירור מהנתונים.

מבנה JSON חובה:
{
  "context_summary": "string",
  "current_stage": "pre_menopause" | "perimenopause" | "menopause" | "postmenopause" | "unknown",
  "active_symptoms": ["string"],
  "things_tried": [{"action":"string","outcome":"string","mentioned_at":"YYYY-MM-DD"}],
  "preferences": {"tone":"warm"|"direct"|"clinical","length":"short"|"medium"|"long"}
}`;

type DistilledOutput = {
  context_summary: string;
  current_stage: 'pre_menopause' | 'perimenopause' | 'menopause' | 'postmenopause' | 'unknown';
  active_symptoms: string[];
  things_tried: Array<{ action: string; outcome?: string; mentioned_at?: string }>;
  preferences: Record<string, unknown>;
};

export async function POST(req: NextRequest) {
  const adminToken = req.headers.get('x-admin-token');
  if (!adminToken || adminToken !== process.env.ADMIN_IMPORT_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const userId = body?.userId as string | undefined;
  if (!userId) return NextResponse.json({ error: 'missing_user_id' }, { status: 400 });

  const startedAt = Date.now();

  // Gather inputs.
  const [currentMemory, recentMessages, recentEntries, recentInsights] = await Promise.all([
    loadAlizaMemory(userId),
    supabaseAdmin
      .from('message')
      .select('role, content, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(12),
    supabaseAdmin
      .from('daily_entries')
      .select('date, sleep_quality, hot_flashes, night_sweats, energy_level, mood, concentration_difficulty, pain, dryness')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(14),
    supabaseAdmin
      .from('journal_insights')
      .select('type, title, description, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const messages = (recentMessages.data ?? []).reverse(); // chronological
  const entries = recentEntries.data ?? [];
  const insights = recentInsights.data ?? [];

  const userPrompt = `הזיכרון הנוכחי שלך על המשתמשת:
${JSON.stringify({
  context_summary: currentMemory?.context_summary ?? null,
  current_stage: currentMemory?.current_stage ?? 'unknown',
  active_symptoms: currentMemory?.active_symptoms ?? [],
  things_tried: currentMemory?.things_tried ?? [],
  preferences: currentMemory?.preferences ?? {},
}, null, 2)}

הודעות אחרונות בשיחה (כרונולוגי, ${messages.length} הודעות):
${messages.map((m: any) => `[${m.role}] ${m.content}`).join('\n\n')}

רישומי יומן ב-14 ימים אחרונים (${entries.length} רישומים):
${JSON.stringify(entries)}

תובנות אחרונות מהיומן (${insights.length}):
${insights.map((i: any) => `[${i.type}] ${i.title}: ${i.description}`).join('\n')}

החזירי את הזיכרון המעודכן כ-JSON בלבד.`;

  let parsed: DistilledOutput;
  let usage: Anthropic.Usage;
  try {
    const client = getAnthropic();
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      temperature: 0.2,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    });
    usage = resp.usage;
    const rawText = resp.content
      .filter(b => b.type === 'text')
      .map(b => (b as { type: 'text'; text: string }).text)
      .join('')
      .trim();
    // Strip accidental code fences if model slips.
    const cleaned = rawText.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '');
    parsed = JSON.parse(cleaned) as DistilledOutput;
  } catch (err) {
    console.error('❌ Distiller failed:', err);
    return NextResponse.json(
      { error: 'distill_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }

  try {
    await persistDistilledMemory(userId, {
      context_summary: (parsed.context_summary ?? '').slice(0, 600),
      current_stage: parsed.current_stage ?? 'unknown',
      active_symptoms: Array.isArray(parsed.active_symptoms) ? parsed.active_symptoms.slice(0, 10) : [],
      things_tried: Array.isArray(parsed.things_tried) ? parsed.things_tried.slice(0, 6) : [],
      preferences: typeof parsed.preferences === 'object' && parsed.preferences ? parsed.preferences : {},
    });
  } catch (err) {
    console.error('❌ persistDistilledMemory failed:', err);
    return NextResponse.json(
      { error: 'persist_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    elapsed_ms: Date.now() - startedAt,
    input_tokens: usage.input_tokens,
    output_tokens: usage.output_tokens,
    summary_chars: parsed.context_summary?.length ?? 0,
  });
}
