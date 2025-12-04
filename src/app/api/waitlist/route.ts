import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * API endpoint for waitlist signups
 * Saves user data to early_adopters table and adds contact to Brevo
 */
export async function POST(request: Request) {
  console.log('\n' + '='.repeat(60));
  console.log('📥 API: /api/waitlist called');
  console.log('='.repeat(60));

  try {
    const { firstName, lastName, email } = await request.json();
    console.log('📥 Request data:', { firstName, lastName, email: email ? '***@' + email.split('@')[1] : 'missing' });

    // Validate input
    if (!firstName || !lastName || !email) {
      console.error('❌ Validation failed: Missing firstName, lastName or email');
      return NextResponse.json(
        { success: false, error: 'שם פרטי, שם משפחה ואימייל הם שדות חובה' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('❌ Validation failed: Invalid email format');
      return NextResponse.json(
        { success: false, error: 'כתובת אימייל לא תקינה' },
        { status: 400 }
      );
    }

    console.log('✅ Input validation passed');

    // Try to import Supabase
    let supabaseAdmin;
    try {
      const supabaseModule = await import('@/lib/supabase-server');
      supabaseAdmin = supabaseModule.supabaseAdmin;
      console.log('✅ Supabase module loaded');
    } catch (error) {
      console.error('⚠️ Could not load Supabase module:', error);
      // Continue without database
    }

    // Save to database if Supabase is available
    let userId = 'mock-id-' + Date.now();
    if (supabaseAdmin) {
      console.log('🔍 Checking if email already exists in database...');
      const { data: existingUser } = await supabaseAdmin
        .from('early_adopters')
        .select('email')
        .eq('email', email.toLowerCase())
        .single();

      if (existingUser) {
        console.log('⚠️ Email already exists in database');
        return NextResponse.json(
          { success: false, error: 'כתובת המייל כבר רשומה ברשימת ההמתנה' },
          { status: 409 }
        );
      }

      console.log('✅ Email is new');

      // Insert new early adopter into database
      console.log('💾 Inserting into database...');
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from('early_adopters')
        .insert([
          {
            name: fullName,
            email: email.toLowerCase().trim(),
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Database insert error:', insertError);
        return NextResponse.json(
          { success: false, error: 'שגיאה בשמירת הנתונים. נסי שוב מאוחר יותר.' },
          { status: 500 }
        );
      }

      console.log('✅ Database insert successful:', { id: newUser.id });
      userId = newUser.id;
    } else {
      console.log('⚠️ Skipping database save - Supabase not available');
    }

    // Add contact to Brevo
    console.log('📧 Adding contact to Brevo...');
    try {
      await addContactToBrevo(email, firstName.trim(), lastName.trim());
      console.log('✅ Contact added to Brevo successfully');
    } catch (brevoError: any) {
      console.error('⚠️ Brevo error (non-critical):', brevoError.message);
      // Continue anyway - database save was successful
    }

    console.log('✅ Waitlist signup complete!');
    console.log('='.repeat(60) + '\n');

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    return NextResponse.json({
      success: true,
      message: 'ההרשמה בוצעה בהצלחה!',
      data: {
        id: userId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: fullName,
        email: email,
      },
    });
  } catch (error: any) {
    console.error('❌ Fatal error in waitlist signup:', error);
    console.error('Error stack:', error.stack);
    console.log('='.repeat(60) + '\n');
    return NextResponse.json(
      { success: false, error: 'שגיאה בשליחת הטופס. נסי שוב מאוחר יותר.' },
      { status: 500 }
    );
  }
}

/**
 * Add contact to Brevo and send welcome email
 */
async function addContactToBrevo(email: string, firstName: string, lastName: string): Promise<void> {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  
  console.log('🔑 Checking Brevo configuration...');
  console.log('   BREVO_API_KEY:', BREVO_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('   BREVO_FROM_EMAIL:', process.env.BREVO_FROM_EMAIL || 'not set');
  console.log('   BREVO_FROM_NAME:', process.env.BREVO_FROM_NAME || 'not set');
  console.log('   BREVO_LIST_ID_WAITLIST:', process.env.BREVO_LIST_ID_WAITLIST || 'not set (optional)');

  if (!BREVO_API_KEY) {
    console.log('⚠️ BREVO_API_KEY not configured - skipping Brevo integration');
    console.log('   To enable Brevo, add BREVO_API_KEY to your .env.local file');
    return;
  }

  try {
    // Step 1: Create or update contact in Brevo
    console.log('📧 Step 1/2: Creating/updating contact in Brevo...');
    // Use BREVO_LIST_ID_WAITLIST if set, otherwise default to list 6 for waitlist
    const waitlistListId = process.env.BREVO_LIST_ID_WAITLIST 
      ? parseInt(process.env.BREVO_LIST_ID_WAITLIST) 
      : 6; // Default to list 6 for waitlist
    
    const listIds = [waitlistListId];

    const contactPayload = {
      email: email.toLowerCase().trim(),
      attributes: {
        FIRSTNAME: firstName.trim(),
        LASTNAME: lastName.trim(),
      },
      updateEnabled: true,
      listIds,
    };

    console.log('📤 Brevo contact payload:', {
      email: email,
      attributes: contactPayload.attributes,
      listIds: listIds,
      listIdSource: process.env.BREVO_LIST_ID_WAITLIST ? 'BREVO_LIST_ID_WAITLIST env var' : 'default (6)',
      updateEnabled: true,
    });

    const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactPayload),
    });

    console.log('📥 Brevo contact response status:', contactResponse.status);

    if (!contactResponse.ok) {
      const errorText = await contactResponse.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        errorJson = { rawError: errorText };
      }
      
      console.error('❌ Brevo contact API error:');
      console.error('   Status:', contactResponse.status);
      console.error('   Response:', JSON.stringify(errorJson, null, 2));
      
      // If contact already exists (code: duplicate_parameter), add to list separately
      if (errorJson.code === 'duplicate_parameter') {
        console.log('ℹ️ Contact already exists in Brevo - adding to list separately');
        
        // Add existing contact to the list using the list contacts endpoint
        const addToListResponse = await fetch(
          `https://api.brevo.com/v3/contacts/lists/${waitlistListId}/contacts/add`,
          {
            method: 'POST',
            headers: {
              'api-key': BREVO_API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              emails: [email.toLowerCase().trim()],
            }),
          }
        );

        if (!addToListResponse.ok) {
          const addToListError = await addToListResponse.text();
          console.error('⚠️ Failed to add existing contact to list:', addToListError);
          // Continue anyway - contact exists, just not in the list
        } else {
          console.log('✅ Existing contact added to list successfully');
        }
      } else {
        throw new Error(`Brevo contact error (${contactResponse.status}): ${errorText}`);
      }
    } else {
      const contactResult = await contactResponse.json();
      console.log('✅ Brevo contact created/updated successfully');
      console.log('   Contact ID:', contactResult.id || 'N/A');
    }

    // Step 2: Send welcome email
    console.log('📧 Step 2/2: Sending welcome email via Brevo...');
    const fromEmail = process.env.BREVO_FROM_EMAIL || 'gil.hameever@gmail.com';
    const fromName = process.env.BREVO_FROM_NAME || 'מנופאוזית וטוב לה';

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const emailPayload = {
      sender: {
        name: fromName,
        email: fromEmail,
      },
      to: [{ email: email, name: fullName }],
      subject: '🌸 ברוכה הבאה לרשימת ההמתנה - המתנה שלך בדרך!',
      htmlContent: createWelcomeEmailHTML(fullName),
      textContent: createWelcomeEmailText(fullName),
    };

    console.log('📤 Sending email from:', `${fromName} <${fromEmail}>`);
    console.log('   To:', email);

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    console.log('📥 Brevo email response status:', emailResponse.status);

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('❌ Brevo email API error:');
      console.error('   Status:', emailResponse.status);
      console.error('   Response:', errorText);
      throw new Error(`Brevo email error (${emailResponse.status}): ${errorText}`);
    }

    const emailResult = await emailResponse.json();
    console.log('✅ Welcome email sent successfully');
    console.log('   Message ID:', emailResult.messageId || 'N/A');

  } catch (error: any) {
    console.error('❌ Brevo integration error:', error.message);
    console.error('   Full error:', error);
    throw error;
  }
}

/**
 * Create HTML template for welcome email
 */
function createWelcomeEmailHTML(name: string): string {
  return `
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
        שלום <strong>${name}</strong>,
      </p>
      <p style="color: #6D3D47; font-size: 16px; line-height: 1.8; margin: 0 0 15px 0;">
        תודה שהצטרפת לרשימת ההמתנה! 🎁
      </p>
      <p style="color: #6D3D47; font-size: 16px; line-height: 1.8; margin: 0;">
        בקרוב תקבלי את המתנה המיוחדת שלי: <strong>7 דברים שאף אחד לא הכין אותי אליהם בגיל המעבר</strong>
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
}

/**
 * Create plain text template for welcome email
 */
function createWelcomeEmailText(name: string): string {
  return `
ברוכה הבאה לרשימת ההמתנה! 🌸

שלום ${name},

תודה שהצטרפת לרשימת ההמתנה! 🎁

בקרוב תקבלי את המתנה המיוחדת שלי: 7 דברים שאף אחד לא הכין אותי אליהם בגיל המעבר

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
}
