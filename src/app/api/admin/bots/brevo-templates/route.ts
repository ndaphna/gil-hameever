/**
 * GET /api/admin/bots/brevo-templates — list active Brevo transactional
 * templates so Inbal can pick a follow-up email from a dropdown.
 */

import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { listBrevoTemplates } from '@/lib/bots/brevo-templates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { data: allowed } = await supabase
    .schema('newsletter')
    .rpc('has_role', { required: 'content_creator' });
  if (allowed !== true) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  try {
    const templates = await listBrevoTemplates();
    return NextResponse.json({ ok: true, templates });
  } catch (err) {
    return NextResponse.json(
      { error: 'brevo_fetch_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}
