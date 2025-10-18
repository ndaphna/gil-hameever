'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import './Chat.css';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  last_message?: string;
  last_message_time?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isNewConversation, setIsNewConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadUserTokens();
    loadChatHistory();
  }, []);

  const loadUserTokens = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        setUserId(user.id);
        const { data: profile } = await supabase
          .from('user_profile')
          .select('current_tokens')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserTokens(profile.current_tokens || 0);
        }
      } else {
        // Set default tokens if no user
        setUserTokens(50);
      }
    } catch (error) {
      console.log('Token loading failed, using default');
      setUserTokens(50);
    }
  };

  const loadChatHistory = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('👤 User auth check:', { user: user?.id, error: userError });
      
      // Always show welcome message, don't redirect on auth errors
      if (userError || !user) {
        console.log('❌ Auth issue - showing welcome message without redirect');
        setMessages([{
          id: '1',
          content: 'שלום! אני עליזה, היועצת האישית שלך לגיל המעבר. איך אני יכולה לעזור לך היום?',
          isUser: false,
          timestamp: new Date()
        }]);
        setIsNewConversation(true);
        return;
      }

      // טען את כל השיחות הקיימות מהטבלה thread
      console.log('🔍 Loading conversations for user:', user.id);
      console.log('🔍 Supabase client:', supabase);
      
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('thread')
        .select('id, title, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      console.log('📊 Conversations data:', conversationsData);
      console.log('❌ Conversations error:', conversationsError);
      console.log('📈 Data length:', conversationsData?.length || 0);

      if (conversationsError) {
        console.warn('❌ Error loading conversations:', conversationsError);
        setMessages([{
          id: '1',
          content: 'שלום! אני עליזה, היועצת האישית שלך לגיל המעבר. איך אני יכולה לעזור לך היום?',
          isUser: false,
          timestamp: new Date()
        }]);
        setIsNewConversation(true);
        return;
      }

      if (conversationsData && conversationsData.length > 0) {
        console.log('✅ Found conversations:', conversationsData.length);
        // השיחות כבר מכילות את המידע הנדרש
        const conversationsWithMessages = conversationsData;

        setConversations(conversationsWithMessages);

        // טען את השיחה האחרונה
        const latestConversation = conversationsWithMessages[0];
        setCurrentConversationId(latestConversation.id);
        await loadConversationMessages(latestConversation.id);
      } else {
        console.log('❌ No conversations found - showing welcome message');
        // אם אין שיחות קיימות, הוסף הודעת ברוכים הבאים
        setMessages([{
          id: '1',
          content: 'שלום! אני עליזה, היועצת האישית שלך לגיל המעבר. איך אני יכולה לעזור לך היום?',
          isUser: false,
          timestamp: new Date()
        }]);
        setIsNewConversation(true);
      }
    } catch (error) {
      console.error('❌ Error loading chat history:', error);
      // במקרה של שגיאה, הוסף הודעת ברוכים הבאים
      setMessages([{
        id: '1',
        content: 'שלום! אני עליזה, היועצת האישית שלך לגיל המעבר. איך אני יכולה לעזור לך היום?',
        isUser: false,
        timestamp: new Date()
      }]);
      setIsNewConversation(true);
    }
  };

  const loadConversationMessages = async (conversationId: string) => {
    try {
      console.log('🔍 Loading messages for conversation:', conversationId);
      const { data: messages } = await supabase
        .from('message')
        .select('content, role, created_at')
        .eq('thread_id', conversationId)
        .order('created_at', { ascending: true });

      console.log('📊 Messages data:', messages);
      console.log('📈 Messages count:', messages?.length || 0);

      if (messages && messages.length > 0) {
        console.log('✅ Found messages, formatting...');
        const formattedMessages: Message[] = messages.map((msg, index) => ({
          id: `history-${conversationId}-${index}`,
          content: msg.content,
          isUser: msg.role === 'user',
          timestamp: new Date(msg.created_at)
        }));
        setMessages(formattedMessages);
      } else {
        console.log('❌ No messages found - showing welcome message');
        setMessages([{
          id: '1',
          content: 'שלום! אני עליזה, היועצת האישית שלך לגיל המעבר. איך אני יכולה לעזור לך היום?',
          isUser: false,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('❌ Error loading conversation messages:', error);
    }
  };

  const selectConversation = async (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setIsNewConversation(false);
    await loadConversationMessages(conversationId);
  };

  const deleteConversation = async (conversationId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את השיחה?')) {
      return;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: conversationId,
          userId: userId
        }),
      });

      if (response.ok) {
        // Remove from local state
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        
        // If this was the current conversation, clear it
        if (currentConversationId === conversationId) {
          setCurrentConversationId(null);
          setMessages([{
            id: '1',
            content: 'שלום! אני עליזה, היועצת האישית שלך לגיל המעבר. איך אני יכולה לעזור לך היום?',
            isUser: false,
            timestamp: new Date()
          }]);
          setIsNewConversation(true);
        }
        
        console.log('✅ Conversation deleted successfully');
      } else {
        console.error('❌ Failed to delete conversation');
        alert('שגיאה במחיקת השיחה');
      }
    } catch (error) {
      console.error('❌ Error deleting conversation:', error);
      alert('שגיאה במחיקת השיחה');
    }
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
    setIsNewConversation(true);
    setMessages([{
      id: '1',
      content: 'שלום! אני עליזה, היועצת האישית שלך לגיל המעבר. איך אני יכולה לעזור לך היום?',
      isUser: false,
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // אם זו שיחה חדשה, צור שם אוטומטי על בסיס ההודעה הראשונה
      let conversationId = currentConversationId;
      if (isNewConversation) {
        // צור שם קצר על בסיס ההודעה הראשונה
        const title = inputMessage.length > 30 
          ? inputMessage.substring(0, 30) + '...' 
          : inputMessage;
        
        // צור שיחה חדשה עם השם
        const { data: newConversation } = await supabase
          .from('conversations')
          .insert({
            user_id: userId,
            title: title,
            created_at: new Date().toISOString()
          })
          .select('id')
          .single();
        
        if (newConversation) {
          conversationId = newConversation.id;
          setCurrentConversationId(conversationId);
          setIsNewConversation(false);
          
          // עדכן את רשימת השיחות
          setConversations(prev => [{
            id: newConversation.id,
            title: title,
            created_at: new Date().toISOString(),
            last_message: inputMessage,
            last_message_time: new Date().toISOString()
          }, ...prev]);
        }
      }

      // Call OpenAI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationId: conversationId,
          userId: userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setUserTokens(data.tokensRemaining);
      
      // עדכן את השיחה הנוכחית ברשימה
      if (conversationId) {
        setConversations(prev => prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, last_message: data.response, last_message_time: new Date().toISOString() }
            : conv
        ));
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error message to user
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'מצטערת, אירעה שגיאה. אנא נסי שוב מאוחר יותר.',
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
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

  return (
    <DashboardLayout>
      <div className="chat-container">
            <div className="chat-header">
              <div className="chat-title">
                <span className="chat-icon">💜</span>
                <h1>שיחה עם עליזה</h1>
              </div>
              <div className="tokens-display">
                <span className="token-icon">✨</span>
                <span className="token-count">{userTokens}</span>
                <span className="token-label">טוקנים זמינים</span>
              </div>
            </div>

        <div className="chat-layout">
          <div className="chat-main">
            <div className="chat-messages">
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}>
                  <div className="message-content">
                    {message.content}
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString('he-IL', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="message ai-message">
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Auto-scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              <div className="chat-input-wrapper">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="שלום עליזה, איך אני יכולה לעזור לך היום?"
                      className="chat-input"
                      rows={1}
                      disabled={isLoading || userTokens === 0}
                    />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading || userTokens === 0}
                  className="send-button"
                  title={isLoading ? 'שולח...' : 'שלח הודעה'}
                >
                  {isLoading ? '⏳' : '➤'}
                </button>
              </div>
              
              {userTokens === 0 && (
                <div className="no-tokens-message">
                  <p>✨ אין לך טוקנים זמינים כרגע. אנא רכשי טוקנים נוספים כדי להמשיך את השיחה המרתקת עם עליזה.</p>
                </div>
              )}
            </div>
          </div>

          <div className="chat-sidebar">
            <div className="conversations-header">
              <h3>השיחות שלי</h3>
              <button 
                className="new-conversation-btn"
                onClick={startNewConversation}
                title="התחל שיחה חדשה"
              >
                ✨
              </button>
            </div>
            
            <div className="conversations-list">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${currentConversationId === conversation.id ? 'active' : ''}`}
                >
                  <div 
                    className="conversation-content"
                    onClick={() => selectConversation(conversation.id)}
                  >
                    <div className="conversation-title">{conversation.title}</div>
                    <div className="conversation-preview">
                      {conversation.last_message?.substring(0, 50)}
                      {conversation.last_message && conversation.last_message.length > 50 ? '...' : ''}
                    </div>
                    <div className="conversation-time">
                      {new Date(conversation.last_message_time || conversation.created_at).toLocaleDateString('he-IL')}
                    </div>
                  </div>
                  
                      <button
                        className="delete-conversation-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conversation.id);
                        }}
                        title="מחק שיחה"
                      >
                        ✕
                      </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
