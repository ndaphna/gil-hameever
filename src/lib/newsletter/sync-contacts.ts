/**
 * Sync Brevo contacts → newsletter.subscribers (helper).
 *
 * Extracted from /api/admin/sync-brevo-contacts so the cron tick can run the
 * same logic without an HTTP round-trip (and without managing admin tokens).
 *
 * After upsert, populates `automation_sends` for any subscriber whose
 * timeline against active automation drafts hasn't been seeded yet.
 * Idempotent — safe to run as often as the cron interval allows.
 */

import { type SupabaseClient } from '@supabase/supabase-js';
import { enqueueSubscriberForAllActiveDrafts } from './automation-engine';

const BREVO_API_BASE = 'https://api.brevo.com/v3';

interface BrevoContact {
  email: string;
  id: number;
  emailBlacklisted?: boolean;
  smsBlacklisted?: boolean;
  createdAt?: string;
  modifiedAt?: string;
  listIds?: number[];
  listUnsubscribed?: number[];
  attributes?: Record<string, unknown>;
}

interface BrevoContactsResponse {
  contacts: BrevoContact[];
  count: number;
}

async function fetchContactsPage(
  listId: number,
  limit: number,
  offset: number,
  apiKey: string,
): Promise<BrevoContactsResponse> {
  const url = new URL(`${BREVO_API_BASE}/contacts/lists/${listId}/contacts`);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));
  url.searchParams.set('sort', 'desc');

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { accept: 'application/json', 'api-key': apiKey },
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo API ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

function mapContactToSubscriber(c: BrevoContact) {
  const attrs = c.attributes ?? {};
  const firstName = (attrs.FIRSTNAME as string | undefined) ?? null;
  const lastName = (attrs.LASTNAME as string | undefined) ?? null;
  return {
    brevo_contact_id: c.id,
    email: c.email.toLowerCase(),
    first_name: firstName,
    last_name: lastName,
    attributes: attrs,
    brevo_list_ids: c.listIds ?? [],
    signed_up_at: c.createdAt ?? null,
    is_blocked: c.emailBlacklisted === true,
    blocked_reason: c.emailBlacklisted === true ? 'brevo:emailBlacklisted' : null,
    last_synced_at: new Date().toISOString(),
  };
}

export type SyncStats = {
  listId: number;
  fetched: number;
  upserted: number;
  failed: number;
  pages: number;
  automation_enqueued: number;
  errors: string[];
};

export async function syncBrevoContactsAndEnqueue(
  supabase: SupabaseClient,
  listId: number,
  pageSize = 500,
): Promise<SyncStats> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('BREVO_API_KEY missing');
  if (!Number.isFinite(listId) || listId <= 0) {
    throw new Error(`invalid listId: ${listId}`);
  }
  const limit = Math.min(Math.max(1, pageSize), 500);

  const stats: SyncStats = {
    listId,
    fetched: 0,
    upserted: 0,
    failed: 0,
    pages: 0,
    automation_enqueued: 0,
    errors: [],
  };

  let offset = 0;
  while (true) {
    const page = await fetchContactsPage(listId, limit, offset, apiKey);
    stats.pages += 1;
    stats.fetched += page.contacts.length;

    if (page.contacts.length === 0) break;

    const rows = page.contacts.map(mapContactToSubscriber);
    const { error, count } = await supabase
      .schema('newsletter')
      .from('subscribers')
      .upsert(rows, { onConflict: 'brevo_contact_id', count: 'exact' });

    if (error) {
      stats.failed += rows.length;
      stats.errors.push(`offset=${offset}: ${error.message}`);
    } else {
      stats.upserted += count ?? rows.length;
    }

    if (page.contacts.length < limit) break;
    offset += limit;
    if (stats.pages > 100) {
      stats.errors.push('aborted: too many pages');
      break;
    }
  }

  // Enqueue every active subscriber against active drafts (idempotent).
  const { data: subs } = await supabase
    .schema('newsletter')
    .from('subscribers')
    .select('id')
    .eq('is_blocked', false);
  for (const s of subs ?? []) {
    try {
      const r = await enqueueSubscriberForAllActiveDrafts(supabase, s.id as string);
      stats.automation_enqueued += r.inserted;
    } catch (e) {
      stats.errors.push(`enqueue ${s.id}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return stats;
}
