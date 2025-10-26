# Database Migrations

This directory contains SQL migration files for the database schema.

## Migration Files (Run in Order)

### Core Migrations
1. `20241013_initial_schema.sql` - Initial database schema with all tables
2. `20241013_fix_schema_consistency.sql` - Fixes for schema consistency
3. `20241013_add_color_to_emotion_entry.sql` - Adds color column to emotion_entry table

### Maintenance Scripts
- `verify_and_fix_schema.sql` - **RUN THIS IF YOU HAVE ISSUES** - Automatically fixes common schema problems
- `check_database_status.sql` - Diagnostic tool to check database configuration

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

#### "Error creating profile"
- **Cause**: Missing `SUPABASE_SERVICE_ROLE_KEY` environment variable
- **Solution**: See `SETUP.md` in the root directory

#### "new row violates row-level security policy"
- **Cause**: User doesn't have a profile in `user_profile` table
- **Solution**: Run `verify_and_fix_schema.sql`

#### "relation does not exist"
- **Cause**: Migrations not run in order
- **Solution**: Run all migrations in order (1, 2, 3, then verify_and_fix)

## Schema Overview

### Tables
- `user_profile` - User information and subscription status
- `emotion_entry` - Daily emotion journal entries
- `thread` - Chat conversation threads
- `message` - Individual chat messages
- `subscription` - Subscription and billing information
- `token_ledger` - Token usage tracking

### Key Relationships
- `user_profile.id` → `auth.users.id` (CASCADE DELETE)
- `emotion_entry.user_id` → `user_profile.id` (CASCADE DELETE)
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
