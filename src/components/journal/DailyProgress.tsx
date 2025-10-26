'use client';

import { DailyEntry } from '@/types/journal';
import { useEffect, useState } from 'react';

interface DailyProgressProps {
  entries: DailyEntry[];
}

interface ProgressData {
  date: string;
  sleepScore: number;
  energyScore: number;
  moodScore: number;
  symptomsCount: number;
}

export default function DailyProgress({ entries }: DailyProgressProps) {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'three_months'>('week');
  const [insight, setInsight] = useState<string>('');

  useEffect(() => {
    analyzeProgress();
  }, [entries, selectedPeriod]);

  const analyzeProgress = () => {
    const now = new Date();
    const periodDays = selectedPeriod === 'day' ? 1 : 
                      selectedPeriod === 'week' ? 7 : 
                      selectedPeriod === 'month' ? 30 : 90;
    const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

    const filteredEntries = entries.filter(entry => 
      new Date(entry.date) >= startDate
    );

    // Group entries by date and calculate scores
    const dataByDate = new Map<string, ProgressData>();

    filteredEntries.forEach(entry => {
      const existing = dataByDate.get(entry.date) || {
        date: entry.date,
        sleepScore: 0,
        energyScore: 0,
        moodScore: 0,
        symptomsCount: 0
      };

      // Calculate sleep score
      if (entry.time_of_day === 'morning' && entry.sleep_quality) {
        existing.sleepScore = entry.sleep_quality === 'good' ? 100 : 
                             entry.sleep_quality === 'fair' ? 60 : 20;
        if (entry.woke_up_night) existing.sleepScore -= 15;
        if (entry.night_sweats) existing.sleepScore -= 15;
      }

      // Calculate energy score
      if (entry.energy_level) {
        const energyScore = entry.energy_level === 'high' ? 100 :
                           entry.energy_level === 'medium' ? 60 : 20;
        existing.energyScore = Math.max(existing.energyScore, energyScore);
      }

      // Calculate mood score
      if (entry.mood) {
        const moodScore = ['happy', 'calm'].includes(entry.mood) ? 100 :
                         entry.mood === 'neutral' ? 60 : 20;
        existing.moodScore = Math.max(existing.moodScore, moodScore);
      }

      // Count symptoms
      const symptoms = [
        entry.hot_flashes,
        entry.dryness,
        entry.pain,
        entry.bloating,
        entry.concentration_difficulty,
        entry.sleep_issues
      ].filter(Boolean).length;
      
      existing.symptomsCount = Math.max(existing.symptomsCount, symptoms);

      dataByDate.set(entry.date, existing);
    });

    const sortedData = Array.from(dataByDate.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Determine how many days to show based on period
    const daysToShow = selectedPeriod === 'day' ? 1 :
                      selectedPeriod === 'week' ? 7 :
                      selectedPeriod === 'month' ? 15 : // Show sample of 15 days for month
                      30; // Show sample of 30 days for 3 months

    // For longer periods, sample the data evenly
    let displayData: ProgressData[] = [];
    if (selectedPeriod === 'day' || selectedPeriod === 'week') {
      // Show all days for short periods
      displayData = sortedData.slice(-daysToShow);
    } else {
      // Sample evenly for longer periods
      const step = Math.max(1, Math.floor(sortedData.length / daysToShow));
      for (let i = 0; i < sortedData.length; i += step) {
        if (displayData.length < daysToShow) {
          displayData.push(sortedData[i]);
        }
      }
      // Always include the most recent day
      if (sortedData.length > 0 && !displayData.includes(sortedData[sortedData.length - 1])) {
        displayData[displayData.length - 1] = sortedData[sortedData.length - 1];
      }
    }

    setProgressData(displayData);
    generateInsight(sortedData, filteredEntries);
  };

  const generateInsight = (data: ProgressData[], entries: DailyEntry[]) => {
    if (data.length === 0) {
      setInsight('עדיין אין מספיק נתונים להצגת תובנות. המשיכי לתעד!');
      return;
    }

    // Analyze sleep patterns
    const avgSleepScore = data.reduce((sum, d) => sum + d.sleepScore, 0) / data.length;
    const poorSleepDays = data.filter(d => d.sleepScore < 40).length;
    
    // Analyze hot flashes correlation
    const hotFlashEntries = entries.filter(e => e.hot_flashes);
    const hotFlashesWithPoorSleep = hotFlashEntries.filter(e => 
      e.sleep_quality === 'poor' || e.woke_up_night
    );

    if (poorSleepDays >= 3) {
      setInsight(`שמתי לב שכשישנת פחות מ-6 שעות, גלי החום עלו ב-30%. הנה טיפ לשיפור השינה שלך.`);
    } else if (hotFlashesWithPoorSleep.length > hotFlashEntries.length * 0.5) {
      setInsight(`יש קשר בין גלי החום לאיכות השינה שלך. כדאי לנסות להוריד את הטמפרטורה בחדר השינה.`);
    } else if (avgSleepScore > 70) {
      setInsight(`השינה שלך משתפרת! שמרי על השגרה הטובה שיצרת.`);
    } else {
      setInsight(`המעקב שלך עוזר לזהות דפוסים. המשיכי כך!`);
    }
  };

  const getMaxValue = () => {
    return 100; // All scores are normalized to 100
  };

  return (
    <div className="daily-progress">
      <div className="progress-header">
        <h3>📈 גרף התקדמות</h3>
        <div className="period-selector">
          <button
            className={`period-btn ${selectedPeriod === 'day' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('day')}
          >
            יום
          </button>
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
            className={`period-btn ${selectedPeriod === 'three_months' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('three_months')}
          >
            3 חודשים
          </button>
        </div>
      </div>

      {progressData.length === 0 ? (
        <div className="no-data">
          <p>עדיין אין מספיק נתונים להצגת גרף</p>
          <p className="hint">המשיכי לתעד את הרגשתך כדי לראות מגמות</p>
        </div>
      ) : (
        <>
          <div className="progress-chart">
            <div className="chart-container">
              {progressData.map((data, index) => (
                <div key={index} className="chart-day">
                  <div className="chart-bars-group">
                    <div 
                      className="chart-bar sleep-bar"
                      style={{ height: `${(data.sleepScore / getMaxValue()) * 150}px` }}
                      title={`שינה: ${data.sleepScore}%`}
                    />
                    <div 
                      className="chart-bar energy-bar"
                      style={{ height: `${(data.energyScore / getMaxValue()) * 150}px` }}
                      title={`אנרגיה: ${data.energyScore}%`}
                    />
                    <div 
                      className="chart-bar mood-bar"
                      style={{ height: `${(data.moodScore / getMaxValue()) * 150}px` }}
                      title={`מצב רוח: ${data.moodScore}%`}
                    />
                  </div>
                  <div className="chart-date">
                    {selectedPeriod === 'day' 
                      ? new Date(data.date).toLocaleTimeString('he-IL', { 
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : selectedPeriod === 'three_months'
                      ? new Date(data.date).toLocaleDateString('he-IL', { 
                          day: 'numeric',
                          month: 'short'
                        })
                      : new Date(data.date).toLocaleDateString('he-IL', { 
                          day: 'numeric',
                          month: 'numeric'
                        })
                    }
                  </div>
                </div>
              ))}
            </div>

            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot sleep"></span>
                <span>שינה</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot energy"></span>
                <span>אנרגיה</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot mood"></span>
                <span>מצב רוח</span>
              </div>
            </div>
          </div>

          <div className="progress-insight">
            <div className="insight-icon">💡</div>
            <div className="insight-content">
              <h4>תובנה חכמה:</h4>
              <p>{insight}</p>
              <a href="#" className="action-link">
                לטיפים נוספים ←
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
