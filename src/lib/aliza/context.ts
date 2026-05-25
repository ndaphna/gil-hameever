/**
 * Per-turn Aliza context builder.
 *
 * Loads everything Aliza needs to know about the woman she's about to talk to
 * in a single parallel fetch. Caps every block to keep the token budget tight
 * (see spec: token economics).
 */

import { supabaseAdmin } from '@/lib/supabase-server';
import { loadAlizaMemory, formatMemoryBlock, type AlizaMemory } from './memory';
import { detectTopics, pickResources, formatResourcesBlock, shouldLoadResources, type Resource } from './resources';

export type UserProfileLite = {
  first_name: string | null;
  name: string | null;
  full_name: string | null;
  birth_year: number | null;
  last_period_date: string | null;
};

export type RecentInsight = {
  type: 'pattern' | 'trend' | 'suggestion';
  title: string;
  description: string;
  created_at: string;
};

export type DailyEntrySummary = {
  // Plain-text 7-day summary like:
  // "שינה חלשה ב-4/7 לילות; גלי חום ב-3/7; מצב רוח נמוך פעמיים; אנרגיה נמוכה ב-5/7"
  summary: string;
  recentSymptoms: string[];
};

export type AlizaContext = {
  profile: UserProfileLite | null;
  memory: AlizaMemory | null;
  recentInsights: RecentInsight[];
  dailySummary: DailyEntrySummary;
  resources: Resource[];
  /** Detected topic tags for this turn (used by RAG gate + telemetry). */
  topicTags: string[];
};

const INSIGHTS_CAP = 3;
const INSIGHT_DESC_CAP = 200;
const DAILY_LOOKBACK_DAYS = 7;

export async function buildAlizaContext(userId: string, userMessage: string): Promise<AlizaContext> {
  const [profileResult, memory, insights, dailyEntries] = await Promise.all([
    supabaseAdmin
      .from('user_profile')
      .select('first_name, name, full_name, birth_year, last_period_date')
      .eq('id', userId)
      .maybeSingle(),
    loadAlizaMemory(userId),
    loadRecentInsights(userId),
    loadRecentDailyEntries(userId),
  ]);

  const profile = (profileResult.data ?? null) as UserProfileLite | null;
  const dailySummary = summarizeDailyEntries(dailyEntries);

  // Combine recent active symptoms from memory + last 7 days for topic detection.
  const recentSymptoms = Array.from(new Set([
    ...(memory?.active_symptoms ?? []),
    ...dailySummary.recentSymptoms,
  ]));

  const topicTags = detectTopics(userMessage, recentSymptoms);

  // Resource gate: skip the DB hit if the message is too short or no topic match.
  const resources = shouldLoadResources(userMessage, recentSymptoms)
    ? await pickResources(topicTags, 2)
    : [];

  return {
    profile,
    memory,
    recentInsights: insights,
    dailySummary,
    resources,
    topicTags,
  };
}

