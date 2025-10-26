'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';
import { DailyEntry, CycleEntry } from '@/types/journal';
import './dashboard.css';

interface UserProfile {
  name: string | null;
  email: string;
  subscription_status: string;
  current_tokens: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [cycleEntries, setCycleEntry] = useState<CycleEntry[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, [router]);

  const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        console.log('Dashboard: User check result:', user);
        
        // Check for mock login if no Supabase user
        if (!user) {
          const mockLogin = localStorage.getItem('mock-login');
          if (mockLogin === 'true') {
            console.log('Dashboard: Using mock login');
            const mockProfile: UserProfile = {
              name: localStorage.getItem('user-email')?.split('@')[0] || 'משתמשת',
              email: localStorage.getItem('user-email') || '',
              subscription_status: 'active',
              current_tokens: 100
            };
            setProfile(mockProfile);
          setUserId('mock-user-dashboard');
          await loadUserData('mock-user-dashboard');
            setLoading(false);
            return;
          } else {
            console.log('Dashboard: No user found, redirecting to login');
            router.push('/login');
            return;
          }
        }

        let { data: profileData } = await supabase
          .from('user_profile')
          .select('*')
          .eq('id', user.id)
          .single();

      // Create profile if it doesn't exist
        if (!profileData) {
          await fetch('/api/create-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              email: user.email || '',
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'משתמשת',
            }),
          });

          const { data: newProfile } = await supabase
            .from('user_profile')
            .select('*')
            .eq('id', user.id)
            .single();
          
          profileData = newProfile;
        }

        if (profileData) {
          setProfile(profileData);
        setUserId(user.id);
        await loadUserData(user.id);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
  };

  const loadUserData = async (uid: string) => {
    try {
      // Check if mock user
      if (uid.startsWith('mock-user-')) {
        // Generate mock data for dashboard
        const mockDaily = generateMockDailyEntries(uid);
        const mockCycle = generateMockCycleEntries(uid);
        setDailyEntries(mockDaily);
        setCycleEntry(mockCycle);
        calculateDashboard(mockDaily, mockCycle);
        return;
      }

      // Load real data
      const { data: dailyData } = await supabase
        .from('daily_entries')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(30);

      const { data: cycleData } = await supabase
        .from('cycle_entries')
        .select('*')
        .eq('user_id', uid)
        .order('date', { ascending: false })
        .limit(12);

      setDailyEntries(dailyData || []);
      setCycleEntry(cycleData || []);
      calculateDashboard(dailyData || [], cycleData || []);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const generateMockDailyEntries = (uid: string): DailyEntry[] => {
    const entries: DailyEntry[] = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Morning entry
      if (i < 7) {
        entries.push({
          id: `mock-daily-${i}-morning`,
          user_id: uid,
          date: dateStr,
          time_of_day: 'morning',
          sleep_quality: i % 3 === 0 ? 'poor' : i % 3 === 1 ? 'fair' : 'good',
          woke_up_night: i % 3 === 0,
          night_sweats: i % 4 === 0,
          energy_level: i % 3 === 0 ? 'low' : i % 3 === 1 ? 'medium' : 'high',
          mood: i % 4 === 0 ? 'frustrated' : i % 4 === 1 ? 'calm' : i % 4 === 2 ? 'happy' : 'sad',
          hot_flashes: i % 3 === 0,
          dryness: false,
          pain: i % 5 === 0,
          bloating: false,
          concentration_difficulty: i % 4 === 0,
          sleep_issues: i % 3 === 0,
          sexual_desire: i % 2 === 0,
          daily_insight: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
      
      // Evening entry
      if (i < 5) {
        entries.push({
          id: `mock-daily-${i}-evening`,
          user_id: uid,
          date: dateStr,
          time_of_day: 'evening',
          sleep_quality: null,
          woke_up_night: false,
          night_sweats: false,
          energy_level: i % 3 === 0 ? 'low' : 'medium',
          mood: i % 3 === 0 ? 'irritated' : 'calm',
          hot_flashes: i % 2 === 0,
          dryness: false,
          pain: false,
          bloating: i % 3 === 0,
          concentration_difficulty: false,
          sleep_issues: false,
          sexual_desire: false,
          daily_insight: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
    
    return entries;
  };

  const generateMockCycleEntries = (uid: string): CycleEntry[] => {
    const entries: CycleEntry[] = [];
    const today = new Date();
    
    // Last 3 periods
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (i * 32 + 15)); // ~32 days apart
      
      entries.push({
        id: `mock-cycle-${i}`,
        user_id: uid,
        date: date.toISOString().split('T')[0],
        is_period: true,
        bleeding_intensity: i === 0 ? 'medium' : i === 1 ? 'light' : 'heavy',
        symptoms: i === 0 ? ['cramps', 'fatigue'] : i === 1 ? ['mood_irritable'] : ['back_pain', 'bloating'],
        notes: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
    
    return entries;
  };

  const calculateDashboard = (daily: DailyEntry[], cycle: CycleEntry[]) => {
    // Calculate streak (same logic as before)
    const uniqueDays = Array.from(new Set(daily.map(e => e.date))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < uniqueDays.length; i++) {
      const expected = new Date(today);
      expected.setDate(today.getDate() - i);
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
    
    // Last 7 days for mini chart - Starting from Sunday (Israeli week)
    const last7Days = [];
    const nowDate = new Date();
    
    // Find last Sunday
    const currentDayOfWeek = nowDate.getDay(); // 0 = Sunday
    const lastSunday = new Date(nowDate);
    lastSunday.setDate(nowDate.getDate() - currentDayOfWeek);
    
    // If today is Sunday and we have data for today, include this week
    // Otherwise show last complete week
    const startDate = currentDayOfWeek === 0 ? lastSunday : new Date(lastSunday.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayEntries = daily.filter(e => e.date === dateStr);
      
      last7Days.push({
        date: dateStr,
        dayName: date.toLocaleDateString('he-IL', { weekday: 'short' }),
        hasEntry: dayEntries.length > 0,
        hotFlash: dayEntries.some(e => e.hot_flashes),
        goodSleep: dayEntries.some(e => e.sleep_quality === 'good'),
        lowMood: dayEntries.some(e => e.mood === 'sad' || e.mood === 'frustrated')
      });
    }
    
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-screen">
          <div className="loading-spinner">🌸</div>
          <p>טוענת את הנתונים שלך...</p>
        </div>
      </DashboardLayout>
    );
  }

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
            <h1>👋 שלום {profile?.name || profile?.email?.split('@')[0]}!</h1>
            <p className="date-subtitle">{today}</p>
          </div>

          {dashboardData.needsAttention.length > 0 && (
            <div className="urgent-alerts">
              <h2>💡 דברים שדורשים תשומת לב</h2>
              <div className="alerts-grid">
                {dashboardData.needsAttention.map((alert: any, index: number) => (
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
              </div>

              <div className="status-hero-card reports">
                <div className="card-icon">📝</div>
                <div className="card-content">
                  <div className="card-number">{dashboardData.weeklyReports}</div>
                  <div className="card-label">דיווחים השבוע</div>
                  <div className="card-hint">מתוך מקסימום 14</div>
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
              </div>
            </div>
          </div>
        </section>

        {/* 7 Days Mini Chart */}
        <section className="mini-chart-section">
          <h2>📈 7 הימים האחרונים שלך</h2>
          <div className="mini-chart">
            {dashboardData.last7Days.map((day: any, index: number) => (
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
            {dashboardData.alizaRecommendations.map((rec: any, index: number) => (
              <div key={index} className="recommendation-card">
                <div className="rec-header">
                  <span className="rec-emoji">{rec.emoji}</span>
                  <h3>{rec.title}</h3>
                </div>
                <p className="rec-message">{rec.message}</p>
                <a href={rec.link} className="rec-action">{rec.action} →</a>
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
