/**
 * Token Engine Configuration
 * 
 * This file contains the core configuration for the token economy system.
 * All token calculations and deductions must use these constants.
 * 
 * CRITICAL: TOKEN_MULTIPLIER is the global constant that determines
 * how many tokens are deducted from the user for every token consumed by OpenAI.
 */

/**
 * TOKEN_MULTIPLIER - Global Profitability Constant
 * 
 * This value determines how many tokens are deducted from the user's balance
 * for every token consumed by OpenAI's API.
 * 
 * Formula: tokensToDeduct = openaiUsage.total_tokens * TOKEN_MULTIPLIER
 * 
 * Examples:
 * - TOKEN_MULTIPLIER = 2: User pays 2x OpenAI usage (100% markup)
 * - TOKEN_MULTIPLIER = 3: User pays 3x OpenAI usage (200% markup)
 * - TOKEN_MULTIPLIER = 1.5: User pays 1.5x OpenAI usage (50% markup)
 * 
 * Adjust this value to control platform profitability and sustainability.
 */
export const TOKEN_MULTIPLIER = 2;

/**
 * Token Action Types
 * 
 * All possible AI-driven actions that consume tokens.
 * Every OpenAI API call must be categorized under one of these types.
 */
export const TOKEN_ACTION_TYPES = {
  // Chat interactions
  CHAT_ALIZA: 'chat_aliza',
  CHAT_EXPERT: 'chat_expert',
  
  // Analysis operations
  DAILY_ANALYSIS: 'daily_analysis',
  WEEKLY_ANALYSIS: 'weekly_analysis',
  MONTHLY_ANALYSIS: 'monthly_analysis',
  COMPREHENSIVE_ANALYSIS: 'comprehensive_analysis',
  
  // Specific analysis types
  SLEEP_ANALYSIS: 'sleep_analysis',
  SYMPTOMS_ANALYSIS: 'symptoms_analysis',
  MOOD_ANALYSIS: 'mood_analysis',
  CYCLE_ANALYSIS: 'cycle_analysis',
  HORMONES_ANALYSIS: 'hormones_analysis',
  TRENDS_ANALYSIS: 'trends_analysis',
  
  // Automation and background tasks
  NEWSLETTER_GENERATION: 'newsletter_generation',
  INSIGHT_GENERATION: 'insight_generation',
  PERSONALIZED_PLAN: 'personalized_plan',
  
  // File processing
  FILE_ANALYSIS: 'file_analysis',
  PDF_REPORT: 'pdf_report',
  TEXT_ANALYSIS: 'text_analysis',
  
  // Messages and notifications
  ALIZA_MESSAGE: 'aliza_message',
  SMART_NOTIFICATION: 'smart_notification',
  
  // Other AI tasks
  CONTENT_GENERATION: 'content_generation',
  OTHER_AI_TASK: 'other_ai_task',
} as const;

export type TokenActionType = typeof TOKEN_ACTION_TYPES[keyof typeof TOKEN_ACTION_TYPES];

/**
 * Token Warning Thresholds
 * 
 * Thresholds for displaying warning messages to users about their token balance.
 */
export const TOKEN_WARNING_THRESHOLDS = {
  // Show critical warning (red)
  CRITICAL: 100,
  
  // Show low balance warning (orange)
  LOW: 1000,
  
  // Show gentle reminder (yellow)
  REMINDER: 5000,
} as const;

/**
 * Token Transparency Messages
 * 
 * Message templates for displaying token usage to users.
 * These should be displayed every time tokens are deducted.
 */
