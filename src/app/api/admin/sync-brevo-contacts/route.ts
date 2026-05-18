/**
 * Sync Brevo contacts → newsletter.subscribers (admin-triggered).
 *
 * Pulls all contacts from a Brevo list (paginated) and upserts each into
 * the Supabase mirror. Then seeds automation_sends for active drafts.
 * Idempotent: safe to re-run any time.
 *
 * Auth: x-admin-token header must equal ADMIN_IMPORT_TOKEN.
 *
 * Query params (optional):
 *   listId   — Brevo list ID. Defaults to BREVO_MASTER_LIST_ID env.
 *   pageSize — contacts per page. Default 500 (Brevo max).
 *
 * NOTE: The same logic runs automatically every hour via the notifications
 * cron (see src/lib/newsletter/sync-contacts.ts), so manual calls are mostly
 * for debugging / on-demand catch-up.
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { syncBrevoContactsAndEnqueue } from '@/lib/newsletter/sync-contacts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const adminToken = request.headers.get('x-admin-token');
  if (!adminToken || adminToken !== process.env.ADMIN_IMPORT_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const listIdParam = request.nextUrl.searchParams.get('listId');
  const listId = listIdParam
    ? Number(listIdParam)
    : Number(process.env.BREVO_MASTER_LIST_ID);

  const pageSize = Math.min(
    Number(request.nextUrl.searchParams.get('pageSize') ?? '500'),
    500,
  );

  try {
    const stats = await syncBrevoContactsAndEnqueue(supabaseAdmin, listId, pageSize);
    return NextResponse.json({ ok: true, stats });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
