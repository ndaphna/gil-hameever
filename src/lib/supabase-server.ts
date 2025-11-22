import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('\n' + '='.repeat(60));
console.log('🔍 Checking Supabase Configuration...');
console.log('='.repeat(60));
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n' + '⚠️ '.repeat(20));
  console.error('❌ CRITICAL ERROR: Missing Supabase Configuration!');
  console.error('⚠️ '.repeat(20));
  console.error('\n📝 TO FIX THIS:');
  console.error('1. Create a file named: .env.local');
  console.error('2. Location: Root directory (next to package.json)');
  console.error('3. Add these lines:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  console.error('\n🔗 Get values from: https://supabase.com/dashboard');
  console.error('   → Settings → API\n');
  console.error('📖 See SETUP_COMPLETE_GUIDE.md for detailed instructions\n');
  console.error('='.repeat(60) + '\n');
} else {
  console.log('✅ Supabase configured successfully!');
  console.log('🔗 Connected to:', supabaseUrl.substring(0, 30) + '...');
  console.log('='.repeat(60) + '\n');
}

// Always create client (will fail gracefully if config is missing)
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key'
);
