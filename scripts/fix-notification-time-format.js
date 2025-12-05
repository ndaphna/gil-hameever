/**
 * Script to fix notification time format in Supabase
 * 
 * This script fixes invalid time formats like "20:1" -> "20:01"
 * 
 * Usage:
 *   node scripts/fix-notification-time-format.js
 * 
 * Make sure to set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Normalize time format (e.g., "20:1" -> "20:01")
 */
function normalizeTime(timeStr) {
  if (!timeStr || !timeStr.includes(':')) {
    return '09:00'; // Default
  }

  const [hour, minute] = timeStr.split(':').map(Number);
  
  if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return '09:00'; // Invalid, return default
  }

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/**
 * Fix time format in a JSONB field
 */
async function fixTimeFormat(fieldName) {
  console.log(`\n🔧 Fixing ${fieldName} time format...`);

  // Get all preferences
  const { data: preferences, error: fetchError } = await supabase
    .from('notification_preferences')
    .select('id, user_id, ' + fieldName);

  if (fetchError) {
    console.error(`❌ Error fetching preferences:`, fetchError);
    return { fixed: 0, errors: [fetchError.message] };
  }

  if (!preferences || preferences.length === 0) {
    console.log(`   No preferences found`);
    return { fixed: 0, errors: [] };
  }

  let fixed = 0;
  const errors = [];

  for (const pref of preferences) {
    const fieldData = pref[fieldName];
    if (!fieldData || !fieldData.time) continue;

    const currentTime = fieldData.time;
    const normalizedTime = normalizeTime(currentTime);

    // Only update if time format changed
    if (currentTime !== normalizedTime) {
      const updatedField = {
        ...fieldData,
        time: normalizedTime
      };

      const { error: updateError } = await supabase
        .from('notification_preferences')
        .update({
          [fieldName]: updatedField,
          updated_at: new Date().toISOString()
        })
        .eq('id', pref.id);

      if (updateError) {
        console.error(`   ❌ Error updating user ${pref.user_id}:`, updateError.message);
        errors.push({ userId: pref.user_id, error: updateError.message });
      } else {
        console.log(`   ✅ Fixed user ${pref.user_id}: "${currentTime}" -> "${normalizedTime}"`);
        fixed++;
      }
    }
  }

  return { fixed, errors };
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting notification time format fix...\n');

  const results = {
    email: await fixTimeFormat('email'),
    whatsapp: await fixTimeFormat('whatsapp'),
    push: await fixTimeFormat('push')
  };

  console.log('\n📊 Summary:');
  console.log(`   Email: ${results.email.fixed} fixed, ${results.email.errors.length} errors`);
  console.log(`   WhatsApp: ${results.whatsapp.fixed} fixed, ${results.whatsapp.errors.length} errors`);
  console.log(`   Push: ${results.push.fixed} fixed, ${results.push.errors.length} errors`);

  const totalFixed = results.email.fixed + results.whatsapp.fixed + results.push.fixed;
  const totalErrors = results.email.errors.length + results.whatsapp.errors.length + results.push.errors.length;

  if (totalFixed > 0) {
    console.log(`\n✅ Successfully fixed ${totalFixed} time formats!`);
  } else {
    console.log(`\n✅ No time formats needed fixing (all are already correct)`);
  }

  if (totalErrors > 0) {
    console.log(`\n⚠️  ${totalErrors} errors occurred. Check the logs above.`);
    process.exit(1);
  }

  // Verify the fix
  console.log('\n🔍 Verifying fix...');
  const { data: sample, error: verifyError } = await supabase
    .from('notification_preferences')
    .select('user_id, email, whatsapp, push')
    .limit(5);

  if (verifyError) {
    console.error('❌ Error verifying:', verifyError);
  } else {
    console.log('\nSample results:');
    sample?.forEach(pref => {
      console.log(`   User ${pref.user_id}:`);
      console.log(`     Email: ${pref.email?.time || 'N/A'}`);
      console.log(`     WhatsApp: ${pref.whatsapp?.time || 'N/A'}`);
      console.log(`     Push: ${pref.push?.time || 'N/A'}`);
    });
  }
}

main().catch(console.error);

