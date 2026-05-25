/**
 * POST /api/admin/bots/[id]/status
 *
 * Manual status change. The DB trigger `bots.enforce_brief_transition` is the
 * source of truth on legality: creator can only do draft→submitted or
 * →archived, admin can do anything.
 *
 * For transitions to 'live' use /mark-live instead (requires manychat_flow_id).
 *
 * Body: { status: BriefStatus }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { BRIEF_STATUSES, BriefStatus } from '@/lib/bots/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let body: { status?: unknown };
  try {
    body = (await req.json()) as { status?: unknown };
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const status = body.status;
  if (typeof status !== 'string' || !BRIEF_STATUSES.includes(status as BriefStatus)) {
    return NextResponse.json({ error: 'invalid_status' }, { status: 400 });
  }
  if (status === 'live') {
    return NextResponse.json(
      { error: 'use_mark_live', detail: 'For live, use /mark-live (requires Flow ID)' },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .schema('bots')
    .from('briefs')
    .update({ status: status as BriefStatus })
    .eq('id', id);

  if (error) {
    if (/transition.*requires admin|policy|permission/i.test(error.message)) {
      return NextResponse.json({ error: 'forbidden', detail: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: 'update_failed', detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
