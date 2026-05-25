/**
 * POST /api/admin/bots/[id]/assets — multipart upload of one or more files.
 *
 * Saves to Supabase Storage bucket `bot-brief-assets` with path
 *   `<brief_id>/<uuid>-<safe-filename>`
 * and inserts a row into bots.brief_assets. Only the brief's creator (while
 * status='draft') or admin can upload.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { AssetKind } from '@/lib/bots/schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 25 * 1024 * 1024; // mirrors bucket file_size_limit
const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
  'video/mp4',
  'video/quicktime',
]);

function kindFromMime(mime: string): AssetKind {
  if (mime.startsWith('image/')) return 'image';
  if (mime === 'application/pdf') return 'pdf';
  if (mime.startsWith('video/')) return 'video';
  return 'other';
}

function safeFilename(name: string): string {
  const trimmed = name.replace(/[\\/]+/g, '_').replace(/[^\w.\- ()]/g, '_').slice(0, 100);
  return trimmed || 'asset';
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: briefId } = await params;
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Caller must be able to read the brief (RLS enforces); also fetch status.
  const { data: brief, error: briefErr } = await supabase
    .schema('bots')
    .from('briefs')
    .select('id, status, created_by')
    .eq('id', briefId)
    .single();

  if (briefErr || !brief) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'invalid_multipart' }, { status: 400 });
  }

  const files = form.getAll('files').filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: 'no_files' }, { status: 400 });
  }

  const inserted: Array<{ id: string; storage_path: string; filename: string }> = [];

  for (const file of files) {
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'file_too_large', detail: file.name }, { status: 413 });
    }
    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json({ error: 'unsupported_type', detail: file.type }, { status: 415 });
    }

    const uid = crypto.randomUUID();
    const path = `${briefId}/${uid}-${safeFilename(file.name)}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadErr } = await supabaseAdmin.storage
      .from('bot-brief-assets')
      .upload(path, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadErr) {
      return NextResponse.json(
        { error: 'upload_failed', detail: uploadErr.message, file: file.name },
        { status: 500 },
      );
    }

    const { data: row, error: insertErr } = await supabase
      .schema('bots')
      .from('brief_assets')
      .insert({
        brief_id: briefId,
        kind: kindFromMime(file.type),
        storage_path: path,
        filename: file.name,
        mime: file.type,
        size_bytes: file.size,
        uploaded_by: user.id,
      })
      .select('id, storage_path, filename')
      .single();

    if (insertErr) {
      // Roll back the storage upload to avoid orphans
      await supabaseAdmin.storage.from('bot-brief-assets').remove([path]);
      return NextResponse.json(
        { error: 'asset_row_failed', detail: insertErr.message, file: file.name },
        { status: 500 },
      );
    }
    inserted.push(row);
  }

  return NextResponse.json({ ok: true, assets: inserted });
}
