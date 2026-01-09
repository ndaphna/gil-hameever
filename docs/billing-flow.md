# Billing & Subscription Flow Documentation

## Overview

The platform uses a token-based billing system with subscription tiers and one-time refill packs. Integration with Cardcom (Israeli payment processor) handles all payment transactions.

## Subscription Tiers

### Plan Structure

```typescript
interface SubscriptionPlan {
  id: 'free' | 'basic' | 'plus' | 'pro'
  monthlyTokens: number
  priceILS: number
  priceUSD: number
  features: {...}
}

const PLANS = {
  free: {
    monthlyTokens: 30,
    priceILS: 0,
    priceUSD: 0,
  },
  basic: {
    monthlyTokens: 60000,
    priceILS: 49,
    priceUSD: 15,
  },
  plus: {
    monthlyTokens: 150000,
    priceILS: 99,
    priceUSD: 30,
  },
  pro: {
    monthlyTokens: 400000,
    priceILS: 199,
    priceUSD: 60,
  },
};
```

## User Journey

### 1. Sign Up Flow

```
User visits landing page
  ↓
Clicks "התחילי חינם" (Start Free)
  ↓
Creates account (email + password)
  ↓
Profile created with:
  - subscription_tier: 'free'
  - subscription_status: 'active'
  - current_tokens: 30
  ↓
Welcome email sent
  ↓
Redirected to dashboard
```

### 2. Upgrade Flow

```
User on Free/Basic plan
  ↓
Sees features locked behind higher tiers
  ↓
Clicks "שדרגי מנוי" (Upgrade)
  ↓
Pricing page displayed
  ↓
Selects plan (Plus/Pro)
  ↓
Redirected to Cardcom payment page
  ↓
Enters payment details
  ↓
Payment processed
  ↓
Webhook receives confirmation
  ↓
System updates:
  - subscription_tier → 'plus'/'pro'
  - current_tokens += monthlyTokens
  - Log to token_ledger (subscription_renewal)
  ↓
User receives confirmation email
  ↓
Redirected to dashboard with new features
```

### 3. Token Refill Flow

```
User running low on tokens
  ↓
Sees "יתרה נמוכה" warning
  ↓
Clicks "מלאי מחדש"
  ↓
Refill packs displayed
  ↓
Selects pack (Small/Medium/Large/XL)
  ↓
Redirected to Cardcom payment page
  ↓
Enters payment details
  ↓
Payment processed
  ↓
Webhook receives confirmation
  ↓
System updates:
  - current_tokens += refillAmount
  - Log to token_ledger (refill)
  ↓
User receives confirmation
  ↓
Tokens immediately available
```

## Database Schema

### Subscription Tables

```sql
-- user_profile (extended)
ALTER TABLE user_profile ADD COLUMN subscription_tier TEXT DEFAULT 'free';
ALTER TABLE user_profile ADD COLUMN subscription_status TEXT DEFAULT 'active';
ALTER TABLE user_profile ADD COLUMN subscription_start_date TIMESTAMPTZ;
ALTER TABLE user_profile ADD COLUMN subscription_end_date TIMESTAMPTZ;
ALTER TABLE user_profile ADD COLUMN auto_renew BOOLEAN DEFAULT true;

-- subscription (legacy, kept for compatibility)
CREATE TABLE subscription (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profile(id),
  cardcom_customer_id TEXT,
  cardcom_subscription_id TEXT,
  plan_type TEXT,
  status TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- payment_history
CREATE TABLE payment_history (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profile(id),
  type TEXT,  -- 'subscription' | 'refill'
  amount DECIMAL(10,2),
  currency TEXT,  -- 'ILS' | 'USD'
  cardcom_transaction_id TEXT,
  cardcom_status TEXT,
  tokens_added INTEGER,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ
);
```

## Payment Integration (Cardcom)

### Setup

```typescript
// Cardcom Configuration
const CARDCOM_CONFIG = {
  terminalNumber: process.env.CARDCOM_TERMINAL_NUMBER,
  apiKey: process.env.CARDCOM_API_KEY,
  baseUrl: 'https://secure.cardcom.solutions/api',
  webhookSecret: process.env.CARDCOM_WEBHOOK_SECRET,
};
```

### Create Payment Request

