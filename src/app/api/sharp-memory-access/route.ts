import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint for sharp memory (זיכרון חד) access signup
 * Adds contact to Brevo list #12 (Inspiration Waves / גלי השראה)
 */
export async function POST(request: NextRequest) {
  console.log('\n' + '='.repeat(60));
  console.log('📥 API: /api/sharp-memory-access called');
  console.log('='.repeat(60));

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY || !BREVO_API_KEY.trim()) {
    console.error('❌ BREVO_API_KEY is not set. Set it in Vercel Environment Variables.');
    return NextResponse.json(
      { success: false, error: 'השירות לא זמין כרגע. נסי שוב מאוחר יותר.' },
      { status: 503 }
    );
  }

  try {
    let body: { name?: string; email?: string };
    try {
      body = await request.json();
    } catch {
      console.error('❌ Invalid request body (not JSON)');
      return NextResponse.json(
        { success: false, error: 'נתונים לא תקינים. נסי שוב.' },
        { status: 400 }
      );
    }
    const { name, email } = body;
    console.log('📥 Request data:', {
      name: name ? name.substring(0, 10) + '...' : 'missing',
      email: email ? '***@' + email.split('@')[1] : 'missing',
    });

    if (!email || !email.trim()) {
      console.error('❌ Validation failed: Missing email');
      return NextResponse.json(
        { success: false, error: 'כתובת אימייל היא שדה חובה' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.error('❌ Validation failed: Invalid email format');
      return NextResponse.json(
        { success: false, error: 'כתובת אימייל לא תקינה' },
        { status: 400 }
      );
    }

    console.log('✅ Input validation passed');
    console.log('📧 Adding contact to Brevo list #12 (Inspiration Waves)...');
    try {
      await addContactToBrevo(email, name?.trim() || '');
      console.log('✅ Contact added to Brevo successfully');
    } catch (brevoError: any) {
      const errorMessage = (brevoError.message || '').toLowerCase();
      if (isAlreadyInListError(errorMessage)) {
        console.log('ℹ️ Contact already in list / exists - treating as success, allowing access');
      } else {
        console.error('⚠️ Brevo error:', brevoError.message);
        return NextResponse.json(
          { success: false, error: 'שגיאה בהרשמה. נסי שוב מאוחר יותר.' },
          { status: 500 }
        );
      }
    }

    console.log('✅ Sharp memory access signup complete!');
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
    console.error('❌ Fatal error in sharp memory access signup:', error);
    console.error('Error stack:', error.stack);
    console.log('='.repeat(60) + '\n');
    return NextResponse.json(
      { success: false, error: 'שגיאה בשליחת הטופס. נסי שוב מאוחר יותר.' },
      { status: 500 }
    );
  }
}

function isAlreadyInListError(errorText: string): boolean {
  const t = errorText.toLowerCase();
  return (
    t.includes('duplicate') ||
    t.includes('already') ||
    t.includes('exists') ||
    t.includes('in list') ||
    t.includes('רשימה') ||
    t.includes('קיים')
  );
}

async function addContactToBrevo(email: string, name: string): Promise<void> {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  if (!BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY not configured');
  }

  const listId = 12;
  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] || name.trim() || '';
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  const contactPayload = {
    email: email.toLowerCase().trim(),
    attributes: { FIRSTNAME: firstName, LASTNAME: lastName },
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

  if (!contactResponse.ok) {
    const errorText = await contactResponse.text();
    let errorJson: { code?: string };
    try {
      errorJson = JSON.parse(errorText);
    } catch {
      errorJson = {};
    }
    const isAlreadyInList =
      errorJson.code === 'duplicate_parameter' || isAlreadyInListError(errorText);
    if (isAlreadyInList) {
      const addToListResponse = await fetch(
        `https://api.brevo.com/v3/contacts/lists/${listId}/contacts/add`,
        {
          method: 'POST',
          headers: {
            'api-key': BREVO_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emails: [email.toLowerCase().trim()] }),
        }
      );
      if (!addToListResponse.ok) {
        // Still allow access
      }
      return;
    }
    throw new Error(`Brevo contact error (${contactResponse.status}): ${errorText}`);
  }
}
