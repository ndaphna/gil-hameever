import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint for good sleep access signup
 * Adds contact to Brevo list #12 (Inspiration Waves / גלי השראה)
 */
export async function POST(request: NextRequest) {
  console.log('\n' + '='.repeat(60));
  console.log('📥 API: /api/good-sleep-access called');
  console.log('='.repeat(60));

  try {
    const { name, email } = await request.json();
    console.log('📥 Request data:', { 
      name: name ? name.substring(0, 10) + '...' : 'missing', 
      email: email ? '***@' + email.split('@')[1] : 'missing' 
    });

    // Validate input
    if (!email || !email.trim()) {
      console.error('❌ Validation failed: Missing email');
      return NextResponse.json(
        { success: false, error: 'כתובת אימייל היא שדה חובה' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.error('❌ Validation failed: Invalid email format');
      return NextResponse.json(
        { success: false, error: 'כתובת אימייל לא תקינה' },
        { status: 400 }
      );
    }

    console.log('✅ Input validation passed');

    // Add contact to Brevo list #12 (Inspiration Waves / גלי השראה)
    console.log('📧 Adding contact to Brevo list #12 (Inspiration Waves)...');
    try {
      await addContactToBrevo(email, name?.trim() || '');
      console.log('✅ Contact added to Brevo successfully');
    } catch (brevoError: any) {
      // If contact already exists, treat it as success and redirect
      if (brevoError.message && brevoError.message.includes('duplicate')) {
        console.log('ℹ️ Contact already exists - treating as success');
        // Continue to return success response
      } else {
        console.error('⚠️ Brevo error:', brevoError.message);
        return NextResponse.json(
          { success: false, error: 'שגיאה בהרשמה. נסי שוב מאוחר יותר.' },
          { status: 500 }
        );
      }
    }

    console.log('✅ Good sleep access signup complete!');
    console.log('='.repeat(60) + '\n');

    return NextResponse.json({
      success: true,
      message: 'ההרשמה בוצעה בהצלחה!',
      data: {
        name: name?.trim() || '',
        email: email.trim(),
      },
    });
  } catch (error: any) {
    console.error('❌ Fatal error in good sleep access signup:', error);
    console.error('Error stack:', error.stack);
    console.log('='.repeat(60) + '\n');
    return NextResponse.json(
      { success: false, error: 'שגיאה בשליחת הטופס. נסי שוב מאוחר יותר.' },
      { status: 500 }
    );
  }
}

/**
 * Add contact to Brevo list #12 (Inspiration Waves / גלי השראה)
 */
async function addContactToBrevo(email: string, name: string): Promise<void> {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  
  console.log('🔑 Checking Brevo configuration...');
  console.log('   BREVO_API_KEY:', BREVO_API_KEY ? '✅ Set' : '❌ Missing');

  if (!BREVO_API_KEY) {
    console.log('⚠️ BREVO_API_KEY not configured - skipping Brevo integration');
    throw new Error('BREVO_API_KEY not configured');
  }

  try {
    // List ID 12 for Inspiration Waves / גלי השראה
    const listId = 12;
    
    // Split name into first and last name for Brevo (if space exists)
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || name.trim() || '';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    
    const contactPayload = {
      email: email.toLowerCase().trim(),
      attributes: {
        FIRSTNAME: firstName,
        LASTNAME: lastName,
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
      
      // If contact already exists, try to add to list separately
      // If that also fails (contact already in list), treat as success
      if (errorJson.code === 'duplicate_parameter') {
        console.log('ℹ️ Contact already exists in Brevo - attempting to add to list');
        
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
          // Contact might already be in the list - that's fine, treat as success
          const addToListErrorText = await addToListResponse.text();
          console.log('ℹ️ Contact may already be in list - treating as success');
          // Don't throw error - treat as success
        } else {
          console.log('✅ Existing contact added to list successfully');
        }
        // Don't throw error for duplicate - treat as success
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
