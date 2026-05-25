/**
 * One-shot importer: loads the two canonical Inbal voice docs from
 * `About Me/` (which are transcripts of the .docx originals stored under
 * `C:\Users\Adva\About Inbal\`) into `newsletter.inbal_corpus` with
 * source='manual'.
 *
 * Files imported:
 *   - About Me/inbal-character.md     -> source_ref 'inbal-character#NNN'
 *   - About Me/inbal-style-guide.md   -> source_ref 'inbal-style-guide#NNN'
 *
 * Chunking strategy mirrors import-book:
 *   - Split on `## ` H2 headings -> become the chunk `title`
 *   - Target ~600 chars per chunk (range 300-1000)
 *   - Strip the leading `> מקור:` provenance blockquote so it doesn't pollute
 *     embeddings
 *
 * Idempotent: re-running deletes all rows with source='manual' first.
 * Embeddings are NOT generated here — call embed-corpus afterwards.
 *
 * Run locally:
 *   POST http://localhost:3001/api/admin/import-inbal-docs
 *   Header: x-admin-token: <ADMIN_IMPORT_TOKEN>
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { supabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const TARGET_CHARS = 600;
const MIN_CHARS = 300;
const MAX_CHARS = 1000;

type DocSpec = { slug: string; relPath: string };

const DOCS: DocSpec[] = [
  { slug: 'inbal-character', relPath: path.join('About Me', 'inbal-character.md') },
  { slug: 'inbal-style-guide', relPath: path.join('About Me', 'inbal-style-guide.md') },
];

type Section = { title: string; body: string };

/** Strip the leading H1 + provenance blockquote so they don't enter the corpus. */
function stripPreamble(md: string): string {
  return md.replace(/^\s*#\s+[^\n]*\n+(?:>\s*[^\n]*\n+)?/u, '');
}

/** Split markdown into H2-anchored sections. Content above the first H2 attaches to a synthetic 'intro'. */
function splitByH2(md: string, fallbackTitle: string): Section[] {
  const lines = md.split(/\r?\n/);
  const sections: Section[] = [];
  let currentTitle = fallbackTitle;
  let buffer: string[] = [];

  const flush = () => {
    const body = buffer.join('\n').trim();
    if (body) sections.push({ title: currentTitle, body });
    buffer = [];
  };

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+?)\s*$/u);
    if (h2) {
      flush();
      currentTitle = h2[1].trim();
      continue;
    }
    buffer.push(line);
  }
  flush();
  return sections;
}

/** Split an oversized section body on Hebrew/Latin sentence enders. */
function splitLong(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+|\S[^.!?]*$/g) ?? [text];
  const out: string[] = [];
  let buf = '';
  for (const s of sentences) {
    if ((buf + s).length > MAX_CHARS && buf) {
      out.push(buf.trim());
      buf = s;
    } else {
      buf += s;
    }
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

type Chunk = { title: string; index: number; body: string };

function buildChunks(sections: Section[]): Chunk[] {
  const chunks: Chunk[] = [];
  for (const section of sections) {
    const pieces = section.body.length > MAX_CHARS ? splitLong(section.body) : [section.body];
    let buffer = '';
    let chunkIndex = 0;

    const flush = (force = false) => {
      const trimmed = buffer.trim();
      if (!trimmed) return;
      if (trimmed.length >= MIN_CHARS || force) {
        chunks.push({ title: section.title, index: chunkIndex++, body: trimmed });
        buffer = '';
      }
    };

    for (const piece of pieces) {
      if (buffer.length + piece.length + 2 > MAX_CHARS && buffer.length >= MIN_CHARS) {
        flush();
      }
      buffer = buffer ? `${buffer}\n\n${piece}` : piece;
      if (buffer.length >= TARGET_CHARS) flush();
    }
    // Section tail: emit even if short rather than dropping the heading.
    flush(true);
  }
  return chunks;
}

export async function POST(request: NextRequest) {
  const adminToken = request.headers.get('x-admin-token');
  if (!adminToken || adminToken !== process.env.ADMIN_IMPORT_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const repoRoot = process.cwd();
  const perDoc: Array<{ slug: string; sections: number; chunks: number; chars: number }> = [];
  const allRows: Array<{
    source: 'manual';
    source_ref: string;
    title: string;
    body: string;
    locale: string;
    tags: string[];
  }> = [];

  for (const doc of DOCS) {
    const fullPath = path.join(repoRoot, doc.relPath);
    let raw: string;
    try {
      raw = await readFile(fullPath, 'utf8');
    } catch (err) {
      return NextResponse.json(
        { error: 'cannot_read_file', path: fullPath, detail: err instanceof Error ? err.message : String(err) },
        { status: 400 },
      );
    }

    const stripped = stripPreamble(raw);
    const sections = splitByH2(stripped, doc.slug);
    const chunks = buildChunks(sections);

    let chars = 0;
    chunks.forEach((c, globalIdx) => {
      allRows.push({
        source: 'manual',
        source_ref: `${doc.slug}#${String(globalIdx).padStart(3, '0')}`,
        title: c.title,
        body: c.body,
        locale: 'he-IL',
        tags: [doc.slug],
      });
      chars += c.body.length;
    });

    perDoc.push({ slug: doc.slug, sections: sections.length, chunks: chunks.length, chars });
  }

  if (allRows.length === 0) {
    return NextResponse.json({ ok: false, reason: 'no_chunks_produced' }, { status: 422 });
  }

  // Idempotent: drop prior manual rows so re-runs don't accumulate stale chunks.
  const { error: deleteError } = await supabaseAdmin
    .schema('newsletter')
    .from('inbal_corpus')
    .delete()
    .eq('source', 'manual');

  if (deleteError) {
    return NextResponse.json({ error: 'delete_failed', detail: deleteError.message }, { status: 500 });
  }

  const BATCH = 100;
  let inserted = 0;
  for (let i = 0; i < allRows.length; i += BATCH) {
    const slice = allRows.slice(i, i + BATCH);
    const { error } = await supabaseAdmin
      .schema('newsletter')
      .from('inbal_corpus')
      .insert(slice);
    if (error) {
      return NextResponse.json(
        { error: 'insert_failed', inserted_so_far: inserted, detail: error.message },
        { status: 500 },
      );
    }
    inserted += slice.length;
  }

  return NextResponse.json({
    ok: true,
    inserted,
    per_doc: perDoc,
    total_chars: allRows.reduce((sum, r) => sum + r.body.length, 0),
  });
}
