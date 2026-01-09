import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route for Exit Intent Popup Signup
 * Registers user to Brevo list (default: list #12 for Inspiration Waves/Newsletter)
 * Can be configured via BREVO_LIST_ID_EXIT_INTENT environment variable
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: 'כתובת מייל היא שדה חובה' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'כתובת מייל לא תקינה' },
        { status: 400 }
      );
    }

    // Add to Brevo list
    const BREVO_API_KEY = process.env.BREVO_API_KEY;

    if (!BREVO_API_KEY) {
      console.error('❌ BREVO_API_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'שגיאה בהגדרת המערכת. נסי שוב מאוחר יותר.' },
        { status: 500 }
      );
    }

    try {
      // Use BREVO_LIST_ID_EXIT_INTENT if set, otherwise default to list 12 (Inspiration Waves/Newsletter)
      const listId = process.env.BREVO_LIST_ID_EXIT_INTENT 
        ? parseInt(process.env.BREVO_LIST_ID_EXIT_INTENT) 
        : 12;

      const contactPayload = {
        email: email.toLowerCase().trim(),
        attributes: {
          FIRSTNAME: '', // Email only signup
          LASTNAME: '',
        },
        updateEnabled: true,
        listIds: [listId],
      };

      console.log('📤 Adding contact to Brevo list (exit-intent):', {
        email: email.trim(),
        listId,
        source: 'exit-intent-popup',
      });

      const contactResponse = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactPayload),
      });

      const responseText = await contactResponse.text();
      let responseData: any = {};

      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('❌ Failed to parse Brevo response:', parseError);
        }
      }

      // Contact already exists - this is okay, try to add to list
      if (contactResponse.status === 400 && responseData.code === 'duplicate_parameter') {
        console.log('ℹ️ Contact already exists in Brevo - adding to list separately');
        
        try {
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

          if (addToListResponse.ok) {
            console.log('✅ Contact added to list successfully');
          } else {
            const addToListText = await addToListResponse.text();
            console.log('ℹ️ Contact may already be in list:', addToListText);
          }
        } catch (addError) {
          console.error('⚠️ Error adding to list:', addError);
          // Continue anyway - contact exists
        }

        return NextResponse.json({
          success: true,
          message: 'ההרשמה בוצעה בהצלחה!',
          data: { email: email.trim() },
        });
      }

      if (!contactResponse.ok) {
        console.error('❌ Brevo API error:', {
          status: contactResponse.status,
          data: responseData,
        });

        return NextResponse.json(
          {
            success: false,
            error: responseData.message || 'שגיאה ברישום. נסי שוב מאוחר יותר.',
          },
          { status: 500 }
        );
      }

      console.log('✅ Contact added to Brevo list successfully');

      return NextResponse.json({
        success: true,
        message: 'ההרשמה בוצעה בהצלחה!',
        data: { email: email.trim() },
      });
    } catch (brevoError: any) {
      console.error('❌ Brevo error:', brevoError);
      return NextResponse.json(
        {
          success: false,
          error: 'שגיאה ברישום. נסי שוב מאוחר יותר.',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ Server error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'שגיאה בשרת. נסי שוב מאוחר יותר.',
      },
      { status: 500 }
    );
  }
}
