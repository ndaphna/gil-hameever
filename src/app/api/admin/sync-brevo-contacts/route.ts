/**
 * Sync Brevo contacts → newsletter.subscribers.
 *
 * Pulls all contacts from a Brevo list (paginated) and upserts each into
 * the Supabase mirror. Idempotent: safe to re-run any time.
 *
 * Auth: x-admin-token header must equal ADMIN_IMPORT_TOKEN.
 *
 * Query params (optional):
 *   listId       — Brevo list ID. Defaults to BREVO_MASTER_LIST_ID env.
 *   pageSize     — contacts per page. Default 500 (Brevo max).
 *
 * Existing legacy subscribers (those on the active Brevo Automation flow)
 * intentionally get NO subscriber_progress row. Our scheduler ignores them
 * until they complete the legacy flow. New future subscribers will get a
 * progress row from the signup flow (separate code, Phase 2).
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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
  const url = new URL(`https://api.brevo.com/v3/contacts/lists/${listId}/contacts`);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));
  url.searchParams.set('sort', 'desc');

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
    },
    // Brevo can be slow with large lists
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

export async function POST(request: NextRequest) {
  const adminToken = request.headers.get('x-admin-token');
  if (!adminToken || adminToken !== process.env.ADMIN_IMPORT_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'BREVO_API_KEY not set' }, { status: 500 });
  }

  const listIdParam = request.nextUrl.searchParams.get('listId');
  const listId = listIdParam
    ? Number(listIdParam)
    : Number(process.env.BREVO_MASTER_LIST_ID);

  if (!Number.isFinite(listId) || listId <= 0) {
    return NextResponse.json(
      { error: 'invalid listId — set BREVO_MASTER_LIST_ID or pass ?listId=' },
      { status: 400 },
    );
  }

  const pageSize = Math.min(
    Number(request.nextUrl.searchParams.get('pageSize') ?? '500'),
    500,
  );

  const stats = {
    listId,
    fetched: 0,
    upserted: 0,
    failed: 0,
    pages: 0,
    errors: [] as string[],
  };

  try {
    let offset = 0;
    while (true) {
      const page = await fetchContactsPage(listId, pageSize, offset, apiKey);
      stats.pages += 1;
      stats.fetched += page.contacts.length;

      if (page.contacts.length === 0) break;

      const rows = page.contacts.map(mapContactToSubscriber);

      const { error, count } = await supabaseAdmin
        .schema('newsletter')
        .from('subscribers')
        .upsert(rows, { onConflict: 'brevo_contact_id', count: 'exact' });

      if (error) {
        stats.failed += rows.length;
        stats.errors.push(`offset=${offset}: ${error.message}`);
      } else {
        stats.upserted += count ?? rows.length;
      }

      if (page.contacts.length < pageSize) break;
      offset += pageSize;

      // safety net: don't loop forever on a buggy Brevo response
      if (stats.pages > 100) {
        stats.errors.push('aborted: too many pages');
        break;
      }
    }
  } catch (err) {
    stats.errors.push(err instanceof Error ? err.message : String(err));
    return NextResponse.json({ ok: false, stats }, { status: 500 });
  }

  return NextResponse.json({ ok: true, stats });
}
