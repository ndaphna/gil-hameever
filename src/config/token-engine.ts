/**
 * Token Engine — credits model with wallet routing.
 *
 * Two user-facing wallets:
 *   - chat:     conversations with Aliza (1 credit per turn, 10 per expert turn)
 *   - analysis: daily/weekly/monthly analyses, PDF reports, file insights
 *
 * Platform actions (newsletters, internal content generation) do not charge
 * the user and are billed against the platform's own AI budget.
 *
 * For every AI call the ledger records both the credits deducted (what the
 * user sees) and the real USD cost (what we pay Anthropic/OpenAI), so margin
 * per action is auditable.
 */

// ── wallets ──────────────────────────────────────────────────────────────
export type Wallet = 'chat' | 'analysis' | 'platform';

// ── action types (extended with explicit string union for safety) ────────
export const TOKEN_ACTION_TYPES = {
  // Chat
  CHAT_ALIZA: 'chat_aliza',
  CHAT_EXPERT: 'chat_expert',
  ALIZA_MESSAGE: 'aliza_message',

  // Analyses
  DAILY_ANALYSIS: 'daily_analysis',
  WEEKLY_ANALYSIS: 'weekly_analysis',
  MONTHLY_ANALYSIS: 'monthly_analysis',
  COMPREHENSIVE_ANALYSIS: 'comprehensive_analysis',
  SLEEP_ANALYSIS: 'sleep_analysis',
  SYMPTOMS_ANALYSIS: 'symptoms_analysis',
  MOOD_ANALYSIS: 'mood_analysis',
  CYCLE_ANALYSIS: 'cycle_analysis',
  HORMONES_ANALYSIS: 'hormones_analysis',
  TRENDS_ANALYSIS: 'trends_analysis',
  PDF_REPORT: 'pdf_report',
  FILE_ANALYSIS: 'file_analysis',
  TEXT_ANALYSIS: 'text_analysis',
  INSIGHT_GENERATION: 'insight_generation',
  PERSONALIZED_PLAN: 'personalized_plan',
  SMART_NOTIFICATION: 'smart_notification',

  // Platform (not user-charged)
  NEWSLETTER_GENERATION: 'newsletter_generation',
  CONTENT_GENERATION: 'content_generation',
  OTHER_AI_TASK: 'other_ai_task',
} as const;

export type TokenActionType = typeof TOKEN_ACTION_TYPES[keyof typeof TOKEN_ACTION_TYPES];

// ── per-action config: which wallet, how many credits, display label ─────
interface ActionConfig {
  wallet: Wallet;
  credits: number;
  labelHe: string;
}

export const ACTION_CONFIG: Record<TokenActionType, ActionConfig> = {
  // Chat
  chat_aliza:    { wallet: 'chat', credits: 1,  labelHe: 'שיחה עם עליזה' },
  chat_expert:   { wallet: 'chat', credits: 10, labelHe: 'מצב מומחית' },
  aliza_message: { wallet: 'chat', credits: 1,  labelHe: 'הודעת עליזה' },

  // Analysis
  daily_analysis:         { wallet: 'analysis', credits: 1,  labelHe: 'ניתוח יומי' },
  weekly_analysis:        { wallet: 'analysis', credits: 2,  labelHe: 'ניתוח שבועי' },
  monthly_analysis:       { wallet: 'analysis', credits: 5,  labelHe: 'ניתוח חודשי' },
  comprehensive_analysis: { wallet: 'analysis', credits: 10, labelHe: 'ניתוח מקיף' },
  sleep_analysis:         { wallet: 'analysis', credits: 1,  labelHe: 'ניתוח שינה' },
  symptoms_analysis:      { wallet: 'analysis', credits: 1,  labelHe: 'ניתוח תסמינים' },
  mood_analysis:          { wallet: 'analysis', credits: 1,  labelHe: 'ניתוח מצב רוח' },
  cycle_analysis:         { wallet: 'analysis', credits: 1,  labelHe: 'ניתוח מחזור' },
  hormones_analysis:      { wallet: 'analysis', credits: 1,  labelHe: 'ניתוח הורמונים' },
  trends_analysis:        { wallet: 'analysis', credits: 2,  labelHe: 'ניתוח מגמות' },
  pdf_report:             { wallet: 'analysis', credits: 3,  labelHe: 'דוח PDF' },
  file_analysis:          { wallet: 'analysis', credits: 2,  labelHe: 'ניתוח קובץ' },
  text_analysis:          { wallet: 'analysis', credits: 1,  labelHe: 'ניתוח טקסט' },
  insight_generation:     { wallet: 'analysis', credits: 1,  labelHe: 'יצירת תובנה' },
  personalized_plan:      { wallet: 'analysis', credits: 5,  labelHe: 'תוכנית אישית' },
  smart_notification:     { wallet: 'analysis', credits: 0,  labelHe: 'התראה חכמה' },

  // Platform
  newsletter_generation: { wallet: 'platform', credits: 0, labelHe: 'ניוזלטר' },
  content_generation:    { wallet: 'platform', credits: 0, labelHe: 'יצירת תוכן' },
  other_ai_task:         { wallet: 'platform', credits: 0, labelHe: 'משימת AI' },
};

export function walletForAction(action: TokenActionType): Wallet {
  return ACTION_CONFIG[action].wallet;
}

export function creditsForAction(action: TokenActionType): number {
  return ACTION_CONFIG[action].credits;
}

export function labelForAction(action: TokenActionType): string {
  return ACTION_CONFIG[action].labelHe;
}

