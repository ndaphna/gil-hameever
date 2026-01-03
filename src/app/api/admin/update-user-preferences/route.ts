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

export async function PUT(request: NextRequest) {
  try {
    // Verify admin
    const adminUser = await verifyAdmin();

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, preferences } = body;

    if (!userId || !preferences) {
      return NextResponse.json(
        { error: 'User ID and preferences are required' },
        { status: 400 }
      );
    }

    // Check if preferences exist
    const { data: existing } = await supabaseAdmin
      .from('notification_preferences')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existing) {
      // Update existing preferences
      const { data, error } = await supabaseAdmin
        .from('notification_preferences')
        .update({
          email: preferences.email,
          whatsapp: preferences.whatsapp,
          push: preferences.push,
          categories: preferences.categories,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating preferences:', error);
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        preferences: data,
      });
    } else {
      // Create new preferences
      const { data, error } = await supabaseAdmin
        .from('notification_preferences')
        .insert({
          user_id: userId,
          email: preferences.email || {
            enabled: true,
            frequency: 'weekly',
            time: '09:00',
            newsletter_interval_days: 4,
          },
          whatsapp: preferences.whatsapp || {
            enabled: false,
            frequency: 'daily',
            time: '20:00',
          },
          push: preferences.push || {
            enabled: true,
            frequency: 'daily',
            time: '09:00',
          },
          categories: preferences.categories || {
            reminders: true,
            insights: true,
            encouragements: true,
            warnings: true,
          },
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating preferences:', error);
        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        preferences: data,
      });
    }

  } catch (error: any) {
    console.error('Update preferences error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}






