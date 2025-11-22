/**
 * ========================================
 * LEAD MAGNET API ROUTE - REFACTORED
 * ========================================
 * 
 * Clean, maintainable API route using service layer
 */

import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateContact, sendEmail } from '@/lib/brevo-service';
import { createLeadGiftEmailContent } from '@/lib/email-templates';
import type { LeadGiftAPIRequest, LeadGiftAPIResponse } from '@/types/lead-magnet';

// ========================================
// ENVIRONMENT VALIDATION
// ========================================

function validateEnvironment(): { valid: boolean; missing: string[] } {
  const required = ['BREVO_API_KEY', 'BREVO_FROM_EMAIL', 'BREVO_FROM_NAME'];
  const missing = required.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing.join(', '));
    return { valid: false, missing };
  }

  return { valid: true, missing: [] };
}

// ========================================
// INPUT VALIDATION
// ========================================

function validateInput(body: any): { valid: boolean; error?: string } {
  const { email, firstName, lastName, listId } = body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return { valid: false, error: 'כתובת אימייל לא תקינה' };
  }

  if (!firstName || typeof firstName !== 'string' || firstName.trim().length === 0) {
    return { valid: false, error: 'שם פרטי חסר' };
  }

  if (!lastName || typeof lastName !== 'string' || lastName.trim().length === 0) {
    return { valid: false, error: 'שם משפחה חסר' };
  }

  if (!listId || typeof listId !== 'number' || listId <= 0) {
    return { valid: false, error: 'List ID not provided or invalid' };
  }

  return { valid: true };
}

// ========================================
// API ROUTE HANDLER
// ========================================

export async function POST(request: NextRequest) {
  try {
    // Validate environment
    const envCheck = validateEnvironment();
    if (!envCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          message: `Server configuration error: Missing ${envCheck.missing.join(', ')}`,
        } as LeadGiftAPIResponse,
        { status: 500 }
      );
    }

    // Parse and validate input
    const body: LeadGiftAPIRequest = await request.json();
    const inputValidation = validateInput(body);

    if (!inputValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: inputValidation.error,
        } as LeadGiftAPIResponse,
        { status: 400 }
      );
    }

    const { email, firstName, lastName, listId } = body;

    console.log('📥 Received lead gift signup:', {
      email,
      firstName,
      lastName,
      listId,
    });

    // Step 1: Create or update contact in Brevo
    const contactResult = await createOrUpdateContact(
      email,
      firstName.trim(),
      lastName.trim(),
      listId
    );

    if (!contactResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: contactResult.error || 'שגיאה ביצירת איש קשר',
        } as LeadGiftAPIResponse,
        { status: 500 }
      );
    }

    // Step 2: Send welcome email with gift
    const { subject, html } = createLeadGiftEmailContent(
      firstName.trim(),
      lastName.trim()
    );

    const fullName = `${firstName} ${lastName}`.trim();
    const emailResult = await sendEmail(email, fullName, subject, html);

    if (!emailResult.success) {
      // Contact was created but email failed - still return success
      console.error('⚠️ Contact created but email failed:', emailResult.error);

      return NextResponse.json(
        {
          success: true,
          message: 'נרשמת בהצלחה! המייל עם המתנה יישלח בקרוב.',
        } as LeadGiftAPIResponse,
        { status: 200 }
      );
    }

    // Success!
    return NextResponse.json(
      {
        success: true,
        message: 'נרשמת בהצלחה! המייל עם המתנה נשלח אליך.',
      } as LeadGiftAPIResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Unexpected error in lead-gift API route:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'שגיאת שרת. נסי שוב מאוחר יותר.',
      } as LeadGiftAPIResponse,
      { status: 500 }
    );
  }
}

