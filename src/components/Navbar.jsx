import React from 'react';
import { ShieldAlert, Moon, Sun } from 'lucide-react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenJsonModal,
  onOpenCloakModal,
  onTriggerPanic,
  darkMode,
  setDarkMode,
  favoritesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark brand */}
        <button
          onClick={() => setActiveTab('all')}
          className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded cursor-pointer"
        >
          Dizzy Unblocked<span className="text-emerald-500">.</span>
        </button>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('all')}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
              activeTab === 'all' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'favorites' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''
            }`}
          >
            Favorites
            {favoritesCount > 0 && (
              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {favoritesCount}
              </span>
            )}
          </button>
          <button
            onClick={onOpenAddModal}
            className="whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Add Game
          </button>
          <button
            onClick={onOpenJsonModal}
            className="whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            JSON File
          </button>
          <button
            onClick={onOpenCloakModal}
            className="whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Tab Cloak
          </button>
        </nav>

        {/* Zone 3: 1 primary action (+ subtle theme toggle) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setDarkMode(prev => !prev)}
            aria-label="Toggle theme"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onTriggerPanic}
            title="Press Esc to trigger panic stealth screen"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Panic Mode (Esc)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
