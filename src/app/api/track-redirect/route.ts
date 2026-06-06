import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, destination, utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer } = body;

    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0].trim() : '';

    await supabaseAdmin.from('link_clicks').insert({
      slug: slug || '',
      destination: destination || '',
      utm_source:   utm_source   || null,
      utm_medium:   utm_medium   || null,
      utm_campaign: utm_campaign || null,
      utm_content:  utm_content  || null,
      utm_term:     utm_term     || null,
      referrer:     referrer     || null,
      user_agent:   request.headers.get('user-agent') || null,
      ip_address:   ipAddress    || null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('track-redirect error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
