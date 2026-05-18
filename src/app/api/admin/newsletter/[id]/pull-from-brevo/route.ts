/**
 * Pull the current subject of a Brevo template back into the local draft row.
 *
 * Use case: subject was edited directly in the Brevo dashboard. The local DB
 * is otherwise the source of truth — this is the only field we re-import.
 *
 * Body content is NOT pulled: the HTML stored in Brevo is the rendered
 * wrapper (header + greeting + sections + signature + footer), not a
 * round-trippable representation of the editor's plain text.
 *
 * Auth: session must have a newsletter role. RLS enforces the same gate.
 *
 * POST /api/admin/newsletter/:id/pull-from-brevo
 * Returns: { ok: true, subject_changed: boolean, subject, previous_subject }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const BREVO_API_BASE = 'https://api.brevo.com/v3';

export async function POST(
  _request: NextRequest,
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

  const { data: draft, error: loadError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .select('id, subject, brevo_template_id')
    .eq('id', id)
    .maybeSingle<{
      id: string;
      subject: string;
      brevo_template_id: number | null;
    }>();

  if (loadError || !draft) {
    return NextResponse.json(
      { error: 'not_found', detail: loadError?.message },
      { status: 404 },
    );
  }

  if (draft.brevo_template_id === null) {
    return NextResponse.json(
      { error: 'no_brevo_template', detail: 'Draft has never been synced to Brevo' },
      { status: 400 },
    );
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'brevo_key_missing' }, { status: 500 });
  }

  const brevoRes = await fetch(
    `${BREVO_API_BASE}/smtp/templates/${draft.brevo_template_id}`,
    {
      method: 'GET',
      headers: { accept: 'application/json', 'api-key': apiKey },
    },
  );

  if (!brevoRes.ok) {
    const text = await brevoRes.text();
    return NextResponse.json(
      {
        error: 'brevo_fetch_failed',
        detail: `${brevoRes.status} ${text.slice(0, 300)}`,
      },
      { status: 502 },
    );
  }

  const brevoTpl = (await brevoRes.json()) as { subject?: string };
  const newSubject = (brevoTpl.subject ?? '').trim();
  if (!newSubject) {
    return NextResponse.json(
      { error: 'brevo_returned_empty_subject' },
      { status: 502 },
    );
  }

  const previousSubject = draft.subject;
  const subjectChanged = newSubject !== previousSubject;

  if (subjectChanged) {
    const { error: updateError } = await supabase
      .schema('newsletter')
      .from('email_drafts')
      .update({
        subject: newSubject,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) {
      return NextResponse.json(
        { error: 'update_failed', detail: updateError.message },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    ok: true,
    subject_changed: subjectChanged,
    subject: newSubject,
    previous_subject: previousSubject,
  });
}
