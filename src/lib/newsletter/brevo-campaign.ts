/**
 * Brevo email campaigns helper.
 *
 * Used by the broadcast feature (send-now / schedule). Each draft already has
 * a `brevo_template_id` (pushed via brevo-template.ts) — a campaign is created
 * that references that template + the master list, then sent or scheduled.
 *
 * Docs: https://developers.brevo.com/reference/createemailcampaign
 */

const BREVO_API_BASE = 'https://api.brevo.com/v3';

function brevoHeaders(): HeadersInit {
  const key = process.env.BREVO_API_KEY;
  if (!key) throw new Error('BREVO_API_KEY missing');
  return {
    accept: 'application/json',
    'content-type': 'application/json',
    'api-key': key,
  };
}

export type CreateCampaignInput = {
  templateId: number;
  subject: string;
  campaignName: string;
  listIds: number[];
  scheduledAt?: string | null;
};

export async function createCampaign(
  input: CreateCampaignInput,
): Promise<{ campaignId: number }> {
  const payload: Record<string, unknown> = {
    name: input.campaignName,
    subject: input.subject,
    templateId: input.templateId,
    sender: {
      name: process.env.BREVO_FROM_NAME || 'ענבל - מנופאוזית וטוב לה',
      email: process.env.BREVO_FROM_EMAIL || 'inbal@gilhameever.com',
    },
    recipients: { listIds: input.listIds },
  };
  if (input.scheduledAt) {
    payload.scheduledAt = input.scheduledAt;
  }

  const res = await fetch(`${BREVO_API_BASE}/emailCampaigns`, {
    method: 'POST',
    headers: brevoHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`brevo createCampaign failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const json = (await res.json()) as { id?: number };
  if (typeof json.id !== 'number') {
    throw new Error(`brevo createCampaign returned no id: ${JSON.stringify(json).slice(0, 200)}`);
  }
  return { campaignId: json.id };
}

export async function sendCampaignNow(campaignId: number): Promise<void> {
  const res = await fetch(
    `${BREVO_API_BASE}/emailCampaigns/${campaignId}/sendNow`,
    { method: 'POST', headers: brevoHeaders() },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`brevo sendNow failed (${res.status}): ${text.slice(0, 300)}`);
  }
}

export type BrevoCampaignSnapshot = {
  status: string; // 'draft' | 'scheduled' | 'sent' | 'inProcess' | 'suspended' | 'queued' | 'archived' ...
  sentDate: string | null;
  scheduledAt: string | null;
};

export async function getCampaign(campaignId: number): Promise<BrevoCampaignSnapshot> {
  const res = await fetch(`${BREVO_API_BASE}/emailCampaigns/${campaignId}`, {
    headers: brevoHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`brevo getCampaign failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const json = (await res.json()) as {
    status?: string;
    sentDate?: string;
    scheduledAt?: string;
  };
  return {
    status: json.status ?? 'unknown',
    sentDate: json.sentDate ?? null,
    scheduledAt: json.scheduledAt ?? null,
  };
}

export async function cancelScheduledCampaign(campaignId: number): Promise<void> {
  // Cancelling a scheduled Brevo campaign = updating its status to "suspended"
  // (the API doesn't expose a hard "cancel" verb; suspended stops the send).
  // https://developers.brevo.com/reference/updatecampaignstatus
  const res = await fetch(
    `${BREVO_API_BASE}/emailCampaigns/${campaignId}/status`,
    {
      method: 'PUT',
      headers: brevoHeaders(),
      body: JSON.stringify({ status: 'suspended' }),
    },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`brevo cancel failed (${res.status}): ${text.slice(0, 300)}`);
  }
}
