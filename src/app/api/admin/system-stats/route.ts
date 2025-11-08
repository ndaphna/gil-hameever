import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/get-auth-user';
import { supabaseAdmin } from '@/lib/supabase-server';

async function verifyAdmin() {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      console.log('verifyAdmin: No user found');
      return null;
    }

    console.log('verifyAdmin: Checking user', user.id, user.email);

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profile')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('verifyAdmin: Profile error', profileError);
      return null;
    }

    if (!profile) {
      console.log('verifyAdmin: No profile found for user', user.id);
      return null;
    }

    console.log('verifyAdmin: Profile found, is_admin =', profile.is_admin);

    if (!profile.is_admin) {
      console.log('verifyAdmin: User is not admin');
      return null;
    }

    return user;
  } catch (error) {
    console.error('verifyAdmin: Error', error);
    return null;
  }
}

export async function GET() {
  try {
    // Verify admin
    const adminUser = await verifyAdmin();

    if (!adminUser) {
      console.log('System stats: Admin verification failed');
      return NextResponse.json(
        { 
          error: 'Admin access required',
          message: 'You must be an administrator to access this resource. Please ensure your account has admin privileges set in the database.'
        },
        { status: 403 }
      );
    }

    console.log('System stats: Admin verified, user:', adminUser.email);

    // Get all statistics
    const [
      { count: totalUsers },
      { count: activeUsers },
      { count: totalThreads },
      { count: totalMessages },
      { count: totalEmotions },
      { data: subscriptionStats },
      { data: recentUsers }
    ] = await Promise.all([
      supabaseAdmin.from('user_profile').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('user_profile').select('*', { count: 'exact', head: true }).eq('subscription_status', 'active'),
      supabaseAdmin.from('thread').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('message').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('emotion_entry').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('user_profile').select('subscription_tier, subscription_status'),
      supabaseAdmin.from('user_profile').select('id, email, full_name, created_at').order('created_at', { ascending: false }).limit(10)
    ]);

    // Calculate subscription breakdown
    const subscriptionBreakdown = {
      trial: 0,
      basic: 0,
      premium: 0
    };

    subscriptionStats?.forEach((profile: any) => {
      if (profile.subscription_tier) {
        subscriptionBreakdown[profile.subscription_tier as keyof typeof subscriptionBreakdown] = 
          (subscriptionBreakdown[profile.subscription_tier as keyof typeof subscriptionBreakdown] || 0) + 1;
      }
    });

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalThreads: totalThreads || 0,
        totalMessages: totalMessages || 0,
        totalEmotions: totalEmotions || 0,
        subscriptionBreakdown,
        recentUsers: recentUsers || []
      }
    });

  } catch (error) {
    console.error('System stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

