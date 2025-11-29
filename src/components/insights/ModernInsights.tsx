'use client';

import { useState, useEffect } from 'react';
import { PersonalizedInsight } from '@/types/insights';
import { supabase } from '@/lib/supabase';
import { useTokens } from '@/hooks/useTokens';
import './ModernInsights.css';

interface ModernInsightsProps {
  userId: string;
}

export default function ModernInsights({ userId }: ModernInsightsProps) {
  const [insights, setInsights] = useState<PersonalizedInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyEntries, setDailyEntries] = useState<any[]>([]);
  const [cycleEntries, setCycleEntries] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>('יקרה');
  const [hasData, setHasData] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const { loadTokens, currentTokens } = useTokens();

  useEffect(() => {
    if (userId) {
      loadUserData();
      loadUserName();
    }
  }, [userId]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      // Load user entries
      const [dailyResult, cycleResult] = await Promise.all([
        supabase.from('daily_entries').select('*').eq('user_id', userId).order('date', { ascending: false }),
        supabase.from('cycle_entries').select('*').eq('user_id', userId).order('date', { ascending: false })
      ]);
      
      const daily = dailyResult.data || [];
      const cycle = cycleResult.data || [];
      
      setDailyEntries(daily);
      setCycleEntries(cycle);
      setHasData(daily.length > 0 || cycle.length > 0);
      
      // Load insights
      await loadInsights();
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserName = async () => {
    try {
      const { data: profile } = await supabase
        .from('user_profile')
        .select('first_name, name, full_name, email')
        .eq('id', userId)
        .single();
      
      if (profile) {
        const name = profile.first_name || profile.name?.split(' ')[0] || profile.full_name?.split(' ')[0] || profile.email?.split('@')[0] || 'יקרה';
        setUserName(name);
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  };

  const loadInsights = async () => {
    try {
      const { data: insightsData, error } = await supabase
        .from('personalized_insights')
        .select('*')
        .eq('user_id', userId)
        .order('analysis_date', { ascending: false })
        .order('priority', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error loading insights:', error);
        return;
      }

      if (insightsData && insightsData.length > 0) {
        const loadedInsights = insightsData.map((insight: any) => ({
          id: insight.insight_id,
          type: insight.type,
          title: insight.title,
          content: insight.content,
          priority: insight.priority,
          category: insight.category,
          actionable: insight.actionable || false,
          comparisonToNorm: insight.comparison_to_norm,
          actionableSteps: insight.actionable_steps,
          visualData: insight.visual_data,
          alizaMessage: insight.aliza_message || '',
          relatedData: {},
          analysisDate: insight.analysis_date
        }));
        setInsights(loadedInsights);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const generateInsights = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-insights-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const result = await response.json();
      
      // Update tokens
      if (result.deduct_tokens > 0) {
        await loadTokens();
        const remaining = (currentTokens || 0) - result.deduct_tokens;
        alert(`✅ נוצרו ${result.insightsCount || 0} תובנות חדשות!\n💎 הופחתו ${result.deduct_tokens} טוקנים\n💰 נותרו ${remaining} טוקנים`);
      }

      // Reload insights
      await loadInsights();
    } catch (error) {
      console.error('Error generating insights:', error);
      alert('שגיאה ביצירת תובנות. נסי שוב מאוחר יותר.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      sleep: '🌙',
      mood: '😊',
      symptoms: '🌡️',
      hormones: '⚡',
      lifestyle: '🏃‍♀️',
      cycle: '🌸',
      general: '💡'
    };
    return icons[category] || '💡';
  };

  const getCategoryLink = (category: string): string | null => {
    const links: Record<string, string> = {
      sleep: '/menopausal-sleep',
      symptoms: '/heat-waves',
      mood: '/belonging-sisterhood-emotional-connection',
      cycle: '/preparing-for-menopause',
      hormones: '/hormones',
      lifestyle: '/walking-benefits-menopause',
      general: '/articles'
    };
    return links[category] || null;
  };

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(i => i.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="modern-insights-loading">
        <div className="pulse-loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-insights">
      {/* Hero Section */}
      <section className="insights-hero">
        <div className="hero-background">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>תובנות אישיות</h1>
            <h2>שלום {userName}! 👋</h2>
            <p>הנה הניתוח המעמיק שלי על המצב שלך, מבוסס על כל הנתונים שהזנת</p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">{insights.length}</div>
              <div className="stat-label">תובנות</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{dailyEntries.length}</div>
              <div className="stat-label">ימי מעקב</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{currentTokens || 0}</div>
              <div className="stat-label">טוקנים</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="quick-actions">
        <div className="actions-container">
          <button 
            className="action-button primary"
            onClick={generateInsights}
            disabled={isGenerating || !hasData}
          >
            {isGenerating ? (
              <>
                <span className="spinner-small"></span>
                מנתחת נתונים...
              </>
            ) : (
              <>
                <span className="icon">✨</span>
                יצירת תובנות חדשות
              </>
            )}
          </button>
          <button 
            className="action-button secondary"
            onClick={() => window.location.href = '/journal'}
          >
            <span className="icon">📝</span>
            הוספת רישום יומי
          </button>
          <button 
            className="action-button secondary"
            onClick={() => window.location.href = '/cycle'}
          >
            <span className="icon">🌸</span>
            עדכון מחזור
          </button>
        </div>
        <p className="actions-note">
          💡 התובנות מתעדכנות אוטומטית כל ערב ב-20:00 | יצירת תובנות ידנית צורכת טוקנים
        </p>
      </section>

      {/* Category Filter */}
      <section className="category-filter">
        <div className="filter-container">
          <button 
            className={`filter-button ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            הכל ({insights.length})
          </button>
          {['sleep', 'symptoms', 'mood', 'cycle', 'hormones', 'lifestyle'].map(cat => {
            const count = insights.filter(i => i.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                className={`filter-button ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {getCategoryIcon(cat)} {cat} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* Insights Grid */}
      <section className="insights-grid-section">
        {filteredInsights.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>אין תובנות להצגה</h3>
            <p>
              {!hasData 
                ? 'התחילי להזין נתונים ביומן ובמעקב המחזור כדי לקבל תובנות אישיות'
                : 'לחצי על "יצירת תובנות חדשות" כדי לנתח את הנתונים שלך'}
            </p>
          </div>
        ) : (
          <div className="insights-grid">
            {filteredInsights.map((insight, index) => (
              <div 
                key={insight.id} 
                className={`insight-card modern ${insight.priority}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-header">
                  <div className="card-icons">
                    <span className="category-icon">{getCategoryIcon(insight.category)}</span>
                    <span 
                      className="priority-badge" 
                      style={{ backgroundColor: getPriorityColor(insight.priority) }}
                    >
                      {insight.priority === 'high' ? 'חשוב' : insight.priority === 'medium' ? 'בינוני' : 'רגיל'}
                    </span>
                  </div>
                </div>
                
                <div className="card-body">
                  <h3>{insight.title}</h3>
                  <p>{insight.content}</p>
                  
                  {insight.comparisonToNorm && (
                    <div className="comparison-box">
                      <div className="comparison-title">📊 השוואה לנורמה</div>
                      <div className="comparison-bars">
                        <div className="bar-item">
                          <span>את:</span>
                          <div className="bar-container">
                            <div 
                              className="bar-fill user"
                              style={{ width: `${Math.min(insight.comparisonToNorm.userValue, 100)}%` }}
                            >
                              {Math.round(insight.comparisonToNorm.userValue)}%
                            </div>
                          </div>
                        </div>
                        <div className="bar-item">
                          <span>ממוצע:</span>
                          <div className="bar-container">
                            <div 
                              className="bar-fill average"
                              style={{ width: `${Math.min(insight.comparisonToNorm.averageValue, 100)}%` }}
                            >
                              {Math.round(insight.comparisonToNorm.averageValue)}%
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="comparison-note">{insight.comparisonToNorm.explanation}</p>
                    </div>
                  )}
                  
                  {insight.actionable && (() => {
                    const categoryLink = getCategoryLink(insight.category);
                    if (categoryLink) {
                      return (
                        <a 
                          href={categoryLink}
                          className="actionable-indicator actionable-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = categoryLink;
                          }}
                        >
                          <span>💡</span> יש לך צעדים מעשיים
                        </a>
                      );
                    }
                    return (
                      <div className="actionable-indicator">
                        <span>💡</span> יש לך צעדים מעשיים
                      </div>
                    );
                  })()}
                  
                  {insight.alizaMessage && (
                    <div className="aliza-message">
                      <div className="message-header">
                        <img src="/aliza_profile.jpg" alt="עליזה" />
                        <span>עליזה אומרת:</span>
                      </div>
                      <p>{insight.alizaMessage}</p>
                    </div>
                  )}
                </div>

                {insight.analysisDate && (
                  <div className="card-footer">
                    <span className="date">
                      {new Date(insight.analysisDate).toLocaleDateString('he-IL')}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="bottom-cta">
        <div className="cta-container">
          <h3>רוצה תובנות מעמיקות יותר?</h3>
          <p>ככל שתזיני יותר נתונים, התובנות יהיו מדויקות ואישיות יותר</p>
          <button 
            className="cta-button"
            onClick={() => window.location.href = '/journal'}
          >
            התחילי לתעד עכשיו
          </button>
        </div>
      </section>
    </div>
  );
}
