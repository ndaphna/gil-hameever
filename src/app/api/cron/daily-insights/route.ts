import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import type { PersonalizedInsight } from '@/types/insights';

export const runtime = 'edge';

/**
 * Daily Insights Cron Job
 * Runs once per day in the evening to generate insights for all users
 * 
 * This endpoint should be called by:
 * - Vercel Cron Jobs (recommended)
 * - Supabase Edge Functions with pg_cron
 * - External cron service
 * 
 * Schedule: Every day at 20:00 (8:00 PM) - evening analysis
 */
export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🌅 Daily Insights Cron Job: Starting...');
    const startTime = Date.now();

    // Get all active users
    const { data: users, error: usersError } = await supabaseAdmin
      .from('user_profile')
      .select('id, first_name, name, full_name, email')
      .not('id', 'is', null);

    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }

    if (!users || users.length === 0) {
      console.log('ℹ️ No users found');
      return NextResponse.json({ 
        success: true, 
        message: 'No users to process',
        processed: 0 
      });
    }

    console.log(`📊 Processing ${users.length} users...`);

    const results = {
      processed: 0,
      succeeded: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[]
    };

    // Process each user
    for (const user of users) {
      try {
        console.log(`\n👤 Processing user: ${user.id} (${user.name || user.email})`);
        
        const result = await processUserInsights(user.id);
        
        if (result.success) {
          results.succeeded++;
          console.log(`✅ User ${user.id}: Generated ${result.insightsCount} insights, ${result.messagesCount} messages`);
        } else {
          results.failed++;
          results.errors.push(`${user.id}: ${result.error}`);
          console.error(`❌ User ${user.id}: ${result.error}`);
        }
        
        results.processed++;
      } catch (error) {
        results.failed++;
        results.processed++;
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(`${user.id}: ${errorMsg}`);
        console.error(`❌ Error processing user ${user.id}:`, error);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`\n✅ Daily Insights Cron Job: Completed in ${duration}ms`);
    console.log(`📊 Results: ${results.succeeded} succeeded, ${results.failed} failed, ${results.skipped} skipped`);

    return NextResponse.json({
      success: true,
      processed: results.processed,
      succeeded: results.succeeded,
      failed: results.failed,
      skipped: results.skipped,
      duration: `${duration}ms`,
      errors: results.errors.length > 0 ? results.errors : undefined
    });
  } catch (error) {
    console.error('❌ Daily Insights Cron Job: Fatal error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

/**
 * Process insights for a single user
 */
async function processUserInsights(userId: string): Promise<{
  success: boolean;
  insightsCount?: number;
  messagesCount?: number;
  error?: string;
}> {
  try {
    // Get user profile
    const { data: profile } = await supabaseAdmin
      .from('user_profile')
      .select('first_name, name, full_name, email')
      .eq('id', userId)
      .single();

    if (!profile) {
      return { success: false, error: 'User profile not found' };
    }

    // Get all user data
    const [dailyResult, cycleResult, emotionResult] = await Promise.all([
      supabaseAdmin
        .from('daily_entries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false }),
      supabaseAdmin
        .from('cycle_entries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false }),
      supabaseAdmin
        .from('emotion_entry')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
    ]);

    const dailyEntries = dailyResult.data || [];
    const cycleEntries = cycleResult.data || [];
    const emotionEntries = emotionResult.data || [];

    // Check if user has any data
    if (dailyEntries.length === 0 && cycleEntries.length === 0 && emotionEntries.length === 0) {
      console.log(`⚠️ User ${userId}: No data available, skipping`);
      return { success: true, insightsCount: 0, messagesCount: 0 };
    }

    // Get user profile data - use first_name only for display
    const firstName = profile.first_name || profile.name?.split(' ')[0] || profile.full_name?.split(' ')[0] || profile.email?.split('@')[0] || 'יקרה';
    const userProfile = {
      first_name: firstName,
      name: firstName, // Use first name only, not full name
      full_name: profile.full_name, // Keep for backward compatibility but don't use for display
      email: profile.email
    };

    // Generate insights using the analyze-insights API
    // Use internal URL for server-to-server communication
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    'http://localhost:3000');
    
    const insightsResponse = await fetch(`${baseUrl}/api/analyze-insights`, {
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

    if (!insightsResponse.ok) {
      const errorText = await insightsResponse.text();
      return { success: false, error: `Insights API error: ${errorText}` };
    }

    const insightsData = await insightsResponse.json();
    const insights: PersonalizedInsight[] = insightsData.insights || [];

    if (insights.length === 0) {
      console.log(`⚠️ User ${userId}: No insights generated`);
      return { success: true, insightsCount: 0, messagesCount: 0 };
    }

    // Save insights to database (add new ones, keep old ones)
    const today = new Date().toISOString().split('T')[0];
    
    // Insert new insights with unique IDs to preserve old insights
    const insightsToInsert = insights.map(insight => ({
      user_id: userId,
      insight_id: `${insight.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Make unique to avoid conflicts
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

    const { error: insightsError } = await supabaseAdmin
      .from('personalized_insights')
      .insert(insightsToInsert);

    if (insightsError) {
      console.error(`❌ Error saving insights for user ${userId}:`, insightsError);
      return { success: false, error: `Failed to save insights: ${insightsError.message}` };
    }

    // Generate and save Aliza message
    const messageResponse = await fetch(`${baseUrl}/api/generate-aliza-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        dailyEntries: dailyEntries.slice(0, 7), // Last 7 days
        cycleEntries: cycleEntries.slice(0, 3)  // Last 3 cycles
      }),
    });

    let messagesCount = 0;
    if (messageResponse.ok) {
      const messageData = await messageResponse.json();
      if (messageData.message) {
        // Insert new message WITHOUT deleting old ones - preserve all messages
        // This allows users to have both cron-generated daily messages and manually created ones
        const { error: messageError } = await supabaseAdmin
          .from('aliza_messages')
          .insert({
            user_id: userId,
            type: messageData.message.type || 'encouragement',
            message: messageData.message.message || messageData.message.content || '',
            emoji: messageData.message.emoji || '💕',
            action_url: messageData.message.actionUrl || null,
            message_date: today
          });

        if (!messageError) {
          messagesCount = 1;
        } else {
          console.error(`❌ Error saving message for user ${userId}:`, messageError);
        }
      }
    }

    return {
      success: true,
      insightsCount: insights.length,
      messagesCount
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMsg };
  }
}

