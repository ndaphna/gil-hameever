/**
 * Remove the generated header image from a draft.
 *
 * Auth: content_creator.
 *
 * DELETE /api/admin/newsletter/:id/header-image
 *   - Deletes the object from Storage (best-effort — logged but non-fatal).
 *   - Clears `header_image_url`, `header_image_prompt`, `header_image_provider`.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BUCKET = 'newsletter-images';

function objectKeyFromPublicUrl(url: string): string | null {
  // Public URLs look like:
  //   https://<ref>.supabase.co/storage/v1/object/public/newsletter-images/<key>
  const marker = `/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

export async function DELETE(
  _request: NextRequest,
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

  const { data: draft, error: loadError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .select('id, header_image_url')
    .eq('id', id)
    .maybeSingle<{ id: string; header_image_url: string | null }>();
  if (loadError || !draft) {
    return NextResponse.json(
      { error: 'not_found', detail: loadError?.message },
      { status: 404 },
    );
  }

  let storageDeleted: 'removed' | 'missing' | 'failed' = 'missing';
  if (draft.header_image_url) {
    const key = objectKeyFromPublicUrl(draft.header_image_url);
    if (key) {
      const { error: rmError } = await supabaseAdmin.storage
        .from(BUCKET)
        .remove([key]);
      storageDeleted = rmError ? 'failed' : 'removed';
    }
  }

  const { error: persistError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .update({
      header_image_url: null,
      header_image_prompt: null,
      header_image_provider: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (persistError) {
    return NextResponse.json(
      { error: 'persist_failed', detail: persistError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, storage: storageDeleted });
}
