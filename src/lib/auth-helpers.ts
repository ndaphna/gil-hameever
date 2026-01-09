import { supabase } from './supabase';

/**
 * Helper function to wait for Supabase session to be ready
 * with retry mechanism to handle race conditions
 */
export async function waitForSession(maxRetries = 3, delayMs = 300): Promise<{ user: any; session: any } | null> {
  const startTime = Date.now();
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const attemptStart = Date.now();
    try {
      // First try getSession (more reliable for initial load)
      const sessionPromise = supabase.auth.getSession();
      const { data: { session }, error: sessionError } = await sessionPromise;
      const sessionTime = Date.now() - attemptStart;
      
      if (session?.user && !sessionError) {
        const totalTime = Date.now() - startTime;
        console.log(`✅ Session ready on attempt ${attempt} (${sessionTime}ms, total: ${totalTime}ms)`);
        return { user: session.user, session };
      }

      // If no session, try getUser as fallback (but only if getSession didn't return an error)
      if (!sessionError) {
        const userPromise = supabase.auth.getUser();
        const { data: { user }, error: userError } = await userPromise;
        const userTime = Date.now() - attemptStart;
        
        if (user && !userError) {
          const totalTime = Date.now() - startTime;
          console.log(`✅ User found via getUser on attempt ${attempt} (${userTime}ms, total: ${totalTime}ms)`);
          return { user, session: null };
        }
        
        if (userError) {
          console.warn(`⚠️ getUser error on attempt ${attempt}:`, userError.message);
        }
      } else {
        console.warn(`⚠️ getSession error on attempt ${attempt}:`, sessionError.message);
      }

      // If both failed and we have retries left, wait and retry
      if (attempt < maxRetries) {
        console.log(`⏳ Session not ready, retrying in ${delayMs}ms (attempt ${attempt}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        // Exponential backoff, but cap at 1000ms for faster retries
        delayMs = Math.min(delayMs * 1.5, 1000);
      } else {
        const totalTime = Date.now() - startTime;
        console.warn(`❌ Failed to get session after ${maxRetries} attempts (total: ${totalTime}ms)`);
        return null;
      }
    } catch (error) {
      const attemptTime = Date.now() - attemptStart;
      console.error(`❌ Error on attempt ${attempt} (${attemptTime}ms):`, error);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
        delayMs = Math.min(delayMs * 1.5, 1000);
      } else {
        const totalTime = Date.now() - startTime;
        console.error(`❌ Failed after ${maxRetries} attempts (total: ${totalTime}ms)`);
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


























