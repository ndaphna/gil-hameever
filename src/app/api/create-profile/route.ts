import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, email, name } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error. Please check environment variables.' },
        { status: 500 }
      );
    }

    // Use service role key to bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Check if profile already exists
    const { data: existing } = await supabaseAdmin
      .from('user_profile')
      .select('id, is_admin')
      .eq('id', userId)
      .single();

    if (existing) {
      // If this is the admin email and not already admin, update it
      const isAdmin = email === 'nitzandaphna@gmail.com';
      if (isAdmin && !existing.is_admin) {
        await supabaseAdmin
          .from('user_profile')
          .update({ is_admin: true })
          .eq('id', userId);
      }
      return NextResponse.json({ 
        success: true, 
        message: 'Profile already exists',
        isAdmin: isAdmin && existing.is_admin !== false
      });
    }

    // Check if this is the admin email
    const isAdmin = email === 'nitzandaphna@gmail.com';

    // Split name into first_name and last_name
    const fullName = name || email.split('@')[0] || 'משתמשת';
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || fullName;
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;

    // Create the profile with admin privileges if applicable
    const { data, error } = await supabaseAdmin
      .from('user_profile')
      .insert({
        id: userId,
        email: email,
        first_name: firstName,
        last_name: lastName,
        name: fullName, // Keep for backward compatibility
        full_name: fullName, // Keep for backward compatibility
        subscription_tier: 'trial',
        subscription_status: 'active',
        current_tokens: 500,
        tokens_remaining: 500,
        is_admin: isAdmin,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      profile: data 
    });

  } catch (error: unknown) {
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}


