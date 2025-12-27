# OpenAI Integration Documentation

## Overview

The platform integrates with OpenAI's GPT-4o model to provide AI-powered features. All OpenAI interactions are centralized through the `executeAIRequest()` service, ensuring consistent token management and logging.

## API Configuration

### Environment Variables

```bash
# Required
OPENAI_API_KEY=sk-...your-key-here...

# Optional - for testing
OPENAI_ORGANIZATION=org-...your-org-id...
```

### API Settings

```typescript
// Default configuration
const DEFAULT_CONFIG = {
  model: 'gpt-4o',          // Primary model
  maxTokens: 2000,           // Default response limit
  temperature: 0.7,          // Balance creativity/consistency
  apiVersion: '2024-01-01',  // API version
};
```

## Models Used

### GPT-4o (Primary)

**Use Cases:**
- Chat with Aliza
- Chat with Expert Agent
- Daily insights analysis
- Newsletter generation
- Message generation

**Characteristics:**
- Fast response times
- Cost-effective
- High quality outputs
- Supports JSON mode
- 128K context window

**Pricing (as of 2025):**
- Input: ~$2.50 per 1M tokens
- Output: ~$10.00 per 1M tokens
- Average: ~$0.0002 per token (mixed)

### GPT-3.5-turbo (Fallback)

**Use Cases:**
- Fallback when GPT-4o unavailable
- Simple tasks
- Testing

**Characteristics:**
- Faster than GPT-4
- Lower cost
- Good for simple tasks
- 16K context window

## System Prompts

### Aliza Persona

```typescript
const ALIZA_SYSTEM_PROMPT = `את עליזה, יועצת אישית מקצועית לגיל המעבר. 
את מומחית בתמיכה בנשים במהלך תקופת גיל המעבר.

תפקידך:
- לספק תמיכה רגשית ומקצועית
- לתת עצות מעשיות להתמודדות עם תסמיני גיל המעבר
- לעודד אורח חיים בריא
- להציע דרכים להתמודדות עם שינויים הורמונליים
- להיות אמפתית ומבינה

כללי התנהגות:
- השתמשי בשפה חמה ומעודדת
- התמקדי בפתרונות מעשיים
- הזכירי שזה תהליך טבעי
- עודדי פנייה לרופא/ה כשצריך
- השתמשי בשפה עברית בלבד

תגיבי בהודעות קצרות וממוקדות (עד 200 מילים).`;
```

### Expert Agent Persona

```typescript
const EXPERT_SYSTEM_PROMPT = `את סוכנת מומחית לגיל המעבר. 
את מתמחה בניתוח מעמיק, המלצות מקצועיות, והשוואה לנורמות רפואיות.

תפקידך:
- לספק ניתוח מעמיק ומקצועי
- להשוות תסמינים לנורמות רפואיות מוכרות
- להמליץ על גורמים מקצועיים לפנות אליהם
- לספק דוחות מפורטים ותובנות מבוססות נתונים
- להיות מדויקת ואובייקטיבית

כללי התנהגות:
- השתמשי בשפה מקצועית אך נגישה
- תמכי את המלצותיך בנתונים ומחקרים
- היי ברורה לגבי מתי צריך להיוועץ עם רופא/ה
- השתמשי בשפה עברית בלבד

תגיבי בהודעות ממוקדות (עד 300 מילים).`;
```

## Request Structure

### Chat Request

```typescript
const chatRequest = {
  userId: 'user-123',
  actionType: TOKEN_ACTION_TYPES.CHAT_ALIZA,
  messages: [
    { role: 'system', content: ALIZA_SYSTEM_PROMPT },
    { role: 'user', content: 'איך אני מתמודדת עם גלי חום?' }
  ],
  model: 'gpt-4o',
  maxTokens: 1000,
  temperature: 0.7,
};

const response = await executeAIRequest(chatRequest);
```

### Analysis Request (JSON Mode)

