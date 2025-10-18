import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);

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
    let conversationHistory: any[] = [];
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
