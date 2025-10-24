'use client';

import { useState, useEffect } from 'react';
import { PersonalizedInsight, InsightSummary } from '@/types/insights';
import { InsightsAI } from '@/lib/insights-ai';
import InsightsCharts from './InsightsCharts';
import './AlizaInsights.css';

interface AlizaInsightsProps {
  userId: string;
}

export default function AlizaInsights({ userId }: AlizaInsightsProps) {
  const [insights, setInsights] = useState<PersonalizedInsight[]>([]);
  const [summary, setSummary] = useState<InsightSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<PersonalizedInsight | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  useEffect(() => {
    loadInsights();
  }, [userId, timeRange]);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      // Check if this is a mock user
      if (userId.startsWith('mock-user-')) {
        console.log('Insights: Using mock data for mock user');
        // Generate mock insights for demo
        const mockInsights: PersonalizedInsight[] = [
          {
            id: 'mock-1',
            type: 'pattern',
            title: 'דפוסי שינה משופרים',
            content: 'זיהיתי דפוס של שינה טובה יותר בימים שבהם את עושה פעילות גופנית.',
            priority: 'medium',
            category: 'sleep',
            actionable: true,
            relatedData: {},
            alizaMessage: 'זה נהדר! אני רואה שכשאת עושה פעילות גופנית, את ישנה טוב יותר. זה בדיוק מה שהמחקרים מראים - פעילות גופנית עוזרת לווסת את ההורמונים ולשפר את איכות השינה.'
          },
          {
            id: 'mock-2',
            type: 'encouragement',
            title: 'את עושה עבודה נהדרת!',
            content: 'אני רואה שיש שיפור במצב הרוח שלך בשבוע האחרון.',
            priority: 'low',
            category: 'mood',
            actionable: false,
            relatedData: {},
            alizaMessage: 'זה נהדר! אני רואה שיש שיפור במצב הרוח שלך. זה מראה שהגוף שלך מתחיל להסתגל לשינויים. המשכי עם מה שעובד בשבילך!'
          }
        ];
        
        setInsights(mockInsights);
        
        const mockSummary: InsightSummary = {
          totalInsights: mockInsights.length,
          newInsights: 1,
          highPriority: 0,
          categories: {
            sleep: 1,
            mood: 1
          },
          lastAnalysis: new Date().toISOString(),
          nextAnalysis: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        setSummary(mockSummary);
        setIsLoading(false);
        return;
      }
      
      const ai = new InsightsAI(userId);
      const generatedInsights = await ai.generateInsights();
      
      setInsights(generatedInsights);
      
      // יצירת סיכום
      const newSummary: InsightSummary = {
        totalInsights: generatedInsights.length,
        newInsights: generatedInsights.filter(i => i.priority === 'high').length,
        highPriority: generatedInsights.filter(i => i.priority === 'high').length,
        categories: generatedInsights.reduce((acc, insight) => {
          acc[insight.category] = (acc[insight.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        lastAnalysis: new Date().toISOString(),
        nextAnalysis: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      setSummary(newSummary);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#f9ca24';
      case 'low': return '#4ecdc4';
      default: return '#6c757d';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      sleep: '😴',
      mood: '😊',
      symptoms: '🌡️',
      hormones: '⚡',
      lifestyle: '🏃‍♀️',
      cycle: '🌸',
      general: '💡'
    };
    return icons[category] || '💡';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      pattern: '📊',
      recommendation: '💡',
      warning: '⚠️',
      encouragement: '🎉'
    };
    return icons[type] || '💡';
  };

  if (isLoading) {
    return (
      <div className="aliza-insights-loading">
        <div className="loading-container">
          <div className="aliza-avatar">👩‍⚕️</div>
          <div className="loading-spinner"></div>
          <h3>עליזה מנתחת את הנתונים שלך...</h3>
          <p>זה יכול לקחת כמה רגעים</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aliza-insights">
      {/* Header with Aliza */}
      <div className="aliza-header">
        <div className="aliza-avatar-large">🌸</div>
        <div className="aliza-intro">
          <h2>שלום! אני עליזה, החברה שלך למסע</h2>
          <p>ניתחתי את הנתונים שהכנסת ויש לי כמה תובנות מעניינות לשתף איתך על המסע שלך</p>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="insights-summary">
          <div className="summary-card">
            <div className="summary-icon">📊</div>
            <div className="summary-content">
              <h4>{summary.totalInsights}</h4>
              <p>תובנות סה"כ</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">⚠️</div>
            <div className="summary-content">
              <h4>{summary.highPriority}</h4>
              <p>עדיפות גבוהה</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon">🆕</div>
            <div className="summary-content">
              <h4>{summary.newInsights}</h4>
              <p>תובנות חדשות</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <InsightsCharts 
        data={{
          symptoms: [],
          mood: [],
          sleep: [],
          cycle: []
        }}
        timeRange={timeRange}
      />

      {/* Insights Grid */}
      <div className="insights-section">
        <div className="section-header">
          <h3>💡 התובנות שלי עבורך</h3>
          <p>ניתוח אישי של הנתונים שלך</p>
        </div>

        <div className="insights-grid">
          {insights.map((insight) => (
            <div 
              key={insight.id} 
              className={`insight-card ${insight.priority}`}
              onClick={() => setSelectedInsight(insight)}
            >
              <div className="insight-header">
                <div className="insight-icons">
                  <span className="category-icon">{getCategoryIcon(insight.category)}</span>
                  <span className="type-icon">{getTypeIcon(insight.type)}</span>
                </div>
                <div className="insight-priority" style={{ backgroundColor: getPriorityColor(insight.priority) }}>
                  {insight.priority === 'high' ? 'גבוהה' : insight.priority === 'medium' ? 'בינונית' : 'נמוכה'}
                </div>
              </div>
              
              <div className="insight-content">
                <h4 className="insight-title">{insight.title}</h4>
                <p className="insight-description">{insight.content}</p>
                
                {insight.actionable && (
                  <div className="actionable-badge">
                    <span>💡 ניתן לפעולה</span>
                  </div>
                )}
              </div>

              <div className="insight-footer">
                <span className="insight-category">{insight.category}</span>
                <span className="insight-date">
                  {new Date().toLocaleDateString('he-IL')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aliza's Message */}
      <div className="aliza-message">
        <div className="message-header">
          <div className="aliza-avatar-small">🌸</div>
          <h4>הודעה אישית מעליזה</h4>
        </div>
        <div className="message-content">
          <p>
            אני רואה שאת עוברת תקופה משמעותית בחיים שלך. הנתונים שהכנסת מראים דפוסים מעניינים, 
            ואני כאן כדי לעזור לך להבין מה קורה ולמצוא דרכים להתמודד עם האתגרים.
          </p>
          <p>
            זכרי - כל מה שאת חווה הוא טבעי ונורמלי. אני כאן בשבילך, 
            ואנחנו נעבור את זה יחד צעד אחר צעד.
          </p>
        </div>
      </div>

      {/* Insight Detail Modal */}
      {selectedInsight && (
        <div className="insight-modal-overlay" onClick={() => setSelectedInsight(null)}>
          <div className="insight-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedInsight.title}</h3>
              <button 
                className="close-button"
                onClick={() => setSelectedInsight(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="insight-modal-content">
              <div className="insight-details">
                <div className="detail-row">
                  <span className="detail-label">קטגוריה:</span>
                  <span className="detail-value">{selectedInsight.category}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">עדיפות:</span>
                  <span className="detail-value" style={{ color: getPriorityColor(selectedInsight.priority) }}>
                    {selectedInsight.priority === 'high' ? 'גבוהה' : selectedInsight.priority === 'medium' ? 'בינונית' : 'נמוכה'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">סוג:</span>
                  <span className="detail-value">{selectedInsight.type}</span>
                </div>
              </div>

              <div className="insight-description-full">
                <h4>תיאור מפורט:</h4>
                <p>{selectedInsight.content}</p>
              </div>

              <div className="aliza-message-detail">
                <div className="message-header">
                  <div className="aliza-avatar-small">🌸</div>
                  <h4>עליזה אומרת:</h4>
                </div>
                <p>{selectedInsight.alizaMessage}</p>
              </div>

              {selectedInsight.actionable && (
                <div className="actionable-section">
                  <h4>💡 מה את יכולה לעשות:</h4>
                  <ul>
                    <li>תתחילי לעקוב אחר התסמינים בצורה יותר מפורטת</li>
                    <li>תשקלי להתייעץ עם רופא נשים</li>
                    <li>תנסי טכניקות הרפיה ונשימה</li>
                    <li>תשמרי על שגרת שינה קבועה</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
