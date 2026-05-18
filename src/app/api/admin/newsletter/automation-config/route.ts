/**
 * Read or update a newsletter automation_config row.
 *
 * Auth (read): content_creator.
 * Auth (update): admin.
 *
 * GET  /api/admin/newsletter/automation-config?name=welcome_series
 *   → { ok, config }
 *
 * POST /api/admin/newsletter/automation-config
 *   Body: { name: string, anchor_day?: number, recipient_list_id?: number, is_active?: boolean, display_name?: string }
 *   → { ok, config }
 *
 * `anchor_day` = total number of days the existing Brevo automation takes from
 * trigger to its last Send step. Must be updated whenever the Brevo flow is
 * edited (added/removed steps), since we can't read it via the public API.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: allowed, error: roleError } = await supabase
    .schema('newsletter')
    .rpc('has_role', { required: 'content_creator' });
  if (roleError || allowed !== true) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const name = request.nextUrl.searchParams.get('name') ?? 'welcome_series';
  const { data, error } = await supabase
    .schema('newsletter')
    .from('automation_config')
    .select('id, name, display_name, anchor_day, recipient_list_id, is_active, catch_up_spacing_hours, updated_at')
    .eq('name', name)
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: 'fetch_failed', detail: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, config: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: allowed, error: roleError } = await supabase
    .schema('newsletter')
    .rpc('has_role', { required: 'admin' });
  if (roleError || allowed !== true) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name : null;
  if (!name) return NextResponse.json({ error: 'missing_name' }, { status: 400 });

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.anchor_day === 'number' && Number.isFinite(body.anchor_day)) {
    const ad = Math.floor(body.anchor_day);
    if (ad < 0 || ad > 365) {
      return NextResponse.json({ error: 'invalid_anchor_day', hint: '0..365' }, { status: 400 });
    }
    patch.anchor_day = ad;
  }
  if (typeof body.recipient_list_id === 'number' && Number.isFinite(body.recipient_list_id)) {
    patch.recipient_list_id = Math.floor(body.recipient_list_id);
  }
  if (typeof body.is_active === 'boolean') {
    patch.is_active = body.is_active;
  }
  if (typeof body.display_name === 'string' && body.display_name.trim()) {
    patch.display_name = body.display_name.trim();
  }
  if (typeof body.catch_up_spacing_hours === 'number' && Number.isFinite(body.catch_up_spacing_hours)) {
    const v = Math.floor(body.catch_up_spacing_hours);
    if (v < 1 || v > 168) {
      return NextResponse.json({ error: 'invalid_catch_up_spacing_hours', hint: '1..168' }, { status: 400 });
    }
    patch.catch_up_spacing_hours = v;
  }

  const { data, error } = await supabase
    .schema('newsletter')
    .from('automation_config')
    .update(patch)
    .eq('name', name)
    .select('id, name, display_name, anchor_day, recipient_list_id, is_active, catch_up_spacing_hours, updated_at')
    .maybeSingle();
  if (error) {
    return NextResponse.json({ error: 'update_failed', detail: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, config: data });
}