// ── provider pricing (USD per 1M tokens) ─────────────────────────────────
// Source of truth for cost reconciliation. Update when Anthropic/OpenAI change
// list prices. The values reflect the public rates as of 2026-Q2.

export const ANTHROPIC_PRICING = {
  'claude-sonnet-4-6':        { input: 3.0,  output: 15.0, cacheWrite: 3.75,  cacheRead: 0.30 },
  'claude-opus-4-7':          { input: 15.0, output: 75.0, cacheWrite: 18.75, cacheRead: 1.50 },
  'claude-haiku-4-5-20251001':{ input: 1.0,  output: 5.0,  cacheWrite: 1.25,  cacheRead: 0.10 },
} as const;

export type AnthropicModelId = keyof typeof ANTHROPIC_PRICING;

export const OPENAI_PRICING = {
  'gpt-4o':      { input: 2.50, output: 10.0 },
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
} as const;

export type OpenAIModelId = keyof typeof OPENAI_PRICING;

interface AnthropicUsage {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
}

export function computeAnthropicCostUSD(model: AnthropicModelId, usage: AnthropicUsage): number {
  const p = ANTHROPIC_PRICING[model];
  const inputCost      = (usage.input_tokens ?? 0)                   * p.input;
  const cacheWriteCost = (usage.cache_creation_input_tokens ?? 0)    * p.cacheWrite;
  const cacheReadCost  = (usage.cache_read_input_tokens ?? 0)        * p.cacheRead;
  const outputCost     = (usage.output_tokens ?? 0)                  * p.output;
  return (inputCost + cacheWriteCost + cacheReadCost + outputCost) / 1_000_000;
}

export function computeOpenAICostUSD(
  model: OpenAIModelId,
  usage: { prompt_tokens: number; completion_tokens: number },
): number {
  const p = OPENAI_PRICING[model];
  return (
    (usage.prompt_tokens ?? 0)     * p.input +
    (usage.completion_tokens ?? 0) * p.output
  ) / 1_000_000;
}

// USD is stored as integer micros (1 USD = 1_000_000 micros) to avoid float
// drift in the ledger. Convert in both directions through this helper.
export function usdToMicros(usd: number): number {
  return Math.round(usd * 1_000_000);
}

export function microsToUsd(micros: number): number {
  return micros / 1_000_000;
}

// ── warning thresholds (per wallet) ───────────────────────────────────────
export const CHAT_WARNING_THRESHOLDS = {
  CRITICAL: 5,
  LOW: 20,
  REMINDER: 50,
} as const;

export const ANALYSIS_WARNING_THRESHOLDS = {
  CRITICAL: 1,
  LOW: 3,
  REMINDER: 8,
} as const;

// ── transparency strings (Hebrew, user-facing) ────────────────────────────
export const WALLET_LABEL_HE: Record<Wallet, string> = {
  chat: 'שיחות',
  analysis: 'ניתוחים',
  platform: 'מערכת',
};

// Hebrew has grammatical number — "1 שיחות" is wrong, "שיחה אחת" is right.
const WALLET_SINGULAR_HE: Record<Wallet, string> = {
  chat: 'שיחה אחת',
  analysis: 'ניתוח אחד',
  platform: '',
};

export function formatDeductionMessage(
  credits: number,
  remaining: number,
  action: TokenActionType,
): string {
  const wallet = walletForAction(action);
  if (wallet === 'platform' || credits === 0) {
    return '';
  }
  const phrase = credits === 1
    ? WALLET_SINGULAR_HE[wallet]
    : `${credits} ${WALLET_LABEL_HE[wallet]}`;
  return `השיחה הזו ניצלה ${phrase}. נשארו לך ${remaining}.`;
}

export function getWalletWarningMessage(wallet: Wallet, balance: number): string | null {
  const thresholds = wallet === 'chat' ? CHAT_WARNING_THRESHOLDS : ANALYSIS_WARNING_THRESHOLDS;
  const label = WALLET_LABEL_HE[wallet];

  if (balance <= 0) {
    return `נגמרו ה${label} שלך. אפשר להוסיף חבילה כדי להמשיך.`;
  }
  if (balance <= thresholds.CRITICAL) {
    return `נשארו לך רק ${balance} ${label}. שווה להוסיף חבילה לפני שזה ייגמר.`;
  }
  if (balance <= thresholds.LOW) {
    return `יתרת ה${label} שלך נמוכה (${balance}). שווה לחשוב על תוספת.`;
  }
  if (balance <= thresholds.REMINDER) {
    return `יתרה: ${balance} ${label}.`;
  }
  return null;
}

// ── action → estimated USD cost (for pre-call sanity / monitoring) ────────
// Not used for charging the user (we charge fixed credits). Used by
// admin dashboards and capacity planning.
export const ACTION_EXPECTED_COST_USD: Partial<Record<TokenActionType, number>> = {
  chat_aliza:             0.022,
  chat_expert:            0.29,
  aliza_message:          0.022,
  daily_analysis:         0.05,
  weekly_analysis:        0.10,
  monthly_analysis:       0.25,
  comprehensive_analysis: 0.50,
  sleep_analysis:         0.04,
  symptoms_analysis:      0.04,
  mood_analysis:          0.04,
  cycle_analysis:         0.04,
  hormones_analysis:      0.04,
  trends_analysis:        0.08,
  pdf_report:             0.15,
  file_analysis:          0.10,
  text_analysis:          0.04,
  insight_generation:     0.04,
  personalized_plan:      0.25,
};
