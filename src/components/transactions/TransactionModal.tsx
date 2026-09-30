import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ExpenseCategory, IncomeSource, PaymentMethod, Transaction } from '../../types';
import { X, Sparkles, Check, Calendar, CreditCard, Tag, FileText, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const TransactionModal: React.FC = () => {
  const {
    showTransactionModal,
    setShowTransactionModal,
    editingTransaction,
    setEditingTransaction,
    defaultTransactionType,
    addTransaction,
    editTransaction,
    currency,
    categorizeWithAI,
  } = useApp();

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('Food');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [note, setNote] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);

  const [aiSuggestedCategory, setAiSuggestedCategory] = useState<string | null>(null);
  const [aiReason, setAiReason] = useState<string | null>(null);
  const [isCategorizing, setIsCategorizing] = useState<boolean>(false);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(String(editingTransaction.amount));
      setDescription(editingTransaction.description);
      setCategory(editingTransaction.category);
      setDate(editingTransaction.date);
      setPaymentMethod(editingTransaction.paymentMethod || 'UPI');
      setNote(editingTransaction.note || '');
      setIsRecurring(Boolean(editingTransaction.isRecurring));
      setAiSuggestedCategory(null);
    } else {
      setType(defaultTransactionType);
      setAmount('');
      setDescription('');
      setCategory(defaultTransactionType === 'expense' ? 'Food' : 'Salary');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('UPI');
      setNote('');
      setIsRecurring(false);
      setAiSuggestedCategory(null);
    }
  }, [editingTransaction, defaultTransactionType, showTransactionModal]);

  // Debounced Smart Categorization
  useEffect(() => {
    if (type !== 'expense' || !description.trim() || description.length < 3) {
      setAiSuggestedCategory(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCategorizing(true);
      try {
        const result = await categorizeWithAI(description);
        if (result && result.category && result.category !== category) {
          setAiSuggestedCategory(result.category);
          setAiReason(result.reason);
        } else {
          setAiSuggestedCategory(null);
        }
      } catch (e) {
        console.error('Categorization error:', e);
      } finally {
        setIsCategorizing(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [description, type]);

  if (!showTransactionModal) return null;

  const expenseCategories: ExpenseCategory[] = [
    'Food',
    'Transport',
    'Education',
    'Shopping',
    'Entertainment',
    'Bills',
    'Healthcare',
    'Other',
  ];

  const incomeSources: IncomeSource[] = [
    'Salary',
    'Freelance',
    'Stipend',
    'Business',
    'Gift',
    'Other Income',
  ];

  const paymentMethods: PaymentMethod[] = [
    'UPI',
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'Cash',
    'Other',
  ];

  const applySuggestedCategory = () => {
    if (aiSuggestedCategory) {
      setCategory(aiSuggestedCategory);
      setAiSuggestedCategory(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    if (!description.trim()) return;

    if (editingTransaction) {
      editTransaction(editingTransaction.id, {
        type,
        amount: parsedAmount,
        category: category as any,
        date,
        description: description.trim(),
        paymentMethod,
        note: note.trim() || undefined,
        isRecurring,
      });
    } else {
      addTransaction({
        type,
        amount: parsedAmount,
        category: category as any,
        date,
        description: description.trim(),
        paymentMethod,
        note: note.trim() || undefined,
        isRecurring,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
        {/* Close Button */}
        <button
          onClick={() => {
            setShowTransactionModal(false);
            setEditingTransaction(null);
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          {editingTransaction ? 'Edit Transaction' : 'Record Transaction'}
        </h3>

        {/* Expense vs Income Segmented Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => {
              setType('expense');
              if (!editingTransaction) setCategory('Food');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              type === 'expense'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Expense</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setType('income');
              if (!editingTransaction) setCategory('Salary');
            }}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              type === 'income'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Income</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Field */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Amount ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-base font-bold text-slate-400 font-mono">
                {currency}
              </span>
              <input
                type="number"
                step="any"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-base font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Description Field with Smart Categorization Indicator */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <input
              type="text"
              required
              placeholder={type === 'expense' ? 'e.g. Lunch at restaurant or Uber ride' : 'e.g. Monthly salary or freelance'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            {/* Smart Categorization AI Suggestion Banner */}
            {aiSuggestedCategory && (
              <div className="mt-2 p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-1.5 text-xs text-teal-800 dark:text-teal-200">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>
                    Suggested Category: <strong>{aiSuggestedCategory}</strong>
                    {aiReason && <span className="text-[11px] text-teal-600 dark:text-teal-400 ml-1">({aiReason})</span>}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={applySuggestedCategory}
                  className="px-2.5 py-1 text-[11px] font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Category & Payment Method Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {type === 'expense'
                  ? expenseCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))
                  : incomeSources.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {paymentMethods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Recurring Toggle */}
          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {type === 'expense' && (
              <div className="pt-5">
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 dark:border-slate-700"
                  />
                  <span>Mark as recurring bill</span>
                </label>
              </div>
            )}
          </div>

          {/* Note (optional) */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Optional Note
            </label>
            <input
              type="text"
              placeholder="e.g. Shared bill with college friends"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Submit CTA */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setShowTransactionModal(false);
                setEditingTransaction(null);
              }}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-sm shadow-teal-600/20 cursor-pointer"
            >
              {editingTransaction ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