async function loadRecentInsights(userId: string): Promise<RecentInsight[]> {
  const { data, error } = await supabaseAdmin
    .from('journal_insights')
    .select('type, title, description, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(INSIGHTS_CAP);
  if (error) {
    console.warn('⚠️ Failed to load journal_insights:', error.message);
    return [];
  }
  return (data ?? []).map(r => ({
    type: r.type as RecentInsight['type'],
    title: r.title as string,
    description: ((r.description as string) ?? '').slice(0, INSIGHT_DESC_CAP),
    created_at: r.created_at as string,
  }));
}

type DailyEntryRow = {
  date: string;
  sleep_quality: 'poor' | 'fair' | 'good' | null;
  woke_up_night: boolean | null;
  night_sweats: boolean | null;
  energy_level: 'low' | 'medium' | 'high' | null;
  mood: 'calm' | 'irritated' | 'sad' | 'happy' | 'frustrated' | null;
  hot_flashes: boolean | null;
  dryness: boolean | null;
  pain: boolean | null;
  bloating: boolean | null;
  concentration_difficulty: boolean | null;
  sleep_issues: boolean | null;
};

async function loadRecentDailyEntries(userId: string): Promise<DailyEntryRow[]> {
  const since = new Date(Date.now() - DAILY_LOOKBACK_DAYS * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const { data, error } = await supabaseAdmin
    .from('daily_entries')
    .select(
      'date, sleep_quality, woke_up_night, night_sweats, energy_level, mood, hot_flashes, dryness, pain, bloating, concentration_difficulty, sleep_issues',
    )
    .eq('user_id', userId)
    .gte('date', since)
    .order('date', { ascending: false });
  if (error) {
    console.warn('⚠️ Failed to load daily_entries:', error.message);
    return [];
  }
  return (data ?? []) as DailyEntryRow[];
}

function summarizeDailyEntries(rows: DailyEntryRow[]): DailyEntrySummary {
  if (rows.length === 0) {
    return { summary: '', recentSymptoms: [] };
  }
  const n = rows.length;
  const counts = {
    poor_sleep: rows.filter(r => r.sleep_quality === 'poor' || r.sleep_issues).length,
    woke_up: rows.filter(r => r.woke_up_night).length,
    night_sweats: rows.filter(r => r.night_sweats).length,
    hot_flashes: rows.filter(r => r.hot_flashes).length,
    low_energy: rows.filter(r => r.energy_level === 'low').length,
    low_mood: rows.filter(r => r.mood === 'sad' || r.mood === 'frustrated' || r.mood === 'irritated').length,
    dryness: rows.filter(r => r.dryness).length,
    pain: rows.filter(r => r.pain).length,
    concentration: rows.filter(r => r.concentration_difficulty).length,
  };

  const fragments: string[] = [];
  if (counts.poor_sleep > 0)   fragments.push(`שינה חלשה ב-${counts.poor_sleep}/${n} לילות`);
  if (counts.woke_up > 0)      fragments.push(`התעוררות לילית ב-${counts.woke_up}/${n}`);
  if (counts.night_sweats > 0) fragments.push(`הזעות לילה ב-${counts.night_sweats}/${n}`);
  if (counts.hot_flashes > 0)  fragments.push(`גלי חום ב-${counts.hot_flashes}/${n} ימים`);
  if (counts.low_energy > 0)   fragments.push(`אנרגיה נמוכה ב-${counts.low_energy}/${n}`);
  if (counts.low_mood > 0)     fragments.push(`מצב רוח נמוך ב-${counts.low_mood}/${n}`);
  if (counts.concentration > 0) fragments.push(`קושי בריכוז ב-${counts.concentration}/${n}`);
  if (counts.dryness > 0)      fragments.push(`יובש ב-${counts.dryness}/${n}`);
  if (counts.pain > 0)         fragments.push(`כאבים ב-${counts.pain}/${n}`);

  const summary = fragments.length === 0
    ? `${n} רישומי יומן ב-7 הימים האחרונים, ללא דפוס בולט`
    : `${n} רישומי יומן ב-7 הימים האחרונים: ${fragments.slice(0, 5).join(', ')}`;

  const recentSymptoms: string[] = [];
  if (counts.poor_sleep > 0 || counts.woke_up > 0) recentSymptoms.push('sleep_issues');
  if (counts.night_sweats > 0) recentSymptoms.push('night_sweats');
  if (counts.hot_flashes > 0) recentSymptoms.push('hot_flashes');
  if (counts.low_energy > 0) recentSymptoms.push('low_energy', 'energy');
  if (counts.low_mood > 0) recentSymptoms.push('mood');
  if (counts.concentration > 0) recentSymptoms.push('concentration_difficulty');
  if (counts.dryness > 0) recentSymptoms.push('dryness');
  if (counts.pain > 0) recentSymptoms.push('pain');

  return { summary: summary.slice(0, 250), recentSymptoms };
}

/**
 * Render the full "what Aliza knows about you" block for the system prompt.
 */
export function formatUserContextBlock(ctx: AlizaContext): string {
  const firstName = (ctx.profile?.first_name || ctx.profile?.name || '').trim();
  const lines: string[] = [];

  if (firstName) {
    lines.push(`שם המשתמשת: ${firstName}.`);
  } else {
    lines.push('שם המשתמשת לא ידוע. אל תמציאי.');
  }

  if (ctx.profile?.birth_year) {
    const age = new Date().getFullYear() - ctx.profile.birth_year;
    if (age > 0 && age < 110) lines.push(`גיל משוער: ${age}.`);
  }

  if (ctx.profile?.last_period_date) {
    lines.push(`מחזור אחרון מתועד: ${ctx.profile.last_period_date}.`);
  }

  const memoryBlock = formatMemoryBlock(ctx.memory);
  if (memoryBlock) lines.push(memoryBlock);

  if (ctx.dailySummary.summary) {
    lines.push(`מהיומן שלה (7 ימים אחרונים): ${ctx.dailySummary.summary}.`);
  }

  if (ctx.recentInsights.length > 0) {
    const insights = ctx.recentInsights
      .map(i => `- [${i.type}] ${i.title}: ${i.description}`)
      .join('\n');
    lines.push(`תובנות אחרונות שהמערכת זיהתה ביומן שלה:\n${insights}`);
  }

  if (lines.length === 0) return '';

  return `============================================
מה את כבר יודעת על המשתמשת. השתמשי במידע הזה בעדינות, אל תקריאי אותו אליה. הוא מנחה אותך לדייק.
שאם רלוונטי, התייחסי לזה ("ראיתי ביומן ש..." / "סיפרת לי בשיחה הקודמת ש...").
============================================

${lines.join('\n\n')}`;
}
