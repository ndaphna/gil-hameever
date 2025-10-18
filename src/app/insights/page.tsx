'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '../components/DashboardLayout';
import './Insights.css';

interface Insight {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  icon: string;
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      // סימולציה של נתונים - במקום אמיתי זה יבוא ממסד הנתונים
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockInsights: Insight[] = [
        {
          id: '1',
          title: 'דפוסי שינה משופרים',
          description: 'תבסס על היומן שלך, זיהיתי ששינה טובה יותר קשורה לפעילות גופנית קלה בערב.',
          category: 'sleep',
          date: '2024-01-15',
          icon: '😴'
        },
        {
          id: '2',
          title: 'הקשר בין תזונה למצב רוח',
          description: 'נראה שיש קשר חיובי בין אכילת ירקות ירוקים לבין שיפור במצב הרוח שלך.',
          category: 'nutrition',
          date: '2024-01-14',
          icon: '🥗'
        },
        {
          id: '3',
          title: 'זמני מתח מוגברים',
          description: 'הזמנים הכי קשים בשבוע הם ימי ראשון ורביעי. כדאי לתכנן פעילויות מרגיעות בימים אלה.',
          category: 'stress',
          date: '2024-01-13',
          icon: '🧘'
        },
        {
          id: '4',
          title: 'השפעת פעילות גופנית',
          description: '30 דקות הליכה יומית משפרת משמעותית את רמת האנרגיה שלך.',
          category: 'exercise',
          date: '2024-01-12',
          icon: '🚶'
        }
      ];
      
      setInsights(mockInsights);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'הכל', icon: '📊' },
    { id: 'sleep', label: 'שינה', icon: '😴' },
    { id: 'nutrition', label: 'תזונה', icon: '🥗' },
    { id: 'stress', label: 'מתח', icon: '🧘' },
    { id: 'exercise', label: 'פעילות גופנית', icon: '🚶' }
  ];

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors = {
      sleep: '#667eea',
      nutrition: '#f093fb',
      stress: '#4facfe',
      exercise: '#43e97b'
    };
    return colors[category as keyof typeof colors] || '#667eea';
  };

  return (
    <DashboardLayout>
      <div className="insights-page">
        <div className="insights-container">
          <div className="insights-header">
            <h1>תובנות עליזה</h1>
            <p className="subtitle">ניתוח AI אישי של הנתונים שלך לגיל המעבר</p>
          </div>

          <div className="insights-filters">
            <h3>קטגוריות</h3>
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-label">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="insights-grid">
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>טוען תובנות...</p>
              </div>
            ) : filteredInsights.length === 0 ? (
              <div className="no-insights">
                <span className="no-insights-icon">📊</span>
                <h3>אין תובנות זמינות</h3>
                <p>התחילי להשתמש ביומן כדי לקבל תובנות אישיות</p>
              </div>
            ) : (
              filteredInsights.map(insight => (
                <div key={insight.id} className="insight-card">
                  <div 
                    className="insight-header"
                    style={{ backgroundColor: getCategoryColor(insight.category) }}
                  >
                    <span className="insight-icon">{insight.icon}</span>
                    <div className="insight-meta">
                      <span className="insight-category">
                        {categories.find(c => c.id === insight.category)?.label}
                      </span>
                      <span className="insight-date">
                        {new Date(insight.date).toLocaleDateString('he-IL')}
                      </span>
                    </div>
                  </div>
                  <div className="insight-content">
                    <h3 className="insight-title">{insight.title}</h3>
                    <p className="insight-description">{insight.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
