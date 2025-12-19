/**
 * ========================================
 * LEAD MAGNET API ROUTE - Brevo Integration
 * ========================================
 * 
 * This API route handles:
 * 1. Contact creation/update in Brevo
 * 2. Adding contact to a specific list
 * 3. Sending welcome email with gift
 * 
 * The listId is passed dynamically from the landing page,
 * allowing multiple landing pages to use different Brevo lists.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAbsoluteUrl } from '@/lib/urls';

export const runtime = 'edge';

// ========================================
// VALIDATE ENVIRONMENT VARIABLES
// ========================================
function validateEnvVars(): { valid: boolean; missing: string[] } {
  const required = [
    'BREVO_API_KEY',
    'BREVO_FROM_EMAIL',
    'BREVO_FROM_NAME',
  ];

  const missing = required.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing.join(', '));
    return { valid: false, missing };
  }

  return { valid: true, missing: [] };
}

// ========================================
// BREVO API CLIENT
// ========================================
interface BrevoContactPayload {
  email: string;
  attributes: {
    FIRSTNAME: string;
    LASTNAME: string;
  };
  listIds: number[];
  updateEnabled: boolean;
}

interface BrevoEmailPayload {
  sender: {
    name: string;
    email: string;
  };
  to: Array<{
    email: string;
    name: string;
  }>;
  subject: string;
  htmlContent: string;
}

async function createOrUpdateBrevoContact(
  email: string,
  firstName: string,
  lastName: string,
  listId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: BrevoContactPayload = {
      email,
      attributes: {
        FIRSTNAME: firstName,
        LASTNAME: lastName,
      },
      listIds: [listId],
      updateEnabled: true, // Update if contact already exists
    };

    console.log('📤 Creating/updating Brevo contact:', {
      email,
      firstName,
      lastName,
      listId,
    });

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify(payload),
    });

    console.log('📥 Brevo response status:', response.status, response.statusText);

    // Check if response has content before parsing
    const responseText = await response.text();
    console.log('📥 Brevo response body:', responseText);

    let responseData: any = {};
    
    if (responseText) {
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse Brevo response:', parseError);
        return {
          success: false,
          error: `Invalid response from Brevo: ${responseText.substring(0, 100)}`,
        };
      }
    }

    if (!response.ok) {
      // Contact already exists - this is okay, Brevo will update it
      if (response.status === 400 && responseData.code === 'duplicate_parameter') {
        console.log('✅ Contact already exists, will be updated');
        return { success: true };
      }

      console.error('❌ Brevo API error:', {
        status: response.status,
        data: responseData,
      });

      return {
        success: false,
        error: `Brevo API error: ${responseData.message || response.statusText || 'Unknown error'}`,
      };
    }

    console.log('✅ Brevo contact created/updated successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error creating/updating Brevo contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function sendBrevoEmail(
  email: string,
  firstName: string,
  lastName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const fullName = `${firstName} ${lastName}`.trim();

    // Get the absolute URL for the gift page
    const giftUrl = getAbsoluteUrl('/emergency-map');

    // Email content with gift
    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>המתנה שלך ממנופאוזית וטוב לה</title>
  <style>
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
    
    /* Container - Responsive */
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #FFFFFF;
    }
    
    /* Header */
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
    
    /* Content Sections */
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
    .content p:last-child {
      margin-bottom: 0;
    }
    
    /* Highlight */
    .highlight {
      color: #FF0080;
      font-weight: 700;
    }
    
    /* Gift Section */
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
    
    /* CTA Button - Mobile Optimized */
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
    
    /* Footer */
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
    
    /* Signature */
    .signature {
      font-size: 18px;
      font-weight: 600;
      color: #FF0080;
      margin-top: 20px;
      text-align: right;
    }
    
    /* Mobile Responsive */
    @media only screen and (max-width: 600px) {
      .container {
        padding: 16px;
      }
      .header {
        padding: 24px 16px;
        border-radius: 16px;
      }
      .header h1 {
        font-size: 24px;
      }
      .header .emoji {
        font-size: 40px;
      }
      .content {
        padding: 20px 16px;
      }
      .content p {
        font-size: 16px;
      }
      .gift-section {
        padding: 24px 16px;
        border-radius: 12px;
      }
      .gift-section h2 {
        font-size: 20px;
      }
      .gift-section .emoji {
        font-size: 40px;
      }
      .cta-button {
        padding: 14px 24px;
        font-size: 16px;
        width: 100%;
      }
      .signature {
        font-size: 16px;
      }
    }
    
    /* Dark Mode Support */
    @media (prefers-color-scheme: dark) {
      body {
        background: #1A1A1A;
      }
      .container {
        background: #2A2A2A;
      }
      .content {
        background: #2A2A2A;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="emoji">🎁</span>
      <h1>היי ${firstName}! המתנה שלך כאן 🌸</h1>
    </div>

    <div class="content">
      <p>
        שמחה שהצטרפת אלינו! 
      </p>
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
      <p>
        אני כאן בשבילך - בכל שאלה, ספק או רצון לשתף.
      </p>
      <p>
        תשובותיי מגיעות ישירות מהלב (וגם עם מעט הומור 😊).
      </p>
      <p style="margin-top: 24px;">
        📸 <strong>בואי נישאר בקשר!</strong><br>
        עקבי אחרי באינסטגרם לתוכן יומיומי, טיפים ושיחות כנות על גיל המעבר:<br>
        <a href="https://www.instagram.com/inbal_daphna/" style="color: #FF0080; font-weight: 600; text-decoration: none;">
          @inbal_daphna
        </a>
      </p>
      <p class="signature">
        באהבה,<br>
        ענבל דפנה 💗
      </p>
    </div>

    <div class="footer">
      <p>
        קיבלת את המייל הזה כי הצטרפת לרשימת הדיוור של מנופאוזית וטוב לה
      </p>
      <p>
        <a href="#" style="color: #FF0080;">ביטול מנוי</a>
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const payload: BrevoEmailPayload = {
      sender: {
        name: process.env.BREVO_FROM_NAME || 'עליזה - מנופאוזית וטוב לה',
        email: process.env.BREVO_FROM_EMAIL || 'inbal@gilhameever.com',
      },
      to: [
        {
          email,
          name: fullName,
        },
      ],
      subject: '🎁 המתנה שלך ממנופאוזית וטוב לה',
      htmlContent,
    };

    console.log('📤 Sending Brevo email to:', email);

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify(payload),
    });

    console.log('📥 Email API response status:', response.status, response.statusText);

    if (!response.ok) {
      const responseText = await response.text();
      console.log('📥 Email API response body:', responseText);
      
      let responseData: any = {};
      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('❌ Failed to parse email response:', parseError);
        }
      }
      
      console.error('❌ Brevo email API error:', {
        status: response.status,
        data: responseData,
      });

      return {
        success: false,
        error: `Failed to send email: ${responseData.message || response.statusText || 'Unknown error'}`,
      };
    }

    console.log('✅ Brevo email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending Brevo email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ========================================
// API ROUTE HANDLER
// ========================================
export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    const envCheck = validateEnvVars();
    if (!envCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          message: `Server configuration error: Missing ${envCheck.missing.join(', ')}`,
        },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { email, firstName, lastName, listId } = body;

    // Validate input
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        {
          success: false,
          message: 'כתובת אימייל לא תקינה',
        },
        { status: 400 }
      );
    }

    if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'שם פרטי חסר',
        },
        { status: 400 }
      );
    }

    if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'שם משפחה חסר',
        },
        { status: 400 }
      );
    }

    if (!listId || typeof listId !== 'number' || listId <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'List ID not provided or invalid',
        },
        { status: 400 }
      );
    }

    console.log('📥 Received lead gift signup:', {
      email,
      firstName,
      lastName,
      listId,
    });

    // Step 1: Create or update contact in Brevo
    const contactResult = await createOrUpdateBrevoContact(
      email,
      firstName.trim(),
      lastName.trim(),
      listId
    );

    if (!contactResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: contactResult.error || 'שגיאה ביצירת איש קשר',
        },
        { status: 500 }
      );
    }

    // Step 2: Send welcome email with gift
    const emailResult = await sendBrevoEmail(
      email,
      firstName.trim(),
      lastName.trim()
    );

    if (!emailResult.success) {
      // Contact was created but email failed - still return success
      // but log the error
      console.error('⚠️ Contact created but email failed:', emailResult.error);
      
      // We still consider this a success since the contact is in the list
      return NextResponse.json(
        {
          success: true,
          message: 'נרשמת בהצלחה! המייל עם המתנה יישלח בקרוב.',
        },
        { status: 200 }
      );
    }

    // Success!
    return NextResponse.json(
      {
        success: true,
        message: 'נרשמת בהצלחה! המייל עם המתנה נשלח אליך.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Unexpected error in lead-gift API route:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'שגיאת שרת. נסי שוב מאוחר יותר.',
      },
      { status: 500 }
    );
  }
}

