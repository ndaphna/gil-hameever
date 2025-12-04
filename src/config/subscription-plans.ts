/**
 * Subscription Plans Configuration
 * 
 * This file defines all subscription tiers, their token allocations,
 * features, and pricing.
 * 
 * All subscription logic must reference these definitions.
 */

/**
 * Subscription Tier Type
 */
export type SubscriptionTier = 'free' | 'basic' | 'plus' | 'pro';

/**
 * Subscription Plan Interface
 */
export interface SubscriptionPlan {
  /** Unique identifier for the plan */
  id: SubscriptionTier;
  
  /** Display name in Hebrew */
  nameHebrew: string;
  
  /** Display name in English */
  nameEnglish: string;
  
  /** Monthly token allocation */
  monthlyTokens: number;
  
  /** Token refresh frequency in days */
  refreshFrequency: number;
  
  /** Price in ILS (Israeli Shekel) */
  priceILS: number;
  
  /** Price in USD */
  priceUSD: number;
  
  /** Features included in this plan */
  features: {
    /** Access to Aliza chat */
    alizaChat: boolean;
    
    /** Access to expert agent */
    expertAgent: boolean;
    
    /** Daily analysis */
    dailyAnalysis: boolean;
    
    /** Weekly insights */
    weeklyInsights: boolean;
    
    /** Monthly reports */
    monthlyReports: boolean;
    
    /** Personalized newsletters */
    newsletters: boolean;
    
    /** File analysis (PDF, text) */
    fileAnalysis: boolean;
    
    /** Priority support */
    prioritySupport: boolean;
    
    /** Custom features for this tier */
    customFeatures: string[];
  };
  
  /** Marketing description */
  descriptionHebrew: string;
  descriptionEnglish: string;
  
  /** Target audience */
  targetAudience: string;
  
  /** Recommended for badge/label */
  recommended?: boolean;
  
  /** Most popular badge/label */
  popular?: boolean;
}

/**
 * All Available Subscription Plans
 * 
 * IMPORTANT: Keep these synchronized with:
 * - Database subscription tier enum
 * - Payment provider (Cardcom) plan IDs
 * - Marketing materials
 */
export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  free: {
    id: 'free',
    nameHebrew: 'חינם',
    nameEnglish: 'Free',
    monthlyTokens: 30,  // ~20-30 requests to Aliza
    refreshFrequency: 30,
    priceILS: 0,
    priceUSD: 0,
    features: {
      alizaChat: true,
      expertAgent: false,
      dailyAnalysis: false,
      weeklyInsights: false,
      monthlyReports: false,
      newsletters: false,
      fileAnalysis: false,
      prioritySupport: false,
      customFeatures: [
        'גישה לעליזה בלבד',
        'מוגבל לשיחות בסיסיות',
        'ללא ניתוח אוטומטי'
      ]
    },
    descriptionHebrew: 'תכנית היכרות - נסי את עליזה ותגלי איך היא יכולה לעזור לך',
    descriptionEnglish: 'Intro tier - Try Aliza and discover how she can help you',
    targetAudience: 'New users exploring the platform',
    recommended: false,
    popular: false,
  },
  
  basic: {
    id: 'basic',
    nameHebrew: 'בסיס',
    nameEnglish: 'Basic',
    monthlyTokens: 60000,
    refreshFrequency: 30,
    priceILS: 49,
    priceUSD: 15,
    features: {
      alizaChat: true,
      expertAgent: false,
      dailyAnalysis: true,
      weeklyInsights: true,
      monthlyReports: false,
      newsletters: true,
      fileAnalysis: false,
      prioritySupport: false,
      customFeatures: [
        'שיחות ללא הגבלה עם עליזה',
        'ניתוח יומי אוטומטי',
        'תובנות שבועיות',
        'ניוזלטר מותאם אישית'
      ]
    },
    descriptionHebrew: 'מושלם למשתמשת שרוצה תמיכה יומית ותובנות רגילות',
    descriptionEnglish: 'Perfect for users who want daily support and regular insights',
    targetAudience: 'Regular users needing consistent support',
    recommended: false,
    popular: false,
  },
  
  plus: {
    id: 'plus',
    nameHebrew: 'פלוס',
    nameEnglish: 'Plus',
    monthlyTokens: 150000,
    refreshFrequency: 30,
    priceILS: 99,
    priceUSD: 30,
    features: {
      alizaChat: true,
      expertAgent: true,
      dailyAnalysis: true,
      weeklyInsights: true,
      monthlyReports: true,
      newsletters: true,
      fileAnalysis: true,
      prioritySupport: false,
      customFeatures: [
        'גישה לסוכנת המומחית',
        'ניתוח קבצים ומסמכים',
        'דוחות חודשיים מפורטים',
        'כל התכונות בבסיס +'
      ]
    },
    descriptionHebrew: 'הכי פופולרי! גישה מלאה לכל התכונות כולל סוכנת מומחית',
    descriptionEnglish: 'Most popular! Full access to all features including expert agent',
    targetAudience: 'Power users who want comprehensive support',
    recommended: true,
    popular: true,
  },
  
  pro: {
    id: 'pro',
    nameHebrew: 'מקצועי',
    nameEnglish: 'Pro',
    monthlyTokens: 400000,
    refreshFrequency: 30,
    priceILS: 199,
    priceUSD: 60,
    features: {
      alizaChat: true,
      expertAgent: true,
      dailyAnalysis: true,
      weeklyInsights: true,
      monthlyReports: true,
      newsletters: true,
      fileAnalysis: true,
      prioritySupport: true,
      customFeatures: [
        'שימוש אינטנסיבי ללא דאגות',
        'תמיכה עדיפה',
        'מתאים למאמנות ומטפלות',
        'API access (בקרוב)',
        'אינטגרציות מתקדמות'
      ]
    },
    descriptionHebrew: 'למשתמשות כבדות, מאמנות ומטפלות המעוניינות בשימוש ללא הגבלה',
    descriptionEnglish: 'For heavy users, coaches, and practitioners who need unlimited usage',
    targetAudience: 'Coaches, practitioners, and heavy users',
    recommended: false,
    popular: false,
  },
};

