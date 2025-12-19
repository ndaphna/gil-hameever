import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Cache environment variables at module level
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const JSON_HEADERS = { 'Content-Type': 'application/json' }
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'

// Helper: Extract user name efficiently
function getUserName(userProfile: any): string {
  return userProfile?.first_name || 
         userProfile?.name?.split(' ')[0] || 
         userProfile?.full_name?.split(' ')[0] || 
         'יקרה'
}

// Helper: Create fallback insight
function createFallbackInsight(userName: string) {
  return {
    id: `fallback-${Date.now()}`,
    type: 'recommendation',
    title: 'המשך מעקב וניטור',
    content: `היי ${userName}, אני רואה שעליזה מנתחת את הנתונים שלך. כדי לקבל תובנות מפורטות יותר, המשכי להזין נתונים יומיים על שינה, תסמינים ומצב רוח. ככל שיהיו יותר נתונים, התובנות יהיו מדויקות ואישיות יותר.`,
    priority: 'medium',
    category: 'general',
    actionable: true,
    actionableSteps: {
      reliefMethods: ['המשכי להזין נתונים יומיים', 'עקבי אחר דפוסים', 'שתפי את הנתונים עם הרופא/ה שלך'],
      whoToContact: ['רופא/ת נשים', 'אנדוקרינולוג/ית'],
      questionsToAsk: ['מה הטיפול המתאים עבורי?', 'איך אוכל לשפר את איכות החיים?'],
      lifestyleChanges: ['שמירה על שגרת שינה', 'תזונה מאוזנת', 'פעילות גופנית מתונה']
    },
    alizaMessage: `היי ${userName}, אני כאן כדי לעזור לך! המשכי להזין נתונים ואני אנתח אותם ואתן לך תובנות אישיות ומעשיות. כל נתון שאת מזינה עוזר לי להבין טוב יותר את המסע שלך.`
  }
}

serve(async (req) => {
  try {
    // Early validation
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured', insights: [] }),
        { status: 500, headers: JSON_HEADERS }
      )
    }

    const { data, systemPrompt, userPrompt } = await req.json()

    // Validate required fields
    if (!systemPrompt || !userPrompt) {
      return new Response(
        JSON.stringify({ error: 'Missing required prompts', insights: [] }),
        { status: 400, headers: JSON_HEADERS }
      )
    }

    // Call OpenAI API with optimized settings
    const completion = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 2000, // Reduced from 3000 for cost optimization
        temperature: 0.7
      }),
    })

    if (!completion.ok) {
      const errorText = await completion.text()
      console.error('OpenAI API error:', completion.status, errorText)
      return new Response(
        JSON.stringify({ error: 'OpenAI API error', insights: [] }),
        { status: 500, headers: JSON_HEADERS }
      )
    }

    const responseData = await completion.json()
    const responseContent = responseData.choices[0]?.message?.content || '{}'
    const assistantTokens = responseData.usage?.completion_tokens || 0
    
    // Parse JSON response
    let parsed
    try {
      parsed = JSON.parse(responseContent)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse OpenAI response',
          insights: []
        }),
        { status: 500, headers: JSON_HEADERS }
      )
    }
    
    const insights = Array.isArray(parsed.insights) ? parsed.insights : []
    
    // Add fallback insight if none returned
    if (insights.length === 0) {
      const userName = getUserName(data?.userProfile)
      insights.push(createFallbackInsight(userName))
    }

    return new Response(
      JSON.stringify({
        insights,
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
        insights: [],
        assistant_tokens: 0,
        deduct_tokens: 0
      }),
      { status: 500, headers: JSON_HEADERS }
    )
  }
})

