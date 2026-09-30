import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FinancialGoal } from '../../types';
import {
  Target,
  Plus,
  Calendar,
  Sparkles,
  TrendingUp,
  X,
  Trash2,
  Edit2,
  DollarSign,
  Laptop,
  ShieldCheck,
  Plane,
  GraduationCap,
  ShoppingBag,
} from 'lucide-react';

export const GoalsView: React.FC = () => {
  const { goals, addGoal, editGoal, deleteGoal, contributeToGoal, formatMoney, currency } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
  const [contributionAmount, setContributionAmount] = useState<string>('2000');

  // New Goal Form State
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Laptop');
  const [note, setNote] = useState('');

  const goalCategories = [
    { id: 'Laptop', label: 'Tech & Gadgets', icon: Laptop },
    { id: 'Emergency Fund', label: 'Emergency Fund', icon: ShieldCheck },
    { id: 'Education', label: 'Education & Career', icon: GraduationCap },
    { id: 'Travel', label: 'Travel & Trips', icon: Plane },
    { id: 'Personal Purchase', label: 'Personal Purchase', icon: ShoppingBag },
    { id: 'Custom Goal', label: 'Custom Goal', icon: Target },
  ];

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const initial = parseFloat(currentAmount) || 0;
    if (isNaN(target) || target <= 0) return;
    if (!name.trim()) return;

    addGoal({
      name: name.trim(),
      targetAmount: target,
      currentAmount: initial,
      targetDate: targetDate || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
      category,
      note: note.trim() || undefined,
    });

    setShowAddModal(false);
    setName('');
    setTargetAmount('');
    setCurrentAmount('0');
    setTargetDate('');
    setNote('');
  };

  const handleContributeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;
    const val = parseFloat(contributionAmount);
    if (!isNaN(val) && val > 0) {
      contributeToGoal(selectedGoal.id, val);
      setShowContributeModal(false);
      setSelectedGoal(null);
    }
  };

  const calculateSuggestedMonthly = (goal: FinancialGoal): number => {
    const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
    if (remaining <= 0) return 0;
    const now = new Date();
    const target = new Date(goal.targetDate);
    const diffMonths = Math.max(
      1,
      (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
    );
    return Math.round(remaining / diffMonths);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Financial Goals
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Set intentional milestones, track incremental progress, and calculate suggested monthly contributions.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-sm shadow-teal-600/20 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Financial Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map((goal) => {
          const percent =
            goal.targetAmount > 0
              ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))
              : 0;
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
          const suggestedMonthly = calculateSuggestedMonthly(goal);

          return (
            <div
              key={goal.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
                      {goal.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {goal.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    title="Delete goal"
                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Amounts & Percentage */}
                <div className="flex items-baseline justify-between mb-2">
                  <div className="font-mono font-bold text-lg text-slate-900 dark:text-white tabular-nums">
                    {formatMoney(goal.currentAmount)}
                  </div>
                  <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 font-mono tabular-nums">
                    {percent}% saved
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-teal-500 transition-all duration-500 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Target:</span>
                    <span className="font-mono tabular-nums font-medium text-slate-800 dark:text-slate-200">
                      {formatMoney(goal.targetAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Remaining:</span>
                    <span className="font-mono tabular-nums font-medium text-slate-800 dark:text-slate-200">
                      {formatMoney(remaining)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Target Date:</span>
                    <span className="font-mono tabular-nums">{goal.targetDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-teal-700 dark:text-teal-400 font-medium pt-1">
                    <span>Suggested Monthly:</span>
                    <span className="font-mono tabular-nums font-semibold">
                      ~{formatMoney(suggestedMonthly)}/mo
                    </span>
                  </div>
                </div>

                {goal.note && (
                  <p className="mt-3 text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                    {goal.note}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setSelectedGoal(goal);
                    setContributionAmount('2000');
                    setShowContributeModal(true);
                  }}
                  className="w-full py-2 px-3 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 border border-teal-200 dark:border-teal-800 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Funds to Goal</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Create New Financial Goal
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MacBook Air M3, Emergency Fund"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {goalCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Target ({currency})
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="60000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Initial Saved ({currency})
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Completion Date
                </label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Optional Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. For college coding & projects"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contribute Funds Modal */}
      {showContributeModal && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Contribute to Goal
                </h3>
                <p className="text-[11px] text-slate-400">{selectedGoal.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowContributeModal(false);
                  setSelectedGoal(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleContributeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Contribution Amount ({currency})
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
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Remaining before this contribution:{' '}
                  {formatMoney(Math.max(0, selectedGoal.targetAmount - selectedGoal.currentAmount))}
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowContributeModal(false);
                    setSelectedGoal(null);
                  }}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
                >
                  Confirm Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
