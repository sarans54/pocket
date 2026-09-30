import { UserProfile, Transaction, BudgetConfig, FinancialGoal, RecurringExpense, AppNotification, UserSettings } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_demo_01',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  currency: '₹',
  monthlyIncome: 35000,
  mainGoal: 'Save for laptop & build emergency fund',
  incomeFrequency: 'Monthly',
  expenseCategories: ['Food', 'Transport', 'Education', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Other'],
  savingsTarget: 12000,
  avatarUrl: '/src/assets/images/avatar_executive_user_1790775678203.jpg',
  onboarded: true,
  joinedDate: '2026-08-15',
};

// Current month helpers
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const pad = (d: number) => String(d).padStart(2, '0');

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // Income
  {
    id: 'tx_inc_1',
    type: 'income',
    amount: 35000,
    category: 'Salary',
    date: `${year}-${month}-01`,
    description: 'Monthly Salary Credit',
    paymentMethod: 'Bank Transfer',
    note: 'TechCorp engineering stipend & salary',
  },
  {
    id: 'tx_inc_2',
    type: 'income',
    amount: 4500,
    category: 'Freelance',
    date: `${year}-${month}-14`,
    description: 'UI Design Freelance Project',
    paymentMethod: 'UPI',
    note: 'Landing page design milestone',
  },
  // Expenses - Food (Total ~ ₹4,200)
  {
    id: 'tx_exp_1',
    type: 'expense',
    amount: 1850,
    category: 'Food',
    date: `${year}-${month}-03`,
    description: 'Weekly Organic Grocery Restock',
    paymentMethod: 'UPI',
    note: 'Vegetables, fruits, oatmeal & dairy',
  },
  {
    id: 'tx_exp_2',
    type: 'expense',
    amount: 450,
    category: 'Food',
    date: `${year}-${month}-07`,
    description: 'Team Lunch at Green Cafe',
    paymentMethod: 'UPI',
    note: 'Lunch bowl & iced latte',
  },
  {
    id: 'tx_exp_3',
    type: 'expense',
    amount: 680,
    category: 'Food',
    date: `${year}-${month}-12`,
    description: 'Weekend Dinner Delivery (Swiggy)',
    paymentMethod: 'Credit Card',
    note: 'Paneer tikka & garlic naan',
  },
  {
    id: 'tx_exp_4',
    type: 'expense',
    amount: 220,
    category: 'Food',
    date: `${year}-${month}-18`,
    description: 'Artisanal Coffee & Muffin',
    paymentMethod: 'UPI',
    note: 'Study session beverage',
  },
  {
    id: 'tx_exp_5',
    type: 'expense',
    amount: 1000,
    category: 'Food',
    date: `${year}-${month}-24`,
    description: 'Supermarket Groceries & Pantry',
    paymentMethod: 'Debit Card',
  },

  // Transport (Total ~ ₹2,100)
  {
    id: 'tx_exp_6',
    type: 'expense',
    amount: 800,
    category: 'Transport',
    date: `${year}-${month}-02`,
    description: 'Metro Smart Card Monthly Pass',
    paymentMethod: 'Debit Card',
    note: 'Unlimited rail commute',
  },
  {
    id: 'tx_exp_7',
    type: 'expense',
    amount: 350,
    category: 'Transport',
    date: `${year}-${month}-11`,
    description: 'Uber Ride to Airport Terminal',
    paymentMethod: 'UPI',
  },
  {
    id: 'tx_exp_8',
    type: 'expense',
    amount: 950,
    category: 'Transport',
    date: `${year}-${month}-20`,
    description: 'Scooter Fuel Tank Refill',
    paymentMethod: 'UPI',
  },

  // Education (Total ~ ₹3,500)
  {
    id: 'tx_exp_9',
    type: 'expense',
    amount: 1200,
    category: 'Education',
    date: `${year}-${month}-05`,
    description: 'Cloud Architecture Certification Course',
    paymentMethod: 'Credit Card',
    note: 'Udemy professional track',
  },
  {
    id: 'tx_exp_10',
    type: 'expense',
    amount: 2300,
    category: 'Education',
    date: `${year}-${month}-16`,
    description: 'Financial Engineering Handbook & Notes',
    paymentMethod: 'UPI',
  },

  // Entertainment (Total ~ ₹1,800)
  {
    id: 'tx_exp_11',
    type: 'expense',
    amount: 650,
    category: 'Entertainment',
    date: `${year}-${month}-08`,
    description: 'IMAX Cinema Tickets',
    paymentMethod: 'Credit Card',
    note: 'Weekend film with college friends',
  },
  {
    id: 'tx_exp_12',
    type: 'expense',
    amount: 450,
    category: 'Entertainment',
    date: `${year}-${month}-17`,
    description: 'Indie Game Bundle on Steam',
    paymentMethod: 'UPI',
  },
  {
    id: 'tx_exp_13',
    type: 'expense',
    amount: 700,
    category: 'Entertainment',
    date: `${year}-${month}-22`,
    description: 'Concert Entry Ticket',
    paymentMethod: 'UPI',
  },

  // Bills (Total ~ ₹5,000)
  {
    id: 'tx_exp_14',
    type: 'expense',
    amount: 999,
    category: 'Bills',
    date: `${year}-${month}-04`,
    description: 'Airtel Fiber Broadband 200 Mbps',
    paymentMethod: 'UPI',
    isRecurring: true,
  },
  {
    id: 'tx_exp_15',
    type: 'expense',
    amount: 499,
    category: 'Bills',
    date: `${year}-${month}-06`,
    description: 'Mobile Postpaid 5G Plan',
    paymentMethod: 'UPI',
    isRecurring: true,
  },
  {
    id: 'tx_exp_16',
    type: 'expense',
    amount: 3502,
    category: 'Bills',
    date: `${year}-${month}-09`,
    description: 'Apartment Maintenance & Water Bill',
    paymentMethod: 'Bank Transfer',
    isRecurring: true,
  },

  // Shopping (Total ~ ₹2,400)
  {
    id: 'tx_exp_17',
    type: 'expense',
    amount: 2400,
    category: 'Shopping',
    date: `${year}-${month}-15`,
    description: 'Ergonomic Desk Accessories & Shirt',
    paymentMethod: 'Credit Card',
  },

  // Healthcare
  {
    id: 'tx_exp_18',
    type: 'expense',
    amount: 950,
    category: 'Healthcare',
    date: `${year}-${month}-19`,
    description: 'Multivitamins & First Aid Kit',
    paymentMethod: 'Cash',
  },
];

