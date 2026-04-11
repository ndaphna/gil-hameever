'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';
import { DailyEntry, CycleEntry } from '@/types/journal';
import { useAuthContext } from '@/contexts/AuthContext';
import './dashboard.css';

interface Alert {
  link: string;
  severity: string;
  title: string;
  message: string;
}

interface DayData {
  hasEntry: boolean;
  hotFlash?: boolean;
  goodSleep?: boolean;
  lowMood?: boolean;
  dayName: string;
}

interface Recommendation {
  emoji: string;
  title: string;
  message: string;
  link: string;
}

interface DashboardData {
  needsAttention: Alert[];
  last7Days: DayData[];
  alizaRecommendations: Recommendation[];
  topSymptoms?: [string, number][];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [cycleEntries, setCycleEntry] = useState<CycleEntry[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    // If not authenticated and done loading, redirect
    if (!authLoading && !user) {
      console.log('Dashboard: No authenticated user found, redirecting to login');
      router.push('/login');
      return;
    }

    // Only load user data once the global auth context has finished loading and we have a user
    if (!authLoading && user) {
      setLoading(true);
      loadUserData(user.id);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [user, authLoading, router]);
    
  const loadUserData = async (uid: string) => {
    try {
      if (!isMountedRef.current) return;
      console.log('📊 Loading real data for user:', uid);
      const dataLoadStart = Date.now();
      
      console.log('📋 Loading daily entries...');
      const dailyStart = Date.now();
      const { data: dailyData, error: dailyError } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(30);
      const dailyTime = Date.now() - dailyStart;
      console.log(`⏱️ Daily entries query took ${dailyTime}ms`);

      if (dailyError) {
        console.error('❌ Error loading daily entries:', dailyError);
      }

      console.log('📋 Loading cycle entries...');
      const cycleStart = Date.now();
      const { data: cycleData, error: cycleError } = await supabase
        .from('cycle_entries')
        .select('*')
        .eq('user_id', uid)
        .order('date', { ascending: false })
        .limit(12);
      const cycleTime = Date.now() - cycleStart;
      console.log(`⏱️ Cycle entries query took ${cycleTime}ms`);

      if (cycleError) {
        console.error('❌ Error loading cycle entries:', cycleError);
      }

      const realDailyData = dailyData || [];
      const realCycleData = cycleData || [];
      const totalDataTime = Date.now() - dataLoadStart;
      
      console.log(`✅ Loaded ${realDailyData.length} daily entries and ${realCycleData.length} cycle entries from database in ${totalDataTime}ms`);
      console.log('📊 Daily entries sample:', realDailyData.slice(0, 3));
      console.log('📅 Entry dates:', realDailyData.map(e => e.date).slice(0, 7));
      
      setDailyEntries(realDailyData);
      setCycleEntry(realCycleData);
      
      console.log('📋 Calculating dashboard data...');
      const calcStart = Date.now();
      // Wrap calculateDashboard in try-catch to ensure it always completes
      try {
        calculateDashboard(realDailyData, realCycleData);
        const calcTime = Date.now() - calcStart;
        console.log(`⏱️ Dashboard calculation took ${calcTime}ms`);
      } catch (calcError) {
        console.error('❌ Error in calculateDashboard:', calcError);
        // Initialize with empty data if calculation fails
        calculateDashboard([], []);
      }
    } catch (error) {
      console.error('❌ Error loading user data:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      // Even on error, show empty dashboard with real data structure
      setDailyEntries([]);
      setCycleEntry([]);
      try {
        calculateDashboard([], []);
      } catch (calcError) {
        console.error('❌ Error in calculateDashboard (fallback):', calcError);
        // Last resort: set minimal dashboard data
        setDashboardData({
          needsAttention: [],
          last7Days: [],
          alizaRecommendations: []
        });
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const calculateDashboard = (daily: DailyEntry[], cycle: CycleEntry[]) => {
    console.log('📈 calculateDashboard called with:', {
      dailyEntries: daily.length,
      cycleEntries: cycle.length,
      sampleDates: daily.map(e => e.date).slice(0, 5)
    });
    
    // Calculate streak (same logic as before)
    const uniqueDays = Array.from(new Set(daily.map(e => e.date))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    const todayForStreak = new Date();
    todayForStreak.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < uniqueDays.length; i++) {
      const expected = new Date(todayForStreak);
      expected.setDate(todayForStreak.getDate() - i);
      const expectedStr = expected.toISOString().split('T')[0];
      
      if (uniqueDays[i] === expectedStr) {
        streak++;
      } else {
        break;
      }
    }

    // Weekly stats (Israeli week: Sunday to Saturday)
    const nowForWeek = new Date();
    const currentDayOfWeekForStats = nowForWeek.getDay(); // 0 = Sunday
    
    // Find last Sunday (start of current Israeli week)
    const lastSundayForStats = new Date(nowForWeek);
    lastSundayForStats.setDate(nowForWeek.getDate() - currentDayOfWeekForStats);
    lastSundayForStats.setHours(0, 0, 0, 0);
    
    const weeklyEntries = daily.filter(e => new Date(e.date) >= lastSundayForStats);
    
    // Helper function to format date as YYYY-MM-DD in local timezone
    const formatDateLocal = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Helper function to extract date string from entry date (handles various formats)
    const extractDateString = (dateValue: string | Date | null | undefined): string | null => {
      if (!dateValue) return null;
      
      if (typeof dateValue === 'string') {
        // Handle ISO string or date string
        const dateMatch = dateValue.match(/^(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) return dateMatch[1];
        // Try parsing as date
        const parsed = new Date(dateValue);
        if (!isNaN(parsed.getTime())) {
          return formatDateLocal(parsed);
        }
      } else if (dateValue instanceof Date) {
        return formatDateLocal(dateValue);
      }
      
      return null;
    };

    // Last 7 days for mini chart - Show last 7 days from today (inclusive)
    const last7Days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day in local timezone
    
    // Calculate the 7 days (today and 6 days before)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = formatDateLocal(date);
      
      // Find entries for this specific date
      const dayEntries = daily.filter(e => {
        const entryDateStr = extractDateString(e.date);
        return entryDateStr === dateStr;
      });
      
      const dayInfo = {
        date: dateStr,
        dayName: date.toLocaleDateString('he-IL', { weekday: 'short' }),
        hasEntry: dayEntries.length > 0,
        hotFlash: dayEntries.some(e => e.hot_flashes),
        goodSleep: dayEntries.some(e => e.sleep_quality === 'good'),
        lowMood: dayEntries.some(e => e.mood === 'sad' || e.mood === 'frustrated')
      };
      
      // Debug log for each day
      console.log(`📅 ${dayInfo.dayName} (${dateStr}): ${dayInfo.hasEntry ? `Found ${dayEntries.length} entries` : 'No entries'}`);
      if (dayInfo.hasEntry) {
        console.log(`   - Hot flash: ${dayInfo.hotFlash}, Good sleep: ${dayInfo.goodSleep}, Low mood: ${dayInfo.lowMood}`);
      }
      
      last7Days.push(dayInfo);
    }
    
    console.log('📊 Last 7 days calculated:', last7Days);
    console.log('📋 All daily entries dates:', daily.map(e => ({ date: e.date, formatted: extractDateString(e.date) })).slice(0, 10));
    
    // Cycle stats
    const periodEntries = cycle.filter(e => e.is_period).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastPeriod = periodEntries[0] ? new Date(periodEntries[0].date) : null;
    const daysSinceLastPeriod = lastPeriod ? Math.floor((new Date().getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24)) : null;

    // Most common symptoms
    const symptomCount: Record<string, number> = {};
    weeklyEntries.forEach(e => {
      if (e.hot_flashes) symptomCount['hot_flashes'] = (symptomCount['hot_flashes'] || 0) + 1;
      if (e.sleep_issues) symptomCount['sleep_issues'] = (symptomCount['sleep_issues'] || 0) + 1;
      if (e.mood === 'irritated' || e.mood === 'frustrated') symptomCount['mood_issues'] = (symptomCount['mood_issues'] || 0) + 1;
    });

    const topSymptoms = Object.entries(symptomCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Generate Aliza recommendations
    const recommendations = generateAlizaRecommendations(weeklyEntries, daysSinceLastPeriod, streak);

    setDashboardData({
      streak,
      weeklyReports: weeklyEntries.length,
      totalReports: daily.length,
      hotFlashes: weeklyEntries.filter(e => e.hot_flashes).length,
      goodSleep: weeklyEntries.filter(e => e.sleep_quality === 'good').length,
      daysSinceLastPeriod,
      lastPeriod: lastPeriod ? lastPeriod.toLocaleDateString('he-IL') : 'לא תועד',
      topSymptoms,
      last7Days,
      needsAttention: calculateNeedsAttention(weeklyEntries, daysSinceLastPeriod),
      alizaRecommendations: recommendations
    });
  };

  const generateAlizaRecommendations = (entries: DailyEntry[], daysSincePeriod: number | null, streak: number) => {
    const recommendations: Array<{emoji: string, title: string, message: string, action: string, link: string}> = [];
    
    // Streak encouragement
    if (streak >= 7) {
      recommendations.push({
        emoji: '🎉',
        title: 'מדהים! שבוע שלם של דיווחים',
        message: 'את עושה עבודה נהדרת בתיעוד המסע שלך. זה עוזר לך ולרופאה להבין דפוסים.',
        action: 'המשיכי כך',
        link: '/journal'
      });
    } else if (streak === 0) {
      recommendations.push({
        emoji: '🌱',
        title: 'בואי נתחיל רצף חדש!',
        message: 'דיווח יומי קבוע יעזור לך לזהות דפוסים ולהרגיש בשליטה על התהליך.',
        action: 'התחילי עכשיו',
        link: '/journal?tab=daily'
      });
    }

    // Hot flashes advice
    const hotFlashCount = entries.filter(e => e.hot_flashes).length;
    if (hotFlashCount >= 4) {
      recommendations.push({
        emoji: '🔥',
        title: `${hotFlashCount} גלי חום השבוע`,
        message: 'נסי להימנע מקפאין אחר הצהריים, תרגלי נשימות עמוקות, והחזיקי מאוורר קטן בתיק.',
        action: 'קראי עוד טיפים',
        link: '/heat-waves'
      });
    }

    // Sleep improvement
    const poorSleepCount = entries.filter(e => e.sleep_quality === 'poor').length;
    if (poorSleepCount >= 3) {
      recommendations.push({
        emoji: '😴',
        title: 'שינה לא רגועה',
        message: 'רוטינת שינה קבועה, הימנעות ממסכים שעה לפני השינה, וחדר קריר יכולים לעזור.',
        action: 'שיפור השינה',
        link: '/menopausal-sleep'
      });
    } else if (entries.filter(e => e.sleep_quality === 'good').length >= 5) {
      recommendations.push({
        emoji: '✨',
        title: 'השינה שלך משתפרת!',
        message: 'ישנת טוב רוב הלילות השבוע. שימי לב מה עשית אחרת והמשיכי.',
        action: 'המשיכי כך',
        link: '/journal?tab=insights'
      });
    }

    // Mood support
    const lowMoodCount = entries.filter(e => e.mood === 'sad' || e.mood === 'frustrated').length;
    if (lowMoodCount >= 4) {
      recommendations.push({
        emoji: '💙',
        title: 'מצב הרוח זקוק לתמיכה',
        message: 'שיחה עם חברה, פעילות גופנית קלה, או ייעוץ מקצועי יכולים לעזור מאוד.',
        action: 'משאבים לתמיכה',
        link: '/belonging-sisterhood-emotional-connection'
      });
    }

    // Period tracking
    if (daysSincePeriod && daysSincePeriod > 365) {
      recommendations.push({
        emoji: '🌸',
        title: 'שנה ללא מחזור',
        message: 'הגעת רשמית למנופאוזה! זה שלב טבעי. בואי נבין מה זה אומר ואיך להמשיך.',
        action: 'למדי עוד',
        link: '/what-going-on'
      });
    }

    // If no specific recommendations
    if (recommendations.length === 0) {
      recommendations.push({
        emoji: '💚',
        title: 'הכל נראה טוב!',
        message: 'את עושה עבודה נהדרת. המשיכי לתעד ולהקשיב לגוף שלך.',
        action: 'ראי תובנות',
        link: '/journal?tab=insights'
      });
    }

    return recommendations.slice(0, 3); // Max 3 recommendations
  };

  const calculateNeedsAttention = (entries: DailyEntry[], daysSincePeriod: number | null) => {
    const alerts: Array<{type: string, message: string, severity: 'high' | 'medium' | 'low', link: string}> = [];
    
    const hotFlashCount = entries.filter(e => e.hot_flashes).length;
    if (hotFlashCount >= 5) {
      alerts.push({
        type: 'hot_flashes',
        message: `${hotFlashCount} גלי חום בשבוע - יש דרכים להקל`,
        severity: 'high',
        link: '/heat-waves'
      });
    }

    const poorSleep = entries.filter(e => e.sleep_quality === 'poor').length;
    if (poorSleep >= 3) {
      alerts.push({
        type: 'sleep',
        message: `${poorSleep} לילות קשים - בואי נשפר את השינה`,
        severity: 'high',
        link: '/menopausal-sleep'
      });
    }

    if (daysSincePeriod && daysSincePeriod > 365) {
      alerts.push({
        type: 'menopause',
        message: 'שנה ללא מחזור - מנופאוזה רשמית. מה עכשיו?',
        severity: 'medium',
        link: '/journal?tab=cycle'
      });
    }

    const lowMood = entries.filter(e => e.mood === 'sad' || e.mood === 'frustrated').length;
    if (lowMood >= 4) {
      alerts.push({
        type: 'mood',
        message: 'מצב רוח נמוך - אולי זמן לדבר עם מישהי?',
        severity: 'medium',
        link: '/belonging-sisterhood-emotional-connection'
      });
    }

    return alerts;
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="loading-screen">
          <div className="loading-spinner">🌸</div>
          <p>טוענת את הנתונים שלך...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) return null;

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <div className="loading-screen">
          <p>אין נתונים זמינים</p>
        </div>
      </DashboardLayout>
    );
  }

  const today = new Date().toLocaleDateString('he-IL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <DashboardLayout>
      <div className="dashboard-page">
        {/* Hero Welcome */}
        <section className="dashboard-hero">
          <div className="welcome-header">
            <h1>👋 שלום {profile?.first_name || profile?.name?.split(' ')[0] || profile?.full_name?.split(' ')[0] || profile?.email?.split('@')[0]}!</h1>
            <p className="date-subtitle">{today}</p>
          </div>

          {dashboardData.needsAttention.length > 0 && (
            <div className="urgent-alerts">
              <h2>💡 דברים שדורשים תשומת לב</h2>
              <div className="alerts-grid">
                {dashboardData.needsAttention.map((alert: Alert, index: number) => (
                  <a 
                    key={index}
                    href={alert.link}
                    className={`alert-card severity-${alert.severity}`}
                  >
                    <p className="alert-message">{alert.message}</p>
                    <span className="alert-action">לחצי לפרטים →</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="status-snapshot">
            <h2>📊 סטטוס המומנטום</h2>
            <div className="status-grid">
              <div className="status-hero-card streak">
                <div className="card-icon">🔥</div>
                <div className="card-content">
                  <div className="card-number">{dashboardData.streak}</div>
                  <div className="card-label">{dashboardData.streak === 1 ? 'יום ברצף' : 'ימים ברצף'}</div>
                  <div className="card-hint">
                    {dashboardData.streak === 0 ? 'התחילי רצף!' : dashboardData.streak < 7 ? `עוד ${7 - dashboardData.streak} ליעד שבוע` : 'מדהים! 🎉'}
                  </div>
                </div>
                <div className="card-tooltip">
                  <p><strong>ימים ברצף</strong> = מספר הימים שמילאת דיווח יומי ברצף (בוקר או ערב).</p>
                  <p>כדי להעלות את הרצף: מלאי דיווח אחד לפחות בכל יום. הרצף מתאפס אם מפספסים יום.</p>
                </div>
              </div>

              <div className="status-hero-card reports">
                <div className="card-icon">📝</div>
                <div className="card-content">
                  <div className="card-number">{dashboardData.weeklyReports}</div>
                  <div className="card-label">דיווחים השבוע</div>
                  <div className="card-hint">מתוך מקסימום 14</div>
                </div>
                <div className="card-tooltip">
                  <p><strong>דיווחים השבוע</strong> = מספר הדיווחים שמילאת השבוע (בוקר + ערב).</p>
                  <p>מקסימום 14 דיווחים בשבוע (2 דיווחים ביום × 7 ימים).</p>
                </div>
              </div>

              <div className="status-hero-card sleep">
                <div className="card-icon">😴</div>
                <div className="card-content">
                  <div className="card-number">{dashboardData.goodSleep}</div>
                  <div className="card-label">לילות טובים</div>
                  <div className="card-hint">
                    {dashboardData.goodSleep >= 5 ? 'מצוין!' : dashboardData.goodSleep >= 3 ? 'לא רע' : 'צריך שיפור'}
                  </div>
                </div>
                <div className="card-tooltip">
                  <p><strong>לילות טובים</strong> = מספר הלילות בהם דיווחת על שינה איכותית (טוב) השבוע.</p>
                  <p>שינה איכותית חשובה לבריאות הכללית ולניהול תסמיני גיל המעבר.</p>
                </div>
              </div>

              <div className="status-hero-card period" onClick={() => router.push('/journal?tab=cycle')}>
                <div className="card-icon">🌸</div>
                <div className="card-content">
                  <div className="card-number">
                    {dashboardData.daysSinceLastPeriod !== null 
                      ? `${dashboardData.daysSinceLastPeriod} ימים`
                      : 'לא תועד'}
                  </div>
                  <div className="card-label">מאז מחזור אחרון</div>
                  <div className="card-hint">
                    {dashboardData.daysSinceLastPeriod > 365 ? '✨ מנופאוזה רשמית' : 'לחצי למעקב'}
                  </div>
                </div>
                <div className="card-tooltip">
                  <p><strong>מאז מחזור אחרון</strong> = מספר הימים שעברו מאז המחזור האחרון שתועד.</p>
                  <p>לחצי על הכרטיס כדי להוסיף או לעדכן מעקב מחזור. מנופאוזה רשמית מוגדרת לאחר 365 ימים ללא מחזור.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7 Days Mini Chart */}
        <section className="mini-chart-section">
          <h2>📈 7 הימים האחרונים שלך</h2>
          <div className="mini-chart">
            {dashboardData.last7Days.map((day: DayData, index: number) => (
              <div key={index} className="mini-chart-day">
                <div className={`day-indicator ${day.hasEntry ? 'has-entry' : 'no-entry'}`}>
                  {day.hasEntry ? '✓' : '○'}
                </div>
                <div className="day-signals">
                  {day.hotFlash && <span className="signal hot" title="גל חום">🔥</span>}
                  {day.goodSleep && <span className="signal sleep" title="שינה טובה">😴</span>}
                  {day.lowMood && <span className="signal mood" title="מצב רוח נמוך">😔</span>}
                </div>
                <div className="day-name">{day.dayName}</div>
              </div>
            ))}
          </div>
          <p className="chart-legend">✓ = דיווח נשמר | ○ = לא דיווחת</p>
        </section>

        {/* Aliza Recommendations */}
        <section className="aliza-recommendations">
          <h2>💬 המלצות מעליזה</h2>
          <div className="recommendations-grid">
            {dashboardData.alizaRecommendations.map((rec: Recommendation, index: number) => (
              <div key={index} className="recommendation-card">
                <div className="rec-header">
                  <span className="rec-emoji">{rec.emoji}</span>
                  <h3>{rec.title}</h3>
                </div>
                <p className="rec-message">{rec.message}</p>
                <button 
                  onClick={() => router.push(rec.link)} 
                  className="rec-action"
                >
                  {rec.action} →
                </button>
        </div>
            ))}
      </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>🚀 פעולות מהירות</h2>
          <div className="actions-grid">
            <a href="/journal?tab=daily" className="action-card daily">
              <div className="action-icon">📋</div>
              <h3>דיווח יומי</h3>
              <p>תעדי איך היום/הלילה</p>
            </a>
            
            <a href="/journal?tab=cycle" className="action-card cycle">
              <div className="action-icon">🌸</div>
              <h3>עדכון מחזור</h3>
              <p>סמני מחזור/תסמינים</p>
            </a>
            
            <a href="/journal?tab=insights" className="action-card insights">
              <div className="action-icon">💡</div>
              <h3>תובנות חכמות</h3>
              <p>גלי דפוסים ומגמות</p>
            </a>
            
            <a href="/chat" className="action-card chat">
              <div className="action-icon">💬</div>
              <h3>שיחה עם עליזה</h3>
              <p>שאלות, תמיכה, עצות</p>
            </a>
          </div>
        </section>

        {/* Top Symptoms */}
        {dashboardData.topSymptoms.length > 0 && (
          <section className="insights-highlights">
            <h2>🎯 התסמינים המרכזיים שלך השבוע</h2>
            <div className="symptoms-cards">
              {dashboardData.topSymptoms.map(([symptom, count]: [string, number]) => (
                <div key={symptom} className="symptom-highlight-card">
                  <div className="symptom-icon">
                    {symptom === 'hot_flashes' ? '🔥' : symptom === 'sleep_issues' ? '😴' : '😤'}
                  </div>
                  <div className="symptom-info">
                    <div className="symptom-count">{count}</div>
                    <div className="symptom-label">
                      {symptom === 'hot_flashes' ? 'גלי חום' : symptom === 'sleep_issues' ? 'בעיות שינה' : 'מצב רוח'}
                    </div>
                  </div>
                  <button 
                    className="symptom-action"
                    onClick={() => router.push(symptom === 'hot_flashes' ? '/heat-waves' : symptom === 'sleep_issues' ? '/menopausal-sleep' : '/belonging-sisterhood-emotional-connection')}
                  >
                    למדי עוד →
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Resources */}
        <section className="resources-section">
          <h2>📚 המשאבים שלך</h2>
          <div className="resources-grid">
            <a href="/menopause-roadmap" className="resource-card">
              <div className="resource-icon">🗺️</div>
              <h3>מפת הדרכים</h3>
              <p>הסולם המלא של גיל המעבר</p>
            </a>
            
            <a href="/what-going-on" className="resource-card">
              <div className="resource-icon">🔬</div>
              <h3>מה קורה בגוף?</h3>
              <p>מדע פשוט ומובן</p>
            </a>
            
            <a href="/the-body-whispers" className="resource-card">
              <div className="resource-icon">🌿</div>
              <h3>הגוף לוחש</h3>
              <p>כלים לצרכים הפיזיים</p>
            </a>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
