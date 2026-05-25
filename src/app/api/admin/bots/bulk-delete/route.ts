/**
 * POST /api/admin/bots/bulk-delete
 *
 * Body: { ids: string[] }
 * Deletes the given briefs. RLS enforces who can delete what — creator can
 * delete only own drafts, admin can delete anything. Storage assets are
 * cascade-removed via the FK; storage objects are not auto-cleaned, but stale
 * orphans are harmless (private bucket).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: { ids?: unknown };
  try {
    body = (await req.json()) as { ids?: unknown };
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (!Array.isArray(body.ids) || body.ids.length === 0) {
    return NextResponse.json({ error: 'no_ids' }, { status: 400 });
  }
  const ids = body.ids.filter((x): x is string => typeof x === 'string').slice(0, 100);
  if (ids.length === 0) {
    return NextResponse.json({ error: 'no_valid_ids' }, { status: 400 });
  }

  // Collect storage paths before deletion (cascade wipes the row but not the
  // physical objects in the bucket).
  const { data: assets } = await supabase
    .schema('bots')
    .from('brief_assets')
    .select('storage_path')
    .in('brief_id', ids);

  const { data: deleted, error } = await supabase
    .schema('bots')
    .from('briefs')
    .delete()
    .in('id', ids)
    .select('id');

  if (error) {
    return NextResponse.json({ error: 'delete_failed', detail: error.message }, { status: 403 });
  }

  const paths = (assets ?? []).map((a) => (a as { storage_path: string }).storage_path);
  if (paths.length > 0) {
    await supabaseAdmin.storage.from('bot-brief-assets').remove(paths);
  }

  return NextResponse.json({ ok: true, deleted: (deleted ?? []).length });
}
