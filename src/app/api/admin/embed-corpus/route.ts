/**
 * Generate embeddings for any `newsletter.inbal_corpus` row where
 * `embedding IS NULL`. Idempotent — re-run safely; only NULL rows are touched.
 *
 * Uses OpenAI `text-embedding-3-large` truncated to 1536 dims (HNSW max).
 *
 * Run locally (calls OpenAI; counts against the project's OPENAI_API_KEY):
 *   POST http://localhost:3001/api/admin/embed-corpus
 *   Header: x-admin-token: <ADMIN_IMPORT_TOKEN>
 *
 * Optional query params:
 *   limit=N   — cap rows processed this run (for testing)
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const EMBED_MODEL = 'text-embedding-3-large';
const EMBED_DIMS = 1536;
const BATCH_SIZE = 64;

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (_openai) return _openai;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
  _openai = new OpenAI({ apiKey });
  return _openai;
}

export async function POST(request: NextRequest) {
  const adminToken = request.headers.get('x-admin-token');
  if (!adminToken || adminToken !== process.env.ADMIN_IMPORT_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = Math.max(1, Math.min(1000, Number(url.searchParams.get('limit')) || 1000));

  const { data: rows, error: selectError } = await supabaseAdmin
    .schema('newsletter')
    .from('inbal_corpus')
    .select('id, body')
    .is('embedding', null)
    .limit(limit);

  if (selectError) {
    return NextResponse.json({ error: 'select_failed', detail: selectError.message }, { status: 500 });
  }

  if (!rows || rows.length === 0) {
    return NextResponse.json({ ok: true, embedded: 0, remaining: 0, note: 'nothing_to_embed' });
  }

  const openai = getOpenAI();
  const startedAt = Date.now();
  let embedded = 0;
  const errors: Array<{ id: string; error: string }> = [];

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const inputs = batch.map(r => r.body);

    let resp: Awaited<ReturnType<typeof openai.embeddings.create>>;
    try {
      resp = await openai.embeddings.create({
        model: EMBED_MODEL,
        dimensions: EMBED_DIMS,
        input: inputs,
      });
    } catch (err) {
      return NextResponse.json(
        {
          error: 'embedding_call_failed',
          embedded_so_far: embedded,
          batch_start: i,
          detail: err instanceof Error ? err.message : String(err),
        },
        { status: 502 },
      );
    }

    // Update each row individually — Supabase REST doesn't support bulk
    // pgvector upsert efficiently, and 64 sequential updates is fast.
    for (let j = 0; j < batch.length; j++) {
      const row = batch[j];
      const vector = resp.data[j].embedding;
      const { error: updateError } = await supabaseAdmin
        .schema('newsletter')
        .from('inbal_corpus')
        .update({ embedding: vector as unknown as string })
        .eq('id', row.id);

      if (updateError) {
        errors.push({ id: row.id, error: updateError.message });
      } else {
        embedded++;
      }
    }
  }

  // Count remaining NULL embeddings so the caller knows if a second run is needed.
  const { count: remaining } = await supabaseAdmin
    .schema('newsletter')
    .from('inbal_corpus')
    .select('id', { count: 'exact', head: true })
    .is('embedding', null);

  return NextResponse.json({
    ok: errors.length === 0,
    embedded,
    failed: errors.length,
    remaining: remaining ?? null,
    elapsed_ms: Date.now() - startedAt,
    errors: errors.slice(0, 10),
  });
}
