import { NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * API endpoint for inspiration waves newsletter signups
 * Adds contact to Brevo list #12 (Inspiration Waves)
 */
export async function POST(request: Request) {
  console.log('\n' + '='.repeat(60));
  console.log('📥 API: /api/inspiration-waves called');
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

    // Add contact to Brevo list #12
    console.log('📧 Adding contact to Brevo list #12 (Inspiration Waves)...');
    try {
      await addContactToBrevo(email, firstName.trim(), lastName.trim());
      console.log('✅ Contact added to Brevo successfully');
    } catch (brevoError: any) {
      console.error('⚠️ Brevo error:', brevoError.message);
      return NextResponse.json(
        { success: false, error: 'שגיאה בהרשמה. נסי שוב מאוחר יותר.' },
        { status: 500 }
      );
    }

    console.log('✅ Inspiration waves signup complete!');
    console.log('='.repeat(60) + '\n');

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    return NextResponse.json({
      success: true,
      message: 'ההרשמה בוצעה בהצלחה!',
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: fullName,
        email: email,
      },
    });
  } catch (error: any) {
    console.error('❌ Fatal error in inspiration waves signup:', error);
    console.error('Error stack:', error.stack);
    console.log('='.repeat(60) + '\n');
    return NextResponse.json(
      { success: false, error: 'שגיאה בשליחת הטופס. נסי שוב מאוחר יותר.' },
      { status: 500 }
    );
  }
}

/**
 * Add contact to Brevo list #12 (Inspiration Waves)
 */
async function addContactToBrevo(email: string, firstName: string, lastName: string): Promise<void> {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  
  console.log('🔑 Checking Brevo configuration...');
  console.log('   BREVO_API_KEY:', BREVO_API_KEY ? '✅ Set' : '❌ Missing');

  if (!BREVO_API_KEY) {
    console.log('⚠️ BREVO_API_KEY not configured - skipping Brevo integration');
    throw new Error('BREVO_API_KEY not configured');
  }

  try {
    // List ID 12 for Inspiration Waves
    const listId = 12;
    
    const contactPayload = {
      email: email.toLowerCase().trim(),
      attributes: {
        FIRSTNAME: firstName.trim(),
        LASTNAME: lastName.trim(),
      },
      updateEnabled: true,
      listIds: [listId],
    };

    console.log('📤 Brevo contact payload:', {
      email: email,
      attributes: contactPayload.attributes,
      listIds: [listId],
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
      
      // If contact already exists, add to list separately
      if (errorJson.code === 'duplicate_parameter') {
        console.log('ℹ️ Contact already exists in Brevo - adding to list separately');
        
        const addToListResponse = await fetch(
          `https://api.brevo.com/v3/contacts/lists/${listId}/contacts/add`,
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
          throw new Error(`Failed to add contact to list: ${addToListError}`);
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

  } catch (error: any) {
    console.error('❌ Brevo integration error:', error.message);
    console.error('   Full error:', error);
    throw error;
  }
}

