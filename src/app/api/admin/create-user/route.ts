import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/get-auth-user';
import { supabaseAdmin } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';

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

export async function POST(request: NextRequest) {
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
    const { email, password, full_name, first_name, last_name, subscription_tier, subscription_status, tokens, newsletter_interval_days } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create auth user
    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Check if user already exists
    const { data: existingUser } = await supabaseAuth.auth.admin.getUserByEmail(email);
    if (existingUser?.user) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAuth.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: full_name || email.split('@')[0],
        name: full_name || email.split('@')[0],
      },
    });

    if (authError || !authData.user) {
      console.error('Error creating auth user:', authError);
      return NextResponse.json(
        { error: authError?.message || 'Failed to create user' },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    // Split name if needed
    const nameParts = (full_name || email.split('@')[0] || 'משתמשת').trim().split(/\s+/);
    const firstName = first_name || nameParts[0] || full_name || email.split('@')[0];
    const lastName = last_name || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : null);

    // Create user profile
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('user_profile')
      .insert({
        id: userId,
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        name: full_name || firstName,
        full_name: full_name || firstName,
        subscription_tier: subscription_tier || 'trial',
        subscription_status: subscription_status || 'active',
        current_tokens: tokens || 500,
        tokens_remaining: tokens || 500,
        is_admin: false,
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      // Try to delete auth user if profile creation failed
      await supabaseAuth.auth.admin.deleteUser(userId);
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    // Create notification preferences with newsletter_interval_days
    const intervalDays = newsletter_interval_days || 4;
    const { error: prefsError } = await supabaseAdmin
      .from('notification_preferences')
      .insert({
        user_id: userId,
        email: {
          enabled: true,
          frequency: 'weekly',
          time: '09:00',
          newsletter_interval_days: intervalDays,
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
      });

    if (prefsError) {
      console.error('Error creating notification preferences:', prefsError);
      // Don't fail the whole operation if preferences fail
    }

    return NextResponse.json({
      success: true,
      user: profileData,
      message: 'User created successfully',
    });

  } catch (error: any) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}











