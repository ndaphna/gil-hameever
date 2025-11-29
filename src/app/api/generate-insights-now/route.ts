import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export const runtime = 'edge';

/**
 * Generate Insights Now API
 * Allows users to manually trigger insight generation
 * This is a fallback when the daily cron job hasn't run yet
 * 
 * IMPORTANT: This calls OpenAI to generate fresh insights based on ALL current data
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    console.log('🔄 Manual insight generation requested for user:', userId);

    // Fetch all user data
    const [dailyResult, cycleResult, emotionResult, profileResult] = await Promise.all([
      supabaseAdmin.from('daily_entries').select('*').eq('user_id', userId),
      supabaseAdmin.from('cycle_entries').select('*').eq('user_id', userId),
      supabaseAdmin.from('emotion_entries').select('*').eq('user_id', userId),
      supabaseAdmin.from('user_profile').select('*').eq('id', userId).single()
    ]);

    const dailyEntries = dailyResult.data || [];
    const cycleEntries = cycleResult.data || [];
    const emotionEntries = emotionResult.data || [];
    const userProfile = profileResult.data || {};

    if (dailyEntries.length === 0 && cycleEntries.length === 0 && emotionEntries.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No data available. Please add some entries first.' 
      }, { status: 200 });
    }

    console.log('📊 Data fetched:', {
      daily: dailyEntries.length,
      cycle: cycleEntries.length,
      emotion: emotionEntries.length
    });

    // Call the analyze-insights API to generate insights using OpenAI
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    'http://localhost:3000');

    const analyzeResponse = await fetch(`${baseUrl}/api/analyze-insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        analysisType: 'comprehensive',
        data: {
          dailyEntries,
          cycleEntries,
          emotionEntries,
          userProfile
        }
      }),
    });

    if (!analyzeResponse.ok) {
      const errorData = await analyzeResponse.json();
      console.error('❌ Error from analyze-insights API:', errorData);
      return NextResponse.json({ 
        error: 'Failed to generate insights',
        details: errorData.error || 'Unknown error'
      }, { status: 500 });
    }

    const analyzeResult = await analyzeResponse.json();
    const generatedInsights = analyzeResult.insights || [];

    if (generatedInsights.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No insights generated. Make sure you have data entries.' 
      }, { status: 200 });
    }

    // Save insights to database using admin client (bypasses RLS)
    const today = new Date().toISOString().split('T')[0];
    
    // Create unique insight_id for each insight to preserve old insights
    // Each insight gets a unique ID so old ones are not replaced
    const insightsToInsert = generatedInsights.map((insight, index) => ({
      user_id: userId,
      insight_id: `${insight.id}-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`, // Truly unique ID
      type: insight.type,
      title: insight.title,
      content: insight.content,
      priority: insight.priority,
      category: insight.category,
      actionable: insight.actionable || false,
      comparison_to_norm: insight.comparisonToNorm || null,
      actionable_steps: insight.actionableSteps || null,
      visual_data: insight.visualData || null,
      aliza_message: insight.alizaMessage || '',
      analysis_date: today
    }));

    console.log('💾 Saving insights to database:', {
      count: insightsToInsert.length,
      insightIds: insightsToInsert.map(i => i.insight_id),
      today
    });

    const { data: insertedData, error: insertError } = await supabaseAdmin
      .from('personalized_insights')
      .insert(insightsToInsert)
      .select();

    if (insertError) {
      console.error('❌ Error saving insights:', insertError);
      console.error('❌ Error details:', JSON.stringify(insertError, null, 2));
      return NextResponse.json({ 
        error: 'Failed to save insights',
        details: insertError.message 
      }, { status: 500 });
    }

    console.log('✅ Successfully saved insights:', {
      requested: insightsToInsert.length,
      inserted: insertedData?.length || 0,
      insertedIds: insertedData?.map(i => i.insight_id) || []
    });

    // Verify that old insights are still there
    const { data: allInsights, error: verifyError } = await supabaseAdmin
      .from('personalized_insights')
      .select('id, insight_id, analysis_date, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!verifyError && allInsights) {
      console.log('📊 Total insights in database after insert:', allInsights.length);
      console.log('📋 All insight dates:', allInsights.map(i => i.analysis_date));
    }

    return NextResponse.json({ 
      success: true, 
      insightsCount: generatedInsights.length,
      deduct_tokens: analyzeResult.deduct_tokens || 0,
      assistant_tokens: analyzeResult.assistant_tokens || 0
    });
  } catch (error) {
    console.error('❌ Error in generate-insights-now:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

