/**
 * AI Usage Service
 * 
 * Centralized service for all AI operations that consume tokens.
 * This service handles:
 * - OpenAI API calls
 * - Token deduction using TOKEN_MULTIPLIER
 * - Logging to token_ledger
 * - Transparency notifications
 * - Balance validation
 * 
 * CRITICAL: All AI operations must go through this service.
 * No direct OpenAI calls should bypass this layer.
 */

import { supabaseAdmin } from './supabase-server';
import {
  TOKEN_MULTIPLIER,
  TOKEN_ACTION_TYPES,
  type TokenActionType,
  calculateTokenDeduction,
  hasEnoughTokens,
  formatDeductionMessage,
  getTokenWarningMessage,
  TOKEN_COST_ESTIMATES,
} from '@/config/token-engine';

/**
 * OpenAI Usage Result Interface
 */
export interface OpenAIUsageResult {
  /** Total tokens used by OpenAI (prompt + completion) */
  totalTokens: number;
  
  /** Prompt tokens */
  promptTokens?: number;
  
  /** Completion/response tokens */
  completionTokens?: number;
  
  /** Model used */
  model?: string;
}

/**
 * AI Request Interface
 */
export interface AIRequest {
  /** User ID */
  userId: string;
  
  /** Type of AI action */
  actionType: TokenActionType;
  
  /** Messages for OpenAI */
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  
  /** OpenAI model to use */
  model?: string;
  
  /** Max tokens for response */
  maxTokens?: number;
  
  /** Temperature (creativity) */
  temperature?: number;
  
  /** Response format */
  responseFormat?: { type: 'json_object' } | { type: 'text' };
  
  /** Description for logging */
  description?: string;
  
  /** Additional metadata for logging */
  metadata?: Record<string, any>;
}

/**
 * AI Response Interface
 */
export interface AIResponse {
  /** Success status */
  success: boolean;
  
  /** AI-generated response */
  response?: string;
  
  /** Parsed response (if JSON) */
  data?: any;
  
  /** OpenAI usage statistics */
  usage?: OpenAIUsageResult;
  
  /** Tokens deducted from user */
  tokensDeducted: number;
  
  /** Remaining token balance */
  tokensRemaining: number;
  
  /** Transparency message for the user */
  transparencyMessage: string;
  
  /** Warning message (if balance is low) */
  warningMessage?: string;
  
  /** Error message (if failed) */
  error?: string;
}

/**
 * Check if user has sufficient tokens for an operation
 */
export async function checkTokenBalance(
  userId: string,
  actionType: TokenActionType
): Promise<{
  hasEnough: boolean;
  currentBalance: number;
  estimatedCost: number;
  warningMessage?: string;
}> {
  try {
    // Get user's current token balance
    const { data: profile } = await supabaseAdmin
      .from('user_profile')
      .select('current_tokens, tokens_remaining')
      .eq('id', userId)
      .single();
    
    const currentBalance = profile?.current_tokens ?? profile?.tokens_remaining ?? 0;
    const estimatedCost = TOKEN_COST_ESTIMATES[actionType] || 1000;
    
    return {
      hasEnough: currentBalance >= estimatedCost,
      currentBalance,
      estimatedCost,
      warningMessage: getTokenWarningMessage(currentBalance) || undefined,
    };
  } catch (error) {
    console.error('Error checking token balance:', error);
    return {
      hasEnough: false,
      currentBalance: 0,
      estimatedCost: 0,
      warningMessage: 'Unable to verify token balance',
    };
  }
}

/**
 * Log token usage to database
 */
async function logTokenUsage(
  userId: string,
  actionType: TokenActionType,
  openaiTokens: number,
  tokensDeducted: number,
  tokensBefore: number,
  tokensAfter: number,
  description?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    await supabaseAdmin
      .from('token_ledger')
      .insert({
        user_id: userId,
        action_type: actionType,
        openai_tokens: openaiTokens,
        tokens_deducted: tokensDeducted,
        tokens_before: tokensBefore,
        tokens_after: tokensAfter,
        token_multiplier: TOKEN_MULTIPLIER,
        description: description || `${actionType} operation`,
        metadata: metadata || {},
      });
    
    console.log(`✅ Token usage logged: ${tokensDeducted} tokens for ${actionType}`);
  } catch (error) {
    console.error('❌ Failed to log token usage:', error);
    // Don't throw - logging failure shouldn't break the operation
  }
}

/**
 * Deduct tokens from user's balance
 */
