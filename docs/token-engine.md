# Token Engine Documentation

## Overview

The Token Engine is the core economic system of the "Menopausal & Thriving" platform. It manages all AI usage, ensures transparency, and maintains profitability while providing value to users.

## Core Concepts

### TOKEN_MULTIPLIER

The global constant that determines platform profitability:

```typescript
TOKEN_MULTIPLIER = 2
```

**Formula:**
```
tokensToDeduct = openaiUsage.total_tokens × TOKEN_MULTIPLIER
```

**Example:**
- OpenAI uses 500 tokens for a response
- User is charged: 500 × 2 = 1,000 tokens
- Platform margin: 100% (1x OpenAI cost)

### Why a Multiplier?

1. **Cost Coverage**: Covers OpenAI API costs
2. **Infrastructure**: Pays for hosting, database, bandwidth
3. **Development**: Supports ongoing development and maintenance
4. **Sustainability**: Ensures long-term platform viability
5. **Support**: Funds customer support and improvements

### Adjusting the Multiplier

The TOKEN_MULTIPLIER can be adjusted based on:
- OpenAI pricing changes
- Platform costs
- Competitive analysis
- Profitability targets

**Location:** `src/config/token-engine.ts`

To change:
```typescript
// Current
export const TOKEN_MULTIPLIER = 2;

// To increase margin to 150%
export const TOKEN_MULTIPLIER = 2.5;

// To reduce margin to 50%
export const TOKEN_MULTIPLIER = 1.5;
```

## Token Action Types

Every AI operation must be categorized:

```typescript
const TOKEN_ACTION_TYPES = {
  // Chat
  CHAT_ALIZA: 'chat_aliza',
  CHAT_EXPERT: 'chat_expert',
  
  // Analysis
  DAILY_ANALYSIS: 'daily_analysis',
  COMPREHENSIVE_ANALYSIS: 'comprehensive_analysis',
  SLEEP_ANALYSIS: 'sleep_analysis',
  SYMPTOMS_ANALYSIS: 'symptoms_analysis',
  MOOD_ANALYSIS: 'mood_analysis',
  CYCLE_ANALYSIS: 'cycle_analysis',
  HORMONES_ANALYSIS: 'hormones_analysis',
  TRENDS_ANALYSIS: 'trends_analysis',
  
  // Automation
  NEWSLETTER_GENERATION: 'newsletter_generation',
  INSIGHT_GENERATION: 'insight_generation',
  ALIZA_MESSAGE: 'aliza_message',
  
  // File Processing
  FILE_ANALYSIS: 'file_analysis',
  PDF_REPORT: 'pdf_report',
  TEXT_ANALYSIS: 'text_analysis',
  
  // Other
  CONTENT_GENERATION: 'content_generation',
  OTHER_AI_TASK: 'other_ai_task',
};
```

## Token Flow

### 1. Token Deduction Process

```typescript
// Step 1: User initiates AI request
const aiResult = await executeAIRequest({
  userId: 'user-123',
  actionType: TOKEN_ACTION_TYPES.CHAT_ALIZA,
  messages: [...],
  model: 'gpt-4o',
  maxTokens: 1000,
  temperature: 0.7,
});

// Step 2: System checks balance
// - Validates user has sufficient tokens
// - Estimates cost based on action type

// Step 3: OpenAI API call
// - Sends request to OpenAI
// - Receives response and usage data

// Step 4: Calculate deduction
const openaiTokens = 500;  // From OpenAI response
const tokensToDeduct = openaiTokens * TOKEN_MULTIPLIER;  // 1000

// Step 5: Deduct tokens
// - Update user_profile.current_tokens
// - Maintain atomicity

// Step 6: Log transaction
// - Insert into token_ledger
// - Record all relevant data

// Step 7: Return result
// - AI response
// - Tokens deducted: 1000
// - Tokens remaining: X
// - Transparency message
```

### 2. Token Addition (Refills)

```typescript
// When user purchases tokens
await add_tokens(
  userId: 'user-123',
  tokens: 50000,
  actionType: 'refill',
  description: 'Token refill - Medium pack',
  metadata: {
    paymentId: 'pay_xyz',
    amount: 69,
    currency: 'ILS'
  }
);

// Result:
// - Tokens added to balance
// - Transaction logged with negative deduction (-50000)
// - User notified
```

## Token Transparency

### Principle

**Every AI operation must be visible to the user.**

### Implementation

1. **Real-time Notifications**
```typescript
<TokenTransparencyNotification
  message="המערכת השתמשה ב-1,000 טוקנים לביצוע הפעולה"
  tokensDeducted={1000}
  tokensRemaining={49000}
  warningMessage={balance < 1000 ? "יתרה נמוכה" : undefined}
/>
```

