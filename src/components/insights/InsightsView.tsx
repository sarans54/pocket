import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  PieChart as PieIcon,
  CalendarClock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

export const InsightsView: React.FC = () => {
  const {
    transactions,
    budget,
    goals,
    recurringExpenses,
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    categorySpendMap,
    budgetUtilizationPercent,
    recommendations,
    isAiLoading,
    fetchAiRecommendations,
    formatMoney,
    setActiveTab,
  } = useApp();

  // 1. Daily Spending Trend Data
  const trendData = useMemo(() => {
    const daysMap: Record<string, number> = {};
    const sortedTx = [...transactions]
      .filter((t) => t.type === 'expense')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedTx.forEach((tx) => {
      const day = tx.date.slice(8); // DD
      daysMap[day] = (daysMap[day] || 0) + tx.amount;
    });

    return Object.entries(daysMap).map(([day, amount]) => ({
      day: `Day ${day}`,
      amount,
    }));
  }, [transactions]);

  // 2. Category Share Data
  const categoryData = useMemo(() => {
    return Object.entries(categorySpendMap)
      .map(([name, amount]) => ({
        name,
        amount,
        share: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [categorySpendMap, totalExpenses]);

  // 3. Recurring Commitments Total
  const totalRecurring = useMemo(() => {
    return recurringExpenses.reduce((sum, r) => sum + r.amount, 0);
  }, [recurringExpenses]);

  // 4. Budget Health Score (0 to 100)
  const healthScore = useMemo(() => {
    let score = 70;
    if (savingsRate >= 30) score += 15;
    else if (savingsRate >= 15) score += 5;
    else score -= 10;

    if (budgetUtilizationPercent <= 80) score += 15;
    else if (budgetUtilizationPercent <= 100) score += 5;
    else score -= 20;

    return Math.max(10, Math.min(98, score));
  }, [savingsRate, budgetUtilizationPercent]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              PocketSmart Intelligence
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">
            Spending Insights & AI Recommendations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Intelligent pattern detection and personalized recommendations grounded in your recorded transactions.
          </p>
        </div>

        <button
          onClick={fetchAiRecommendations}
          disabled={isAiLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-60 rounded-xl transition-colors shadow-sm shadow-teal-600/20 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
          <span>{isAiLoading ? 'Analyzing Ledger...' : 'Refresh AI Analysis'}</span>
        </button>
      </div>

      {/* Top Summary Banner: Budget Health & Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Health Score Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Budget Health Rating</span>
              <span className="text-teal-600 dark:text-teal-400 font-bold font-mono tabular-nums">
                {healthScore}/100
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden my-2">
              <div
                className={`h-full transition-all duration-700 ${
                  healthScore >= 80 ? 'bg-emerald-500' : healthScore >= 60 ? 'bg-teal-500' : 'bg-amber-500'
                }`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              {healthScore >= 80
                ? 'Your budget health is robust. Inflows comfortably exceed outlays and savings pace is steady.'
                : 'Your budget health is moderate. Maintaining vigilance on variable discretionary costs is advised.'}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Savings Pace: {savingsRate}%</span>
            <span>Budget Used: {budgetUtilizationPercent}%</span>
          </div>
        </div>

        {/* Recurring Subscriptions Audit */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Recurring Commitments</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                {formatMoney(totalRecurring)}/mo
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              You have <strong>{recurringExpenses.length} recurring services</strong> that consume ~
              {totalIncome > 0 ? Math.round((totalRecurring / totalIncome) * 100) : 0}% of your monthly income.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Review unused memberships</span>
            <button
              onClick={() => setActiveTab('recurring')}
              className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              Audit Subscriptions
            </button>
          </div>
        </div>

        {/* Financial Responsibility Advice */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Grounded Financial Logic</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Every insight is calculated directly from your transaction ledger. Recommendations explain the
              computational reasoning without making unsubstantiated guarantees or investment promises.
            </p>
          </div>
          <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
            Educational personal finance guidance
          </div>
        </div>
      </div>

      {/* Structured AI Recommendations (PocketSmart Intelligence Engine) */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-500" />
          <span>Active Recommendations & Reasoning</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => {
            let badgeBg = 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800';
            if (rec.type === 'warning') {
              badgeBg = 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
            } else if (rec.type === 'praise') {
              badgeBg = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
            }

            return (
              <div
                key={rec.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-teal-300 dark:hover:border-teal-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${badgeBg}`}>
                      {rec.category || 'General'}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {rec.type}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                    {rec.title}
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Reason: </span>
                      <span className="text-slate-500 dark:text-slate-400">{rec.reason}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Action: </span>
                      <span className="text-teal-700 dark:text-teal-300">{rec.action}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                  >
                    <span>Inspect Category Ledger</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spending Trend Line/Area Chart */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Daily Spending Trajectory
            </h3>
            <p className="text-[11px] text-slate-500">Distribution of outlays across the current billing cycle</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
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
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#0D9488"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#spendGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Distribution Bar Chart */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Category Distribution Share
            </h3>
            <p className="text-[11px] text-slate-500">Proportion of variable expenditures</p>
          </div>

          <div className="space-y-3">
            {categoryData.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{item.name}</span>
                  <span className="font-mono tabular-nums text-slate-500">
                    {formatMoney(item.amount)} ({item.share}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500"
                    style={{ width: `${Math.min(100, item.share)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
