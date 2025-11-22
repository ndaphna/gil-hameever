/**
 * ========================================
 * EMAIL TEMPLATES
 * ========================================
 * 
 * Centralized email template generator
 */

import { getAbsoluteUrl, siteUrls } from './urls';
import type { EmailTemplateData } from '@/types/lead-magnet';

// ========================================
// EMAIL STYLES
// ========================================

const emailStyles = `
  /* Reset & Base */
  body {
    font-family: 'Assistant', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    line-height: 1.8;
    color: #1A1A1A;
    background: #F5F5F5;
    margin: 0;
    padding: 0;
    direction: rtl;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background: #FFFFFF;
  }
  
  .header {
    text-align: center;
    padding: 32px 20px;
    background: linear-gradient(135deg, rgba(255,0,128,0.1) 0%, rgba(157,78,221,0.1) 100%);
    border-radius: 20px;
    margin-bottom: 24px;
  }
  
  .header h1 {
    font-size: 28px;
    font-weight: 700;
    color: #1A1A1A;
    margin: 0 0 12px;
    line-height: 1.4;
  }
  
  .header .emoji {
    font-size: 48px;
    display: block;
    margin-bottom: 16px;
  }
  
  .content {
    background: #FFFFFF;
    padding: 24px 20px;
    border-radius: 12px;
    margin-bottom: 20px;
    text-align: right;
  }
  
  .content p {
    font-size: 17px;
    line-height: 1.8;
    margin: 0 0 16px;
    color: #1A1A1A;
    text-align: right;
  }
  
  .highlight {
    color: #FF0080;
    font-weight: 700;
  }
  
  .gift-section {
    background: linear-gradient(135deg, rgba(255, 242, 250, 0.8) 0%, rgba(255, 235, 248, 0.6) 100%);
    padding: 28px 20px;
    border-radius: 16px;
    text-align: center;
    margin: 24px 0;
    border: 2px solid rgba(255, 0, 128, 0.15);
  }
  
  .gift-section h2 {
    font-size: 22px;
    font-weight: 700;
    color: #1A1A1A;
    margin: 0 0 12px;
    line-height: 1.4;
  }
  
  .gift-section .emoji {
    font-size: 48px;
    display: block;
    margin-bottom: 12px;
  }
  
  .gift-section p {
    font-size: 16px;
    line-height: 1.7;
    color: #1A1A1A;
    text-align: center;
    margin: 12px 0;
  }
  
  .cta-button {
    display: inline-block;
    padding: 16px 32px;
    background: linear-gradient(135deg, #FF0080 0%, #9D4EDD 100%);
    color: #FFFFFF !important;
    text-decoration: none;
    border-radius: 30px;
    font-size: 18px;
    font-weight: 700;
    margin: 20px 0;
    box-shadow: 0 4px 16px rgba(255, 0, 128, 0.3);
    text-align: center;
    width: 100%;
    max-width: 320px;
    box-sizing: border-box;
  }
  
  .footer {
    text-align: center;
    padding: 20px;
    font-size: 14px;
    color: #666666;
    border-top: 1px solid rgba(255, 0, 128, 0.1);
    margin-top: 32px;
  }
  
  .footer p {
    margin: 8px 0;
    text-align: center;
  }
  
  .footer a {
    color: #FF0080;
    text-decoration: none;
  }
  
  .signature {
    font-size: 18px;
    font-weight: 600;
    color: #FF0080;
    margin-top: 20px;
    text-align: right;
  }
  
  /* Mobile Responsive */
  @media only screen and (max-width: 600px) {
    .container { padding: 16px; }
    .header { padding: 24px 16px; border-radius: 16px; }
    .header h1 { font-size: 24px; }
    .header .emoji { font-size: 40px; }
    .content { padding: 20px 16px; }
    .content p { font-size: 16px; }
    .gift-section { padding: 24px 16px; border-radius: 12px; }
    .gift-section h2 { font-size: 20px; }
    .gift-section .emoji { font-size: 40px; }
    .cta-button { padding: 14px 24px; font-size: 16px; width: 100%; }
    .signature { font-size: 16px; }
  }
  
  /* Dark Mode Support */
  @media (prefers-color-scheme: dark) {
    body { background: #1A1A1A; }
    .container { background: #2A2A2A; }
    .content { background: #2A2A2A; }
  }
`;

// ========================================
// LEAD GIFT EMAIL TEMPLATE
// ========================================

export function generateLeadGiftEmail(data: EmailTemplateData): string {
  const { firstName, giftUrl, instagramUrl } = data;

  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>המתנה שלך ממנופאוזית וטוב לה</title>
  <style>${emailStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="emoji">🎁</span>
      <h1>היי ${firstName}! המתנה שלך כאן 🌸</h1>
    </div>

    <div class="content">
      <p>שמחה שהצטרפת אלינו!</p>
      <p>
        כמו שהבטחתי, הנה <span class="highlight">המתנה המיוחדת</span> שלך - 
        ממש כאן, בדוא״ל הזה.
      </p>
      <p>
        זה המקום שלנו - <span class="highlight">מנופאוזית וטוב לה</span> - 
        קהילה של נשים שמבינות שגיל המעבר זה לא הסוף, זו התחלה חדשה.
      </p>
    </div>

    <div class="gift-section">
      <span class="emoji">🗺️</span>
      <h2>🌸 מפת החירום: מה לעזאזל קורה לי</h2>
      <p style="font-size: 18px; line-height: 1.7; color: #1A1A1A;">
        המדריך שיעשה לך סוף־סוף סדר בראש, בגוף ובנשמה
        <br />
        <strong>ב־10 דקות בלבד שיחזירו לך שליטה</strong>
      </p>
      <a href="${giftUrl}" class="cta-button">🎁 לחצי כאן לקריאת המדריך</a>
    </div>

    <div class="content">
      <p>אני כאן בשבילך - בכל שאלה, ספק או רצון לשתף.</p>
      <p>תשובותיי מגיעות ישירות מהלב (וגם עם מעט הומור 😊).</p>
      <p style="margin-top: 24px;">
        📸 <strong>בואי נישאר בקשר!</strong><br>
        עקבי אחרי באינסטגרם לתוכן יומיומי, טיפים ושיחות כנות על גיל המעבר:<br>
        <a href="${instagramUrl}" style="color: #FF0080; font-weight: 600; text-decoration: none;">
          @inbal_daphna
        </a>
      </p>
      <p class="signature">
        באהבה,<br>
        ענבל דפנה 💗
      </p>
    </div>

    <div class="footer">
      <p>קיבלת את המייל הזה כי הצטרפת לרשימת הדיוור של מנופאוזית וטוב לה</p>
      <p>
        <a href="#">ביטול מנוי</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// ========================================
// EMAIL GENERATOR HELPER
// ========================================

export function createLeadGiftEmailContent(
  firstName: string,
  lastName: string
): { subject: string; html: string } {
  const giftUrl = getAbsoluteUrl('/emergency-map');
  const instagramUrl = siteUrls.instagram;

  return {
    subject: '🎁 המתנה שלך ממנופאוזית וטוב לה',
    html: generateLeadGiftEmail({
      firstName,
      lastName,
      giftUrl,
      instagramUrl,
    }),
  };
}
