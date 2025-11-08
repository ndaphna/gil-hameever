'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, UserProfile } from '@/types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isAdmin: false,
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
          setState(prev => ({ ...prev, loading: false, isAdmin: false }));
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
            isAdmin: false,
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

      // Get user from auth
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        setState(prev => ({ 
          ...prev, 
          error: authError?.message || 'User not found', 
          loading: false 
        }));
        return;
      }

      // Load user profile via API route (bypasses RLS issues)
      const profileResponse = await fetch('/api/user/profile', {
        credentials: 'include'
      });
      
      if (!profileResponse.ok) {
        // If profile doesn't exist (404), try to create it
        if (profileResponse.status === 404) {
          try {
            await fetch('/api/create-profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: authUser.id,
                email: authUser.email || '',
                name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'משתמשת',
              }),
            });

            // Retry loading profile
            const retryResponse = await fetch('/api/user/profile', {
              credentials: 'include'
            });
            if (!retryResponse.ok) {
              setState(prev => ({ 
                ...prev, 
                error: 'Failed to create profile', 
                loading: false 
              }));
              return;
            }

            const retryData = await retryResponse.json();
            const newProfile = retryData.profile;

            setState({
              user: {
                id: authUser.id,
                email: authUser.email || '',
                full_name: newProfile.full_name || authUser.email?.split('@')[0] || 'משתמשת',
                created_at: authUser.created_at,
                updated_at: authUser.updated_at || authUser.created_at
              },
              profile: newProfile,
              isAdmin: retryData.isAdmin === true,
              loading: false,
              error: null
            });
            return;
          } catch (createError) {
            setState(prev => ({ 
              ...prev, 
              error: 'Failed to create profile', 
              loading: false 
            }));
            return;
          }
        } else {
          setState(prev => ({ 
            ...prev, 
            error: 'Failed to load profile', 
            loading: false 
          }));
          return;
        }
      }

      const profileData = await profileResponse.json();
      const profile = profileData.profile;

      setState({
        user: {
          id: authUser.id,
          email: authUser.email || '',
          full_name: profile.full_name || authUser.email?.split('@')[0] || 'משתמשת',
          created_at: authUser.created_at,
          updated_at: authUser.updated_at || authUser.created_at
        },
        profile,
        isAdmin: profileData.isAdmin === true,
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


