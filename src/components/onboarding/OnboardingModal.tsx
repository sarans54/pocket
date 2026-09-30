import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExpenseCategory } from '../../types';
import { Sparkles, Check, ArrowRight, Shield } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { showOnboarding, completeOnboarding, currency, user } = useApp();

  const [step, setStep] = useState(1);
  const [mainGoal, setMainGoal] = useState('Build an emergency fund');
  const [incomeFrequency, setIncomeFrequency] = useState<'Monthly' | 'Weekly' | 'Biweekly' | 'Irregular'>('Monthly');
  const [selectedCategories, setSelectedCategories] = useState<ExpenseCategory[]>([
    'Food',
    'Transport',
    'Bills',
    'Entertainment',
    'Shopping',
  ]);
  const [savingsTarget, setSavingsTarget] = useState(10000);

  if (!showOnboarding) return null;

  const goalOptions = [
    'Save money',
    'Control spending',
    'Build an emergency fund',
    'Manage monthly expenses',
    'Track spending',
    'Plan for a purchase',
    'Other',
  ];

  const frequencyOptions: ('Monthly' | 'Weekly' | 'Biweekly' | 'Irregular')[] = [
    'Monthly',
    'Weekly',
    'Biweekly',
    'Irregular',
  ];

  const allCategories: ExpenseCategory[] = [
    'Food',
    'Transport',
    'Education',
    'Shopping',
    'Entertainment',
    'Bills',
    'Healthcare',
    'Other',
  ];

  const toggleCategory = (cat: ExpenseCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleFinish = () => {
    completeOnboarding({
      mainGoal,
      incomeFrequency,
      expenseCategories: selectedCategories,
      savingsTarget,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
        {/* Progress header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Personalize PocketSmart
              </h3>
              <p className="text-[11px] text-slate-400">Step {step} of 4</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-6 h-1.5 rounded-full transition-colors ${
                  step >= i ? 'bg-teal-600' : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Main Goal */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              1. What is your main financial goal right now?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              We will tune your dashboard cards and AI suggestions around this target.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {goalOptions.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setMainGoal(g)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                    mainGoal === g
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span>{g}</span>
                  {mainGoal === g && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Income Frequency */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              2. What is your income frequency?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Helps PocketSmart calibrate weekly vs monthly spending pacing.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {frequencyOptions.map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setIncomeFrequency(freq)}
                  className={`p-4 rounded-xl border text-center text-xs font-medium transition-all ${
                    incomeFrequency === freq
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 font-bold'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <p className="text-sm font-semibold">{freq}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Major Expense Categories */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              3. What are your major everyday expense categories?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select all categories you regularly spend in:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {allCategories.map((cat) => {
                const selected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                      selected
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Savings Target */}
        {step === 4 && (
          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              4. What monthly savings target would you like to set?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This amount is reserved before variable expense allocations.
            </p>
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Monthly Target</span>
                <span className="text-base font-bold text-teal-600 dark:text-teal-400 font-mono tabular-nums">
                  {currency}{savingsTarget.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="50000"
                step="1000"
                value={savingsTarget}
                onChange={(e) => setSavingsTarget(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>{currency}2,000</span>
                <span>{currency}25,000</span>
                <span>{currency}50,000</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer shadow-sm shadow-teal-600/20"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Go to Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
