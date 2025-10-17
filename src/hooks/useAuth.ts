'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, UserProfile } from '@/types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          setState(prev => ({ ...prev, error: error.message, loading: false }));
          return;
        }

        if (session?.user) {
          await loadUserData(session.user.id);
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          error: 'Failed to get session', 
          loading: false 
        }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            profile: null,
            loading: false,
            error: null
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Load user data
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) {
        setState(prev => ({ 
          ...prev, 
          error: userError.message, 
          loading: false 
        }));
        return;
      }

      // Load user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profile')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        setState(prev => ({ 
          ...prev, 
          error: profileError.message, 
          loading: false 
        }));
        return;
      }

      setState({
        user,
        profile,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to load user data', 
        loading: false 
      }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setState(prev => ({ 
          ...prev, 
          error: error.message, 
          loading: false 
        }));
        return false;
      }

      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Sign in failed', 
        loading: false 
      }));
      return false;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        setState(prev => ({ 
          ...prev, 
          error: error.message, 
          loading: false 
        }));
        return false;
      }

      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Sign up failed', 
        loading: false 
      }));
      return false;
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setState(prev => ({ 
          ...prev, 
          error: error.message, 
          loading: false 
        }));
        return false;
      }

      setState({
        user: null,
        profile: null,
        loading: false,
        error: null
      });

      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Sign out failed', 
        loading: false 
      }));
      return false;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!state.user) return false;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase
        .from('user_profile')
        .update(updates)
        .eq('id', state.user.id);

      if (error) {
        setState(prev => ({ 
          ...prev, 
          error: error.message, 
          loading: false 
        }));
        return false;
      }

      // Reload user data
      await loadUserData(state.user.id);
      return true;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Update failed', 
        loading: false 
      }));
      return false;
    }
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    updateProfile
  };
}
