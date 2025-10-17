'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import './Chat.css';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userTokens, setUserTokens] = useState(0);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUserTokens();
    // הוסף הודעת ברוכים הבאים
    setMessages([{
      id: '1',
      content: 'שלום! אני עליזה, היועצת האישית שלך לגיל המעבר. איך אני יכולה לעזור לך היום?',
      isUser: false,
      timestamp: new Date()
    }]);
  }, []);

  const loadUserTokens = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      const { data: profile } = await supabase
        .from('user_profile')
        .select('current_tokens')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setUserTokens(profile.current_tokens || 0);
      }
    }
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
      // Call OpenAI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationId: currentConversationId,
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
      setCurrentConversationId(data.conversationId);
      
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
          <span className="chat-icon">💬</span>
          <h1>שיחה עם עליזה</h1>
        </div>
        <div className="tokens-display">
          <span className="token-icon">✨</span>
          <span className="token-count">{userTokens}</span>
          <span className="token-label">טוקנים</span>
        </div>
      </div>

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
      </div>

      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="כתבי את השאלה שלך כאן..."
            className="chat-input"
            rows={1}
            disabled={isLoading || userTokens === 0}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading || userTokens === 0}
            className="send-button"
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
        
        {userTokens === 0 && (
          <div className="no-tokens-message">
            <p>אין לך טוקנים זמינים. אנא רכשי טוקנים נוספים כדי להמשיך לשוחח עם עליזה.</p>
          </div>
        )}
      </div>
      </div>
    </DashboardLayout>
  );
}
