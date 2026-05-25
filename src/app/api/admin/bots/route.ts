/**
 * POST /api/admin/bots         — create a new brief in draft state.
 * GET  /api/admin/bots         — list briefs visible to the caller (RLS filters).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { validateDraft, BriefDraftInput } from '@/lib/bots/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function requireContentCreator() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };

  const { data: allowed, error: roleError } = await supabase
    .schema('newsletter')
    .rpc('has_role', { required: 'content_creator' });
  if (roleError || allowed !== true) {
    return { error: NextResponse.json({ error: 'forbidden' }, { status: 403 }) };
  }
  return { supabase, user };
}

export async function POST(request: NextRequest) {
  const ctx = await requireContentCreator();
  if ('error' in ctx) return ctx.error;
  const { supabase, user } = ctx;

  let body: Partial<BriefDraftInput>;
  try {
    body = (await request.json()) as Partial<BriefDraftInput>;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const check = validateDraft(body);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  const { data, error } = await supabase
    .schema('bots')
    .from('briefs')
    .insert({
      created_by: user.id,
      title: body.title!.trim(),
      type: body.type!,
      status: 'draft',
      post_scope: body.post_scope ?? 'specific_post',
      post_url: body.post_url ?? null,
      keyword_triggers: body.keyword_triggers ?? [],
      story_label: body.story_label ?? null,
      dm_message: body.dm_message ?? null,
      cta_button_text: body.cta_button_text ?? null,
      lead_magnet_url: body.lead_magnet_url ?? null,
      followup_dm_message: body.followup_dm_message ?? null,
      followup_dm_delay_minutes: body.followup_dm_delay_minutes ?? 10,
      brevo_template_id: body.brevo_template_id ?? null,
      followup_delay_hours: body.followup_delay_hours ?? 24,
      followup_enabled: body.followup_enabled ?? false,
      notes: body.notes ?? null,
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: 'insert_failed', detail: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: data.id });
}

export async function GET(_request: NextRequest) {
  const ctx = await requireContentCreator();
  if ('error' in ctx) return ctx.error;
  const { supabase } = ctx;

  const { data, error } = await supabase
    .schema('bots')
    .from('briefs')
    .select('id,title,type,status,created_by,created_at,submitted_at,live_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: 'list_failed', detail: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, briefs: data });
}
