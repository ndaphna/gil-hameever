/**
 * GET   /api/admin/bots/[id] — fetch brief + assets (signed URLs for previews).
 * PATCH /api/admin/bots/[id] — update brief fields. Only allowed in 'draft'
 *                              for creator; admin can update any field.
 * DELETE /api/admin/bots/[id] — admin-only via RLS.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { validateDraft, BriefDraftInput } from '@/lib/bots/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour (in-app previews)

async function requireAuth() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: 'unauthorized' }, { status: 401 }) };
  return { supabase, user };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await requireAuth();
  if ('error' in ctx) return ctx.error;
  const { supabase } = ctx;

  const { data: brief, error } = await supabase
    .schema('bots')
    .from('briefs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !brief) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const { data: assets } = await supabase
    .schema('bots')
    .from('brief_assets')
    .select('*')
    .eq('brief_id', id)
    .order('created_at', { ascending: true });

  // Sign URLs for in-app previews using admin client (RLS already gated the brief).
  const signed = await Promise.all(
    (assets ?? []).map(async (a) => {
      const { data: signedData } = await supabaseAdmin.storage
        .from('bot-brief-assets')
        .createSignedUrl(a.storage_path, SIGNED_URL_TTL_SECONDS);
      return { ...a, signed_url: signedData?.signedUrl ?? null };
    }),
  );

  return NextResponse.json({ ok: true, brief, assets: signed });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await requireAuth();
  if ('error' in ctx) return ctx.error;
  const { supabase } = ctx;

  let body: Partial<BriefDraftInput>;
  try {
    body = (await req.json()) as Partial<BriefDraftInput>;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const check = validateDraft(body);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (body.title !== undefined) updates.title = body.title.trim();
  if (body.type !== undefined) updates.type = body.type;
  if (body.post_scope !== undefined) updates.post_scope = body.post_scope;
  if (body.post_url !== undefined) updates.post_url = body.post_url || null;
  if (body.keyword_triggers !== undefined) updates.keyword_triggers = body.keyword_triggers;
  if (body.story_label !== undefined) updates.story_label = body.story_label || null;
  if (body.dm_message !== undefined) updates.dm_message = body.dm_message || null;
  if (body.cta_button_text !== undefined) updates.cta_button_text = body.cta_button_text || null;
  if (body.lead_magnet_url !== undefined) updates.lead_magnet_url = body.lead_magnet_url || null;
  if (body.followup_dm_message !== undefined) updates.followup_dm_message = body.followup_dm_message || null;
  if (body.followup_dm_delay_minutes !== undefined) updates.followup_dm_delay_minutes = body.followup_dm_delay_minutes;
  if (body.brevo_template_id !== undefined) updates.brevo_template_id = body.brevo_template_id ?? null;
  if (body.followup_delay_hours !== undefined) updates.followup_delay_hours = body.followup_delay_hours;
  if (body.followup_enabled !== undefined) updates.followup_enabled = body.followup_enabled;
  if (body.notes !== undefined) updates.notes = body.notes || null;

  const { error } = await supabase.schema('bots').from('briefs').update(updates).eq('id', id);

  if (error) {
    if (error.code === 'PGRST301' || /permission denied|policy/i.test(error.message)) {
      return NextResponse.json({ error: 'forbidden', detail: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: 'update_failed', detail: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await requireAuth();
  if ('error' in ctx) return ctx.error;
  const { supabase } = ctx;

  const { error } = await supabase.schema('bots').from('briefs').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: 'delete_failed', detail: error.message }, { status: 403 });
  }
  return NextResponse.json({ ok: true });
}
