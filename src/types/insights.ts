export interface InsightData {
  id: string;
  title: string;
  description: string;
  category: 'sleep' | 'mood' | 'symptoms' | 'hormones' | 'lifestyle' | 'cycle' | 'general';
  severity: 'low' | 'medium' | 'high';
  confidence: number; // 0-100
  date: string;
  icon: string;
  actionable: boolean;
  recommendations?: string[];
  relatedSymptoms?: string[];
  trend?: 'improving' | 'stable' | 'worsening';
}

export interface TrendAnalysis {
  period: string;
  data: {
    date: string;
    value: number;
    label: string;
  }[];
  trend: 'up' | 'down' | 'stable';
  change: number; // percentage change
}

export interface SymptomPattern {
  symptom: string;
  frequency: number;
  severity: number;
  triggers: string[];
  correlations: {
    symptom: string;
    correlation: number;
  }[];
}

export interface HormoneAnalysis {
  phase: 'premenopausal' | 'perimenopausal' | 'menopausal' | 'postmenopausal';
  confidence: number;
  symptoms: string[];
  recommendations: string[];
}

export interface PersonalizedInsight {
  id: string;
  type: 'pattern' | 'recommendation' | 'warning' | 'encouragement';
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  actionable: boolean;
  relatedData: any;
  alizaMessage: string;
  // מידע נוסף למערכת המשופרת
  comparisonToNorm?: {
    userValue: number;
    averageValue: number;
    explanation: string;
  };
  actionableSteps?: {
    reliefMethods: string[];
    whoToContact?: string[];
    questionsToAsk?: string[];
    lifestyleChanges?: string[];
  };
  visualData?: {
    chartType: 'line' | 'bar' | 'pie';
    data: ChartData;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    tension?: number;
  }[];
}

export interface InsightSummary {
  totalInsights: number;
  newInsights: number;
  highPriority: number;
  categories: {
    [key: string]: number;
  };
  lastAnalysis: string;
  nextAnalysis: string;
}
