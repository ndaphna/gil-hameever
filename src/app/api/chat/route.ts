import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import type { ChatMessage } from '@/types';

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
    const { message, conversationId, userId } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check user tokens - use current_tokens as primary source, fallback to tokens_remaining
    const { data: profile } = await supabaseAdmin
      .from('user_profile')
      .select('current_tokens, tokens_remaining')
      .eq('id', userId)
      .single();

    // Use current_tokens as primary, fallback to tokens_remaining for backward compatibility
    const availableTokens = profile?.current_tokens ?? profile?.tokens_remaining ?? 0;
    
    if (!profile || availableTokens <= 0) {
      return NextResponse.json({ error: 'No tokens available' }, { status: 402 });
    }
    
    // Ensure both fields are in sync if they differ (handle null values)
    const currentTokensValue = profile.current_tokens ?? null;
    const tokensRemainingValue = profile.tokens_remaining ?? null;
    if (currentTokensValue !== tokensRemainingValue) {
      await supabaseAdmin
        .from('user_profile')
        .update({ 
          current_tokens: availableTokens,
          tokens_remaining: availableTokens
        })
        .eq('id', userId);
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

    // Prepare messages for OpenAI
    const systemPrompt = `את עליזה, יועצת אישית מקצועית לגיל המעבר. את מומחית בתמיכה בנשים במהלך תקופת גיל המעבר.

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

    // Try Edge Function first, fallback to direct OpenAI call if needed
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    let aiResponse: string;
    let assistantTokens: number = 0;
    let deductTokens: number = 0;

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user' as const, content: message }
    ];

    // Try Edge Function first
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/aliza-chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            message,
            conversationHistory,
            systemPrompt
          }),
        });

        if (response.ok) {
          const edgeFunctionResponse = await response.json();
          aiResponse = edgeFunctionResponse.response || 'מצטערת, לא הצלחתי לענות כרגע.';
          assistantTokens = edgeFunctionResponse.assistant_tokens || 0;
          deductTokens = edgeFunctionResponse.deduct_tokens || assistantTokens * 2;
        } else {
          // Edge Function failed, try direct OpenAI call
          throw new Error(`Edge Function returned ${response.status}`);
        }
      } catch (edgeError: unknown) {
        console.warn('Edge Function not available, trying direct OpenAI call:', edgeError);
        
        // Fallback to direct OpenAI call if Edge Function is not available
        if (openaiApiKey && openaiApiKey !== 'dummy-key') {
          try {
            const completion = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'gpt-4',
                messages: messages,
                max_tokens: 300,
                temperature: 0.7,
              }),
            });

            if (!completion.ok) {
              const errorText = await completion.text();
              console.error('OpenAI API error:', errorText);
              throw new Error(`OpenAI API error: ${errorText}`);
            }

            const data = await completion.json();
            aiResponse = data.choices[0]?.message?.content || 'מצטערת, לא הצלחתי לענות כרגע.';
            assistantTokens = data.usage?.completion_tokens || 0;
            deductTokens = assistantTokens * 2;
          } catch (openaiError: unknown) {
            console.error('Direct OpenAI call also failed:', openaiError);
            // Final fallback
            aiResponse = 'מצטערת, יש בעיה טכנית כרגע. אנא נסי שוב מאוחר יותר.';
            assistantTokens = 0;
            deductTokens = 0;
          }
        } else {
          // No OpenAI key available, use fallback
          console.error('Edge Function not available and no OpenAI API key configured');
          aiResponse = 'מצטערת, יש בעיה טכנית כרגע. אנא נסי שוב מאוחר יותר.';
          assistantTokens = 0;
          deductTokens = 0;
        }
      }
    } else {
      // No Supabase config, try direct OpenAI
      if (openaiApiKey && openaiApiKey !== 'dummy-key') {
        try {
          const completion = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openaiApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4',
              messages: messages,
              max_tokens: 300,
              temperature: 0.7,
            }),
          });

          if (completion.ok) {
            const data = await completion.json();
            aiResponse = data.choices[0]?.message?.content || 'מצטערת, לא הצלחתי לענות כרגע.';
            assistantTokens = data.usage?.completion_tokens || 0;
            deductTokens = assistantTokens * 2;
          } else {
            throw new Error('OpenAI API call failed');
          }
        } catch (error) {
          console.error('OpenAI direct call failed:', error);
          aiResponse = 'מצטערת, יש בעיה טכנית כרגע. אנא נסי שוב מאוחר יותר.';
          assistantTokens = 0;
          deductTokens = 0;
        }
      } else {
        aiResponse = 'מצטערת, יש בעיה טכנית כרגע. אנא נסי שוב מאוחר יותר.';
        assistantTokens = 0;
        deductTokens = 0;
      }
    }

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

    // Deduct tokens (deduct_tokens is already calculated as assistant_tokens * 2)
    // Use the synced token value
    const currentTokens = profile.current_tokens ?? profile.tokens_remaining ?? 0;
    const newTokenBalance = Math.max(0, currentTokens - deductTokens);
    await supabaseAdmin
      .from('user_profile')
      .update({ 
        current_tokens: newTokenBalance,
        tokens_remaining: newTokenBalance  // Keep both fields in sync
      })
      .eq('id', userId);

    return NextResponse.json({
      response: aiResponse,
      conversationId: currentConversationId,
      tokensRemaining: newTokenBalance,
      assistant_tokens: assistantTokens,
      deduct_tokens: deductTokens
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Return a fallback response instead of error
    const fallbackResponse = 'מצטערת, יש בעיה טכנית כרגע. אנא נסי שוב מאוחר יותר.';
    
    return NextResponse.json({
      response: fallbackResponse,
      conversationId: null,
      tokensRemaining: 0,
      error: 'Technical issue - using fallback response'
    });
  }
}