async function deductTokens(
  userId: string,
  tokensToDeduct: number
): Promise<{
  success: boolean;
  newBalance: number;
  oldBalance: number;
}> {
  try {
    // Get current balance
    const { data: profile } = await supabaseAdmin
      .from('user_profile')
      .select('current_tokens, tokens_remaining')
      .eq('id', userId)
      .single();
    
    const oldBalance = profile?.current_tokens ?? profile?.tokens_remaining ?? 0;
    
    // Check if user has enough tokens
    if (oldBalance < tokensToDeduct) {
      return {
        success: false,
        newBalance: oldBalance,
        oldBalance,
      };
    }
    
    // Deduct tokens
    const newBalance = Math.max(0, oldBalance - tokensToDeduct);
    
    await supabaseAdmin
      .from('user_profile')
      .update({
        current_tokens: newBalance,
        tokens_remaining: newBalance,
      })
      .eq('id', userId);
    
    return {
      success: true,
      newBalance,
      oldBalance,
    };
  } catch (error) {
    console.error('❌ Failed to deduct tokens:', error);
    throw new Error('Failed to deduct tokens');
  }
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  messages: AIRequest['messages'],
  model: string = 'gpt-4o',
  maxTokens: number = 2000,
  temperature: number = 0.7,
  responseFormat?: AIRequest['responseFormat']
): Promise<{
  success: boolean;
  response?: string;
  usage?: OpenAIUsageResult;
  error?: string;
}> {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey || openaiApiKey === 'dummy-key') {
      return {
        success: false,
        error: 'OpenAI API key not configured',
      };
    }
    
    const requestBody: any = {
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
    };
    
    if (responseFormat) {
      requestBody.response_format = responseFormat;
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      
      return {
        success: false,
        error: `OpenAI API error: ${response.status}`,
      };
    }
    
    const data = await response.json();
    
    return {
      success: true,
      response: data.choices[0]?.message?.content || '',
      usage: {
        totalTokens: data.usage?.total_tokens || 0,
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        model: data.model,
      },
    };
  } catch (error) {
    console.error('❌ OpenAI API call failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Execute an AI request with full token management
 * 
 * This is the main entry point for all AI operations.
 * It handles:
 * 1. Token balance validation
 * 2. OpenAI API call
 * 3. Token deduction
 * 4. Usage logging
 * 5. Transparency notifications
 * 
 * @param request - AI request configuration
 * @returns AI response with token information
 */
export async function executeAIRequest(
  request: AIRequest
): Promise<AIResponse> {
  const {
    userId,
    actionType,
    messages,
    model = 'gpt-4o',
    maxTokens = 2000,
    temperature = 0.7,
    responseFormat,
    description,
    metadata,
  } = request;
  
  try {
    console.log(`🤖 AI Request: ${actionType} for user ${userId}`);
    
    // 1. Check token balance
    const balanceCheck = await checkTokenBalance(userId, actionType);
    
    if (!balanceCheck.hasEnough) {
      return {
        success: false,
        tokensDeducted: 0,
        tokensRemaining: balanceCheck.currentBalance,
        transparencyMessage: 'אין מספיק טוקנים לביצוע פעולה זו.',
        warningMessage: 'יתרת הטוקנים שלך אזלה. אנא מלאי מחדש כדי להמשיך.',
        error: 'Insufficient tokens',
      };
    }
    
    // 2. Call OpenAI
    const openaiResult = await callOpenAI(
      messages,
      model,
      maxTokens,
      temperature,
      responseFormat
    );
    
    if (!openaiResult.success) {
      return {
        success: false,
        tokensDeducted: 0,
        tokensRemaining: balanceCheck.currentBalance,
        transparencyMessage: 'הייתה בעיה בשליחת הבקשה ל-AI.',
        error: openaiResult.error || 'OpenAI API failed',
      };
    }
    
    // 3. Calculate token deduction
    const openaiTokens = openaiResult.usage?.totalTokens || 0;
    const tokensToDeduct = calculateTokenDeduction(openaiTokens);
    
    console.log(`📊 Token calculation: ${openaiTokens} OpenAI tokens × ${TOKEN_MULTIPLIER} = ${tokensToDeduct} tokens to deduct`);
    
    // 4. Deduct tokens
    const deductionResult = await deductTokens(userId, tokensToDeduct);
    
    if (!deductionResult.success) {
      return {
        success: false,
        tokensDeducted: 0,
        tokensRemaining: deductionResult.oldBalance,
        transparencyMessage: 'אין מספיק טוקנים לביצוע פעולה זו.',
        error: 'Failed to deduct tokens',
      };
    }
    
    // 5. Log usage
    await logTokenUsage(
      userId,
      actionType,
      openaiTokens,
      tokensToDeduct,
      deductionResult.oldBalance,
      deductionResult.newBalance,
      description,
      metadata
    );
    
    // 6. Generate transparency message
    const transparencyMessage = formatDeductionMessage(
      tokensToDeduct,
      deductionResult.newBalance,
      actionType,
      'hebrew'
    );
    
    const warningMessage = getTokenWarningMessage(deductionResult.newBalance) || undefined;
    
    // 7. Parse response if JSON
    let parsedData: any = undefined;
    if (responseFormat?.type === 'json_object' && openaiResult.response) {
      try {
        parsedData = JSON.parse(openaiResult.response);
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
      }
    }
    
    console.log(`✅ AI Request completed: ${tokensToDeduct} tokens deducted, ${deductionResult.newBalance} remaining`);
    
    return {
      success: true,
      response: openaiResult.response,
      data: parsedData,
      usage: openaiResult.usage,
      tokensDeducted: tokensToDeduct,
      tokensRemaining: deductionResult.newBalance,
      transparencyMessage,
      warningMessage,
    };
  } catch (error) {
    console.error('❌ AI request failed:', error);
    
    return {
      success: false,
      tokensDeducted: 0,
      tokensRemaining: 0,
      transparencyMessage: 'אירעה שגיאה בביצוע הבקשה.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get user's token history
 */
export async function getTokenHistory(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<{
  success: boolean;
  history?: any[];
  total?: number;
  error?: string;
}> {
  try {
    const { data, error, count } = await supabaseAdmin
      .from('token_ledger')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    
    return {
      success: true,
      history: data || [],
      total: count || 0,
    };
  } catch (error) {
    console.error('Error fetching token history:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get user's token usage summary
 */
export async function getTokenUsageSummary(userId: string): Promise<{
  success: boolean;
  summary?: any;
  error?: string;
}> {
  try {
    const { data, error } = await supabaseAdmin
      .from('token_usage_summary')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }
    
    return {
      success: true,
      summary: data || [],
    };
  } catch (error) {
    console.error('Error fetching token usage summary:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}





























