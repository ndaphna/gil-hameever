'use client';

import { useState, useEffect } from 'react';
import { DailyEntry, CycleEntry, AlizaMessage } from '@/types/journal';
import { supabase } from '@/lib/supabase';

interface AlizaMessagesProps {
  userId: string;
  dailyEntries: DailyEntry[];
  cycleEntries: CycleEntry[];
}

export default function AlizaMessages({ userId, dailyEntries, cycleEntries }: AlizaMessagesProps) {
  const [messages, setMessages] = useState<AlizaMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [userId]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('aliza_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSmartMessage = () => {
    // Analyze recent entries to generate personalized message
    const recentEntries = dailyEntries.slice(0, 7);
    const recentCycles = cycleEntries.slice(0, 3);
    
    // Check for patterns
    const hotFlashesCount = recentEntries.filter(e => e.hot_flashes).length;
    const sleepIssuesCount = recentEntries.filter(e => e.sleep_issues || e.sleep_quality === 'poor').length;
    const moodIssuesCount = recentEntries.filter(e => e.mood === 'sad' || e.mood === 'irritated').length;
    
    let message = '';
    let emoji = '💕';
    let type: AlizaMessage['type'] = 'encouragement';
    
    if (hotFlashesCount >= 3) {
      message = `שמתי לב שיש לך הרבה גלי חום השבוע. זה יכול להיות קשור לשינויים הורמונליים. הנה כמה טיפים שיכולים לעזור: נשימות עמוקות, לבוש שכבות, והימנעות ממזון חריף. את לא לבד! 🌸`;
      emoji = '🔥';
      type = 'tip';
    } else if (sleepIssuesCount >= 3) {
      message = `השינה שלך לא רגועה השבוע. זה קורה הרבה בתקופה הזו. נסי ליצור ריטואל שינה קבוע, הימנעי מסכינים שעה לפני השינה, ותשקלי מגנזיום. עליזה אומרת: "גם אם את לא נרדמת - תאשימי את ההורמונים, לא את עצמך!" 😴`;
      emoji = '🌙';
      type = 'tip';
    } else if (moodIssuesCount >= 3) {
      message = `המצב רוח שלך לא יציב השבוע. זה חלק טבעי מהתהליך. תזכרי שזה זמני, וכל יום חדש הוא הזדמנות. עליזה גאה בך על כל יום שאת מתמודדת איתו! 💪`;
      emoji = '💕';
      type = 'encouragement';
    } else {
      message = `איזה יופי! את מתמודדת נהדר עם השינויים. הגוף שלך מדבר ואת מקשיבה לו. זה הכי חשוב. עליזה גאה בך! 🌸`;
      emoji = '🌟';
      type = 'encouragement';
    }
    
    return { message, emoji, type };
  };

  const handleGenerateMessage = async () => {
    const { message, emoji, type } = generateSmartMessage();
    
    try {
      const { error } = await supabase
        .from('aliza_messages')
        .insert({
          user_id: userId,
          type,
          message,
          emoji
        });

      if (error) throw error;
      await loadMessages();
    } catch (error) {
      console.error('Error generating message:', error);
    }
  };

  if (loading) {
    return (
      <div className="aliza-messages">
        <div className="loading">טוען הודעות...</div>
      </div>
    );
  }

  return (
    <div className="aliza-messages">
      <div className="aliza-header">
        <h2>💌 הודעות מעליזה</h2>
        <p className="subtitle">התובנות החכמות והמסרים האישיים שלך</p>
      </div>

      {/* Generate New Message Button */}
      <div className="generate-section">
        <button 
          className="btn btn-primary generate-btn"
          onClick={handleGenerateMessage}
        >
          <span className="btn-icon">✨</span>
          צרי הודעה חכמה חדשה
        </button>
      </div>

      {/* Messages List */}
      <div className="messages-list">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💌</div>
            <h3>עדיין אין הודעות</h3>
            <p>לחצי על הכפתור למעלה כדי לקבל הודעה חכמה מעליזה</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`message-card ${message.type}`}>
              <div className="message-header">
                <span className="message-emoji">{message.emoji}</span>
                <span className="message-type">
                  {message.type === 'morning' && 'בוקר טוב'}
                  {message.type === 'evening' && 'ערב טוב'}
                  {message.type === 'cycle' && 'מעקב מחזור'}
                  {message.type === 'encouragement' && 'עידוד'}
                  {message.type === 'tip' && 'טיפ'}
                </span>
                <span className="message-date">
                  {new Date(message.created_at).toLocaleDateString('he-IL')}
                </span>
              </div>
              <div className="message-content">
                {message.message}
              </div>
              {message.action_url && (
                <div className="message-action">
                  <a href={message.action_url} className="action-link">
                    קישור לפעולה
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Aliza Personality */}
      <div className="aliza-personality">
        <div className="personality-card">
          <div className="aliza-avatar">👩‍⚕️</div>
          <div className="personality-text">
            <h3>עליזה - המלווה שלך</h3>
            <p>
              "אני כאן כדי לעזור לך להבין את הגוף שלך ולהתמודד עם השינויים. 
              כל יום הוא מסע, ואנחנו עוברות אותו יחד! 💕"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
