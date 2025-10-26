import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Server-side Supabase config:');
console.log('URL exists:', !!supabaseUrl);
console.log('Service key exists:', !!supabaseServiceKey);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration!');
  console.error('Please check your .env.local file contains:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=your-url');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your-service-key');
  throw new Error('Supabase configuration missing');
}

// Server-side client with service role key (admin access)
console.log('Using REAL Supabase admin client to connect to your database');
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);