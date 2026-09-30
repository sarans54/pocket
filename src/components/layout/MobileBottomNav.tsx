import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, Receipt, PieChart, Target, Bot, Plus } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, isAuthenticated, setShowTransactionModal, setDefaultTransactionType } = useApp();

  if (!isAuthenticated) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
          activeTab === 'dashboard' ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => setActiveTab('transactions')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
          activeTab === 'transactions' ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Receipt className="w-5 h-5" />
        <span>History</span>
      </button>

      {/* Center Floating Plus CTA */}
      <button
        onClick={() => {
          setDefaultTransactionType('expense');
          setShowTransactionModal(true);
        }}
        className="flex items-center justify-center w-11 h-11 -mt-4 rounded-full bg-teal-600 text-white shadow-md shadow-teal-600/30 hover:bg-teal-700 active:scale-95 transition-transform"
        aria-label="Add Transaction"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      <button
        onClick={() => setActiveTab('budget')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
          activeTab === 'budget' ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <PieChart className="w-5 h-5" />
        <span>Budget</span>
      </button>

      <button
        onClick={() => setActiveTab('assistant')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
          activeTab === 'assistant' ? 'text-teal-600 dark:text-teal-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        <Bot className="w-5 h-5" />
        <span>Assistant</span>
      </button>
    </div>
  );
};
