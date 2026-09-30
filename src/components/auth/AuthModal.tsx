import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CurrencySymbol } from '../../types';
import { X, Lock, Mail, User, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, authMode, setAuthMode, login, signup } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState<CurrencySymbol>('₹');
  const [incomeRange, setIncomeRange] = useState<number>(35000);
  const [financialGoal, setFinancialGoal] = useState('Save for emergency fund & laptop');
  const [errorMsg, setErrorMsg] = useState('');

  if (!showAuthModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (authMode === 'signup') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMsg('Please enter a valid email address');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password should be at least 6 characters long');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match');
        return;
      }

      signup({
        name,
        email,
        currency,
        monthlyIncome: incomeRange,
        mainGoal: financialGoal,
      });
    } else if (authMode === 'login') {
      if (!email.trim()) {
        setErrorMsg('Please enter your email');
        return;
      }
      login(email, name || email.split('@')[0]);
    } else {
      // Forgot password demo
      setErrorMsg('Password reset instructions sent to your email.');
      setTimeout(() => {
        setAuthMode('login');
      }, 2000);
    }
  };

  const handleQuickDemo = () => {
    login('aarav.sharma@example.com', 'Aarav Sharma');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {authMode === 'signup'
              ? 'Create Your PocketSmart Account'
              : authMode === 'login'
              ? 'Welcome Back to PocketSmart'
              : 'Reset Your Password'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {authMode === 'signup'
              ? 'Start planning smart, spending better, and living better.'
              : authMode === 'login'
              ? 'Access your personal budgets, transactions, and AI insights.'
              : 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {/* One-Click Quick Demo Button */}
        <button
          onClick={handleQuickDemo}
          type="button"
          className="w-full mb-5 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold hover:bg-teal-100 transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Quick Demo Access (Aarav Sharma · ₹35,000)</span>
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-medium">
              or continue with email
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {authMode !== 'forgot' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          {authMode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencySymbol)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="₹">₹ INR (Rupees)</option>
                    <option value="$">$ USD (Dollars)</option>
                    <option value="€">€ EUR (Euros)</option>
                    <option value="£">£ GBP (Pounds)</option>
                    <option value="¥">¥ JPY (Yen)</option>
                    <option value="C$">C$ CAD (Canadian)</option>
                    <option value="A$">A$ AUD (Australian)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Est. Monthly Income
                  </label>
                  <select
                    value={incomeRange}
                    onChange={(e) => setIncomeRange(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 tabular-nums"
                  >
                    <option value={20000}>{currency}15,000 - {currency}25,000</option>
                    <option value={35000}>{currency}25,000 - {currency}50,000</option>
                    <option value={75000}>{currency}50,000 - {currency}1,00,000</option>
                    <option value={150000}>{currency}1,00,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Primary Financial Goal
                </label>
                <select
                  value={financialGoal}
                  onChange={(e) => setFinancialGoal(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Save money & build savings">Save money & build savings</option>
                  <option value="Control and reduce overspending">Control and reduce overspending</option>
                  <option value="Build an emergency fund">Build an emergency fund</option>
                  <option value="Manage recurring monthly expenses">Manage recurring monthly expenses</option>
                  <option value="Plan for a major purchase (gadget, bike)">Plan for a major purchase</option>
                  <option value="Track every rupee systematically">Track spending habits</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 mt-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shadow-sm shadow-teal-600/20 cursor-pointer"
          >
            {authMode === 'signup'
              ? 'Complete Sign Up'
              : authMode === 'login'
              ? 'Sign In to Dashboard'
              : 'Send Reset Link'}
          </button>
        </form>

        {/* Footer switchers */}
        <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
          {authMode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setAuthMode('signup')}
                className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
              >
                Sign up
              </button>
              <div className="mt-1">
                <button
                  onClick={() => setAuthMode('forgot')}
                  className="text-slate-400 hover:underline text-[11px]"
                >
                  Forgot password?
                </button>
              </div>
            </>
          ) : authMode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setAuthMode('login')}
                className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
              >
                Log in
              </button>
            </>
          ) : (
            <button
              onClick={() => setAuthMode('login')}
              className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              Back to Log In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
