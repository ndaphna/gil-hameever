/**
 * One-shot importer: reads Inbal's book from a Word (.docx) file and
 * chunks it into `newsletter.inbal_corpus` rows with source='book'.
 *
 * Chunking strategy:
 *   - Detect H1/H2 headings -> become the chunk's `title` (chapter name)
 *   - Split body into paragraphs (mammoth's <p> blocks)
 *   - Merge small paragraphs until target size; split oversized paragraphs
 *     on Hebrew sentence boundaries (. ? !)
 *   - Target ~600 chars per chunk (range 300-1000) so embeddings stay tight
 *
 * Run locally (PDF/Word files are outside the Vercel bundle):
 *   POST http://localhost:3001/api/admin/import-book?path=<optional-override>
 *   Header: x-admin-token: <ADMIN_IMPORT_TOKEN>
 *
 * Idempotent: `(source, source_ref)` is unique, upserts re-run safely.
 * Embeddings are NOT generated here — that's the next step (embed-corpus).
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import mammoth from 'mammoth';
import { supabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const DEFAULT_BOOK_PATH = path.join(
  'C:',
  'Users',
  'Adva',
  'Documents',
  'גיל המעבר',
  'הספר - לא גברת גיבורה',
  'הספר לא גברת גיבורה- ענבל דפנה.docx',
);

const BOOK_TITLE = 'לא גברת גיבורה';
const TARGET_CHARS = 600;
const MIN_CHARS = 300;
const MAX_CHARS = 1000;

type Block =
  | { kind: 'heading'; level: number; text: string }
  | { kind: 'paragraph'; text: string };

/** Parse mammoth HTML output into an ordered list of heading/paragraph blocks. */
function parseBlocks(html: string): Block[] {
  const blocks: Block[] = [];
  const re = /<(h[1-6]|p)[^>]*>([\s\S]*?)<\/\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const tag = m[1].toLowerCase();
    const inner = m[2]
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
    if (!inner) continue;
    if (tag.startsWith('h')) {
      blocks.push({ kind: 'heading', level: Number(tag[1]), text: inner });
    } else {
      blocks.push({ kind: 'paragraph', text: inner });
    }
  }
  return blocks;
}

/** Split an oversized paragraph on Hebrew sentence enders, keeping chunks <= MAX. */
function splitLongParagraph(text: string): string[] {
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

type Chunk = { chapter: string; index: number; body: string };

function buildChunks(blocks: Block[]): Chunk[] {
  const chunks: Chunk[] = [];
  let currentChapter = '';
  let buffer = '';
  let chapterIndex = 0;

  const flush = () => {
    const trimmed = buffer.trim();
    if (trimmed.length >= MIN_CHARS || (trimmed.length > 0 && chunks.length === 0)) {
      chunks.push({ chapter: currentChapter, index: chapterIndex++, body: trimmed });
    } else if (trimmed.length > 0 && chunks.length > 0) {
      // Too small to stand alone — glue onto previous chunk.
      const prev = chunks[chunks.length - 1];
      prev.body = `${prev.body}\n\n${trimmed}`;
    }
    buffer = '';
  };

  for (const block of blocks) {
    if (block.kind === 'heading' && block.level <= 2) {
      flush();
      currentChapter = block.text;
      chapterIndex = 0;
      continue;
    }
    const text = block.kind === 'heading' ? block.text : block.text;
    const pieces = text.length > MAX_CHARS ? splitLongParagraph(text) : [text];
    for (const piece of pieces) {
      if (buffer.length + piece.length + 2 > MAX_CHARS && buffer.length >= MIN_CHARS) {
        flush();
      }
      buffer = buffer ? `${buffer}\n\n${piece}` : piece;
      if (buffer.length >= TARGET_CHARS) flush();
    }
  }
  flush();
  return chunks;
}

function slugifyChapter(chapter: string, fallback: number): string {
  if (!chapter) return `intro-${String(fallback).padStart(3, '0')}`;
  return chapter
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

export async function POST(request: NextRequest) {
  const adminToken = request.headers.get('x-admin-token');
  if (!adminToken || adminToken !== process.env.ADMIN_IMPORT_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const filePath = url.searchParams.get('path') || DEFAULT_BOOK_PATH;

  let buffer: Buffer;
  try {
    buffer = await readFile(filePath);
  } catch (err) {
    return NextResponse.json(
      { error: 'cannot_read_file', path: filePath, detail: err instanceof Error ? err.message : String(err) },
      { status: 400 },
    );
  }

  const { value: html, messages } = await mammoth.convertToHtml({ buffer });
  const blocks = parseBlocks(html);
  const chunks = buildChunks(blocks);

  if (chunks.length === 0) {
    return NextResponse.json({ ok: false, reason: 'no_chunks_produced', mammoth_messages: messages }, { status: 422 });
  }

  // Bulk delete previous book rows so re-runs don't accumulate stale chunks
  // (chunk ranges shift if we tune MIN/TARGET/MAX). Cheaper than dedup per row.
  const { error: deleteError } = await supabaseAdmin
    .schema('newsletter')
    .from('inbal_corpus')
    .delete()
    .eq('source', 'book');

  if (deleteError) {
    return NextResponse.json({ error: 'delete_failed', detail: deleteError.message }, { status: 500 });
  }

  const rows = chunks.map((c, globalIdx) => {
    const chapterSlug = slugifyChapter(c.chapter, globalIdx);
    const sourceRef = `${chapterSlug}#${String(c.index).padStart(3, '0')}`;
    return {
      source: 'book' as const,
      source_ref: sourceRef,
      title: c.chapter || BOOK_TITLE,
      body: c.body,
      locale: 'he-IL',
      tags: [] as string[],
    };
  });

  const BATCH = 100;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += BATCH) {
    const slice = rows.slice(i, i + BATCH);
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

  const totalChars = rows.reduce((sum, r) => sum + r.body.length, 0);
  const avgChars = Math.round(totalChars / rows.length);
  const chapters = Array.from(new Set(chunks.map(c => c.chapter).filter(Boolean)));

  return NextResponse.json({
    ok: true,
    file: filePath,
    chunks: inserted,
    total_chars: totalChars,
    avg_chars_per_chunk: avgChars,
    chapters_detected: chapters.length,
    chapters,
    mammoth_warnings: messages.filter(m => m.type === 'warning').length,
  });
}
