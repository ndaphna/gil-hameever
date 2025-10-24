'use client';

import { useEffect, useRef, useState } from 'react';
import { ChartData, TrendAnalysis } from '@/types/insights';
import './InsightsCharts.css';

interface InsightsChartsProps {
  data: {
    symptoms: any[];
    mood: any[];
    sleep: any[];
    cycle: any[];
  };
  timeRange: 'week' | 'month' | 'quarter';
}

export default function InsightsCharts({ data, timeRange }: InsightsChartsProps) {
  const [activeChart, setActiveChart] = useState<'symptoms' | 'mood' | 'sleep' | 'cycle'>('symptoms');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // סימולציה של טעינת נתונים
    setTimeout(() => setIsLoading(false), 1000);
  }, [timeRange]);

  const chartConfigs = {
    symptoms: {
      title: 'תסמינים לאורך זמן',
      icon: '🌡️',
      color: '#ff6b6b',
      data: generateSymptomsData(data.symptoms, timeRange)
    },
    mood: {
      title: 'מצב רוח',
      icon: '😊',
      color: '#4ecdc4',
      data: generateMoodData(data.mood, timeRange)
    },
    sleep: {
      title: 'איכות שינה',
      icon: '😴',
      color: '#45b7d1',
      data: generateSleepData(data.sleep, timeRange)
    },
    cycle: {
      title: 'מחזור חודשי',
      icon: '🌸',
      color: '#f9ca24',
      data: generateCycleData(data.cycle, timeRange)
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
        <div className="chart-header">
          <h4>{chartConfigs[activeChart].title}</h4>
          <div className="chart-controls">
            <select 
              value={timeRange} 
              onChange={(e) => {/* Handle time range change */}}
              className="time-range-select"
            >
              <option value="week">שבוע</option>
              <option value="month">חודש</option>
              <option value="quarter">רבעון</option>
            </select>
          </div>
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
        width={800} 
        height={400}
        className="chart-canvas"
      />
      <div className="chart-legend">
        {data.datasets.map((dataset, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: dataset.backgroundColor }}
            />
            <span className="legend-label">{dataset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function drawChart(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: ChartData, color: string, type: string) {
  const padding = 60;
  const chartWidth = canvas.width - padding * 2;
  const chartHeight = canvas.height - padding * 2;

  // רקע
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ציור הצירים
  ctx.strokeStyle = '#dee2e6';
  ctx.lineWidth = 1;
  
  // ציר Y
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, canvas.height - padding);
  ctx.stroke();

  // ציר X
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

  // תוויות
  drawLabels(ctx, data, padding, chartWidth, chartHeight);
}

function drawLineChart(ctx: CanvasRenderingContext2D, data: ChartData, padding: number, width: number, height: number, color: string) {
  if (data.datasets.length === 0 || data.datasets[0].data.length === 0) return;

  const dataset = data.datasets[0];
  const maxValue = Math.max(...dataset.data);
  const minValue = Math.min(...dataset.data);
  const valueRange = maxValue - minValue || 1;

  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();

  dataset.data.forEach((value, index) => {
    const x = padding + (index / (dataset.data.length - 1)) * width;
    const y = padding + height - ((value - minValue) / valueRange) * height;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // נקודות
  ctx.fillStyle = color;
  dataset.data.forEach((value, index) => {
    const x = padding + (index / (dataset.data.length - 1)) * width;
    const y = padding + height - ((value - minValue) / valueRange) * height;
    
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
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

function drawLabels(ctx: CanvasRenderingContext2D, data: ChartData, padding: number, width: number, height: number) {
  ctx.fillStyle = '#6c757d';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';

  // תוויות ציר X
  data.labels.forEach((label, index) => {
    const x = padding + (index / (data.labels.length - 1)) * width;
    const y = padding + height + 20;
    ctx.fillText(label, x, y);
  });
}

// פונקציות ליצירת נתונים
function generateSymptomsData(symptoms: any[], timeRange: string): ChartData {
  const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
  const labels = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - days + i + 1);
    return date.toLocaleDateString('he-IL', { month: 'short', day: 'numeric' });
  });

  return {
    labels,
    datasets: [{
      label: 'תסמינים',
      data: Array.from({ length: days }, () => Math.random() * 5),
      backgroundColor: 'rgba(255, 107, 107, 0.2)',
      borderColor: '#ff6b6b',
      tension: 0.4
    }]
  };
}

function generateMoodData(mood: any[], timeRange: string): ChartData {
  const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
  const labels = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - days + i + 1);
    return date.toLocaleDateString('he-IL', { month: 'short', day: 'numeric' });
  });

  return {
    labels,
    datasets: [{
      label: 'מצב רוח',
      data: Array.from({ length: days }, () => Math.random() * 5),
      backgroundColor: 'rgba(78, 205, 196, 0.2)',
      borderColor: '#4ecdc4',
      tension: 0.4
    }]
  };
}

function generateSleepData(sleep: any[], timeRange: string): ChartData {
  const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
  const labels = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - days + i + 1);
    return date.toLocaleDateString('he-IL', { month: 'short', day: 'numeric' });
  });

  return {
    labels,
    datasets: [{
      label: 'איכות שינה',
      data: Array.from({ length: days }, () => Math.random() * 5),
      backgroundColor: 'rgba(69, 183, 209, 0.2)',
      borderColor: '#45b7d1',
      tension: 0.4
    }]
  };
}

function generateCycleData(cycle: any[], timeRange: string): ChartData {
  const months = timeRange === 'week' ? 1 : timeRange === 'month' ? 3 : 12;
  const labels = Array.from({ length: months }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - months + i + 1);
    return date.toLocaleDateString('he-IL', { month: 'short' });
  });

  return {
    labels,
    datasets: [{
      label: 'מחזור',
      data: Array.from({ length: months }, () => Math.random() * 10),
      backgroundColor: 'rgba(249, 202, 36, 0.2)',
      borderColor: '#f9ca24',
      tension: 0.4
    }]
  };
}
