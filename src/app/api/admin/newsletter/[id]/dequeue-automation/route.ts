/**
 * Remove a draft from its automation. Deletes all PENDING send rows
 * (sent_at is null AND failed_at is null). Sent/failed rows are preserved
 * for the stats panel.
 *
 * Auth: campaign_manager.
 *
 * POST /api/admin/newsletter/:id/dequeue-automation
 * Returns: { ok, pending_deleted, kept_history }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: allowed, error: roleError } = await supabase
    .schema('newsletter')
    .rpc('has_role', { required: 'campaign_manager' });
  if (roleError || allowed !== true) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const { data: draft, error: loadError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .select('id, automation_config_id')
    .eq('id', id)
    .maybeSingle();
  if (loadError || !draft) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  if (!draft.automation_config_id) {
    return NextResponse.json({ error: 'not_in_automation' }, { status: 400 });
  }

  const { data: pending, error: deleteError } = await supabase
    .schema('newsletter')
    .from('automation_sends')
    .delete()
    .eq('draft_id', id)
    .is('sent_at', null)
    .is('failed_at', null)
    .select('id');
  if (deleteError) {
    return NextResponse.json(
      { error: 'delete_pending_failed', detail: deleteError.message },
      { status: 500 },
    );
  }

  const { count: keptCount } = await supabase
    .schema('newsletter')
    .from('automation_sends')
    .select('*', { count: 'exact', head: true })
    .eq('draft_id', id);

  const { error: updateError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .update({
      automation_config_id: null,
      automation_delay_days: null,
      automation_order: null,
      automation_enqueued_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (updateError) {
    return NextResponse.json(
      { error: 'draft_update_failed', detail: updateError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    pending_deleted: pending?.length ?? 0,
    kept_history: keptCount ?? 0,
  });
}
