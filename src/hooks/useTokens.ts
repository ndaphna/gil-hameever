import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * useTokens — exposes the two wallet balances (chat + analysis).
 *
 * Returns:
 *   chatCredits     — credits available for Aliza conversations
 *   analysisCredits — credits available for journal analyses & PDF reports
 *   tokens          — combined balance (chat + analysis) for legacy displays
 *
 * The sidebar and profile page still read `tokens`. Phase 2 will switch to
 * the dual counter and `tokens` can be deprecated then.
 */

interface TokensState {
  chatCredits: number;
  analysisCredits: number;
}

export function useTokens() {
  const [state, setState] = useState<TokensState>({ chatCredits: 0, analysisCredits: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const loadTokens = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        setState({ chatCredits: 0, analysisCredits: 0 });
        setIsLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      const response = await fetch('/api/user/profile', { credentials: 'include', headers });
      if (!response.ok) {
        console.warn('⚠️ Profile API returned', response.status);
        setState({ chatCredits: 0, analysisCredits: 0 });
        setIsLoading(false);
        return;
      }

      const { profile } = (await response.json()) as {
        profile?: { chat_credits?: number; analysis_credits?: number };
      };

      const chat = profile?.chat_credits ?? 0;
      const analysis = profile?.analysis_credits ?? 0;
      setState({ chatCredits: chat, analysisCredits: analysis });

      window.dispatchEvent(new CustomEvent('tokensUpdated', {
        detail: { chatCredits: chat, analysisCredits: analysis, tokens: chat + analysis },
      }));
    } catch (err) {
      console.error('❌ Token loading failed:', err);
      setState({ chatCredits: 0, analysisCredits: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update local display from a trusted server-provided value.
   * Caller is responsible for only passing post-deduction balances they got
   * back from the API on a successful (resp.ok) response.
   */
  const updateChatCredits = (newValue: number) => {
    setState(prev => {
      const next = { ...prev, chatCredits: newValue };
      window.dispatchEvent(new CustomEvent('tokensUpdated', {
        detail: { ...next, tokens: next.chatCredits + next.analysisCredits },
      }));
      return next;
    });
  };

  const updateAnalysisCredits = (newValue: number) => {
    setState(prev => {
      const next = { ...prev, analysisCredits: newValue };
      window.dispatchEvent(new CustomEvent('tokensUpdated', {
        detail: { ...next, tokens: next.chatCredits + next.analysisCredits },
      }));
      return next;
    });
  };

  useEffect(() => {
    loadTokens();

    const handleUpdate = (event: Event) => {
      const detail = (event as CustomEvent).detail as Partial<TokensState> | undefined;
      if (!detail) return;
      setState(prev => ({
        chatCredits: detail.chatCredits ?? prev.chatCredits,
        analysisCredits: detail.analysisCredits ?? prev.analysisCredits,
      }));
    };

    window.addEventListener('tokensUpdated', handleUpdate);
    return () => window.removeEventListener('tokensUpdated', handleUpdate);
  }, []);

  const tokens = state.chatCredits + state.analysisCredits;

  return {
    chatCredits: state.chatCredits,
    analysisCredits: state.analysisCredits,
    tokens,
    isLoading,
    updateChatCredits,
    updateAnalysisCredits,
    /** Back-compat: legacy callers update the combined display. Prefer updateChat/AnalysisCredits. */
    updateTokens: updateChatCredits,
    loadTokens,
  };
}
