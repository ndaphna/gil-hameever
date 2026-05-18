/**
 * Add a draft to the tail of an automation flow.
 *
 * Auth: session must have a newsletter role (campaign_manager).
 *
 * POST /api/admin/newsletter/:id/enqueue-automation
 * Body: { delay_days?: number (default 7), config_name?: string (default 'welcome_series') }
 * Returns: { ok, automation_order, sends_inserted, sends_retroactive, sends_future, total_subscribers }
 *
 * Preconditions:
 *   - draft has brevo_template_id (push to Brevo first)
 *   - draft is not already in an automation
 *   - delay_days between 1 and 365
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import {
  enqueueDraftForAllSubscribers,
  nextOrder,
} from '@/lib/newsletter/automation-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type Body = { delay_days?: unknown; config_name?: unknown };

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

  let body: Body = {};
  try {
    body = (await request.json()) as Body;
  } catch {
    // empty body OK — use defaults
  }

  const delayDays = (() => {
    if (typeof body.delay_days === 'number' && Number.isFinite(body.delay_days)) {
      return Math.floor(body.delay_days);
    }
    return 8;
  })();
  if (delayDays < 1 || delayDays > 365) {
    return NextResponse.json(
      { error: 'invalid_delay_days', hint: '1..365' },
      { status: 400 },
    );
  }

  const configName = typeof body.config_name === 'string' ? body.config_name : 'welcome_series';

  const { data: draft, error: loadError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .select('id, subject, body_text, brevo_template_id, automation_config_id')
    .eq('id', id)
    .maybeSingle<{
      id: string;
      subject: string;
      body_text: string | null;
      brevo_template_id: number | null;
      automation_config_id: string | null;
    }>();
  if (loadError || !draft) {
    return NextResponse.json(
      { error: 'not_found', detail: loadError?.message },
      { status: 404 },
    );
  }
  if (draft.brevo_template_id === null) {
    return NextResponse.json(
      { error: 'no_template', hint: 'sync to Brevo first' },
      { status: 400 },
    );
  }
  if (!draft.subject.trim() || !(draft.body_text ?? '').trim()) {
    return NextResponse.json({ error: 'incomplete_draft' }, { status: 400 });
  }
  if (draft.automation_config_id) {
    return NextResponse.json(
      { error: 'already_in_automation', hint: 'remove first' },
      { status: 409 },
    );
  }

  const { data: config, error: cfgError } = await supabase
    .schema('newsletter')
    .from('automation_config')
    .select('id, name, anchor_day')
    .eq('name', configName)
    .maybeSingle<{ id: string; name: string; anchor_day: number }>();
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

  const { error: updateError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .update({
      automation_config_id: config.id,
      automation_delay_days: delayDays,
      automation_order: order,
      automation_enqueued_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (updateError) {
    return NextResponse.json(
      { error: 'draft_update_failed', detail: updateError.message },
      { status: 500 },
    );
  }

  let result;
  try {
    result = await enqueueDraftForAllSubscribers(supabase, id);
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
    automation_order: order,
    config_id: config.id,
    delay_days: delayDays,
    sends_inserted: result.inserted,
    sends_retroactive: result.retroactive,
    sends_future: result.future,
    total_subscribers: result.total_subs,
  });
}
