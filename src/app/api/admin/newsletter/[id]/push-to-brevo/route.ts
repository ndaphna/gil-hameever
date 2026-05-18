/**
 * Push a draft to Brevo as a transactional template.
 *
 * Auth: session must have a newsletter role. RLS enforces the same gate.
 *
 * POST /api/admin/newsletter/:id/push-to-brevo
 * Returns: { ok: true, template_id, action: 'created' | 'updated' }
 *
 * If the draft already has `brevo_template_id`, we PUT (update existing
 * template). Otherwise POST and persist the new id on the draft row.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { syncTemplateToBrevo } from '@/lib/newsletter/brevo-template';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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
    .select('id, subject, body_text, brevo_template_id, header_image_url')
    .eq('id', id)
    .maybeSingle<{
      id: string;
      subject: string;
      body_text: string | null;
      brevo_template_id: number | null;
      header_image_url: string | null;
    }>();

  if (loadError || !draft) {
    return NextResponse.json(
      { error: 'not_found', detail: loadError?.message },
      { status: 404 },
    );
  }

  const subject = draft.subject.trim();
  const bodyText = (draft.body_text ?? '').trim();
  if (!subject) {
    return NextResponse.json({ error: 'missing_subject' }, { status: 400 });
  }
  if (!bodyText) {
    return NextResponse.json({ error: 'missing_body' }, { status: 400 });
  }

  let result;
  try {
    result = await syncTemplateToBrevo(draft.brevo_template_id, {
      subject,
      bodyText,
      headerImageUrl: draft.header_image_url,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'brevo_sync_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }

  if (result.action === 'created') {
    const { error: persistError } = await supabase
      .schema('newsletter')
      .from('email_drafts')
      .update({
        brevo_template_id: result.templateId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (persistError) {
      return NextResponse.json(
        {
          error: 'persist_template_id_failed',
          detail: persistError.message,
          template_id: result.templateId,
        },
        { status: 500 },
      );
    }
  } else {
    await supabase
      .schema('newsletter')
      .from('email_drafts')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', id);
  }

  return NextResponse.json({
    ok: true,
    template_id: result.templateId,
    action: result.action,
  });
}
