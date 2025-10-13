# Database Migrations

## How to Apply the Schema

### Option 1: Via Supabase Dashboard (Recommended for now)

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the entire content from `20241013_initial_schema.sql`
5. Paste it into the SQL editor
6. Click **Run** to execute

### Option 2: Via Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## What This Migration Creates

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

