/**
 * One-shot importer: scans the lead-magnet / landing pages under `src/app/`
 * and extracts Hebrew text content into `newsletter.inbal_corpus` rows with
 * source='website'. One row per directory (page).
 *
 * Each directory may contain multiple .tsx files (page.tsx + *-client.tsx +
 * modal/component siblings). We read all top-level .tsx files in the dir,
 * pull Hebrew strings out of JSX text nodes and quoted literals, dedupe,
 * and concatenate.
 *
 * Run locally:
 *   POST http://localhost:3001/api/admin/import-website-corpus
 *   Header: x-admin-token: <ADMIN_IMPORT_TOKEN>
 *
 * Embeddings not generated here.
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { supabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const TARGET_DIR_PATTERNS = [
  /-guide$/,
  /-guide-landing$/,
  /-landing$/,
  /^morning-reset$/,
];

const HEBREW_RE = /[֐-׿]/;
const MIN_LINE_CHARS = 10;
const MIN_PAGE_CHARS = 200;

/** Extract Hebrew-containing text fragments from a .tsx source file. */
function extractHebrew(source: string): string[] {
  const out: string[] = [];

  // JSX text nodes: anything between > and < that isn't another tag.
  // (Conservative — false positives are filtered by Hebrew-char check below.)
  const jsxRe = />([^<{}>]+)</g;
  let m: RegExpExecArray | null;
  while ((m = jsxRe.exec(source)) !== null) {
    out.push(m[1]);
  }

  // String literals: "...", '...', `...` (template — strip ${...} bits).
  const dquoted = source.match(/"([^"\\]|\\.)*"/g) ?? [];
  const squoted = source.match(/'([^'\\]|\\.)*'/g) ?? [];
  const tquoted = source.match(/`([^`\\]|\\.)*`/g) ?? [];
  for (const s of [...dquoted, ...squoted, ...tquoted]) {
    const inner = s.slice(1, -1).replace(/\$\{[^}]*\}/g, ' ');
    out.push(inner);
  }

  return out
    .map(t =>
      t
        .replace(/\\n/g, '\n')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter(t => t.length >= MIN_LINE_CHARS)
    .filter(t => HEBREW_RE.test(t));
}

/** Pull the page title from a `metadata` export if present. */
function extractMetadataTitle(source: string): string | null {
  const m = source.match(/title:\s*['"`]([^'"`]+)['"`]/);
  return m ? m[1].trim() : null;
}

async function isDir(p: string): Promise<boolean> {
  try {
    return (await stat(p)).isDirectory();
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const adminToken = request.headers.get('x-admin-token');
  if (!adminToken || adminToken !== process.env.ADMIN_IMPORT_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const appRoot = path.join(process.cwd(), 'src', 'app');
  const allEntries = await readdir(appRoot);
  const candidates = allEntries.filter(name =>
    TARGET_DIR_PATTERNS.some(re => re.test(name)),
  );

  // Filter to actual dirs (skip the rare standalone file with matching name).
  const dirs: string[] = [];
  for (const c of candidates) {
    if (await isDir(path.join(appRoot, c))) dirs.push(c);
  }

  const results: Array<{
    dir: string;
    status: string;
    chars?: number;
    files?: number;
    title?: string;
    error?: string;
  }> = [];

  // Wipe previous website rows so re-runs don't accumulate duplicates with
  // shifting line dedup.
  const { error: deleteError } = await supabaseAdmin
    .schema('newsletter')
    .from('inbal_corpus')
    .delete()
    .eq('source', 'website');

  if (deleteError) {
    return NextResponse.json({ error: 'delete_failed', detail: deleteError.message }, { status: 500 });
  }

  for (const dir of dirs) {
    try {
      const dirPath = path.join(appRoot, dir);
      const files = (await readdir(dirPath)).filter(f => f.endsWith('.tsx'));
      if (files.length === 0) {
        results.push({ dir, status: 'skipped_no_tsx' });
        continue;
      }

      const seen = new Set<string>();
      const lines: string[] = [];
      let title: string | null = null;

      for (const f of files) {
        const src = await readFile(path.join(dirPath, f), 'utf8');
        if (!title) title = extractMetadataTitle(src);
        for (const line of extractHebrew(src)) {
          if (seen.has(line)) continue;
          seen.add(line);
          lines.push(line);
        }
      }

      const body = lines.join('\n\n');
      if (body.length < MIN_PAGE_CHARS) {
        results.push({ dir, status: 'skipped_too_short', chars: body.length, files: files.length });
        continue;
      }

      const { error } = await supabaseAdmin
        .schema('newsletter')
        .from('inbal_corpus')
        .insert({
          source: 'website',
          source_ref: dir,
          title: title || dir,
          body,
          locale: 'he-IL',
          tags: [],
        });

      if (error) {
        results.push({ dir, status: 'error', error: error.message });
        continue;
      }

      results.push({ dir, status: 'ok', chars: body.length, files: files.length, title: title || undefined });
    } catch (err) {
      results.push({
        dir,
        status: 'error',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const okCount = results.filter(r => r.status === 'ok').length;
  const totalChars = results.reduce((sum, r) => sum + (r.chars ?? 0), 0);

  return NextResponse.json({
    ok: true,
    imported: okCount,
    total_candidates: dirs.length,
    total_chars: totalChars,
    results,
  });
}
