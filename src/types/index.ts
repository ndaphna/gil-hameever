/* ============================================
   TYPES - Centralized Type Definitions
   ============================================ */

// User Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  current_tokens: number;
  subscription_tier: 'free' | 'premium' | 'pro';
  subscription_status: 'active' | 'inactive' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  conversation_id: string;
  content: string;
  is_user: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

// Journal Types
export interface EmotionEntry {
  id: string;
  user_id: string;
  date: string;
  emotion: string;
  intensity: number;
  color: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  content: string;
  mood: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface SignupForm {
  email: string;
  password: string;
  full_name: string;
}

export interface ProfileForm {
  full_name: string;
  email: string;
}

// UI Component Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'base' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Navigation Types
export interface MenuItem {
  href: string;
  icon: string;
  label: string;
  description: string;
  isActive?: boolean;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Dashboard Types
export interface DashboardStats {
  totalTokens: number;
  usedTokens: number;
  remainingTokens: number;
  lastActivity: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Subscription Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  tokens: number;
  features: string[];
  popular?: boolean;
}

export interface BillingInfo {
  plan: SubscriptionPlan;
  status: 'active' | 'inactive' | 'cancelled';
  nextBillingDate?: string;
  paymentMethod?: string;
}

// Analytics Types
export interface AnalyticsData {
  date: string;
  value: number;
  label?: string;
}

export interface UserAnalytics {
  totalSessions: number;
  averageSessionTime: number;
  mostUsedFeature: string;
  weeklyActivity: AnalyticsData[];
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

// Search Types
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'conversation' | 'journal' | 'insight';
  created_at: string;
}

// Settings Types
export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
    dataSharing: boolean;
  };
  preferences: {
    language: 'he' | 'en';
    theme: Theme;
    timezone: string;
  };
}


