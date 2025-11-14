import { createClient } from '@supabase/supabase-js';

// Temporary hardcoded values until we fix the env loading
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nxkjgbvjfjzhizkygmfb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54a2pnYnZqZmp6aGl6a3lnbWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNjA3MjksImV4cCI6MjA3NTkzNjcyOX0.WX4lBHJbuou-uO7P1K4m7phCisDmMKq14-PjaZfuG2w';

console.log('🔍 Debug Info:');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);
console.log('All SUPABASE env vars:', Object.keys(process.env).filter(key => key.includes('SUPABASE')));
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Raw values:', {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  urlType: typeof process.env.NEXT_PUBLIC_SUPABASE_URL,
  keyType: typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
});

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

export const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
});