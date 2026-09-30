export type CurrencySymbol = '₹' | '$' | '€' | '£' | '¥' | 'C$' | 'A$';

export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Education'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills'
  | 'Healthcare'
  | 'Other';

export type IncomeSource =
  | 'Salary'
  | 'Freelance'
  | 'Stipend'
  | 'Business'
  | 'Gift'
  | 'Other Income';

export type PaymentMethod =
  | 'Cash'
  | 'UPI'
  | 'Debit Card'
  | 'Credit Card'
  | 'Bank Transfer'
  | 'Other';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  currency: CurrencySymbol;
  monthlyIncome: number;
  mainGoal: string;
  incomeFrequency: 'Monthly' | 'Weekly' | 'Biweekly' | 'Irregular';
  expenseCategories: ExpenseCategory[];
  savingsTarget: number;
  avatarUrl?: string;
  onboarded: boolean;
  joinedDate: string;
}

export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category: ExpenseCategory | IncomeSource;
  date: string; // YYYY-MM-DD
  description: string;
  paymentMethod: PaymentMethod;
  note?: string;
  isRecurring?: boolean;
}

export interface CategoryBudget {
  category: ExpenseCategory;
  monthlyLimit: number;
  weeklyLimit?: number;
}

export interface BudgetConfig {
  monthlyOverallLimit: number;
  categories: CategoryBudget[];
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  category: string;
  note?: string;
}

export interface RecurringExpense {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  frequency: 'Monthly' | 'Weekly' | 'Yearly';
  nextDueDate: string; // YYYY-MM-DD
  autoDebit: boolean;
}

export interface AppNotification {
  id: string;
  type: 'budget_warning' | 'budget_exceeded' | 'goal_reminder' | 'recurring_due' | 'monthly_summary';
  title: string;
  message: string;
  date: string;
  read: boolean;
  category?: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  category: string;
  type: 'warning' | 'tip' | 'praise' | 'saving';
  reason: string;
  action: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    budgetAlerts: boolean;
    goalReminders: boolean;
    monthlyReports: boolean;
    recurringReminders: boolean;
  };
  preferences: {
    currency: CurrencySymbol;
    dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
    firstDayOfMonth: number;
  };
}

export type ActiveTab =
  | 'landing'
  | 'dashboard'
  | 'transactions'
  | 'budget'
  | 'goals'
  | 'insights'
  | 'reports'
  | 'assistant'
  | 'recurring'
  | 'notifications'
  | 'profile'
  | 'settings';
