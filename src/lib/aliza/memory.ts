/**
 * Read/write helpers for newsletter.aliza_user_memory.
 *
 * Writes are service-role only (this module runs server-side). Reads are
 * also via service-role; we authorize at the route level before calling.
 */

import { supabaseAdmin } from '@/lib/supabase-server';

export type AlizaMemory = {
  user_id: string;
  context_summary: string | null;
  current_stage: 'pre_menopause' | 'perimenopause' | 'menopause' | 'postmenopause' | 'unknown' | null;
  active_symptoms: string[];
  things_tried: Array<{ action: string; outcome?: string; mentioned_at?: string }>;
  preferences: Record<string, unknown>;
  message_count: number;
  last_distilled_at: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Load a user's memory row. Returns null if the user has never chatted
 * before — the chat route handles the null case gracefully.
 */
export async function loadAlizaMemory(userId: string): Promise<AlizaMemory | null> {
  const { data, error } = await supabaseAdmin
    .schema('newsletter')
    .from('aliza_user_memory')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.warn('⚠️ Failed to load aliza_user_memory:', error.message);
    return null;
  }
  if (!data) return null;
  // Normalize: defaults aren't always applied when columns are explicitly
  // omitted on INSERT (or on rows from an older schema). Force arrays/objects.
  return {
    user_id:           data.user_id,
    context_summary:   data.context_summary ?? null,
    current_stage:     data.current_stage ?? null,
    active_symptoms:   Array.isArray(data.active_symptoms) ? data.active_symptoms : [],
    things_tried:      Array.isArray(data.things_tried) ? data.things_tried : [],
    preferences:       (data.preferences && typeof data.preferences === 'object') ? data.preferences : {},
    message_count:     typeof data.message_count === 'number' ? data.message_count : 0,
    last_distilled_at: data.last_distilled_at ?? null,
    created_at:        data.created_at,
    updated_at:        data.updated_at,
  } as AlizaMemory;
}

/**
 * Increment the message_count for a user. Creates the row if missing.
 * Returns the new count so callers can decide whether to trigger distillation.
 */
export async function bumpMessageCount(userId: string): Promise<number> {
  // Upsert with COALESCE-style increment via two-step (Supabase JS doesn't
  // support arbitrary SQL in upsert). Use rpc if perf becomes an issue.
  const existing = await loadAlizaMemory(userId);

  if (!existing) {
    const { data, error } = await supabaseAdmin
      .schema('newsletter')
      .from('aliza_user_memory')
      .insert({ user_id: userId, message_count: 1 })
      .select('message_count')
      .single();
    if (error) {
      console.warn('⚠️ Failed to create aliza_user_memory:', error.message);
      return 0;
    }
    return data?.message_count ?? 1;
  }

  const next = (existing.message_count ?? 0) + 1;
  const { error } = await supabaseAdmin
    .schema('newsletter')
    .from('aliza_user_memory')
    .update({ message_count: next })
    .eq('user_id', userId);
  if (error) {
    console.warn('⚠️ Failed to bump message_count:', error.message);
    return existing.message_count ?? 0;
  }
  return next;
}

/**
 * Replace the structured fields after a distillation run.
 * `message_count` is preserved (not zeroed); `last_distilled_at` is set to now.
 */
export async function persistDistilledMemory(
  userId: string,
  distilled: Pick<AlizaMemory, 'context_summary' | 'current_stage' | 'active_symptoms' | 'things_tried' | 'preferences'>,
): Promise<void> {
  const { error } = await supabaseAdmin
    .schema('newsletter')
    .from('aliza_user_memory')
    .upsert(
      {
        user_id: userId,
        context_summary: distilled.context_summary,
        current_stage: distilled.current_stage,
        active_symptoms: distilled.active_symptoms ?? [],
        things_tried: distilled.things_tried ?? [],
        preferences: distilled.preferences ?? {},
        last_distilled_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );
  if (error) throw new Error(`Failed to persist distilled memory: ${error.message}`);
}

/**
 * Wipe a user's memory row. Used by the "שכחי הכל" button + on account
 * deletion (cascade handles that automatically).
 */
export async function deleteAlizaMemory(userId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .schema('newsletter')
    .from('aliza_user_memory')
    .delete()
    .eq('user_id', userId);
  if (error) throw new Error(`Failed to delete aliza_user_memory: ${error.message}`);
}

/**
 * Render the memory as a compact Hebrew block for injection into the system
 * prompt. Capped at ~800 chars to keep token budget tight. Returns empty
 * string for null/empty memory (first-time user).
 */
export function formatMemoryBlock(memory: AlizaMemory | null): string {
  if (!memory || (!memory.context_summary && memory.active_symptoms.length === 0)) return '';

  const parts: string[] = [];
  if (memory.current_stage && memory.current_stage !== 'unknown') {
    parts.push(`שלב: ${memory.current_stage}`);
  }
  if (memory.active_symptoms.length > 0) {
    parts.push(`תסמינים פעילים: ${memory.active_symptoms.slice(0, 6).join(', ')}`);
  }
  if (memory.context_summary) {
    parts.push(`סיכום מה שאני יודעת עליה:\n${memory.context_summary.slice(0, 600)}`);
  }
  if (memory.things_tried.length > 0) {
    const tried = memory.things_tried
      .slice(0, 4)
      .map(t => `- ${t.action}${t.outcome ? ` → ${t.outcome}` : ''}`)
      .join('\n');
    parts.push(`כלים שכבר ניסתה (אל תחזרי עליהם בלי הקשר):\n${tried}`);
  }
  return parts.join('\n\n');
}
