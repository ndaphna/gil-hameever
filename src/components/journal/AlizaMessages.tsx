'use client';

import { useState, useEffect } from 'react';
import { DailyEntry, CycleEntry, AlizaMessage } from '@/types/journal';
import { supabase } from '@/lib/supabase';
import { useTokens } from '@/hooks/useTokens';
import './AlizaMessages.css';

interface AlizaMessagesProps {
  userId: string;
  dailyEntries: DailyEntry[];
  cycleEntries: CycleEntry[];
}

export default function AlizaMessages({ userId, dailyEntries, cycleEntries }: AlizaMessagesProps) {
  const [messages, setMessages] = useState<AlizaMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { loadTokens } = useTokens();

  useEffect(() => {
    loadMessages();
  }, [userId]);

  const loadMessages = async () => {
    try {
      // Load ALL messages (not just today's) - ordered by date, newest first
      console.log('🔍 Loading all Aliza messages for user:', userId);
      const { data, error } = await supabase
        .from('aliza_messages')
        .select('*')
        .eq('user_id', userId)
        .order('message_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(50); // Increase limit to show more messages

      if (error) {
        console.error('❌ Error loading messages:', error);
        throw error;
      }

      console.log('✅ Loaded messages:', {
        count: data?.length || 0,
        dates: data?.map(m => m.message_date || m.created_at) || []
      });

      setMessages(data || []);
    } catch (error) {
      console.error('❌ Error loading messages:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMessage = async () => {
    setGenerating(true);
    try {
      console.log('🔄 Generating new smart message...');
      
      // Call API to generate a new message using OpenAI
      const response = await fetch('/api/generate-aliza-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId,
          dailyEntries,
          cycleEntries
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API error:', errorData);
        throw new Error(errorData.error || 'Failed to generate message');
      }

      const result = await response.json();
      console.log('✅ Message generated:', result);

      // Update tokens in real-time if tokens were deducted or if new balance is provided
      if (result.tokens_remaining !== undefined) {
        console.log('🔄 Updating tokens after message generation:', { 
          deduct_tokens: result.deduct_tokens, 
          new_balance: result.tokens_remaining 
        });
        // Update tokens directly from response, then reload to sync
        window.dispatchEvent(new CustomEvent('tokensUpdated', { 
          detail: { tokens: result.tokens_remaining } 
        }));
        // Also reload to ensure sync
        await loadTokens();
      } else if (result.deduct_tokens && result.deduct_tokens > 0) {
        console.log('🔄 Updating tokens after message generation (fallback):', result.deduct_tokens);
        // Wait a bit for database to update
        await new Promise(resolve => setTimeout(resolve, 300));
        // Reload tokens to get the updated value from database
        await loadTokens();
      }

      // Reload messages from database to show the new message
      await loadMessages();
    } catch (error) {
      console.error('❌ Error generating message:', error);
      alert('שגיאה ביצירת הודעה. נסי שוב מאוחר יותר.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="aliza-messages-container">
        <div className="aliza-messages-loading">
          <div className="loading-spinner"></div>
          <p>טוען הודעות...</p>
        </div>
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      morning: 'בוקר טוב',
      evening: 'ערב טוב',
      cycle: 'מעקב מחזור',
      encouragement: 'עידוד',
      tip: 'טיפ'
    };
    return labels[type] || 'הודעה';
  };

  const getTypeGradient = (type: string) => {
    const gradients: Record<string, string> = {
      morning: 'linear-gradient(135deg, #FFD89B 0%, #FFE4B5 100%)',
      evening: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cycle: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      encouragement: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      tip: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    };
    return gradients[type] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  return (
    <div className="aliza-messages-container">
      {/* Header Section */}
      <div className="aliza-messages-header">
        <div className="header-content">
          <div className="aliza-avatar-section">
            <img src="/aliza_profile.jpg" alt="עליזה" className="aliza-profile-image" />
            <div className="avatar-glow"></div>
          </div>
          <div className="header-text">
            <h2 className="section-title">
              <span className="title-icon">💌</span>
              הודעות מעליזה
            </h2>
            <p className="section-subtitle">התובנות החכמות והמסרים האישיים שלך</p>
          </div>
        </div>
      </div>

      {/* Generate New Message Button */}
      <div className="generate-section-luxury">
        <button 
          className={`generate-btn-luxury ${generating ? 'generating' : ''}`}
          onClick={handleGenerateMessage}
          disabled={generating}
        >
          <span className="btn-sparkles">
            <span className="sparkle">✨</span>
            <span className="sparkle">✨</span>
          </span>
          <span className="btn-text">
            {generating ? 'יוצרת הודעה חכמה...' : 'צרי הודעה חכמה חדשה'}
          </span>
          <span className="btn-shine"></span>
        </button>
      </div>

      {/* Messages List */}
      <div className="messages-grid">
        {messages.length === 0 ? (
          <div className="empty-state-luxury">
            <div className="empty-icon-wrapper">
              <div className="empty-icon">💌</div>
              <div className="empty-icon-glow"></div>
            </div>
            <h3 className="empty-title">עדיין אין הודעות</h3>
            <p className="empty-description">
              לחצי על הכפתור למעלה כדי לקבל הודעה חכמה מעליזה המבוססת על הנתונים שלך
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={message.id} 
              className={`message-card-luxury ${message.type}`}
              style={{ 
                '--type-gradient': getTypeGradient(message.type),
                animationDelay: `${index * 0.1}s`
              } as React.CSSProperties}
            >
              <div className="card-decoration"></div>
              <div className="card-shine"></div>
              
              {/* Message Header */}
              <div className="message-header-luxury">
                <div className="message-type-badge" style={{ background: getTypeGradient(message.type) }}>
                  <span className="type-emoji">{message.emoji}</span>
                  <span className="type-label">{getTypeLabel(message.type)}</span>
                </div>
                <span className="message-date-luxury">
                  {new Date(message.created_at).toLocaleDateString('he-IL', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>

              {/* Message Content */}
              <div className="message-content-luxury">
                <div className="content-text">
                  {message.message.split('\n').map((line, i) => (
                    <p key={i} className={line.trim() === '' ? 'paragraph-break' : ''}>
                      {line.trim() || '\u00A0'}
                    </p>
                  ))}
                </div>
              </div>

              {/* Action Link */}
              {message.action_url && (
                <div className="message-action-luxury">
                  <a href={message.action_url} className="action-link-luxury">
                    <span className="link-icon">👉</span>
                    <span className="link-text">קישור לפעולה</span>
                    <span className="link-arrow">→</span>
                  </a>
                </div>
              )}

              {/* Aliza Signature */}
              <div className="message-signature">
                <div className="signature-avatar">
                  <img src="/aliza_profile.jpg" alt="עליזה" />
                </div>
                <span className="signature-text">עליזה</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
