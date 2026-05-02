import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body as { email: string; name?: string };

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, error: 'כתובת מייל היא שדה חובה' },
        { status: 400 }
      );
    }

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

    const listId = 12;

    const contactPayload = {
      email: email.toLowerCase().trim(),
      attributes: {
        FIRSTNAME: name?.trim() || '',
        LASTNAME: '',
      },
      updateEnabled: true,
      listIds: [listId],
    };

    console.log('📤 [Hot Flash Zoom] Adding contact to Brevo list #' + listId + ':', {
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
    let responseData: Record<string, unknown> = {};
    if (responseText) {
      try {
        responseData = JSON.parse(responseText);
      } catch {
        console.error('❌ Failed to parse Brevo response');
      }
    }

    if (contactResponse.status === 400 && responseData.code === 'duplicate_parameter') {
      console.log('✅ [Hot Flash Zoom] Contact already exists in list #' + listId);
      return NextResponse.json({
        success: true,
        message: 'ההרשמה בוצעה בהצלחה!',
        data: { email: email.trim() },
      });
    }

    if (!contactResponse.ok) {
      console.error('❌ [Hot Flash Zoom] Brevo API error:', {
        status: contactResponse.status,
        data: responseData,
      });
      return NextResponse.json(
        { success: false, error: (responseData.message as string) || 'שגיאה ברישום. נסי שוב מאוחר יותר.' },
        { status: 500 }
      );
    }

    console.log('✅ [Hot Flash Zoom] Contact added successfully to Brevo list #' + listId);
    return NextResponse.json({
      success: true,
      message: 'ההרשמה בוצעה בהצלחה!',
      data: { email: email.trim() },
    });

  } catch (error) {
    console.error('❌ [Hot Flash Zoom] Server error:', error);
    return NextResponse.json(
      { success: false, error: 'שגיאה בשרת. נסי שוב מאוחר יותר.' },
      { status: 500 }
    );
  }
}
