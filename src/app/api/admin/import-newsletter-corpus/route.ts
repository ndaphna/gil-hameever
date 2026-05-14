/**
 * One-shot importer: loads the 14 newsletter HTML files from repo root
 * into `newsletter.inbal_corpus` as `source='newsletter'`.
 *
 * Run via authenticated admin call:
 *   POST /api/admin/import-newsletter-corpus
 *   Header: x-admin-token: <ADMIN_IMPORT_TOKEN>
 *
 * Embeddings are NOT generated here — that's Phase 2 (style distillation).
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { supabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/** Strip HTML to plain text (lightweight; Hebrew-safe). */
function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTitleFromFilename(filename: string): string {
  return filename
    .replace(/^newsletter-/, '')
    .replace(/\.html$/, '')
    .replace(/-/g, ' ')
    .replace(/\bv\d+\b/, '')
    .trim();
}

/** Heuristic tag inference from filename. Edited later by hand if needed. */
function inferTags(filename: string): string[] {
  const map: Array<[RegExp, string[]]> = [
    [/hot-flashes/i,        ['גלי חום']],
    [/sleep/i,              ['שינה']],
    [/brain-fog/i,          ['ערפול קוגניטיבי']],
    [/skin/i,               ['יובש']],
    [/loneliness/i,         ['חברות']],
    [/identity/i,           ['זהות עצמית']],
    [/emotional/i,          ['תנודות מצב רוח']],
    [/desire|intimacy/i,    ['זוגיות']],
    [/body-changes/i,       ['עלייה במשקל']],
    [/welcome/i,            ['פתיחה']],
    [/closing/i,            ['סיום']],
  ];
  return map.filter(([re]) => re.test(filename)).flatMap(([, tags]) => tags);
}

export async function POST(request: NextRequest) {
  const adminToken = request.headers.get('x-admin-token');
  if (!adminToken || adminToken !== process.env.ADMIN_IMPORT_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const repoRoot = process.cwd();
  const files = (await readdir(repoRoot))
    .filter(f => /^newsletter-.*\.html$/.test(f))
    // Skip the base template — it's structural, not content.
    .filter(f => f !== 'newsletter-template-base.html' && f !== 'newsletter-snippets.html');

  const results: Array<{ file: string; status: string; chars?: number; error?: string }> = [];

  for (const file of files) {
    try {
      const fullPath = path.join(repoRoot, file);
      const html = await readFile(fullPath, 'utf8');
      const text = htmlToText(html);

      // Skip if too short (probably a stub)
      if (text.length < 200) {
        results.push({ file, status: 'skipped_too_short', chars: text.length });
        continue;
      }

      const title = extractTitleFromFilename(file);
      const tags = inferTags(file);

      const { error } = await supabaseAdmin
        .schema('newsletter')
        .from('inbal_corpus')
        .upsert(
          {
            source: 'newsletter',
            source_ref: file,
            title,
            body: text,
            locale: 'he-IL',
            tags,
          },
          { onConflict: 'source,source_ref' },
        );

      if (error) {
        results.push({ file, status: 'error', error: error.message });
        continue;
      }

      results.push({ file, status: 'ok', chars: text.length });
    } catch (err) {
      results.push({
        file,
        status: 'error',
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const okCount = results.filter(r => r.status === 'ok').length;
  return NextResponse.json({
    ok: true,
    imported: okCount,
    total: files.length,
    results,
  });
}
