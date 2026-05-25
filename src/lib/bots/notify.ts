/**
 * Notify Nitzan when a new brief is submitted. Two channels:
 *  - Brevo transactional email (always on).
 *  - Make.com webhook for WhatsApp (only if MAKE_WHATSAPP_WEBHOOK_URL is set).
 *
 * Both are best-effort: a failure does not roll back the submit transaction;
 * the caller decides whether to retry. The brief stays 'submitted' in either
 * case so Nitzan can fetch it via the admin UI.
 */

import { BotBriefRow, BRIEF_TYPE_LABEL, POST_SCOPE_LABEL } from './schema';

const BREVO_API_BASE = 'https://api.brevo.com/v3';

function adminEmail(): string {
  return process.env.BOTS_NOTIFY_TO_EMAIL ?? 'nitzandaphna@gmail.com';
}

function senderEmail(): { name: string; email: string } {
  return {
    name: process.env.BREVO_SENDER_NAME ?? 'מנופאוזית וטוב לה',
    email: process.env.BREVO_SENDER_EMAIL ?? 'noreply@gilhameever.com',
  };
}

export type NotifyPayload = {
  brief: BotBriefRow;
  subject: string;
  htmlBody: string;
  markdownBody: string;
  appBaseUrl: string;
};

export type NotifyResult = {
  email: { ok: boolean; error?: string; messageId?: string };
  whatsapp: { ok: boolean; error?: string; skipped?: boolean };
};

export async function notifyBriefSubmitted(payload: NotifyPayload): Promise<NotifyResult> {
  const [email, whatsapp] = await Promise.all([
    sendEmailViaBrevo(payload),
    sendWhatsAppViaMake(payload),
  ]);
  return { email, whatsapp };
}

// ---------------- Email (Brevo transactional) ----------------

