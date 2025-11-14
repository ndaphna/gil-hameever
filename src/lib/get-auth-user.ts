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
    
    // Debug: Log available cookies and headers (only in development)
    if (process.env.NODE_ENV === 'development') {
      const allCookies = cookieStore.getAll();
      console.log('🍪 Available cookies:', allCookies.map(c => `${c.name}=${c.value.substring(0, 20)}...`).join(', '));
      console.log('📋 Authorization header:', headersList.get('authorization') ? 'Present' : 'Missing');
    }
    
    // Method 1: Try to get token from Authorization header (preferred)
    const authHeader = headersList.get('authorization');
    let accessToken: string | undefined;
    
    if (authHeader?.startsWith('Bearer ')) {
      accessToken = authHeader.replace('Bearer ', '');
    }
    
    // Method 2: Try to get from cookies if no header
    if (!accessToken) {
      const projectRef = supabaseUrl.split('//')[1]?.split('.')[0];
      
      // Try multiple possible cookie names
      const possibleCookieNames = [
        projectRef ? `sb-${projectRef}-auth-token` : null,
        'sb-access-token',
        'supabase.auth.token',
        ...(projectRef ? [`sb-${projectRef}-auth-token.0`, `sb-${projectRef}-auth-token.1`] : [])
      ].filter(Boolean) as string[];
      
      for (const cookieName of possibleCookieNames) {
        const authCookie = cookieStore.get(cookieName);
        if (authCookie?.value) {
          try {
            const cookieData = JSON.parse(authCookie.value);
            accessToken = cookieData.access_token || cookieData;
            if (accessToken) break;
          } catch {
            // If not JSON, try as direct token
            if (authCookie.value.length > 50) { // Likely a token
              accessToken = authCookie.value;
              break;
            }
          }
        }
      }
      
      // Method 3: Try to find any cookie that looks like a Supabase auth token
      if (!accessToken) {
        const allCookies = cookieStore.getAll();
        for (const cookie of allCookies) {
          const name = cookie.name.toLowerCase();
          if ((name.includes('sb-') || name.includes('supabase')) && cookie.value.length > 50) {
            try {
              const parsed = JSON.parse(cookie.value);
              if (parsed.access_token) {
                accessToken = parsed.access_token;
                break;
              }
            } catch {
              // Try as direct token
              accessToken = cookie.value;
              break;
            }
          }
        }
      }
    }
    
    // Create Supabase client with proper cookie handling
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

    // Try to get user - first with token if available, then try getSession
    let user = null;
    let userError = null;
    
    if (accessToken) {
      const result = await supabase.auth.getUser(accessToken);
      user = result.data.user;
      userError = result.error;
    }
    
    // If getUser failed or no token, try getSession as fallback
    if (!user) {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (session?.user && !sessionError) {
        user = session.user;
        userError = null;
      } else if (sessionError) {
        userError = sessionError;
      }
    }

    if (userError) {
      console.error('Error getting user:', userError.message);
      return null;
    }

    if (!user) {
      console.log('❌ No authenticated user found - Auth session missing!');
      console.log('🔍 Debug info:', {
        hasAccessToken: !!accessToken,
        accessTokenLength: accessToken?.length,
        cookieCount: cookieStore.getAll().length
      });
      return null;
    }

    console.log('✅ Authenticated user found:', user.id);
    return user;
  } catch (error) {
    console.error('Error in getAuthUser:', error);
    return null;
  }
}

