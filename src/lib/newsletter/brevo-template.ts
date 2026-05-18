/**
 * Push a newsletter draft to Brevo as a transactional template.
 *
 * Visual DNA modeled on Nitzan's hand-crafted "מנופאוזית וטוב לה" template:
 *   - 100% width table-based layout (email-client safe, no flex/grid)
 *   - Pink→purple gradient header banner with brand mark (subject lives in the
 *     Brevo subject line, NOT inside the header — keep header tight & branded)
 *   - White section blocks, large readable RTL paragraphs (17px / 1.9 line-height)
 *   - Highlight blocks (gradient gold) for quoted/emphasized paragraphs
 *   - Personalised greeting using `{{ contact.FIRSTNAME }}` (Brevo merge tag)
 *   - Signature + dark footer with brand mark and unsubscribe link
 *
 * Body content rules (applied to `bodyText` from the editor):
 *   - Paragraphs separated by blank line
 *   - Lines inside a paragraph render with <br> (mirrors the editor preview)
 *   - A paragraph whose lines all start with `> ` becomes a gold highlight box
 *   - A paragraph whose lines all start with `- ` becomes a bullet-style block
 *
 * Brevo wants raw HTML, not MJML.
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

export type TemplatePayload = {
  subject: string;
  bodyText: string;
  templateName?: string;
  headerImageUrl?: string | null;
};

type SyncResult = { templateId: number; action: 'created' | 'updated' };

// ---------- HTML rendering ----------

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const PARA_STYLE =
  "margin: 0; padding: 0; font-size: 17px; color: #1A1A1A; line-height: 1.9; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif; text-align: right;";

const HIGHLIGHT_STYLE =
  "margin: 0; padding: 16px 20px; font-size: 17px; color: #1A1A1A; line-height: 1.9; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif; text-align: right; background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.25) 100%); border-radius: 12px; font-weight: 700;";

function sectionRow(innerHtml: string, opts?: { tinted?: boolean }): string {
  const bg = opts?.tinted
    ? 'background: linear-gradient(135deg, rgba(255, 0, 128, 0.08) 0%, rgba(157, 78, 221, 0.08) 100%);'
    : 'background-color: #FFFFFF;';
  return `
            <tr>
              <td style="padding: 30px 24px; ${bg}">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr><td>${innerHtml}</td></tr>
                </table>
              </td>
            </tr>`;
}

/**
 * Defensive: strip a leading greeting block ("היי חברה,") and a trailing
 * signature block ("חיבוק,\nענבל 💗") from the body before the template wrapper
 * injects its own. The AI prompt instructs Claude not to write either, but
 * legacy drafts and occasional regressions still slip through — without this
 * strip both render twice in the final email.
 *
 * Conservative rules:
 *   - Greeting: a block whose first line starts with "היי" or "שלום" and is
 *     <= 40 chars. Only that opening line is removed (the rest of the block,
 *     if any, stays).
 *   - Signature: a tail block <= 120 chars that contains BOTH a closing word
 *     (חיבוק/באהבה/בברכה/שלך/תודה) AND "ענבל".
 */
function stripDuplicateGreetingSignature(text: string): string {
  const blocks = text
    .split(/\n{2,}/)
    .map((b) => b.replace(/\s+$/g, ''));

  if (blocks.length > 0) {
    const lines = blocks[0].split('\n');
    const firstLine = lines[0].trim();
    if (/^(היי|שלום)[\s,].{0,40}$/.test(firstLine)) {
      lines.shift();
      while (lines.length > 0 && lines[0].trim() === '') lines.shift();
      if (lines.length === 0) {
        blocks.shift();
      } else {
        blocks[0] = lines.join('\n');
      }
    }
  }

  if (blocks.length > 0) {
    const last = blocks[blocks.length - 1];
    const compact = last.replace(/\s+/g, ' ').trim();
    const hasCloser = /(חיבוק|באהבה|בברכה|שלך|תודה)/.test(compact);
    const hasName = /ענבל/.test(compact);
    if (hasCloser && hasName && compact.length <= 120) {
      blocks.pop();
    }
  }

  return blocks.join('\n\n');
}

