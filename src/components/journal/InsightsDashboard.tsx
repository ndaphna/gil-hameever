'use client';

import { DailyEntry, CycleEntry } from '@/types/journal';
import { useEffect, useState } from 'react';
import SmartInsights from '../insights/SmartInsights';
// Using CSS animations instead of framer-motion

interface InsightsDashboardProps {
  dailyEntries: DailyEntry[];
  cycleEntries: CycleEntry[];
}

interface Insight {
  id: string;
  icon: string;
  title: string;
  value: string | number;
  trend: 'up' | 'down' | 'stable';
  message: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
}

export default function InsightsDashboard({ dailyEntries, cycleEntries }: InsightsDashboardProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateInsights();
  }, [dailyEntries, cycleEntries]);

  const generateInsights = () => {
    const newInsights: Insight[] = [];

    // Sleep Quality Insight
    const recentSleepEntries = dailyEntries
      .filter(e => e.sleep_quality)
      .slice(0, 7);
    
    if (recentSleepEntries.length > 0) {
      const goodSleepCount = recentSleepEntries.filter(e => e.sleep_quality === 'good').length;
      const sleepPercentage = Math.round((goodSleepCount / recentSleepEntries.length) * 100);
      
      newInsights.push({
        id: 'sleep',
        icon: '😴',
        title: 'איכות שינה',
        value: `${sleepPercentage}%`,
        trend: sleepPercentage > 60 ? 'up' : sleepPercentage < 40 ? 'down' : 'stable',
        message: sleepPercentage > 60 
          ? 'השינה שלך משתפרת! המשיכי כך 🌙' 
          : 'כדאי לשפר את שגרת השינה שלך',
        color: '#667EEA',
        priority: sleepPercentage < 40 ? 'high' : 'medium'
      });
    }

    // Hot Flashes Pattern
    const hotFlashesCount = dailyEntries.filter(e => e.hot_flashes).length;
    if (dailyEntries.length > 0) {
      const hotFlashesPercentage = Math.round((hotFlashesCount / dailyEntries.length) * 100);
      
      newInsights.push({
        id: 'hot-flashes',
        icon: '🔥',
        title: 'גלי חום',
        value: `${hotFlashesCount} השבוע`,
        trend: hotFlashesCount > 10 ? 'up' : hotFlashesCount < 5 ? 'down' : 'stable',
        message: hotFlashesCount > 10 
          ? 'גלי החום מוגברים - נסי טכניקות הרגעה' 
          : 'גלי החום בשליטה - כל הכבוד!',
        color: '#E91E63',
        priority: hotFlashesCount > 10 ? 'high' : 'low'
      });
    }

    // Mood Stability
    const moodVariety = new Set(dailyEntries.map(e => e.mood)).size;
    const moodStability = moodVariety <= 2 ? 'יציב' : moodVariety <= 4 ? 'משתנה' : 'תנודתי';
    
    newInsights.push({
      id: 'mood',
      icon: '😊',
      title: 'מצב רוח',
      value: moodStability,
      trend: moodVariety <= 2 ? 'stable' : moodVariety > 4 ? 'down' : 'stable',
      message: moodVariety <= 2 
        ? 'מצב רוח יציב - סימן מצוין!' 
        : 'תנודות במצב הרוח - זה נורמלי בתקופה זו',
      color: '#4FACFE',
      priority: moodVariety > 4 ? 'medium' : 'low'
    });

    // Cycle Regularity
    if (cycleEntries.length >= 3) {
      const periodDates = cycleEntries
        .filter(e => e.is_period)
        .map(e => new Date(e.date).getTime())
        .sort((a, b) => a - b);
      
      if (periodDates.length >= 2) {
        const gaps = [];
        for (let i = 1; i < periodDates.length; i++) {
          gaps.push((periodDates[i] - periodDates[i-1]) / (1000 * 60 * 60 * 24));
        }
        
        const avgGap = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
        const isRegular = gaps.every(g => Math.abs(g - avgGap) <= 7);
        
        newInsights.push({
          id: 'cycle',
          icon: '🌸',
          title: 'סדירות מחזור',
          value: isRegular ? 'סדיר' : 'לא סדיר',
          trend: isRegular ? 'stable' : 'down',
          message: isRegular 
            ? `מחזור סדיר כל ${avgGap} ימים בממוצע` 
            : 'המחזור לא סדיר - טבעי בגיל המעבר',
          color: '#FF6B9D',
          priority: isRegular ? 'low' : 'medium'
        });
      }
    }

    // Energy Levels
    const energyLevels = dailyEntries.filter(e => e.energy_level);
    if (energyLevels.length > 0) {
      const highEnergyCount = energyLevels.filter(e => e.energy_level === 'high').length;
      const energyPercentage = Math.round((highEnergyCount / energyLevels.length) * 100);
      
      newInsights.push({
        id: 'energy',
        icon: '⚡',
        title: 'רמת אנרגיה',
        value: `${energyPercentage}% גבוהה`,
        trend: energyPercentage > 40 ? 'up' : energyPercentage < 20 ? 'down' : 'stable',
        message: energyPercentage > 40 
          ? 'אנרגיה טובה! המשיכי בפעילות' 
          : 'אנרגיה נמוכה - דאגי למנוחה',
        color: '#FFD700',
        priority: energyPercentage < 20 ? 'high' : 'low'
      });
    }

    // Overall Wellness Score
    const wellnessScore = calculateWellnessScore(dailyEntries);
    newInsights.push({
      id: 'wellness',
      icon: '🌟',
      title: 'ציון בריאות כללי',
      value: `${wellnessScore}/100`,
      trend: wellnessScore > 70 ? 'up' : wellnessScore < 50 ? 'down' : 'stable',
      message: wellnessScore > 70 
        ? 'את מתמודדת נהדר! 🎉' 
        : 'יש מקום לשיפור - עליזה כאן בשבילך',
      color: '#4CAF50',
      priority: wellnessScore < 50 ? 'high' : 'low'
    });

    setInsights(newInsights);
    setAnimationKey(prev => prev + 1);
    setIsLoading(false);
  };

  const calculateWellnessScore = (entries: DailyEntry[]): number => {
    if (entries.length === 0) return 50;

    let score = 0;
    let factors = 0;

    // Sleep quality factor
    const sleepEntries = entries.filter(e => e.sleep_quality);
    if (sleepEntries.length > 0) {
      const sleepScore = sleepEntries.reduce((acc, e) => {
        return acc + (e.sleep_quality === 'good' ? 100 : e.sleep_quality === 'fair' ? 60 : 20);
      }, 0) / sleepEntries.length;
      score += sleepScore;
      factors++;
    }

    // Energy level factor
    const energyEntries = entries.filter(e => e.energy_level);
    if (energyEntries.length > 0) {
      const energyScore = energyEntries.reduce((acc, e) => {
        return acc + (e.energy_level === 'high' ? 100 : e.energy_level === 'medium' ? 60 : 20);
      }, 0) / energyEntries.length;
      score += energyScore;
      factors++;
    }

    // Mood factor
    const moodEntries = entries.filter(e => e.mood);
    if (moodEntries.length > 0) {
      const positiveModds = moodEntries.filter(e => ['happy', 'calm'].includes(e.mood || '')).length;
      const moodScore = (positiveModds / moodEntries.length) * 100;
      score += moodScore;
      factors++;
    }

    // Symptoms factor (inverted - less symptoms = higher score)
    const symptomScore = entries.reduce((acc, e) => {
      const symptoms = [
        e.hot_flashes, e.night_sweats, e.pain, e.bloating,
        e.concentration_difficulty, e.sleep_issues
      ].filter(Boolean).length;
      return acc + (100 - (symptoms * 15));
    }, 0) / entries.length;
    score += symptomScore;
    factors++;

    return Math.round(score / factors);
  };

  // Animation handled by CSS classes

  return (
    <div className="insights-dashboard">
      <div className="dashboard-header">
        <h2>🎯 התובנות שלך במבט אחד</h2>
        <p className="dashboard-subtitle">
          עליזה ניתחה את הנתונים שלך וגילתה דברים מעניינים
        </p>
      </div>

      <div 
        className="insights-grid"
        key={animationKey}
      >
        {insights.map((insight, index) => (
          <div
            key={insight.id}
            className={`insight-card priority-${insight.priority} animate-in`}
            onClick={() => setSelectedInsight(insight)}
            style={{ 
              borderColor: insight.color + '40',
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="insight-header">
              <span className="insight-icon" style={{ fontSize: '2.5rem' }}>
                {insight.icon}
              </span>
              <div className={`trend-indicator trend-${insight.trend}`}>
                {insight.trend === 'up' ? '↑' : insight.trend === 'down' ? '↓' : '→'}
              </div>
            </div>
            
            <h3 className="insight-title">{insight.title}</h3>
            
            <div className="insight-value" style={{ color: insight.color }}>
              {insight.value}
            </div>
            
            <p className="insight-message">{insight.message}</p>
            
            <div className="insight-glow" style={{ background: insight.color + '20' }} />
          </div>
        ))}
      </div>

      {/* Smart Insights Component */}
      <SmartInsights entries={dailyEntries} />

      {selectedInsight && (
        <div
          className="insight-detail-overlay show"
          onClick={() => setSelectedInsight(null)}
        >
          <div
            className="insight-detail-card"
            onClick={(e) => e.stopPropagation()}
          >
              <button 
                className="close-button"
                onClick={() => setSelectedInsight(null)}
              >
                ✕
              </button>
              
              <div className="detail-icon" style={{ fontSize: '4rem' }}>
                {selectedInsight.icon}
              </div>
              
              <h2>{selectedInsight.title}</h2>
              
              <div className="detail-value" style={{ color: selectedInsight.color }}>
                {selectedInsight.value}
              </div>
              
              <p className="detail-message">{selectedInsight.message}</p>
              
              <div className="detail-actions">
                <button className="action-button primary">
                  קבלי טיפים נוספים
                </button>
                <button className="action-button secondary">
                  ראי היסטוריה
                </button>
              </div>
            </div>
          </div>
        )}

      <div className="dashboard-footer">
        <div className="aliza-tip">
          <span className="tip-icon">💡</span>
          <p>
            <strong>טיפ מעליזה:</strong> המעקב היומי שלך עוזר לי להכיר אותך טוב יותר. 
            ככל שתתעדי יותר, אוכל לתת לך תובנות מדויקות יותר!
          </p>
        </div>
      </div>
    </div>
  );
}
