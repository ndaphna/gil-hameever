/**
 * Fetch Brevo Transactional Email Templates so Inbal can pick one for the
 * follow-up email from a dropdown. Cached in-memory per server instance for
 * 5 minutes to avoid hammering Brevo on every form load.
 */

const BREVO_API_BASE = 'https://api.brevo.com/v3';
const CACHE_TTL_MS = 5 * 60 * 1000;

export type BrevoTemplateSummary = {
  id: number;
  name: string;
  subject: string;
  isActive: boolean;
};

type CacheEntry = { fetchedAt: number; value: BrevoTemplateSummary[] };
let cache: CacheEntry | null = null;

export async function listBrevoTemplates(opts?: { force?: boolean }): Promise<BrevoTemplateSummary[]> {
  const now = Date.now();
  if (!opts?.force && cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.value;
  }

  const key = process.env.BREVO_API_KEY;
  if (!key) throw new Error('BREVO_API_KEY missing');

  // Brevo paginates; for an account with <500 templates one page is plenty.
  const url = `${BREVO_API_BASE}/smtp/templates?templateStatus=true&limit=200&offset=0&sort=desc`;
  const res = await fetch(url, {
    headers: {
      accept: 'application/json',
      'api-key': key,
    },
    // Next.js fetch cache off — we cache ourselves above.
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo templates fetch failed: ${res.status} ${text.slice(0, 200)}`);
  }

  type RawTemplate = { id: number; name: string; subject?: string; isActive?: boolean };
  const data = (await res.json()) as { templates?: RawTemplate[] };
  const templates = (data.templates ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    subject: t.subject ?? '',
    isActive: t.isActive ?? false,
  }));

  cache = { fetchedAt: now, value: templates };
  return templates;
}

export async function getBrevoTemplateName(id: number): Promise<string | null> {
  try {
    const templates = await listBrevoTemplates();
    return templates.find((t) => t.id === id)?.name ?? null;
  } catch {
    return null;
  }
}
