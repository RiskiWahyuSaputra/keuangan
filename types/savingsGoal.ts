export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  emoji: string;
  createdAt: string;
}

export const SAVINGS_GOALS_STORAGE_KEY = "dompetq_savings_goals";

export const DEFAULT_GOAL_EMOJIS = ["🎯", "🚗", "🏠", "💻", "📱", "✈️", "💍", "🎓", "🛡️", "💰"];
