import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

/**
 * Cron endpoint לבדיקה ושליחת התראות
 * צריך להיות מוגדר ב-Vercel Cron או שירות אחר
 * 
 * Vercel Cron example (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/notifications/cron",
 *     "schedule": "0 9 * * 1"  // כל יום שני ב-9:00
 *   }]
 * }
 */
export async function GET(request: Request) {
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
    // זה בודק את ההעדפות של כל משתמשת ושולח ניוזלטרים לפי התדירות והשעה שבחרה
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.url.replace('/api/notifications/cron', '');
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
      timestamp: new Date().toISOString(),
      result
    });
  } catch (error: any) {
    console.error('Cron error:', error);
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

