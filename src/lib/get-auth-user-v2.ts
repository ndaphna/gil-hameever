import { createClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';
import { supabaseAdmin } from './supabase-server';

/**
 * Get authenticated user from request
 * Tries multiple methods to get the user session
 */
export async function getAuthUser() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return null;
    }

    // Method 1: Try to get from cookies
    const cookieStore = await cookies();
    const headersList = await headers();
    
    // Get access token from various possible cookie names
    const possibleCookieNames = [
      'sb-access-token',
      'sb-refresh-token',
      `sb-${supabaseUrl.split('//')[1]?.split('.')[0]}-auth-token`,
      'supabase.auth.token'
    ];

    let accessToken: string | undefined;
    for (const name of possibleCookieNames) {
      const cookie = cookieStore.get(name);
      if (cookie?.value) {
        accessToken = cookie.value;
        break;
      }
    }

    // Method 2: Try to get from Authorization header
    const authHeader = headersList.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      accessToken = authHeader.replace('Bearer ', '');
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: accessToken ? {
          Authorization: `Bearer ${accessToken}`
        } : undefined
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    // Try to get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error getting user:', userError.message);
      
      // If getUser failed, try to get from session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (session?.user && !sessionError) {
        return session.user;
      }
      
      return null;
    }

    if (!user) {
      console.log('No authenticated user found');
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error in getAuthUser:', error);
    return null;
  }
}

/**
 * Alternative: Get user directly from admin client using user ID
 * This bypasses RLS and can be used if we have the user ID
 */
export async function getAuthUserById(userId: string) {
  try {
    const { data: user, error } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (error || !user) {
      return null;
    }
    
    return user.user;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}



