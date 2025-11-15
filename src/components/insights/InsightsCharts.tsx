'use client';

import { useEffect, useRef, useState } from 'react';
import { ChartData, TrendAnalysis } from '@/types/insights';
import type { DailyEntry, CycleEntry } from '@/types/journal';
import './InsightsCharts.css';

interface InsightsChartsProps {
  dailyEntries: DailyEntry[];
  cycleEntries: CycleEntry[];
  timeRange: 'week' | 'month' | 'quarter';
  onTimeRangeChange?: (range: 'week' | 'month' | 'quarter') => void;
}

export default function InsightsCharts({ dailyEntries, cycleEntries, timeRange, onTimeRangeChange }: InsightsChartsProps) {
  const [activeChart, setActiveChart] = useState<'symptoms' | 'mood' | 'sleep' | 'cycle'>('symptoms');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dailyEntries.length > 0 || cycleEntries.length > 0) {
      setIsLoading(true);
      // עיבוד נתונים אמיתיים - עיכוב קצר כדי שהקונטיינרים יסתדרו
      const timer = setTimeout(() => setIsLoading(false), 100);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [timeRange, dailyEntries, cycleEntries]);

  const symptomsAnalysis = generateSymptomsData(dailyEntries, timeRange);
  
  const chartConfigs = {
    symptoms: {
      title: 'תסמינים לאורך זמן',
      icon: '🌡️',
      color: '#ff6b6b',
      data: symptomsAnalysis.chartData,
      topSymptoms: symptomsAnalysis.topSymptoms,
      description: 'מעקב אחר התסמינים שלך מאפשר לך לזהות דפוסים ולקבל החלטות מושכלות על הטיפול והתמיכה הנכונה.'
    },
    mood: {
      title: 'מצב רוח',
      icon: '😊',
      color: '#4ecdc4',
      data: generateMoodData(dailyEntries, timeRange),
      description: 'מעקב אחר מצב הרוח עוזר להבין את ההשפעה ההורמונלית על הרגשות ולזהות דפוסים שמחייבים תשומת לב.'
    },
    sleep: {
      title: 'איכות שינה',
      icon: '😴',
      color: '#45b7d1',
      data: generateSleepData(dailyEntries, timeRange),
      description: 'שינה איכותית חיונית לבריאות הפיזית והנפשית. המעקב מאפשר לזהות מה משפיע על איכות השינה שלך.'
    },
    cycle: {
      title: 'מחזור חודשי',
      icon: '🌸',
      color: '#f9ca24',
      data: generateCycleData(cycleEntries, timeRange),
      description: 'מעקב אחר המחזור מאפשר לזהות שינויים ודפוסים בשלב הגיל המעבר ולנהל את התסמינים בצורה יעילה יותר.'
    }
  };

  if (isLoading) {
    return (
      <div className="charts-loading">
        <div className="loading-spinner"></div>
        <p>טוען גרפים...</p>
      </div>
    );
  }

  // בדיקה אם יש נתונים
  const hasData = dailyEntries.length > 0 || cycleEntries.length > 0;
  
  if (!hasData) {
    return (
      <div className="insights-charts">
        <div className="charts-header">
          <h3>📊 ניתוח ויזואלי</h3>
          <p>גרפים אינטראקטיביים של הנתונים שלך</p>
        </div>
        <div className="no-chart-data">
          <div className="no-data-icon">📈</div>
          <h4>עדיין אין נתונים להצגה</h4>
          <p>כשתתחילי להזין רשומות יומן, הגרפים יופיעו כאן</p>
        </div>
      </div>
    );
  }

  return (
    <div className="insights-charts">
      <div className="charts-header">
        <h3>📊 ניתוח ויזואלי</h3>
        <p>גרפים אינטראקטיביים של הנתונים שלך</p>
      </div>

      <div className="chart-tabs">
        {Object.entries(chartConfigs).map(([key, config]) => (
          <button
            key={key}
            className={`chart-tab ${activeChart === key ? 'active' : ''}`}
            onClick={() => setActiveChart(key as any)}
            style={{ '--chart-color': config.color } as React.CSSProperties}
          >
            <span className="chart-icon">{config.icon}</span>
            <span className="chart-title">{config.title}</span>
          </button>
        ))}
      </div>

      <div className="chart-container">
        <div className="chart-header-section">
          <div className="chart-header">
            <div className="chart-title-section">
              <h4>{chartConfigs[activeChart].title}</h4>
              <p className="chart-description">{chartConfigs[activeChart].description}</p>
            </div>
            <div className="chart-controls">
              <select 
                value={timeRange} 
                onChange={(e) => {
                  const newRange = e.target.value as 'week' | 'month' | 'quarter';
                  if (onTimeRangeChange) {
                    onTimeRangeChange(newRange);
                  }
                }}
                className="time-range-select"
              >
                <option value="week">שבוע</option>
                <option value="month">חודש</option>
                <option value="quarter">רבעון</option>
              </select>
            </div>
          </div>
          
          {/* סיכום תסמינים נפוצים - רק לתסמינים */}
          {activeChart === 'symptoms' && chartConfigs.symptoms.topSymptoms && chartConfigs.symptoms.topSymptoms.length > 0 && (
            <div className="top-symptoms-summary">
              <h5 className="summary-title">📊 התסמינים הנפוצים ביותר שלך:</h5>
              <div className="top-symptoms-grid">
                {chartConfigs.symptoms.topSymptoms.map((symptom, index) => (
                  <div key={index} className="symptom-summary-item">
                    <div className="symptom-icon" style={{ backgroundColor: `${symptom.color}20`, borderColor: symptom.color }}>
                      <span>{symptom.emoji}</span>
                    </div>
                    <div className="symptom-info">
                      <div className="symptom-name">{symptom.name}</div>
                      <div className="symptom-stats">
                        <span className="symptom-count">{symptom.count} ימים</span>
                        <span className="symptom-percentage">({symptom.percentage}%)</span>
                      </div>
                      <div className="symptom-progress-bar">
                        <div 
                          className="symptom-progress-fill" 
                          style={{ 
                            width: `${symptom.percentage}%`,
                            backgroundColor: symptom.color
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="chart-content">
          <InteractiveChart 
            data={chartConfigs[activeChart].data}
            type={activeChart}
            color={chartConfigs[activeChart].color}
          />
        </div>
      </div>
    </div>
  );
}

function InteractiveChart({ data, type, color }: { data: ChartData, type: string, color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ניקוי הקנבס
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ציור הגרף
    drawChart(ctx, canvas, data, color, type);
  }, [data, color, type]);

  return (
    <div className="chart-wrapper">
      <canvas 
        ref={canvasRef} 
        width={900} 
        height={450}
        className="chart-canvas"
      />
      <div className="chart-legend">
        {data.datasets.map((dataset, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: dataset.borderColor || dataset.backgroundColor }}
            />
            <span className="legend-label">{dataset.label}</span>
            {dataset.data && dataset.data.length > 0 && (
              <span className="legend-value">
                (טווח: {Math.min(...dataset.data)} - {Math.max(...dataset.data)})
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function drawChart(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: ChartData, color: string, type: string) {
  const padding = 80;
  const chartWidth = canvas.width - padding * 2;
  const chartHeight = canvas.height - padding * 2;

  // רקע לבן נקי
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid lines רקע - קווים אופקיים
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = 1;
  const gridLines = 5;
  
  for (let i = 0; i <= gridLines; i++) {
    const y = padding + (i / gridLines) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.width - padding, y);
    ctx.stroke();
  }

  // ציר Y - עבה יותר
  ctx.strokeStyle = '#d0d0d0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.stroke();

  // ציר X - עבה יותר
  ctx.beginPath();
  ctx.moveTo(padding, canvas.height - padding);
  ctx.lineTo(canvas.width - padding, canvas.height - padding);
  ctx.stroke();

  // ציור הנתונים
  if (type === 'symptoms' || type === 'mood' || type === 'sleep') {
    drawLineChart(ctx, data, padding, chartWidth, chartHeight, color);
  } else if (type === 'cycle') {
    drawBarChart(ctx, data, padding, chartWidth, chartHeight, color);
  }

  // תוויות צירים
  drawAxisLabels(ctx, data, padding, chartWidth, chartHeight, type);
}

function drawLineChart(ctx: CanvasRenderingContext2D, data: ChartData, padding: number, width: number, height: number, color: string) {
  if (data.datasets.length === 0 || data.datasets[0].data.length === 0) return;

  const dataset = data.datasets[0];
  const maxValue = Math.max(...dataset.data);
  const minValue = Math.min(...dataset.data);
  const valueRange = maxValue - minValue || 1;

  // Area fill תחת הקו
  ctx.fillStyle = dataset.backgroundColor || color + '40';
  ctx.beginPath();
  dataset.data.forEach((value, index) => {
    const x = padding + (index / (dataset.data.length - 1 || 1)) * width;
    const y = padding + height - ((value - minValue) / valueRange) * height;
    
    if (index === 0) {
      ctx.moveTo(x, padding + height);
      ctx.lineTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    
    if (index === dataset.data.length - 1) {
      ctx.lineTo(x, padding + height);
      ctx.closePath();
    }
  });
  ctx.fill();

  // קו הגרף - עבה יותר וחלק יותר
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();

  dataset.data.forEach((value, index) => {
    const x = padding + (index / (dataset.data.length - 1 || 1)) * width;
    const y = padding + height - ((value - minValue) / valueRange) * height;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // נקודות - גדולות יותר עם הילה
  dataset.data.forEach((value, index) => {
    const x = padding + (index / (dataset.data.length - 1 || 1)) * width;
    const y = padding + height - ((value - minValue) / valueRange) * height;
    
    // הילה
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
    gradient.addColorStop(0, color + '80');
    gradient.addColorStop(1, color + '00');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    // נקודה עצמה
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
    
    // מסגרת לבנה
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.stroke();
  });
}

function drawBarChart(ctx: CanvasRenderingContext2D, data: ChartData, padding: number, width: number, height: number, color: string) {
  if (data.datasets.length === 0 || data.datasets[0].data.length === 0) return;

  const dataset = data.datasets[0];
  const maxValue = Math.max(...dataset.data);
  const barWidth = width / dataset.data.length * 0.8;

  dataset.data.forEach((value, index) => {
    const barHeight = (value / maxValue) * height;
    const x = padding + (index / dataset.data.length) * width + (width / dataset.data.length - barWidth) / 2;
    const y = padding + height - barHeight;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, barWidth, barHeight);
  });
}

function drawAxisLabels(ctx: CanvasRenderingContext2D, data: ChartData, padding: number, width: number, height: number, type: string) {
  if (data.datasets.length === 0 || data.datasets[0].data.length === 0) return;

  const dataset = data.datasets[0];
  const maxValue = Math.max(...dataset.data);
  const minValue = Math.min(...dataset.data);
  const valueRange = maxValue - minValue || 1;

  // תוויות ציר Y (ערכים)
  ctx.fillStyle = '#6c757d';
  ctx.font = 'bold 11px Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  
  const ySteps = 5;
  for (let i = 0; i <= ySteps; i++) {
    const value = minValue + (i / ySteps) * valueRange;
    const y = padding + height - (i / ySteps) * height;
    const labelText = type === 'sleep' ? ['poor', 'fair', 'good'][Math.round(value) - 1] || Math.round(value) :
                      type === 'mood' ? Math.round(value).toString() :
                      Math.round(value * 10) / 10;
    
    ctx.fillText(String(labelText), padding - 10, y);
  }

  // תוויות ציר X (תאריכים) - רק כל כמה תאריכים כדי לא להעמיס
  ctx.fillStyle = '#495057';
  ctx.font = '11px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  const labelStep = Math.max(1, Math.floor(data.labels.length / 8)); // מקסימום 8 תוויות
  
  data.labels.forEach((label, index) => {
    if (index % labelStep === 0 || index === data.labels.length - 1) {
      const x = padding + (index / (data.labels.length - 1 || 1)) * width;
      const y = padding + height + 12;
      
      // קו קטן מתחת לתווית
      ctx.strokeStyle = '#d0d0d0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, padding + height);
      ctx.lineTo(x, padding + height + 5);
      ctx.stroke();
      
      // הטקסט עצמו
      ctx.fillStyle = '#495057';
      ctx.fillText(label, x, y);
    }
  });

  // כותרת ערכים (ציר Y)
  ctx.save();
  ctx.translate(15, padding + height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#6c757d';
  ctx.font = 'bold 12px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(dataset.label || 'ערך', 0, 0);
  ctx.restore();
}

// מפת תסמינים עם עברית
const SYMPTOM_NAMES: Record<string, { name: string; emoji: string; color: string }> = {
  hot_flashes: { name: 'גלי חום', emoji: '🔥', color: '#ff6b6b' },
  night_sweats: { name: 'הזעות לילה', emoji: '🌙', color: '#ff8787' },
  sleep_issues: { name: 'בעיות שינה', emoji: '😴', color: '#45b7d1' },
  concentration_difficulty: { name: 'קשיי ריכוז', emoji: '🧠', color: '#764ba2' },
  dryness: { name: 'יובש', emoji: '🏜️', color: '#ffa94d' },
  pain: { name: 'כאבים', emoji: '🤕', color: '#f06595' },
  bloating: { name: 'נפיחות', emoji: '💨', color: '#ffd43b' },
  mood_issues: { name: 'בעיות מצב רוח', emoji: '😔', color: '#4ecdc4' }
};

// פונקציות ליצירת נתונים מהנתונים האמיתיים
function generateSymptomsData(dailyEntries: DailyEntry[], timeRange: string): { chartData: ChartData; topSymptoms: Array<{ name: string; emoji: string; count: number; percentage: number; color: string }> } {
  const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  // סינון כניסות לפי טווח הזמן - רק נתונים אמיתיים מהמסד
  const filteredEntries = dailyEntries
    .filter(entry => {
      if (!entry || !entry.date) return false;
      const entryDate = new Date(entry.date);
      return !isNaN(entryDate.getTime()) && entryDate >= cutoffDate;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // ספירת תסמינים לכל תאריך
  const symptomByDate = new Map<string, Map<string, boolean>>();
  const symptomTotals = new Map<string, number>();
  
  filteredEntries.forEach(entry => {
    const dateStr = new Date(entry.date).toLocaleDateString('he-IL', { month: 'short', day: 'numeric' });
    const daySymptoms = new Map<string, boolean>();
    
    // בדיקת כל התסמינים מהמסד נתונים
    Object.keys(SYMPTOM_NAMES).forEach(symptomKey => {
      // טיפול בכמה שמות אפשריים
      const value = entry[symptomKey] || entry[symptomKey.replace('_', '')] || false;
      if (value === true || value === 'true' || value === 1) {
        daySymptoms.set(symptomKey, true);
        symptomTotals.set(symptomKey, (symptomTotals.get(symptomKey) || 0) + 1);
      }
    });
    
    symptomByDate.set(dateStr, daySymptoms);
  });

  // יצירת רשימת תאריכים מלאה
  const labels: string[] = [];
  const totalSymptomsData: number[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('he-IL', { month: 'short', day: 'numeric' });
    labels.push(dateStr);
    const daySymptoms = symptomByDate.get(dateStr);
    totalSymptomsData.push(daySymptoms ? daySymptoms.size : 0);
  }

  // חישוב תסמינים נפוצים
  const totalDays = filteredEntries.length;
  const topSymptoms = Array.from(symptomTotals.entries())
    .map(([key, count]) => ({
      ...SYMPTOM_NAMES[key],
      count,
      percentage: totalDays > 0 ? Math.round((count / totalDays) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // 5 הכי נפוצים

  return {
    chartData: {
      labels,
      datasets: [{
        label: 'מספר תסמינים ביום',
        data: totalSymptomsData,
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        borderColor: '#ff6b6b',
        tension: 0.4,
        fill: true
      }]
    },
    topSymptoms
  };
}

function generateMoodData(dailyEntries: DailyEntry[], timeRange: string): ChartData {
  const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const moodScores: Record<string, number> = {
    happy: 5,
    calm: 4,
    neutral: 3,
    sad: 2,
    irritated: 2,
    frustrated: 1,
    anxious: 1
  };

  const filteredEntries = dailyEntries
    .filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoffDate && entry.mood;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const moodMap = new Map<string, number>();
  
  filteredEntries.forEach(entry => {
    const dateStr = new Date(entry.date).toLocaleDateString('he-IL', { month: 'short', day: 'numeric' });
    const score = moodScores[entry.mood] || 3;
    moodMap.set(dateStr, score);
  });

  const labels: string[] = [];
  const data: number[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('he-IL', { month: 'short', day: 'numeric' });
    labels.push(dateStr);
    data.push(moodMap.get(dateStr) || 0);
  }

  return {
    labels,
    datasets: [{
      label: 'מצב רוח (1-5)',
      data,
      backgroundColor: 'rgba(78, 205, 196, 0.2)',
      borderColor: '#4ecdc4',
      tension: 0.4
    }]
  };
}

function generateSleepData(dailyEntries: DailyEntry[], timeRange: string): ChartData {
  const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const sleepScores: Record<string, number> = {
    poor: 1,
    fair: 2,
    good: 3
  };

  const filteredEntries = dailyEntries
    .filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoffDate && entry.sleep_quality;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const sleepMap = new Map<string, number>();
  
  filteredEntries.forEach(entry => {
    const dateStr = new Date(entry.date).toLocaleDateString('he-IL', { month: 'short', day: 'numeric' });
    const score = sleepScores[entry.sleep_quality] || 2;
    sleepMap.set(dateStr, score);
  });

  const labels: string[] = [];
  const data: number[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('he-IL', { month: 'short', day: 'numeric' });
    labels.push(dateStr);
    data.push(sleepMap.get(dateStr) || 0);
  }

  return {
    labels,
    datasets: [{
      label: 'איכות שינה (1-3)',
      data,
      backgroundColor: 'rgba(69, 183, 209, 0.2)',
      borderColor: '#45b7d1',
      tension: 0.4
    }]
  };
}

function generateCycleData(cycleEntries: CycleEntry[], timeRange: string): ChartData {
  const months = timeRange === 'week' ? 1 : timeRange === 'month' ? 3 : 12;
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);
  
  const filteredEntries = cycleEntries
    .filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoffDate;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // קבוצת כניסות לפי חודש
  const monthMap = new Map<string, number>();
  
  filteredEntries.forEach(entry => {
    const date = new Date(entry.date);
    const monthKey = date.toLocaleDateString('he-IL', { month: 'short', year: 'numeric' });
    const currentCount = monthMap.get(monthKey) || 0;
    monthMap.set(monthKey, currentCount + (entry.is_period ? 1 : 0));
  });

  const labels: string[] = [];
  const data: number[] = [];
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toLocaleDateString('he-IL', { month: 'short', year: 'numeric' });
    labels.push(monthKey);
    data.push(monthMap.get(monthKey) || 0);
  }

  return {
    labels,
    datasets: [{
      label: 'מספר ימי מחזור',
      data,
      backgroundColor: 'rgba(249, 202, 36, 0.2)',
      borderColor: '#f9ca24',
      tension: 0.4
    }]
  };
}
