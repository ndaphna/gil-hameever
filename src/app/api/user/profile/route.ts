import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/get-auth-user';
import { supabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'edge';

export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get full profile using admin client to bypass RLS
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profile')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return NextResponse.json(
        { error: 'Profile fetch failed', details: profileError.message },
        { status: 500 }
      );
    }

    if (!profile) {
      console.warn('Profile not found for user:', user.id);
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Log token values for debugging
    console.log('Profile loaded:', {
      userId: user.id,
      current_tokens: profile.current_tokens,
      tokens_remaining: profile.tokens_remaining
    });

    return NextResponse.json({
      profile,
      isAdmin: profile.is_admin === true
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
