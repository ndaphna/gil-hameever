'use client';

import { DailyEntry } from '@/types/journal';
import { useState } from 'react';

interface MoodCardsProps {
  entries: DailyEntry[];
}

export default function MoodCards({ entries }: MoodCardsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  
  // Filter entries based on selected period (Israeli week starts on Sunday)
  const getFilteredEntries = () => {
    const now = new Date();
    let startDate: Date;
    
    if (selectedPeriod === 'week') {
      // Find last Sunday (start of Israeli week)
      const currentDayOfWeek = now.getDay(); // 0 = Sunday
      startDate = new Date(now);
      startDate.setDate(now.getDate() - currentDayOfWeek);
      startDate.setHours(0, 0, 0, 0);
    } else {
      const periodDays = selectedPeriod === 'month' ? 30 : 90;
      startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
    }
    
    return entries.filter(entry => 
      new Date(entry.date) >= startDate
    );
  };
  
  const filteredEntries = getFilteredEntries();
  
  // Debug: Log filtered entries to verify data
  console.log(`📊 MoodCards: Analyzing ${filteredEntries.length} entries for period: ${selectedPeriod}`);
  if (filteredEntries.length > 0) {
    console.log('📊 Sample entries:', filteredEntries.slice(0, 3).map(e => ({
      date: e.date,
      mood: e.mood,
      energy_level: e.energy_level
    })));
  }
  
  // Calculate mood statistics
  const moodStats = filteredEntries.reduce((acc, entry) => {
    if (entry.mood) {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalEntries = filteredEntries.length;
  
  // Debug: Log mood statistics
  console.log('📊 Mood statistics:', moodStats);
  
  // Fix: Properly find the most common mood by sorting entries by count
  // Only use real data - no default values
  const mostCommonMood = Object.keys(moodStats).length > 0
    ? Object.entries(moodStats)
        .sort((a, b) => b[1] - a[1]) // Sort by count descending
        [0][0] // Get the first (highest count) mood
    : null; // No default - will show "no data" message
  
  console.log(`📊 Most common mood: ${mostCommonMood} (${moodStats[mostCommonMood] || 0}/${totalEntries} entries)`);

  // Calculate energy level statistics
  const energyStats = filteredEntries.reduce((acc, entry) => {
    if (entry.energy_level) {
      acc[entry.energy_level] = (acc[entry.energy_level] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const mostCommonEnergy = Object.keys(energyStats).length > 0
    ? Object.entries(energyStats)
        .sort((a, b) => b[1] - a[1]) // Sort by count descending
        [0][0] // Get the first (highest count) energy level
    : null; // No default - will show "no data" message

  // Calculate sleep quality statistics
  const sleepStats = filteredEntries.reduce((acc, entry) => {
    if (entry.sleep_quality) {
      acc[entry.sleep_quality] = (acc[entry.sleep_quality] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const mostCommonSleep = Object.keys(sleepStats).length > 0
    ? Object.entries(sleepStats)
        .sort((a, b) => b[1] - a[1]) // Sort by count descending
        [0][0] // Get the first (highest count) sleep quality
    : null; // No default - will show "no data" message

  // Calculate symptoms frequency
  const symptomCount = filteredEntries.reduce((acc, entry) => {
    const symptoms = [
      'hot_flashes', 'dryness', 'pain', 'bloating', 
      'concentration_difficulty', 'sleep_issues', 'sexual_desire'
    ];
    
    symptoms.forEach(symptom => {
      if (entry[symptom as keyof DailyEntry]) {
        acc[symptom] = (acc[symptom] || 0) + 1;
      }
    });
    
    return acc;
  }, {} as Record<string, number>);

  const mostCommonSymptom = Object.keys(symptomCount).length > 0
    ? Object.entries(symptomCount)
        .sort((a, b) => b[1] - a[1]) // Sort by count descending
        [0][0] // Get the first (highest count) symptom
    : 'none'; // Default if no symptoms found

  // Calculate trends
  const lastWeekEntries = filteredEntries.slice(0, Math.floor(filteredEntries.length / 2));
  const previousWeekEntries = filteredEntries.slice(Math.floor(filteredEntries.length / 2));
  
  const getAverageScore = (entries: DailyEntry[], key: string) => {
    const values = entries
      .map(e => e[key as keyof DailyEntry])
      .filter(Boolean);
    return values.length > 0 ? values.length / entries.length : 0;
  };

  const hotFlashesTrend = lastWeekEntries.length > 0 && previousWeekEntries.length > 0
    ? getAverageScore(lastWeekEntries, 'hot_flashes') - getAverageScore(previousWeekEntries, 'hot_flashes')
    : 0;

  const sleepQualityTrend = lastWeekEntries.filter(e => e.sleep_quality === 'good').length -
    previousWeekEntries.filter(e => e.sleep_quality === 'good').length;

  const moodEmojis = {
    calm: '😌',
    happy: '😊',
    sad: '😢',
    irritated: '😤',
    frustrated: '😩'
  };

  const energyEmojis = {
    low: '🔋',
    medium: '⚡',
    high: '🚀'
  };

  const sleepEmojis = {
    poor: '😫',
    fair: '😴',
    good: '😊'
  };

  const symptomEmojis = {
    hot_flashes: '🔥',
    dryness: '🏜️',
    pain: '🤕',
    bloating: '💨',
    concentration_difficulty: '🧠',
    sleep_issues: '😴',
    sexual_desire: '💕'
  };

  const getMoodLabel = (mood: string) => {
    const labels = {
      calm: 'רגועה',
      happy: 'שמחה',
      sad: 'עצובה',
      irritated: 'עצבנית',
      frustrated: 'מתוסכלת'
    };
    return labels[mood as keyof typeof labels] || mood;
  };

  const getEnergyLabel = (energy: string) => {
    const labels = {
      low: 'נמוכה',
      medium: 'בינונית',
      high: 'גבוהה'
    };
    return labels[energy as keyof typeof labels] || energy;
  };

  const getSleepLabel = (sleep: string) => {
    const labels = {
      poor: 'גרוע',
      fair: 'בינוני',
      good: 'טוב'
    };
    return labels[sleep as keyof typeof labels] || sleep;
  };

  const getSymptomLabel = (symptom: string) => {
    const labels = {
      hot_flashes: 'גלי חום',
      dryness: 'יובש',
      pain: 'כאבים',
      bloating: 'נפיחות',
      concentration_difficulty: 'קושי בריכוז',
      sleep_issues: 'בעיות שינה',
      sexual_desire: 'תשוקה מינית'
    };
    return labels[symptom as keyof typeof labels] || symptom;
  };

  // Calculate streak and gamification
  const calculateStreak = () => {
    if (entries.length === 0) return 0;

    // Use unique day strings (YYYY-MM-DD) to avoid double-counting morning+evening
    const uniqueDayStrings = Array.from(
      new Set(
        entries.map((e) => {
          const d = new Date(e.date);
          // Normalize to local date string YYYY-MM-DD
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        })
      )
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < uniqueDayStrings.length; i++) {
      const expected = new Date(today);
      expected.setDate(today.getDate() - i);
      const y = expected.getFullYear();
      const m = String(expected.getMonth() + 1).padStart(2, '0');
      const d = String(expected.getDate()).padStart(2, '0');
      const expectedStr = `${y}-${m}-${d}`;

      if (uniqueDayStrings[i] === expectedStr) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };
  
  const currentStreak = calculateStreak();
  const totalReports = entries.length;

  // Pluralization for "days in a row"
  const getStreakLabel = (streak: number) => {
    if (streak === 1) return 'יום ברצף';
    if (streak === 2) return 'יומיים ברצף';
    return 'ימים ברצף';
  };

  // Helper text for streak card
  const nextStreakMilestone = currentStreak < 3 ? 3 : currentStreak < 7 ? 7 : currentStreak < 14 ? 14 : currentStreak < 30 ? 30 : null;
  const streakHelp = currentStreak === 0
    ? 'התחילי רצף דיווחים: דיווח אחד בכל יום. הרצף מתאפס אם מפספסים יום.'
    : nextStreakMilestone
      ? `עוד ${nextStreakMilestone - currentStreak} ימים ליעד הבא`
      : 'מדהים! הגעת לרצף מרשים';
  
  // Gamification levels
  const getLevel = (reports: number) => {
    if (reports >= 90) return { name: 'מומחית', icon: '👑', color: 'gold' };
    if (reports >= 60) return { name: 'מתקדמת', icon: '🌟', color: 'purple' };
    if (reports >= 30) return { name: 'מתמידה', icon: '💎', color: 'blue' };
    if (reports >= 14) return { name: 'מתחילה', icon: '🌱', color: 'green' };
    return { name: 'חדשה', icon: '🌸', color: 'pink' };
  };
  
  const currentLevel = getLevel(totalReports);
  const nextLevel = totalReports >= 90 ? null : 
                   totalReports >= 60 ? 90 :
                   totalReports >= 30 ? 60 :
                   totalReports >= 14 ? 30 : 14;
  
  const getCurrentLevelMin = (reports: number) => {
    if (reports >= 90) return 90;
    if (reports >= 60) return 60;
    if (reports >= 30) return 30;
    if (reports >= 14) return 14;
    return 0;
  };
  
  const currentLevelMin = getCurrentLevelMin(totalReports);
  const progressToNextLevel = nextLevel ? 
    Math.round(((totalReports - currentLevelMin) / (nextLevel - currentLevelMin)) * 100) : 100;

  return (
    <>
      {/* Period Selector */}
      <div className="mood-cards-period-selector">
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
        <button
          className={`period-btn ${selectedPeriod === 'quarter' ? 'active' : ''}`}
          onClick={() => setSelectedPeriod('quarter')}
        >
          רבעון
        </button>
      </div>
      
      <div className="mood-cards-container">
        <div className="mood-card mood-highlight">
          <span className="mood-card-icon">{mostCommonMood ? (moodEmojis[mostCommonMood as keyof typeof moodEmojis] || '😊') : '📝'}</span>
          <div className="mood-card-title">מצב רוח {selectedPeriod === 'week' ? 'השבוע' : selectedPeriod === 'month' ? 'החודש' : 'הרבעון'}</div>
          <div className="mood-card-value">
            {mostCommonMood ? getMoodLabel(mostCommonMood) : 'אין נתונים'}
          </div>
          <div className="mood-card-stat">
            {mostCommonMood && totalEntries > 0 
              ? `${Math.round((moodStats[mostCommonMood] || 0) / totalEntries * 100)}% מהזמן`
              : 'עדיין לא דיווחת'}
          </div>
        </div>

      <div className="mood-card energy-highlight">
        <span className="mood-card-icon">{mostCommonEnergy ? (energyEmojis[mostCommonEnergy as keyof typeof energyEmojis] || '⚡') : '📝'}</span>
        <div className="mood-card-title">רמת אנרגיה ממוצעת</div>
        <div className="mood-card-value">
          {mostCommonEnergy ? getEnergyLabel(mostCommonEnergy) : 'אין נתונים'}
        </div>
        <div className="mood-card-trend">
          {mostCommonEnergy 
            ? (energyStats.high > energyStats.low ? '📈 במגמת עלייה' : '📉 יש מקום לשיפור')
            : 'עדיין לא דיווחת'}
        </div>
      </div>

      <div className="mood-card sleep-highlight">
        <span className="mood-card-icon">{mostCommonSleep ? (sleepEmojis[mostCommonSleep as keyof typeof sleepEmojis] || '😊') : '📝'}</span>
        <div className="mood-card-title">איכות שינה</div>
        <div className="mood-card-value">
          {mostCommonSleep ? getSleepLabel(mostCommonSleep) : 'אין נתונים'}
        </div>
        <div className="mood-card-trend">
          {mostCommonSleep
            ? (sleepQualityTrend > 0 ? '✨ משתפרת' : sleepQualityTrend < 0 ? '⚠️ דורשת תשומת לב' : '📊 יציבה')
            : 'עדיין לא דיווחת'}
        </div>
      </div>

      <div className="mood-card symptom-highlight">
        <span className="mood-card-icon">{symptomEmojis[mostCommonSymptom as keyof typeof symptomEmojis] || '💕'}</span>
        <div className="mood-card-title">התסמין הבולט</div>
        <div className="mood-card-value">{getSymptomLabel(mostCommonSymptom)}</div>
        <div className="mood-card-stat">
          {symptomCount[mostCommonSymptom] || 0} פעמים השבוע
        </div>
      </div>

      <div className="mood-card hot-flashes-highlight">
        <span className="mood-card-icon">🔥</span>
        <div className="mood-card-title">גלי חום</div>
        <div className="mood-card-value">{symptomCount.hot_flashes || 0}</div>
        <div className="mood-card-trend">
          {hotFlashesTrend > 0.2 ? '📈 במגמת עלייה' : hotFlashesTrend < -0.2 ? '📉 בירידה' : '➡️ יציב'}
        </div>
      </div>

      </div>
      
      {/* Gamification Section - Below the mood cards */}
      <div className="gamification-section">
        <h4 className="gamification-title">🎯 ההתקדמות שלך</h4>
        
        <div className="gamification-stats">
          <div className="gamification-card streak-card" title="דיווח יומי אחד נשמר לכל יום. הרצף נספר רק לפי ימים, לא לפי בוקר/ערב.">
            <div className="streak-fire">🔥</div>
            <div className="streak-number">{currentStreak}</div>
            <div className="streak-label">{getStreakLabel(currentStreak)}</div>
            <div className="streak-hint">{streakHelp}</div>
            {currentStreak >= 7 && <div className="streak-badge">🏅 שבוע שלם!</div>}
            {currentStreak >= 30 && <div className="streak-badge">🏆 חודש שלם!</div>}
          </div>
          
          <div className="gamification-card level-card">
            <div className="level-icon">{currentLevel.icon}</div>
            <div className="level-name">{currentLevel.name}</div>
            <div className="level-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${progressToNextLevel}%`,
                    backgroundColor: `var(--${currentLevel.color})`
                  }}
                />
              </div>
              {nextLevel && (
                <div className="progress-label">
                  {totalReports}/{nextLevel} לרמה הבאה
                </div>
              )}
            </div>
          </div>
          
          <div className="gamification-card total-card">
            <div className="total-icon">📊</div>
            <div className="total-number">{totalReports}</div>
            <div className="total-label">סה&quot;כ דיווחים</div>
            {totalReports >= 30 && <div className="achievement">⭐ מדווחת מצטיינת</div>}
          </div>
        </div>
        
        <div className="gamification-achievements">
          <h5>🏅 תגיות הישג</h5>
          <p className="achievements-subtext">אספי תגיות קטנות על נקודות ציון משמעותיות בדרך. הן יעזרו לך לראות התקדמות ולהישאר במומנטום.</p>
          <div className="achievements-grid">
            {currentStreak >= 3 && <div className="achievement-badge" title="3 ימים ברצף">🌱</div>}
            {currentStreak >= 7 && <div className="achievement-badge" title="שבוע ברצף">🌟</div>}
            {currentStreak >= 14 && <div className="achievement-badge" title="שבועיים ברצף">💎</div>}
            {currentStreak >= 30 && <div className="achievement-badge" title="חודש ברצף">👑</div>}
            {totalReports >= 10 && <div className="achievement-badge" title="10 דיווחים">🎯</div>}
            {totalReports >= 50 && <div className="achievement-badge" title="50 דיווחים">🏆</div>}
            {totalReports >= 100 && <div className="achievement-badge" title="100 דיווחים">🌈</div>}
          </div>
        </div>
      </div>
    </>
  );
}
