# System Architecture - Menopausal & Thriving SaaS Platform

## Overview

"Menopausal & Thriving" is a comprehensive SaaS platform that provides AI-powered support for women going through menopause. The platform features two AI personas:
- **Aliza**: A warm, supportive companion for daily interactions
- **Expert Agent**: A professional analyst for deep insights

## Technology Stack

- **Frontend**: Next.js 15 (React 19) with TypeScript
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Architecture Layers

### 1. Presentation Layer (Frontend)

#### Pages
- `/` - Landing page
- `/login` - Authentication
- `/dashboard` - Main user dashboard
- `/chat` - Chat interface with Aliza/Expert
- `/journal` - Daily journal entries
- `/insights` - Personalized insights
- `/token-history` - Token usage history
- `/profile` - User profile and subscription management

#### Components
- **Token Components** (`src/components/token/`)
  - `TokenBalanceDisplay` - Shows current token balance
  - `TokenTransparencyNotification` - Notifies users of token deductions
  - `LowBalanceWarning` - Warns when balance is low

- **Journal Components** (`src/components/journal/`)
  - Daily entry forms
  - Cycle tracking
  - Mood tracking
  - Symptoms logging

- **Insights Components** (`src/components/insights/`)
  - Personalized insights display
  - Analytics visualizations
  - Recommendations

### 2. Application Layer (Backend API)

#### Core API Routes

##### `/api/ai/use` (NEW - Unified AI Endpoint)
The central endpoint for ALL AI operations. Handles:
- Token validation
- OpenAI API calls
- Token deduction using TOKEN_MULTIPLIER
- Usage logging
- Transparency messaging

**Request:**
```typescript
{
  userId: string
  actionType: TokenActionType
  messages: Array<{role, content}>
  model?: string
  maxTokens?: number
  temperature?: number
  responseFormat?: {type: 'json_object' | 'text'}
  description?: string
  metadata?: object
}
```

**Response:**
```typescript
{
  success: boolean
  response?: string
  data?: any
  usage: {totalTokens, promptTokens, completionTokens}
  tokensDeducted: number
  tokensRemaining: number
  transparencyMessage: string
  warningMessage?: string
  error?: string
}
```

##### `/api/chat`
Handles chat interactions with Aliza or Expert Agent.
- Manages conversation history
- Uses `/api/ai/use` internally
- Stores messages in database

##### `/api/analyze-insights`
Generates personalized insights from journal data.
- Analyzes sleep, symptoms, mood, cycle, hormones
- Uses `/api/ai/use` internally
- Returns structured insights

##### `/api/generate-aliza-message`
Generates daily personalized messages from Aliza.
- Context-aware based on recent data
- Uses `/api/ai/use` internally
- Triggered by cron jobs

##### `/api/cron/daily-insights`
Scheduled job for generating daily insights.
- Runs once per day (6 AM)
- Processes all active users
- Calls `/api/analyze-insights` for each user
- Protected by CRON_SECRET

##### `/api/user/profile`
User profile management.
- Get/update user information
- Subscription tier
- Token balance

##### `/api/user/token-history`
Token usage history.
- Paginated list of all token transactions
- Filter by action type
- Sort by date or amount

### 3. Business Logic Layer

#### Token Engine (`src/config/token-engine.ts`)
The heart of the token economy system.

**Global Constants:**
```typescript
TOKEN_MULTIPLIER = 2  // User pays 2x OpenAI usage
```

**Functions:**
- `calculateTokenDeduction(openaiTokens)` - Calculates tokens to deduct
- `hasEnoughTokens(balance, actionType)` - Validates sufficient balance
- `getTokenWarningMessage(balance)` - Returns appropriate warning
- `formatDeductionMessage()` - Formats transparency message

**Action Types:**
All AI-driven operations are categorized:
- Chat: `chat_aliza`, `chat_expert`
- Analysis: `daily_analysis`, `sleep_analysis`, `comprehensive_analysis`, etc.
- Automation: `newsletter_generation`, `insight_generation`, `aliza_message`
- File Processing: `file_analysis`, `pdf_report`
- Other: `content_generation`, `other_ai_task`