function renderBodyBlocks(text: string): string {
  const blocks = text
    .split(/\n{2,}/)
    .map((b) => b.replace(/\s+$/g, ''))
    .filter((b) => b.trim().length > 0);

  return blocks
    .map((block) => {
      const lines = block.split('\n');
      const allQuote = lines.every((l) => /^\s*>\s+/.test(l));
      const allBullet = lines.every((l) => /^\s*-\s+/.test(l));

      if (allQuote) {
        const inner = lines
          .map((l) => escapeHtml(l.replace(/^\s*>\s+/, '')))
          .join('<br>');
        return sectionRow(`<p style="${HIGHLIGHT_STYLE}">${inner}</p>`);
      }

      if (allBullet) {
        const inner = lines
          .map((l) => `• ${escapeHtml(l.replace(/^\s*-\s+/, ''))}`)
          .join('<br>');
        return sectionRow(`<p style="${PARA_STYLE}">${inner}</p>`);
      }

      const inner = lines.map((l) => escapeHtml(l)).join('<br>');
      return sectionRow(`<p style="${PARA_STYLE}">${inner}</p>`);
    })
    .join('');
}

export type BuildEmailOptions = {
  /**
   * When set, the Brevo Liquid greeting block (`{% if contact.FIRSTNAME %}...`)
   * is replaced with a literal greeting suitable for in-browser preview, and
   * the `{{ unsubscribe }}` link is swapped for a `#` placeholder. Pass an empty
   * string to see the no-name fallback ("היי,").
   *
   * Leave undefined when syncing to Brevo — Brevo needs the Liquid tags intact
   * so it can personalize per recipient at send time.
   */
  previewFirstName?: string;
};

