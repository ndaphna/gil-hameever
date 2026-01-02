/**
 * Script to confirm user email in Supabase
 * Usage: node scripts/confirm-user-email.js <email>
 * Example: node scripts/confirm-user-email.js noa@noastirling.com
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration!');
  console.error('Please ensure .env.local contains:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const email = process.argv[2];

if (!email) {
  console.error('❌ Email is required!');
  console.error('Usage: node scripts/confirm-user-email.js <email>');
  console.error('Example: node scripts/confirm-user-email.js noa@noastirling.com');
  process.exit(1);
}

async function confirmUserEmail() {
  try {
    console.log(`\n🔍 Looking for user: ${email}`);
    
    const supabaseAuth = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // List all users and find by email
    console.log('📋 Fetching users list...');
    const { data: { users }, error: listError } = await supabaseAuth.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listing users:', listError.message);
      process.exit(1);
    }

    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      console.error('❌ User not found in database');
      console.error(`   Searched ${users.length} users`);
      process.exit(1);
    }

    const userId = user.id;
    const currentStatus = user.email_confirmed_at ? 'confirmed' : 'not confirmed';
    
    console.log(`✅ User found: ${userId}`);
    console.log(`📧 Current email status: ${currentStatus}`);

    if (user.email_confirmed_at) {
      console.log('ℹ️  Email is already confirmed!');
      console.log(`   Confirmed at: ${user.email_confirmed_at}`);
      return;
    }

    // Update user to confirm email
    console.log('\n🔄 Confirming email...');
    const { data: updatedUser, error: updateError } = await supabaseAuth.auth.admin.updateUserById(
      userId,
      {
        email_confirm: true,
      }
    );

    if (updateError) {
      console.error('❌ Error confirming email:', updateError.message);
      process.exit(1);
    }

    console.log('✅ Email confirmed successfully!');
    console.log(`\n📋 User Details:`);
    console.log(`   ID: ${updatedUser.user.id}`);
    console.log(`   Email: ${updatedUser.user.email}`);
    console.log(`   Confirmed at: ${updatedUser.user.email_confirmed_at}`);
    console.log(`\n✨ The user can now log in to the system!\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

confirmUserEmail();