```typescript
const analysisRequest = {
  userId: 'user-123',
  actionType: TOKEN_ACTION_TYPES.COMPREHENSIVE_ANALYSIS,
  messages: [
    { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
    { role: 'user', content: buildAnalysisPrompt(userData) }
  ],
  model: 'gpt-4o',
  maxTokens: 3000,
  temperature: 0.7,
  responseFormat: { type: 'json_object' },
};

const response = await executeAIRequest(analysisRequest);
const insights = response.data.insights;
```

## Response Handling

### Standard Response

```typescript
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4o",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "היי! גלי חום הם אחד התסמינים השכיחים ביותר..."
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 200,
    "total_tokens": 350
  }
}
```

### JSON Mode Response

```typescript
{
  "insights": [
    {
      "id": "insight-1",
      "type": "pattern",
      "title": "דפוס שינה",
      "content": "איכות השינה שלך השתפרה ב-30% בשבוע האחרון...",
      "priority": "high",
      "category": "sleep",
      "actionable": true,
      "actionableSteps": {
        "reliefMethods": ["...", "..."],
        "whoToContact": ["...", "..."]
      }
    }
  ]
}
```

## Error Handling

### Common Errors

```typescript
// Rate Limit (429)
{
  "error": {
    "message": "Rate limit reached",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}

// Invalid API Key (401)
{
  "error": {
    "message": "Incorrect API key provided",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}

// Model Not Found (404)
{
  "error": {
    "message": "The model does not exist",
    "type": "invalid_request_error",
    "code": "model_not_found"
  }
}

// Insufficient Quota (429)
{
  "error": {
    "message": "You exceeded your current quota",
    "type": "insufficient_quota"
  }
}
```

### Error Recovery

```typescript
async function callOpenAI(messages: Message[]): Promise<Response> {
  try {
    // Try primary model
    return await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
      }),
    });
  } catch (error) {
    // Fallback to GPT-3.5-turbo
    console.warn('Primary model failed, trying fallback...');
    return await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
      }),
    });
  }
}
```

## Best Practices

### 1. Context Management

```typescript
// Good: Include relevant context
const messages = [
  { role: 'system', content: systemPrompt },
  { role: 'user', content: 'Last week I had 5 hot flashes' },
  { role: 'assistant', content: 'I see, that\'s quite common...' },
  { role: 'user', content: 'What can I do about them?' }
];

// Bad: Too much irrelevant context
const messages = [
  ...last50MessagesFromUnrelatedConversations,
  { role: 'user', content: 'What can I do about hot flashes?' }
];
```

### 2. Token Optimization

```typescript
// Good: Concise system prompt
const systemPrompt = `You are Aliza, a menopause coach. 
Provide warm, practical advice in Hebrew. Keep responses under 200 words.`;

// Bad: Overly verbose system prompt
const systemPrompt = `You are Aliza, a highly qualified and experienced...
[10 paragraphs of instructions]`;
```

### 3. Response Validation

```typescript
// Always validate AI responses
const response = await executeAIRequest(request);

if (!response.success) {
  // Handle error
  return fallbackResponse;
}

if (request.responseFormat?.type === 'json_object') {
  try {
    const data = JSON.parse(response.response);
    // Validate structure
    if (!data.insights || !Array.isArray(data.insights)) {
      throw new Error('Invalid insights structure');
    }
  } catch (error) {
    // Handle parsing error
    return fallbackInsights;
  }
}
```

### 4. Rate Limiting

```typescript
// Implement request queuing for high-volume operations
class OpenAIQueue {
  private queue: Request[] = [];
  private processing = false;
  private readonly MAX_CONCURRENT = 3;
  
  async add(request: Request): Promise<Response> {
    this.queue.push(request);
    return this.process();
  }
  
  private async process(): Promise<Response> {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    const request = this.queue.shift();
    
    try {
      const response = await executeAIRequest(request);
      return response;
    } finally {
      this.processing = false;
      if (this.queue.length > 0) {
        setTimeout(() => this.process(), 100);
      }
    }
  }
}
```