2. **Balance Display**
```typescript
<TokenBalanceDisplay balance={49000} />
```

3. **Low Balance Warnings**
```typescript
<LowBalanceWarning balance={500} />
// Shows: "⚠️ זהירות! נותרו רק 500 טוקנים"
```

4. **Token History Page**
- Complete log of all transactions
- Filter by action type
- Sort by date or amount
- Export capabilities

### Warning Thresholds

```typescript
const TOKEN_WARNING_THRESHOLDS = {
  CRITICAL: 100,    // Red alert
  LOW: 1000,        // Orange warning
  REMINDER: 5000,   // Yellow reminder
};
```

## Token Costs

### Estimated Costs per Action

```typescript
const TOKEN_COST_ESTIMATES = {
  chat_aliza: 500,
  chat_expert: 1000,
  daily_analysis: 2000,
  comprehensive_analysis: 5000,
  pdf_report: 3000,
  file_analysis: 4000,
  newsletter_generation: 2500,
};
```

These estimates are used for:
- Pre-validation (checking balance before operation)
- User warnings ("This will use ~2000 tokens")
- Subscription recommendations

### Actual Costs

Actual costs vary based on:
- Input length (user message, journal data)
- Output length (AI response complexity)
- Model used (gpt-4o vs gpt-3.5-turbo)
- Temperature setting
- Number of iterations

## Token Logging

### Database Structure

```sql
CREATE TABLE token_ledger (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profile(id),
  action_type TEXT NOT NULL,
  openai_tokens INTEGER DEFAULT 0,
  tokens_deducted INTEGER NOT NULL,
  tokens_before INTEGER NOT NULL,
  tokens_after INTEGER NOT NULL,
  token_multiplier DECIMAL(10,2) DEFAULT 2.0,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Log Entry Example

```json
{
  "id": "uuid-123",
  "user_id": "user-456",
  "action_type": "chat_aliza",
  "openai_tokens": 500,
  "tokens_deducted": 1000,
  "tokens_before": 50000,
  "tokens_after": 49000,
  "token_multiplier": 2.0,
  "description": "Chat with Aliza",
  "metadata": {
    "conversationId": "conv-789",
    "messageLength": 150,
    "model": "gpt-4o"
  },
  "created_at": "2025-01-23T10:30:00Z"
}
```

### Querying Logs

```sql
-- Get user's token history
SELECT * FROM token_ledger
WHERE user_id = 'user-456'
ORDER BY created_at DESC
LIMIT 50;

-- Get usage summary by action type
SELECT 
  action_type,
  COUNT(*) as count,
  SUM(tokens_deducted) as total_tokens,
  AVG(tokens_deducted) as avg_tokens
FROM token_ledger
WHERE user_id = 'user-456'
  AND tokens_deducted > 0
GROUP BY action_type
ORDER BY total_tokens DESC;

-- Get daily usage
SELECT 
  DATE(created_at) as date,
  SUM(tokens_deducted) as daily_usage
FROM token_ledger
WHERE user_id = 'user-456'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## Best Practices

### For Developers

1. **Always use executeAIRequest()**
   - Never call OpenAI directly
   - Ensures consistent token handling
   - Automatic logging and transparency

2. **Set appropriate action types**
   ```typescript
   // Good
   actionType: TOKEN_ACTION_TYPES.CHAT_ALIZA
   
   // Bad
   actionType: 'chat'
   ```

3. **Provide meaningful descriptions**
   ```typescript
   // Good
   description: "Daily analysis for 2025-01-23"
   
   // Bad
   description: "analysis"
   ```

4. **Include relevant metadata**
   ```typescript
   metadata: {
     conversationId: '...',
     entriesAnalyzed: 7,
     insightsGenerated: 5,
   }
   ```

5. **Handle insufficient tokens gracefully**
   ```typescript
   if (!aiResult.success && aiResult.error === 'Insufficient tokens') {
     // Show refill prompt
     // Don't show generic error
   }
   ```

### For Operations

1. **Monitor TOKEN_MULTIPLIER effectiveness**
   - Is it covering costs?
   - Is it competitive?
   - Are users complaining about pricing?

2. **Analyze token consumption patterns**
   - Which features use most tokens?
   - Are estimates accurate?
   - Any abuse or unusual patterns?

3. **Review pricing regularly**
   - OpenAI pricing changes
   - Competitor pricing
   - User feedback
   - Profitability margins

4. **Set up alerts**
   - Users running out frequently
   - Unusual token spikes
   - System errors in token deduction

## Token Economics

### Subscription Tiers

