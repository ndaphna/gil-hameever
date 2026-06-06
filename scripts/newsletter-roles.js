/**
 * List (and optionally set) newsletter team roles.
 *
 * Read-only:   node scripts/newsletter-roles.js
 * Grant role:  node scripts/newsletter-roles.js set <email> <admin|campaign_manager|content_creator>
 *
 * Roles hierarchy: admin > campaign_manager > content_creator.
 * Broadcasting to the list requires campaign_manager (or admin).
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
const db = admin.schema('newsletter');

async function emailFor(userId) {
  const { data } = await admin.auth.admin.getUserById(userId);
  return data?.user?.email ?? '(unknown)';
}

async function list() {
  const { data, error } = await db.from('user_roles').select('user_id, role, created_at');
  if (error) { console.error('query failed:', error.message); process.exit(1); }
  if (!data?.length) { console.log('No newsletter roles assigned.'); return; }
  console.log('Current newsletter roles:');
  for (const r of data) {
    console.log(`  ${(await emailFor(r.user_id)).padEnd(32)} ${r.role}`);
  }
}

async function userIdForEmail(email) {
  // Resolve via existing user_roles rows (avoids the flaky listUsers paginator).
  const { data, error } = await db.from('user_roles').select('user_id');
  if (error) { console.error('query failed:', error.message); process.exit(1); }
  for (const r of data ?? []) {
    if ((await emailFor(r.user_id)).toLowerCase() === email.toLowerCase()) return r.user_id;
  }
  return null;
}

async function set(email, role) {
  const valid = ['admin', 'campaign_manager', 'content_creator'];
  if (!valid.includes(role)) { console.error(`role must be one of ${valid.join(', ')}`); process.exit(1); }
  const userId = await userIdForEmail(email);
  if (!userId) {
    console.error(`No existing role row for ${email}. Add them via the app once, then re-run.`);
    process.exit(1);
  }
  const { error } = await db
    .from('user_roles')
    .upsert({ user_id: userId, role }, { onConflict: 'user_id' });
  if (error) { console.error('upsert failed:', error.message); process.exit(1); }
  console.log(`Set ${email} → ${role}.`);
}

async function prune() {
  const { data, error } = await db.from('user_roles').select('user_id, role');
  if (error) { console.error('query failed:', error.message); process.exit(1); }
  for (const r of data ?? []) {
    const { data: u } = await admin.auth.admin.getUserById(r.user_id);
    if (!u || !u.user) {
      const { error: de } = await db.from('user_roles').delete().eq('user_id', r.user_id);
      console.log(de ? `delete failed: ${de.message}` : `pruned orphan ${r.user_id} (${r.role})`);
    }
  }
}

(async () => {
  const [cmd, email, role] = process.argv.slice(2);
  if (cmd === 'set') await set(email, role);
  else if (cmd === 'prune') await prune();
  else await list();
})();
