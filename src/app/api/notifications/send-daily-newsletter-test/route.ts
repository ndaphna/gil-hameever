import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'edge';

/**
 * שליחת בדיקה מיידית של הניוזלטר היומי
 * שולח ניוזלטר לכל המשתמשות שבחרו לקבל ניוזלטר יומי
 */
export async function POST(request: Request) {
  try {
    // בדוק API key (אבטחה)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // קרא ל-endpoint של מתזמן הניוזלטר
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    'http://localhost:3000');
    
    const response = await fetch(`${baseUrl}/api/notifications/newsletter-scheduler`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.CRON_SECRET ? { 'Authorization': `Bearer ${process.env.CRON_SECRET}` } : {})
      }
    });

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Newsletter test sent',
      timestamp: new Date().toISOString(),
      result
    });
  } catch (error: any) {
    console.error('Newsletter test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