#### Subscription Plans (`src/config/subscription-plans.ts`)
Defines all subscription tiers and their features.

**Plans:**
- **Free**: 30 tokens/month, Aliza only
- **Basic**: 60,000 tokens/month, Aliza + Analysis
- **Plus**: 150,000 tokens/month, Full access including Expert
- **Pro**: 400,000 tokens/month, Heavy usage + Priority support

**Features:**
```typescript
interface SubscriptionPlan {
  id: SubscriptionTier
  monthlyTokens: number
  priceILS: number
  priceUSD: number
  features: {
    alizaChat: boolean
    expertAgent: boolean
    dailyAnalysis: boolean
    weeklyInsights: boolean
    monthlyReports: boolean
    newsletters: boolean
    fileAnalysis: boolean
    prioritySupport: boolean
  }
}
```

#### AI Usage Service (`src/lib/ai-usage-service.ts`)
Centralized service for all AI operations.

**Main Function:**
```typescript
async function executeAIRequest(request: AIRequest): Promise<AIResponse>
```

**Process:**
1. Check token balance
2. Call OpenAI API
3. Calculate token deduction (usage × TOKEN_MULTIPLIER)
4. Deduct tokens from user balance
5. Log transaction to `token_ledger`
6. Generate transparency message
7. Return result with token information

### 4. Data Layer

#### Database Schema (Supabase/PostgreSQL)

##### Core Tables

**`user_profile`**
```sql
- id (UUID, PK, FK to auth.users)
- email (TEXT)
- first_name (TEXT)
- last_name (TEXT)
- subscription_tier (TEXT: free|basic|plus|pro)
- subscription_status (TEXT: active|cancelled|expired)
- current_tokens (INTEGER)
- tokens_remaining (INTEGER) -- Legacy, kept for compatibility
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

**`token_ledger`** (NEW - Enhanced)
```sql
- id (UUID, PK)
- user_id (UUID, FK to user_profile)
- action_type (TEXT) -- chat_aliza, daily_analysis, etc.
- openai_tokens (INTEGER) -- Actual OpenAI usage
- tokens_deducted (INTEGER) -- Amount charged to user
- tokens_before (INTEGER)
- tokens_after (INTEGER)
- token_multiplier (DECIMAL) -- Usually 2.0
- description (TEXT)
- metadata (JSONB)
- created_at (TIMESTAMPTZ)
```

**`thread`** (Chat conversations)
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- title (TEXT)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

**`message`** (Chat messages)
```sql
- id (UUID, PK)
- thread_id (UUID, FK to thread)
- user_id (UUID, FK)
- role (TEXT: user|assistant|system)
- content (TEXT)
- created_at (TIMESTAMPTZ)
```

**`daily_entries`** (Journal)
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- date (DATE)
- sleep_quality (TEXT)
- hot_flashes (BOOLEAN)
- night_sweats (BOOLEAN)
- mood (TEXT)
- energy_level (TEXT)
- notes (TEXT)
- created_at (TIMESTAMPTZ)
```

**`personalized_insights`**
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- insight_id (TEXT)
- type (TEXT)
- title (TEXT)
- content (TEXT)
- priority (TEXT)
- category (TEXT)
- actionable (BOOLEAN)
- comparison_to_norm (JSONB)
- actionable_steps (JSONB)
- aliza_message (TEXT)
- analysis_date (DATE)
- created_at (TIMESTAMPTZ)
```

##### Database Functions

**`deduct_tokens()`**
Atomically deducts tokens and logs the transaction.
```sql
SELECT * FROM deduct_tokens(
  p_user_id UUID,
  p_action_type TEXT,
  p_openai_tokens INTEGER,
  p_token_multiplier DECIMAL,
  p_description TEXT,
  p_metadata JSONB
)
```

**`add_tokens()`**
Adds tokens (refills, renewals).
```sql
SELECT * FROM add_tokens(
  p_user_id UUID,
  p_tokens INTEGER,
  p_action_type TEXT,
  p_description TEXT,
  p_metadata JSONB
)
```

##### Views

**`token_usage_summary`**
Aggregated view of token usage by action type.
```sql
SELECT 
  user_id,
  action_type,
  COUNT(*) as usage_count,
  SUM(tokens_deducted) as total_tokens_used,
  AVG(tokens_deducted) as avg_tokens_per_action
