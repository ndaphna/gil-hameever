'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { LowBalanceWarning } from '@/components/token/LowBalanceWarning';
import { TOKEN_ACTION_TYPES } from '@/config/token-engine';
import './page.css';

interface TokenHistoryEntry {
  id: string;
  action_type: string;
  openai_tokens: number;
  tokens_deducted: number;
  tokens_before: number;
  tokens_after: number;
  token_multiplier: number;
  description: string;
  metadata: any;
  created_at: string;
}

export default function TokenHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<TokenHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'tokens'>('date');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadTokenHistory();
      loadCurrentBalance();
    }
  }, [user]);

  const loadTokenHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/token-history?userId=${user?.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to load token history');
      }
      
      const data = await response.json();
      setHistory(data.history || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentBalance = async () => {
    try {
      const response = await fetch('/api/user/profile');
      
      if (response.ok) {
        const data = await response.json();
        setCurrentBalance(data.profile?.current_tokens || 0);
      }
    } catch (err) {
      console.error('Failed to load current balance:', err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="token-history-page">
        <div className="container">
          <div className="loading">טוען היסטוריה...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="token-history-page">
        <div className="container">
          <div className="error">שגיאה: {error}</div>
        </div>
      </div>
    );
  }

  // Filter and sort history
  let filteredHistory = history;
  
  if (filter !== 'all') {
    filteredHistory = history.filter(entry => {
      if (filter === 'ai_usage') {
        return !['refill', 'subscription_renewal', 'manual_adjustment'].includes(entry.action_type);
      }
      return entry.action_type === filter;
    });
  }

  if (sortBy === 'tokens') {
    filteredHistory = [...filteredHistory].sort((a, b) => b.tokens_deducted - a.tokens_deducted);
  }

  // Calculate statistics
  const totalDeducted = history
    .filter(e => e.tokens_deducted > 0)
    .reduce((sum, e) => sum + e.tokens_deducted, 0);
  
  const totalRefilled = history
    .filter(e => e.tokens_deducted < 0)
    .reduce((sum, e) => sum + Math.abs(e.tokens_deducted), 0);

  const actionCounts = history.reduce((acc, entry) => {
    acc[entry.action_type] = (acc[entry.action_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostUsedAction = Object.entries(actionCounts)
    .sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="token-history-page">
      <div className="container">
        <header className="page-header">
          <h1>היסטוריית טוקנים</h1>
          <p>כל הפעולות שצרכו או הוסיפו טוקנים לחשבון שלך</p>
        </header>

        <LowBalanceWarning balance={currentBalance} />

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-label">יתרה נוכחית</div>
              <div className="stat-value">{currentBalance.toLocaleString()}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-label">סה"כ נוצל</div>
              <div className="stat-value negative">{totalDeducted.toLocaleString()}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">➕</div>
            <div className="stat-content">
              <div className="stat-label">סה"כ מולא</div>
              <div className="stat-value positive">{totalRefilled.toLocaleString()}</div>
            </div>
          </div>

          {mostUsedAction && (
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-label">פעולה מובילה</div>
                <div className="stat-value small">{getActionLabel(mostUsedAction[0])}</div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="filter-group">
            <label>סינון לפי:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">הכל</option>
              <option value="ai_usage">שימוש ב-AI</option>
              <option value={TOKEN_ACTION_TYPES.CHAT_ALIZA}>צ'אט עם עליזה</option>
              <option value={TOKEN_ACTION_TYPES.COMPREHENSIVE_ANALYSIS}>ניתוח מקיף</option>
              <option value={TOKEN_ACTION_TYPES.DAILY_ANALYSIS}>ניתוח יומי</option>
              <option value="refill">מילוי מחדש</option>
            </select>
          </div>

          <div className="filter-group">
            <label>מיון לפי:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as 'date' | 'tokens')}
              className="filter-select"
            >
              <option value="date">תאריך</option>
              <option value="tokens">כמות טוקנים</option>
            </select>
          </div>
        </div>

        {/* History List */}
        <div className="history-list">
          {filteredHistory.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3>אין היסטוריה עדיין</h3>
              <p>כאשר תשתמשי בשירותי ה-AI, הפעולות יופיעו כאן</p>
            </div>
          ) : (
            filteredHistory.map((entry) => (
              <div key={entry.id} className="history-entry">
                <div className="entry-icon">
                  {getActionIcon(entry.action_type)}
                </div>
                
                <div className="entry-content">
                  <div className="entry-header">
                    <h3 className="entry-title">{getActionLabel(entry.action_type)}</h3>
                    <span className="entry-date">
                      {new Date(entry.created_at).toLocaleDateString('he-IL', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  {entry.description && (
                    <p className="entry-description">{entry.description}</p>
                  )}
                  
                  <div className="entry-details">
                    {entry.openai_tokens > 0 && (
                      <span className="detail-badge">
                        OpenAI: {entry.openai_tokens.toLocaleString()}
                      </span>
                    )}
                    <span className="detail-badge">
                      מכפיל: ×{entry.token_multiplier}
                    </span>
                  </div>
                </div>
                
                <div className="entry-tokens">
                  <div className={`tokens-amount ${entry.tokens_deducted > 0 ? 'negative' : 'positive'}`}>
                    {entry.tokens_deducted > 0 ? '-' : '+'}
                    {Math.abs(entry.tokens_deducted).toLocaleString()}
                  </div>
                  <div className="balance-after">
                    יתרה: {entry.tokens_after.toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function getActionLabel(actionType: string): string {
  const labels: Record<string, string> = {
    [TOKEN_ACTION_TYPES.CHAT_ALIZA]: 'שיחה עם עליזה',
    [TOKEN_ACTION_TYPES.CHAT_EXPERT]: 'שיחה עם סוכנת מומחית',
    [TOKEN_ACTION_TYPES.DAILY_ANALYSIS]: 'ניתוח יומי',
    [TOKEN_ACTION_TYPES.COMPREHENSIVE_ANALYSIS]: 'ניתוח מקיף',
    [TOKEN_ACTION_TYPES.SLEEP_ANALYSIS]: 'ניתוח שינה',
    [TOKEN_ACTION_TYPES.SYMPTOMS_ANALYSIS]: 'ניתוח תסמינים',
    [TOKEN_ACTION_TYPES.MOOD_ANALYSIS]: 'ניתוח מצב רוח',
    [TOKEN_ACTION_TYPES.ALIZA_MESSAGE]: 'הודעה מעליזה',
    [TOKEN_ACTION_TYPES.NEWSLETTER_GENERATION]: 'ניוזלטר מותאם',
    [TOKEN_ACTION_TYPES.INSIGHT_GENERATION]: 'יצירת תובנות',
    refill: 'מילוי מחדש',
    subscription_renewal: 'חידוש מנוי',
    manual_adjustment: 'התאמה ידנית',
  };
  
  return labels[actionType] || actionType;
}

function getActionIcon(actionType: string): string {
  const icons: Record<string, string> = {
    [TOKEN_ACTION_TYPES.CHAT_ALIZA]: '💬',
    [TOKEN_ACTION_TYPES.CHAT_EXPERT]: '👩‍⚕️',
    [TOKEN_ACTION_TYPES.DAILY_ANALYSIS]: '📊',
    [TOKEN_ACTION_TYPES.COMPREHENSIVE_ANALYSIS]: '📈',
    [TOKEN_ACTION_TYPES.SLEEP_ANALYSIS]: '😴',
    [TOKEN_ACTION_TYPES.SYMPTOMS_ANALYSIS]: '🩺',
    [TOKEN_ACTION_TYPES.MOOD_ANALYSIS]: '😊',
    [TOKEN_ACTION_TYPES.ALIZA_MESSAGE]: '💌',
    [TOKEN_ACTION_TYPES.NEWSLETTER_GENERATION]: '📰',
    [TOKEN_ACTION_TYPES.INSIGHT_GENERATION]: '💡',
    refill: '💰',
    subscription_renewal: '🔄',
    manual_adjustment: '⚙️',
  };
  
  return icons[actionType] || '📌';
}





