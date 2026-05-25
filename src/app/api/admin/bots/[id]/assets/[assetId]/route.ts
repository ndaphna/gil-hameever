/**
 * DELETE /api/admin/bots/[id]/assets/[assetId] — remove asset row + storage object.
 *
 * Authorized when the caller can delete the asset row per RLS (creator+draft
 * or admin). Storage object is removed via service-role client AFTER the row
 * is gone, so an orphan is impossible.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; assetId: string }> },
) {
  const { id: briefId, assetId } = await params;
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Need the storage_path before deleting the row.
  const { data: asset, error: fetchErr } = await supabase
    .schema('bots')
    .from('brief_assets')
    .select('storage_path, brief_id')
    .eq('id', assetId)
    .eq('brief_id', briefId)
    .single();

  if (fetchErr || !asset) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const { error: deleteErr } = await supabase
    .schema('bots')
    .from('brief_assets')
    .delete()
    .eq('id', assetId);

  if (deleteErr) {
    return NextResponse.json({ error: 'forbidden', detail: deleteErr.message }, { status: 403 });
  }

  // Best-effort storage cleanup. If it fails the row is already gone so the
  // worst case is a stale file — fine.
  await supabaseAdmin.storage.from('bot-brief-assets').remove([asset.storage_path]);

  return NextResponse.json({ ok: true });
}