export const INITIAL_BUDGET: BudgetConfig = {
  monthlyOverallLimit: 25000,
  categories: [
    { category: 'Food', monthlyLimit: 5000, weeklyLimit: 1250 },
    { category: 'Transport', monthlyLimit: 2500, weeklyLimit: 625 },
    { category: 'Education', monthlyLimit: 4000, weeklyLimit: 1000 },
    { category: 'Entertainment', monthlyLimit: 2000, weeklyLimit: 500 },
    { category: 'Bills', monthlyLimit: 5500, weeklyLimit: 1375 },
    { category: 'Shopping', monthlyLimit: 3000, weeklyLimit: 750 },
    { category: 'Healthcare', monthlyLimit: 1500, weeklyLimit: 375 },
    { category: 'Other', monthlyLimit: 1500, weeklyLimit: 375 },
  ],
};

export const INITIAL_GOALS: FinancialGoal[] = [
  {
    id: 'goal_1',
    name: 'MacBook Air M3 for Tech Work',
    targetAmount: 95000,
    currentAmount: 42000,
    targetDate: `${year + 1}-03-31`,
    category: 'Laptop',
    note: 'Primary machine upgrade for programming & data projects',
  },
  {
    id: 'goal_2',
    name: 'Emergency Rainy Day Reserve',
    targetAmount: 60000,
    currentAmount: 38000,
    targetDate: `${year}-12-31`,
    category: 'Emergency Fund',
    note: 'Buffer equal to 2-3 months living costs',
  },
  {
    id: 'goal_3',
    name: 'Himalayan Trekking Expedition',
    targetAmount: 25000,
    currentAmount: 11500,
    targetDate: `${year + 1}-05-15`,
    category: 'Travel',
    note: 'Gear and expedition guide costs',
  },
];

export const INITIAL_RECURRING: RecurringExpense[] = [
  {
    id: 'rec_1',
    name: 'Broadband Fiber Internet',
    amount: 999,
    category: 'Bills',
    frequency: 'Monthly',
    nextDueDate: `${year}-${month}-28`,
    autoDebit: true,
  },
  {
    id: 'rec_2',
    name: 'Netflix 4K Subscription',
    amount: 649,
    category: 'Entertainment',
    frequency: 'Monthly',
    nextDueDate: `${year}-${month}-29`,
    autoDebit: true,
  },
  {
    id: 'rec_3',
    name: 'Mobile Postpaid 5G',
    amount: 499,
    category: 'Bills',
    frequency: 'Monthly',
    nextDueDate: `${year}-${month}-30`,
    autoDebit: false,
  },
  {
    id: 'rec_4',
    name: 'Spotify Premium Music',
    amount: 179,
    category: 'Entertainment',
    frequency: 'Monthly',
    nextDueDate: `${year}-${month}-27`,
    autoDebit: true,
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'budget_warning',
    title: 'Food Budget Alert',
    message: "You've used 84% of your monthly Food budget. ₹800 remaining.",
    date: `${year}-${month}-24`,
    read: false,
    category: 'Food',
  },
  {
    id: 'notif_2',
    type: 'recurring_due',
    title: 'Upcoming Bill Due Soon',
    message: 'Broadband Fiber (₹999) is due in 3 days. Auto-debit is enabled.',
    date: `${year}-${month}-25`,
    read: false,
    category: 'Bills',
  },
  {
    id: 'notif_3',
    type: 'goal_reminder',
    title: 'Goal Contribution Milestone',
    message: 'Your MacBook Air M3 goal reached 44% completion this week!',
    date: `${year}-${month}-21`,
    read: true,
    category: 'Goals',
  },
  {
    id: 'notif_4',
    type: 'monthly_summary',
    title: 'Weekly Financial Recap Ready',
    message: 'Great job maintaining steady savings: your total spend was 12% lower than prior week.',
    date: `${year}-${month}-18`,
    read: true,
  },
];

export const INITIAL_SETTINGS: UserSettings = {
  theme: 'light',
  notifications: {
    budgetAlerts: true,
    goalReminders: true,
    monthlyReports: true,
    recurringReminders: true,
  },
  preferences: {
    currency: '₹',
    dateFormat: 'YYYY-MM-DD',
    firstDayOfMonth: 1,
  },
};
