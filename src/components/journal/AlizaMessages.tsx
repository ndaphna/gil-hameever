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
    const poorSleepDays = recentEntries.filter(e => e.sleep_quality === 'poor').length;
    const moodIssuesCount = recentEntries.filter(e => e.mood === 'sad' || e.mood === 'irritated' || e.mood === 'frustrated').length;
    const nightSweatsCount = recentEntries.filter(e => e.night_sweats).length;
    const energyLowCount = recentEntries.filter(e => e.energy_level === 'low').length;
    
    // Get current time of day
    const hour = new Date().getHours();
    const isEvening = hour >= 18;
    const isMorning = hour >= 5 && hour < 12;
    
    let message = '';
    let emoji = '💕';
    let type: AlizaMessage['type'] = 'encouragement';
    let action_url = '';
    
    // Time-based messages
    if (isMorning && dailyEntries.length > 0) {
      const todayEntry = dailyEntries.find(e => 
        e.date === new Date().toISOString().split('T')[0] && 
        e.time_of_day === 'morning'
      );
      
      if (!todayEntry) {
        message = `בוקר אור 🌸\n\nראיתי שכתבת שלא ישנת טוב אתמול.\n\nאולי היום תנסי להוריד קצב בערב?\n\nהנה קישור לתרגיל הנשימות של עליזה — רק 3 דקות, ויש מצב שתתעוררי מחר מחויכת.`;
        emoji = '🌅';
        type = 'morning';
        action_url = '/physical-activity';
      }
    } else if (isEvening) {
      message = `היי אהובה 💛\n\nהגיע הזמן לעמעם אורות.\n\nתזכרי לקחת מגנזיום ולשים מוזיקת 'גלים רכים'.\n\nעליזה מוסרת: 'אם את לא נרדמת — תאשימי את ההורמונים, לא את עצמך.' 😅`;
      emoji = '🌙';
      type = 'evening';
      action_url = '/menopausal-sleep';
    }
    
    // Pattern-based messages
    else if (hotFlashesCount >= 3 && nightSweatsCount >= 2) {
      message = `שמתי לב שכשישנת פחות מ-6 שעות, גלי החום עלו ב-30%.\n\nהנה טיפ לשיפור השינה שלך: נסי להוריד את הטמפרטורה בחדר ל-18 מעלות ולבשי בגדים מבדים נושמים.`;
      emoji = '🔥';
      type = 'tip';
      action_url = '/heat-waves';
    } else if (sleepIssuesCount >= 3 && energyLowCount >= 3) {
      message = `יש קשר ישיר בין איכות השינה לרמת האנרגיה שלך.\n\nכדאי לבדוק רמות ויטמין D ו-B12. גם פעילות גופנית קלה בבוקר יכולה לעזור.\n\nזוכרת את התרגיל של 'walking meditation' שלמדנו?`;
      emoji = '⚡';
      type = 'tip';
      action_url = '/physical-activity';
    } else if (moodIssuesCount >= 3) {
      message = `המצב רוח שלך לא יציב השבוע.\n\nזה נורמלי לחלוטין בתקופה זו - ההורמונים משחקים איתנו 'תופסת אותי'.\n\nתזכרי: את לא המצב רוח שלך. את אותה אישה חזקה שהתמודדה עם אתגרים יותר קשים.\n\nאולי כדאי לדבר עם מישהי קרוב?`;
      emoji = '🤗';
      type = 'encouragement';
      action_url = '/self-worth';
    } else if (cycleEntries.length > 0) {
      const lastPeriod = cycleEntries.find(e => e.is_period);
      if (lastPeriod) {
        const daysSince = Math.floor((new Date().getTime() - new Date(lastPeriod.date).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSince > 35) {
          message = `זוכרת שסימנת מחזור לפני ${daysSince} ימים?\n\nזה בערך הזמן שבו הגוף שואל 'מה קורה הפעם?' 😄\n\nכנסי לעדכן אם כבר קיבלת או שהפעם זה דילג.\n\nובינתיים — הנה תרגיל קצר להקלה על כאבי גב תחתון.`;
          emoji = '🌸';
          type = 'cycle';
        }
      }
    } else if (recentEntries.length >= 7) {
      message = `איזה יופי! עקבת כבר 7 ימים ברצף 👏\n\nהגוף שלך מדבר — ואת מקשיבה.\n\nעליזה גאה בך. היא מבקשת שתכתבי לה בתגובות איזה שינוי הכי הפתיע אותך השבוע.`;
      emoji = '🎆';
      type = 'encouragement';
    } else {
      message = `את לא לבד. המערכת שלך פשוט מתאמנת על מצב חדש. 😅\n\nהמשיכי לתעד את המסע שלך - כל דיווח עוזר לי ללמוד אותך ולתת לך תובנות יותר מותאמות.`;
      emoji = '🌟';
      type = 'encouragement';
    }
    
    return { message, emoji, type, action_url };
  };

  const handleGenerateMessage = async () => {
    const { message, emoji, type, action_url } = generateSmartMessage();
    
    try {
      // Check if this is a mock user
      if (userId.startsWith('mock-user-')) {
        const newMessage: AlizaMessage = {
          id: 'mock-msg-' + Date.now(),
          user_id: userId,
          type,
          message,
          emoji,
          action_url,
          created_at: new Date().toISOString()
        };
        setMessages([newMessage, ...messages]);
        return;
      }
      
      const { error } = await supabase
        .from('aliza_messages')
        .insert({
          user_id: userId,
          type,
          message,
          emoji,
          action_url
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
