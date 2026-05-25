/**
 * POST /api/admin/bots/[id]/submit
 *
 * Transitions a draft to 'submitted' and notifies Nitzan via Brevo email
 * (+ Make.com webhook for WhatsApp if configured). Notification failures do
 * NOT roll back the status change — the brief is still queryable in the admin.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { validateForSubmit, BotBriefRow, BriefAssetRow, BRIEF_TYPE_LABEL } from '@/lib/bots/schema';
import { renderSpecHtml, renderSpecMarkdown, SignedAsset } from '@/lib/bots/spec-renderer';
import { notifyBriefSubmitted } from '@/lib/bots/notify';
import { getBrevoTemplateName } from '@/lib/bots/brevo-templates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUBMIT_URL_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days for Nitzan to download

function appBaseUrl(req: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  const host = req.headers.get('host') ?? 'gilhameever.com';
  return `${proto}://${host}`;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { data: brief, error: fetchErr } = await supabase
    .schema('bots')
    .from('briefs')
    .select('*')
    .eq('id', id)
    .single<BotBriefRow>();

  if (fetchErr || !brief) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  if (brief.status !== 'draft') {
    return NextResponse.json({ error: 'wrong_status', detail: brief.status }, { status: 400 });
  }

  const check = validateForSubmit(brief);
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 });
  }

  // Move to submitted (RLS + trigger enforce legality)
  const { error: updateErr } = await supabase
    .schema('bots')
    .from('briefs')
    .update({ status: 'submitted' })
    .eq('id', id);

  if (updateErr) {
    return NextResponse.json({ error: 'submit_failed', detail: updateErr.message }, { status: 500 });
  }

  // ---- Notification (best effort) ----

  const { data: assets } = await supabase
    .schema('bots')
    .from('brief_assets')
    .select('*')
    .eq('brief_id', id)
    .order('created_at', { ascending: true });

  const signedAssets: SignedAsset[] = [];
  for (const a of (assets ?? []) as BriefAssetRow[]) {
    const { data: signed } = await supabaseAdmin.storage
      .from('bot-brief-assets')
      .createSignedUrl(a.storage_path, SUBMIT_URL_TTL_SECONDS);
    if (signed?.signedUrl) {
      signedAssets.push({ ...a, signed_url: signed.signedUrl });
    }
  }

  const { data: profile } = await supabase
    .from('user_profile')
    .select('full_name, email, first_name, last_name')
    .eq('id', brief.created_by)
    .maybeSingle();

  const profileTyped = profile as
    | { full_name?: string | null; email?: string | null; first_name?: string | null; last_name?: string | null }
    | null;
  const fullName = profileTyped?.full_name ?? null;
  const composedName = [profileTyped?.first_name, profileTyped?.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();
  const creatorName = fullName ?? (composedName || user.email || null);
  const creatorEmail = profileTyped?.email ?? user.email ?? null;

  const brevoTemplateName = brief.brevo_template_id
    ? await getBrevoTemplateName(brief.brevo_template_id)
    : null;

  const baseUrl = appBaseUrl(req);
  const subject = `🤖 בריף בוט חדש: ${brief.title} (${BRIEF_TYPE_LABEL[brief.type]})`;
  const htmlBody = renderSpecHtml({
    brief: { ...brief, status: 'submitted' },
    assets: signedAssets,
    creatorName,
    creatorEmail,
    brevoTemplateName,
    appBaseUrl: baseUrl,
  });
  const markdownBody = renderSpecMarkdown({
    brief: { ...brief, status: 'submitted' },
    assets: signedAssets,
    creatorName,
    creatorEmail,
    brevoTemplateName,
    appBaseUrl: baseUrl,
  });

  const notify = await notifyBriefSubmitted({
    brief: { ...brief, status: 'submitted' },
    subject,
    htmlBody,
    markdownBody,
    appBaseUrl: baseUrl,
  });

  return NextResponse.json({ ok: true, notify });
}
