import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

serve(async (req) => {
  try {
    const { contextPrompt } = await req.json()

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured',
          message: null
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Call OpenAI to generate personalized message
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: contextPrompt },
          { role: 'user', content: 'צרי הודעה חכמה ואישית המבוססת על הנתונים שסופקו.' }
        ],
        max_tokens: 200,
        temperature: 0.8,
      }),
    })

    if (!completion.ok) {
      const error = await completion.text()
      console.error('OpenAI API error:', error)
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API error: ${error}`,
          message: null
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const responseData = await completion.json()
    const generatedMessage = responseData.choices[0]?.message?.content || 
      'שמתי לב שכשישנת פחות מ-6 שעות, גלי החום עלו ב-30%. הנה טיפ לשיפור השינה שלך: נסי להוריד את הטמפרטורה בחדר ל-18 מעלות ולבשי בגדים מבדים נושמים.'

    // Calculate tokens
    const assistantTokens = responseData.usage?.completion_tokens || 0

    return new Response(
      JSON.stringify({
        message: generatedMessage,
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
        message: null,
        assistant_tokens: 0,
        deduct_tokens: 0
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})



