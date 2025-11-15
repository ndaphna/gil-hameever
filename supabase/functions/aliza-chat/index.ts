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
        model: 'gpt-4',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    if (!completion.ok) {
      const error = await completion.text()
      console.error('OpenAI API error:', error)
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${error}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const data = await completion.json()
    const aiResponse = data.choices[0]?.message?.content || 'מצטערת, לא הצלחתי לענות כרגע.'

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
    console.error('Edge Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        response: 'מצטערת, יש בעיה טכנית כרגע. אנא נסי שוב מאוחר יותר.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})


