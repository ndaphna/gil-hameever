'use client';

import { useState } from 'react';
import { CycleEntry } from '@/types/journal';

interface CycleCalendarProps {
  entries: CycleEntry[];
  onDateClick: (date: string) => void;
}

export default function CycleCalendar({ entries, onDateClick }: CycleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
  
  // Hebrew day names
  const dayNames = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
  
  // Create array of days
  const days = [];
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const entry = entries.find(e => e.date === dateStr);
    days.push({ day, dateStr, entry });
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getDayClass = (dayData: any) => {
    if (!dayData) return 'calendar-day empty';
    
    const classes = ['calendar-day'];
    const today = new Date().toDateString();
    const dayDate = new Date(dayData.dateStr).toDateString();
    
    if (dayDate === today) {
      classes.push('today');
    }
    
    if (dayData.entry) {
      if (dayData.entry.is_period) {
        classes.push('period');
        classes.push(`intensity-${dayData.entry.bleeding_intensity}`);
      } else {
        classes.push('no-period');
      }
    }
    
    return classes.join(' ');
  };

  const getDayIcon = (dayData: any) => {
    if (!dayData || !dayData.entry) return null;
    
    if (dayData.entry.is_period) {
      const intensityIcons = {
        light: '🌸',
        medium: '🌺',
        heavy: '🌹'
      };
      return intensityIcons[dayData.entry.bleeding_intensity as keyof typeof intensityIcons];
    }
    
    return '❌';
  };

  return (
    <div className="cycle-calendar">
      {/* Calendar Header */}
      <div className="calendar-header">
        <button 
          className="nav-btn"
          onClick={() => navigateMonth('prev')}
        >
          ←
        </button>
        <h3>
          {currentDate.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}
        </h3>
        <button 
          className="nav-btn"
          onClick={() => navigateMonth('next')}
        >
          →
        </button>
      </div>

      {/* Day Names */}
      <div className="day-names">
        {dayNames.map(dayName => (
          <div key={dayName} className="day-name">
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {days.map((dayData, index) => (
          <div
            key={index}
            className={getDayClass(dayData)}
            onClick={() => dayData && onDateClick(dayData.dateStr)}
          >
            {dayData && (
              <>
                <span className="day-number">{dayData.day}</span>
                {getDayIcon(dayData) && (
                  <span className="day-icon">{getDayIcon(dayData)}</span>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-icon">🌸</span>
          <span>דימום קל</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">🌺</span>
          <span>דימום בינוני</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">🌹</span>
          <span>דימום חזק</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon">❌</span>
          <span>ללא מחזור</span>
        </div>
      </div>
    </div>
  );
}
