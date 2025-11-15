'use client';

import { DailyEntry } from '@/types/journal';
import { useState } from 'react';
import './SmartInsights.css';

interface SmartInsightsProps {
  entries: DailyEntry[];
}

export default function SmartInsights({ entries }: SmartInsightsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('month');
  const [showSupportModal, setShowSupportModal] = useState(false);
  
  // Filter entries by period
  const getFilteredEntries = () => {
    const now = new Date();
    let startDate: Date;
    
    if (selectedPeriod === 'week') {
      // Israeli week: Sunday to Saturday
      const currentDayOfWeek = now.getDay();
      startDate = new Date(now);
      startDate.setDate(now.getDate() - currentDayOfWeek);
      startDate.setHours(0, 0, 0, 0);
    } else {
      // Last 30 days
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    return entries.filter(entry => new Date(entry.date) >= startDate);
  };
  
  const filteredEntries = getFilteredEntries();
  
  // Analyze symptoms
  const analyzeSymptoms = () => {
    const symptoms = {
      hot_flashes: { count: 0, label: 'גלי חום', emoji: '🔥', severity: 'high' },
      sleep_issues: { count: 0, label: 'בעיות שינה', emoji: '😴', severity: 'high' },
      pain: { count: 0, label: 'כאבים', emoji: '🤕', severity: 'medium' },
      bloating: { count: 0, label: 'נפיחות', emoji: '💨', severity: 'low' },
      concentration_difficulty: { count: 0, label: 'קושי בריכוז', emoji: '🧠', severity: 'medium' },
      dryness: { count: 0, label: 'יובש', emoji: '🏜️', severity: 'medium' }
    };
    
    filteredEntries.forEach(entry => {
      if (entry.hot_flashes) symptoms.hot_flashes.count++;
      if (entry.sleep_issues) symptoms.sleep_issues.count++;
      if (entry.pain) symptoms.pain.count++;
      if (entry.bloating) symptoms.bloating.count++;
      if (entry.concentration_difficulty) symptoms.concentration_difficulty.count++;
      if (entry.dryness) symptoms.dryness.count++;
    });
    
    return Object.entries(symptoms)
      .filter(([_, data]) => data.count > 0)
      .sort((a, b) => b[1].count - a[1].count);
  };
  
  // Analyze mood patterns
  const analyzeMood = () => {
    const moodCount = {
      calm: 0,
      happy: 0,
      sad: 0,
      irritated: 0,
      frustrated: 0
    };
    
    filteredEntries.forEach(entry => {
      if (entry.mood && moodCount[entry.mood as keyof typeof moodCount] !== undefined) {
        moodCount[entry.mood as keyof typeof moodCount]++;
      }
    });
    
    const total = Object.values(moodCount).reduce((a, b) => a + b, 0);
    const positive = moodCount.calm + moodCount.happy;
    const negative = moodCount.sad + moodCount.irritated + moodCount.frustrated;
    
    return { moodCount, total, positive, negative, positiveRate: total > 0 ? Math.round((positive / total) * 100) : 0 };
  };
  
  // Analyze sleep quality
  const analyzeSleep = () => {
    const sleepEntries = filteredEntries.filter(e => e.sleep_quality);
    const goodSleep = sleepEntries.filter(e => e.sleep_quality === 'good').length;
    const total = sleepEntries.length;
    
    return {
      total,
      goodNights: goodSleep,
      poorNights: sleepEntries.filter(e => e.sleep_quality === 'poor').length,
      goodRate: total > 0 ? Math.round((goodSleep / total) * 100) : 0
    };
  };
  
  // Generate AI insights
  const generateInsights = () => {
    const symptoms = analyzeSymptoms();
    const mood = analyzeMood();
    const sleep = analyzeSleep();
    const insights: Array<{type: string, title: string, message: string, action: string, link: string}> = [];
    
    // Top symptom insight
    if (symptoms.length > 0) {
      const [topSymptom, topData] = symptoms[0];
      const percentage = Math.round((topData.count / filteredEntries.length) * 100);
      insights.push({
        type: 'symptom',
        title: `${topData.emoji} ${topData.label} - התסמין המרכזי שלך`,
        message: `דיווחת על ${topData.label} ב-${topData.count} מתוך ${filteredEntries.length} דיווחים (${percentage}%). ${getSymptomAdvice(topSymptom)}`,
        action: 'למדי איך להקל',
        link: topSymptom === 'hot_flashes' ? '/heat-waves' : topSymptom === 'sleep_issues' ? '/menopausal-sleep' : '/the-body-whispers'
      });
    }
    
    // Mood insight
    if (mood.positiveRate >= 70) {
      insights.push({
        type: 'mood-positive',
        title: '😊 מצב הרוח שלך משתפר!',
        message: `${mood.positiveRate}% מהזמן את רגועה או שמחה. זה נהדר! המשיכי עם מה שעובד בשבילך.`,
        action: 'קראי עוד',
        link: '/belonging-sisterhood-emotional-connection'
      });
    } else if (mood.negative >= mood.positive) {
      insights.push({
        type: 'mood-negative',
        title: '💙 מצב הרוח זקוק לתמיכה',
        message: `שמתי לב שיש יותר ימים עם מצב רוח נמוך. זה תקין בגיל המעבר, אבל אפשר לעשות משהו. שיחה, פעילות, או טיפול יכולים לעזור.`,
        action: 'משאבים לתמיכה',
        link: '/belonging-sisterhood-emotional-connection'
      });
    }
    
    // Sleep insight
    if (sleep.goodRate >= 60) {
      insights.push({
        type: 'sleep-good',
        title: '😴 השינה שלך סבירה',
        message: `${sleep.goodRate}% מהלילות הן טובות. זה לא רע! כדי לשפר עוד, שמרי על שעות קבועות ותנאים קרירים בחדר.`,
        action: 'טיפים לשינה',
        link: '/menopausal-sleep'
      });
    } else if (sleep.poorNights >= 3) {
      insights.push({
        type: 'sleep-poor',
        title: '🌙 השינה צריכה תשומת לב',
        message: `${sleep.poorNights} לילות קשים ב${selectedPeriod === 'week' ? 'שבוע' : 'חודש'}. רוטינת שינה, הימנעות ממסכים, וטמפרטורת חדר נמוכה יכולים לעזור מאוד.`,
        action: 'שיפור השינה',
        link: '/menopausal-sleep'
      });
    }
    
    // Connection patterns
    if (symptoms.length >= 2) {
      const hasHotFlashes = symptoms.find(([key]) => key === 'hot_flashes');
      const hasSleepIssues = symptoms.find(([key]) => key === 'sleep_issues');
      
      if (hasHotFlashes && hasSleepIssues) {
        insights.push({
          type: 'pattern',
          title: '🔗 זיהיתי קשר בין תסמינים',
          message: 'גלי החום משפיעים על השינה שלך. נסי להוריד טמפרטורה בחדר, להימנע מקפאין אחה&quot;צ, ולהחזיק מאוורר ליד המיטה.',
          action: 'קראי עוד',
          link: '/heat-waves'
        });
      }
    }
    
    return insights;
  };
  
  const getSymptomAdvice = (symptom: string) => {
    const advice = {
      hot_flashes: 'נסי שכבות בגדים, מאוורר נייד, והימנעות ממזון חריף.',
      sleep_issues: 'רוטינת שינה קבועה וחדר קריר יכולים לעזור.',
      pain: 'פעילות גופנית קלה ומתיחות עשויות להקל.',
      bloating: 'הקפידי על שתיית מים והפחתת מלח.',
      concentration_difficulty: 'פעילות מוחית, תזונה מאוזנת, ושינה טובה חשובים.',
      dryness: 'לחות טבעית ושתיית מים יכולים לעזור.'
    };
    return advice[symptom as keyof typeof advice] || '';
  };
  
  const symptoms = analyzeSymptoms();
  const mood = analyzeMood();
  const sleep = analyzeSleep();
  const aiInsights = generateInsights();
  
  const periodLabel = selectedPeriod === 'week' ? 'השבוע' : 'החודש';
  
  return (
    <div className="smart-insights">
      {/* Header */}
      <div className="insights-header">
        <h2>🎯 ניתוח ויזואלי</h2>
        <p>גרפים אינטראקטיביים של הנתונים שלך</p>
        <div className="period-selector">
          <button
            className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('week')}
          >
            שבוע
          </button>
          <button
            className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('month')}
          >
            חודש
          </button>
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="no-data">
          <p>אין מספיק נתונים ל{periodLabel}</p>
          <p className="hint">התחילי לתעד כדי לראות ניתוח חכם</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="key-metrics">
            <div className="metric-card">
              <div className="metric-icon">📊</div>
              <div className="metric-content">
                <div className="metric-number">{filteredEntries.length}</div>
                <div className="metric-label">דיווחים {periodLabel}</div>
              </div>
            </div>
            
            <div 
              className={`metric-card ${mood.negative >= mood.positive ? 'clickable' : ''}`}
              onClick={() => mood.negative >= mood.positive && setShowSupportModal(true)}
              style={{ cursor: mood.negative >= mood.positive ? 'pointer' : 'default' }}
              title={mood.negative >= mood.positive ? 'לחצי לפרטים' : ''}
            >
              <div className="metric-icon">😊</div>
              <div className="metric-content">
                <div className="metric-number">{mood.positiveRate}%</div>
                <div className="metric-label">
                  {mood.positiveRate >= 60 ? 'מצב רוח חיובי' : 
                   mood.positiveRate >= 50 ? 'מצב רוח מעורב' : 
                   mood.negative >= mood.positive ? 'זקוק לתמיכה' : 'מצב רוח מעורב'}
                </div>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="metric-icon">😴</div>
              <div className="metric-content">
                <div className="metric-number">{sleep.goodRate}%</div>
                <div className="metric-label">לילות טובים</div>
              </div>
            </div>
          </div>

          {/* Top Symptoms */}
          <div className="symptoms-analysis">
            <h3>🔥 התסמינים המשמעותיים {periodLabel}</h3>
            {symptoms.length === 0 ? (
              <p className="no-symptoms">לא דווחו תסמינים {periodLabel} - מצוין! 🎉</p>
            ) : (
              <div className="symptoms-list">
                {symptoms.slice(0, 5).map(([key, data], index) => {
                  const percentage = Math.round((data.count / filteredEntries.length) * 100);
                  return (
                    <div key={key} className={`symptom-item severity-${data.severity}`}>
                      <div className="symptom-rank">#{index + 1}</div>
                      <div className="symptom-info">
                        <div className="symptom-header">
                          <span className="symptom-emoji">{data.emoji}</span>
                          <span className="symptom-name">{data.label}</span>
                        </div>
                        <div className="symptom-stats">
                          <span className="symptom-count">{data.count} פעמים</span>
                          <div className="symptom-bar">
                            <div className="symptom-fill" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <span className="symptom-percentage">{percentage}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Insights */}
          <div className="ai-insights-section">
            <h3>🤖 ניתוח ותובנות AI</h3>
            <div className="insights-grid">
              {aiInsights.map((insight, index) => (
                <div key={index} className="insight-card">
                  <h4>{insight.title}</h4>
                  <p className="insight-message">{insight.message}</p>
                  <a href={insight.link} className="insight-action">{insight.action} →</a>
                </div>
              ))}
            </div>
          </div>

          {/* Mood Breakdown */}
          <div className="mood-breakdown">
            <h3>😊 פילוח מצבי רוח</h3>
            <div className="mood-stats">
              <div className="mood-summary">
                <div 
                  className={`mood-pie ${mood.negative >= mood.positive ? 'clickable' : ''}`}
                  onClick={() => mood.negative >= mood.positive && setShowSupportModal(true)}
                  style={{ cursor: mood.negative >= mood.positive ? 'pointer' : 'default' }}
                  title={mood.negative >= mood.positive ? 'לחצי לפרטים' : ''}
                >
                  <div 
                    className={`pie-value ${
                      mood.positiveRate >= 60 ? 'pie-positive' : 
                      mood.positiveRate >= 50 ? 'pie-mixed' : 
                      mood.negative >= mood.positive ? 'pie-negative' : 'pie-mixed'
                    }`} 
                    style={{ '--percentage': mood.positiveRate } as React.CSSProperties}
                  >
                    {mood.positiveRate}%
                  </div>
                  <div className="pie-label">
                    {mood.positiveRate >= 60 ? 'חיובי' : 
                     mood.positiveRate >= 50 ? 'מעורב' : 
                     mood.negative >= mood.positive ? 'זקוק לתמיכה' : 'מעורב'}
                  </div>
                </div>
                <div className="mood-bars">
                  {Object.entries(mood.moodCount).map(([moodType, count]) => {
                    const moodLabels = {
                      calm: { emoji: '😌', label: 'רגועה' },
                      happy: { emoji: '😊', label: 'שמחה' },
                      sad: { emoji: '😢', label: 'עצובה' },
                      irritated: { emoji: '😤', label: 'עצבנית' },
                      frustrated: { emoji: '😩', label: 'מתוסכלת' }
                    };
                    
                    const moodInfo = moodLabels[moodType as keyof typeof moodLabels];
                    if (!moodInfo || count === 0) return null;
                    
                    const percentage = Math.round((count / mood.total) * 100);
                    
                    return (
                      <div key={moodType} className="mood-bar-item">
                        <div className="mood-bar-header">
                          <span>{moodInfo.emoji} {moodInfo.label}</span>
                          <span className="mood-bar-count">{count} ({percentage}%)</span>
                        </div>
                        <div className="mood-bar-track">
                          <div 
                            className={`mood-bar-fill ${moodType}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sleep Analysis */}
          <div className="sleep-analysis">
            <h3>🌙 ניתוח שינה</h3>
            <div className="sleep-stats">
              <div className="sleep-chart">
                <div className="sleep-circle" style={{ '--percentage': sleep.goodRate } as React.CSSProperties}>
                  <div className="circle-content">
                    <div className="circle-number">{sleep.goodRate}%</div>
                    <div className="circle-label">לילות טובים</div>
                  </div>
                </div>
              </div>
              <div className="sleep-details">
                <div className="sleep-stat">
                  <span className="stat-emoji">✅</span>
                  <span className="stat-text">{sleep.goodNights} לילות טובים</span>
                </div>
                <div className="sleep-stat">
                  <span className="stat-emoji">❌</span>
                  <span className="stat-text">{sleep.poorNights} לילות קשים</span>
                </div>
                <div className="sleep-stat">
                  <span className="stat-emoji">📊</span>
                  <span className="stat-text">{sleep.total} סה&quot;כ דיווחי בוקר</span>
                </div>
              </div>
            </div>
            {sleep.goodRate < 50 && (
              <div className="sleep-alert">
                <p>⚠️ פחות ממחצית הלילות טובים. שקלי להתייעץ עם רופאה או לנסות טכניקות לשיפור שינה.</p>
                <a href="/menopausal-sleep" className="alert-link">למדי עוד →</a>
              </div>
            )}
          </div>
        </>
      )}

      {/* Support Modal - "זקוק לתמיכה" Explanation */}
      {showSupportModal && (
        <div className="support-modal-overlay" onClick={() => setShowSupportModal(false)}>
          <div className="support-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="support-modal-header">
              <div className="support-modal-icon">💙</div>
              <h2>זקוק לתמיכה - מה זה אומר?</h2>
              <button 
                className="support-modal-close"
                onClick={() => setShowSupportModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="support-modal-content">
              <div className="support-explanation-section">
                <h3>📊 מה הנתונים מראים?</h3>
                <p>
                  אני רואה שבתקופה האחרונה יש לך יותר ימים עם מצב רוח נמוך (עצובה, עצבנית, מתוסכלת) 
                  מאשר ימים עם מצב רוח חיובי (רגועה, שמחה).
                </p>
                <p>
                  <strong>זה תקין לחלוטין בגיל המעבר.</strong> שינויים הורמונליים משפיעים על מצב הרוח, 
                  וזה חלק טבעי מהתהליך שעוברות נשים רבות.
                </p>
              </div>

              <div className="support-explanation-section">
                <h3>💡 למה זה קורה?</h3>
                <ul>
                  <li><strong>שינויים הורמונליים:</strong> ירידה ברמות האסטרוגן משפיעה על נוירוטרנסמיטרים במוח שקשורים למצב הרוח</li>
                  <li><strong>תסמינים פיזיים:</strong> גלי חום, בעיות שינה, ותסמינים אחרים יכולים להשפיע על מצב הרוח</li>
                  <li><strong>שינויים בחיים:</strong> גיל המעבר מגיע עם שינויים רבים בחיים, וזה טבעי שזה משפיע</li>
                  <li><strong>עייפות:</strong> שינה לא איכותית יכולה להשפיע מאוד על מצב הרוח</li>
                </ul>
              </div>

              <div className="support-explanation-section">
                <h3>🤗 מה אפשר לעשות?</h3>
                <div className="support-actions-grid">
                  <div className="support-action-card">
                    <div className="action-icon">💬</div>
                    <h4>שיחה ותמיכה</h4>
                    <p>דברי עם חברה טובה, משפחה, או קבוצת תמיכה. שיתוף עוזר מאוד.</p>
                  </div>
                  
                  <div className="support-action-card">
                    <div className="action-icon">🏃‍♀️</div>
                    <h4>פעילות גופנית</h4>
                    <p>פעילות קלה כמו הליכה, יוגה, או שחייה משחררת אנדורפינים ומשפרת מצב רוח.</p>
                  </div>
                  
                  <div className="support-action-card">
                    <div className="action-icon">🧘‍♀️</div>
                    <h4>טכניקות הרגעה</h4>
                    <p>נשימות עמוקות, מדיטציה, או פעילויות מרגיעות יכולות לעזור מאוד.</p>
                  </div>
                  
                  <div className="support-action-card">
                    <div className="action-icon">👩‍⚕️</div>
                    <h4>ייעוץ מקצועי</h4>
                    <p>אם מצב הרוח משפיע על החיים שלך, כדאי לשקול להתייעץ עם פסיכולוג/ית או רופא/ה.</p>
                  </div>
                </div>
              </div>

              <div className="support-explanation-section highlight">
                <h3>💚 חשוב לזכור</h3>
                <p>
                  <strong>את לא לבד.</strong> נשים רבות חוות שינויים במצב הרוח בגיל המעבר, 
                  וזה חלק טבעי מהתהליך. זה לא אומר שמשהו לא בסדר איתך - זה אומר שהגוף שלך 
                  עובר שינויים משמעותיים, וזה משפיע גם על מצב הרוח.
                </p>
                <p>
                  המעקב שלך עוזר לזהות דפוסים ולהבין מה עובד בשבילך. המשכי לתעד, 
                  וזכרי שיש דרכים לעזור ולשפר את ההרגשה.
                </p>
              </div>

              <div className="support-modal-footer">
                <button 
                  className="support-action-button"
                  onClick={() => {
                    setShowSupportModal(false);
                    window.location.href = '/belonging-sisterhood-emotional-connection';
                  }}
                >
                  למשאבים לתמיכה →
                </button>
                <button 
                  className="support-close-button"
                  onClick={() => setShowSupportModal(false)}
                >
                  סגור
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

