import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Download,
  Printer,
  Calendar,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  CheckCircle2,
  Receipt,
  Target,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const ReportsView: React.FC = () => {
  const {
    transactions,
    budget,
    goals,
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    categorySpendMap,
    formatMoney,
    currency,
  } = useApp();

  const [reportType, setReportType] = useState<'monthly' | 'weekly' | 'custom'>('monthly');

  // Top 3 Categories
  const topCategories = useMemo(() => {
    return Object.entries(categorySpendMap)
      .map(([name, amount]) => ({
        name,
        amount,
        percent: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
  }, [categorySpendMap, totalExpenses]);

  // Largest Transactions
  const largestExpenses = useMemo(() => {
    return [...transactions]
      .filter((t) => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  // Category chart data
  const pieData = useMemo(() => {
    const palette = ['#0D9488', '#0284C7', '#6366F1', '#EC4899', '#F59E0B', '#8B5CF6', '#10B981', '#64748B'];
    return Object.entries(categorySpendMap).map(([name, value], idx) => ({
      name,
      value,
      color: palette[idx % palette.length],
    }));
  }, [categorySpendMap]);

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['Type', 'Description', 'Category', 'Amount', 'Date', 'PaymentMethod'];
    const rows = transactions.map((t) => [
      t.type,
      `"${t.description.replace(/"/g, '""')}"`,
      t.category,
      t.amount,
      t.date,
      t.paymentMethod || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pocketsmart_report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 print:p-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Financial Health Reports
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Comprehensive audit of inflows, outlays, budget variances, and goal milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented Filter */}
          <div className="flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setReportType('weekly')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                reportType === 'weekly' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setReportType('monthly')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                reportType === 'monthly' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setReportType('custom')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
                reportType === 'custom' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              All Time
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 rounded-xl transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Printable Report Surface */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              PocketSmart AI Official Statement
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              Monthly Financial Performance Statement
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Statement generated on {new Date().toLocaleDateString()} · Currency: {currency}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400">Net Financial Position</span>
            <div className="text-2xl font-bold font-mono text-teal-600 dark:text-teal-400 tabular-nums">
              +{formatMoney(netSavings)}
            </div>
            <span className="text-[11px] text-slate-500">{savingsRate}% net savings rate</span>
          </div>
        </div>

        {/* 4 Core KPI Blocks */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">Gross Income</span>
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums mt-1">
              {formatMoney(totalIncome)}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">Total Outlays</span>
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums mt-1">
              {formatMoney(totalExpenses)}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">Budget Target</span>
            <div className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums mt-1">
              {formatMoney(budget.monthlyOverallLimit)}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">Savings Rate</span>
            <div className="text-lg font-bold font-mono text-teal-600 dark:text-teal-400 tabular-nums mt-1">
              {savingsRate}%
            </div>
          </div>
        </div>

        {/* Charts & Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Donut Chart */}
          <div className="lg:col-span-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              Category Distribution
            </h4>
            <p className="text-[11px] text-slate-500 mb-3">Overall expense proportions</p>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    paddingAngle={2}
                  >
                    {pieData.map((entry, index) => (
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
          </div>

          {/* Top 3 Spending Categories */}
          <div className="lg:col-span-6 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Top Spending Drivers
            </h4>
            <div className="space-y-2">
              {topCategories.map((c, idx) => (
                <div
                  key={c.name}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 text-[10px] font-bold flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <div>
                      <h5 className="text-xs font-semibold text-slate-900 dark:text-white">{c.name}</h5>
                      <span className="text-[10px] text-slate-400">{c.percent}% of total expenditures</span>
                    </div>
                  </div>
                  <div className="text-right font-mono font-bold text-xs text-slate-900 dark:text-white tabular-nums">
                    {formatMoney(c.amount)}
                  </div>
                </div>
              ))}
            </div>

            {/* Goals Milestone Summary */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                Active Goal Milestones
              </h4>
              <div className="space-y-2">
                {goals.map((g) => (
                  <div key={g.id} className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{g.name}</span>
                      <span className="font-mono tabular-nums text-slate-500">
                        {formatMoney(g.currentAmount)} / {formatMoney(g.targetAmount)}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500"
                        style={{
                          width: `${Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Largest Transactions Table */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3">
            Top 5 Largest Recorded Transactions
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Payment Method</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {largestExpenses.map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">
                      {tx.description}
                    </td>
                    <td className="py-2 px-3 text-slate-500">{tx.category}</td>
                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px] tabular-nums">{tx.date}</td>
                    <td className="py-2 px-3 text-slate-500">{tx.paymentMethod}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                      -{formatMoney(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer footer on report */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-center">
          PocketSmart AI Statement is generated for personal planning purposes only. This statement does not constitute formal tax or banking verification.
        </div>
      </div>
    </div>
  );
};
