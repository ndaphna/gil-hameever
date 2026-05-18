/**
 * Broadcast a draft as a Brevo email campaign — either send now or schedule.
 *
 * Auth: session must have a newsletter role.
 *
 * POST /api/admin/newsletter/:id/broadcast
 * Body: { mode: 'now' | 'scheduled', scheduled_at?: string }
 * Returns: { ok: true, campaign_id, mode, scheduled_at? }
 *
 * Preconditions:
 *   - draft must have brevo_template_id (push to Brevo first)
 *   - draft must have subject + body_text
 *   - scheduled mode requires scheduled_at in the future (ISO string)
 *   - cannot broadcast a draft that already has broadcast_sent_at
 *   - cannot create a new broadcast if one is already scheduled (must cancel first)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createCampaign, sendCampaignNow } from '@/lib/newsletter/brevo-campaign';
import { syncTemplateToBrevo } from '@/lib/newsletter/brevo-template';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const MASTER_LIST_ID = Number(process.env.BREVO_MASTER_LIST_ID ?? 12);

type BroadcastBody = {
  mode?: unknown;
  scheduled_at?: unknown;
};

export async function POST(
  request: NextRequest,
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

  let body: BroadcastBody;
  try {
    body = (await request.json()) as BroadcastBody;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const mode = body.mode === 'scheduled' ? 'scheduled' : body.mode === 'now' ? 'now' : null;
  if (!mode) {
    return NextResponse.json(
      { error: 'invalid_mode', hint: "must be 'now' or 'scheduled'" },
      { status: 400 },
    );
  }

  let scheduledIso: string | null = null;
  if (mode === 'scheduled') {
    if (typeof body.scheduled_at !== 'string') {
      return NextResponse.json(
        { error: 'missing_scheduled_at' },
        { status: 400 },
      );
    }
    const when = new Date(body.scheduled_at);
    if (isNaN(when.getTime())) {
      return NextResponse.json(
        { error: 'invalid_scheduled_at', hint: 'expected ISO 8601' },
        { status: 400 },
      );
    }
    if (when.getTime() < Date.now() + 60_000) {
      return NextResponse.json(
        { error: 'scheduled_at_too_soon', hint: 'must be at least 1 minute in the future' },
        { status: 400 },
      );
    }
    scheduledIso = when.toISOString();
  }

  const { data: draft, error: loadError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .select(
      'id, subject, body_text, brevo_template_id, header_image_url, broadcast_scheduled_at, broadcast_sent_at, brevo_campaign_id',
    )
    .eq('id', id)
    .maybeSingle<{
      id: string;
      subject: string;
      body_text: string | null;
      brevo_template_id: number | null;
      header_image_url: string | null;
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

  if (!draft.subject.trim() || !(draft.body_text ?? '').trim()) {
    return NextResponse.json(
      { error: 'incomplete_draft' },
      { status: 400 },
    );
  }

  // Auto-sync the template to Brevo before sending. PUT if it already
  // exists (so the broadcast reflects latest body), POST on first send.
  let brevoTemplateId = draft.brevo_template_id;
  try {
    const syncRes = await syncTemplateToBrevo(brevoTemplateId, {
      subject: draft.subject,
      bodyText: draft.body_text ?? '',
      headerImageUrl: draft.header_image_url,
    });
    brevoTemplateId = syncRes.templateId;
    if (brevoTemplateId !== draft.brevo_template_id) {
      const { error: persistTemplateErr } = await supabase
        .schema('newsletter')
        .from('email_drafts')
        .update({ brevo_template_id: brevoTemplateId, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (persistTemplateErr) {
        return NextResponse.json(
          {
            error: 'persist_template_id_failed',
            detail: persistTemplateErr.message,
            brevo_template_id: brevoTemplateId,
          },
          { status: 500 },
        );
      }
    }
  } catch (err) {
    return NextResponse.json(
      { error: 'brevo_template_sync_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
  if (draft.broadcast_sent_at) {
    return NextResponse.json(
      { error: 'already_sent', sent_at: draft.broadcast_sent_at },
      { status: 409 },
    );
  }
  if (draft.broadcast_scheduled_at && draft.brevo_campaign_id) {
    return NextResponse.json(
      {
        error: 'already_scheduled',
        scheduled_at: draft.broadcast_scheduled_at,
        campaign_id: draft.brevo_campaign_id,
        hint: 'cancel the existing schedule first',
      },
      { status: 409 },
    );
  }

  let campaignId: number;
  try {
    const created = await createCampaign({
      templateId: brevoTemplateId,
      subject: draft.subject,
      campaignName: `[gilhameever] ${draft.subject.slice(0, 60)} — ${new Date().toISOString().slice(0, 10)}`,
      listIds: [MASTER_LIST_ID],
      scheduledAt: scheduledIso,
    });
    campaignId = created.campaignId;
  } catch (err) {
    return NextResponse.json(
      { error: 'brevo_create_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }

  if (mode === 'now') {
    try {
      await sendCampaignNow(campaignId);
    } catch (err) {
      return NextResponse.json(
        {
          error: 'brevo_send_failed',
          detail: err instanceof Error ? err.message : String(err),
          campaign_id: campaignId,
        },
        { status: 502 },
      );
    }
  }

  const now = new Date().toISOString();
  const update: Record<string, unknown> = {
    brevo_campaign_id: campaignId,
    updated_at: now,
  };
  if (mode === 'now') {
    update.broadcast_sent_at = now;
    update.broadcast_scheduled_at = null;
    update.status = 'published';
  } else {
    update.broadcast_scheduled_at = scheduledIso;
    update.broadcast_sent_at = null;
  }

  const { error: persistError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .update(update)
    .eq('id', id);

  if (persistError) {
    return NextResponse.json(
      {
        error: 'persist_failed',
        detail: persistError.message,
        campaign_id: campaignId,
        hint: 'campaign was created in Brevo; sync state manually',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    campaign_id: campaignId,
    mode,
    scheduled_at: scheduledIso,
  });
}
