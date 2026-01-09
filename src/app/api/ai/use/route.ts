/**
 * Unified AI Usage API Endpoint
 * 
 * This is the centralized endpoint for ALL AI operations.
 * 
 * Features:
 * - Validates subscription & token balance
 * - Executes AI request via OpenAI
 * - Deducts tokens using TOKEN_MULTIPLIER
 * - Logs all usage to token_ledger
 * - Returns transparency messages
 * 
 * Usage:
 * POST /api/ai/use
 * Body: {
 *   userId: string,
 *   actionType: string,
 *   messages: Array<{role, content}>,
 *   model?: string,
 *   maxTokens?: number,
 *   temperature?: number,
 *   responseFormat?: {type: 'json_object' | 'text'},
 *   description?: string,
 *   metadata?: object
 * }
 * 
 * Response: {
 *   success: boolean,
 *   response?: string,
 *   data?: any (if JSON),
 *   usage: {totalTokens, promptTokens, completionTokens},
 *   tokensDeducted: number,
 *   tokensRemaining: number,
 *   transparencyMessage: string,
 *   warningMessage?: string,
 *   error?: string
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeAIRequest, checkTokenBalance } from '@/lib/ai-usage-service';
import { TOKEN_ACTION_TYPES, type TokenActionType } from '@/config/token-engine';
import { supabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      userId,
      actionType,
      messages,
      model,
      maxTokens,
      temperature,
      responseFormat,
      description,
      metadata,
    } = body;
    
    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    if (!actionType) {
      return NextResponse.json(
        { error: 'Action type is required' },
        { status: 400 }
      );
    }
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }
    
    // Validate action type
    const validActionTypes = Object.values(TOKEN_ACTION_TYPES);
    if (!validActionTypes.includes(actionType)) {
      return NextResponse.json(
        { 
          error: 'Invalid action type',
          validTypes: validActionTypes 
        },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profile')
      .select('id, subscription_tier, subscription_status, current_tokens')
      .eq('id', userId)
      .single();
    
    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check subscription status
    if (profile.subscription_status !== 'active') {
      return NextResponse.json(
        { 
          error: 'Subscription is not active',
          subscriptionStatus: profile.subscription_status 
        },
        { status: 403 }
      );
    }
    
    // Execute AI request with full token management
    const result = await executeAIRequest({
      userId,
      actionType: actionType as TokenActionType,
      messages,
      model,
      maxTokens,
      temperature,
      responseFormat,
      description,
      metadata,
    });
    
    // Return appropriate status code
    const statusCode = result.success ? 200 : (result.error === 'Insufficient tokens' ? 402 : 500);
    
    return NextResponse.json(result, { status: statusCode });
    
  } catch (error) {
    console.error('❌ /api/ai/use error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check token balance without executing AI request
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const actionType = searchParams.get('actionType');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    if (!actionType) {
      return NextResponse.json(
        { error: 'Action type is required' },
        { status: 400 }
      );
    }
    
    // Validate action type
    const validActionTypes = Object.values(TOKEN_ACTION_TYPES);
    if (!validActionTypes.includes(actionType)) {
      return NextResponse.json(
        { 
          error: 'Invalid action type',
          validTypes: validActionTypes 
        },
        { status: 400 }
      );
    }
    
    // Check token balance
    const balanceCheck = await checkTokenBalance(
      userId,
      actionType as TokenActionType
    );
    
    return NextResponse.json({
      success: true,
      hasEnoughTokens: balanceCheck.hasEnough,
      currentBalance: balanceCheck.currentBalance,
      estimatedCost: balanceCheck.estimatedCost,
      warningMessage: balanceCheck.warningMessage,
    });
    
  } catch (error) {
    console.error('❌ /api/ai/use GET error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}










































