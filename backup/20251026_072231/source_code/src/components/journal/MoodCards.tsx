'use client';

import { DailyEntry } from '@/types/journal';

interface MoodCardsProps {
  entries: DailyEntry[];
}

export default function MoodCards({ entries }: MoodCardsProps) {
  // Calculate mood statistics
  const moodStats = entries.reduce((acc, entry) => {
    if (entry.mood) {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalEntries = entries.length;
  const mostCommonMood = Object.entries(moodStats).reduce((a, b) => 
    moodStats[a[0]] > moodStats[b[0]] ? a[0] : b[0], 
    Object.keys(moodStats)[0] || 'calm'
  );

  // Calculate energy level statistics
  const energyStats = entries.reduce((acc, entry) => {
    if (entry.energy_level) {
      acc[entry.energy_level] = (acc[entry.energy_level] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const mostCommonEnergy = Object.entries(energyStats).reduce((a, b) => 
    energyStats[a[0]] > energyStats[b[0]] ? a[0] : b[0], 
    Object.keys(energyStats)[0] || 'medium'
  );

  // Calculate sleep quality statistics
  const sleepStats = entries.reduce((acc, entry) => {
    if (entry.sleep_quality) {
      acc[entry.sleep_quality] = (acc[entry.sleep_quality] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const mostCommonSleep = Object.entries(sleepStats).reduce((a, b) => 
    sleepStats[a[0]] > sleepStats[b[0]] ? a[0] : b[0], 
    Object.keys(sleepStats)[0] || 'good'
  );

  // Calculate symptoms frequency
  const symptomCount = entries.reduce((acc, entry) => {
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

  const mostCommonSymptom = Object.entries(symptomCount).reduce((a, b) => 
    symptomCount[a[0]] > symptomCount[b[0]] ? a[0] : b[0], 
    Object.keys(symptomCount)[0] || 'none'
  );

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

  return (
    <div className="mood-cards-container">
      <div className="mood-card">
        <span className="mood-card-icon">{moodEmojis[mostCommonMood as keyof typeof moodEmojis] || '😊'}</span>
        <div className="mood-card-title">מצב רוח נפוץ</div>
        <div className="mood-card-value">{getMoodLabel(mostCommonMood)}</div>
      </div>

      <div className="mood-card">
        <span className="mood-card-icon">{energyEmojis[mostCommonEnergy as keyof typeof energyEmojis] || '⚡'}</span>
        <div className="mood-card-title">רמת אנרגיה</div>
        <div className="mood-card-value">{getEnergyLabel(mostCommonEnergy)}</div>
      </div>

      <div className="mood-card">
        <span className="mood-card-icon">{sleepEmojis[mostCommonSleep as keyof typeof sleepEmojis] || '😊'}</span>
        <div className="mood-card-title">איכות שינה</div>
        <div className="mood-card-value">{getSleepLabel(mostCommonSleep)}</div>
      </div>

      <div className="mood-card">
        <span className="mood-card-icon">{symptomEmojis[mostCommonSymptom as keyof typeof symptomEmojis] || '💕'}</span>
        <div className="mood-card-title">תסמין נפוץ</div>
        <div className="mood-card-value">{getSymptomLabel(mostCommonSymptom)}</div>
      </div>

      <div className="mood-card">
        <span className="mood-card-icon">📊</span>
        <div className="mood-card-title">סה"כ דיווחים</div>
        <div className="mood-card-value">{totalEntries}</div>
      </div>

      <div className="mood-card">
        <span className="mood-card-icon">📈</span>
        <div className="mood-card-title">מעקב רציף</div>
        <div className="mood-card-value">{Math.floor(totalEntries / 7)} שבועות</div>
      </div>
    </div>
  );
}
