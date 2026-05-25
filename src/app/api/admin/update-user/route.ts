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
    const { userId, updates } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Prevent admin from removing their own admin status
    if (updates.is_admin === false && userId === adminUser.id) {
      return NextResponse.json(
        { error: 'Cannot remove your own admin status' },
        { status: 400 }
      );
    }

    // Admin "tokens" input maps to the chat wallet by default. To touch the
    // analysis wallet, the UI must pass `analysis_credits` explicitly.
    // The DB trigger derives current_tokens/tokens_remaining from the wallets.
    if (updates.tokens_remaining !== undefined || updates.current_tokens !== undefined) {
      const legacyValue = updates.current_tokens ?? updates.tokens_remaining ?? 0;
      updates.chat_credits = legacyValue;
      delete updates.current_tokens;
      delete updates.tokens_remaining;
      console.log('🔄 Admin update: legacy token input routed to chat_credits', { userId, value: legacyValue });
    }

    console.log('📝 Updating user profile:', { userId, updates });

    // Update user profile
    const { data, error } = await supabaseAdmin
      .from('user_profile')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating user:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('✅ User updated successfully:', {
      userId,
      chat_credits: data?.chat_credits,
      analysis_credits: data?.analysis_credits,
    });

    return NextResponse.json({
      success: true,
      user: data
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

