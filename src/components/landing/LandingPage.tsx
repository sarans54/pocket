import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  ArrowRight,
  Sparkles,
  PieChart,
  Receipt,
  Target,
  BarChart3,
  Bot,
  Bell,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { login, setShowAuthModal, setAuthMode, setActiveTab } = useApp();

  const handleTryDemo = () => {
    login('aarav.sharma@example.com', 'Aarav Sharma');
    setActiveTab('dashboard');
  };

  const features = [
    {
      icon: PieChart,
      title: '1. Smart Budgeting',
      desc: 'Create personalized monthly and category budgets aligned with your income and real living habits.',
    },
    {
      icon: Receipt,
      title: '2. Expense Tracking',
      desc: 'Log and track everyday expenses with automatic categorization for UPI, cards, cash, and bank transfers.',
    },
    {
      icon: Sparkles,
      title: '3. AI Recommendations',
      desc: 'PocketSmart Intelligence analyzes spending shifts, detects anomalies, and explains practical savings actions.',
    },
    {
      icon: Target,
      title: '4. Financial Goals',
      desc: 'Set custom targets for gadgets, emergency funds, travel, or education with calculated monthly contributions.',
    },
    {
      icon: BarChart3,
      title: '5. Spending Insights',
      desc: 'Interactive visual breakdowns across categories, monthly trends, and recurring subscription totals.',
    },
    {
      icon: Bell,
      title: '6. Smart Alerts',
      desc: 'Gentle, non-judgmental warnings when categories approach 80% and 100% capacity before overspending occurs.',
    },
    {
      icon: Bot,
      title: '7. AI Assistant',
      desc: 'Ask questions in plain English grounded exclusively in your actual budget, receipts, and financial goals.',
    },
    {
      icon: BarChart3,
      title: '8. Reports & Analytics',
      desc: 'Generate weekly and monthly financial health summaries with ready-to-use CSV export and print views.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Add Income & Expenses',
      desc: 'Log daily transactions with instant AI category suggestions or review synced recurring bills.',
    },
    {
      num: '02',
      title: 'Set Budgets & Goals',
      desc: 'Define monthly limits per category and set targets for things you care about, like an emergency buffer.',
    },
    {
      num: '03',
      title: 'AI Analyzes Spending',
      desc: 'PocketSmart Intelligence examines velocity, variable vs fixed ratios, and identifies subscription creep.',
    },
    {
      num: '04',
      title: 'Receive Insights & Alerts',
      desc: 'Get plain-language explanations with actionable advice rather than confusing financial jargon.',
    },
    {
      num: '05',
      title: 'Track & Improve Habits',
      desc: 'Watch your savings rate increase month-over-month while feeling completely in command of your money.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-200 dark:border-slate-800">
        {/* Subtle Ambient Background Scrim */}
        <div className="absolute inset-0 -z-10 opacity-30 dark:opacity-20 pointer-events-none">
          <img
            src="/src/assets/images/hero_fintech_ambient_1790775691134.jpg"
            alt="Fintech Ambient"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-slate-50 to-slate-50 dark:from-slate-950/80 dark:via-slate-950 dark:to-slate-950" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-700 dark:text-teal-300">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <span>Next-Generation Personal Finance Companion</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] text-balance">
                Take Control of Your Money with AI
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                PocketSmart AI helps you understand your spending, build smarter budgets, and make better everyday financial decisions.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all shadow-md shadow-teal-600/20 active:scale-[0.98] cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleTryDemo}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-teal-500" />
                  <span>Try Interactive Demo</span>
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Zero invasive ads
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Private & isolated data
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Grounded AI reasoning
                </span>
              </div>
            </div>

            {/* Right Hero Visual: Animated Dashboard Preview */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xl shadow-slate-900/10">
                {/* Window header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
                    <span className="ml-2 font-semibold text-slate-700 dark:text-slate-300">
                      Live Dashboard Simulation
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">September 2026</span>
                </div>

                {/* Simulated Stat Cards */}
                <div className="grid grid-cols-3 gap-3 my-4">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] text-slate-500 font-medium">Monthly Income</p>
                    <p className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">₹35,000</p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium mt-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Regular</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] text-slate-500 font-medium">Total Spending</p>
                    <p className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">₹19,950</p>
                    <div className="flex items-center gap-1 text-[10px] text-teal-600 font-medium mt-1">
                      <span>57% of Budget</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] text-slate-500 font-medium">Net Savings</p>
                    <p className="text-base font-bold text-teal-600 dark:text-teal-400 tabular-nums mt-0.5">₹15,050</p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium mt-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>43% rate</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Visual Mini Chart & Progress */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 mb-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Budget Utilization Pace</span>
                    <span className="font-mono text-teal-600 dark:text-teal-400 font-semibold tabular-nums">₹15,050 remaining</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                    <div className="h-full bg-teal-500" style={{ width: '57%' }} />
                    <div className="h-full bg-slate-300 dark:bg-slate-600 flex-1" />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5">
                    <span>Spent: ₹19,950</span>
                    <span>Monthly Cap: ₹25,000</span>
                  </div>
                </div>

                {/* Simulated AI Recommendation Card */}
                <div className="p-3.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/50">
                  <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 text-xs font-semibold">
                    <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span>PocketSmart AI Intelligence</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-snug">
                    "Your spending is currently within your monthly budget. Food and transportation are your largest variable expenses this month."
                  </p>
                  <div className="flex items-center gap-2 mt-2.5">
                    <button
                      onClick={handleTryDemo}
                      className="px-2.5 py-1 text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 rounded-md hover:bg-teal-50"
                    >
                      View Details
                    </button>
                    <button
                      onClick={handleTryDemo}
                      className="px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    >
                      Adjust Budget
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section (8 features) */}
      <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
              Comprehensive Financial Engine
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl text-balance">
              Intelligent Tools Built for Real Life
            </p>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
              Designed for students, young professionals, and families seeking clarity, discipline, and calm over their finances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-2">
              Simple 5-Step Process
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
              How PocketSmart AI Works
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((st) => (
              <div
                key={st.num}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col"
              >
                <div className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono mb-2">
                  {st.num}
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
                  {st.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer & Transparency Section */}
      <section className="py-12 bg-white dark:bg-slate-900 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-4 text-left">
            <ShieldCheck className="w-8 h-8 text-teal-600 shrink-0" />
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong className="text-slate-900 dark:text-white block mb-0.5">
                Financial Planning Notice:
              </strong>
              PocketSmart AI is an educational budgeting and cashflow planning assistant, not a certified financial advisor or securities broker. AI insights and recommendations are suggestions based on your personal budget input and do not represent guaranteed financial returns.
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-teal-600" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">PocketSmart AI</span>
            <span>· Plan Smart. Spend Better. Live Better.</span>
          </div>
          <div>© {new Date().getFullYear()} PocketSmart AI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};
