'use client';

import { useState, useEffect, useRef } from 'react';
import { PersonalizedInsight, InsightSummary } from '@/types/insights';
import { InsightsAI } from '@/lib/insights-ai';
import InsightsCharts from './InsightsCharts';
import AlizaMessages from '../journal/AlizaMessages';
import { supabase } from '@/lib/supabase';
import './AlizaInsights.css';

interface AlizaInsightsProps {
  userId: string;
}

export default function AlizaInsights({ userId }: AlizaInsightsProps) {
  const [insights, setInsights] = useState<PersonalizedInsight[]>([]);
  const [heroInsight, setHeroInsight] = useState<PersonalizedInsight | null>(null);
  const [summary, setSummary] = useState<InsightSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<PersonalizedInsight | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [dailyEntries, setDailyEntries] = useState<any[]>([]);
  const [cycleEntries, setCycleEntries] = useState<any[]>([]);

  useEffect(() => {
    loadEntries();
  }, [userId]);

  useEffect(() => {
    loadInsights();
  }, [userId, timeRange]);

  const loadEntries = async () => {
    try {
      const [dailyResult, cycleResult] = await Promise.all([
        supabase.from('daily_entries').select('*').eq('user_id', userId).order('date', { ascending: false }),
        supabase.from('cycle_entries').select('*').eq('user_id', userId).order('date', { ascending: false })
      ]);
      setDailyEntries(dailyResult.data || []);
      setCycleEntries(cycleResult.data || []);
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

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
      
      // זיהוי תובנת Hero - התובנה הכי חשובה (עדיפות גבוהה עם השוואה לנורמה, או עדיפות גבוהה, או עם השוואה)
      const hero = generatedInsights.length > 0 
        ? (generatedInsights.find(i => i.priority === 'high' && i.comparisonToNorm) 
          || generatedInsights.find(i => i.priority === 'high')
          || generatedInsights.find(i => i.comparisonToNorm)
          || generatedInsights[0])
        : null;
      
      setHeroInsight(hero || null);
      // אם יש Hero, נציג רק את שאר התובנות. אם אין - נציג את כולן
      setInsights(hero ? generatedInsights.filter(i => i.id !== hero.id) : generatedInsights);
      
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
          <div className="aliza-avatar">
            <img src="/aliza_profile.jpg" alt="עליזה" />
          </div>
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
        <div className="aliza-avatar-large">
          <img src="/aliza_profile.jpg" alt="עליזה - החברה והדולה שלך למסע" />
        </div>
        <div className="aliza-intro">
          <h2>שלום! אני עליזה, החברה והדולה שלך למסע</h2>
          <p>אני מנופאוזית מנוסה שעברה בעצמי את כל מה שאת עוברת. אחרי שנים של מחקר וחוויה, ניתחתי את הנתונים שהכנסת ויש לי כמה תובנות מעניינות לשתף איתך על המסע שלך</p>
        </div>
      </div>

      {/* Hero Insight - התובנה המרכזית החשובה ביותר */}
      {heroInsight && (
        <div className="hero-insight-section">
          <div className="hero-insight-card" onClick={() => setSelectedInsight(heroInsight)}>
            <div className="hero-insight-header">
              <div className="hero-insight-badge">
                <span className="hero-badge-icon">⭐</span>
                <span className="hero-badge-text">התובנה החשובה ביותר עבורך</span>
              </div>
              <div className="hero-insight-priority" style={{ backgroundColor: getPriorityColor(heroInsight.priority) }}>
                {heroInsight.priority === 'high' ? 'גבוהה' : heroInsight.priority === 'medium' ? 'בינונית' : 'נמוכה'}
              </div>
            </div>
            
            <div className="hero-insight-content">
              <div className="hero-insight-icon">
                <span>{getCategoryIcon(heroInsight.category)}</span>
              </div>
              <div className="hero-insight-main">
                <h3 className="hero-insight-title">{heroInsight.title}</h3>
                <p className="hero-insight-description">{heroInsight.content}</p>
                
                {heroInsight.comparisonToNorm && (
                  <div className="hero-comparison">
                    <div className="hero-comparison-bar">
                      <div className="comparison-item">
                        <span className="comparison-label">את:</span>
                        <div className="comparison-value-bar">
                          <div 
                            className="comparison-fill user-fill"
                            style={{ width: `${Math.min(heroInsight.comparisonToNorm.userValue, 100)}%` }}
                          >
                            <span className="comparison-number">{Math.round(heroInsight.comparisonToNorm.userValue)}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="comparison-item">
                        <span className="comparison-label">ממוצע:</span>
                        <div className="comparison-value-bar">
                          <div 
                            className="comparison-fill average-fill"
                            style={{ width: `${Math.min(heroInsight.comparisonToNorm.averageValue, 100)}%` }}
                          >
                            <span className="comparison-number">{Math.round(heroInsight.comparisonToNorm.averageValue)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="hero-comparison-explanation">{heroInsight.comparisonToNorm.explanation}</p>
                  </div>
                )}
                
                <div className="hero-aliza-message">
                  <div className="hero-aliza-header">
                    <div className="hero-aliza-avatar">
                      <img src="/aliza_profile.jpg" alt="עליזה" />
                    </div>
                    <span className="hero-aliza-name">עליזה אומרת:</span>
                  </div>
                  <p className="hero-aliza-text">{heroInsight.alizaMessage}</p>
                </div>
              </div>
            </div>
            
            {heroInsight.actionable && (
              <div className="hero-actionable">
                <span className="hero-actionable-icon">💡</span>
                <span>יש לך פעולות מעשיות שתוכלי לבצע - לחצי לפרטים</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="insights-summary">
          <div className="summary-card">
            <div className="summary-icon">📊</div>
            <div className="summary-content">
              <h4>{summary.totalInsights}</h4>
              <p>תובנות סה&quot;כ</p>
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
        dailyEntries={dailyEntries}
        cycleEntries={cycleEntries}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      {/* Insights Grid */}
      <div className="insights-section">
        <div className="section-header">
          <h3>💡 התובנות שלי עבורך</h3>
          <p>ניתוח אישי של הנתונים שלך</p>
        </div>

        <div className="insights-grid">
          {insights.length === 0 ? (
            <div className="no-insights-state">
              <div className="no-insights-icon">💡</div>
              <h4>עדיין אין תובנות</h4>
              <p>
                {dailyEntries.length === 0 && cycleEntries.length === 0 
                  ? 'כשתתחילי להזין רשומות יומן ומעקב מחזור, עליזה תוכל לנתח את הנתונים שלך ולספק תובנות אישיות.'
                  : 'עליזה מעבדת את הנתונים שלך. תובנות חדשות יופיעו כאן בקרוב.'}
              </p>
            </div>
          ) : (
            insights.map((insight) => (
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
            ))
          )}
        </div>
      </div>

      {/* Aliza's Messages Section */}
      <div className="aliza-messages-section">
        <AlizaMessages 
          userId={userId}
          dailyEntries={dailyEntries}
          cycleEntries={cycleEntries}
        />
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

              {/* השוואה לנורמה */}
              {selectedInsight.comparisonToNorm && (
                <div className="comparison-section">
                  <h4>📊 השוואה לנורמה</h4>
                  <div className="comparison-content">
                    <div className="comparison-bar">
                      <div className="comparison-label">
                        <span>את:</span>
                        <span className="comparison-value">{Math.round(selectedInsight.comparisonToNorm.userValue)}%</span>
                      </div>
                      <div className="comparison-bar-container">
                        <div 
                          className="comparison-bar-fill user-bar"
                          style={{ width: `${Math.min(selectedInsight.comparisonToNorm.userValue, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="comparison-bar">
                      <div className="comparison-label">
                        <span>ממוצע:</span>
                        <span className="comparison-value">{Math.round(selectedInsight.comparisonToNorm.averageValue)}%</span>
                      </div>
                      <div className="comparison-bar-container">
                        <div 
                          className="comparison-bar-fill average-bar"
                          style={{ width: `${Math.min(selectedInsight.comparisonToNorm.averageValue, 100)}%` }}
                        />
                      </div>
                    </div>
                    <p className="comparison-explanation">{selectedInsight.comparisonToNorm.explanation}</p>
                  </div>
                </div>
              )}

              <div className="insight-description-full">
                <h4>תיאור מפורט:</h4>
                <p>{selectedInsight.content}</p>
              </div>

              {/* גרף ויזואלי */}
              {selectedInsight.visualData && (
                <div className="visual-data-section">
                  <h4>📈 המחשה גרפית</h4>
                  <div className="simple-chart-container">
                    <SimpleChart 
                      data={selectedInsight.visualData.data}
                      type={selectedInsight.visualData.chartType}
                      color={getPriorityColor(selectedInsight.priority)}
                    />
                  </div>
                </div>
              )}

              <div className="aliza-message-detail">
                <div className="message-header">
                  <div className="aliza-avatar-small">
                    <img src="/aliza_profile.jpg" alt="עליזה" />
                  </div>
                  <h4>עליזה אומרת:</h4>
                </div>
                <p>{selectedInsight.alizaMessage}</p>
              </div>

              {selectedInsight.actionable && selectedInsight.actionableSteps && (
                <div className="actionable-section">
                  {selectedInsight.actionableSteps.reliefMethods && selectedInsight.actionableSteps.reliefMethods.length > 0 && (
                    <div className="actionable-subsection">
                      <h4>💡 דרכים להקל על התסמינים:</h4>
                      <ul>
                        {selectedInsight.actionableSteps.reliefMethods.map((method, index) => (
                          <li key={index}>{method}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedInsight.actionableSteps.whoToContact && selectedInsight.actionableSteps.whoToContact.length > 0 && (
                    <div className="actionable-subsection">
                      <h4>👩‍⚕️ למי כדאי לפנות:</h4>
                      <ul>
                        {selectedInsight.actionableSteps.whoToContact.map((contact, index) => (
                          <li key={index}>{contact}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedInsight.actionableSteps.questionsToAsk && selectedInsight.actionableSteps.questionsToAsk.length > 0 && (
                    <div className="actionable-subsection">
                      <h4>❓ שאלות חשובות לשאול:</h4>
                      <ul>
                        {selectedInsight.actionableSteps.questionsToAsk.map((question, index) => (
                          <li key={index}>{question}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedInsight.actionableSteps.lifestyleChanges && selectedInsight.actionableSteps.lifestyleChanges.length > 0 && (
                    <div className="actionable-subsection">
                      <h4>🔄 שינויים באורח החיים:</h4>
                      <ul>
                        {selectedInsight.actionableSteps.lifestyleChanges.map((change, index) => (
                          <li key={index}>{change}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple chart component for insight modal
function SimpleChart({ data, type, color }: { data: any, type: string, color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data?.labels || !data?.datasets) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const padding = 60;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.strokeStyle = '#dee2e6';
    ctx.lineWidth = 1;
    
    // Y axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.stroke();

    // X axis
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw data
    const dataset = data.datasets[0];
    if (!dataset || !dataset.data || dataset.data.length === 0) return;

    if (type === 'line') {
      const maxValue = Math.max(...dataset.data);
      const minValue = Math.min(...dataset.data);
      const valueRange = maxValue - minValue || 1;

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();

      dataset.data.forEach((value: number, index: number) => {
        const x = padding + (index / (dataset.data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw points
      ctx.fillStyle = color;
      dataset.data.forEach((value: number, index: number) => {
        const x = padding + (index / (dataset.data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    }

    // Labels
    ctx.fillStyle = '#6c757d';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    data.labels.forEach((label: string, index: number) => {
      const x = padding + (index / (data.labels.length - 1)) * chartWidth;
      const y = canvas.height - padding + 20;
      ctx.fillText(label, x, y);
    });
  }, [data, type, color]);

  return (
    <canvas 
      ref={canvasRef} 
      width={600} 
      height={300}
      className="simple-chart-canvas"
    />
  );
}
