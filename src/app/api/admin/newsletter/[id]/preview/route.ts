/**
 * Render the full Brevo-styled email HTML for in-browser preview.
 *
 * Auth: content_creator.
 *
 * POST /api/admin/newsletter/:id/preview
 * Body (all optional — when omitted, fields are pulled from the saved row, so
 * the editor can preview unsaved edits by sending the current client state):
 *   {
 *     subject?: string,
 *     body_text?: string,
 *     header_image_url?: string | null,
 *     first_name?: string  // preview name; "" → "היי," fallback
 *   }
 *
 * Returns: text/html — the full email markup with Liquid swapped for literal
 * greeting + unsubscribe placeholder. Intended to be loaded into an iframe via
 * `srcdoc`.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { buildEmailHtml } from '@/lib/newsletter/brevo-template';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = {
  subject?: unknown;
  body_text?: unknown;
  header_image_url?: unknown;
  first_name?: unknown;
};

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

  let bodyJson: Body = {};
  try {
    bodyJson = (await request.json()) as Body;
  } catch {
    // empty body OK — pull everything from the row
  }

  const { data: draft, error: loadError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .select('subject, body_text, header_image_url')
    .eq('id', id)
    .maybeSingle<{
      subject: string;
      body_text: string | null;
      header_image_url: string | null;
    }>();
  if (loadError || !draft) {
    return NextResponse.json(
      { error: 'not_found', detail: loadError?.message },
      { status: 404 },
    );
  }

  const subject =
    typeof bodyJson.subject === 'string' ? bodyJson.subject : draft.subject;
  const bodyText =
    typeof bodyJson.body_text === 'string' ? bodyJson.body_text : (draft.body_text ?? '');
  const headerImageUrl =
    typeof bodyJson.header_image_url === 'string'
      ? bodyJson.header_image_url
      : bodyJson.header_image_url === null
        ? null
        : draft.header_image_url;
  const firstName =
    typeof bodyJson.first_name === 'string' ? bodyJson.first_name : '';

  const html = buildEmailHtml(subject, bodyText, headerImageUrl, {
    previewFirstName: firstName,
  });

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
