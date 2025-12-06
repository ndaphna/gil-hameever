'use client';

import { useState, useEffect } from 'react';
import { PersonalizedInsight } from '@/types/insights';
import { supabase } from '@/lib/supabase';
import { useTokens } from '@/hooks/useTokens';
import './AlizaInsights.css';

interface AlizaInsightsProps {
  userId: string;
}

export default function AlizaInsights({ userId }: AlizaInsightsProps) {
  const [insights, setInsights] = useState<PersonalizedInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>('יקרה');
  const [hasData, setHasData] = useState<boolean>(false);
  const { tokens, loadTokens } = useTokens();

  useEffect(() => {
    if (userId) {
      loadUserData();
      loadInsights();
    }
  }, [userId]);

  const loadUserData = async () => {
    try {
      const { data: profile } = await supabase
        .from('user_profile')
        .select('first_name, name, full_name, email, current_tokens')
        .eq('id', userId)
        .single();
      
      if (profile) {
        const name = profile.first_name || profile.name?.split(' ')[0] || 'יקרה';
        setUserName(name);
      }

      // Check if user has data
      const [dailyCheck, cycleCheck] = await Promise.all([
        supabase.from('daily_entries').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('cycle_entries').select('id', { count: 'exact', head: true }).eq('user_id', userId)
      ]);
      
      setHasData((dailyCheck.count || 0) > 0 || (cycleCheck.count || 0) > 0);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const { data: insightsData, error } = await supabase
        .from('personalized_insights')
        .select('*')
        .eq('user_id', userId)
        .order('analysis_date', { ascending: false })
        .order('priority', { ascending: false })
        .limit(20);

      if (!error && insightsData) {
        const loadedInsights: PersonalizedInsight[] = insightsData.map((insight: any) => ({
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
          relatedData: {}
        }));
        setInsights(loadedInsights);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateInsights = async () => {
    setIsLoading(true);
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
      
      if (result.deduct_tokens && result.deduct_tokens > 0) {
        await loadTokens();
        alert(`נוצרו ${result.insightsCount || 0} תובנות.\nהופחתו ${result.deduct_tokens} טוקנים.\nנשארו ${tokens} טוקנים.`);
      }

      await loadInsights();
    } catch (error) {
      console.error('Error generating insights:', error);
      alert('שגיאה ביצירת תובנות. נסי שוב מאוחר יותר.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="insights-loading">
        <div className="loading-spinner"></div>
        <p>טוען תובנות...</p>
      </div>
    );
  }

  return (
    <div className="aliza-insights-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="aliza-avatar-hero">
            <img src="/aliza_profile.jpg" alt="עליזה" />
          </div>
          <h1>היי {userName}, אני עליזה 💕</h1>
          <p className="hero-subtitle">
            המנטורית האישית שלך למסע המנופאוזה
          </p>
          <p className="hero-description">
            ניתחתי את הנתונים שלך ויש לי כמה תובנות מעניינות ומעשיות שיכולות לעזור לך
          </p>
        </div>
      </section>

      {/* Insights Summary */}
      {insights.length > 0 && (
        <section className="insights-summary-section">
          <div className="summary-stats">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-number">{insights.length}</div>
                <div className="stat-label">תובנות</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <div className="stat-number">{insights.filter(i => i.priority === 'high').length}</div>
                <div className="stat-label">עדיפות גבוהה</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💡</div>
              <div className="stat-content">
                <div className="stat-number">{insights.filter(i => i.actionable).length}</div>
                <div className="stat-label">ניתנות לפעולה</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Insights Grid */}
      {insights.length > 0 ? (
        <section className="insights-grid-section">
          <h2 className="section-title">
            <span className="title-icon">✨</span>
            התובנות שלך
          </h2>
          <div className="insights-grid">
            {insights.map((insight) => (
              <div 
                key={insight.id} 
                className={`insight-card priority-${insight.priority}`}
              >
                <div className="insight-header">
                  <span className="insight-category-icon">
                    {getCategoryIcon(insight.category)}
                  </span>
                  <span className={`insight-priority-badge priority-${insight.priority}`}>
                    {getPriorityLabel(insight.priority)}
                  </span>
                </div>
                
                <h3 className="insight-title">{insight.title}</h3>
                <p className="insight-content">{insight.content}</p>
                
                {insight.comparisonToNorm && (
                  <div className="insight-comparison">
                    <div className="comparison-bar">
                      <div className="comparison-label">את: {insight.comparisonToNorm.userValue}%</div>
                      <div 
                        className="comparison-fill user-fill"
                        style={{ width: `${Math.min(insight.comparisonToNorm.userValue, 100)}%` }}
                      ></div>
                    </div>
                    <div className="comparison-bar">
                      <div className="comparison-label">ממוצע: {insight.comparisonToNorm.averageValue}%</div>
                      <div 
                        className="comparison-fill avg-fill"
                        style={{ width: `${Math.min(insight.comparisonToNorm.averageValue, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="insight-footer">
                  <div className="aliza-message">
                    <img src="/aliza_profile.jpg" alt="עליזה" className="aliza-avatar-small" />
                    <p>{insight.alizaMessage}</p>
                  </div>
                  
                  {insight.actionable && (
                    <button className="action-btn">
                      <span>💡</span>
                      ראי המלצות
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="no-insights-section">
          <div className="no-insights-content">
            <div className="no-insights-icon">🌸</div>
            <h2>עדיין אין תובנות</h2>
            <p>
              {hasData 
                ? 'התובנות שלך מתעדכנות אוטומטית כל ערב (20:00). תוכלי גם ליצור תובנות חדשות עכשיו.'
                : 'התחילי להזין נתונים יומיים ומעקב מחזור, ואני אנתח אותם ואתן לך תובנות אישיות.'}
            </p>
            {hasData && (
              <div className="generate-section">
                <button 
                  className="generate-btn"
                  onClick={handleGenerateInsights}
                  disabled={isLoading}
                >
                  {isLoading ? 'יוצר תובנות...' : '✨ צרי תובנות עכשיו'}
                </button>
                <p className="generate-note">
                  <strong>שימי לב:</strong> יצירת תובנות כרוכה בשימוש בטוקנים
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Token Status */}
      <section className="token-status-section">
        <div className="token-card">
          <div className="token-icon">🪙</div>
          <div className="token-info">
            <div className="token-count">{tokens || 0}</div>
            <div className="token-label">טוקנים זמינים</div>
          </div>
        </div>
        <p className="token-note">
          תובנות נוצרות אוטומטית כל ערב בשעה 20:00 ללא עלות בטוקנים
        </p>
      </section>
    </div>
  );
}

// Helper functions
function getCategoryIcon(category: string): string {
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
}

function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    high: 'חשוב',
    medium: 'בינוני',
    low: 'נמוך'
  };
  return labels[priority] || 'בינוני';
}


import { useState, useEffect } from 'react';
import { PersonalizedInsight } from '@/types/insights';
import { supabase } from '@/lib/supabase';
import { useTokens } from '@/hooks/useTokens';
import './AlizaInsights.css';

interface AlizaInsightsProps {
  userId: string;
}

export default function AlizaInsights({ userId }: AlizaInsightsProps) {
  const [insights, setInsights] = useState<PersonalizedInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>('יקרה');
  const [hasData, setHasData] = useState<boolean>(false);
  const { tokens, loadTokens } = useTokens();

  useEffect(() => {
    if (userId) {
      loadUserData();
      loadInsights();
    }
  }, [userId]);

  const loadUserData = async () => {
    try {
      const { data: profile } = await supabase
        .from('user_profile')
        .select('first_name, name, full_name, email, current_tokens')
        .eq('id', userId)
        .single();
      
      if (profile) {
        const name = profile.first_name || profile.name?.split(' ')[0] || 'יקרה';
        setUserName(name);
      }

      // Check if user has data
      const [dailyCheck, cycleCheck] = await Promise.all([
        supabase.from('daily_entries').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('cycle_entries').select('id', { count: 'exact', head: true }).eq('user_id', userId)
      ]);
      
      setHasData((dailyCheck.count || 0) > 0 || (cycleCheck.count || 0) > 0);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const { data: insightsData, error } = await supabase
        .from('personalized_insights')
        .select('*')
        .eq('user_id', userId)
        .order('analysis_date', { ascending: false })
        .order('priority', { ascending: false })
        .limit(20);

      if (!error && insightsData) {
        const loadedInsights: PersonalizedInsight[] = insightsData.map((insight: any) => ({
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
          relatedData: {}
        }));
        setInsights(loadedInsights);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateInsights = async () => {
    setIsLoading(true);
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
      
      if (result.deduct_tokens && result.deduct_tokens > 0) {
        await loadTokens();
        alert(`נוצרו ${result.insightsCount || 0} תובנות.\nהופחתו ${result.deduct_tokens} טוקנים.\nנשארו ${tokens} טוקנים.`);
      }

      await loadInsights();
    } catch (error) {
      console.error('Error generating insights:', error);
      alert('שגיאה ביצירת תובנות. נסי שוב מאוחר יותר.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="insights-loading">
        <div className="loading-spinner"></div>
        <p>טוען תובנות...</p>
      </div>
    );
  }

  return (
    <div className="aliza-insights-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="aliza-avatar-hero">
            <img src="/aliza_profile.jpg" alt="עליזה" />
          </div>
          <h1>היי {userName}, אני עליזה 💕</h1>
          <p className="hero-subtitle">
            המנטורית האישית שלך למסע המנופאוזה
          </p>
          <p className="hero-description">
            ניתחתי את הנתונים שלך ויש לי כמה תובנות מעניינות ומעשיות שיכולות לעזור לך
          </p>
        </div>
      </section>

      {/* Insights Summary */}
      {insights.length > 0 && (
        <section className="insights-summary-section">
          <div className="summary-stats">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-number">{insights.length}</div>
                <div className="stat-label">תובנות</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <div className="stat-number">{insights.filter(i => i.priority === 'high').length}</div>
                <div className="stat-label">עדיפות גבוהה</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💡</div>
              <div className="stat-content">
                <div className="stat-number">{insights.filter(i => i.actionable).length}</div>
                <div className="stat-label">ניתנות לפעולה</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Insights Grid */}
      {insights.length > 0 ? (
        <section className="insights-grid-section">
          <h2 className="section-title">
            <span className="title-icon">✨</span>
            התובנות שלך
          </h2>
          <div className="insights-grid">
            {insights.map((insight) => (
              <div 
                key={insight.id} 
                className={`insight-card priority-${insight.priority}`}
              >
                <div className="insight-header">
                  <span className="insight-category-icon">
                    {getCategoryIcon(insight.category)}
                  </span>
                  <span className={`insight-priority-badge priority-${insight.priority}`}>
                    {getPriorityLabel(insight.priority)}
                  </span>
                </div>
                
                <h3 className="insight-title">{insight.title}</h3>
                <p className="insight-content">{insight.content}</p>
                
                {insight.comparisonToNorm && (
                  <div className="insight-comparison">
                    <div className="comparison-bar">
                      <div className="comparison-label">את: {insight.comparisonToNorm.userValue}%</div>
                      <div 
                        className="comparison-fill user-fill"
                        style={{ width: `${Math.min(insight.comparisonToNorm.userValue, 100)}%` }}
                      ></div>
                    </div>
                    <div className="comparison-bar">
                      <div className="comparison-label">ממוצע: {insight.comparisonToNorm.averageValue}%</div>
                      <div 
                        className="comparison-fill avg-fill"
                        style={{ width: `${Math.min(insight.comparisonToNorm.averageValue, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="insight-footer">
                  <div className="aliza-message">
                    <img src="/aliza_profile.jpg" alt="עליזה" className="aliza-avatar-small" />
                    <p>{insight.alizaMessage}</p>
                  </div>
                  
                  {insight.actionable && (
                    <button className="action-btn">
                      <span>💡</span>
                      ראי המלצות
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="no-insights-section">
          <div className="no-insights-content">
            <div className="no-insights-icon">🌸</div>
            <h2>עדיין אין תובנות</h2>
            <p>
              {hasData 
                ? 'התובנות שלך מתעדכנות אוטומטית כל ערב (20:00). תוכלי גם ליצור תובנות חדשות עכשיו.'
                : 'התחילי להזין נתונים יומיים ומעקב מחזור, ואני אנתח אותם ואתן לך תובנות אישיות.'}
            </p>
            {hasData && (
              <div className="generate-section">
                <button 
                  className="generate-btn"
                  onClick={handleGenerateInsights}
                  disabled={isLoading}
                >
                  {isLoading ? 'יוצר תובנות...' : '✨ צרי תובנות עכשיו'}
                </button>
                <p className="generate-note">
                  <strong>שימי לב:</strong> יצירת תובנות כרוכה בשימוש בטוקנים
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Token Status */}
      <section className="token-status-section">
        <div className="token-card">
          <div className="token-icon">🪙</div>
          <div className="token-info">
            <div className="token-count">{tokens || 0}</div>
            <div className="token-label">טוקנים זמינים</div>
          </div>
        </div>
        <p className="token-note">
          תובנות נוצרות אוטומטית כל ערב בשעה 20:00 ללא עלות בטוקנים
        </p>
      </section>
    </div>
  );
}

// Helper functions
function getCategoryIcon(category: string): string {
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
}

function getPriorityLabel(priority: string): string {
  const labels: Record<string, string> = {
    high: 'חשוב',
    medium: 'בינוני',
    low: 'נמוך'
  };
  return labels[priority] || 'בינוני';
}






