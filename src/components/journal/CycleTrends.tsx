'use client';

import { CycleEntry } from '@/types/journal';
import { useEffect, useState } from 'react';

interface CycleTrendsProps {
  entries: CycleEntry[];
}

interface CycleData {
  month: string;
  cycleLength: number;
  isRegular: boolean;
  hasSkip: boolean;
}

export default function CycleTrends({ entries }: CycleTrendsProps) {
  const [cycleData, setCycleData] = useState<CycleData[]>([]);
  const [averageCycleLength, setAverageCycleLength] = useState(0);
  const [trend, setTrend] = useState<'shortening' | 'lengthening' | 'stable' | 'irregular'>('stable');
  const [stabilityScore, setStabilityScore] = useState<number | null>(null);

  useEffect(() => {
    analyzeCycleData();
  }, [entries]);

  const analyzeCycleData = () => {
    const periodEntries = entries
      .filter(e => e.is_period)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (periodEntries.length < 2) return;

    const cycleDataArray: CycleData[] = [];
    let totalCycleLength = 0;
    let cycleCount = 0;
    const varianceAccumulator: number[] = [];

    for (let i = 1; i < periodEntries.length; i++) {
      const prevDate = new Date(periodEntries[i - 1].date);
      const currDate = new Date(periodEntries[i].date);
      const cycleLength = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      totalCycleLength += cycleLength;
      cycleCount++;
      varianceAccumulator.push(cycleLength);

      const monthName = currDate.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });
      cycleDataArray.push({
        month: monthName,
        cycleLength,
        isRegular: cycleLength >= 21 && cycleLength <= 35,
        hasSkip: cycleLength > 35
      });
    }

    // Calculate average and trend
    const avgLength = Math.round(totalCycleLength / cycleCount);
    setAverageCycleLength(avgLength);

    // Stability score: std deviation of last up-to-6 cycles (lower == more stable)
    const window = varianceAccumulator.slice(-6);
    if (window.length >= 2) {
      const mean = window.reduce((a, b) => a + b, 0) / window.length;
      const variance = window.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (window.length - 1);
      setStabilityScore(Math.round(Math.sqrt(variance)));
    } else {
      setStabilityScore(null);
    }

    // Analyze trend from last 3 cycles
    if (cycleDataArray.length >= 3) {
      const recentCycles = cycleDataArray.slice(-3);
      const trend1 = recentCycles[1].cycleLength - recentCycles[0].cycleLength;
      const trend2 = recentCycles[2].cycleLength - recentCycles[1].cycleLength;
      
      if (trend1 < -3 && trend2 < -3) {
        setTrend('shortening');
      } else if (trend1 > 3 && trend2 > 3) {
        setTrend('lengthening');
      } else if (Math.abs(trend1) > 7 || Math.abs(trend2) > 7) {
        setTrend('irregular');
      } else {
        setTrend('stable');
      }
    }

    setCycleData(cycleDataArray.slice(-6)); // Show last 6 cycles
  };

  const getTrendMessage = () => {
    switch (trend) {
      case 'shortening':
        return 'נראה שהמרווח בין מחזורים מתקצר. זה שכיח בפרי-מנופאוזה; המשיכי לתעד ואם מופיעים דימומים חריגים פני לרופאה.';
      case 'lengthening':
        return 'המרווח בין מחזורים מתארך – תופעה נפוצה לקראת מנופאוזה. מומלץ להיערך לשינויים ולדווח על דימומים חזקים.';
      case 'irregular':
        return 'יש חוסר סדירות משמעותי. זה נורמלי, אך חשוב לשים לב לתסמינים נלווים ולהיעזר בהרגלים שמקלים.';
      case 'stable':
        return 'נראה יציב יחסית. המשיכי לתעד כדי לזהות שינוי בזמן ולהרגיש בשליטה.';
    }
  };

  const getAgentSuggestions = () => {
    const suggestions: string[] = [];
    if (trend === 'irregular' || (stabilityScore !== null && stabilityScore > 7)) {
      suggestions.push('הקפידי על שינה סדירה, הפחתת קפאין ואלכוהול בשעות הערב – זה עשוי להפחית תסמינים.');
      suggestions.push('נסי לעקוב אחר טריגרים (לחץ, פעילות, תזונה) ביומן – זה יעזור לזהות מה משפיע עלייך.');
    }
    if (trend === 'lengthening') {
      suggestions.push('החזיקי פדים/תחתונים לנוחות בתקופות לא צפויות. מעקב יומי יעזור להתכונן מבעוד מועד.');
    }
    if (trend === 'shortening') {
      suggestions.push('הקפידי לשתות מים ולהעשיר תזונה בברזל במידת הצורך.');
    }
    if (suggestions.length === 0) {
      suggestions.push('נפלא! המשיכי לעדכן דיווחים. כשתופיע מגמה נתריע ונספק המלצות מותאמות.');
    }
    return suggestions;
  };

  const getCommunityStats = () => {
    // Simulated community data
    return {
      regularCycle: 47,
      irregularCycle: 33,
      noMenstruation: 20
    };
  };

  const communityStats = getCommunityStats();

  return (
    <div className="cycle-trends">
      {/* Trend Chart */}
      <div className="trend-chart-section">
        <h3>📊 מגמות המחזור שלך</h3>
        
        {cycleData.length === 0 ? (
          <div className="no-data">
            <p>עדיין אין מספיק נתונים להצגת מגמות</p>
            <p className="hint">המשיכי לתעד את המחזור שלך כדי לראות תובנות</p>
          </div>
        ) : (
          <>
            <div className="cycle-chart">
              <div className="chart-bars">
                {cycleData.map((cycle, index) => {
                  // Calculate max cycle length for scaling
                  const maxLength = Math.max(...cycleData.map(c => c.cycleLength), 35);
                  // Scale height: min 40px, max 200px, proportional to max
                  const barHeight = Math.max(40, Math.min(200, (cycle.cycleLength / maxLength) * 200));
                  
                  return (
                    <div key={index} className="chart-bar-container">
                      <div 
                        className={`chart-bar ${cycle.isRegular ? 'regular' : 'irregular'} ${cycle.hasSkip ? 'skip' : ''}`}
                        style={{ height: `${barHeight}px` }}
                      >
                        <span className="cycle-days">{cycle.cycleLength} ימים</span>
                      </div>
                      <div className="chart-label">{cycle.month}</div>
                    </div>
                  );
                })}
              </div>
              
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-dot regular"></span>
                  <span>מחזור סדיר (21-35 ימים)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot irregular"></span>
                  <span>מחזור לא סדיר</span>
                </div>
              </div>
            </div>

            <div className="trend-insight">
              <div className="insight-icon">💡</div>
              <div className="insight-content">
                <h4>תובנה של עליזה:</h4>
                <p>{getTrendMessage()}</p>
                {averageCycleLength > 0 && (
                  <p className="average-info">
                    האורך הממוצע של המחזור שלך: <strong>{averageCycleLength} ימים</strong>
                  </p>
                )}
                {stabilityScore !== null && (
                  <p className="average-info">
                    מדד יציבות (סטיית תקן): <strong>{stabilityScore}</strong> {stabilityScore <= 5 ? '(יציב יחסית)' : '(חוסר סדירות)'}
                  </p>
                )}
                <ul className="agent-suggestions">
                  {getAgentSuggestions().map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Community Comparison */}
      <div className="community-comparison">
        <h3>🌸 איך את ביחס לקהילה?</h3>
        
        <div className="comparison-stats">
          <div className="stat-item">
            <div className="stat-percentage">{communityStats.regularCycle}%</div>
            <div className="stat-label">מהנשים בגילך עדיין חוות מחזור לסירוגין</div>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${communityStats.regularCycle}%` }}></div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-percentage">{communityStats.irregularCycle}%</div>
            <div className="stat-label">חוות מחזור לא סדיר</div>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${communityStats.irregularCycle}%` }}></div>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-percentage">{communityStats.noMenstruation}%</div>
            <div className="stat-label">כבר במנופאוזה מלאה</div>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${communityStats.noMenstruation}%` }}></div>
            </div>
          </div>
        </div>

        <div className="community-message">
          <p>
            <strong>אז את לא לבד!</strong> המערכת שלך פשוט מתאמנת על מצב חדש. 😅
          </p>
          <a href="/what-going-on" className="learn-more-link">
            למדי עוד על מה שקורה בגוף שלך ←
          </a>
        </div>
      </div>
    </div>
  );
}
