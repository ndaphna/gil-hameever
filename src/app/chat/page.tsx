'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useTokens } from '@/hooks/useTokens';
import DashboardLayout from '../components/DashboardLayout';
import { AlizaAvatar } from '@/components/chat/AlizaAvatar';
import { AlizaWelcome } from '@/components/chat/AlizaWelcome';
import { SuggestionChips } from '@/components/chat/SuggestionChips';
import { ResourceCard, type ResourceCardData } from '@/components/chat/ResourceCard';
import { MemoryPanel } from '@/components/chat/MemoryPanel';
import { parseAlizaMessage } from '@/lib/aliza/messageParser';
import { type AlizaMood } from '@/lib/aliza/avatars';
import styles from './Chat.module.css';

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  /** Parsed: only set on Aliza messages. */
  mood?: AlizaMood;
};

type Conversation = {
  id: string;
  title: string;
  created_at: string;
  last_message?: string;
  last_message_time?: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isNewConversation, setIsNewConversation] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resourceCatalog, setResourceCatalog] = useState<Record<string, ResourceCardData>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { chatCredits, isLoading: tokensLoading, loadTokens, updateChatCredits } = useTokens();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  // Preload resource catalog on mount so [RESOURCE:slug] markers can resolve instantly.
  useEffect(() => {
    fetch('/api/aliza/resources')
      .then(r => r.ok ? r.json() : { resources: [] })
      .then(j => {
        const map: Record<string, ResourceCardData> = {};
        for (const r of (j.resources ?? [])) {
          map[r.slug] = r as ResourceCardData;
        }
        setResourceCatalog(map);
      })
      .catch(() => { /* swallow */ });
  }, []);

  // Auth: subscribe to session changes so we react when the cookie hydrates
  // (avoids the race where loadChatHistory ran before getUser was ready).
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setUserId(session?.user?.id ?? null);
      setAuthChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUserId(session?.user?.id ?? null);
      setAuthChecked(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load past conversations whenever userId becomes available. Does NOT
  // auto-open the latest conversation; user lands on the fresh welcome.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('thread')
        .select('id, title, created_at, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      if (cancelled) return;
      if (error) {
        console.warn('Failed to load conversations:', error.message);
        return;
      }
      setConversations((data ?? []) as Conversation[]);
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const loadConversationMessages = async (conversationId: string) => {
    const { data: rows } = await supabase
      .from('message')
      .select('content, role, created_at')
      .eq('thread_id', conversationId)
      .order('created_at', { ascending: true });

    if (rows && rows.length > 0) {
      const parsed: Message[] = rows.map((m, idx) => {
        const isUser = m.role === 'user';
        if (isUser) {
          return {
            id: `m-${conversationId}-${idx}`,
            content: m.content,
            isUser: true,
            timestamp: new Date(m.created_at),
          };
        }
        const { mood, segments } = parseAlizaMessage(m.content);
        // Reconstruct content with markers stripped (text-only view + segments).
        const cleaned = segments.map(s => s.type === 'text' ? s.text : `[RESOURCE:${s.slug}]`).join('\n\n');
        return {
          id: `m-${conversationId}-${idx}`,
          content: cleaned,
          isUser: false,
          timestamp: new Date(m.created_at),
          mood,
        };
      });
      setMessages(parsed);
      setIsNewConversation(false);
    } else {
      setIsNewConversation(true);
      setMessages([]);
    }
  };

  const selectConversation = async (id: string) => {
    setCurrentConversationId(id);
    setSidebarOpen(false);
    await loadConversationMessages(id);
  };

  const deleteConversation = async (id: string) => {
    if (!confirm('למחוק את השיחה?')) return;
    const { data: { session } } = await supabase.auth.getSession();
    const uid = userId ?? session?.user?.id;
    if (!uid) return;
    const resp = await fetch('/api/chat', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId: id, userId: uid }),
    });
    if (resp.ok) {
      setConversations(prev => prev.filter(c => c.id !== id));
      if (currentConversationId === id) {
        setCurrentConversationId(null);
        setMessages([]);
        setIsNewConversation(true);
      }
    }
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
    setIsNewConversation(true);
    setMessages([]);
    setSidebarOpen(false);
    inputRef.current?.focus();
  };

  const handleSendMessage = async (overridePrompt?: string) => {
    const text = (overridePrompt ?? inputMessage).trim();
    if (!text || isLoading) return;
    if (!userId) {
      // Auth still hydrating. Try to grab the session now as a last resort.
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      setUserId(session.user.id);
    }
    // Allow send during initial credit load — server will 402 if truly empty.
    if (!tokensLoading && chatCredits <= 0) {
      await loadTokens();
      if (chatCredits <= 0) return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsNewConversation(false);
    setIsLoading(true);

    // Resolve userId at send time (state may not have flushed yet on first turn).
    const { data: { session } } = await supabase.auth.getSession();
    const resolvedUserId = userId ?? session?.user?.id;
    if (!resolvedUserId) {
      setIsLoading(false);
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        content: 'נראה שלא התחברת. רעני את הדף ונסי שוב.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errMsg]);
      return;
    }

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationId: currentConversationId,
          userId: resolvedUserId,
        }),
      });

      const data = await resp.json().catch(() => ({
        response: 'מצטערת, יש בעיה טכנית כרגע. אנא נסי שוב מאוחר יותר.',
      }));

      if (resp.status === 402) {
        setMessages(prev => prev.filter(m => m.id !== userMessage.id));
        await loadTokens();
        const noTokens: Message = {
          id: `err-${Date.now()}`,
          content: 'אין לך טוקנים זמינים כרגע. אנא מלאי מחדש כדי להמשיך.',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, noTokens]);
        return;
      }

      // Update conversation id if this was a fresh thread
      if (!currentConversationId && data.conversationId) {
        setCurrentConversationId(data.conversationId);
        const title = text.length > 30 ? text.slice(0, 30) + '...' : text;
        setConversations(prev => [{
          id: data.conversationId,
          title,
          created_at: new Date().toISOString(),
          last_message: text,
          last_message_time: new Date().toISOString(),
        }, ...prev]);
      }

      const rawResponse: string = data.response ?? 'מצטערת, יש בעיה טכנית כרגע.';
      const { mood, segments } = parseAlizaMessage(rawResponse);
      const cleaned = segments.map(s => s.type === 'text' ? s.text : `[RESOURCE:${s.slug}]`).join('\n\n');

      const aiMessage: Message = {
        id: `aliza-${Date.now()}`,
        content: cleaned,
        isUser: false,
        timestamp: new Date(),
        mood,
      };
      setMessages(prev => [...prev, aiMessage]);

      // Optimistic chat-wallet update from the API response (server already
      // deducted). Skip the inline update if the response didn't succeed so a
      // failed deduction never zeroes out the UI; the loadTokens() re-fetch
      // below is the authoritative source either way.
      if (resp.ok && typeof data.creditsRemaining === 'number') {
        updateChatCredits(data.creditsRemaining);
      }
      loadTokens();
    } catch (err) {
      const fallback: Message = {
        id: `err-${Date.now()}`,
        content: 'מצטערת, אירעה שגיאה. אנא נסי שוב.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallback]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChipPick = (prompt: string) => {
    setInputMessage(prompt);
    inputRef.current?.focus();
  };

  const renderAlizaSegments = (content: string) => {
    const segs = content.split(/\[RESOURCE:([a-z0-9\-_]+)\]/i);
    return segs.map((part, idx) => {
      if (idx % 2 === 1) {
        const slug = part.toLowerCase();
        const meta = resourceCatalog[slug];
        return meta ? <ResourceCard key={`r-${idx}`} data={meta} /> : null;
      }
      return part ? <p key={`t-${idx}`} className={styles.bubbleText}>{part}</p> : null;
    });
  };

  return (
    <DashboardLayout className="chat-page">
      <div className={styles.shell}>
        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="היסטוריית שיחות"
          >
            <span aria-hidden="true">☰</span>
            <span className={styles.iconBtnLabel}>שיחות</span>
          </button>
          <div className={styles.toolbarTitle}>
            <AlizaAvatar mood="default" size="xs" />
            <span>עליזה</span>
          </div>
          <MemoryPanel />
        </div>

        <main className={styles.main}>
          {isNewConversation && messages.length === 0 && (
            <>
              <AlizaWelcome />
              <SuggestionChips onPick={handleChipPick} />
            </>
          )}

          <div className={styles.messages}>
            {messages.map(message => (
              <div
                key={message.id}
                className={`${styles.row} ${message.isUser ? styles.rowUser : styles.rowAliza}`}
              >
                {!message.isUser && (
                  <AlizaAvatar mood={message.mood ?? 'default'} size="sm" state="idle" />
                )}
                <div className={`${styles.bubble} ${message.isUser ? styles.bubbleUser : styles.bubbleAliza}`}>
                  {message.isUser
                    ? <p className={styles.bubbleText}>{message.content}</p>
                    : renderAlizaSegments(message.content)
                  }
                  <span className={styles.time}>
                    {message.timestamp.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.row} ${styles.rowAliza}`}>
                <AlizaAvatar mood="default" size="sm" state="speaking" />
                <div className={`${styles.bubble} ${styles.bubbleAliza}`}>
                  <div className={styles.typing}>
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputBar}>
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={tokensLoading ? 'טוען...' : 'כתבי לעליזה...'}
              className={styles.input}
              rows={1}
              disabled={isLoading || (!tokensLoading && chatCredits <= 0)}
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading || (!tokensLoading && chatCredits <= 0)}
              className={styles.send}
              aria-label="שלחי"
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>

          {!tokensLoading && chatCredits <= 0 && (
            <p className={styles.noTokens}>
              נגמרה לך יתרת השיחות עם עליזה. אפשר להוסיף חבילה כדי להמשיך.
            </p>
          )}
        </main>

        {/* Sidebar (drawer on mobile, fixed on desktop) */}
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <h3>השיחות שלי</h3>
            <button type="button" onClick={startNewConversation} className={styles.newConv}>
              + שיחה חדשה
            </button>
          </div>
          <div className={styles.convList}>
            {conversations.length === 0 && (
              <p className={styles.convEmpty}>אין עדיין שיחות. התחילי שיחה חדשה למעלה.</p>
            )}
            {conversations.map(conv => {
              const title = (conv.title || '').trim() || 'שיחה ללא כותרת';
              const date = new Date(conv.last_message_time || conv.created_at).toLocaleDateString('he-IL');
              const isActive = currentConversationId === conv.id;
              return (
                <div
                  key={conv.id}
                  className={`${styles.convItem} ${isActive ? styles.convActive : ''}`}
                  onClick={() => selectConversation(conv.id)}
                  role="button"
                  tabIndex={0}
                  title={title}
                >
                  <span className={styles.convTitle}>{title}</span>
                  <span className={styles.convDate}>{date}</span>
                  <button
                    type="button"
                    className={styles.convDelete}
                    onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                    aria-label="מחקי שיחה"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </aside>

        {sidebarOpen && (
          <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)} />
        )}
      </div>
    </DashboardLayout>
  );
}
