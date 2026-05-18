/**
 * Cancel a scheduled broadcast campaign in Brevo and clear local schedule.
 *
 * Auth: session must have a newsletter role (campaign_manager).
 *
 * POST /api/admin/newsletter/:id/cancel-broadcast
 * Returns: { ok: true, cancelled_campaign_id }
 *
 * Cannot cancel a campaign that already sent. Cannot cancel if there is no
 * scheduled campaign.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { cancelScheduledCampaign, getCampaign } from '@/lib/newsletter/brevo-campaign';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { data: allowed, error: roleError } = await supabase
    .schema('newsletter')
    .rpc('has_role', { required: 'campaign_manager' });

  if (roleError || allowed !== true) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const { data: draft, error: loadError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .select('id, broadcast_scheduled_at, broadcast_sent_at, brevo_campaign_id')
    .eq('id', id)
    .maybeSingle<{
      id: string;
      broadcast_scheduled_at: string | null;
      broadcast_sent_at: string | null;
      brevo_campaign_id: number | null;
    }>();

  if (loadError || !draft) {
    return NextResponse.json(
      { error: 'not_found', detail: loadError?.message },
      { status: 404 },
    );
  }

  if (draft.broadcast_sent_at) {
    return NextResponse.json(
      { error: 'already_sent', sent_at: draft.broadcast_sent_at },
      { status: 409 },
    );
  }

  if (!draft.broadcast_scheduled_at || !draft.brevo_campaign_id) {
    return NextResponse.json(
      { error: 'nothing_scheduled' },
      { status: 400 },
    );
  }

  // Reconcile with Brevo before cancelling. If the campaign already moved to
  // `sent` (the scheduled time passed while our DB still showed `scheduled`),
  // there's nothing to suspend — we mark broadcast_sent_at locally instead.
  let snapshot;
  try {
    snapshot = await getCampaign(draft.brevo_campaign_id);
  } catch (err) {
    return NextResponse.json(
      { error: 'brevo_status_check_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }

  const cancelledId = draft.brevo_campaign_id;
  const alreadySent = snapshot.status === 'sent' || !!snapshot.sentDate;

  if (alreadySent) {
    const sentIso = snapshot.sentDate
      ? new Date(snapshot.sentDate).toISOString()
      : (draft.broadcast_scheduled_at ?? new Date().toISOString());
    const { error: persistError } = await supabase
      .schema('newsletter')
      .from('email_drafts')
      .update({
        broadcast_scheduled_at: null,
        broadcast_sent_at: sentIso,
        status: 'published',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    if (persistError) {
      return NextResponse.json(
        {
          error: 'persist_failed',
          detail: persistError.message,
          hint: 'campaign already sent in Brevo; failed to update local state',
        },
        { status: 500 },
      );
    }
    return NextResponse.json({
      ok: true,
      reconciled: 'already_sent',
      cancelled_campaign_id: cancelledId,
      sent_at: sentIso,
    });
  }

  try {
    await cancelScheduledCampaign(cancelledId);
  } catch (err) {
    return NextResponse.json(
      { error: 'brevo_cancel_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }

  const { error: persistError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .update({
      broadcast_scheduled_at: null,
      brevo_campaign_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (persistError) {
    return NextResponse.json(
      {
        error: 'persist_failed',
        detail: persistError.message,
        cancelled_campaign_id: cancelledId,
        hint: 'campaign was cancelled in Brevo; sync state manually',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    cancelled_campaign_id: cancelledId,
  });
}