export const TOKEN_MESSAGES = {
  HEBREW: {
    DEDUCTION: (tokens: number, remaining: number, actionType: string) => 
      `המערכת השתמשה ב-${tokens} טוקנים לביצוע הפעולה. יתרה: ${remaining} טוקנים.`,
    
    CRITICAL_WARNING: (remaining: number) =>
      `⚠️ זהירות! נותרו רק ${remaining} טוקנים. מומלץ למלא מחדש כדי להמשיך להשתמש במערכת.`,
    
    LOW_WARNING: (remaining: number) =>
      `⚡ יתרת הטוקנים שלך נמוכה (${remaining}). שקלי למלא מחדש בקרוב.`,
    
    REMINDER: (remaining: number) =>
      `💡 יתרה נוכחית: ${remaining} טוקנים.`,
    
    NO_TOKENS: () =>
      `נגמרו הטוקנים שלך. לחצי כאן כדי למלא מחדש ולהמשיך ליהנות מהשירות.`,
    
    BEFORE_HEAVY_OPERATION: (estimatedTokens: number, remaining: number) =>
      `פעולה זו תצרוך כ-${estimatedTokens} טוקנים. יתרה נוכחית: ${remaining}. להמשיך?`,
  },
  
  ENGLISH: {
    DEDUCTION: (tokens: number, remaining: number, actionType: string) =>
      `The system used ${tokens} tokens for this operation. Remaining balance: ${remaining} tokens.`,
    
    CRITICAL_WARNING: (remaining: number) =>
      `⚠️ Warning! Only ${remaining} tokens remaining. Please refill to continue using the system.`,
    
    LOW_WARNING: (remaining: number) =>
      `⚡ Your token balance is low (${remaining}). Consider refilling soon.`,
    
    REMINDER: (remaining: number) =>
      `💡 Current balance: ${remaining} tokens.`,
    
    NO_TOKENS: () =>
      `You're out of tokens. Click here to refill and continue enjoying the service.`,
    
    BEFORE_HEAVY_OPERATION: (estimatedTokens: number, remaining: number) =>
      `This operation will use approximately ${estimatedTokens} tokens. Current balance: ${remaining}. Continue?`,
  }
} as const;

/**
 * Token Cost Estimates
 * 
 * Estimated token costs for different operations.
 * These are used for displaying warnings before heavy operations.
 */
export const TOKEN_COST_ESTIMATES = {
  [TOKEN_ACTION_TYPES.CHAT_ALIZA]: 500,
  [TOKEN_ACTION_TYPES.CHAT_EXPERT]: 1000,
  [TOKEN_ACTION_TYPES.DAILY_ANALYSIS]: 2000,
  [TOKEN_ACTION_TYPES.COMPREHENSIVE_ANALYSIS]: 5000,
  [TOKEN_ACTION_TYPES.PDF_REPORT]: 3000,
  [TOKEN_ACTION_TYPES.FILE_ANALYSIS]: 4000,
  [TOKEN_ACTION_TYPES.NEWSLETTER_GENERATION]: 2500,
} as const;

/**
 * Calculate tokens to deduct based on OpenAI usage
 * 
 * @param openaiTokens - Total tokens reported by OpenAI API
 * @returns Number of tokens to deduct from user's balance
 */
export function calculateTokenDeduction(openaiTokens: number): number {
  return Math.ceil(openaiTokens * TOKEN_MULTIPLIER);
}

/**
 * Check if user has enough tokens for an operation
 * 
 * @param currentBalance - User's current token balance
 * @param actionType - Type of action to perform
 * @returns Boolean indicating if user has enough tokens
 */
export function hasEnoughTokens(
  currentBalance: number,
  actionType: TokenActionType
): boolean {
  const estimatedCost = TOKEN_COST_ESTIMATES[actionType] || 1000;
  return currentBalance >= estimatedCost;
}

/**
 * Get appropriate warning message based on token balance
 * 
 * @param balance - Current token balance
 * @param language - Language for the message ('hebrew' | 'english')
 * @returns Warning message or null if no warning needed
 */
export function getTokenWarningMessage(
  balance: number,
  language: 'hebrew' | 'english' = 'hebrew'
): string | null {
  const messages = language === 'hebrew' ? TOKEN_MESSAGES.HEBREW : TOKEN_MESSAGES.ENGLISH;
  
  if (balance <= 0) {
    return messages.NO_TOKENS();
  }
  
  if (balance <= TOKEN_WARNING_THRESHOLDS.CRITICAL) {
    return messages.CRITICAL_WARNING(balance);
  }
  
  if (balance <= TOKEN_WARNING_THRESHOLDS.LOW) {
    return messages.LOW_WARNING(balance);
  }
  
  if (balance <= TOKEN_WARNING_THRESHOLDS.REMINDER) {
    return messages.REMINDER(balance);
  }
  
  return null;
}

/**
 * Format token deduction message for transparency
 * 
 * @param tokensUsed - Tokens deducted
 * @param remainingBalance - Remaining balance after deduction
 * @param actionType - Type of action performed
 * @param language - Language for the message
 * @returns Formatted transparency message
 */
export function formatDeductionMessage(
  tokensUsed: number,
  remainingBalance: number,
  actionType: TokenActionType,
  language: 'hebrew' | 'english' = 'hebrew'
): string {
  const messages = language === 'hebrew' ? TOKEN_MESSAGES.HEBREW : TOKEN_MESSAGES.ENGLISH;
  return messages.DEDUCTION(tokensUsed, remainingBalance, actionType);
}






























