/**
 * Send a test copy of a draft to 1-10 recipients via Brevo's sendTest endpoint.
 *
 * Auth: content_creator.
 *
 * POST /api/admin/newsletter/:id/send-test
 * Body: { recipients: string[] }
 *
 * Pipeline:
 *   1. Validate emails (1..10, basic regex).
 *   2. Re-sync the draft to Brevo so the test reflects the latest body, subject,
 *      and header image (idempotent PUT if template exists).
 *   3. Call Brevo `/smtp/templates/{id}/sendTest`.
 *
 * Note: test recipients who are NOT in the Brevo contact list get the no-name
 * greeting because the `{% if contact.FIRSTNAME %}` fallback resolves to "היי,".
 * Test sends still count against the Brevo sending quota.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { sendTemplateTest, syncTemplateToBrevo } from '@/lib/newsletter/brevo-template';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

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

  let bodyJson: { recipients?: unknown };
  try {
    bodyJson = (await request.json()) as { recipients?: unknown };
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (!Array.isArray(bodyJson.recipients)) {
    return NextResponse.json({ error: 'missing_recipients' }, { status: 400 });
  }
  const recipients = bodyJson.recipients
    .filter((x): x is string => typeof x === 'string')
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
  if (recipients.length === 0) {
    return NextResponse.json({ error: 'no_recipients' }, { status: 400 });
  }
  if (recipients.length > 10) {
    return NextResponse.json(
      { error: 'too_many_recipients', hint: 'max 10' },
      { status: 400 },
    );
  }
  const invalid = recipients.filter((e) => !EMAIL_RE.test(e));
  if (invalid.length > 0) {
    return NextResponse.json(
      { error: 'invalid_email', detail: invalid.join(', ') },
      { status: 400 },
    );
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
  if (!draft.subject.trim() || !(draft.body_text ?? '').trim()) {
    return NextResponse.json({ error: 'incomplete_draft' }, { status: 400 });
  }

  let templateId = draft.brevo_template_id;
  try {
    const sync = await syncTemplateToBrevo(templateId, {
      subject: draft.subject,
      bodyText: draft.body_text ?? '',
      headerImageUrl: draft.header_image_url,
    });
    if (sync.templateId !== templateId) {
      templateId = sync.templateId;
      const { error: persistError } = await supabase
        .schema('newsletter')
        .from('email_drafts')
        .update({
          brevo_template_id: templateId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (persistError) {
        return NextResponse.json(
          {
            error: 'persist_template_id_failed',
            detail: persistError.message,
            brevo_template_id: templateId,
          },
          { status: 500 },
        );
      }
    }
  } catch (err) {
    return NextResponse.json(
      {
        error: 'brevo_sync_failed',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }

  if (!templateId) {
    return NextResponse.json({ error: 'no_template_id_after_sync' }, { status: 500 });
  }

  try {
    await sendTemplateTest(templateId, recipients);
  } catch (err) {
    return NextResponse.json(
      {
        error: 'brevo_send_test_failed',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    template_id: templateId,
    sent_to: recipients,
  });
}
