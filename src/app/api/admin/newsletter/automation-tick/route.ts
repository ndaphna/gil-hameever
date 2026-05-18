/**
 * Process the automation send queue. Called by the hourly cron OR manually
 * by an admin.
 *
 * Auth (one of):
 *   - Bearer token = CRON_SECRET (for Vercel Cron / manual cron triggers)
 *   - session with `campaign_manager` role (for manual dashboard runs)
 *
 * POST /api/admin/newsletter/automation-tick
 * Body (optional): { limit?: number (default 100, max 500) }
 * Returns: { ok, attempted, sent, failed }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { processQueue } from '@/lib/newsletter/automation-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  // Bearer auth path (cron).
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');
  const isCronAuthorized = !!cronSecret && authHeader === `Bearer ${cronSecret}`;

  const supabase = await createServerClient();

  if (!isCronAuthorized) {
    // Session auth fallback.
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
  }

  let limit = 100;
  try {
    const body = (await request.json()) as { limit?: unknown };
    if (typeof body.limit === 'number' && Number.isFinite(body.limit)) {
      limit = Math.max(1, Math.min(500, Math.floor(body.limit)));
    }
  } catch {
    // empty body OK
  }

  try {
    const result = await processQueue(supabase, limit);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json(
      { error: 'tick_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
