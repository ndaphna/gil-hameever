'use client';

import { supabase } from './supabase';

// Helper to get auth token
async function getAuthToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

// Check if current user is admin
export async function checkAdminStatus(): Promise<boolean> {
  try {
    const token = await getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/admin/check-admin', {
      headers
    });

    if (!response.ok) return false;

    const data = await response.json();
    return data.isAdmin === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Get all users (admin only)
export async function getUsers(page: number = 1, limit: number = 50, search: string = '') {
  try {
    const token = await getAuthToken();
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/admin/get-users?${params}`, {
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch users');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Update user (admin only)
export async function updateUser(userId: string, updates: Partial<any>) {
  try {
    const token = await getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/admin/update-user', {
      method: 'PUT',
      headers,
      body: JSON.stringify({ userId, updates })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Get system statistics (admin only)
export async function getSystemStats() {
  try {
    const token = await getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/admin/system-stats', {
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching system stats:', error);
    throw error;
  }
}

// Create new user (admin only)
export async function createUser(userData: {
  email: string;
  password: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  subscription_tier?: string;
  subscription_status?: string;
  tokens?: number;
  newsletter_interval_days?: number;
}) {
  try {
    const token = await getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers,
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Get user notification preferences (admin only)
export async function getUserNotificationPreferences(userId: string) {
  try {
    const token = await getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/admin/user-preferences?userId=${userId}`, {
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch preferences');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching preferences:', error);
    throw error;
  }
}

// Update user notification preferences (admin only)
export async function updateUserNotificationPreferences(userId: string, preferences: any) {
  try {
    const token = await getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/admin/update-user-preferences', {
      method: 'PUT',
      headers,
      body: JSON.stringify({ userId, preferences })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update preferences');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
}