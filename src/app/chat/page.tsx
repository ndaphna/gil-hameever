'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useTokens } from '@/hooks/useTokens';
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
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isNewConversation, setIsNewConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { tokens: userTokens, decrementTokens } = useTokens();

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadUserId();
    loadChatHistory();
  }, []);

  const loadUserId = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        setUserId(user.id);
      }
    } catch (error) {
      console.log('User ID loading failed');
    }
  };

  const loadChatHistory = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('👤 User auth check:', { user: user?.id, error: userError });
      
      // Show welcome message and continue if no authenticated user
      if (userError || !user) {
        console.log('❌ No authenticated user - showing welcome message');
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
        let errorMessage = 'Failed to send message';
        try {
          const responseText = await response.text();
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error || errorMessage;
          } catch (jsonError) {
            // If response is not JSON (e.g., HTML error page)
            console.error('Response is not JSON:', responseText);
            errorMessage = 'Server returned non-JSON response. Please check your configuration.';
          }
        } catch (textError) {
          console.error('Failed to read response text:', textError);
          errorMessage = 'Failed to read server response. Please check your configuration.';
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        throw new Error('Invalid response from server. Please check your configuration.');
      }
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      
      // עדכן את הטוקנים עם הערך החדש מהשרת
      if (data.tokensRemaining !== undefined) {
        console.log('🔄 Updating tokens from server:', data.tokensRemaining);
        // Dispatch event to update tokens in all components
        window.dispatchEvent(new CustomEvent('tokensUpdated', { 
          detail: { tokens: data.tokensRemaining } 
        }));
      }
      
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
      
      // Show specific error message to user
      let errorContent = 'מצטערת, אירעה שגיאה. אנא נסי שוב מאוחר יותר.';
      
      if (error instanceof Error) {
        if (error.message.includes('OpenAI API key')) {
          errorContent = 'בעיה בהגדרת OpenAI. אנא בדקי את מפתח ה-API.';
        } else if (error.message.includes('non-JSON response')) {
          errorContent = 'בעיה בהגדרת השרת. אנא בדקי את ההגדרות.';
        } else if (error.message.includes('Invalid response')) {
          errorContent = 'בעיה בקבלת תגובה מהשרת. אנא בדקי את ההגדרות.';
        } else {
          errorContent = `מצטערת, אירעה שגיאה: ${error.message}`;
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorContent,
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
    <DashboardLayout className="chat-page">
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
                aria-label="התחל שיחה חדשה"
              >
                <span className="new-conversation-icon">➕</span>
                <span className="new-conversation-text">שיחה חדשה</span>
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
