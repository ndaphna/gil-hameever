import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route for Heroine Checklist Signup
 * Registers user to Brevo with the "Heroine Checklist" lead magnet tag.
 * Uses list ID 6 (same as emergency map) - update if a dedicated list is created.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email presence
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

    const BREVO_API_KEY = process.env.BREVO_API_KEY;

    if (!BREVO_API_KEY) {
      console.error('❌ BREVO_API_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'שגיאה בהגדרת המערכת. נסי שוב מאוחר יותר.' },
        { status: 500 }
      );
    }

    try {
      // List ID 12 - "גלי השראה"
      const listId = 12;

      const contactPayload = {
        email: email.toLowerCase().trim(),
        attributes: {
          FIRSTNAME: '',
          LASTNAME: '',
        },
        updateEnabled: true,
        listIds: [listId],
      };

      console.log('📤 [Heroine Checklist] Adding contact to Brevo list #' + listId + ':', {
        email: email.trim(),
        listId,
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

      // Contact already exists - treat as success
      if (contactResponse.status === 400 && responseData.code === 'duplicate_parameter') {
        console.log('✅ [Heroine Checklist] Contact already exists in list #' + listId);
        return NextResponse.json({
          success: true,
          message: 'ההרשמה בוצעה בהצלחה!',
          data: { email: email.trim() },
        });
      }

      if (!contactResponse.ok) {
        console.error('❌ [Heroine Checklist] Brevo API error:', {
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

      console.log('✅ [Heroine Checklist] Contact added successfully to Brevo list #' + listId);

      return NextResponse.json({
        success: true,
        message: 'ההרשמה בוצעה בהצלחה!',
        data: { email: email.trim() },
      });
    } catch (brevoError: any) {
      console.error('❌ [Heroine Checklist] Brevo error:', brevoError);
      return NextResponse.json(
        {
          success: false,
          error: 'שגיאה ברישום. נסי שוב מאוחר יותר.',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ [Heroine Checklist] Server error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'שגיאה בשרת. נסי שוב מאוחר יותר.',
      },
      { status: 500 }
    );
  }
}
