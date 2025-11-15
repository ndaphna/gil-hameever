import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    const { message, conversationHistory, systemPrompt } = await req.json()

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: message }
    ]

    // Call OpenAI API
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Try gpt-4o first (cheaper and more available)
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!completion.ok) {
      const error = await completion.text()
      console.error('❌ OpenAI API error:', { 
        status: completion.status, 
        statusText: completion.statusText,
        error: error 
      })
      
      // Check for specific error types
      let errorResponse = 'מצטערת, יש בעיה טכנית כרגע. אנא נסי שוב מאוחר יותר.';
      try {
        const errorData = JSON.parse(error);
        const errorCode = errorData.error?.code;
        const errorMessage = errorData.error?.message || '';
        
        if (errorCode === 'insufficient_quota') {
          errorResponse = 'מצטערת, נגמרה המכסה של OpenAI API. הקרדיטים שלך נמוכים מאוד. אנא הוסיפי קרדיטים בחשבון OpenAI שלך בכתובת: https://platform.openai.com/account/billing';
        } else if (errorCode === 'rate_limit_exceeded') {
          errorResponse = 'מצטערת, חרגת ממגבלת הבקשות לדקה. אנא נסי שוב בעוד כמה רגעים.';
        } else if (errorCode === 'invalid_api_key') {
          errorResponse = 'מצטערת, מפתח ה-API של OpenAI לא תקין. אנא בדקי את ההגדרות.';
        } else if (errorMessage) {
          errorResponse = `מצטערת, יש בעיה טכנית: ${errorMessage}. אנא נסי שוב מאוחר יותר.`;
        }
      } catch (e) {
        // If parsing fails, use default message
      }
      
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API error: ${error}`,
          response: errorResponse
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const data = await completion.json()
    const aiResponse = data.choices[0]?.message?.content || 'מצטערת, לא הצלחתי לענות כרגע.'
    
    console.log('✅ OpenAI response received:', {
      hasContent: !!aiResponse,
      contentLength: aiResponse.length,
      tokens: data.usage?.completion_tokens
    })

    // Calculate tokens
    const assistantTokens = data.usage?.completion_tokens || 0

    return new Response(
      JSON.stringify({
        response: aiResponse,
        assistant_tokens: assistantTokens,
        deduct_tokens: assistantTokens * 2
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('❌ Edge Function error:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack)
    }
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        response: 'מצטערת, יש בעיה טכנית כרגע. אנא נסי שוב מאוחר יותר.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})



