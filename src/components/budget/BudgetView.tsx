import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExpenseCategory } from '../../types';
import {
  PieChart,
  Edit3,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  X,
  Plus,
  ShieldCheck,
} from 'lucide-react';

export const BudgetView: React.FC = () => {
  const {
    budget,
    updateOverallBudget,
    updateCategoryBudget,
    categorySpendMap,
    totalExpenses,
    formatMoney,
    currency,
  } = useApp();

  // Edit Budget Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [newCategoryLimit, setNewCategoryLimit] = useState<string>('');
  const [overallLimitInput, setOverallLimitInput] = useState<string>(String(budget.monthlyOverallLimit));

  const overallSpent = totalExpenses;
  const overallLimit = budget.monthlyOverallLimit;
  const overallPercent = Math.round((overallSpent / (overallLimit || 1)) * 100);

  const openCategoryEdit = (cat: ExpenseCategory, currentLimit: number) => {
    setEditingCategory(cat);
    setNewCategoryLimit(String(currentLimit));
    setShowEditModal(true);
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      const val = parseFloat(newCategoryLimit);
      if (!isNaN(val) && val >= 0) {
        updateCategoryBudget(editingCategory, val);
      }
    } else {
      const val = parseFloat(overallLimitInput);
      if (!isNaN(val) && val > 0) {
        updateOverallBudget(val);
      }
    }
    setShowEditModal(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Budget Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Set deliberate spending limits by category and track weekly pacing with calm guidance.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setOverallLimitInput(String(budget.monthlyOverallLimit));
            setShowEditModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-sm shadow-teal-600/20 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Adjust Overall Limit</span>
        </button>
      </div>

      {/* Master Monthly Budget Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Monthly Envelope
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums mt-1">
              {formatMoney(overallSpent)} <span className="text-sm font-normal text-slate-400">of {formatMoney(overallLimit)}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="text-right">
              <span className="text-slate-500">Remaining</span>
              <p className="text-base font-bold text-teal-600 dark:text-teal-400 font-mono tabular-nums">
                {formatMoney(Math.max(0, overallLimit - overallSpent))}
              </p>
            </div>
            <div className="text-right">
              <span className="text-slate-500">Utilization</span>
              <p className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {overallPercent}%
              </p>
            </div>
          </div>
        </div>

        {/* Master Progress Bar */}
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              overallPercent > 100
                ? 'bg-rose-500'
                : overallPercent > 80
                ? 'bg-amber-500'
                : 'bg-teal-500'
            }`}
            style={{ width: `${Math.min(100, overallPercent)}%` }}
          />
        </div>

        {/* Status Callout */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            {overallPercent > 100 ? (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span className="text-rose-600 dark:text-rose-400 font-medium">
                  Spending has passed planned target. Review discretionary allocations.
                </span>
              </>
            ) : overallPercent > 80 ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  Approaching monthly limit. Keep an eye on upcoming weekend outlays.
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span className="text-teal-600 dark:text-teal-400 font-medium">
                  Under budget. You have healthy breathing room for the rest of this cycle.
                </span>
              </>
            )}
          </div>
          <span className="text-[11px] text-slate-400">
            {overallPercent > 100 ? `${overallPercent - 100}% over` : `${100 - overallPercent}% available`}
          </span>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
          Category Budgets & Weekly Pacing
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budget.categories.map((catBudget) => {
            const spent = categorySpendMap[catBudget.category] || 0;
            const limit = catBudget.monthlyLimit;
            const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
            const remaining = Math.max(0, limit - spent);
            const weeklyPace = Math.round(limit / 4);

            let status: 'Under Budget' | 'Approaching Limit' | 'Over Budget' = 'Under Budget';
            let statusColor = 'text-teal-600 dark:text-teal-400';
            let barColor = 'bg-teal-500';

            if (percent > 100) {
              status = 'Over Budget';
              statusColor = 'text-rose-600 dark:text-rose-400';
              barColor = 'bg-rose-500';
            } else if (percent >= 80) {
              status = 'Approaching Limit';
              statusColor = 'text-amber-600 dark:text-amber-400';
              barColor = 'bg-amber-500';
            }

            return (
              <div
                key={catBudget.category}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {catBudget.category}
                    </span>
                    <button
                      onClick={() => openCategoryEdit(catBudget.category, limit)}
                      title="Adjust limit"
                      className="text-slate-400 hover:text-teal-600 p-1 rounded transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-baseline justify-between text-xs mb-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-base tabular-nums">
                      {formatMoney(spent)}
                    </span>
                    <span className="text-slate-500">of {formatMoney(limit)}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full transition-all duration-300 ${barColor}`}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Status</span>
                    <span className={`font-semibold ${statusColor}`}>{status}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Remaining</span>
                    <span className="font-mono tabular-nums">{formatMoney(remaining)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Target Weekly Pace</span>
                    <span className="font-mono tabular-nums">~{formatMoney(weeklyPace)}/wk</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Budget Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingCategory ? `Adjust ${editingCategory} Budget` : 'Set Overall Monthly Cap'}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Monthly Limit ({currency})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400 font-mono">
                    {currency}
                  </span>
                  <input
                    type="number"
                    step="100"
                    required
                    autoFocus
                    value={editingCategory ? newCategoryLimit : overallLimitInput}
                    onChange={(e) =>
                      editingCategory
                        ? setNewCategoryLimit(e.target.value)
                        : setOverallLimitInput(e.target.value)
                    }
                    className="w-full pl-8 pr-3 py-2 text-sm font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
                >
                  Save Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
