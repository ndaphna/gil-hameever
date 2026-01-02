import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthUser } from '@/lib/get-auth-user';
import { supabaseAdmin } from '@/lib/supabase-server';

/**
 * API endpoint to get online status of users
 * Returns a map of user IDs to their online status
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: profile } = await supabaseAdmin
      .from('user_profile')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile || !profile.is_admin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get all active sessions from Supabase Auth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabaseAuth = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Get all active sessions
    // Note: Supabase doesn't have a direct API to get all sessions,
    // so we'll use a workaround - check last_sign_in_at and last_seen
    // For real-time status, we can check if the session was active in the last 5 minutes
    
    // Get all users with their last activity
    const { data: { users }, error: usersError } = await supabaseAuth.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error listing users:', usersError);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    // Create a map of user IDs to online status
    // A user is considered online if their last_sign_in_at is within the last 15 minutes
    // (more realistic window for "online" status)
    const onlineStatusMap: Record<string, boolean> = {};
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    users.forEach((authUser) => {
      // Check if user has a recent session
      // We'll consider them online if they signed in within the last 15 minutes
      const lastSignIn = authUser.last_sign_in_at ? new Date(authUser.last_sign_in_at) : null;
      const isOnline = lastSignIn && lastSignIn > fifteenMinutesAgo;
      
      onlineStatusMap[authUser.id] = isOnline || false;
    });

    return NextResponse.json({
      onlineStatus: onlineStatusMap,
      timestamp: now.toISOString(),
    });

  } catch (error: any) {
    console.error('Error getting online status:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

