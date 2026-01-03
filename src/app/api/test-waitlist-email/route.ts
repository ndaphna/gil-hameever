import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * Test endpoint to send waitlist welcome email
 * Usage: POST /api/test-waitlist-email
 */
export async function POST(request: Request) {
  try {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    
    if (!BREVO_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'BREVO_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Get gift page URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
      'https://gilhameever.com';
    const giftUrl = `${baseUrl}/waitlist/gift`;

    // Test recipient
    const testEmail = 'nitzandaphna@gmail.com';
    const testName = 'ניצן';

    // Create HTML email
    const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ברוכה הבאה לרשימת ההמתנה</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: rtl; background-color: #FFF8F0; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(222, 159, 175, 0.15);">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #6D3D47; margin: 0; font-size: 32px; font-weight: 700;">🌸</h1>
      <h1 style="color: #6D3D47; margin: 10px 0 0 0; font-size: 28px; font-weight: 700;">ברוכה הבאה!</h1>
    </div>
    
    <!-- Main Content -->
    <div style="background-color: #FFF8F0; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-right: 4px solid #DE9FAF;">
      <p style="color: #6D3D47; font-size: 18px; line-height: 1.8; margin: 0 0 15px 0;">
        שלום <strong>${testName}</strong>,
      </p>
      <p style="color: #6D3D47; font-size: 16px; line-height: 1.8; margin: 0 0 15px 0;">
        תודה שהצטרפת לרשימת ההמתנה! 🎁
      </p>
      <p style="color: #6D3D47; font-size: 16px; line-height: 1.8; margin: 0 0 20px 0;">
        המתנה המיוחדת שלי מחכה לך:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${giftUrl}" style="display: inline-block; background: linear-gradient(135deg, #FF0080 0%, #9D4EDD 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 30px; font-size: 18px; font-weight: 700; box-shadow: 0 4px 16px rgba(255, 0, 128, 0.3); transition: all 0.3s ease;">
          7 דברים שאף אחד לא הכין אותי אליהם בגיל המעבר
        </a>
      </div>
      <p style="color: #6D3D47; font-size: 14px; line-height: 1.6; margin: 15px 0 0 0; text-align: center;">
        לחצי על הכפתור כדי לקבל את המתנה מידית ✨
      </p>
    </div>
    
    <!-- Benefits -->
    <div style="margin-bottom: 25px;">
      <h2 style="color: #6D3D47; font-size: 20px; font-weight: 600; margin: 0 0 15px 0;">מה את מקבלת ברשימה?</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="padding: 8px 0; color: #6D3D47; font-size: 15px;">✔ מתנה בלעדי</li>
        <li style="padding: 8px 0; color: #6D3D47; font-size: 15px;">✔ עדכונים ראשונים על הספר</li>
        <li style="padding: 8px 0; color: #6D3D47; font-size: 15px;">✔ הצצות לפרקים ולתכנים</li>
        <li style="padding: 8px 0; color: #6D3D47; font-size: 15px;">✔ תוכן אישי שלא יעלה באינסטגרם</li>
        <li style="padding: 8px 0; color: #6D3D47; font-size: 15px;">✔ הטבה בלעדית ביום ההשקה</li>
      </ul>
    </div>
    
    <!-- Closing -->
    <div style="background-color: #F6DCE5; padding: 20px; border-radius: 12px; text-align: center;">
      <p style="color: #6D3D47; font-size: 16px; line-height: 1.6; margin: 0;">
        ביחד נגדיר מחדש את גיל המעבר<br>
        לא גיל הבלות, אלא <strong>גיל הפריחה</strong> 🌸
      </p>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #F6DCE5;">
      <p style="color: #999; font-size: 13px; margin: 0;">בברכה,</p>
      <p style="color: #6D3D47; font-size: 15px; font-weight: 600; margin: 5px 0 0 0;">ענבל דפנה</p>
    </div>
    
  </div>
</body>
</html>
    `.trim();

    // Create text email
    const textContent = `
ברוכה הבאה לרשימת ההמתנה! 🌸

שלום ${testName},

תודה שהצטרפת לרשימת ההמתנה! 🎁

המתנה המיוחדת שלי מחכה לך:
7 דברים שאף אחד לא הכין אותי אליהם בגיל המעבר

לחצי כאן כדי לקבל את המתנה מידית:
${giftUrl}

מה את מקבלת ברשימה?
✔ מתנה בלעדי
✔ עדכונים ראשונים על הספר
✔ הצצות לפרקים ולתכנים
✔ תוכן אישי שלא יעלה באינסטגרם
✔ הטבה בלעדית ביום ההשקה

ביחד נגדיר מחדש את גיל המעבר
לא גיל הבלות, אלא גיל הפריחה 🌸

בברכה,
ענבל דפנה
    `.trim();

    const fromEmail = process.env.BREVO_FROM_EMAIL || 'inbal@gilhameever.com';
    const fromName = process.env.BREVO_FROM_NAME || 'מנופאוזית וטוב לה';

    const emailPayload = {
      sender: {
        name: fromName,
        email: fromEmail,
      },
      to: [{ email: testEmail, name: testName }],
      subject: '🌸 ברוכה הבאה לרשימת ההמתנה - המתנה שלך בדרך!',
      htmlContent,
      textContent,
    };

    console.log('📤 Sending test email to:', testEmail);
    console.log('   Gift URL:', giftUrl);

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('❌ Email send error:', errorText);
      return NextResponse.json(
        { success: false, error: `Failed to send email: ${errorText}` },
        { status: 500 }
      );
    }

    const emailResult = await emailResponse.json();
    console.log('✅ Test email sent successfully');
    console.log('   Message ID:', emailResult.messageId);

    return NextResponse.json({
      success: true,
      message: 'מייל בדיקה נשלח בהצלחה!',
      data: {
        messageId: emailResult.messageId,
        recipient: testEmail,
        giftUrl,
      },
    });
  } catch (error: any) {
    console.error('❌ Error sending test email:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'שגיאה בשליחת המייל' },
      { status: 500 }
    );
  }
}

