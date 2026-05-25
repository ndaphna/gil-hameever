/**
 * User-facing endpoints for the aliza_user_memory row.
 *
 * GET    /api/aliza/memory  → returns the user's own memory row (or null)
 * DELETE /api/aliza/memory  → wipes the user's memory row (the "שכחי הכל" button)
 *
 * Both require an authenticated session. Service role does the DB operation
 * after verifying auth.uid matches.
 */

import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { loadAlizaMemory, deleteAlizaMemory } from '@/lib/aliza/memory';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const memory = await loadAlizaMemory(user.id);
  return NextResponse.json({ memory });
}

export async function DELETE() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    await deleteAlizaMemory(user.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'delete_failed' },
      { status: 500 },
    );
  }
}
