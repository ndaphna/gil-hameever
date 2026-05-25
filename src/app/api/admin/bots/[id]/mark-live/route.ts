/**
 * POST /api/admin/bots/[id]/mark-live
 *
 * Admin-only. Transitions submitted/building → live, stamps manychat_flow_id
 * + manychat_tag, and bootstraps ManyChat (Tag + Custom Field).
 *
 * Body: { manychat_flow_id: string, manychat_tag?: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { BotBriefRow, deriveTag } from '@/lib/bots/schema';
import { bootstrapBriefInManyChat } from '@/lib/bots/manychat-client';
import { notifyBriefLive } from '@/lib/bots/notify';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function appBaseUrl(req: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  const host = req.headers.get('host') ?? 'gilhameever.com';
  return `${proto}://${host}`;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { data: isAdmin, error: roleErr } = await supabase
    .schema('newsletter')
    .rpc('has_role', { required: 'admin' });
  if (roleErr || isAdmin !== true) {
    return NextResponse.json({ error: 'admin_required' }, { status: 403 });
  }

  let body: { manychat_flow_id?: unknown; manychat_tag?: unknown };
  try {
    body = (await req.json()) as { manychat_flow_id?: unknown; manychat_tag?: unknown };
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const flowId = typeof body.manychat_flow_id === 'string' ? body.manychat_flow_id.trim() : '';
  if (!flowId) {
    return NextResponse.json({ error: 'missing_flow_id' }, { status: 400 });
  }

  const { data: brief, error: fetchErr } = await supabase
    .schema('bots')
    .from('briefs')
    .select('*')
    .eq('id', id)
    .single<BotBriefRow>();
  if (fetchErr || !brief) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  if (brief.status !== 'submitted' && brief.status !== 'building') {
    return NextResponse.json({ error: 'wrong_status', detail: brief.status }, { status: 400 });
  }

  const customTag = typeof body.manychat_tag === 'string' ? body.manychat_tag.trim() : '';
  const tag = customTag || brief.manychat_tag || deriveTag(brief.title, brief.id);

  const { error: updateErr } = await supabase
    .schema('bots')
    .from('briefs')
    .update({
      status: 'live',
      manychat_flow_id: flowId,
      manychat_tag: tag,
    })
    .eq('id', id);

  if (updateErr) {
    return NextResponse.json({ error: 'update_failed', detail: updateErr.message }, { status: 500 });
  }

  // Best-effort ManyChat bootstrap. Warnings flow back to UI so admin can see
  // whether tag/field already existed.
  let manychat: { ok: boolean; warnings: string[] } = { ok: true, warnings: [] };
  if (process.env.MANYCHAT_API_TOKEN) {
    try {
      manychat = await bootstrapBriefInManyChat({ tagName: tag });
    } catch (err) {
      manychat = {
        ok: false,
        warnings: [err instanceof Error ? err.message : String(err)],
      };
    }
  } else {
    manychat = { ok: false, warnings: ['MANYCHAT_API_TOKEN not set — skipped bootstrap'] };
  }

  // -------- Notify the brief creator (Inbal) that her bot is live --------

  const { data: profile } = await supabase
    .from('user_profile')
    .select('full_name, first_name, last_name, email, phone_number')
    .eq('id', brief.created_by)
    .maybeSingle();

  const profileTyped = profile as
    | {
        full_name?: string | null;
        first_name?: string | null;
        last_name?: string | null;
        email?: string | null;
        phone_number?: string | null;
      }
    | null;

  const composed = [profileTyped?.first_name, profileTyped?.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();
  const creatorName = profileTyped?.full_name ?? (composed || null);
  const creatorEmail = profileTyped?.email ?? null;
  const creatorPhone = profileTyped?.phone_number ?? null;

  const notify = await notifyBriefLive({
    brief: { ...brief, status: 'live', manychat_flow_id: flowId, manychat_tag: tag },
    creatorEmail,
    creatorName,
    creatorPhone,
    manychatFlowId: flowId,
    appBaseUrl: appBaseUrl(req),
  });

  return NextResponse.json({ ok: true, manychat_tag: tag, manychat, notify });
}
