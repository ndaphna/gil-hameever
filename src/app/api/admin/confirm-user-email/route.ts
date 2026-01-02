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
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Create auth client with admin privileges
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

    // Find user by email
    const { data: existingUser, error: getUserError } = await supabaseAuth.auth.admin.getUserByEmail(email);
    
    if (getUserError || !existingUser?.user) {
      return NextResponse.json(
        { error: 'User not found', details: getUserError?.message },
        { status: 404 }
      );
    }

    const userId = existingUser.user.id;

    // Update user to confirm email
    const { data: updatedUser, error: updateError } = await supabaseAuth.auth.admin.updateUserById(
      userId,
      {
        email_confirm: true,
      }
    );

    if (updateError) {
      console.error('Error confirming user email:', updateError);
      return NextResponse.json(
        { error: updateError.message || 'Failed to confirm email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Email confirmed successfully for ${email}`,
      user: {
        id: updatedUser.user.id,
        email: updatedUser.user.email,
        email_confirmed_at: updatedUser.user.email_confirmed_at,
      }
    });

  } catch (error: any) {
    console.error('Confirm email error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

