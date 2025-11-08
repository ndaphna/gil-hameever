import { createClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';

export async function getAuthUser() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return null;
    }

    const headersList = await headers();
    const cookieStore = await cookies();
    
    // Method 1: Try to get token from Authorization header (preferred)
    const authHeader = headersList.get('authorization');
    let accessToken: string | undefined;
    
    if (authHeader?.startsWith('Bearer ')) {
      accessToken = authHeader.replace('Bearer ', '');
    }
    
    // Method 2: Try to get from cookies if no header
    if (!accessToken) {
      const projectRef = supabaseUrl.split('//')[1]?.split('.')[0];
      const cookieName = projectRef ? `sb-${projectRef}-auth-token` : null;
      
      if (cookieName) {
        const authCookie = cookieStore.get(cookieName);
        if (authCookie?.value) {
          try {
            const cookieData = JSON.parse(authCookie.value);
            accessToken = cookieData.access_token;
          } catch {
            accessToken = authCookie.value;
          }
        }
      }
    }
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: accessToken ? {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      } : undefined,
    });

    // Try to get user
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken || undefined);

    if (userError) {
      console.error('Error getting user:', userError.message);
      // Try session as fallback
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
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

