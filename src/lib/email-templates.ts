/**
 * תבניות מייל בעברית עבור התראות חכמות
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export function createInsightEmail(
  userName: string,
  insight: {
    type: string;
    title: string;
    message: string;
    actionUrl?: string;
  }
): EmailTemplate {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gilhameever.com';
  const actionButton = insight.actionUrl
    ? `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 32px 0;">
        <tr>
          <td align="center" style="background: #ff0080; border-radius: 8px;">
            <a href="${baseUrl}${insight.actionUrl}" 
               style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; border-radius: 8px;">
              לפרטים נוספים →
            </a>
          </td>
        </tr>
      </table>
    `
    : '';

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${insight.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Assistant', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ff0080 0%, #8000ff 100%); padding: 40px 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                🌸 מנופאוזית וטוב לה
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 24px 0; color: #333333; font-size: 24px; font-weight: 700; text-align: right;">
                שלום ${userName || 'יקרה'} 👋
              </h2>
              
              <div style="background: #f8f9ff; border-right: 4px solid #ff0080; padding: 24px; border-radius: 8px; margin: 24px 0;">
                <h3 style="margin: 0 0 16px 0; color: #ff0080; font-size: 20px; font-weight: 700; text-align: right;">
                  ${insight.title}
                </h3>
                <p style="margin: 0; color: #555555; font-size: 16px; line-height: 1.8; text-align: right;">
                  ${insight.message}
                </p>
              </div>

              ${actionButton}

              <p style="margin: 32px 0 0 0; color: #888888; font-size: 14px; line-height: 1.6; text-align: right;">
                💡 <strong>טיפ:</strong> ככל שתמלאי יותר את היומן, כך אוכל לתת לך תובנות מדויקות יותר ומעודכנות.
              </p>

              <div style="margin-top: 40px; padding-top: 32px; border-top: 1px solid #e5e5e5;">
                <p style="margin: 0; color: #888888; font-size: 14px; text-align: center; line-height: 1.6;">
                  עם אהבה,<br>
                  <strong style="color: #ff0080;">עליזה</strong> 💙
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f8f9ff; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #888888; font-size: 12px;">
                את תמיד יכולה לשנות את העדפות ההתראות שלך ב<a href="${baseUrl}/profile" style="color: #ff0080; text-decoration: none;">הפרופיל שלך</a>
              </p>
              <p style="margin: 0; color: #aaaaaa; font-size: 11px;">
                © ${new Date().getFullYear()} מנופאוזית וטוב לה. כל הזכויות שמורות.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
שלום ${userName || 'יקרה'},

${insight.title}

${insight.message}

${insight.actionUrl ? `לפרטים נוספים: ${baseUrl}${insight.actionUrl}` : ''}

עם אהבה,
עליזה 💙

---
את תמיד יכולה לשנות את העדפות ההתראות שלך בפרופיל שלך: ${baseUrl}/profile
  `.trim();

  return {
    subject: insight.title,
    html,
    text
  };
}

