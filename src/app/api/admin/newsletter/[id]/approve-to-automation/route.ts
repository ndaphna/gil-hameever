/**
 * Approve a pending-for-automation draft. Runs the full path in one shot:
 *   1. Sync template to Brevo (POST/PUT) if not yet synced — guarantees the
 *      latest body/subject is reflected in the Brevo template.
 *   2. Enqueue the draft as the next step in the welcome automation, using
 *      `intended_automation_delay_days` (or 8 if null).
 *   3. Flip status to 'published'.
 *
 * Auth: campaign_manager.
 *
 * POST /api/admin/newsletter/:id/approve-to-automation
 * Body (optional): { delay_days?: number } — overrides intended delay
 * Returns: { ok, automation_order, brevo_template_id, sends_inserted, sends_retroactive, sends_future }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { syncTemplateToBrevo } from '@/lib/newsletter/brevo-template';
import {
  enqueueDraftForAllSubscribers,
  nextOrder,
} from '@/lib/newsletter/automation-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(
  request: NextRequest,
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

  let bodyJson: { delay_days?: unknown } = {};
  try {
    bodyJson = (await request.json()) as { delay_days?: unknown };
  } catch {
    // empty body OK
  }

  const { data: draft, error: loadError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .select(
      'id, subject, body_text, brevo_template_id, header_image_url, automation_config_id, intended_for_automation, intended_automation_delay_days',
    )
    .eq('id', id)
    .maybeSingle<{
      id: string;
      subject: string;
      body_text: string | null;
      brevo_template_id: number | null;
      header_image_url: string | null;
      automation_config_id: string | null;
      intended_for_automation: boolean;
      intended_automation_delay_days: number | null;
    }>();

  if (loadError || !draft) {
    return NextResponse.json(
      { error: 'not_found', detail: loadError?.message },
      { status: 404 },
    );
  }
  if (!draft.subject.trim() || !(draft.body_text ?? '').trim()) {
    return NextResponse.json({ error: 'incomplete_draft' }, { status: 400 });
  }
  if (draft.automation_config_id) {
    return NextResponse.json(
      { error: 'already_in_automation' },
      { status: 409 },
    );
  }

  const delayDays = (() => {
    if (typeof bodyJson.delay_days === 'number' && Number.isFinite(bodyJson.delay_days)) {
      const v = Math.floor(bodyJson.delay_days);
      if (v >= 1 && v <= 365) return v;
    }
    if (draft.intended_automation_delay_days) return draft.intended_automation_delay_days;
    return 8;
  })();

  // 1. Sync template to Brevo (idempotent — PUT if id exists).
  let brevoTemplateId = draft.brevo_template_id;
  try {
    const syncRes = await syncTemplateToBrevo(brevoTemplateId, {
      subject: draft.subject,
      bodyText: draft.body_text ?? '',
      headerImageUrl: draft.header_image_url,
    });
    brevoTemplateId = syncRes.templateId;
    if (brevoTemplateId !== draft.brevo_template_id) {
      const { error } = await supabase
        .schema('newsletter')
        .from('email_drafts')
        .update({ brevo_template_id: brevoTemplateId, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) {
        return NextResponse.json(
          { error: 'persist_template_id_failed', detail: error.message, brevo_template_id: brevoTemplateId },
          { status: 500 },
        );
      }
    }
  } catch (err) {
    return NextResponse.json(
      { error: 'brevo_sync_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }

  // 2. Look up the default config and enqueue.
  const { data: config, error: cfgError } = await supabase
    .schema('newsletter')
    .from('automation_config')
    .select('id')
    .eq('name', 'welcome_series')
    .maybeSingle<{ id: string }>();
  if (cfgError || !config) {
    return NextResponse.json(
      { error: 'config_not_found', detail: cfgError?.message },
      { status: 404 },
    );
  }

  let order: number;
  try {
    order = await nextOrder(supabase, config.id);
  } catch (err) {
    return NextResponse.json(
      { error: 'next_order_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }

  const { error: assignError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .update({
      automation_config_id: config.id,
      automation_delay_days: delayDays,
      automation_order: order,
      automation_enqueued_at: new Date().toISOString(),
      status: 'published',
      intended_for_automation: false, // intent consumed
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (assignError) {
    return NextResponse.json(
      { error: 'draft_update_failed', detail: assignError.message },
      { status: 500 },
    );
  }

  let enqueueRes;
  try {
    enqueueRes = await enqueueDraftForAllSubscribers(supabase, id);
  } catch (err) {
    return NextResponse.json(
      {
        error: 'enqueue_failed',
        detail: err instanceof Error ? err.message : String(err),
        hint: 'draft was added to automation but send rows were not generated; retry by removing + re-adding',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    brevo_template_id: brevoTemplateId,
    automation_order: order,
    delay_days: delayDays,
    sends_inserted: enqueueRes.inserted,
    sends_retroactive: enqueueRes.retroactive,
    sends_future: enqueueRes.future,
    total_subscribers: enqueueRes.total_subs,
  });
}
