import { createClient } from '@supabase/supabase-js';

// Temporary hardcoded values until we fix the env loading
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nxkjgbvjfjzhizkygmfb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54a2pnYnZqZmp6aGl6a3lnbWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNjA3MjksImV4cCI6MjA3NTkzNjcyOX0.WX4lBHJbuou-uO7P1K4m7phCisDmMKq14-PjaZfuG2w';

// Check if environment variables are properly configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration missing!');
  console.error('Please create a .env.local file with:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=your-supabase-url');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
  console.error('Get these values from: https://supabase.com/dashboard → Your Project → Settings → API');
  console.warn('⚠️ Using fallback values. Please configure your environment variables.');
}

// Use actual values if available, otherwise use fallback values
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-key';

/**
 * Create Supabase client with proper configuration for Next.js 15
 * This client is for browser-side use only
 */
export const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'sb-auth-token',
    flowType: 'pkce',
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
});

// Handle auth state changes and clear stale tokens
// This prevents "Invalid Refresh Token" errors when no valid session exists
if (typeof window !== 'undefined') {
  // Set up a single global auth state listener to avoid multiple subscriptions
  let isListenerSetup = false;
  
  if (!isListenerSetup) {
    isListenerSetup = true;
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`🔔 Global auth state change: ${event}`, session ? `User: ${session.user?.id}` : 'No session');
      
      // Clear stale tokens when signed out or when refresh token is invalid
      if (event === 'SIGNED_OUT' || (!session && event === 'TOKEN_REFRESHED')) {
        try {
          // Clear Supabase auth storage
          const supabaseKeys = Object.keys(localStorage).filter(key => 
            key.includes('supabase') || key.startsWith('sb-')
          );
          supabaseKeys.forEach(key => {
            try {
              const data = localStorage.getItem(key);
              if (data) {
                const parsed = JSON.parse(data);
                // Remove if it's auth data without valid tokens
                if (parsed && (!parsed.refresh_token || !parsed.access_token)) {
                  localStorage.removeItem(key);
                }
              }
            } catch (e) {
              // Ignore parse errors, but remove potentially corrupted data
              localStorage.removeItem(key);
            }
          });
        } catch (e) {
          // Ignore storage errors
        }
      }
    });
  }
}