```typescript
Free Plan:
  - Monthly Tokens: 30
  - Cost to Platform: ~$0.003 (15 tokens × $0.0002)
  - Revenue: $0
  - Use Case: Trial / Acquisition

Basic Plan:
  - Monthly Tokens: 60,000
  - Cost to Platform: ~$6 (30,000 tokens × $0.0002)
  - Revenue: $15 (₪49)
  - Margin: $9 (150%)

Plus Plan:
  - Monthly Tokens: 150,000
  - Cost to Platform: ~$15 (75,000 tokens × $0.0002)
  - Revenue: $30 (₪99)
  - Margin: $15 (100%)

Pro Plan:
  - Monthly Tokens: 400,000
  - Cost to Platform: ~$40 (200,000 tokens × $0.0002)
  - Revenue: $60 (₪199)
  - Margin: $20 (50%)
```

*Note: Costs based on GPT-4o pricing (~$0.0002/token). Actual costs vary.*

### Refill Packs

Token refills provide additional revenue:

```typescript
Small Pack: 30,000 tokens for ₪29
  - Platform cost: ~$3
  - Revenue: ~$9
  - Margin: ~$6 (200%)

Medium Pack: 80,000 tokens for ₪69
  - Platform cost: ~$8
  - Revenue: ~$20
  - Margin: ~$12 (150%)

Large Pack: 200,000 tokens for ₪149
  - Platform cost: ~$20
  - Revenue: ~$45
  - Margin: ~$25 (125%)
```

## Troubleshooting

### User Runs Out of Tokens

1. Check their subscription tier
2. Review recent usage in token_ledger
3. Look for unusual patterns
4. Offer appropriate refill or upgrade

### Token Deduction Failed

```typescript
// Check logs for:
- Database transaction errors
- Race conditions (concurrent requests)
- Balance calculation errors

// Fix by:
1. Verify user balance
2. Check token_ledger for duplicates
3. Manual adjustment if needed
4. Update code to prevent recurrence
```

### Tokens Not Deducted

```typescript
// Check:
1. Is executeAIRequest() being called?
2. Are there any errors in the logs?
3. Is the action_type valid?
4. Is token_ledger table accessible?

// Fix:
1. Ensure all AI calls use unified service
2. Check database permissions
3. Verify RLS policies
4. Test token deduction manually
```

### Negative Token Balance

```typescript
// Should never happen due to checks
// If it does:
1. Find the user
2. Review token_ledger for that user
3. Identify the problematic transaction
4. Add tokens to restore positive balance
5. Fix the code that allowed it
```

## API Reference

### executeAIRequest()

```typescript
async function executeAIRequest(
  request: AIRequest
): Promise<AIResponse>

interface AIRequest {
  userId: string
  actionType: TokenActionType
  messages: Array<{role, content}>
  model?: string
  maxTokens?: number
  temperature?: number
  responseFormat?: {type: 'json_object' | 'text'}
  description?: string
  metadata?: Record<string, any>
}

interface AIResponse {
  success: boolean
  response?: string
  data?: any
  usage?: {totalTokens, promptTokens, completionTokens}
  tokensDeducted: number
  tokensRemaining: number
  transparencyMessage: string
  warningMessage?: string
  error?: string
}
```

### checkTokenBalance()

```typescript
async function checkTokenBalance(
  userId: string,
  actionType: TokenActionType
): Promise<{
  hasEnough: boolean
  currentBalance: number
  estimatedCost: number
  warningMessage?: string
}>
```

### getTokenHistory()

```typescript
async function getTokenHistory(
  userId: string,
  limit?: number,
  offset?: number
): Promise<{
  success: boolean
  history?: TokenHistoryEntry[]
  total?: number
  error?: string
}>
```

## Future Enhancements

### Planned Features

1. **Dynamic Pricing**
   - Adjust TOKEN_MULTIPLIER per action type
   - Peak/off-peak pricing
   - Bulk discounts

2. **Token Rollover**
   - Unused tokens carry to next month
   - Limited rollover (e.g., 20% max)

3. **Token Gifting**
   - Users can gift tokens to others
   - Referral bonuses

4. **Token Subscription Tiers**
   - Pay-as-you-go option
   - Annual plans with discount

5. **Advanced Analytics**
   - Token usage predictions
   - Personalized recommendations
   - Cost optimization suggestions

## Conclusion

The Token Engine is designed to be:
- **Transparent**: Users always know what they're paying for
- **Fair**: Consistent pricing based on actual usage
- **Flexible**: Easy to adjust based on market conditions
- **Scalable**: Handles growth without modification
- **Profitable**: Ensures platform sustainability

**Key Takeaway:** Every token matters. By using the TOKEN_MULTIPLIER system, we ensure transparency, profitability, and user trust.


