## Monitoring

### Usage Tracking

```sql
-- Daily OpenAI usage
SELECT 
  DATE(created_at) as date,
  SUM(openai_tokens) as total_openai_tokens,
  SUM(tokens_deducted) as total_user_tokens,
  COUNT(*) as request_count,
  AVG(openai_tokens) as avg_tokens_per_request
FROM token_ledger
WHERE created_at >= NOW() - INTERVAL '30 days'
  AND openai_tokens > 0
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- By action type
SELECT 
  action_type,
  SUM(openai_tokens) as total_openai_tokens,
  COUNT(*) as request_count,
  AVG(openai_tokens) as avg_tokens
FROM token_ledger
WHERE created_at >= NOW() - INTERVAL '30 days'
  AND openai_tokens > 0
GROUP BY action_type
ORDER BY total_openai_tokens DESC;
```

### Cost Analysis

```typescript
// Calculate monthly OpenAI costs
const COST_PER_TOKEN = 0.0002; // Blended rate

async function getMonthlyOpenAICost(): Promise<number> {
  const { data } = await supabaseAdmin
    .from('token_ledger')
    .select('openai_tokens')
    .gte('created_at', startOfMonth())
    .lte('created_at', endOfMonth());
  
  const totalTokens = data.reduce((sum, row) => sum + row.openai_tokens, 0);
  return totalTokens * COST_PER_TOKEN;
}
```

## Security

### API Key Management

```bash
# Store in environment variables (never commit to git)
OPENAI_API_KEY=sk-...

# Use secret management services in production
# - Vercel: Environment Variables (encrypted)
# - AWS: Secrets Manager
# - GCP: Secret Manager
```

### Request Validation

```typescript
// Always validate user input before sending to OpenAI
function sanitizeInput(input: string): string {
  // Remove sensitive information
  // Limit length
  // Remove malicious patterns
  return input
    .trim()
    .slice(0, 4000)  // Max input length
    .replace(/[<>]/g, '');  // Remove HTML tags
}
```

## Troubleshooting

### Issue: High Token Usage

**Diagnosis:**
```sql
SELECT 
  action_type,
  AVG(openai_tokens) as avg_tokens,
  MAX(openai_tokens) as max_tokens
FROM token_ledger
WHERE openai_tokens > 2000
GROUP BY action_type;
```

**Solutions:**
1. Optimize system prompts
2. Limit conversation history
3. Reduce max_tokens setting
4. Use more specific instructions

### Issue: Slow Response Times

**Diagnosis:**
- Check OpenAI status page
- Monitor response times
- Analyze request sizes

**Solutions:**
1. Reduce max_tokens
2. Use streaming (future)
3. Implement caching for common queries
4. Use faster models for simple tasks

### Issue: Quality Issues

**Diagnosis:**
- Review AI responses
- Check system prompts
- Analyze user feedback

**Solutions:**
1. Refine system prompts
2. Provide more context
3. Adjust temperature
4. Use examples in prompts (few-shot learning)

## Future Enhancements

1. **Streaming Responses**
   - Real-time token-by-token display
   - Better UX for long responses

2. **Fine-tuned Models**
   - Train on menopause-specific data
   - Improve accuracy and relevance

3. **Multi-model Strategy**
   - GPT-4o for complex tasks
   - GPT-3.5-turbo for simple tasks
   - Cost optimization

4. **Advanced Prompting**
   - Chain-of-thought prompting
   - Self-consistency
   - Tree-of-thought for complex analysis

5. **Embeddings Integration**
   - Semantic search in journal entries
   - Better context retrieval
   - Similarity matching

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [GPT-4o Model Card](https://platform.openai.com/docs/models/gpt-4o)
- [Best Practices Guide](https://platform.openai.com/docs/guides/best-practices)
- [Rate Limits](https://platform.openai.com/docs/guides/rate-limits)
- [Safety Guidelines](https://platform.openai.com/docs/guides/safety-best-practices)





