FROM token_ledger
GROUP BY user_id, action_type
```

## System Flows

### 1. User Chat Flow

```
User sends message
  ↓
Frontend calls /api/chat
  ↓
Backend validates user & tokens
  ↓
executeAIRequest() is called
  ↓
Check token balance
  ↓
Call OpenAI API
  ↓
Calculate deduction (tokens × 2)
  ↓
Deduct from user balance
  ↓
Log to token_ledger
  ↓
Save message to database
  ↓
Return response + transparency message
  ↓
Frontend displays:
  - AI response
  - Token deduction notification
  - Warning if balance low
```

### 2. Daily Insights Flow

```
Cron job triggers (6 AM)
  ↓
/api/cron/daily-insights
  ↓
For each active user:
  ↓
  Fetch journal data
  ↓
  Call /api/analyze-insights
  ↓
  executeAIRequest() with comprehensive analysis
  ↓
  Tokens deducted automatically
  ↓
  Save insights to database
  ↓
  Generate Aliza message
  ↓
  Call /api/generate-aliza-message
  ↓
  executeAIRequest() for message generation
  ↓
  Tokens deducted automatically
  ↓
  Save message to database
  ↓
User sees insights and message in dashboard
```

### 3. Token Refill Flow

```
User clicks "Refill Tokens"
  ↓
Payment processor (Cardcom)
  ↓
Webhook receives payment confirmation
  ↓
add_tokens() function called
  ↓
Tokens added to user balance
  ↓
Transaction logged to token_ledger
  ↓
User receives confirmation
```

## Security

### Authentication
- Supabase Auth with JWT tokens
- Row Level Security (RLS) on all tables
- Users can only access their own data

### API Protection
- Cron endpoints protected by CRON_SECRET
- API routes validate user session
- Admin endpoints check admin role

### Data Privacy
- All sensitive data encrypted at rest
- HIPAA-compliant practices for health data
- No third-party data sharing

## Scalability

### Performance Optimizations
- Database indexes on all foreign keys
- Efficient queries with proper pagination
- Caching of frequently accessed data

### Horizontal Scaling
- Serverless functions (Vercel)
- Database connection pooling
- CDN for static assets

### Monitoring
- Error logging and tracking
- Token usage analytics
- System health checks

## Future Enhancements

### Planned Features
1. **Multi-language support** - Beyond Hebrew
2. **Advanced analytics** - Trend predictions
3. **Export capabilities** - PDF reports
4. **API access for Pro users** - Programmatic access
5. **Mobile apps** - iOS and Android
6. **Integrations** - Wearables, health apps

### Technical Roadmap
1. **Real-time notifications** - WebSocket support
2. **Advanced caching** - Redis integration
3. **Analytics dashboard** - For admins
4. **A/B testing framework** - For UX optimization
5. **Automated backups** - Enhanced disaster recovery

## Maintenance

### Regular Tasks
- Monitor token usage patterns
- Adjust TOKEN_MULTIPLIER as needed
- Review and optimize database queries
- Update AI prompts based on user feedback
- Analyze system performance metrics

### Updates
- Keep dependencies up to date
- Regular security audits
- Performance testing
- Load testing for peak usage

## Support

### For Developers
- Code documentation in each module
- TypeScript types for all interfaces
- ESLint and Prettier configured
- Git hooks for quality checks

### For Operations
- Deployment via Vercel
- Database migrations via Supabase
- Environment variables documented
- Monitoring dashboards configured








































