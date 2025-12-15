import { NextResponse } from 'next/server';

/**
 * בדיקת מצב Email Sender ב-Brevo
 * GET /api/notifications/check-sender
 * 
 * בודק:
 * 1. איזה email משמש כ-sender
 * 2. האם הוא מאומת ב-Brevo
 * 3. המלצות לפתרון
 */
export async function GET(request: Request) {
  try {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_FROM_EMAIL = process.env.BREVO_FROM_EMAIL || 'inbal@gilhameever.com';
    const BREVO_FROM_NAME = process.env.BREVO_FROM_NAME || 'עליזה - מנופאוזית וטוב לה';

    if (!BREVO_API_KEY) {
      return NextResponse.json({
        error: 'BREVO_API_KEY not configured',
        recommendation: 'Set BREVO_API_KEY in Vercel environment variables'
      }, { status: 500 });
    }

    // בדוק את ה-senders ב-Brevo
    let sendersInfo: any = null;
    try {
      const response = await fetch('https://api.brevo.com/v3/senders', {
        method: 'GET',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const senders = await response.json();
        sendersInfo = {
          total: senders.senders?.length || 0,
          senders: senders.senders || []
        };
      } else {
        const errorText = await response.text();
        sendersInfo = {
          error: `Failed to fetch senders: ${response.status} ${response.statusText}`,
          details: errorText.substring(0, 500)
        };
      }
    } catch (error: any) {
      sendersInfo = {
        error: error.message
      };
    }

    // מצא את ה-sender הנוכחי
    const currentSender = sendersInfo?.senders?.find((s: any) => 
      s.email === BREVO_FROM_EMAIL || s.email.toLowerCase() === BREVO_FROM_EMAIL.toLowerCase()
    );

    // בדוק את ה-domains
    let domainsInfo: any = null;
    try {
      const response = await fetch('https://api.brevo.com/v3/senders/domains', {
        method: 'GET',
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const domains = await response.json();
        domainsInfo = {
          total: domains.domains?.length || 0,
          domains: domains.domains || []
        };
      }
    } catch (error: any) {
      // לא קריטי
    }

    // חלץ domain מה-email
    const emailDomain = BREVO_FROM_EMAIL.includes('@') 
      ? BREVO_FROM_EMAIL.split('@')[1] 
      : null;

    const domainInfo = domainsInfo?.domains?.find((d: any) => 
      d.domain === emailDomain
    );

    return NextResponse.json({
      configured: {
        email: BREVO_FROM_EMAIL,
        name: BREVO_FROM_NAME,
        domain: emailDomain
      },
      brevo: {
        sender: currentSender ? {
          email: currentSender.email,
          name: currentSender.name,
          verified: currentSender.verified,
          status: currentSender.verified ? '✅ Verified' : '❌ Not Verified'
        } : null,
        domain: domainInfo ? {
          domain: domainInfo.domain,
          verified: domainInfo.verified,
          status: domainInfo.verified ? '✅ Verified' : '❌ Not Verified'
        } : null,
        allSenders: sendersInfo?.senders || [],
        allDomains: domainsInfo?.domains || []
      },
      issues: [
        ...(currentSender && !currentSender.verified ? [
          `❌ Email sender "${BREVO_FROM_EMAIL}" is not verified in Brevo`
        ] : []),
        ...(!currentSender ? [
          `⚠️ Email sender "${BREVO_FROM_EMAIL}" not found in Brevo senders list`
        ] : []),
        ...(emailDomain && domainInfo && !domainInfo.verified ? [
          `❌ Domain "${emailDomain}" is not verified in Brevo`
        ] : []),
        ...(emailDomain && !domainInfo ? [
          `⚠️ Domain "${emailDomain}" not found in Brevo domains list`
        ] : [])
      ],
      recommendations: [
        ...(currentSender && !currentSender.verified ? [
          `1. Verify email "${BREVO_FROM_EMAIL}" in Brevo Dashboard → Settings → Senders & IP → Senders`,
          `2. Click "Send verification email" and verify via email link`
        ] : []),
        ...(!currentSender ? [
          `1. Add email "${BREVO_FROM_EMAIL}" in Brevo Dashboard → Settings → Senders & IP → Senders`,
          `2. Click "Add a sender" and follow verification steps`
        ] : []),
        ...(emailDomain && !domainInfo ? [
          `1. Consider verifying domain "${emailDomain}" for better deliverability`,
          `2. Brevo Dashboard → Settings → Senders & IP → Domains → Add domain`
        ] : []),
        ...(currentSender && currentSender.verified ? [
          `✅ Email sender is verified - should work correctly!`
        ] : [])
      ],
      nextSteps: currentSender && currentSender.verified 
        ? 'Email sender is verified. If emails still fail, check Brevo Email Logs for delivery issues.'
        : 'Verify the email sender in Brevo Dashboard before sending emails.'
    });
  } catch (error: any) {
    console.error('Check sender error:', error);
    return NextResponse.json(
      {
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

