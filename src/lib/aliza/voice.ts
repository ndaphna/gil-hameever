/**
 * Aliza voice layer: load the active style guide + retrieve relevant chunks
 * from the Inbal corpus using pgvector. Mirrors the approach used in
 * src/app/api/admin/draft-newsletter/route.ts so chat and newsletter share
 * the same voice substrate.
 */

import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabase-server';

const EMBED_MODEL = 'text-embedding-3-large';
const EMBED_DIMS = 1536;

let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (_openai) return _openai;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
  _openai = new OpenAI({ apiKey });
  return _openai;
}

export type CorpusMatch = {
  id: string;
  source: string;
  source_ref: string | null;
  title: string | null;
  body: string;
  tags: string[] | null;
  similarity: number;
};

export type StyleGuide = {
  id: string;
  version: number;
  content_md: string;
};

/**
 * Load the active Hebrew style guide. Returns null on miss (caller decides
 * whether to fail open or hard).
 */
export async function loadActiveStyleGuide(): Promise<StyleGuide | null> {
  const { data, error } = await supabaseAdmin
    .schema('newsletter')
    .from('style_guide')
    .select('id, version, content_md')
    .eq('locale', 'he-IL')
    .eq('is_active', true)
    .single();

  if (error || !data) {
    console.warn('⚠️ No active style guide found:', error?.message);
    return null;
  }
  return data as StyleGuide;
}

/**
 * Embed a query and retrieve top-K corpus chunks via pgvector cosine similarity.
 * Uses the same `newsletter.match_corpus` RPC the newsletter route uses.
 */
export async function retrieveCorpusChunks(
  query: string,
  k: number = 6,
): Promise<CorpusMatch[]> {
  if (!query.trim()) return [];

  const openai = getOpenAI();
  const embedResp = await openai.embeddings.create({
    model: EMBED_MODEL,
    dimensions: EMBED_DIMS,
    input: query,
  });
  const queryEmbedding = embedResp.data[0].embedding;

  const { data, error } = await supabaseAdmin
    .schema('newsletter')
    .rpc('match_corpus', {
      query_embedding: queryEmbedding as unknown as string,
      match_count: Math.max(3, Math.min(12, k)),
      source_filter: null,
      locale_filter: 'he-IL',
    });

  if (error) {
    console.warn('⚠️ RAG retrieval failed:', error.message);
    return [];
  }
  return (data ?? []) as CorpusMatch[];
}

/**
 * Format retrieved chunks as a context block for the system prompt.
 * Keeps the same labeling style as the newsletter route so the model
 * sees a familiar layout.
 */
export function formatCorpusContext(chunks: CorpusMatch[]): string {
  if (chunks.length === 0) return '';
  return chunks
    .map((c, i) => {
      const label = c.title
        ? `${c.title} [${c.source}:${c.source_ref ?? ''}]`
        : `${c.source}:${c.source_ref ?? ''}`;
      return `### קטע ${i + 1} (${label}) — דמיון ${c.similarity.toFixed(3)}\n${c.body}`;
    })
    .join('\n\n');
}

/**
 * Build the embedding query from the user's latest message, optionally
 * prefixed with prior turns so retrieval reflects conversation context.
 * Returns just the last user message if no history.
 */
export function buildEmbeddingQuery(
  latestUserMessage: string,
  recentHistory: Array<{ role: string; content: string }> = [],
): string {
  const lastTwo = recentHistory
    .filter(m => m.role === 'user')
    .slice(-2)
    .map(m => m.content)
    .join(' ');
  return lastTwo ? `${lastTwo} ${latestUserMessage}`.slice(0, 1000) : latestUserMessage;
}
