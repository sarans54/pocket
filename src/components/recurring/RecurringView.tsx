import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RecurringExpense, ExpenseCategory } from '../../types';
import {
  CalendarClock,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  CreditCard,
  BellRing,
} from 'lucide-react';

export const RecurringView: React.FC = () => {
  const {
    recurringExpenses,
    addRecurringExpense,
    deleteRecurringExpense,
    addTransaction,
    formatMoney,
    currency,
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Bills');
  const [frequency, setFrequency] = useState<'Monthly' | 'Weekly' | 'Yearly'>('Monthly');
  const [nextDueDate, setNextDueDate] = useState('');
  const [autoDebit, setAutoDebit] = useState(true);

  const categories: ExpenseCategory[] = [
    'Bills',
    'Entertainment',
    'Food',
    'Transport',
    'Education',
    'Healthcare',
    'Shopping',
    'Other',
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;
    if (!name.trim()) return;

    addRecurringExpense({
      name: name.trim(),
      amount: val,
      category,
      frequency,
      nextDueDate: nextDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      autoDebit,
    });

    setShowAddModal(false);
    setName('');
    setAmount('');
    setNextDueDate('');
  };

  const handleMarkAsPaid = (rec: RecurringExpense) => {
    // Record into actual transaction ledger
    addTransaction({
      type: 'expense',
      amount: rec.amount,
      category: rec.category,
      date: new Date().toISOString().split('T')[0],
      description: `${rec.name} (Recurring Payment)`,
      paymentMethod: 'UPI',
      note: 'Auto-recorded from Recurring Expenses scheduler',
      isRecurring: true,
    });
  };

  const totalMonthlyCommitment = recurringExpenses.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Recurring Expenses & Subscriptions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit fixed commitments, streaming services, and utility bills before they arrive.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors shadow-sm shadow-teal-600/20 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add Recurring Bill</span>
        </button>
      </div>

      {/* Summary Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Total Recurring Outlay
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums mt-0.5">
            {formatMoney(totalMonthlyCommitment)} <span className="text-xs font-normal text-slate-400">/ month</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {recurringExpenses.length} active recurring commitments scheduled.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <BellRing className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Reminders are triggered automatically in Smart Alerts 3 days prior.</span>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recurringExpenses.map((rec) => (
          <div
            key={rec.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
                    {rec.category} · {rec.frequency}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    {rec.name}
                  </h3>
                </div>
                <button
                  onClick={() => deleteRecurringExpense(rec.id)}
                  title="Remove"
                  className="text-slate-400 hover:text-rose-600 p-1 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums my-2">
                {formatMoney(rec.amount)}
                <span className="text-xs font-normal text-slate-400"> / {rec.frequency.toLowerCase()}</span>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Next Due Date:</span>
                  <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200 font-medium">
                    {rec.nextDueDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Auto Debit:</span>
                  <span className={rec.autoDebit ? 'text-teal-600 font-medium' : 'text-slate-400'}>
                    {rec.autoDebit ? 'Enabled' : 'Manual'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action to Mark as Paid */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleMarkAsPaid(rec)}
                className="w-full py-2 px-3 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 border border-teal-200 dark:border-teal-800 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Paid (Log to Ledger)</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Recurring Commitment
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Service / Bill Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Netflix, Wifi, Apartment Rent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Amount ({currency})
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="999"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Next Due Date
                </label>
                <input
                  type="date"
                  required
                  value={nextDueDate}
                  onChange={(e) => setNextDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={autoDebit}
                    onChange={(e) => setAutoDebit(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Auto-debit enabled for this service</span>
                </label>
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
                  Schedule Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
