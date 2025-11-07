import { supabase } from './supabase';
import { ApiResponse, PaginatedResponse } from '@/types';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Chat API
  async sendMessage(message: string, conversationId?: string, userId?: string) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        conversationId,
        userId,
      }),
    });
  }

  // User Profile API
  async getProfile(userId: string) {
    return this.request(`/profile/${userId}`);
  }

  async updateProfile(userId: string, updates: Record<string, unknown>) {
    return this.request(`/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Journal API
  async getJournalEntries(userId: string, page = 1, limit = 10) {
    return this.request(`/journal/${userId}?page=${page}&limit=${limit}`);
  }

  async createJournalEntry(userId: string, entry: Record<string, unknown>) {
    return this.request('/journal', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        ...entry,
      }),
    });
  }

  async updateJournalEntry(entryId: string, updates: Record<string, unknown>) {
    return this.request(`/journal/${entryId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteJournalEntry(entryId: string) {
    return this.request(`/journal/${entryId}`, {
      method: 'DELETE',
    });
  }

  // Emotion Entries API
  async getEmotionEntries(userId: string, date?: string) {
    const params = new URLSearchParams({ userId });
    if (date) params.append('date', date);
    
    return this.request(`/emotions?${params}`);
  }

  async createEmotionEntry(userId: string, entry: Record<string, unknown>) {
    return this.request('/emotions', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        ...entry,
      }),
    });
  }

  // Analytics API
  async getAnalytics(userId: string, period: 'week' | 'month' | 'year' = 'month') {
    return this.request(`/analytics/${userId}?period=${period}`);
  }

  // Subscription API
  async getSubscription(userId: string) {
    return this.request(`/subscription/${userId}`);
  }

  async updateSubscription(userId: string, planId: string) {
    return this.request('/subscription', {
      method: 'PUT',
      body: JSON.stringify({
        userId,
        planId,
      }),
    });
  }

  // Search API
  async search(userId: string, query: string, type?: string) {
    const params = new URLSearchParams({ userId, query });
    if (type) params.append('type', type);
    
    return this.request(`/search?${params}`);
  }

  // Notifications API
  async getNotifications(userId: string) {
    return this.request(`/notifications/${userId}`);
  }

  async markNotificationRead(notificationId: string) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  // Settings API
  async getSettings(userId: string) {
    return this.request(`/settings/${userId}`);
  }

  async updateSettings(userId: string, settings: Record<string, unknown>) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify({
        userId,
        ...settings,
      }),
    });
  }
}

// Export singleton instance
export const api = new ApiClient();

// Export individual methods for convenience
export const {
  sendMessage,
  getProfile,
  updateProfile,
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  getEmotionEntries,
  createEmotionEntry,
  getAnalytics,
  getSubscription,
  updateSubscription,
  search,
  getNotifications,
  markNotificationRead,
  getSettings,
  updateSettings,
} = api;


