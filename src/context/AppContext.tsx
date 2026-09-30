import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserProfile,
  Transaction,
  BudgetConfig,
  FinancialGoal,
  RecurringExpense,
  AppNotification,
  UserSettings,
  ActiveTab,
  AIRecommendation,
  CurrencySymbol,
  ExpenseCategory,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGET,
  INITIAL_GOALS,
  INITIAL_RECURRING,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

interface AppContextType {
  // Auth & User
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  signup: (userData: Partial<UserProfile>) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authMode: 'login' | 'signup' | 'forgot';
  setAuthMode: (mode: 'login' | 'signup' | 'forgot') => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  completeOnboarding: (answers: {
    mainGoal: string;
    incomeFrequency: 'Monthly' | 'Weekly' | 'Biweekly' | 'Irregular';
    expenseCategories: ExpenseCategory[];
    savingsTarget: number;
  }) => void;

  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  showTransactionModal: boolean;
  setShowTransactionModal: (show: boolean) => void;
  editingTransaction: Transaction | null;
  setEditingTransaction: (tx: Transaction | null) => void;
  defaultTransactionType: 'expense' | 'income';
  setDefaultTransactionType: (t: 'expense' | 'income') => void;

  // Budgets
  budget: BudgetConfig;
  updateOverallBudget: (limit: number) => void;
  updateCategoryBudget: (category: ExpenseCategory, monthlyLimit: number) => void;

  // Goals
  goals: FinancialGoal[];
  addGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  editGoal: (id: string, updates: Partial<FinancialGoal>) => void;
  deleteGoal: (id: string) => void;
  contributeToGoal: (id: string, amount: number) => void;

  // Recurring
  recurringExpenses: RecurringExpense[];
  addRecurringExpense: (rec: Omit<RecurringExpense, 'id'>) => void;
  editRecurringExpense: (id: string, updates: Partial<RecurringExpense>) => void;
  deleteRecurringExpense: (id: string) => void;

  // Notifications
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;

  // Settings
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  currency: CurrencySymbol;
  formatMoney: (amount: number) => string;

  // AI Insights
  recommendations: AIRecommendation[];
  isAiLoading: boolean;
  fetchAiRecommendations: () => Promise<void>;
  categorizeWithAI: (description: string) => Promise<{ category: string; reason: string }>;

  // Derived Financial Metrics
  totalIncome: number;
  totalExpenses: number;
  remainingBudget: number;
  netSavings: number;
  savingsRate: number;
  categorySpendMap: Record<string, number>;
  budgetUtilizationPercent: number;

  // Data Actions
  resetToDemoData: () => void;
  clearAllData: () => void;

