import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useTokens() {
  const [tokens, setTokens] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadTokens = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('🔐 No authenticated user, setting tokens to 0');
        setTokens(0);
        setIsLoading(false);
        return;
      }

      console.log('🔍 Loading tokens for user:', user.id);
      
      // Get access token from Supabase session for API call
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      
      // Try using API endpoint first (bypasses RLS)
      try {
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        
        if (accessToken) {
          headers['Authorization'] = `Bearer ${accessToken}`;
        }
        
        const response = await fetch('/api/user/profile', {
          credentials: 'include', // Include cookies for authentication
          headers
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('📦 Full API response:', data);
          const { profile } = data;
          
          if (profile) {
            // Use current_tokens as primary source, fallback to tokens_remaining for backward compatibility
            const tokens = profile.current_tokens ?? profile.tokens_remaining ?? 0;
            console.log('✅ Tokens loaded from API:', { 
              current_tokens: profile.current_tokens, 
              tokens_remaining: profile.tokens_remaining,
              final: tokens,
              profileKeys: Object.keys(profile)
            });
            setTokens(tokens);
            
            // Dispatch event to update all components
            window.dispatchEvent(new CustomEvent('tokensUpdated', { 
              detail: { tokens } 
            }));
            
            // Sync both fields if they differ (fix any inconsistencies, handle null values)
            const currentTokensValue = profile.current_tokens ?? null;
            const tokensRemainingValue = profile.tokens_remaining ?? null;
            if (currentTokensValue !== tokensRemainingValue) {
              console.log('🔄 Syncing token fields:', { currentTokensValue, tokensRemainingValue });
              await supabase
                .from('user_profile')
                .update({ 
                  current_tokens: tokens,
                  tokens_remaining: tokens
                })
                .eq('id', user.id);
            }
            setIsLoading(false);
            return;
          }
        } else {
          console.warn('⚠️ API endpoint returned error:', response.status);
        }
      } catch (apiError) {
        console.warn('⚠️ API endpoint failed, trying direct query:', apiError);
      }

      // Fallback to direct query (may fail due to RLS)
      const { data: profile, error: queryError } = await supabase
        .from('user_profile')
        .select('current_tokens, tokens_remaining')
        .eq('id', user.id)
        .single();
      
      if (queryError) {
        console.error('❌ Direct query failed:', queryError);
        setTokens(0);
        setIsLoading(false);
        return;
      }
      
      if (profile) {
        // Use current_tokens as primary source, fallback to tokens_remaining for backward compatibility
        const tokens = profile.current_tokens ?? profile.tokens_remaining ?? 0;
        console.log('✅ Tokens loaded from direct query:', { 
          current_tokens: profile.current_tokens, 
          tokens_remaining: profile.tokens_remaining,
          final: tokens 
        });
        setTokens(tokens);
        
        // Dispatch event to update all components
        window.dispatchEvent(new CustomEvent('tokensUpdated', { 
          detail: { tokens } 
        }));
        
        // Sync both fields if they differ (fix any inconsistencies, handle null values)
        const currentTokensValue = profile.current_tokens ?? null;
        const tokensRemainingValue = profile.tokens_remaining ?? null;
        if (currentTokensValue !== tokensRemainingValue) {
          console.log('🔄 Syncing token fields:', { currentTokensValue, tokensRemainingValue });
          await supabase
            .from('user_profile')
            .update({ 
              current_tokens: tokens,
              tokens_remaining: tokens
            })
            .eq('id', user.id);
        }
      } else {
        console.warn('⚠️ Profile not found, setting tokens to 0');
        setTokens(0);
        // Dispatch event even for 0 tokens
        window.dispatchEvent(new CustomEvent('tokensUpdated', { 
          detail: { tokens: 0 } 
        }));
      }
    } catch (error) {
      console.error('❌ Token loading failed:', error);
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
          .update({ 
            tokens_remaining: newTokens,
            current_tokens: newTokens 
          })
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
