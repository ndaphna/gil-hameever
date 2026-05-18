/**
 * Persist a newsletter draft authored in the admin UI.
 *
 * Auth: session must have a newsletter role (admin / campaign_manager /
 * content_creator). RLS on `newsletter.email_drafts` enforces the same gate,
 * but we short-circuit before hitting the DB to return a clean 401/403.
 *
 * POST /api/admin/newsletter/save-draft
 * Body: { subject, body_text, tags?, locale?, is_ai_generated? }
 * Returns: { ok: true, id }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type SaveBody = {
  subject?: unknown;
  body_text?: unknown;
  tags?: unknown;
  locale?: unknown;
  is_ai_generated?: unknown;
  intended_for_automation?: unknown;
  intended_automation_delay_days?: unknown;
};

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
}

export async function POST(request: NextRequest) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { data: allowed, error: roleError } = await supabase
    .schema('newsletter')
    .rpc('has_role', { required: 'content_creator' });

  if (roleError || allowed !== true) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  let body: SaveBody;
  try {
    body = (await request.json()) as SaveBody;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const subject = asString(body.subject).trim();
  const bodyText = asString(body.body_text).trim();
  if (!subject) {
    return NextResponse.json({ error: 'missing_subject' }, { status: 400 });
  }
  if (!bodyText) {
    return NextResponse.json({ error: 'missing_body' }, { status: 400 });
  }

  const tags = asStringArray(body.tags);
  const locale = asString(body.locale, 'he-IL').trim() || 'he-IL';
  const isAiGenerated = body.is_ai_generated === true;
  const intendedForAutomation = body.intended_for_automation === true;
  const intendedDelayRaw = body.intended_automation_delay_days;
  const intendedDelay = (() => {
    if (!intendedForAutomation) return null;
    if (typeof intendedDelayRaw === 'number' && Number.isFinite(intendedDelayRaw)) {
      const v = Math.floor(intendedDelayRaw);
      if (v >= 1 && v <= 365) return v;
    }
    return 8;
  })();

  const { data, error } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .insert({
      subject,
      body_text: bodyText,
      tags,
      locale,
      status: 'draft',
      is_ai_generated: isAiGenerated,
      intended_for_automation: intendedForAutomation,
      intended_automation_delay_days: intendedDelay,
      created_by: user.id,
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json(
      { error: 'insert_failed', detail: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, id: data.id });
}
