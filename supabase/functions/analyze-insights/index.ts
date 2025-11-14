import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

serve(async (req) => {
  try {
    console.log('🔍 Edge Function: analyze-insights called');
    const { analysisType, data, systemPrompt, userPrompt } = await req.json()

    console.log('📥 Edge Function: Received request:', {
      analysisType,
      hasData: !!data,
      dailyEntriesCount: data?.dailyEntries?.length || 0,
      cycleEntriesCount: data?.cycleEntries?.length || 0,
      systemPromptLength: systemPrompt?.length || 0,
      userPromptLength: userPrompt?.length || 0
    });

    if (!OPENAI_API_KEY) {
      console.error('❌ Edge Function: OpenAI API key not configured');
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key not configured',
          insights: []
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log('🤖 Edge Function: Calling OpenAI API...');
    // Call OpenAI API
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
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
        max_tokens: 3000,
        temperature: 0.7
      }),
    })

    console.log('📥 Edge Function: OpenAI API response status:', completion.status);

    if (!completion.ok) {
      const error = await completion.text()
      console.error('❌ Edge Function: OpenAI API error:', error)
      console.error('❌ Edge Function: Status:', completion.status)
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API error: ${error}`,
          insights: []
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const responseData = await completion.json()
    console.log('✅ Edge Function: OpenAI API success, parsing response...');
    const responseContent = responseData.choices[0]?.message?.content || '{}'
    
    console.log('📄 Edge Function: Raw OpenAI response (first 1000 chars):', responseContent.substring(0, 1000));
    
    let parsed;
    try {
      parsed = JSON.parse(responseContent)
      console.log('✅ Edge Function: Parsed JSON successfully');
      console.log('📊 Edge Function: Parsed structure:', {
        hasInsights: !!parsed.insights,
        insightsType: Array.isArray(parsed.insights) ? 'array' : typeof parsed.insights,
        insightsLength: Array.isArray(parsed.insights) ? parsed.insights.length : 'N/A'
      });
    } catch (parseError) {
      console.error('❌ Edge Function: JSON parse error:', parseError);
      console.error('❌ Edge Function: Full response content:', responseContent);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse OpenAI response',
          insights: [],
          rawResponse: responseContent.substring(0, 500)
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // Calculate tokens
    const assistantTokens = responseData.usage?.completion_tokens || 0
    const insights = parsed.insights || [];
    
    console.log('✅ Edge Function: Returning insights:', {
      count: insights.length,
      assistantTokens,
      deductTokens: assistantTokens * 2,
      firstInsight: insights.length > 0 ? {
        id: insights[0].id,
        title: insights[0].title,
        priority: insights[0].priority
      } : 'none'
    });
    
    if (insights.length === 0) {
      console.warn('⚠️ Edge Function: OpenAI returned 0 insights!');
      console.warn('⚠️ Edge Function: Full parsed response:', JSON.stringify(parsed, null, 2));
      
      // Fallback: Create a general insight if OpenAI didn't return any
      console.log('🔄 Edge Function: Creating fallback insight...');
      const fallbackInsight = {
        id: 'fallback-general-' + Date.now(),
        type: 'recommendation',
        title: 'המשך מעקב וניטור',
        content: 'עליזה מנתחת את הנתונים שלך. כדי לקבל תובנות מפורטות יותר, המשכי להזין נתונים יומיים על שינה, תסמינים ומצב רוח. ככל שיהיו יותר נתונים, התובנות יהיו מדויקות ואישיות יותר.',
        priority: 'medium',
        category: 'general',
        actionable: true,
        actionableSteps: {
          reliefMethods: ['המשכי להזין נתונים יומיים', 'עקבי אחר דפוסים', 'שתפי את הנתונים עם הרופא/ה שלך'],
          whoToContact: ['רופא/ת נשים', 'אנדוקרינולוג/ית'],
          questionsToAsk: ['מה הטיפול המתאים עבורי?', 'איך אוכל לשפר את איכות החיים?'],
          lifestyleChanges: ['שמירה על שגרת שינה', 'תזונה מאוזנת', 'פעילות גופנית מתונה']
        },
        alizaMessage: 'אני כאן כדי לעזור לך! המשכי להזין נתונים ואני אנתח אותם ואתן לך תובנות אישיות ומעשיות. כל נתון שאת מזינה עוזר לי להבין טוב יותר את המסע שלך.'
      };
      
      insights.push(fallbackInsight);
      console.log('✅ Edge Function: Added fallback insight');
    }

    return new Response(
      JSON.stringify({
        insights: insights,
        assistant_tokens: assistantTokens,
        deduct_tokens: assistantTokens * 2
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('❌ Edge Function: Exception:', error)
    if (error instanceof Error) {
      console.error('❌ Edge Function: Error message:', error.message)
      console.error('❌ Edge Function: Error stack:', error.stack)
    }
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error',
        insights: [],
        assistant_tokens: 0,
        deduct_tokens: 0
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

