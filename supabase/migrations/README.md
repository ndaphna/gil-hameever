# Database Migrations

This directory contains SQL migration files for the database schema.

## Migration Files (Run in Order)

### Core Migrations (Run in Order)
1. `20241013_initial_schema.sql` - Initial database schema with all tables
2. `20241013_fix_schema_consistency.sql` - Fixes for schema consistency
3. `20241013_add_color_to_emotion_entry.sql` - Adds color column to emotion_entry table
4. `20241017_add_chat_tables.sql` - Chat system tables
5. `20241024_menopause_journal_tables.sql` - Journal tables (daily_entries, cycle_entries, aliza_messages)
6. `20250118_notification_system.sql` - Notification system
7. `20250126_journal_enhancements.sql` - Enhanced journal fields

### Maintenance & Diagnostic Scripts
- `check_database_status.sql` - General database diagnostic
- `verify_and_fix_schema.sql` - General schema fixes
- `check_journal_tables_status.sql` - **NEW** ✨ Specific check for journal tables
- `verify_database_functions.sql` - **NEW** ✨ Verify required functions exist

### Fix Scripts (Use if you have specific issues)
- `fix_cycle_entries_schema.sql` - **NEW** ✨ Fix cycle_entries table structure
- `fix_daily_entries_schema.sql` - **NEW** ✨ Fix daily_entries table structure

### Mock Data Scripts (For Testing)
- `insert_mock_data_for_inbal.sql` - **NEW** 🎯 Insert comprehensive mock data for inbald@sapir.ac.il
  - 29 daily entries (15 days)
  - 16 cycle entries (3 periods)
  - 6 Aliza messages
  - Journal preferences
- Quick version available in root: `QUICK_INSERT_MOCK_DATA.sql`
- Full instructions: `INSERT_MOCK_DATA_INSTRUCTIONS.md`

## How to Run Migrations

### Option 1: Supabase Dashboard (Recommended)
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **SQL Editor** in the left menu
4. Click **New Query**
5. Copy and paste the SQL file content
6. Click **Run** (or press Ctrl+Enter)

### Option 2: Supabase CLI
```bash
# Make sure you're in the project directory
cd gil-hameever

# Run a specific migration
supabase db reset

# Or apply migrations manually
supabase db push
```

## Troubleshooting

### If you encounter errors when creating emotion entries:

1. **First, check the database status:**
   - Run `check_database_status.sql`
   - Look for "Users Without Profiles" section
   - Check if all RLS policies are enabled

2. **Then, run the fix script:**
   - Run `verify_and_fix_schema.sql`
   - This will automatically:
     - Fix column names
     - Create missing user profiles
     - Add missing columns
     - Set up RLS policies correctly

3. **Verify the fix:**
   - Run `check_database_status.sql` again
   - All checks should show ✓

### Common Issues

#### ❌ "column cycle_entries.date does not exist"
- **Cause**: The `cycle_entries` table structure is incorrect or migration didn't run
- **Solution**: 
  1. First run `check_journal_tables_status.sql` to see what's missing
  2. Then run `fix_cycle_entries_schema.sql` to fix the table
  3. **⚠️ WARNING**: This will delete existing data in cycle_entries!
- **Detailed Guide**: See `DATABASE_FIX_INSTRUCTIONS.md` in root directory

#### ❌ "column daily_entries.date does not exist"
- **Cause**: The `daily_entries` table structure is incorrect
- **Solution**: Run `fix_daily_entries_schema.sql`

#### "Error creating profile"
- **Cause**: Missing `SUPABASE_SERVICE_ROLE_KEY` environment variable
- **Solution**: See `SETUP.md` in the root directory

#### "new row violates row-level security policy"
- **Cause**: User doesn't have a profile in `user_profile` table
- **Solution**: Run `verify_and_fix_schema.sql`

#### "relation does not exist"
- **Cause**: Migrations not run in order
- **Solution**: Run all migrations in order (1-7, then verify_and_fix)

## Schema Overview

### Core Tables
- `user_profile` - User information and subscription status
- `emotion_entry` - Daily emotion journal entries (legacy)
- `thread` - Chat conversation threads
- `message` - Individual chat messages
- `subscription` - Subscription and billing information
- `token_ledger` - Token usage tracking

### Journal Tables (New)
- `daily_entries` - Daily symptom tracking (morning & evening)
- `cycle_entries` - Menstrual cycle tracking
- `aliza_messages` - Smart messages from Aliza
- `journal_trends` - Calculated insights and trends
- `journal_preferences` - User journal settings and preferences

### Key Relationships
- `user_profile.id` → `auth.users.id` (CASCADE DELETE)
- `emotion_entry.user_id` → `user_profile.id` (CASCADE DELETE)
- `daily_entries.user_id` → `user_profile.id` (CASCADE DELETE)
- `cycle_entries.user_id` → `user_profile.id` (CASCADE DELETE)
- `aliza_messages.user_id` → `user_profile.id` (CASCADE DELETE)
- `journal_trends.user_id` → `user_profile.id` (CASCADE DELETE)
- `journal_preferences.user_id` → `user_profile.id` (CASCADE DELETE)
- `thread.user_id` → `user_profile.id` (CASCADE DELETE)
- `message.user_id` → `user_profile.id` (CASCADE DELETE)

### Security
All tables have RLS (Row Level Security) enabled with policies that ensure:
- Users can only access their own data
- Cascading deletes protect data integrity
- Service role can bypass RLS for admin operations

## What the Initial Migration Creates

### Tables:
1. **user_profile** - User data and subscription info
2. **thread** - Chat conversations with Aliza
3. **message** - Individual messages in threads
4. **emotion_entry** - Daily emotion journal entries
5. **subscription** - Stripe subscription details
6. **token_ledger** - Token usage tracking

### Security:
- Row Level Security (RLS) enabled on all tables
- Each user can only see their own data
- Automatic profile creation on signup

### Performance:
- Indexes on foreign keys
- Updated_at auto-update triggers
