import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sun,
  Moon,
  Monitor,
  Bell,
  Lock,
  Globe,
  Database,
  RotateCcw,
  Trash2,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { CurrencySymbol } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetToDemoData,
    clearAllData,
    transactions,
    budget,
    goals,
    recurringExpenses,
    user,
  } = useApp();

  const handleExportJSON = () => {
    const backupData = {
      user,
      transactions,
      budget,
      goals,
      recurringExpenses,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `pocketsmart_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Application Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Customize visual theme, smart alert triggers, localized date formats, and storage.
        </p>
      </div>

      {/* 1. Appearance Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Appearance & Theme</h3>
          <p className="text-xs text-slate-500 mt-0.5">Choose your preferred visual presentation</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => updateSettings({ theme: 'light' })}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
              settings.theme === 'light'
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 ring-2 ring-teal-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span>Light Mode</span>
          </button>

          <button
            type="button"
            onClick={() => updateSettings({ theme: 'dark' })}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
              settings.theme === 'dark'
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 ring-2 ring-teal-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <span>Dark Mode</span>
          </button>

          <button
            type="button"
            onClick={() => updateSettings({ theme: 'system' })}
            className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
              settings.theme === 'system'
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-200 ring-2 ring-teal-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Monitor className="w-5 h-5 text-slate-500" />
            <span>System Auto</span>
          </button>
        </div>
      </div>

      {/* 2. Notification Preferences */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Smart Alert Notifications</h3>
          <p className="text-xs text-slate-500 mt-0.5">Control which automated financial triggers alert you</p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
          <div className="flex items-center justify-between pt-2">
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Budget Threshold Alerts</h4>
              <p className="text-[11px] text-slate-500">Notify when category spending crosses 80% or 100% capacity</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.budgetAlerts}
              onChange={(e) =>
                updateSettings({
                  notifications: { ...settings.notifications, budgetAlerts: e.target.checked },
                })
              }
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Goal Contribution Reminders</h4>
              <p className="text-[11px] text-slate-500">Alert on monthly milestones and scheduled goal targets</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.goalReminders}
              onChange={(e) =>
                updateSettings({
                  notifications: { ...settings.notifications, goalReminders: e.target.checked },
                })
              }
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Recurring Bill Reminders</h4>
              <p className="text-[11px] text-slate-500">Notice 3 days before upcoming subscription and utility dues</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.recurringReminders}
              onChange={(e) =>
                updateSettings({
                  notifications: { ...settings.notifications, recurringReminders: e.target.checked },
                })
              }
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Weekly Summary Digest</h4>
              <p className="text-[11px] text-slate-500">Weekly recap of savings velocity and spending trends</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.monthlyReports}
              onChange={(e) =>
                updateSettings({
                  notifications: { ...settings.notifications, monthlyReports: e.target.checked },
                })
              }
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Regional Formatting */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Regional & Date Preferences</h3>
          <p className="text-xs text-slate-500 mt-0.5">Customize calendar cycles and display formats</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Date Format
            </label>
            <select
              value={settings.preferences.dateFormat}
              onChange={(e) =>
                updateSettings({
                  preferences: { ...settings.preferences, dateFormat: e.target.value as any },
                })
              }
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="YYYY-MM-DD">YYYY-MM-DD (Standard ISO)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (UK / India)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (US Format)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Budget Month Start Day
            </label>
            <select
              value={settings.preferences.firstDayOfMonth}
              onChange={(e) =>
                updateSettings({
                  preferences: { ...settings.preferences, firstDayOfMonth: Number(e.target.value) },
                })
              }
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value={1}>1st of each month (Standard)</option>
              <option value={5}>5th of each month (Salary cycle)</option>
              <option value={10}>10th of each month</option>
              <option value={15}>15th of each month (Mid-month)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Data Management & Prototype Tools */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Data Management</h3>
          <p className="text-xs text-slate-500 mt-0.5">Export backups, restore sample data, or wipe stored records</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={resetToDemoData}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 border border-teal-200 dark:border-teal-800 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Load Demo Data</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup JSON</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your transactions and goals?')) {
                clearAllData();
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200 dark:border-rose-900 rounded-xl transition-colors cursor-pointer ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Ledger Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
