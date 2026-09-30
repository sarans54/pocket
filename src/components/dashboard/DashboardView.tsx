import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Sparkles,
  ArrowRight,
  Plus,
  AlertTriangle,
  CalendarClock,
  PieChart as PieIcon,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    user,
    transactions,
    budget,
    goals,
    recurringExpenses,
    totalIncome,
    totalExpenses,
    remainingBudget,
    netSavings,
    savingsRate,
    categorySpendMap,
    budgetUtilizationPercent,
    formatMoney,
    setActiveTab,
    setShowTransactionModal,
    setDefaultTransactionType,
    currency,
  } = useApp();

  // 1. Calculate overall goal progress
  const { totalGoalTarget, totalGoalSaved, avgGoalProgress } = useMemo(() => {
    if (goals.length === 0) return { totalGoalTarget: 0, totalGoalSaved: 0, avgGoalProgress: 0 };
    const target = goals.reduce((acc, g) => acc + g.targetAmount, 0);
    const saved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
    const progress = target > 0 ? Math.round((saved / target) * 100) : 0;
    return { totalGoalTarget: target, totalGoalSaved: saved, avgGoalProgress: progress };
  }, [goals]);

  // 2. Category chart data
  const categoryChartData = useMemo(() => {
    const colors: Record<string, string> = {
      Food: '#0D9488', // Teal
      Transport: '#0284C7', // Sky
      Education: '#6366F1', // Indigo
      Shopping: '#EC4899', // Pink
      Entertainment: '#F59E0B', // Amber
      Bills: '#8B5CF6', // Purple
      Healthcare: '#10B981', // Emerald
      Other: '#64748B', // Slate
    };

    return Object.entries(categorySpendMap)
      .map(([name, value]) => ({
        name,
        value,
        color: colors[name] || '#94A3B8',
      }))
      .sort((a, b) => b.value - a.value);
  }, [categorySpendMap]);

  // 3. Income vs Expense Comparison Bar Data
  const comparisonData = useMemo(() => {
    return [
      { name: 'Income', amount: totalIncome, fill: '#10B981' },
      { name: 'Budget Cap', amount: budget.monthlyOverallLimit, fill: '#0EA5E9' },
      { name: 'Actual Spend', amount: totalExpenses, fill: '#F43F5E' },
    ];
  }, [totalIncome, budget.monthlyOverallLimit, totalExpenses]);

  // 4. Upcoming bills (next 7 days)
  const upcomingBills = useMemo(() => {
    return recurringExpenses.slice(0, 3);
  }, [recurringExpenses]);

  // 5. Recent 4 transactions
  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 4);
  }, [transactions]);

  // Dynamic AI Insight prompt text based on real data
  const primaryAiInsightText = useMemo(() => {
    if (totalExpenses === 0) {
      return 'You have not recorded any expenses yet this cycle. Add your first transaction to unlock deep budget analysis.';
    }
    const topCategory = categoryChartData[0]?.name || 'discretionary';
    const topCategoryAmount = categoryChartData[0]?.value || 0;
    if (budgetUtilizationPercent > 90) {
      return `Your total spending has reached ${budgetUtilizationPercent}% of your monthly target. ${topCategory} (${formatMoney(
        topCategoryAmount
      )}) is your largest driver.`;
    }
    return `Your spending is currently within your monthly target. ${topCategory} (${formatMoney(
      topCategoryAmount
    )}) is your largest variable expense category this month.`;
  }, [totalExpenses, budgetUtilizationPercent, categoryChartData, formatMoney]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Greeting & Fast Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Financial Dashboard
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Welcome back, {user?.name || 'Aarav'} · Here is your financial posture for this month.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setDefaultTransactionType('expense');
              setShowTransactionModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-sm shadow-teal-600/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Expense</span>
          </button>
          <button
            onClick={() => {
              setDefaultTransactionType('income');
              setShowTransactionModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Income</span>
          </button>
        </div>
      </div>

      {/* 5 Core Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Total Income */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-medium">Total Income</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {formatMoney(totalIncome)}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <span>Steady inflow recorded</span>
          </div>
        </div>

        {/* 2. Total Expenses */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-medium">Total Expenses</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {formatMoney(totalExpenses)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {transactions.filter((t) => t.type === 'expense').length} transactions logged
          </div>
        </div>

        {/* 3. Remaining Budget */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-medium">Remaining Budget</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-teal-600 dark:text-teal-400 font-mono tabular-nums">
            {formatMoney(remainingBudget)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Cap: {formatMoney(budget.monthlyOverallLimit)}
          </div>
        </div>

        {/* 4. Current Savings */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-medium">Net Savings</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {formatMoney(netSavings)}
          </div>
          <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold mt-1">
            {savingsRate}% savings rate
          </div>
        </div>

        {/* 5. Savings Goal Progress */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-medium">Goal Progress</span>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono tabular-nums">
              {avgGoalProgress}%
            </span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {formatMoney(totalGoalSaved)}
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-teal-500" style={{ width: `${Math.min(100, avgGoalProgress)}%` }} />
          </div>
        </div>
      </div>

      {/* Section 26: Highlighted Dashboard AI Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-900/10 via-teal-800/5 to-transparent border border-teal-200/80 dark:border-teal-800/60 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-bold text-teal-900 dark:text-teal-300 uppercase tracking-wider">
                PocketSmart AI Insight
              </span>
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-snug">
              "{primaryAiInsightText}"
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Generated from your live ledger. Suggestions are educational and based on your recorded numbers.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('insights')}
              className="px-3 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 border border-teal-200 dark:border-teal-800 rounded-lg transition-colors cursor-pointer"
            >
              View Details
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              View Transactions
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Adjust Budget
            </button>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Monthly Overview & Utilization */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Monthly Financial Comparison
                </h3>
                <p className="text-[11px] text-slate-500">Income, Budget Cap, and Actual Outflows</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {budgetUtilizationPercent}% Used
                </span>
                <span className="block text-[10px] text-slate-400">
                  {formatMoney(remainingBudget)} left
                </span>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value: any) => [formatMoney(Number(value)), 'Amount']}
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#1E293B',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Budget Utilization Pace Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-600 dark:text-slate-400">Budget Capacity</span>
              <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                {formatMoney(totalExpenses)} / {formatMoney(budget.monthlyOverallLimit)}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  budgetUtilizationPercent > 100
                    ? 'bg-rose-500'
                    : budgetUtilizationPercent > 80
                    ? 'bg-amber-500'
                    : 'bg-teal-500'
                }`}
                style={{ width: `${Math.min(100, budgetUtilizationPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Chart: Category Breakdown Donut */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Spending by Category
              </h3>
              <button
                onClick={() => setActiveTab('transactions')}
                className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-0.5"
              >
                <span>Details</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mb-4">Breakdown of current monthly expenses</p>

            {categoryChartData.length > 0 ? (
              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={2}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [formatMoney(Number(val)), 'Spent']}
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#1E293B',
                        borderRadius: '8px',
                        color: '#F8FAFC',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-xs text-slate-400">
                No expense transactions logged yet.
              </div>
            )}
          </div>

          {/* Category mini pills */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            {categoryChartData.slice(0, 4).map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="text-slate-600 dark:text-slate-400 truncate">{c.name}</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                  {formatMoney(c.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Transactions & Upcoming Recurring Bills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Transactions List */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
              <p className="text-[11px] text-slate-500">Latest activity from your budget</p>
            </div>
            <button
              onClick={() => setActiveTab('transactions')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                      tx.type === 'income'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                      {tx.description}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                      <span>{tx.category}</span>
                      <span>·</span>
                      <span>{tx.paymentMethod}</span>
                      <span>·</span>
                      <span>{tx.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-bold font-mono tabular-nums ${
                      tx.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatMoney(tx.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Recurring Subscriptions & Bills */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Bills</h3>
                <p className="text-[11px] text-slate-500">Scheduled monthly commitments</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('recurring')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingBills.map((bill) => (
              <div
                key={bill.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                    {bill.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Due on {bill.nextDueDate} {bill.autoDebit && '· Auto-debit active'}
                  </p>
                </div>
                <div className="text-right font-mono font-bold text-xs text-slate-900 dark:text-white tabular-nums">
                  {formatMoney(bill.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