export function buildEmailHtml(
  subject: string,
  bodyText: string,
  headerImageUrl?: string | null,
  opts?: BuildEmailOptions,
): string {
  const safeSubject = escapeHtml(subject);
  const cleanBody = stripDuplicateGreetingSignature(bodyText);
  const bodyHtml = renderBodyBlocks(cleanBody);
  const isPreview = opts?.previewFirstName !== undefined;

  // Optional editorial image row sitting between the brand banner and the
  // greeting. `object-fit: cover` keeps composition sane across email clients
  // that respect it; Outlook will just letterbox/scale, which is acceptable.
  const headerImageRow = headerImageUrl
    ? `
          <tr>
            <td style="padding: 0; line-height: 0; font-size: 0;">
              <img src="${escapeHtml(headerImageUrl)}" alt="" width="100%" style="display: block; width: 100%; max-width: 100%; height: auto; max-height: 280px; object-fit: cover; border: 0; outline: none; text-decoration: none;" />
            </td>
          </tr>`
    : '';

  // Brevo Liquid syntax: if the contact has a FIRSTNAME, address her by name;
  // otherwise fall back to a clean "היי," without the trailing comma+space
  // collision that an empty {{ contact.FIRSTNAME }} would create.
  // For previews, swap the Liquid block with a literal greeting.
  const greetingText = isPreview
    ? (opts!.previewFirstName!.trim().length > 0
        ? `היי ${escapeHtml(opts!.previewFirstName!.trim())},`
        : 'היי,')
    : `{% if contact.FIRSTNAME and contact.FIRSTNAME != "" %}היי {{ contact.FIRSTNAME }},{% else %}היי,{% endif %}`;
  const greeting = sectionRow(`
                  <p style="margin: 0 0 6px 0; padding: 0; font-size: 18px; color: #1A1A1A; line-height: 1.9; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif; text-align: right; font-weight: 500;">
                    ${greetingText}
                  </p>`);

  const unsubscribeHref = isPreview ? '#' : '{{ unsubscribe }}';

  const signature = sectionRow(`
                  <p style="margin: 0; padding: 0; font-size: 18px; color: #1A1A1A; line-height: 1.9; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif; text-align: right; font-weight: 500;">
                    חיבוק,<br>
                    <span style="color: #FF0080; font-weight: 700;">ענבל 💗</span>
                  </p>`);

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${safeSubject}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700&display=swap" rel="stylesheet">
  <!--[if mso]>
  <style type="text/css">body, table, td { font-family: Arial, sans-serif !important; }</style>
  <![endif]-->
  <style>
    body, p, h1, h2, h3, div, span { direction: rtl; text-align: right; unicode-bidi: embed; }
    * { unicode-bidi: embed; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F5F5; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif; direction: rtl; text-align: right;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F5F5F5;">
    <tr>
      <td align="center" style="padding: 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="width: 100%; max-width: 640px; background-color: #FFFFFF; margin: 0 auto;">

          <!-- HEADER -->
          <tr>
            <td style="padding: 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="background: linear-gradient(135deg, #FF0080 0%, #9D4EDD 100%); padding: 30px 24px; text-align: center;">
                    <!--[if mso]>
                    <td style="background-color: #FF0080; padding: 30px 24px; text-align: center;">
                    <![endif]-->
                    <h1 style="margin: 0; padding: 0; font-size: 32px; font-weight: 700; color: #FFFFFF; line-height: 1.3; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);">
                      🌸 מנופאוזית וטוב לה
                    </h1>
                    <!--[if mso]></td><![endif]-->
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${headerImageRow}
          ${greeting}
          ${bodyHtml}
          ${signature}

          <!-- FOOTER -->
          <tr>
            <td style="padding: 30px 24px; background-color: #1A1A1A; text-align: center;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding-bottom: 16px;">
                    <p style="margin: 0; padding: 0; font-size: 18px; font-weight: 700; color: #FF0080; line-height: 1.3; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif;">
                      מנופאוזית וטוב לה
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 20px;">
                    <p style="margin: 0; padding: 0; font-size: 14px; color: #FFFFFF; line-height: 1.6; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif;">
                      קהילה של נשים שמבינות שגיל המעבר זה לא הסוף, זו התחלה חדשה
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.2);">
                    <p style="margin: 0; padding: 0; font-size: 12px; color: rgba(255, 255, 255, 0.6); line-height: 1.6; font-family: 'Assistant', 'Segoe UI', Arial, sans-serif;">
                      אם אינך מעוניינת לקבל עוד מיילים מאיתנו, תוכלי <a href="${unsubscribeHref}" style="color: #FF0080; text-decoration: underline;">לבטל את המנוי כאן</a>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildBrevoBody({ subject, bodyText, templateName, headerImageUrl }: TemplatePayload) {
  return {
    templateName: templateName ?? (subject.slice(0, 80) || 'newsletter draft'),
    subject,
    htmlContent: buildEmailHtml(subject, bodyText, headerImageUrl),
    sender: {
      name: process.env.BREVO_FROM_NAME || 'ענבל - מנופאוזית וטוב לה',
      email: process.env.BREVO_FROM_EMAIL || 'inbal@gilhameever.com',
    },
    isActive: true,
    tag: 'gilhameever-newsletter',
  };
}

export async function syncTemplateToBrevo(
  existingId: number | null,
  payload: TemplatePayload,
): Promise<SyncResult> {
  const body = JSON.stringify(buildBrevoBody(payload));

  if (existingId) {
    const res = await fetch(`${BREVO_API_BASE}/smtp/templates/${existingId}`, {
      method: 'PUT',
      headers: brevoHeaders(),
      body,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`brevo PUT failed (${res.status}): ${text.slice(0, 300)}`);
    }
    return { templateId: existingId, action: 'updated' };
  }

  const res = await fetch(`${BREVO_API_BASE}/smtp/templates`, {
    method: 'POST',
    headers: brevoHeaders(),
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`brevo POST failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const json = (await res.json()) as { id?: number };
  if (typeof json.id !== 'number') {
    throw new Error(`brevo POST returned no id: ${JSON.stringify(json).slice(0, 300)}`);
  }
  return { templateId: json.id, action: 'created' };
}

/**
 * Send a test copy of a Brevo transactional template to a list of recipients.
 *
 * Uses `/smtp/email` (sendTransacEmail) instead of `/smtp/templates/{id}/sendTest`
 * because `sendTest` only accepts addresses that already exist as Brevo contacts
 * — that breaks our use case where admins want to receive tests at admin/sender
 * addresses that we deliberately don't put in the subscriber list.
 *
 * `sendTransacEmail` with `templateId` renders the exact same stored HTML. For
 * recipients who happen to be contacts, `{{ contact.FIRSTNAME }}` still resolves
 * from the contact record. For unknown emails, the Liquid `{% if %}` falls back
 * to "היי," — which is what we want for admin previews.
 *
 * Brevo returns 201 with a `messageId` on success.
 */
export async function sendTemplateTest(
  templateId: number,
  emails: string[],
): Promise<void> {
  const res = await fetch(`${BREVO_API_BASE}/smtp/email`, {
    method: 'POST',
    headers: brevoHeaders(),
    body: JSON.stringify({
      templateId,
      to: emails.map((email) => ({ email })),
      tags: ['gilhameever-newsletter-test'],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`brevo sendTransacEmail failed (${res.status}): ${text.slice(0, 300)}`);
  }
}