  // Toast
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'ps_user_v1',
  AUTH: 'ps_auth_v1',
  TRANSACTIONS: 'ps_tx_v1',
  BUDGET: 'ps_budget_v1',
  GOALS: 'ps_goals_v1',
  RECURRING: 'ps_recurring_v1',
  NOTIFICATIONS: 'ps_notifications_v1',
  SETTINGS: 'ps_settings_v1',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial states from localStorage with safe fallback to mockData
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return isAuthenticated ? 'dashboard' : 'landing';
  });

  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [budget, setBudget] = useState<BudgetConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGET);
    return saved ? JSON.parse(saved) : INITIAL_BUDGET;
  });

  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECURRING);
    return saved ? JSON.parse(saved) : INITIAL_RECURRING;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [showTransactionModal, setShowTransactionModal] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [defaultTransactionType, setDefaultTransactionType] = useState<'expense' | 'income'>('expense');

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([
    {
      id: 'rec-1',
      title: 'Review Food & Dining Pace',
      category: 'Food',
      type: 'tip',
      reason: 'Food spending represents 21% of your total expenditures this month.',
      action: 'Check recent delivery orders and review dining choices.',
    },
    {
      id: 'rec-2',
      title: 'Digital Subscriptions Review',
      category: 'Bills',
      type: 'warning',
      reason: 'Recurring digital services total ₹2,326 per month.',
      action: 'Check active subscriptions to see if any are rarely used.',
    },
    {
      id: 'rec-3',
      title: 'Consistent Emergency Fund Pace',
      category: 'Goals',
      type: 'praise',
      reason: 'Your Emergency Fund goal is currently at 63% completion.',
      action: 'Keep maintaining current regular savings allocations.',
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(recurringExpenses));
  }, [recurringExpenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    // Apply dark mode class to html document element
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Toast handlers
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const currency: CurrencySymbol = user?.currency || settings.preferences.currency || '₹';

  const formatMoney = (amount: number): string => {
    const num = Math.round(amount);
    return `${currency}${num.toLocaleString()}`;
  };

  // Derived Financial Metrics
  const { totalIncome, totalExpenses, categorySpendMap } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    const catMap: Record<string, number> = {};

    transactions.forEach((tx) => {
      if (tx.type === 'income') {
        income += tx.amount;
      } else {
        expenses += tx.amount;
        catMap[tx.category] = (catMap[tx.category] || 0) + tx.amount;
      }
    });

    return { totalIncome: income, totalExpenses: expenses, categorySpendMap: catMap };
  }, [transactions]);

  const remainingBudget = useMemo(() => {
    const limit = budget.monthlyOverallLimit || totalIncome;
    return Math.max(0, limit - totalExpenses);
  }, [budget.monthlyOverallLimit, totalIncome, totalExpenses]);

  const netSavings = useMemo(() => {
    return totalIncome - totalExpenses;
  }, [totalIncome, totalExpenses]);

  const savingsRate = useMemo(() => {
    if (totalIncome <= 0) return 0;
    return Math.max(0, Math.round((netSavings / totalIncome) * 100));
  }, [totalIncome, netSavings]);

  const budgetUtilizationPercent = useMemo(() => {
    const limit = budget.monthlyOverallLimit || totalIncome || 1;
    return Math.round((totalExpenses / limit) * 100);
  }, [budget.monthlyOverallLimit, totalIncome, totalExpenses]);

  // Auth actions
  const login = (email: string, name?: string) => {
    const existing = user && user.email === email ? user : {
      ...INITIAL_USER,
      email,
      name: name || email.split('@')[0],
    };
    setUser(existing);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setActiveTab('dashboard');
    addToast({
      type: 'success',
      title: 'Welcome Back!',
      description: `Signed in as ${existing.name}`,
    });
  };

  const signup = (userData: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: userData.name || 'New Member',
      email: userData.email || '',
      currency: userData.currency || '₹',
      monthlyIncome: userData.monthlyIncome || 30000,
      mainGoal: userData.mainGoal || 'Save money & track budget',
      incomeFrequency: 'Monthly',
      expenseCategories: ['Food', 'Transport', 'Education', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Other'],
      savingsTarget: 8000,
      onboarded: false,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setShowOnboarding(true);
    setActiveTab('dashboard');
    addToast({
      type: 'success',
      title: 'Account Created',
      description: 'Welcome to PocketSmart AI! Let’s personalize your setup.',
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveTab('landing');
    addToast({
      type: 'info',
      title: 'Signed Out',
      description: 'You have been safely signed out.',
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
    addToast({
      type: 'success',
      title: 'Profile Updated',
      description: 'Your details have been saved.',
    });
  };

  const completeOnboarding = (answers: {
    mainGoal: string;
    incomeFrequency: 'Monthly' | 'Weekly' | 'Biweekly' | 'Irregular';
    expenseCategories: ExpenseCategory[];
    savingsTarget: number;
  }) => {
    if (!user) return;
    setUser({
      ...user,
      ...answers,
      onboarded: true,
    });
    setShowOnboarding(false);
    addToast({
      type: 'success',
      title: 'Onboarding Complete!',
      description: 'Your smart dashboard has been customized for your goals.',
    });
  };

  // Transaction actions
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    setShowTransactionModal(false);
    setEditingTransaction(null);
    addToast({
      type: 'success',
      title: tx.type === 'expense' ? 'Expense Added' : 'Income Recorded',
      description: `${formatMoney(tx.amount)} · ${tx.description}`,
    });

    // Check budget alert trigger
    if (tx.type === 'expense') {
      const currentCatSpend = (categorySpendMap[tx.category] || 0) + tx.amount;
      const catBudget = budget.categories.find((c) => c.category === tx.category);
      if (catBudget && catBudget.monthlyLimit > 0) {
        const ratio = currentCatSpend / catBudget.monthlyLimit;
        if (ratio >= 1.0) {
          addNotification({
            type: 'budget_exceeded',
            title: `${tx.category} Budget Exceeded`,
            message: `You have spent ${formatMoney(currentCatSpend)} exceeding your ${formatMoney(catBudget.monthlyLimit)} budget limit.`,
            category: tx.category,
          });
        } else if (ratio >= 0.8) {
          addNotification({
            type: 'budget_warning',
            title: `${tx.category} Budget Warning`,
            message: `You have used ${Math.round(ratio * 100)}% of your ${tx.category} budget (${formatMoney(catBudget.monthlyLimit - currentCatSpend)} left).`,
            category: tx.category,
          });
        }
      }
    }
  };

  const editTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    setShowTransactionModal(false);
    setEditingTransaction(null);
    addToast({
      type: 'info',
      title: 'Transaction Updated',
      description: 'Changes saved successfully.',
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    addToast({
      type: 'info',
      title: 'Transaction Removed',
      description: 'Item removed from your records.',
    });
  };

  // Budget actions
  const updateOverallBudget = (limit: number) => {
    setBudget((prev) => ({ ...prev, monthlyOverallLimit: limit }));
    addToast({
      type: 'success',
      title: 'Budget Updated',
      description: `Monthly limit set to ${formatMoney(limit)}`,
    });
  };

  const updateCategoryBudget = (category: ExpenseCategory, monthlyLimit: number) => {
    setBudget((prev) => {
      const exists = prev.categories.some((c) => c.category === category);
      const newCats = exists
        ? prev.categories.map((c) => (c.category === category ? { ...c, monthlyLimit } : c))
        : [...prev.categories, { category, monthlyLimit, weeklyLimit: Math.round(monthlyLimit / 4) }];
      return { ...prev, categories: newCats };
    });
    addToast({
      type: 'success',
      title: `${category} Budget Updated`,
      description: `Limit set to ${formatMoney(monthlyLimit)}/month`,
    });
  };

  // Goals actions
  const addGoal = (goal: Omit<FinancialGoal, 'id'>) => {
    const newGoal: FinancialGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
    };
    setGoals((prev) => [...prev, newGoal]);
    addToast({
      type: 'success',
      title: 'Goal Created',
      description: `Target ${formatMoney(goal.targetAmount)} for ${goal.name}`,
    });
  };

  const editGoal = (id: string, updates: Partial<FinancialGoal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    addToast({
      type: 'info',
      title: 'Goal Updated',
      description: 'Your goal milestones were updated.',
    });
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    addToast({
      type: 'info',
      title: 'Goal Removed',
      description: 'Goal was deleted.',
    });
  };

  const contributeToGoal = (id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updated = Math.min(g.targetAmount, g.currentAmount + amount);
          return { ...g, currentAmount: updated };
        }
        return g;
      })
    );
    addToast({
      type: 'success',
      title: 'Contribution Recorded',
      description: `Added ${formatMoney(amount)} toward your goal!`,
    });
  };

  // Recurring actions
  const addRecurringExpense = (rec: Omit<RecurringExpense, 'id'>) => {
    const newRec: RecurringExpense = {
      ...rec,
      id: `rec_${Date.now()}`,
    };
    setRecurringExpenses((prev) => [...prev, newRec]);
    addToast({
      type: 'success',
      title: 'Recurring Bill Added',
      description: `${rec.name} (${formatMoney(rec.amount)} / ${rec.frequency.toLowerCase()})`,
    });
  };

  const editRecurringExpense = (id: string, updates: Partial<RecurringExpense>) => {
    setRecurringExpenses((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    addToast({
      type: 'info',
      title: 'Recurring Bill Updated',
      description: 'Schedule details saved.',
    });
  };

  const deleteRecurringExpense = (id: string) => {
    setRecurringExpenses((prev) => prev.filter((r) => r.id !== id));
    addToast({
      type: 'info',
      title: 'Recurring Item Removed',
      description: 'Subscription schedule deleted.',
    });
  };

  // Notification actions
  const addNotification = (n: Omit<AppNotification, 'id' | 'date' | 'read'>) => {
    const newN: AppNotification = {
      ...n,
      id: `notif_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      read: false,
    };
    setNotifications((prev) => [newN, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({
      type: 'info',
      title: 'Notifications Cleared',
      description: 'All notifications marked as read.',
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Settings
  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    addToast({
      type: 'success',
      title: 'Settings Saved',
      description: 'Your preferences have been updated.',
    });
  };

  // AI Categorization API call
  const categorizeWithAI = async (description: string): Promise<{ category: string; reason: string }> => {
    try {
      const res = await fetch('/api/ai/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      if (res.ok) {
        const data = await res.json();
        return { category: data.category, reason: data.reason };
      }
    } catch (e) {
      console.error('Categorize fetch failed, using local rule', e);
    }
    // Simple client-side fallback
    const d = description.toLowerCase();
    if (/food|lunch|dinner|cafe|restaurant|coffee|grocery/.test(d)) return { category: 'Food', reason: 'Dining keyword' };
    if (/uber|cab|metro|fuel|petrol|transport/.test(d)) return { category: 'Transport', reason: 'Commute keyword' };
    if (/course|book|tuition|study/.test(d)) return { category: 'Education', reason: 'Education keyword' };
    if (/movie|netflix|game|cinema/.test(d)) return { category: 'Entertainment', reason: 'Entertainment keyword' };
    if (/wifi|bill|electricity|recharge/.test(d)) return { category: 'Bills', reason: 'Utility keyword' };
    return { category: 'Other', reason: 'General expense' };
  };

  // Fetch AI Recommendations
  const fetchAiRecommendations = async () => {
    setIsAiLoading(true);
    try {
      const summary = {
        currency,
        totalIncome,
        totalExpenses,
        remainingBudget,
        categoryTotals: categorySpendMap,
        budgets: budget.categories.map((c) => ({ category: c.category, limit: c.monthlyLimit, spent: categorySpendMap[c.category] || 0 })),
        goals: goals.map((g) => ({ name: g.name, target: g.targetAmount, current: g.currentAmount })),
        recurring: recurringExpenses.map((r) => ({ name: r.name, amount: r.amount, freq: r.frequency })),
      };

      const res = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary }),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.recommendations) && data.recommendations.length > 0) {
          setRecommendations(data.recommendations);
          addToast({
            type: 'info',
            title: 'PocketSmart Intelligence',
            description: 'Analyzed current financial data and updated recommendations.',
          });
        }
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Data Actions
  const resetToDemoData = () => {
    setUser(INITIAL_USER);
    setTransactions(INITIAL_TRANSACTIONS);
    setBudget(INITIAL_BUDGET);
    setGoals(INITIAL_GOALS);
    setRecurringExpenses(INITIAL_RECURRING);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);
    addToast({
      type: 'info',
      title: 'Demo Data Restored',
      description: 'Realistic sample budget and transactions loaded.',
    });
  };

  const clearAllData = () => {
    setTransactions([]);
    setGoals([]);
    setRecurringExpenses([]);
    setNotifications([]);
    addToast({
      type: 'warning',
      title: 'Data Cleared',
      description: 'Your transactions and goals have been reset.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        updateProfile,
        showAuthModal,
        setShowAuthModal,
        authMode,
        setAuthMode,
        showOnboarding,
        setShowOnboarding,
        completeOnboarding,

        activeTab,
        setActiveTab,

        transactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        showTransactionModal,
        setShowTransactionModal,
        editingTransaction,
        setEditingTransaction,
        defaultTransactionType,
        setDefaultTransactionType,

        budget,
        updateOverallBudget,
        updateCategoryBudget,

        goals,
        addGoal,
        editGoal,
        deleteGoal,
        contributeToGoal,

        recurringExpenses,
        addRecurringExpense,
        editRecurringExpense,
        deleteRecurringExpense,

        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,

        settings,
        updateSettings,
        currency,
        formatMoney,

        recommendations,
        isAiLoading,
        fetchAiRecommendations,
        categorizeWithAI,

        totalIncome,
        totalExpenses,
        remainingBudget,
        netSavings,
        savingsRate,
        categorySpendMap,
        budgetUtilizationPercent,

        resetToDemoData,
        clearAllData,

        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
