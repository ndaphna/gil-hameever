import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route for Emergency Map Guide Signup
 * Registers user to Brevo list #6 (Waitlist for Book)
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

    // Add to Brevo list #6
    const BREVO_API_KEY = process.env.BREVO_API_KEY;

    if (!BREVO_API_KEY) {
      console.error('❌ BREVO_API_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'שגיאה בהגדרת המערכת. נסי שוב מאוחר יותר.' },
        { status: 500 }
      );
    }

    try {
      // List ID 6 for Waitlist for Book
      const listId = 6;

      const contactPayload = {
        email: email.toLowerCase().trim(),
        attributes: {
          FIRSTNAME: '', // Email only signup
          LASTNAME: '',
        },
        updateEnabled: true,
        listIds: [listId],
      };

      console.log('📤 Adding contact to Brevo list #6:', {
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

      // Contact already exists - this is okay
      if (contactResponse.status === 400 && responseData.code === 'duplicate_parameter') {
        console.log('✅ Contact already exists in list #6');
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

      console.log('✅ Contact added to Brevo list #6 successfully');

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

