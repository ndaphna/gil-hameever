import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { executeAIRequest } from '@/lib/ai-usage-service';
import { TOKEN_ACTION_TYPES } from '@/config/token-engine';
import type { ChatMessage } from '@/types';

export const runtime = 'edge';

export async function DELETE(request: NextRequest) {
  try {
    const { conversationId, userId } = await request.json();

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Delete all messages in the conversation first
    await supabaseAdmin
      .from('message')
      .delete()
      .eq('thread_id', conversationId)
      .eq('user_id', userId);

    // Delete the conversation
    const { error } = await supabaseAdmin
      .from('thread')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting conversation:', error);
      return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete conversation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, userId, agentType } = await request.json();
    
    console.log('📨 Chat API called:', { 
      hasMessage: !!message, 
      messageLength: message?.length,
      hasConversationId: !!conversationId,
      hasUserId: !!userId,
      agentType: agentType || 'aliza'
    });

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check user profile and tokens
    const { data: profile } = await supabaseAdmin
      .from('user_profile')
      .select('current_tokens, tokens_remaining, first_name, name, full_name')
      .eq('id', userId)
      .single();

    const availableTokens = profile?.current_tokens ?? profile?.tokens_remaining ?? 0;
    
    if (!profile || availableTokens <= 0) {
      return NextResponse.json({ 
        error: 'No tokens available',
        transparencyMessage: 'יתרת הטוקנים שלך אזלה. אנא מלאי מחדש כדי להמשיך לשוחח עם עליזה.',
      }, { status: 402 });
    }

    // Get conversation history if conversationId exists
    let conversationHistory: ChatMessage[] = [];
    if (conversationId) {
      const { data: messages } = await supabaseAdmin
        .from('message')
        .select('content, role')
        .eq('thread_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(10); // Last 10 messages for context

      if (messages) {
        conversationHistory = messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      }
    }

    // Determine action type and system prompt based on agent
    const isExpertAgent = agentType === 'expert';
    const actionType = isExpertAgent ? TOKEN_ACTION_TYPES.CHAT_EXPERT : TOKEN_ACTION_TYPES.CHAT_ALIZA;
    
    const systemPrompt = isExpertAgent
      ? `את סוכנת מומחית לגיל המעבר. את מתמחה בניתוח מעמיק, המלצות מקצועיות, והשוואה לנורמות רפואיות.

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
- תגיבי בהודעות ממוקדות (עד 300 מילים)`
      : `את עליזה, יועצת אישית מקצועית לגיל המעבר. את מומחית בתמיכה בנשים במהלך תקופת גיל המעבר.

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

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user' as const, content: message }
    ];

    // Execute AI request using the unified service
    const aiResult = await executeAIRequest({
      userId,
      actionType,
      messages,
      model: 'gpt-4o',
      maxTokens: isExpertAgent ? 1500 : 1000,
      temperature: 0.7,
      description: `Chat with ${isExpertAgent ? 'Expert Agent' : 'Aliza'}`,
      metadata: {
        conversationId: conversationId || 'new',
        agentType: agentType || 'aliza',
        messageLength: message.length,
      }
    });

    // If AI request failed, return error
    if (!aiResult.success) {
      console.error('❌ AI request failed:', aiResult.error);
      
      // Return user-friendly error message
      const fallbackResponse = aiResult.error === 'Insufficient tokens'
        ? 'מצטערת, אין מספיק טוקנים לביצוע פעולה זו. אנא מלאי מחדש כדי להמשיך.'
        : 'מצטערת, יש בעיה טכנית כרגע. אנא נסי שוב מאוחר יותר.';
      
      return NextResponse.json({
        response: fallbackResponse,
        conversationId: null,
        tokensRemaining: aiResult.tokensRemaining,
        transparencyMessage: aiResult.transparencyMessage,
        warningMessage: aiResult.warningMessage,
        error: aiResult.error
      }, { 
        status: aiResult.error === 'Insufficient tokens' ? 402 : 500 
      });
    }

    const aiResponse = aiResult.response || 'מצטערת, לא הצלחתי לענות כרגע.';

    // Save messages to database
    let currentConversationId = conversationId;
    
    if (!conversationId) {
      // Create new conversation ONLY if no conversationId provided (first message)
      const title = message.length > 30 
        ? message.substring(0, 30) + '...' 
        : message;
        
      const { data: newConversation } = await supabaseAdmin
        .from('thread')
        .insert({
          user_id: userId,
          title: title,
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();
      
      currentConversationId = newConversation?.id;
    } else {
      // Verify conversation exists
      const { data: conversation } = await supabaseAdmin
        .from('thread')
        .select('id')
        .eq('id', conversationId)
        .single();
        
      if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }
    }

    // Save user message
    await supabaseAdmin
      .from('message')
      .insert({
        thread_id: currentConversationId,
        user_id: userId,
        content: message,
        role: 'user',
        created_at: new Date().toISOString()
      });

    // Save AI response
    await supabaseAdmin
      .from('message')
      .insert({
        thread_id: currentConversationId,
        user_id: userId,
        content: aiResponse,
        role: 'assistant',
        created_at: new Date().toISOString()
      });

    console.log(`✅ Chat completed: ${aiResult.tokensDeducted} tokens deducted, ${aiResult.tokensRemaining} remaining`);

    return NextResponse.json({
      response: aiResponse,
      conversationId: currentConversationId,
      tokensRemaining: aiResult.tokensRemaining,
      tokensDeducted: aiResult.tokensDeducted,
      openaiTokens: aiResult.usage?.totalTokens || 0,
      transparencyMessage: aiResult.transparencyMessage,
      warningMessage: aiResult.warningMessage,
    });

  } catch (error) {
    console.error('❌ Chat API error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    
    // Return a fallback response instead of error
    const fallbackResponse = 'מצטערת, יש בעיה טכנית כרגע. אנא נסי שוב מאוחר יותר.';
    
    return NextResponse.json({
      response: fallbackResponse,
      conversationId: null,
      tokensRemaining: 0,
      transparencyMessage: 'אירעה שגיאה טכנית.',
      error: error instanceof Error ? error.message : 'Technical issue - using fallback response'
    }, { status: 500 });
  }
}
