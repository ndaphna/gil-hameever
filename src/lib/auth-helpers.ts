import { supabase } from './supabase';

/**
 * Helper function to wait for Supabase session to be ready
 * with retry mechanism to handle race conditions
 */
export async function waitForSession(maxRetries = 5, delayMs = 500): Promise<{ user: any; session: any } | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // First try getSession (more reliable for initial load)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (session?.user && !sessionError) {
        console.log(`✅ Session ready on attempt ${attempt}`);
        return { user: session.user, session };
      }

      // If no session, try getUser as fallback
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (user && !userError) {
        console.log(`✅ User found via getUser on attempt ${attempt}`);
        return { user, session: null };
      }

      // If both failed and we have retries left, wait and retry
      if (attempt < maxRetries) {
        console.log(`⏳ Session not ready, retrying in ${delayMs}ms (attempt ${attempt}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        // Exponential backoff
        delayMs = Math.min(delayMs * 1.5, 2000);
      } else {
        console.warn(`❌ Failed to get session after ${maxRetries} attempts`);
        return null;
      }
    } catch (error) {
      console.error(`Error on attempt ${attempt}:`, error);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        delayMs = Math.min(delayMs * 1.5, 2000);
      } else {
        return null;
      }
    }
  }

  return null;
}

/**
 * Load user profile with retry mechanism
 */
export async function loadUserProfileWithRetry(
  userId: string,
  maxRetries = 3,
  delayMs = 300
): Promise<any | null> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { data: profileData, error } = await supabase
        .from('user_profile')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData && !error) {
        return profileData;
      }

      if (error && attempt < maxRetries) {
        console.log(`⏳ Profile load failed, retrying in ${delayMs}ms (attempt ${attempt}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        delayMs = Math.min(delayMs * 1.5, 1000);
      } else {
        console.error('Failed to load profile:', error);
        return null;
      }
    } catch (error) {
      console.error(`Error loading profile on attempt ${attempt}:`, error);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        delayMs = Math.min(delayMs * 1.5, 1000);
      } else {
        return null;
      }
    }
  }

  return null;
}





