/**
 * Brevo webhook receiver.
 *
 * Configure in Brevo dashboard:
 *   URL: https://<your-domain>/api/brevo/webhook?token=<BREVO_WEBHOOK_TOKEN>
 *   Events: delivered, opened, click, hard_bounce, soft_bounce, spam,
 *           unsubscribed, blocked, error, deferred
 *
 * Brevo posts either a single JSON object or an array. We tolerate both.
 * Return 2xx fast — Brevo retries on 5xx.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import type { BrevoWebhookEvent } from '@/types/newsletter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

function parseEventTimestamp(e: BrevoWebhookEvent): string {
  if (typeof e.ts_event === 'number') return new Date(e.ts_event * 1000).toISOString();
  if (typeof e.ts_epoch === 'number') return new Date(e.ts_epoch).toISOString();
  if (typeof e.ts === 'number') return new Date(e.ts * 1000).toISOString();
  if (typeof e.date === 'string') {
    const d = new Date(e.date.replace(' ', 'T') + 'Z');
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

function normalizeEventType(raw: string): string {
  // Brevo uses 'click' (singular). Normalize a couple of variants.
  const map: Record<string, string> = {
    clicked: 'click',
    open: 'opened',
    unsubscribe: 'unsubscribed',
    hardbounce: 'hard_bounce',
    softbounce: 'soft_bounce',
  };
  return map[raw] ?? raw;
}

async function resolveSubscriberId(
  brevoContactId: number | undefined,
  email: string | undefined
): Promise<string | null> {
  if (!brevoContactId && !email) return null;

  const supabase = supabaseAdmin.schema('newsletter');

  if (brevoContactId) {
    const { data } = await supabase
      .from('subscribers')
      .select('id')
      .eq('brevo_contact_id', brevoContactId)
      .maybeSingle();
    if (data?.id) return data.id;
  }

  if (email) {
    const { data } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    if (data?.id) return data.id;
  }

  return null;
}

async function resolveDraftId(templateId: number | undefined): Promise<string | null> {
  if (!templateId) return null;
  const { data } = await supabaseAdmin
    .schema('newsletter')
    .from('email_drafts')
    .select('id')
    .eq('brevo_template_id', templateId)
    .maybeSingle();
  return data?.id ?? null;
}

async function updateProgress(
  subscriberId: string,
  eventType: string,
  eventAt: string,
  draftId: string | null
): Promise<void> {
  // Only update progress fields for events that imply forward motion or a hard stop.
  const stateUpdates: Record<string, unknown> = {};

  switch (eventType) {
    case 'delivered':
      stateUpdates.last_delivered_at = eventAt;
      break;
    case 'opened':
    case 'unique_opened':
      stateUpdates.last_opened_at = eventAt;
      break;
    case 'click':
      stateUpdates.last_clicked_at = eventAt;
      break;
    case 'unsubscribed':
      stateUpdates.state = 'unsubscribed';
      break;
    case 'hard_bounce':
    case 'spam':
    case 'blocked':
      stateUpdates.state = 'bounced';
      break;
    default:
      return;
  }

  // We don't know which sequence(s) the subscriber is on without joining.
  // For now: update *all* progress rows for this subscriber. Cheap at scale of 10–10k.
  const { error } = await supabaseAdmin
    .schema('newsletter')
    .from('subscriber_progress')
    .update(stateUpdates)
    .eq('subscriber_id', subscriberId);

  if (error) {
    console.error('[brevo webhook] progress update error', error);
  }

  // If the event is a delivery and we know the draft, advance current_order_key.
  if (eventType === 'delivered' && draftId) {
    const { data: draft } = await supabaseAdmin
      .schema('newsletter')
      .from('email_drafts')
      .select('order_key, sequence_id, delay_days')
      .eq('id', draftId)
      .maybeSingle();

    if (draft?.order_key !== null && draft?.sequence_id) {
      const { data: seq } = await supabaseAdmin
        .schema('newsletter')
        .from('sequences')
        .select('default_delay_days')
        .eq('id', draft.sequence_id)
        .maybeSingle();

      const delayDays = draft.delay_days ?? seq?.default_delay_days ?? 4;
      const nextEligible = new Date(
        new Date(eventAt).getTime() + delayDays * 24 * 60 * 60 * 1000
      ).toISOString();

      await supabaseAdmin
        .schema('newsletter')
        .from('subscriber_progress')
        .update({
          current_order_key: draft.order_key,
          last_sent_at: eventAt,
          next_eligible_at: nextEligible,
        })
        .eq('subscriber_id', subscriberId)
        .eq('sequence_id', draft.sequence_id);
    }
  }
}

async function ingestEvent(event: BrevoWebhookEvent): Promise<void> {
  const eventType = normalizeEventType(event.event);
  const eventAt = parseEventTimestamp(event);
  const email = event.email?.toLowerCase();
  const brevoContactId = typeof event.id === 'number' ? event.id : undefined;
  const templateId = typeof event.template_id === 'number' ? event.template_id : undefined;

  const subscriberId = await resolveSubscriberId(brevoContactId, email);
  const draftId = await resolveDraftId(templateId);

  const { error } = await supabaseAdmin
    .schema('newsletter')
    .from('email_events')
    .insert({
      subscriber_id: subscriberId,
      draft_id: draftId,
      brevo_message_id: (event['message-id'] as string) ?? null,
      brevo_contact_id: brevoContactId ?? null,
      brevo_template_id: templateId ?? null,
      email: email ?? null,
      event_type: eventType,
      event_at: eventAt,
      link_url: (event.link as string) ?? null,
      reason: (event.reason as string) ?? null,
      user_agent: (event.user_agent as string) ?? null,
      ip: (event.ip as string) ?? null,
      raw: event as unknown as Record<string, unknown>,
    });

  if (error) {
    console.error('[brevo webhook] insert error', error, { eventType, email });
    return;
  }

  if (subscriberId) {
    await updateProgress(subscriberId, eventType, eventAt, draftId);
  }
}

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const expected = process.env.BREVO_WEBHOOK_TOKEN;

  if (!expected) {
    console.error('[brevo webhook] BREVO_WEBHOOK_TOKEN not set');
    return NextResponse.json({ error: 'misconfigured' }, { status: 500 });
  }
  if (token !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const events: BrevoWebhookEvent[] = Array.isArray(body)
    ? (body as BrevoWebhookEvent[])
    : [body as BrevoWebhookEvent];

  const results = await Promise.allSettled(events.map(ingestEvent));
  const failed = results.filter(r => r.status === 'rejected').length;

  if (failed > 0) {
    console.error(`[brevo webhook] ${failed}/${events.length} events failed`);
  }

  return NextResponse.json({ ok: true, ingested: events.length - failed, failed });
}

// GET for healthcheck / Brevo connection test
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (token !== process.env.BREVO_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ ok: true, service: 'brevo-webhook', time: new Date().toISOString() });
}
