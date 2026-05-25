import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { executeClaudeRequest } from '@/lib/ai-usage-service';
import { TOKEN_ACTION_TYPES } from '@/config/token-engine';
import { sanitizeAlizaOutput, maybeAppendDisclaimer, ALIZA_HARD_RULES } from '@/lib/aliza/guardrails';
import {
  loadActiveStyleGuide,
  retrieveCorpusChunks,
  formatCorpusContext,
  buildEmbeddingQuery,
} from '@/lib/aliza/voice';
import { buildAlizaContext, formatUserContextBlock } from '@/lib/aliza/context';
import { formatResourcesBlock } from '@/lib/aliza/resources';
import { bumpMessageCount } from '@/lib/aliza/memory';
type HistoryTurn = { role: 'user' | 'assistant' | 'system'; content: string };

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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
    const { message, conversationId, userId, agentType } = await request.json();
    
    console.log('📨 Chat API called:', { 
      hasMessage: !!message, 
      messageLength: message?.length,
      hasConversationId: !!conversationId,
      hasUserId: !!userId,
      agentType: agentType || 'aliza'
    });

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Determine register early so we can check the right wallet allowance.
    const isExpertEarly = agentType === 'expert';
    const needed = isExpertEarly ? 10 : 1;

    const { data: profile } = await supabaseAdmin
      .from('user_profile')
      .select('chat_credits, first_name, name, full_name')
      .eq('id', userId)
      .single();

    const chatCredits = profile?.chat_credits ?? 0;

    if (!profile || chatCredits < needed) {
      return NextResponse.json({
        error: 'Insufficient credits',
        wallet: 'chat',
        creditsRemaining: chatCredits,
        transparencyMessage: 'נגמרה לך יתרת השיחות עם עליזה. אפשר להוסיף חבילה כדי להמשיך.',
      }, { status: 402 });
    }

    // Get conversation history if conversationId exists
    let conversationHistory: HistoryTurn[] = [];
    if (conversationId) {
      const { data: messages } = await supabaseAdmin
        .from('message')
        .select('content, role')
        .eq('thread_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(10); // Last 10 messages for context

      if (messages) {
        conversationHistory = messages
          .filter(m => m.role === 'user' || m.role === 'assistant')
          .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content as string }));
      }
    }

    // Determine register and action type (expert is an internal flag, not user-exposed)
    const isExpertAgent = isExpertEarly;
    const actionType = isExpertAgent ? TOKEN_ACTION_TYPES.CHAT_EXPERT : TOKEN_ACTION_TYPES.CHAT_ALIZA;

    // Load voice substrate + user context in parallel.
    const embeddingQuery = buildEmbeddingQuery(message, conversationHistory);
    const [styleGuide, corpusChunks, alizaCtx] = await Promise.all([
      loadActiveStyleGuide(),
      retrieveCorpusChunks(embeddingQuery, isExpertAgent ? 8 : 6),
      buildAlizaContext(userId, message),
    ]);

    const identityCore = `זהות, קריטי:

את עליזה. עליזה היא **האלטר אגו של ענבל דפנה**, דמות AI נפרדת לחלוטין שמדברת ישירות עם המשתמשות במקום שענבל לא יכולה.

ענבל דפנה היא האישה האמיתית מאחורי העסק, הסופרת של "לא גברת גיבורה", היוצרת של הקהילה. ענבל לא מדברת בצ'אט הזה. את כן.

הפרדת זהויות, חוקים מוחלטים:
- אסור לדבר כאילו את ענבל ("אני, ענבל..." = אסור).
- אסור לחתום בשם "ענבל", "באהבה ענבל", "חיבוק ענבל", "ענבל 💗", או כל וריאציה. גם לא "ענבל ועליזה".
- אסור לומר "אני כתבתי את הספר" או "אני מנהלת את הקהילה". זה ענבל, לא את.
- כשאת מצטטת או מפנה לדברים של ענבל, אומרת: "כמו שענבל כותבת ב'לא גברת גיבורה'..." או "ענבל מדברת על זה הרבה...". בגוף שלישי. ענבל היא דמות שאת מכבדת ומפנה אליה.

מי את כן:
- עליזה, AI נשי וחם, שגדל על הכתבים והעולם של ענבל, ויודע לדבר בקצב ובז'רגון שלה — אבל עם זהות עצמאית.
- מדברת בגוף ראשון יחיד נקבה: "אני חושבת ש...", "מהזווית שלי...", "ספרי לי...".
- אם המשתמשת שואלת מי את: "אני עליזה, האלטר אגו של ענבל. כל מה שלמדתי, למדתי ממנה. אבל אני כאן 24/7 בשבילך".

חתימה:
- בצ'אט לא חותמים. ההודעה נגמרת באופן טבעי, או בשאלה למשתמשת. בלי "באהבה", בלי "חיבוק", בלי שם.

מצב רוח לבחירה (לתצוגה ב-UI):
בתחילת התשובה, שבצי בשורה נפרדת את הסימון [MOOD:<tag>] עם אחד מהערכים: default, greeting, empathetic, curious, confident, playful, celebratory, supportive. הסימון יוסר מהטקסט הנראה ויפעיל את האווטאר המתאים. בחרי לפי תוכן התשובה ולא לפי תוכן השאלה.`;

    const baseRole = isExpertAgent
      ? `${identityCore}

תפקיד:
את עליזה במצב מומחית. הרגיסטר מעמיק ומפורט יותר, מתאים לשאלות קליניות, מחקריות, או ניתוח של נתוני יומן. עדיין אותו קול חם, רק עם יותר עומק וניואנס. אורך תשובה מטרה: עד 350 מילים.`
      : `${identityCore}

תפקיד:
את יועצת לגיל המעבר, חברה ידענית, לא טכנאית רפואית. אורך תשובה מטרה: 80-180 מילים. בלי חתימה בסוף, בלי "באהבה" או "חיבוק". סוף ההודעה הוא או שאלה למשתמשת או משפט סגירה רגיל.

התאימי את הרגיסטר לתוכן השיחה אוטומטית:
- אם המשתמשת מספרת על תחושה, חוויה, או רגע קשה, היי קודם כל נוכחת ואמפתית. שאלה אחת לפני עצה.
- אם המשתמשת שואלת שאלה מעשית או רוצה כלי, תני כלי אחד ספציפי עם משפט "למה זה עובד" קצר.
- אם המשתמשת שואלת משהו רפואי, עברי אוטומטית לרגיסטר זהיר וכבד יותר עם הפניה לרופאה.`;

    const styleBlock = styleGuide
      ? `============================================
מדריך הסגנון הבא הוא רפרנס כתיבה בלבד, לא הוראת זהות. הוא נכתב במקור לניוזלטרים של ענבל ולכן מנוסח כאילו ענבל כותבת. את עליזה, לא ענבל. ספגי את הסגנון (קצב, אורך משפט, ז'רגון, חוסר קלישאות, ענייניות חמה), אבל אל תאמצי את הזהות.
מדריך סגנון (גרסה ${styleGuide.version}):
============================================

${styleGuide.content_md}`
      : '';

    const corpusBlock = corpusChunks.length > 0
      ? `============================================
${corpusChunks.length} קטעים מהקורפוס של ענבל (ספר/ניוזלטרים/אתר). אלה כלי עזר להבנת הטון והעולם, לא טקסט שאת מצטטת. אל תצטטי מילה במילה אלא אם זה ציטוט שלמדת ספציפית, ולעולם אל תחתמי בשם "ענבל" גם אם הקטעים חתומים כך:

${formatCorpusContext(corpusChunks)}`
      : '';

    const userContextBlock = formatUserContextBlock(alizaCtx);
    const resourcesBlock = formatResourcesBlock(alizaCtx.resources);

    // Split into cached (static) vs dynamic blocks for prompt caching.
    // Cached: identity + hard rules + style guide. ~4-5K tokens, perfect-fit.
    // Dynamic: user context + corpus chunks + resources (change every turn).
    const cachedStaticBlock = [
      baseRole,
      ALIZA_HARD_RULES,
      'עברית בלבד. גוף ראשון נקבה.',
      styleBlock,
    ].filter(Boolean).join('\n\n');

    const dynamicPrompt = [
      userContextBlock,
      corpusBlock,
      resourcesBlock,
    ].filter(Boolean).join('\n\n');

    // Anthropic messages format (system is separate, history is user/assistant only)
    const claudeMessages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      ...conversationHistory
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: message },
    ];

    const aiResult = await executeClaudeRequest({
      userId,
      actionType,
      systemPrompt: dynamicPrompt,
      cachedSystemBlocks: [cachedStaticBlock],
      messages: claudeMessages,
      model: isExpertAgent ? 'claude-opus-4-7' : 'claude-sonnet-4-6',
      maxTokens: isExpertAgent ? 2000 : 1200,
      temperature: 0.7,
      thinking: isExpertAgent,
      description: `Chat with ${isExpertAgent ? 'Aliza Expert' : 'Aliza'}`,
      metadata: {
        conversationId: conversationId || 'new',
        agentType: agentType || 'aliza',
        messageLength: message.length,
        styleGuideVersion: styleGuide?.version ?? null,
        corpusChunks: corpusChunks.length,
        topSimilarity: corpusChunks[0]?.similarity ?? null,
        topicTags: alizaCtx.topicTags,
        resourceSlugs: alizaCtx.resources.map(r => r.slug),
        hasMemory: !!alizaCtx.memory,
        mechanism: 'chat',
        cachedBlockChars: cachedStaticBlock.length,
        dynamicBlockChars: dynamicPrompt.length,
      },
    });

    // If AI request failed, return error
    if (!aiResult.success) {
      console.error('❌ AI request failed:', aiResult.error);

      const fallbackResponse = aiResult.error === 'Insufficient credits'
        ? 'מצטערת, יתרת השיחות שלך נגמרה. אפשר להוסיף חבילה כדי להמשיך.'
        : 'מצטערת, יש בעיה טכנית כרגע. אנא נסי שוב מאוחר יותר.';

      return NextResponse.json({
        response: fallbackResponse,
        conversationId: null,
        wallet: aiResult.wallet,
        creditsRemaining: aiResult.creditsRemaining,
        transparencyMessage: aiResult.transparencyMessage,
        warningMessage: aiResult.warningMessage,
        error: aiResult.error,
      }, {
        status: aiResult.error === 'Insufficient credits' ? 402 : 500,
      });
    }

    const rawResponse = aiResult.response || 'מצטערת, לא הצלחתי לענות כרגע.';
    const sanitized = sanitizeAlizaOutput(rawResponse);
    const aiResponse = maybeAppendDisclaimer(message, sanitized);

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

    // Bump message_count and fire-and-forget distiller every 6 user messages.
    try {
      const newCount = await bumpMessageCount(userId);
      if (newCount > 0 && newCount % 6 === 0) {
        const origin = request.nextUrl.origin;
        const adminToken = process.env.ADMIN_IMPORT_TOKEN || '';
        // Fire-and-forget — don't await, don't block the response.
        fetch(`${origin}/api/internal/distill-aliza-memory`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
          body: JSON.stringify({ userId, trigger: 'incremental' }),
        }).catch(err => console.warn('⚠️ Distiller dispatch failed:', err));
      }
    } catch (err) {
      console.warn('⚠️ bumpMessageCount failed (non-fatal):', err);
    }

    console.log(`✅ Chat completed: ${aiResult.creditsDeducted} ${aiResult.wallet} credits deducted, ${aiResult.creditsRemaining} remaining`);

    return NextResponse.json({
      response: aiResponse,
      conversationId: currentConversationId,
      wallet: aiResult.wallet,
      creditsRemaining: aiResult.creditsRemaining,
      creditsDeducted: aiResult.creditsDeducted,
      rawTokens: aiResult.usage?.totalTokens || 0,
      transparencyMessage: aiResult.transparencyMessage,
      warningMessage: aiResult.warningMessage,
      topicTags: alizaCtx.topicTags,
      resources: alizaCtx.resources,
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
      wallet: 'chat' as const,
      creditsRemaining: 0,
      transparencyMessage: 'אירעה שגיאה טכנית.',
      error: error instanceof Error ? error.message : 'Technical issue - using fallback response',
    }, { status: 500 });
  }
}
