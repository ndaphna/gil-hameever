import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

// This endpoint can be called to ensure nitzandaphna@gmail.com is set as admin
// It can be called by anyone, but only sets the specific email as admin
export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Only allow setting nitzandaphna@gmail.com as admin
    const allowedEmail = 'nitzandaphna@gmail.com';
    
    if (email && email !== allowedEmail) {
      return NextResponse.json(
        { error: 'Unauthorized email' },
        { status: 403 }
      );
    }

    const targetEmail = email || allowedEmail;

    // Find user by email using SQL query (more reliable)
    const { data: userData, error: userError } = await supabaseAdmin
      .rpc('get_user_by_email', { user_email: targetEmail })
      .single();

    // If RPC doesn't exist, use direct SQL query
    let userId: string | null = null;
    
    if (userError || !userData) {
      // Try to get user ID from user_profile first (if profile exists)
      const { data: profileData } = await supabaseAdmin
        .from('user_profile')
        .select('id')
        .eq('email', targetEmail)
        .single();

      if (profileData) {
        userId = profileData.id;
      } else {
        // Last resort: query auth.users via SQL (requires service role)
        // For now, we'll require the user to provide their userId
        return NextResponse.json(
          { 
            error: 'User not found',
            message: `User ${targetEmail} not found. Please ensure the user has signed up first and try logging in once.`
          },
          { status: 404 }
        );
      }
    } else {
      userId = userData.id || userData.user_id;
    }

    if (!userId) {
      return NextResponse.json(
        { 
          error: 'User not found',
          message: `Could not find user ID for ${targetEmail}. Please ensure the user has signed up first.`
        },
        { status: 404 }
      );
    }

    // Check if profile exists
    const { data: existingProfile } = await supabaseAdmin
      .from('user_profile')
      .select('is_admin, full_name, subscription_tier, subscription_status, current_tokens, tokens_remaining')
      .eq('id', userId)
      .single();

    // Set or update profile with admin privileges
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profile')
      .insert({
        id: userId,
        email: targetEmail,
        is_admin: true,
        full_name: existingProfile?.full_name || 'מנהל מערכת',
        subscription_tier: existingProfile?.subscription_tier || 'trial',
        subscription_status: existingProfile?.subscription_status || 'active',
        current_tokens: existingProfile?.current_tokens || 500,
        tokens_remaining: existingProfile?.tokens_remaining || 500,
      })
      .select()
      .single();

    if (profileError) {
      // If insert failed (likely because profile exists), try update
      const { data: updatedProfile, error: updateError } = await supabaseAdmin
        .from('user_profile')
        .update({ is_admin: true })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating profile:', updateError);
        return NextResponse.json(
          { error: 'Failed to set admin privileges', details: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Admin privileges granted to ${targetEmail}`,
        userId: userId,
        email: targetEmail,
        isAdmin: true,
        profile: updatedProfile
      });
    }

    return NextResponse.json({
      success: true,
      message: `Admin privileges granted to ${targetEmail}`,
      userId: userId,
      email: targetEmail,
      isAdmin: true,
      profile: profile
    });

  } catch (error) {
    console.error('Setup admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check admin status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'nitzandaphna@gmail.com';

    // Check profile by email (more reliable than querying auth.users)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profile')
      .select('id, is_admin, full_name, email')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({
        exists: false,
        email,
        isAdmin: false,
        message: 'User profile not found. User may need to sign up first.'
      });
    }

    return NextResponse.json({
      exists: true,
      email,
      userId: profile.id,
      isAdmin: profile.is_admin === true,
      profile: profile
    });

  } catch (error) {
    console.error('Check admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

