/**
 * Nightly Aliza-memory refresh.
 *
 * Cron schedule: 03:00 IL (configured in vercel.json). Iterates over users
 * who had chat or journal activity in the last 7 days and refreshes their
 * aliza_user_memory via the incremental distiller endpoint.
 *
 * Auth: x-admin-token must match ADMIN_IMPORT_TOKEN (Vercel cron injects
 * this via the cron secret if configured; otherwise rejects external calls).
 *
 * Manual run:
 *   curl -H "x-admin-token: $ADMIN_IMPORT_TOKEN" \
 *        http://localhost:3002/api/cron/aliza-memory-refresh
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const MAX_USERS_PER_RUN = 100;
const ACTIVE_WINDOW_DAYS = 7;

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}

async function handle(req: NextRequest) {
  const adminToken = req.headers.get('x-admin-token');
  if (!adminToken || adminToken !== process.env.ADMIN_IMPORT_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const startedAt = Date.now();

  // Pick users active in the chat in the last 7 days.
  const since = new Date(Date.now() - ACTIVE_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { data: activeRows, error: pickErr } = await supabaseAdmin
    .from('message')
    .select('user_id')
    .gte('created_at', since)
    .limit(1000);

  if (pickErr) {
    return NextResponse.json({ error: 'pick_failed', detail: pickErr.message }, { status: 500 });
  }

  const userIds = Array.from(new Set((activeRows ?? []).map(r => r.user_id as string))).slice(0, MAX_USERS_PER_RUN);

  const origin = req.nextUrl.origin;
  let ok = 0;
  let failed = 0;
  const failures: Array<{ userId: string; error: string }> = [];

  for (const userId of userIds) {
    try {
      const resp = await fetch(`${origin}/api/internal/distill-aliza-memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
        body: JSON.stringify({ userId, trigger: 'cron' }),
      });
      if (resp.ok) {
        ok++;
      } else {
        failed++;
        const detail = await resp.text().catch(() => '');
        failures.push({ userId, error: `${resp.status}: ${detail.slice(0, 200)}` });
      }
    } catch (err) {
      failed++;
      failures.push({ userId, error: err instanceof Error ? err.message : String(err) });
    }
  }

  return NextResponse.json({
    ok: true,
    elapsed_ms: Date.now() - startedAt,
    candidates: userIds.length,
    succeeded: ok,
    failed,
    failures: failures.slice(0, 20),
  });
}
