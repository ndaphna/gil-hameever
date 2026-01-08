import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/get-auth-user';
import { supabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'edge';

async function verifyAdmin() {
  const user = await getAuthUser();
  
  if (!user) {
    return null;
  }

  const { data: profile } = await supabaseAdmin
    .from('user_profile')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.is_admin) {
    return null;
  }

  return user;
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin
    const adminUser = await verifyAdmin();

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get notification preferences
    const { data: preferences, error } = await supabaseAdmin
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching preferences:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // If no preferences exist, return defaults
    if (!preferences) {
      return NextResponse.json({
        preferences: {
          email: {
            enabled: true,
            frequency: 'weekly',
            time: '09:00',
            newsletter_interval_days: 4,
          },
          whatsapp: {
            enabled: false,
            frequency: 'daily',
            time: '20:00',
          },
          push: {
            enabled: true,
            frequency: 'daily',
            time: '09:00',
          },
          categories: {
            reminders: true,
            insights: true,
            encouragements: true,
            warnings: true,
          },
        },
      });
    }

    return NextResponse.json({
      preferences: {
        email: preferences.email,
        whatsapp: preferences.whatsapp,
        push: preferences.push,
        categories: preferences.categories,
      },
    });

  } catch (error: any) {
    console.error('Get preferences error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}











