import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

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
      return NextResponse.json(
        { success: false, error: 'שגיאה בהגדרת המערכת.' },
        { status: 500 }
      );
    }

    const listId = 12;
    const contactPayload = {
      email: email.toLowerCase().trim(),
      attributes: { FIRSTNAME: name?.trim() || '', LASTNAME: '' },
      updateEnabled: true,
      listIds: [listId],
    };

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
      } catch {}
    }

    if (contactResponse.status === 400 && responseData.code === 'duplicate_parameter') {
      return NextResponse.json({
        success: true,
        message: 'ההרשמה בוצעה בהצלחה!',
        data: { email: email.trim() },
      });
    }

    if (!contactResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: (responseData.message as string) || 'שגיאה ברישום.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ההרשמה בוצעה בהצלחה!',
      data: { email: email.trim() },
    });
  } catch (error) {
    console.error('mood-guide-signup error:', error);
    return NextResponse.json({ success: false, error: 'שגיאה בשרת.' }, { status: 500 });
  }
}
