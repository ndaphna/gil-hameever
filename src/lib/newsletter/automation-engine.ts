/**
 * Evergreen automation engine.
 *
 * Per-subscriber delivery of newsletter drafts, timed relative to each
 * subscriber's `signed_up_at`. Mirrors what a native Brevo automation step
 * would do, except Brevo's public API doesn't allow programmatic step
 * creation — so we manage the queue ourselves and send via Brevo SMTP.
 *
 * Timing model: each draft has a position in the automation (`automation_order`)
 * and a delay in days (`automation_delay_days`). The cumulative day from
 * signup = anchor_day + sum(delays of all steps up to and including this one).
 *
 * Send rules:
 *   - Not retroactive: when a draft is added, subscribers who already passed
 *     the cumulative_day at enqueue time are skipped (no send recorded).
 *   - Future subscribers: when sync-brevo-contacts inserts a new subscriber,
 *     it should call `enqueueSubscriberForAllActiveDrafts` so they get the
 *     existing drafts on their personal timeline.
 */

import { type SupabaseClient } from '@supabase/supabase-js';

const BREVO_API_BASE = 'https://api.brevo.com/v3';

export type SchemaClient = SupabaseClient;

export type AutomationConfig = {
  id: string;
  name: string;
  anchor_day: number;
  recipient_list_id: number;
  is_active: boolean;
};

export type AutomationDraft = {
  id: string;
  brevo_template_id: number | null;
  automation_config_id: string | null;
  automation_delay_days: number | null;
  automation_order: number | null;
};

/**
 * Sum of delay_days for all drafts in `configId` with order <= upToOrder
 * (inclusive). Reads only the drafts that are actually in the automation
 * (`automation_config_id = configId` and `automation_order is not null`).
 */
export async function sumDelaysUpTo(
  supabase: SchemaClient,
  configId: string,
  upToOrder: number,
): Promise<number> {
  const { data, error } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .select('automation_delay_days')
    .eq('automation_config_id', configId)
    .not('automation_order', 'is', null)
    .lte('automation_order', upToOrder);
  if (error) throw new Error(`sumDelaysUpTo failed: ${error.message}`);
  return (data ?? []).reduce(
    (acc, row) => acc + Number(row.automation_delay_days ?? 0),
    0,
  );
}

/**
 * Compute the next `automation_order` for a config (max existing + 1, or 1).
 */
