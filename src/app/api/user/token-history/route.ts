import { NextRequest, NextResponse } from 'next/server';
import { getTokenHistory } from '@/lib/ai-usage-service';
import { supabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'edge';

/**
 * GET /api/user/token-history
 * 
 * Returns the token usage history for the authenticated user.
 */
export async function GET(request: NextRequest) {
  try {
    // Get user ID from query params or auth header
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Verify user exists
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profile')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get pagination params
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Get token history
    const result = await getTokenHistory(userId, limit, offset);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to fetch token history' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      history: result.history || [],
      total: result.total || 0,
      limit,
      offset,
    });
    
  } catch (error) {
    console.error('❌ /api/user/token-history error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}









