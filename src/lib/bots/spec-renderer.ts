/**
 * Render a brief into the spec sheet that Nitzan reads to build the ManyChat
 * bot. Two outputs: markdown (for chat/Slack/WhatsApp) and HTML (for the
 * notification email).
 */

import {
  BotBriefRow,
  BriefAssetRow,
  BRIEF_TYPE_LABEL,
  POST_SCOPE_LABEL,
} from './schema';

export type SignedAsset = BriefAssetRow & { signed_url: string };

export type SpecInputs = {
  brief: BotBriefRow;
  assets: SignedAsset[];
  creatorName: string | null;
  creatorEmail: string | null;
  brevoTemplateName: string | null;
  appBaseUrl: string;
};

function esc(s: string | null | undefined): string {
  if (!s) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function nl2br(s: string): string {
  return esc(s).replace(/\n/g, '<br>');
}

// ---------------- Markdown ----------------

export function renderSpecMarkdown(input: SpecInputs): string {
  const { brief, assets, creatorName, brevoTemplateName, appBaseUrl } = input;
  const lines: string[] = [];

  lines.push(`# בריף בוט: ${brief.title}`);
  lines.push('');
  lines.push(`**סוג:** ${BRIEF_TYPE_LABEL[brief.type]}`);
  lines.push(`**הוגש על-ידי:** ${creatorName ?? 'לא ידוע'}`);
  lines.push(`**מזהה:** \`${brief.id}\``);
  lines.push(`**לינק לעריכה:** ${appBaseUrl}/admin/bots/${brief.id}`);
  lines.push('');

  if (brief.type === 'comment_to_dm') {
    lines.push('## טריגר');
    lines.push(`- **היקף:** ${POST_SCOPE_LABEL[brief.post_scope]}`);
    if (brief.post_scope === 'specific_post') {
      lines.push(`- **פוסט:** ${brief.post_url ?? '—'}`);
    }
    lines.push(`- **מילות מפתח:** ${(brief.keyword_triggers ?? []).map((k) => `\`${k}\``).join(', ') || '—'}`);
  } else {
    lines.push('## טריגר');
    lines.push(`- **סוג סטורי:** ${brief.type === 'story_reply' ? 'מענה לסטורי' : 'אזכור בסטורי'}`);
    lines.push(`- **תיאור:** ${brief.story_label ?? '—'}`);
  }
  lines.push('');

  lines.push('## הודעת DM');
  lines.push('```');
  lines.push(brief.dm_message ?? '(ריק)');
  lines.push('```');
  lines.push('');

  if (brief.cta_button_text) {
    lines.push('## כפתור CTA ב-DM');
    lines.push(`טקסט הכפתור: **${brief.cta_button_text}**`);
    lines.push('');
  }

  if (brief.lead_magnet_url) {
    lines.push('## Lead magnet (יעד הכפתור)');
    lines.push(brief.lead_magnet_url);
    lines.push('');
  }

  if (assets.length > 0) {
    lines.push('## קבצים מצורפים');
    for (const a of assets) {
      lines.push(`- [${a.filename}](${a.signed_url}) — ${a.kind}, ${formatSize(a.size_bytes)}`);
    }
    lines.push('');
  }

  if (brief.followup_dm_message) {
    lines.push('## תזכורת ב-DM (ManyChat)');
    lines.push(`- **דיליי:** ${brief.followup_dm_delay_minutes} דקות אחרי ה-DM הראשון`);
    lines.push(`- **קונדישן:** שולחים רק למי שלא לחץ על ה-CTA`);
    lines.push('```');
    lines.push(brief.followup_dm_message);
    lines.push('```');
    lines.push('');
  }

  if (brief.followup_enabled) {
    lines.push('## Follow-up אימייל');
    lines.push(`- **טמפלייט Brevo:** ${brevoTemplateName ?? `#${brief.brevo_template_id ?? '?'}`}`);
    lines.push(`- **דיליי:** ${brief.followup_delay_hours} שעות אחרי DM`);
    lines.push('');
  }

  if (brief.notes && brief.notes.trim()) {
    lines.push('## הערות מענבל');
    lines.push(brief.notes);
    lines.push('');
  }

  lines.push('---');
  lines.push('כשתסיים לבנות ב-ManyChat, פתח את הבריף בלינק למעלה ולחץ "Mark Live" + הדבק את ה-flow_id.');

  return lines.join('\n');
}

// ---------------- HTML (for email) ----------------

export function renderSpecHtml(input: SpecInputs): string {
  const { brief, assets, creatorName, brevoTemplateName, appBaseUrl } = input;

  const editUrl = `${appBaseUrl}/admin/bots/${brief.id}`;
  const scopeLine = `<p style="margin:0 0 6px;font-size:14px;color:#555;"><strong>היקף:</strong> ${esc(POST_SCOPE_LABEL[brief.post_scope])}</p>`;
  const postLine =
    brief.post_scope === 'specific_post'
      ? `<p style="margin:0 0 6px;font-size:14px;color:#555;"><strong>פוסט:</strong> ${
          brief.post_url
            ? `<a href="${esc(brief.post_url)}" style="color:#9d4edd;">${esc(brief.post_url)}</a>`
            : '—'
        }</p>`
      : '';
  const triggerSection =
    brief.type === 'comment_to_dm'
      ? `
        <h3 style="margin:24px 0 8px;font-size:16px;color:#1A1A1A;">טריגר</h3>
        ${scopeLine}
        ${postLine}
        <p style="margin:0;font-size:14px;color:#555;"><strong>מילות מפתח:</strong> ${
          (brief.keyword_triggers ?? []).map((k) => `<code style="background:#f5f5f5;padding:2px 6px;border-radius:4px;">${esc(k)}</code>`).join(' ') || '—'
        }</p>`
      : `
        <h3 style="margin:24px 0 8px;font-size:16px;color:#1A1A1A;">טריגר</h3>
        <p style="margin:0 0 6px;font-size:14px;color:#555;"><strong>סוג:</strong> ${
          brief.type === 'story_reply' ? 'מענה לסטורי' : 'אזכור בסטורי'
        }</p>
        <p style="margin:0;font-size:14px;color:#555;"><strong>תיאור:</strong> ${esc(brief.story_label)}</p>`;

  const assetsHtml =
    assets.length > 0
      ? `
        <h3 style="margin:24px 0 8px;font-size:16px;color:#1A1A1A;">קבצים מצורפים</h3>
        <ul style="margin:0;padding:0 18px 0 0;font-size:14px;color:#1A1A1A;">
          ${assets
            .map(
              (a) => `<li style="margin:4px 0;"><a href="${esc(a.signed_url)}" style="color:#9d4edd;">${esc(a.filename)}</a> <span style="color:#999;">— ${esc(a.kind)}, ${formatSize(a.size_bytes)}</span></li>`,
            )
            .join('')}
        </ul>`
      : '';

  const ctaButtonHtml = brief.cta_button_text
    ? `<h3 style="margin:24px 0 8px;font-size:16px;color:#1A1A1A;">כפתור CTA ב-DM</h3>
       <p style="margin:0 0 8px;font-size:14px;color:#555;">טקסט הכפתור: <strong style="color:#1A1A1A;">${esc(brief.cta_button_text)}</strong></p>`
    : '';

  const leadMagnetHtml = brief.lead_magnet_url
    ? `<h3 style="margin:24px 0 8px;font-size:16px;color:#1A1A1A;">Lead magnet (יעד הכפתור)</h3>
       <p style="margin:0;font-size:14px;"><a href="${esc(brief.lead_magnet_url)}" style="color:#9d4edd;">${esc(brief.lead_magnet_url)}</a></p>`
    : '';

  const followupDmHtml = brief.followup_dm_message
    ? `<h3 style="margin:24px 0 8px;font-size:16px;color:#1A1A1A;">תזכורת ב-DM (ManyChat)</h3>
       <p style="margin:0 0 6px;font-size:14px;color:#555;"><strong>דיליי:</strong> ${brief.followup_dm_delay_minutes} דקות · <strong>תנאי:</strong> רק למי שלא לחץ על ה-CTA</p>
       <div style="background:#FAFAFA;border-right:3px solid #f59e0b;padding:14px 18px;font-size:15px;color:#1A1A1A;line-height:1.8;border-radius:0 8px 8px 0;">${nl2br(brief.followup_dm_message)}</div>`
    : '';

  const followupHtml = brief.followup_enabled
    ? `<h3 style="margin:24px 0 8px;font-size:16px;color:#1A1A1A;">Follow-up אימייל</h3>
       <p style="margin:0;font-size:14px;color:#555;"><strong>טמפלייט Brevo:</strong> ${esc(brevoTemplateName) || `#${brief.brevo_template_id ?? '?'}`}</p>
       <p style="margin:0;font-size:14px;color:#555;"><strong>דיליי:</strong> ${brief.followup_delay_hours} שעות אחרי DM</p>`
    : '';

  const notesHtml =
    brief.notes && brief.notes.trim()
      ? `<h3 style="margin:24px 0 8px;font-size:16px;color:#1A1A1A;">הערות מענבל</h3>
         <p style="margin:0;font-size:14px;color:#1A1A1A;line-height:1.7;">${nl2br(brief.notes)}</p>`
      : '';

  return `
<div dir="rtl" style="font-family:'Assistant','Segoe UI',Arial,sans-serif;background:#FAFAFA;padding:24px;">
  <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;border:1px solid #eee;">
    <p style="margin:0 0 6px;font-size:12px;color:#999;text-transform:uppercase;letter-spacing:0.08em;">בריף בוט חדש</p>
    <h1 style="margin:0 0 4px;font-size:24px;color:#1A1A1A;">${esc(brief.title)}</h1>
    <p style="margin:0 0 24px;font-size:14px;color:#666;">
      ${esc(BRIEF_TYPE_LABEL[brief.type])} · הוגש על-ידי ${esc(creatorName)} ·
      <a href="${editUrl}" style="color:#9d4edd;">פתח בפאנל</a>
    </p>

    ${triggerSection}

    <h3 style="margin:24px 0 8px;font-size:16px;color:#1A1A1A;">הודעת DM</h3>
    <div style="background:#FAFAFA;border-right:3px solid #9d4edd;padding:14px 18px;font-size:15px;color:#1A1A1A;line-height:1.8;border-radius:0 8px 8px 0;">
      ${nl2br(brief.dm_message ?? '')}
    </div>

    ${ctaButtonHtml}
    ${leadMagnetHtml}
    ${assetsHtml}
    ${followupDmHtml}
    ${followupHtml}
    ${notesHtml}

    <hr style="border:none;border-top:1px solid #eee;margin:28px 0;" />
    <p style="margin:0;font-size:13px;color:#666;line-height:1.7;">
      כשתסיים לבנות ב-ManyChat — פתח את הבריף ולחץ "Mark Live" + הדבק את ה-Flow ID.
    </p>
    <p style="margin:14px 0 0;">
      <a href="${editUrl}" style="display:inline-block;background:#9d4edd;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-size:14px;">פתח את הבריף</a>
    </p>
  </div>
</div>`.trim();
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
