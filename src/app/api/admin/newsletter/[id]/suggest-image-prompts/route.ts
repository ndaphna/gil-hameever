/**
 * Suggest 3 distinct English image prompts for a draft's header image.
 *
 * Auth: content_creator.
 *
 * POST /api/admin/newsletter/:id/suggest-image-prompts
 * Body (optional): { style?: 'realistic' | 'illustration' | 'landscape' | 'infographic' }
 * Returns: { ok, suggestions: [{ angle, prompt }, ...] }
 *
 * Each suggestion targets a DISTINCT conceptual angle (everyday metaphor /
 * landscape with light / quiet humorous moment / energy & motion / botanical /
 * bold color / small absurd juxtaposition) so the user gets variety, not
 * three near-duplicates. Voice: Aliza (optimistic, dryly witty), never
 * melancholic — see `@/lib/newsletter/image-prompt`.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import {
  suggestImagePromptVariants,
  type ImageStyleKey,
} from '@/lib/newsletter/image-prompt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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

  let bodyJson: { style?: unknown } = {};
  try {
    bodyJson = (await request.json()) as { style?: unknown };
  } catch {
    // empty body OK
  }
  const style: ImageStyleKey = (() => {
    const s = typeof bodyJson.style === 'string' ? bodyJson.style : '';
    return s === 'realistic' || s === 'illustration' || s === 'landscape' || s === 'infographic'
      ? s
      : 'landscape';
  })();

  const { data: draft, error: loadError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .select('id, subject, body_text')
    .eq('id', id)
    .maybeSingle<{ id: string; subject: string; body_text: string | null }>();
  if (loadError || !draft) {
    return NextResponse.json(
      { error: 'not_found', detail: loadError?.message },
      { status: 404 },
    );
  }
  if (!draft.subject.trim() || !(draft.body_text ?? '').trim()) {
    return NextResponse.json({ error: 'incomplete_draft' }, { status: 400 });
  }

  let suggestions;
  try {
    suggestions = await suggestImagePromptVariants(
      draft.subject,
      draft.body_text ?? '',
      style,
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: 'suggest_failed',
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, suggestions });
}
