import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Cache environment variables at module level
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const JSON_HEADERS = { 'Content-Type': 'application/json' }
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const FALLBACK_MESSAGE = 'שמתי לב שכשישנת פחות מ-6 שעות, גלי החום עלו ב-30%. הנה טיפ לשיפור השינה שלך: נסי להוריד את הטמפרטורה בחדר ל-18 מעלות ולבשי בגדים מבדים נושמים.'

serve(async (req) => {
  try {
    // Early validation
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured', message: null }),
        { status: 500, headers: JSON_HEADERS }
      )
    }

    const { contextPrompt } = await req.json()

    // Validate required field
    if (!contextPrompt) {
      return new Response(
        JSON.stringify({ error: 'Context prompt is required', message: null }),
        { status: 400, headers: JSON_HEADERS }
      )
    }

    // Call OpenAI with optimized model (gpt-4o is cheaper and faster than gpt-4)
    const completion = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Changed from gpt-4 for cost optimization
        messages: [
          { role: 'system', content: contextPrompt },
          { role: 'user', content: 'צרי הודעה חכמה ואישית המבוססת על הנתונים שסופקו.' }
        ],
        max_tokens: 500, // Reduced from 600 for cost optimization
        temperature: 0.8,
      }),
    })

    if (!completion.ok) {
      const errorText = await completion.text()
      console.error('OpenAI API error:', completion.status, errorText)
      return new Response(
        JSON.stringify({ error: 'OpenAI API error', message: null }),
        { status: 500, headers: JSON_HEADERS }
      )
    }

    const responseData = await completion.json()
    const generatedMessage = responseData.choices[0]?.message?.content || FALLBACK_MESSAGE
    const assistantTokens = responseData.usage?.completion_tokens || 0

    return new Response(
      JSON.stringify({
        message: generatedMessage,
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
        message: null,
        assistant_tokens: 0,
        deduct_tokens: 0
      }),
      { status: 500, headers: JSON_HEADERS }
    )
  }
})