/**
 * Refill Pack Interface
 */
export interface RefillPack {
  /** Unique identifier */
  id: string;
  
  /** Number of tokens in this pack */
  tokens: number;
  
  /** Price in ILS */
  priceILS: number;
  
  /** Price in USD */
  priceUSD: number;
  
  /** Discount percentage compared to base rate */
  discountPercent?: number;
  
  /** Display name */
  nameHebrew: string;
  nameEnglish: string;
  
  /** Is this a bonus/popular pack? */
  bonus?: boolean;
}

/**
 * Token Refill Packs
 * 
 * One-time token purchases available to all users.
 * These don't affect subscription status.
 */
export const REFILL_PACKS: RefillPack[] = [
  {
    id: 'refill_small',
    tokens: 30000,
    priceILS: 29,
    priceUSD: 9,
    nameHebrew: 'חבילה קטנה',
    nameEnglish: 'Small Pack',
  },
  {
    id: 'refill_medium',
    tokens: 80000,
    priceILS: 69,
    priceUSD: 20,
    discountPercent: 10,
    nameHebrew: 'חבילה בינונית',
    nameEnglish: 'Medium Pack',
    bonus: false,
  },
  {
    id: 'refill_large',
    tokens: 200000,
    priceILS: 149,
    priceUSD: 45,
    discountPercent: 20,
    nameHebrew: 'חבילה גדולה',
    nameEnglish: 'Large Pack',
    bonus: true,
  },
  {
    id: 'refill_xlarge',
    tokens: 500000,
    priceILS: 299,
    priceUSD: 90,
    discountPercent: 30,
    nameHebrew: 'חבילה ענקית',
    nameEnglish: 'XL Pack',
    bonus: true,
  },
];

/**
 * Get subscription plan by tier
 */
export function getSubscriptionPlan(tier: SubscriptionTier): SubscriptionPlan {
  return SUBSCRIPTION_PLANS[tier];
}

/**
 * Get plan by ID (case-insensitive)
 */
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  const normalizedId = planId.toLowerCase() as SubscriptionTier;
  return SUBSCRIPTION_PLANS[normalizedId];
}

/**
 * Check if a feature is available for a subscription tier
 */
export function hasFeature(
  tier: SubscriptionTier,
  feature: keyof SubscriptionPlan['features']
): boolean {
  const plan = SUBSCRIPTION_PLANS[tier];
  return plan.features[feature] === true;
}

/**
 * Get all available plans as an array
 */
export function getAllPlans(): SubscriptionPlan[] {
  return Object.values(SUBSCRIPTION_PLANS);
}

/**
 * Get all refill packs
 */
export function getAllRefillPacks(): RefillPack[] {
  return REFILL_PACKS;
}

/**
 * Calculate token value in ILS
 * Based on the basic plan pricing
 */
export function calculateTokenValueILS(tokens: number): number {
  const basicPlan = SUBSCRIPTION_PLANS.basic;
  const tokenValueRate = basicPlan.priceILS / basicPlan.monthlyTokens;
  return Math.ceil(tokens * tokenValueRate);
}

/**
 * Calculate token value in USD
 */
export function calculateTokenValueUSD(tokens: number): number {
  const basicPlan = SUBSCRIPTION_PLANS.basic;
  const tokenValueRate = basicPlan.priceUSD / basicPlan.monthlyTokens;
  return parseFloat((tokens * tokenValueRate).toFixed(2));
}

/**
 * Get recommended plan for a user based on estimated monthly usage
 */
export function getRecommendedPlan(estimatedMonthlyTokens: number): SubscriptionPlan {
  const plans = getAllPlans().filter(p => p.id !== 'free');
  
  for (const plan of plans) {
    if (estimatedMonthlyTokens <= plan.monthlyTokens) {
      return plan;
    }
  }
  
  // If usage exceeds all plans, recommend Pro
  return SUBSCRIPTION_PLANS.pro;
}

/**
 * Check if user needs to upgrade based on usage
 */
export function shouldUpgrade(
  currentTier: SubscriptionTier,
  tokensUsedThisMonth: number
): boolean {
  const currentPlan = SUBSCRIPTION_PLANS[currentTier];
  
  // If user has consumed more than 80% of their monthly tokens
  const usagePercent = (tokensUsedThisMonth / currentPlan.monthlyTokens) * 100;
  
  return usagePercent > 80 && currentTier !== 'pro';
}

/**
 * Get upgrade suggestion message
 */
export function getUpgradeSuggestion(
  currentTier: SubscriptionTier,
  tokensUsedThisMonth: number
): string | null {
  if (!shouldUpgrade(currentTier, tokensUsedThisMonth)) {
    return null;
  }
  
  const plans = getAllPlans();
  const currentPlanIndex = plans.findIndex(p => p.id === currentTier);
  const nextPlan = plans[currentPlanIndex + 1];
  
  if (!nextPlan) {
    return null;
  }
  
  return `את משתמשת הרבה במערכת! 🎉 שדרוג לתוכנית ${nextPlan.nameHebrew} ייתן לך ${nextPlan.monthlyTokens.toLocaleString()} טוקנים בחודש.`;
}











