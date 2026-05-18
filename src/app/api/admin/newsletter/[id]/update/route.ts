/**
 * Update an existing newsletter draft and snapshot the previous content
 * into `email_draft_versions`.
 *
 * Auth: session must have a newsletter role. RLS enforces the same gate.
 *
 * POST /api/admin/newsletter/:id/update
 * Body: { subject, body_text, tags?, locale?, status? }
 * Returns: { ok: true, version: <new version number> }
 *
 * Versioning is computed in-app (no trigger): we snapshot the CURRENT row
 * into versions BEFORE updating, with version = max(existing)+1.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type UpdateBody = {
  subject?: unknown;
  body_text?: unknown;
  tags?: unknown;
  locale?: unknown;
  status?: unknown;
  intended_for_automation?: unknown;
  intended_automation_delay_days?: unknown;
};

const ALLOWED_STATUSES = new Set(['draft', 'published', 'archived']);

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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

  let body: UpdateBody;
  try {
    body = (await request.json()) as UpdateBody;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const subject = asString(body.subject).trim();
  const bodyText = asString(body.body_text).trim();
  if (!subject) return NextResponse.json({ error: 'missing_subject' }, { status: 400 });
  if (!bodyText) return NextResponse.json({ error: 'missing_body' }, { status: 400 });

  const tags = asStringArray(body.tags);
  const localeRaw = asString(body.locale, 'he-IL').trim();
  const locale = localeRaw || 'he-IL';

  const statusRaw = asString(body.status, 'draft').trim();
  if (!ALLOWED_STATUSES.has(statusRaw)) {
    return NextResponse.json(
      { error: 'invalid_status', hint: 'one of: draft, published, archived' },
      { status: 400 },
    );
  }

  // 1. Load the current row so we can snapshot it before overwriting.
  const { data: current, error: loadError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .select('id, subject, body_text, body_mjml, body_html')
    .eq('id', id)
    .single();

  if (loadError || !current) {
    return NextResponse.json(
      { error: 'not_found', detail: loadError?.message },
      { status: 404 },
    );
  }

  // 2. Compute next version number.
  const { data: maxRow, error: maxError } = await supabase
    .schema('newsletter')
    .from('email_draft_versions')
    .select('version')
    .eq('draft_id', id)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (maxError) {
    return NextResponse.json(
      { error: 'version_lookup_failed', detail: maxError.message },
      { status: 500 },
    );
  }
  const nextVersion = (maxRow?.version ?? 0) + 1;

  // 3. Snapshot current row into versions.
  const { error: snapshotError } = await supabase
    .schema('newsletter')
    .from('email_draft_versions')
    .insert({
      draft_id: id,
      version: nextVersion,
      subject: current.subject,
      body_text: current.body_text,
      body_mjml: current.body_mjml,
      body_html: current.body_html,
      changed_by: user.id,
    });

  if (snapshotError) {
    return NextResponse.json(
      { error: 'snapshot_failed', detail: snapshotError.message },
      { status: 500 },
    );
  }

  // Optional intent fields.
  const patch: Record<string, unknown> = {
    subject,
    body_text: bodyText,
    tags,
    locale,
    status: statusRaw,
    updated_at: new Date().toISOString(),
  };
  if (typeof body.intended_for_automation === 'boolean') {
    patch.intended_for_automation = body.intended_for_automation;
    if (!body.intended_for_automation) {
      patch.intended_automation_delay_days = null;
    }
  }
  if (
    typeof body.intended_automation_delay_days === 'number' &&
    Number.isFinite(body.intended_automation_delay_days)
  ) {
    const v = Math.floor(body.intended_automation_delay_days);
    if (v >= 1 && v <= 365) patch.intended_automation_delay_days = v;
  }

  // 4. Apply update.
  const { error: updateError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .update(patch)
    .eq('id', id);

  if (updateError) {
    return NextResponse.json(
      { error: 'update_failed', detail: updateError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, version: nextVersion });
}
