/**
 * ManyChat Public API client. Covers the operations we can do programmatically;
 * flow creation is NOT supported by the API and must be done in the ManyChat UI.
 *
 * Endpoints reference:
 *   - POST /fb/page/createTag
 *   - POST /fb/page/createCustomField
 *   - POST /fb/subscriber/addTagByName
 *   - POST /fb/sending/sendFlow
 *
 * Note: ManyChat scopes endpoints by channel (fb / instagram / whatsapp).
 * We use the `fb` namespace which covers Facebook + Instagram Messenger.
 */

const MANYCHAT_API_BASE = 'https://api.manychat.com';

function authHeaders(): HeadersInit {
  const token = process.env.MANYCHAT_API_TOKEN;
  if (!token) throw new Error('MANYCHAT_API_TOKEN missing');
  return {
    accept: 'application/json',
    'content-type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

type ManyChatResponse<T> = { status: 'success'; data: T } | { status: 'error'; message: string };

async function callManyChat<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${MANYCHAT_API_BASE}${path}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const data = (await res.json()) as ManyChatResponse<T>;
  if (!res.ok || data.status !== 'success') {
    const msg = data.status === 'error' ? data.message : `HTTP ${res.status}`;
    throw new Error(`ManyChat ${path}: ${msg}`);
  }
  return data.data;
}

// ---------------- Tags ----------------

export async function createTag(name: string): Promise<{ id: number; name: string }> {
  return callManyChat<{ id: number; name: string }>('/fb/page/createTag', { name });
}

export async function addTagToSubscriber(subscriberId: number | string, tagName: string): Promise<void> {
  await callManyChat<unknown>('/fb/subscriber/addTagByName', {
    subscriber_id: subscriberId,
    tag_name: tagName,
  });
}

// ---------------- Custom Fields ----------------

export type CustomFieldType = 'text' | 'number' | 'date' | 'datetime' | 'boolean' | 'array';

export async function createCustomField(opts: {
  caption: string;
  type: CustomFieldType;
  description?: string;
}): Promise<{ id: number; caption: string; type: CustomFieldType }> {
  return callManyChat<{ id: number; caption: string; type: CustomFieldType }>(
    '/fb/page/createCustomField',
    {
      caption: opts.caption,
      type: opts.type,
      description: opts.description ?? '',
    },
  );
}

// ---------------- Send Flow ----------------

export async function sendFlowToSubscriber(opts: {
  subscriberId: number | string;
  flowNs: string;
}): Promise<void> {
  await callManyChat<unknown>('/fb/sending/sendFlow', {
    subscriber_id: opts.subscriberId,
    flow_ns: opts.flowNs,
  });
}

// ---------------- Wrapper: bootstrap a brief in ManyChat ----------------

/**
 * Best-effort bootstrap: ensures Tag exists, ensures Custom Field `bot_brief_id`
 * exists. Returns warnings rather than throwing — Mark Live shouldn't fail
 * just because Tag already exists.
 */
export async function bootstrapBriefInManyChat(opts: {
  tagName: string;
}): Promise<{ ok: boolean; warnings: string[] }> {
  const warnings: string[] = [];

  try {
    await createTag(opts.tagName);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!/already exists|duplicate/i.test(msg)) {
      warnings.push(`createTag: ${msg}`);
    }
  }

  try {
    await createCustomField({
      caption: 'bot_brief_id',
      type: 'text',
      description: 'Internal brief ID for analytics correlation',
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!/already exists|duplicate/i.test(msg)) {
      warnings.push(`createCustomField: ${msg}`);
    }
  }

  return { ok: warnings.length === 0, warnings };
}