```typescript
async function createCardcomPayment(
  userId: string,
  amount: number,
  currency: 'ILS' | 'USD',
  type: 'subscription' | 'refill',
  metadata: any
): Promise<string> {
  const response = await fetch(`${CARDCOM_CONFIG.baseUrl}/payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CARDCOM_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      terminal: CARDCOM_CONFIG.terminalNumber,
      amount,
      currency,
      returnUrl: `${APP_URL}/payment/success`,
      cancelUrl: `${APP_URL}/payment/cancel`,
      notifyUrl: `${APP_URL}/api/webhooks/cardcom`,
      customerData: {
        userId,
        type,
        metadata,
      },
    }),
  });

  const data = await response.json();
  return data.paymentPageUrl;  // Redirect user here
}
```

### Webhook Handler

```typescript
// /api/webhooks/cardcom
export async function POST(request: NextRequest) {
  // Verify webhook signature
  const signature = request.headers.get('X-Cardcom-Signature');
  if (!verifyWebhookSignature(signature, await request.text())) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const payload = await request.json();
  
  const {
    transactionId,
    status,
    amount,
    currency,
    customerData,
  } = payload;

  if (status !== 'success') {
    // Log failed payment
    await logFailedPayment(payload);
    return NextResponse.json({ error: 'Payment failed' }, { status: 400 });
  }

  const { userId, type, metadata } = customerData;

  if (type === 'subscription') {
    await handleSubscriptionPayment(userId, metadata);
  } else if (type === 'refill') {
    await handleRefillPayment(userId, metadata);
  }

  // Log payment
  await supabaseAdmin.from('payment_history').insert({
    user_id: userId,
    type,
    amount,
    currency,
    cardcom_transaction_id: transactionId,
    cardcom_status: status,
    tokens_added: metadata.tokens,
    description: metadata.description,
    metadata: payload,
  });

  return NextResponse.json({ success: true });
}
```

### Handle Subscription Payment

```typescript
async function handleSubscriptionPayment(
  userId: string,
  metadata: { plan: string }
) {
  const plan = SUBSCRIPTION_PLANS[metadata.plan];
  
  // Update user subscription
  await supabaseAdmin
    .from('user_profile')
    .update({
      subscription_tier: plan.id,
      subscription_status: 'active',
      subscription_start_date: new Date(),
      subscription_end_date: addMonths(new Date(), 1),
    })
    .eq('id', userId);

  // Add monthly tokens
  await add_tokens(
    userId,
    plan.monthlyTokens,
    'subscription_renewal',
    `Monthly tokens for ${plan.nameHebrew} plan`,
    { plan: plan.id }
  );

  // Send confirmation email
  await sendSubscriptionConfirmationEmail(userId, plan);
}
```

### Handle Refill Payment

```typescript
async function handleRefillPayment(
  userId: string,
  metadata: { pack: string }
) {
  const pack = REFILL_PACKS.find(p => p.id === metadata.pack);
  
  // Add tokens
  await add_tokens(
    userId,
    pack.tokens,
    'refill',
    `Token refill: ${pack.nameHebrew}`,
    { pack: pack.id, paymentAmount: pack.priceILS }
  );

  // Send confirmation email
  await sendRefillConfirmationEmail(userId, pack);
}
```

## Monthly Renewal

### Cron Job

```typescript
// /api/cron/monthly-renewal
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get users with upcoming renewals
  const { data: users } = await supabaseAdmin
    .from('user_profile')
    .select('*')
    .eq('subscription_status', 'active')
    .lte('subscription_end_date', addDays(new Date(), 1))
    .eq('auto_renew', true);

  for (const user of users) {
    await renewSubscription(user);
  }

  return NextResponse.json({ success: true, renewed: users.length });
}

async function renewSubscription(user: UserProfile) {
  // Charge via Cardcom stored payment method
  const payment = await chargeStoredPaymentMethod(
    user.cardcom_customer_id,
    SUBSCRIPTION_PLANS[user.subscription_tier].priceILS
  );

  if (payment.success) {
    // Extend subscription
    await supabaseAdmin
      .from('user_profile')
      .update({
        subscription_end_date: addMonths(user.subscription_end_date, 1),
      })
      .eq('id', user.id);

    // Add monthly tokens
    await add_tokens(
      user.id,
      SUBSCRIPTION_PLANS[user.subscription_tier].monthlyTokens,
      'subscription_renewal',
      'Monthly renewal'
    );

    // Send confirmation
    await sendRenewalConfirmationEmail(user);
  } else {
    // Payment failed
    await handleFailedRenewal(user, payment.error);
  }
}
```

## Cancellation Flow

```
User wants to cancel
  ↓
Clicks "בטל מנוי"
  ↓
Confirmation dialog:
  "האם את בטוחה? המנוי שלך יישאר פעיל עד [תאריך]"
  ↓
User confirms
  ↓
System updates:
  - auto_renew: false
  - subscription_status: 'cancelling'
  ↓
Email sent: "מנוייך יסתיים ב-[תאריך]"
  ↓
