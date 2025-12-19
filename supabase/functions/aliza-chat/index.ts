import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Cache environment variables at module level
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const JSON_HEADERS = { 'Content-Type': 'application/json' }
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

// Error messages map for efficient lookup
const ERROR_MESSAGES: Record<string, string> = {
  'insufficient_quota': 'מצטערת, נגמרה המכסה של OpenAI API. הקרדיטים שלך נמוכים מאוד. אנא הוסיפי קרדיטים בחשבון OpenAI שלך בכתובת: https://platform.openai.com/account/billing',
  'rate_limit_exceeded': 'מצטערת, חרגת ממגבלת הבקשות לדקה. אנא נסי שוב בעוד כמה רגעים.',
  'invalid_api_key': 'מצטערת, מפתח ה-API של OpenAI לא תקין. אנא בדקי את ההגדרות.',
  'default': 'מצטערת, יש בעיה טכנית כרגע. אנא נסי שוב מאוחר יותר.'
}

// Helper: Get user-friendly error message
function getErrorMessage(errorData: any): string {
  if (!errorData?.error) return ERROR_MESSAGES.default
  
  const errorCode = errorData.error.code
  const errorMessage = errorData.error.message || ''
  
  if (errorCode && ERROR_MESSAGES[errorCode]) {
    return ERROR_MESSAGES[errorCode]
  }
  
  return errorMessage ? `מצטערת, יש בעיה טכנית: ${errorMessage}. אנא נסי שוב מאוחר יותר.` : ERROR_MESSAGES.default
}

serve(async (req) => {
  try {
    // Early validation
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: JSON_HEADERS }
      )
    }

    const { message, conversationHistory, systemPrompt } = await req.json()

    // Validate required fields
    if (!message || !systemPrompt) {
      return new Response(
        JSON.stringify({ error: 'Message and system prompt are required' }),
        { status: 400, headers: JSON_HEADERS }
      )
    }

    // Prepare messages efficiently
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...(Array.isArray(conversationHistory) ? conversationHistory : []),
      { role: 'user' as const, content: message }
    ]

    // Call OpenAI API
    const completion = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!completion.ok) {
      const errorText = await completion.text()
      let errorResponse = ERROR_MESSAGES.default
      
      try {
        const errorData = JSON.parse(errorText)
        errorResponse = getErrorMessage(errorData)
      } catch {
        // Use default if parsing fails
      }
      
      console.error('OpenAI API error:', completion.status, errorText)
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API error',
          response: errorResponse
        }),
        { status: 500, headers: JSON_HEADERS }
      )
    }

    const data = await completion.json()
    const aiResponse = data.choices[0]?.message?.content || 'מצטערת, לא הצלחתי לענות כרגע.'
    const assistantTokens = data.usage?.completion_tokens || 0

    return new Response(
      JSON.stringify({
        response: aiResponse,
        assistant_tokens: assistantTokens,
        deduct_tokens: assistantTokens * 2
      }),
      { status: 200, headers: JSON_HEADERS }
    )
  } catch (error) {
    console.error('Edge Function error:', error instanceof Error ? error.message : error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        response: ERROR_MESSAGES.default
      }),
      { status: 500, headers: JSON_HEADERS }
    )
  }
})



