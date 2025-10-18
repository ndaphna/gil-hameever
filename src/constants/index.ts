/* ============================================
   CONSTANTS - Application Constants
   ============================================ */

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  CHAT: {
    SEND: '/chat',
    CONVERSATIONS: '/chat/conversations',
    MESSAGES: '/chat/messages',
  },
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    AVATAR: '/profile/avatar',
  },
  JOURNAL: {
    ENTRIES: '/journal',
    EMOTIONS: '/journal/emotions',
    ANALYTICS: '/journal/analytics',
  },
  SUBSCRIPTION: {
    PLANS: '/subscription/plans',
    CURRENT: '/subscription/current',
    UPGRADE: '/subscription/upgrade',
    CANCEL: '/subscription/cancel',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/read',
    SETTINGS: '/notifications/settings',
  },
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'מנופאוזית וטוב לה',
  VERSION: '1.0.0',
  DESCRIPTION: 'פלטפורמה דיגיטלית לתמיכה בנשים בגיל המעבר',
  SUPPORT_EMAIL: 'support@menopause.co.il',
  PRIVACY_POLICY: '/privacy',
  TERMS_OF_SERVICE: '/terms',
} as const;

// Feature Flags
export const FEATURES = {
  CHAT: true,
  JOURNAL: true,
  ANALYTICS: true,
  SUBSCRIPTIONS: true,
  NOTIFICATIONS: true,
  DARK_MODE: true,
  MULTI_LANGUAGE: false,
} as const;

// Subscription Plans
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'חינם',
    price: 0,
    tokens: 50,
    features: [
      '50 טוקנים חודשיים',
      'יומן רגשות בסיסי',
      'תמיכה בדוא"ל',
    ],
  },
  PREMIUM: {
    id: 'premium',
    name: 'פרימיום',
    price: 49,
    tokens: 500,
    features: [
      '500 טוקנים חודשיים',
      'יומן רגשות מתקדם',
      'תובנות AI אישיות',
      'תמיכה עדיפות',
      'גיבוי אוטומטי',
    ],
    popular: true,
  },
  PRO: {
    id: 'pro',
    name: 'מקצועי',
    price: 99,
    tokens: 1500,
    features: [
      '1500 טוקנים חודשיים',
      'כל התכונות של פרימיום',
      'ייעוץ אישי עם מומחים',
      'דוחות מפורטים',
      'תמיכה טלפונית',
    ],
  },
} as const;

// Emotion Types
export const EMOTION_TYPES = {
  HAPPY: {
    value: 'happy',
    label: 'שמחה',
    color: '#F59E0B',
    emoji: '😊',
  },
  SAD: {
    value: 'sad',
    label: 'עצב',
    color: '#3B82F6',
    emoji: '😢',
  },
  ANGRY: {
    value: 'angry',
    label: 'כעס',
    color: '#EF4444',
    emoji: '😠',
  },
  ANXIOUS: {
    value: 'anxious',
    label: 'חרדה',
    color: '#8B5CF6',
    emoji: '😰',
  },
  CALM: {
    value: 'calm',
    label: 'רגועה',
    color: '#10B981',
    emoji: '😌',
  },
  EXCITED: {
    value: 'excited',
    label: 'התרגשות',
    color: '#F97316',
    emoji: '🤩',
  },
  TIRED: {
    value: 'tired',
    label: 'עייפות',
    color: '#6B7280',
    emoji: '😴',
  },
  STRESSED: {
    value: 'stressed',
    label: 'לחץ',
    color: '#DC2626',
    emoji: '😫',
  },
} as const;

// Journal Entry Types
export const JOURNAL_TYPES = {
  DAILY: 'daily',
  EMOTION: 'emotion',
  SYMPTOM: 'symptom',
  ACTIVITY: 'activity',
  REFLECTION: 'reflection',
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  SYSTEM: 'system',
  REMINDER: 'reminder',
  ACHIEVEMENT: 'achievement',
  SUBSCRIPTION: 'subscription',
  SECURITY: 'security',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
  TIME: 'HH:mm',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+972|0)([23489]|5[012345689]|77)[0-9]{7}$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: false,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'שגיאת רשת. אנא בדקו את החיבור לאינטרנט.',
  AUTH: {
    INVALID_CREDENTIALS: 'פרטי התחברות שגויים.',
    EMAIL_EXISTS: 'כתובת האימייל כבר רשומה במערכת.',
    WEAK_PASSWORD: 'הסיסמה חלשה מדי. אנא בחרו סיסמה חזקה יותר.',
    USER_NOT_FOUND: 'משתמש לא נמצא.',
    SESSION_EXPIRED: 'הפגישה פגה. אנא התחברו מחדש.',
  },
  CHAT: {
    NO_TOKENS: 'אין לכם טוקנים זמינים. אנא רכשו טוקנים נוספים.',
    MESSAGE_TOO_LONG: 'ההודעה ארוכה מדי.',
    RATE_LIMIT: 'שלחתם יותר מדי הודעות. אנא המתינו מעט.',
  },
  JOURNAL: {
    ENTRY_NOT_FOUND: 'רשומה לא נמצאה.',
    INVALID_DATE: 'תאריך לא תקין.',
    SAVE_FAILED: 'שמירת הרשומה נכשלה.',
  },
  SUBSCRIPTION: {
    PAYMENT_FAILED: 'תשלום נכשל.',
    PLAN_NOT_AVAILABLE: 'התוכנית לא זמינה.',
    ALREADY_SUBSCRIBED: 'אתם כבר רשומים לתוכנית זו.',
  },
  GENERAL: {
    REQUIRED_FIELD: 'שדה חובה.',
    INVALID_FORMAT: 'פורמט לא תקין.',
    UNAUTHORIZED: 'אין לכם הרשאה לבצע פעולה זו.',
    NOT_FOUND: 'המשאב המבוקש לא נמצא.',
    SERVER_ERROR: 'שגיאת שרת. אנא נסו שוב מאוחר יותר.',
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'הפרופיל עודכן בהצלחה.',
  JOURNAL_SAVED: 'הרשומה נשמרה בהצלחה.',
  SUBSCRIPTION_UPDATED: 'המנוי עודכן בהצלחה.',
  SETTINGS_SAVED: 'ההגדרות נשמרו בהצלחה.',
  MESSAGE_SENT: 'ההודעה נשלחה בהצלחה.',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  LAST_ACTIVITY: 'last_activity',
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CHAT: '/chat',
  JOURNAL: '/journal',
  INSIGHTS: '/insights',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  PRICING: '/pricing',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