On end date:
  - subscription_status: 'cancelled'
  - subscription_tier: 'free'
  - Tokens remain (don't remove)
  ↓
User can reactivate anytime
```

## Refund Policy

### Automatic Refunds

- **Within 7 days**: Full refund, no questions asked
- **Within 30 days**: Partial refund (prorated)
- **After 30 days**: No refund, but can cancel future renewals

### Manual Refunds

```typescript
async function processRefund(
  userId: string,
  paymentId: string,
  amount: number,
  reason: string
) {
  // Process via Cardcom
  const refund = await cardcom.refundPayment(paymentId, amount);

  if (refund.success) {
    // Deduct tokens if they were used
    const tokensUsed = await calculateTokensUsed(userId, paymentDate);
    const tokensToRemove = Math.min(tokensAdded, tokensUsed);

    await supabaseAdmin
      .from('user_profile')
      .update({
        current_tokens: Math.max(0, currentTokens - tokensToRemove),
      })
      .eq('id', userId);

    // Log refund
    await supabaseAdmin.from('payment_history').insert({
      user_id: userId,
      type: 'refund',
      amount: -amount,
      description: `Refund: ${reason}`,
      cardcom_transaction_id: refund.transactionId,
    });

    // Send email
    await sendRefundConfirmationEmail(userId, amount, reason);
  }
}
```

## Analytics

### Revenue Tracking

```sql
-- Monthly revenue
SELECT 
  DATE_TRUNC('month', created_at) as month,
  SUM(amount) as total_revenue,
  COUNT(*) as transaction_count,
  AVG(amount) as avg_transaction
FROM payment_history
WHERE type IN ('subscription', 'refill')
  AND cardcom_status = 'success'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Revenue by plan
SELECT 
  metadata->>'plan' as plan,
  COUNT(*) as subscriptions,
  SUM(amount) as total_revenue
FROM payment_history
WHERE type = 'subscription'
  AND cardcom_status = 'success'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY metadata->>'plan';

-- MRR (Monthly Recurring Revenue)
SELECT 
  subscription_tier,
  COUNT(*) as active_subscriptions,
  SUM(
    CASE subscription_tier
      WHEN 'basic' THEN 49
      WHEN 'plus' THEN 99
      WHEN 'pro' THEN 199
      ELSE 0
    END
  ) as mrr
FROM user_profile
WHERE subscription_status = 'active'
  AND subscription_tier != 'free'
GROUP BY subscription_tier;
```

### Churn Analysis

```sql
-- Monthly churn rate
SELECT 
  DATE_TRUNC('month', updated_at) as month,
  COUNT(*) as cancelled_subscriptions,
  (
    SELECT COUNT(*) 
    FROM user_profile 
    WHERE subscription_status = 'active' 
    AND subscription_tier != 'free'
  ) as active_subscriptions,
  ROUND(
    COUNT(*) * 100.0 / (
      SELECT COUNT(*) 
      FROM user_profile 
      WHERE subscription_status = 'active'
    ),
    2
  ) as churn_rate_percent
FROM user_profile
WHERE subscription_status = 'cancelled'
  AND updated_at >= NOW() - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', updated_at)
ORDER BY month DESC;
```

## Security

### Payment Security

1. **PCI Compliance**: Never store card details
2. **HTTPS Only**: All payment pages over SSL
3. **Webhook Verification**: Signature validation
4. **Rate Limiting**: Prevent payment abuse
5. **Fraud Detection**: Monitor suspicious patterns

### User Data Protection

1. **Encrypted Storage**: Payment history encrypted
2. **Access Control**: RLS on all tables
3. **Audit Logging**: All payment changes logged
4. **GDPR Compliance**: Data export/deletion on request

## Troubleshooting

### Payment Failed

**Common Causes:**
- Insufficient funds
- Card expired
- Invalid card details
- Bank declined
- Technical error

**Resolution:**
1. Show clear error message to user
2. Suggest alternative payment methods
3. Log error for investigation
4. Retry after user updates details

### Webhook Not Received

**Diagnosis:**
1. Check Cardcom dashboard for webhook attempts
2. Verify webhook URL is accessible
3. Check server logs for errors
4. Verify signature validation

**Resolution:**
1. Implement retry mechanism
2. Add fallback status check
3. Manual reconciliation if needed

### Double Charge

**Prevention:**
- Idempotency keys
- Transaction deduplication
- Payment status checks

**Resolution:**
1. Detect duplicate payment
2. Automatic refund
3. Notify user
4. Log incident

## Future Enhancements

1. **Annual Plans** - Discount for yearly commitment
2. **Family Plans** - Multiple users, shared tokens
3. **Gift Subscriptions** - Purchase for others
4. **Flexible Billing** - Pay-as-you-go option
5. **International Payments** - Multiple currencies
6. **Payment Plans** - Installment options

## Conclusion

The billing system is designed to be:
- **Transparent**: Users always know what they're paying
- **Flexible**: Multiple plans and refill options
- **Secure**: PCI compliant, encrypted, audited
- **Reliable**: Automated renewals, retry logic
- **User-friendly**: Clear messaging, easy upgrades/cancellations










































