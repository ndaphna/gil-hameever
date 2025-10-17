import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId, userId } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check user tokens
    const { data: profile } = await supabaseAdmin
      .from('user_profile')
      .select('current_tokens')
      .eq('id', userId)
      .single();

    if (!profile || profile.current_tokens <= 0) {
      return NextResponse.json({ error: 'No tokens available' }, { status: 402 });
    }

    // Get conversation history if conversationId exists
    let conversationHistory = [];
    if (conversationId) {
      const { data: messages } = await supabaseAdmin
        .from('chat_messages')
        .select('content, is_user')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(10); // Last 10 messages for context

      if (messages) {
        conversationHistory = messages.map(msg => ({
          role: msg.is_user ? 'user' : 'assistant',
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

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'מצטערת, לא הצלחתי לענות כרגע.';

    // Save messages to database
    const { data: conversation } = await supabaseAdmin
      .from('conversations')
      .select('id')
      .eq('id', conversationId)
      .single();

    let currentConversationId = conversationId;
    
    if (!conversation) {
      // Create new conversation
      const { data: newConversation } = await supabaseAdmin
        .from('conversations')
        .insert({
          user_id: userId,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();
      
      currentConversationId = newConversation?.id;
    }

    // Save user message
    await supabaseAdmin
      .from('chat_messages')
      .insert({
        conversation_id: currentConversationId,
        content: message,
        is_user: true,
        created_at: new Date().toISOString()
      });

    // Save AI response
    await supabaseAdmin
      .from('chat_messages')
      .insert({
        conversation_id: currentConversationId,
        content: aiResponse,
        is_user: false,
        created_at: new Date().toISOString()
      });

    // Deduct token
    await supabaseAdmin
      .from('user_profile')
      .update({ current_tokens: profile.current_tokens - 1 })
      .eq('id', userId);

    return NextResponse.json({
      response: aiResponse,
      conversationId: currentConversationId,
      tokensRemaining: profile.current_tokens - 1
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
