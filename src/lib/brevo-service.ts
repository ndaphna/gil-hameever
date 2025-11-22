/**
 * ========================================
 * BREVO SERVICE
 * ========================================
 * 
 * Service layer for Brevo API interactions
 */

import type { BrevoContact, BrevoEmail, BrevoAPIError } from '@/types/lead-magnet';

// ========================================
// BREVO CONFIGURATION
// ========================================

const BREVO_API_BASE = 'https://api.brevo.com/v3';

function getBrevoHeaders() {
  return {
    'accept': 'application/json',
    'content-type': 'application/json',
    'api-key': process.env.BREVO_API_KEY!,
  };
}

// ========================================
// CONTACT MANAGEMENT
// ========================================

export async function createOrUpdateContact(
  email: string,
  firstName: string,
  lastName: string,
  listId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: BrevoContact = {
      email,
      attributes: {
        FIRSTNAME: firstName,
        LASTNAME: lastName,
      },
      listIds: [listId],
      updateEnabled: true,
    };

    console.log('📤 Creating/updating Brevo contact:', {
      email,
      firstName,
      lastName,
      listId,
    });

    const response = await fetch(`${BREVO_API_BASE}/contacts`, {
      method: 'POST',
      headers: getBrevoHeaders(),
      body: JSON.stringify(payload),
    });

    console.log('📥 Brevo response status:', response.status, response.statusText);

    const responseText = await response.text();
    console.log('📥 Brevo response body:', responseText);

    let responseData: BrevoAPIError = {};

    if (responseText) {
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse Brevo response:', parseError);
        return {
          success: false,
          error: `Invalid response from Brevo: ${responseText.substring(0, 100)}`,
        };
      }
    }

    if (!response.ok) {
      // Contact already exists - this is okay
      if (response.status === 400 && responseData.code === 'duplicate_parameter') {
        console.log('✅ Contact already exists, will be updated');
        return { success: true };
      }

      console.error('❌ Brevo API error:', {
        status: response.status,
        data: responseData,
      });

      return {
        success: false,
        error: `Brevo API error: ${responseData.message || response.statusText || 'Unknown error'}`,
      };
    }

    console.log('✅ Brevo contact created/updated successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error creating/updating Brevo contact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ========================================
// EMAIL SENDING
// ========================================

export async function sendEmail(
  email: string,
  name: string,
  subject: string,
  htmlContent: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: BrevoEmail = {
      sender: {
        name: process.env.BREVO_FROM_NAME!,
        email: process.env.BREVO_FROM_EMAIL!,
      },
      to: [
        {
          email,
          name,
        },
      ],
      subject,
      htmlContent,
    };

    console.log('📤 Sending Brevo email to:', email);

    const response = await fetch(`${BREVO_API_BASE}/smtp/email`, {
      method: 'POST',
      headers: getBrevoHeaders(),
      body: JSON.stringify(payload),
    });

    console.log('📥 Email API response status:', response.status, response.statusText);

    if (!response.ok) {
      const responseText = await response.text();
      console.log('📥 Email API response body:', responseText);

      let responseData: BrevoAPIError = {};
      if (responseText) {
        try {
          responseData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('❌ Failed to parse email response:', parseError);
        }
      }

      console.error('❌ Brevo email API error:', {
        status: response.status,
        data: responseData,
      });

      return {
        success: false,
        error: `Failed to send email: ${responseData.message || response.statusText || 'Unknown error'}`,
      };
    }

    console.log('✅ Brevo email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending Brevo email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

