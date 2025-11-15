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
    
    console.log('📨 Chat API called:', { 
      hasMessage: !!message, 
      messageLength: message?.length,
      hasConversationId: !!conversationId,
      hasUserId: !!userId 
    });

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
          console.log('✅ Edge Function response:', { 
            hasResponse: !!edgeFunctionResponse.response,
            responseLength: edgeFunctionResponse.response?.length,
            hasError: !!edgeFunctionResponse.error,
            assistantTokens: edgeFunctionResponse.assistant_tokens 
          });
          
          // Check if Edge Function returned an error
          if (edgeFunctionResponse.error && !edgeFunctionResponse.response) {
            console.error('❌ Edge Function returned error:', edgeFunctionResponse.error);
            throw new Error(`Edge Function error: ${edgeFunctionResponse.error}`);
          }
          
          aiResponse = edgeFunctionResponse.response || 'מצטערת, לא הצלחתי לענות כרגע.';
          assistantTokens = edgeFunctionResponse.assistant_tokens || 0;
          deductTokens = edgeFunctionResponse.deduct_tokens || assistantTokens * 2;
        } else {
          // Edge Function failed, try direct OpenAI call
          const errorText = await response.text();
          console.error('❌ Edge Function failed:', { 
            status: response.status, 
            statusText: response.statusText,
            error: errorText 
          });
          throw new Error(`Edge Function returned ${response.status}: ${errorText}`);
        }
      } catch (edgeError: unknown) {
        console.warn('⚠️ Edge Function not available, trying direct OpenAI call:', edgeError);
        if (edgeError instanceof Error) {
          console.error('Edge Function error details:', edgeError.message, edgeError.stack);
        }
        
        // Fallback to direct OpenAI call if Edge Function is not available
        if (openaiApiKey && openaiApiKey !== 'dummy-key') {
          console.log('🔄 Attempting direct OpenAI call...');
          try {
            const completion = await fetch('https://api.openai.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${openaiApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: 'gpt-4o', // Try gpt-4o first (cheaper and more available)
                messages: messages,
                max_tokens: 1000,
                temperature: 0.7,
              }),
            });

            if (!completion.ok) {
              const errorText = await completion.text();
              console.error('OpenAI API error:', errorText);
              
              // Try to parse error to check for specific error types
              let errorMessage = `OpenAI API error: ${errorText}`;
              let errorCode = null;
              try {
                const errorData = JSON.parse(errorText);
                errorCode = errorData.error?.code;
                if (errorCode === 'insufficient_quota') {
                  errorMessage = 'insufficient_quota';
                } else if (errorCode) {
                  errorMessage = `OpenAI API error: ${errorCode} - ${errorData.error?.message || errorText}`;
                }
              } catch (e) {
                // If parsing fails, use original error text
              }
              
              throw new Error(errorMessage);
            }

            const data = await completion.json();
            console.log('✅ Direct OpenAI call succeeded:', { 
              hasContent: !!data.choices[0]?.message?.content,
              contentLength: data.choices[0]?.message?.content?.length,
              tokens: data.usage?.completion_tokens 
            });
            aiResponse = data.choices[0]?.message?.content || 'מצטערת, לא הצלחתי לענות כרגע.';
            assistantTokens = data.usage?.completion_tokens || 0;
            deductTokens = assistantTokens * 2;
          } catch (openaiError: unknown) {
            console.error('❌ Direct OpenAI call with gpt-4o failed, trying gpt-3.5-turbo as fallback:', openaiError);
            
            let fallbackSucceeded = false;
            
            // Try fallback to gpt-3.5-turbo if gpt-4o fails (might be model access issue)
            if (openaiError instanceof Error && 
                (openaiError.message.includes('insufficient_quota') || 
                 openaiError.message.includes('model_not_found') ||
                 openaiError.message.includes('model_access'))) {
              try {
                console.log('🔄 Trying fallback to gpt-3.5-turbo...');
                const fallbackCompletion = await fetch('https://api.openai.com/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${openaiApiKey}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: messages,
                    max_tokens: 1000,
                    temperature: 0.7,
                  }),
                });

                if (fallbackCompletion.ok) {
                  const fallbackData = await fallbackCompletion.json();
                  console.log('✅ Fallback to gpt-3.5-turbo succeeded');
                  aiResponse = fallbackData.choices[0]?.message?.content || 'מצטערת, לא הצלחתי לענות כרגע.';
                  assistantTokens = fallbackData.usage?.completion_tokens || 0;
                  deductTokens = assistantTokens * 2;
                  fallbackSucceeded = true;
                } else {
                  throw new Error('Fallback also failed');
                }
              } catch (fallbackError) {
                console.error('❌ Fallback to gpt-3.5-turbo also failed:', fallbackError);
                // Continue to error handling below
              }
            }
            
            // If we still don't have a response, handle the error
            if (!fallbackSucceeded) {
              if (openaiError instanceof Error) {
                console.error('OpenAI error details:', openaiError.message, openaiError.stack);
                
                // Check for specific error types
                if (openaiError.message.includes('insufficient_quota')) {
                  aiResponse = 'מצטערת, יש בעיה עם המכסה של OpenAI API. ייתכן שהמודל gpt-4o לא זמין בתוכנית שלך. אנא בדקי את ההגדרות בחשבון OpenAI שלך בכתובת: https://platform.openai.com/account/billing';
                } else if (openaiError.message.includes('rate_limit_exceeded')) {
                  aiResponse = 'מצטערת, חרגת ממגבלת הבקשות לדקה. אנא נסי שוב בעוד כמה רגעים.';
                } else if (openaiError.message.includes('invalid_api_key')) {
                  aiResponse = 'מצטערת, מפתח ה-API של OpenAI לא תקין. אנא בדקי את ההגדרות.';
                } else if (openaiError.message.includes('model_not_found') || openaiError.message.includes('model_access')) {
                  aiResponse = 'מצטערת, המודל gpt-4o לא זמין בתוכנית שלך. אנא בדקי את ההגדרות בחשבון OpenAI או נסי שוב מאוחר יותר.';
                } else {
                  // Final fallback - show the actual error message
                  const errorMsg = openaiError.message.replace('OpenAI API error: ', '');
                  aiResponse = `מצטערת, יש בעיה טכנית: ${errorMsg}. אנא נסי שוב מאוחר יותר או בדקי את ההגדרות.`;
                }
              } else {
                // Final fallback
                aiResponse = 'מצטערת, יש בעיה טכנית כרגע. אנא נסי שוב מאוחר יותר.';
              }
              assistantTokens = 0;
              deductTokens = 0;
            }
          }
        } else {
          // No OpenAI key available, use fallback
          console.error('❌ Edge Function not available and no OpenAI API key configured');
          console.error('OpenAI API key check:', { 
            hasKey: !!openaiApiKey, 
            isDummy: openaiApiKey === 'dummy-key',
            keyLength: openaiApiKey?.length 
          });
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
              max_tokens: 1000,
              temperature: 0.7,
            }),
          });

          if (!completion.ok) {
            const errorText = await completion.text();
            console.error('OpenAI API error:', errorText);
            
            // Try to parse error to check for specific error types
            let errorMessage = `OpenAI API error: ${errorText}`;
            let errorCode = null;
            try {
              const errorData = JSON.parse(errorText);
              errorCode = errorData.error?.code;
              if (errorCode === 'insufficient_quota') {
                errorMessage = 'insufficient_quota';
              } else if (errorCode) {
                errorMessage = `OpenAI API error: ${errorCode} - ${errorData.error?.message || errorText}`;
              }
            } catch (e) {
              // If parsing fails, use original error text
            }
            
            throw new Error(errorMessage);
          }

          const data = await completion.json();
          aiResponse = data.choices[0]?.message?.content || 'מצטערת, לא הצלחתי לענות כרגע.';
          assistantTokens = data.usage?.completion_tokens || 0;
          deductTokens = assistantTokens * 2;
        } catch (error) {
          console.error('OpenAI direct call failed:', error);
          if (error instanceof Error) {
            if (error.message.includes('insufficient_quota')) {
              aiResponse = 'מצטערת, נגמרה המכסה של OpenAI API. הקרדיטים שלך נמוכים מאוד ($0.08 מתוך $5.00). אנא הוסיפי קרדיטים בחשבון OpenAI שלך בכתובת: https://platform.openai.com/account/billing';
            } else if (error.message.includes('rate_limit_exceeded')) {
              aiResponse = 'מצטערת, חרגת ממגבלת הבקשות לדקה. אנא נסי שוב בעוד כמה רגעים.';
            } else if (error.message.includes('invalid_api_key')) {
              aiResponse = 'מצטערת, מפתח ה-API של OpenAI לא תקין. אנא בדקי את ההגדרות.';
            } else {
              const errorMsg = error.message.replace('OpenAI API error: ', '');
              aiResponse = `מצטערת, יש בעיה טכנית: ${errorMsg}. אנא נסי שוב מאוחר יותר או בדקי את ההגדרות.`;
            }
          } else {
            aiResponse = 'מצטערת, יש בעיה טכנית כרגע. אנא נסי שוב מאוחר יותר.';
          }
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
      error: error instanceof Error ? error.message : 'Technical issue - using fallback response'
    });
  }
}