export async function nextOrder(
  supabase: SchemaClient,
  configId: string,
): Promise<number> {
  const { data, error } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .select('automation_order')
    .eq('automation_config_id', configId)
    .not('automation_order', 'is', null)
    .order('automation_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`nextOrder failed: ${error.message}`);
  return ((data?.automation_order as number | undefined) ?? 0) + 1;
}

/**
 * Decide the actual scheduled_for time for one (subscriber, draft) given:
 *   - target: the ideal time = signed_up_at + cumulative_day
 *   - now: current timestamp
 *   - lastPendingMs: latest scheduled_for of any not-yet-sent send already
 *     queued for this subscriber, or 0 if none
 *   - spacingMs: minimum gap to enforce between retroactive sends
 *
 * Rule: if target is in the future, ship at target (no spacing applied —
 * the regular cadence is preserved). If target has passed (subscriber has
 * already crossed that day), schedule at now+1min (next cron tick), but
 * never sooner than `lastPending + spacingMs`. This avoids dumping a
 * 5-newsletter backlog into the inbox at once.
 */
export function planScheduledFor(
  target: number,
  now: number,
  lastPendingMs: number,
  spacingMs: number,
): number {
  if (target > now) {
    // Future-dated. Either keep it at target, or push out if the
    // accumulated retro queue extends past target.
    if (lastPendingMs > 0 && target < lastPendingMs + spacingMs) {
      return lastPendingMs + spacingMs;
    }
    return target;
  }
  // Retroactive: at least 1 minute from now, and at least spacing from the
  // most recent pending row.
  const earliest = now + 60_000;
  if (lastPendingMs > 0) {
    return Math.max(earliest, lastPendingMs + spacingMs);
  }
  return earliest;
}

/**
 * For a given draft (already enqueued = has automation_order + delay), generate
 * automation_sends rows for every active subscriber. Retroactive sends are
 * spaced per-subscriber so a long-time subscriber who just got 3 new
 * newsletters added doesn't receive all 3 in one tick.
 *
 * Idempotent: ON CONFLICT do nothing on (draft_id, subscriber_email).
 */
export async function enqueueDraftForAllSubscribers(
  supabase: SchemaClient,
  draftId: string,
): Promise<{ inserted: number; retroactive: number; future: number; total_subs: number }> {
  const { data: draft, error: draftErr } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .select('id, automation_config_id, automation_order, automation_delay_days')
    .eq('id', draftId)
    .single<AutomationDraft & { id: string }>();
  if (draftErr || !draft) throw new Error(`draft not found: ${draftErr?.message}`);
  if (!draft.automation_config_id || draft.automation_order === null) {
    throw new Error('draft is not in any automation');
  }

  const { data: config, error: cfgErr } = await supabase
    .schema('newsletter')
    .from('automation_config')
    .select('id, anchor_day, recipient_list_id, is_active, catch_up_spacing_hours')
    .eq('id', draft.automation_config_id)
    .single<{
      id: string;
      anchor_day: number;
      recipient_list_id: number;
      is_active: boolean;
      catch_up_spacing_hours: number;
    }>();
  if (cfgErr || !config) throw new Error(`config not found: ${cfgErr?.message}`);

  const cumulativeDays =
    config.anchor_day +
    (await sumDelaysUpTo(supabase, config.id, draft.automation_order!));
  const spacingMs = (config.catch_up_spacing_hours ?? 24) * 3_600_000;

  const { data: subs, error: subErr } = await supabase
    .schema('newsletter')
    .from('subscribers')
    .select('id, email, signed_up_at, brevo_list_ids, is_blocked');
  if (subErr) throw new Error(`subscribers fetch failed: ${subErr.message}`);

  const now = Date.now();
  const rows: Array<{
    draft_id: string;
    subscriber_id: string;
    subscriber_email: string;
    scheduled_for: string;
  }> = [];
  let retroactive = 0;
  let future = 0;

  for (const s of subs ?? []) {
    if (s.is_blocked) continue;
    if (!s.signed_up_at) continue;
    const listIds = (s.brevo_list_ids as number[] | null) ?? [];
    if (!listIds.includes(config.recipient_list_id)) continue;

    // Look up the latest pending send for THIS subscriber so we can space.
    const { data: lastRow } = await supabase
      .schema('newsletter')
      .from('automation_sends')
      .select('scheduled_for')
      .eq('subscriber_email', s.email as string)
      .is('sent_at', null)
      .is('failed_at', null)
      .order('scheduled_for', { ascending: false })
      .limit(1)
      .maybeSingle();
    const lastMs = lastRow?.scheduled_for
      ? new Date(lastRow.scheduled_for as string).getTime()
      : 0;

    const target = new Date(s.signed_up_at).getTime() + cumulativeDays * 86_400_000;
    const scheduledMs = planScheduledFor(target, now, lastMs, spacingMs);
    if (target <= now) retroactive += 1; else future += 1;

    rows.push({
      draft_id: draft.id,
      subscriber_id: s.id as string,
      subscriber_email: s.email as string,
      scheduled_for: new Date(scheduledMs).toISOString(),
    });
  }

  let inserted = 0;
  if (rows.length > 0) {
    const { data, error } = await supabase
      .schema('newsletter')
      .from('automation_sends')
      .upsert(rows, { onConflict: 'draft_id,subscriber_email', ignoreDuplicates: true })
      .select('id');
    if (error) throw new Error(`upsert sends failed: ${error.message}`);
    inserted = data?.length ?? 0;
  }

  return { inserted, retroactive, future, total_subs: subs?.length ?? 0 };
}

/**
 * For a single (newly added) subscriber, enqueue them for every active draft
 * in every active automation they belong to. Called from sync-brevo-contacts.
 */
export async function enqueueSubscriberForAllActiveDrafts(
  supabase: SchemaClient,
  subscriberId: string,
): Promise<{ inserted: number }> {
  const { data: sub, error: subErr } = await supabase
    .schema('newsletter')
    .from('subscribers')
    .select('id, email, signed_up_at, brevo_list_ids, is_blocked')
    .eq('id', subscriberId)
    .single();
  if (subErr || !sub || sub.is_blocked || !sub.signed_up_at) return { inserted: 0 };

  const listIds = (sub.brevo_list_ids as number[] | null) ?? [];
  if (listIds.length === 0) return { inserted: 0 };

  const { data: configs } = await supabase
    .schema('newsletter')
    .from('automation_config')
    .select('id, anchor_day, recipient_list_id, catch_up_spacing_hours')
    .eq('is_active', true)
    .in('recipient_list_id', listIds);
  if (!configs || configs.length === 0) return { inserted: 0 };

  const now = Date.now();
  const rows: Array<{
    draft_id: string;
    subscriber_id: string;
    subscriber_email: string;
    scheduled_for: string;
  }> = [];

  for (const cfg of configs) {
    const { data: drafts } = await supabase
      .schema('newsletter')
      .from('email_drafts')
      .select('id, automation_order, automation_delay_days')
      .eq('automation_config_id', cfg.id)
      .not('automation_order', 'is', null)
      .order('automation_order', { ascending: true });
    if (!drafts) continue;

    const spacingMs = (cfg.catch_up_spacing_hours ?? 24) * 3_600_000;
    let cumulative = cfg.anchor_day as number;
    let lastMs = 0; // rolling latest scheduled within this loop

    for (const d of drafts) {
      cumulative += Number(d.automation_delay_days ?? 0);
      const target = new Date(sub.signed_up_at as string).getTime() + cumulative * 86_400_000;
      const scheduledMs = planScheduledFor(target, now, lastMs, spacingMs);
      lastMs = scheduledMs;
      rows.push({
        draft_id: d.id as string,
        subscriber_id: sub.id as string,
        subscriber_email: sub.email as string,
        scheduled_for: new Date(scheduledMs).toISOString(),
      });
    }
  }

  if (rows.length === 0) return { inserted: 0 };

  const { data, error } = await supabase
    .schema('newsletter')
    .from('automation_sends')
    .upsert(rows, { onConflict: 'draft_id,subscriber_email', ignoreDuplicates: true })
    .select('id');
  if (error) throw new Error(`subscriber enqueue failed: ${error.message}`);
  return { inserted: data?.length ?? 0 };
}

/**
 * Send a single queued automation_sends row via Brevo SMTP transactional.
 * Uses the draft's brevo_template_id and the subscriber's email/first name.
 * Caller is responsible for marking sent_at / failed_at.
 */
export async function sendOneTransactional(args: {
  templateId: number;
  to: { email: string; name?: string };
  params?: Record<string, unknown>;
}): Promise<{ messageId: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('BREVO_API_KEY missing');

  const res = await fetch(`${BREVO_API_BASE}/smtp/email`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      templateId: args.templateId,
      to: [args.to],
      params: args.params ?? {},
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`brevo smtp send failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const json = (await res.json()) as { messageId?: string };
  return { messageId: json.messageId ?? '' };
}

/**
 * Process the automation queue: pick up to `limit` due sends and dispatch
 * them. Each one is marked sent_at or failed_at independently — a single bad
 * row never blocks the rest.
 */
export async function processQueue(
  supabase: SchemaClient,
  limit = 100,
): Promise<{ attempted: number; sent: number; failed: number }> {
  const nowIso = new Date().toISOString();
  const { data: due, error } = await supabase
    .schema('newsletter')
    .from('automation_sends')
    .select('id, draft_id, subscriber_email, scheduled_for')
    .is('sent_at', null)
    .is('failed_at', null)
    .lte('scheduled_for', nowIso)
    .order('scheduled_for', { ascending: true })
    .limit(limit);
  if (error) throw new Error(`queue fetch failed: ${error.message}`);
  if (!due || due.length === 0) return { attempted: 0, sent: 0, failed: 0 };

  // Fetch template ids + subscriber first names in batch.
  const draftIds = Array.from(new Set(due.map((d) => d.draft_id as string)));
  const emails = Array.from(new Set(due.map((d) => d.subscriber_email as string)));

  const { data: drafts } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .select('id, brevo_template_id')
    .in('id', draftIds);
  const templateByDraft = new Map<string, number>(
    (drafts ?? [])
      .filter((d) => d.brevo_template_id !== null)
      .map((d) => [d.id as string, d.brevo_template_id as number]),
  );

  const { data: subs } = await supabase
    .schema('newsletter')
    .from('subscribers')
    .select('email, first_name, is_blocked')
    .in('email', emails);
  const subByEmail = new Map<string, { first_name: string | null; is_blocked: boolean }>(
    (subs ?? []).map((s) => [
      s.email as string,
      { first_name: (s.first_name as string | null) ?? null, is_blocked: !!s.is_blocked },
    ]),
  );

  let sent = 0;
  let failed = 0;
  for (const row of due) {
    const templateId = templateByDraft.get(row.draft_id as string);
    const sub = subByEmail.get(row.subscriber_email as string);
    if (!templateId) {
      await supabase
        .schema('newsletter')
        .from('automation_sends')
        .update({ failed_at: new Date().toISOString(), error: 'no_template_id_on_draft' })
        .eq('id', row.id as string);
      failed += 1;
      continue;
    }
    if (sub?.is_blocked) {
      await supabase
        .schema('newsletter')
        .from('automation_sends')
        .update({ failed_at: new Date().toISOString(), error: 'subscriber_blocked' })
        .eq('id', row.id as string);
      failed += 1;
      continue;
    }
    try {
      const result = await sendOneTransactional({
        templateId,
        to: {
          email: row.subscriber_email as string,
          name: sub?.first_name ?? undefined,
        },
        params: sub?.first_name ? { FIRSTNAME: sub.first_name } : undefined,
      });
      await supabase
        .schema('newsletter')
        .from('automation_sends')
        .update({
          sent_at: new Date().toISOString(),
          brevo_message_id: result.messageId || null,
        })
        .eq('id', row.id as string);
      sent += 1;
    } catch (err) {
      await supabase
        .schema('newsletter')
        .from('automation_sends')
        .update({
          failed_at: new Date().toISOString(),
          error: err instanceof Error ? err.message.slice(0, 500) : String(err).slice(0, 500),
        })
        .eq('id', row.id as string);
      failed += 1;
    }
  }

  return { attempted: due.length, sent, failed };
}