async function sendEmailViaBrevo(payload: NotifyPayload): Promise<NotifyResult['email']> {
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    return { ok: false, error: 'BREVO_API_KEY missing' };
  }

  const sender = senderEmail();
  const to = adminEmail();

  try {
    const res = await fetch(`${BREVO_API_BASE}/smtp/email`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': key,
      },
      body: JSON.stringify({
        sender,
        to: [{ email: to, name: 'ניצן' }],
        subject: payload.subject,
        htmlContent: payload.htmlBody,
        tags: ['bot-brief', `type-${payload.brief.type}`],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Brevo ${res.status}: ${text.slice(0, 200)}` };
    }
    const data = (await res.json()) as { messageId?: string };
    return { ok: true, messageId: data.messageId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

// ---------------- WhatsApp (Make.com webhook) ----------------

async function sendWhatsAppViaMake(payload: NotifyPayload): Promise<NotifyResult['whatsapp']> {
  const webhookUrl = process.env.MAKE_WHATSAPP_WEBHOOK_URL;
  if (!webhookUrl) {
    return { ok: true, skipped: true };
  }

  const text = buildWhatsAppText(payload);

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        event: 'bot_brief_submitted',
        brief_id: payload.brief.id,
        title: payload.brief.title,
        type: payload.brief.type,
        type_label: BRIEF_TYPE_LABEL[payload.brief.type],
        text,
        admin_url: `${payload.appBaseUrl}/admin/bots/${payload.brief.id}`,
      }),
    });
    if (!res.ok) {
      return { ok: false, error: `Make.com ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

function buildWhatsAppText(payload: NotifyPayload): string {
  const { brief, appBaseUrl } = payload;
  const lines = [
    `🤖 בריף בוט חדש מענבל`,
    `${BRIEF_TYPE_LABEL[brief.type]}: ${brief.title}`,
    '',
    `פתח כאן: ${appBaseUrl}/admin/bots/${brief.id}`,
  ];
  return lines.join('\n');
}

// ============================================================================
// notifyBriefLive — fires when Nitzan marks a brief Live
// ============================================================================
// Notifies the brief creator (Inbal) that her bot is up:
//   - email via Brevo to her primary email
//   - WhatsApp via Make.com webhook (if MAKE_WHATSAPP_WEBHOOK_URL is set and a
//     phone is on file)
// ============================================================================

export type LiveNotifyPayload = {
  brief: BotBriefRow;
  creatorEmail: string | null;
  creatorName: string | null;
  creatorPhone: string | null;
  manychatFlowId: string;
  appBaseUrl: string;
};

export type LiveNotifyResult = {
  email: { ok: boolean; error?: string; messageId?: string; skipped?: boolean };
  whatsapp: { ok: boolean; error?: string; skipped?: boolean };
};

export async function notifyBriefLive(payload: LiveNotifyPayload): Promise<LiveNotifyResult> {
  const [email, whatsapp] = await Promise.all([
    sendLiveEmail(payload),
    sendLiveWhatsApp(payload),
  ]);
  return { email, whatsapp };
}

async function sendLiveEmail(payload: LiveNotifyPayload): Promise<LiveNotifyResult['email']> {
  if (!payload.creatorEmail) {
    return { ok: true, skipped: true };
  }
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    return { ok: false, error: 'BREVO_API_KEY missing' };
  }

  const sender = senderEmail();
  const html = renderLiveEmailHtml(payload);

  try {
    const res = await fetch(`${BREVO_API_BASE}/smtp/email`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': key,
      },
      body: JSON.stringify({
        sender,
        to: [{ email: payload.creatorEmail, name: payload.creatorName ?? 'ענבל' }],
        subject: `✨ הבוט שלך פעיל: ${payload.brief.title}`,
        htmlContent: html,
        tags: ['bot-brief-live', `type-${payload.brief.type}`],
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Brevo ${res.status}: ${text.slice(0, 200)}` };
    }
    const data = (await res.json()) as { messageId?: string };
    return { ok: true, messageId: data.messageId };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

async function sendLiveWhatsApp(payload: LiveNotifyPayload): Promise<LiveNotifyResult['whatsapp']> {
  const webhookUrl = process.env.MAKE_WHATSAPP_WEBHOOK_URL;
  if (!webhookUrl) {
    return { ok: true, skipped: true };
  }
  if (!payload.creatorPhone) {
    return { ok: true, skipped: true };
  }

  const text = buildLiveWhatsAppText(payload);

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        event: 'bot_brief_live',
        brief_id: payload.brief.id,
        title: payload.brief.title,
        type: payload.brief.type,
        type_label: BRIEF_TYPE_LABEL[payload.brief.type],
        recipient_name: payload.creatorName,
        recipient_phone: payload.creatorPhone,
        text,
        admin_url: `${payload.appBaseUrl}/admin/bots/${payload.brief.id}`,
      }),
    });
    if (!res.ok) {
      return { ok: false, error: `Make.com ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

function buildLiveWhatsAppText(payload: LiveNotifyPayload): string {
  const { brief } = payload;
  const scope =
    brief.type === 'comment_to_dm' ? `\nהיקף: ${POST_SCOPE_LABEL[brief.post_scope]}` : '';
  return [
    `✨ הבוט שלך חי!`,
    `${BRIEF_TYPE_LABEL[brief.type]}: ${brief.title}${scope}`,
    '',
    `כל מי שיגיב/יענה לפי ההגדרות יקבל את ה-DM אוטומטית.`,
  ].join('\n');
}

function renderLiveEmailHtml(payload: LiveNotifyPayload): string {
  const { brief, creatorName, appBaseUrl } = payload;
  const briefUrl = `${appBaseUrl}/admin/bots/${brief.id}`;
  const scopeLine =
    brief.type === 'comment_to_dm'
      ? `<p style="margin:0 0 6px;font-size:14px;color:#555;"><strong>היקף:</strong> ${POST_SCOPE_LABEL[brief.post_scope]}</p>`
      : '';
  const postLine =
    brief.type === 'comment_to_dm' && brief.post_scope === 'specific_post' && brief.post_url
      ? `<p style="margin:0 0 6px;font-size:14px;color:#555;"><strong>פוסט:</strong> <a href="${brief.post_url}" style="color:#9d4edd;">${brief.post_url}</a></p>`
      : '';

  return `
<div dir="rtl" style="font-family:'Assistant','Segoe UI',Arial,sans-serif;background:#FAFAFA;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #eee;text-align:right;">
    <p style="margin:0 0 6px;font-size:13px;color:#9d4edd;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;">✨ הבוט שלך פעיל</p>
    <h1 style="margin:0 0 4px;font-size:24px;color:#1A1A1A;">${creatorName ?? 'ענבל'}, הכל מוכן</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#666;line-height:1.7;">
      הבוט "${brief.title}" עלה לאוויר. מהרגע הזה כל מי שיעמוד בקריטריונים שהגדרת מקבל את ה-DM אוטומטית.
    </p>

    <div style="background:#FAFAFA;border-right:3px solid #9d4edd;padding:14px 18px;border-radius:0 8px 8px 0;margin:0 0 24px;">
      <p style="margin:0 0 6px;font-size:14px;color:#555;"><strong>סוג:</strong> ${BRIEF_TYPE_LABEL[brief.type]}</p>
      ${scopeLine}
      ${postLine}
    </div>

    <p style="margin:0 0 12px;font-size:14px;color:#555;">
      רוצה לראות את ההגדרות המלאות או לבדוק שהכל בסדר?
    </p>
    <p style="margin:0 0 0;">
      <a href="${briefUrl}" style="display:inline-block;background:#9d4edd;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-size:14px;">פתחי את הבריף בפאנל</a>
    </p>

    <hr style="border:none;border-top:1px solid #eee;margin:28px 0;" />
    <p style="margin:0;font-size:12px;color:#999;">
      מנופאוזית וטוב לה · gilhameever.com
    </p>
  </div>
</div>`.trim();
}
