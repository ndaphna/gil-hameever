/**
 * Use an existing image as a newsletter draft's header image.
 *
 * Auth: content_creator.
 *
 * POST /api/admin/newsletter/:id/upload-image
 *   - multipart/form-data with a `file` field (device upload), OR
 *   - application/json with { url } (paste a link, incl. a Google Drive
 *     "anyone with the link" share URL — normalized to a direct download).
 *
 * Pipeline:
 *   1. Load the bytes (multipart file, or fetch the URL).
 *   2. Normalize with sharp: honor EXIF rotation, resize 1536x1024 (fit cover —
 *      same canonical dimensions as the AI-generated images), flatten onto white,
 *      encode JPEG q85.
 *   3. Upload to the public Supabase Storage bucket `newsletter-images`.
 *   4. Persist header_image_url / header_image_provider='upload' /
 *      header_image_prompt=null on the draft row.
 *   5. Return { ok, url, provider }.
 */

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const BUCKET = 'newsletter-images';
const PROVIDER = 'upload';
const TARGET_W = 1536;
const TARGET_H = 1024;
const MAX_BYTES = 15 * 1024 * 1024; // 15MB
const FETCH_TIMEOUT_MS = 15_000;

/**
 * Convert common Google Drive share links to a direct-download URL.
 * Other URLs pass through unchanged.
 */
function normalizeImageUrl(raw: string): string {
  try {
    const u = new URL(raw);
    if (u.hostname === 'drive.google.com') {
      // .../file/d/<ID>/view  or  /open?id=<ID>  or  /uc?id=<ID>
      const m = u.pathname.match(/\/file\/d\/([^/]+)/);
      const id = m?.[1] ?? u.searchParams.get('id');
      if (id) return `https://drive.google.com/uc?export=download&id=${id}`;
    }
    return raw;
  } catch {
    return raw;
  }
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
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data: allowed, error: roleError } = await supabase
    .schema('newsletter')
    .rpc('has_role', { required: 'content_creator' });
  if (roleError || allowed !== true) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  // Make sure the draft exists before doing any image work.
  const { data: draft, error: loadError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .select('id')
    .eq('id', id)
    .maybeSingle<{ id: string }>();
  if (loadError || !draft) {
    return NextResponse.json(
      { error: 'not_found', detail: loadError?.message },
      { status: 404 },
    );
  }

  // 1. Acquire the raw bytes from either a multipart file or a URL.
  let input: Buffer;
  const contentType = request.headers.get('content-type') ?? '';

  try {
    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const file = form.get('file');
      if (!(file instanceof File)) {
        return NextResponse.json({ error: 'no_file' }, { status: 400 });
      }
      if (file.size > MAX_BYTES) {
        return NextResponse.json({ error: 'file_too_large' }, { status: 400 });
      }
      input = Buffer.from(await file.arrayBuffer());
    } else {
      const body = (await request.json().catch(() => ({}))) as { url?: unknown };
      const rawUrl = typeof body.url === 'string' ? body.url.trim() : '';
      if (!rawUrl) {
        return NextResponse.json({ error: 'no_url' }, { status: 400 });
      }
      const fetchUrl = normalizeImageUrl(rawUrl);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      let res: Response;
      try {
        res = await fetch(fetchUrl, { signal: controller.signal, redirect: 'follow' });
      } finally {
        clearTimeout(timeout);
      }
      if (!res.ok) {
        return NextResponse.json(
          { error: 'fetch_failed', detail: `HTTP ${res.status}` },
          { status: 400 },
        );
      }
      const ct = res.headers.get('content-type') ?? '';
      // Drive permission pages and dead links return HTML, not an image.
      if (ct && !ct.startsWith('image/')) {
        return NextResponse.json(
          {
            error: 'not_an_image',
            detail:
              'הקישור לא מחזיר תמונה. אם זה קובץ Drive — ודאי שהוא משותף ל"כל מי שיש לו הקישור".',
          },
          { status: 400 },
        );
      }
      const arr = await res.arrayBuffer();
      if (arr.byteLength > MAX_BYTES) {
        return NextResponse.json({ error: 'file_too_large' }, { status: 400 });
      }
      input = Buffer.from(arr);
    }
  } catch (err) {
    return NextResponse.json(
      { error: 'read_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 400 },
    );
  }

  // 2. Normalize to the canonical header dimensions.
  let jpeg: Buffer;
  try {
    jpeg = await sharp(input)
      .rotate() // honor EXIF orientation (phone photos)
      .resize(TARGET_W, TARGET_H, { fit: 'cover' })
      .flatten({ background: '#ffffff' }) // transparent PNG → white, not black
      .jpeg({ quality: 85 })
      .toBuffer();
  } catch {
    return NextResponse.json(
      {
        error: 'invalid_image',
        detail: 'לא הצלחתי לקרוא את הקובץ כתמונה. נסי JPG או PNG.',
      },
      { status: 400 },
    );
  }

  // 3. Upload to the same bucket the generator uses.
  const filename = `${id}-${Date.now()}.jpg`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filename, jpeg, {
      contentType: 'image/jpeg',
      cacheControl: '31536000, immutable',
      upsert: false,
    });
  if (uploadError) {
    return NextResponse.json(
      { error: 'upload_failed', detail: uploadError.message },
      { status: 500 },
    );
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(filename);
  const publicUrl = publicUrlData.publicUrl;

  // 4. Persist on the draft row.
  const { error: persistError } = await supabase
    .schema('newsletter')
    .from('email_drafts')
    .update({
      header_image_url: publicUrl,
      header_image_prompt: null,
      header_image_provider: PROVIDER,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (persistError) {
    return NextResponse.json(
      { error: 'persist_failed', detail: persistError.message, url: publicUrl },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, url: publicUrl, provider: PROVIDER });
}
