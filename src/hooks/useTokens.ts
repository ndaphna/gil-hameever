import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useTokens() {
  const [tokens, setTokens] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadTokens = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        const { data: profile } = await supabase
          .from('user_profile')
          .select('current_tokens')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setTokens(profile.current_tokens || 0);
        } else {
          setTokens(0);
        }
      } else {
        // No authenticated user - set tokens to 0
        setTokens(0);
      }
    } catch (error) {
      console.log('Token loading failed, setting to 0');
      setTokens(0);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTokens = async (newTokens: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_profile')
          .update({ current_tokens: newTokens })
          .eq('id', user.id);
      }
      setTokens(newTokens);
      
      // Dispatch custom event for other components to listen
      window.dispatchEvent(new CustomEvent('tokensUpdated', { 
        detail: { tokens: newTokens } 
      }));
    } catch (error) {
      console.error('Failed to update tokens:', error);
    }
  };

  const decrementTokens = async (amount: number) => {
    const newTokens = Math.max(0, tokens - amount);
    await updateTokens(newTokens);
  };

  useEffect(() => {
    loadTokens();
    
    // Listen for token updates from other components
    const handleTokensUpdate = (event: CustomEvent) => {
      console.log('🎯 Hook received token update:', event.detail.tokens);
      setTokens(event.detail.tokens);
    };
    
    window.addEventListener('tokensUpdated', handleTokensUpdate as EventListener);
    
    return () => {
      window.removeEventListener('tokensUpdated', handleTokensUpdate as EventListener);
    };
  }, []);

  return {
    tokens,
    isLoading,
    updateTokens,
    decrementTokens,
    loadTokens
  };
}
