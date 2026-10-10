'use client';

import React from 'react';
import { RefreshCw, Calendar, ExternalLink, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/useTheme';

interface HeaderProps {
  selectedMonth: string;
  onMonthChange: (m: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  lastSyncTime: string;
}

export function Header({
  selectedMonth,
  onMonthChange,
  onRefresh,
  isLoading,
  lastSyncTime,
}: HeaderProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  const months = [
    { value: '2026-10', label: 'Oktober 2026' },
    { value: '2026-09', label: 'September 2026' },
    { value: '2026-08', label: 'Agustus 2026' },
    { value: '2026-07', label: 'Juli 2026' },
    { value: '2026-06', label: 'Juni 2026' },
    { value: '2026-05', label: 'Mei 2026' },
  ];

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-[#090c15]/95 backdrop-blur-sm border-b border-slate-200 dark:border-[#1c2436] px-8 py-3.5 flex items-center justify-between transition-colors">
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Ikhtisar Keuangan
          </h2>
          <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#121826] px-2 py-0.5 rounded border border-slate-200 dark:border-[#1e2638]">
            IDR
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Arus kas, ledger transaksi, dan neraca akun real-time.
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
          title={theme === 'dark' ? 'Beralih ke Tema Terang' : 'Beralih ke Tema Gelap'}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#101522] dark:hover:bg-[#151c2c] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1c2436] p-2 rounded-lg text-xs font-medium transition-all"
        >
          {mounted ? (
            theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-700" />
            )
          ) : (
            <Sun className="w-3.5 h-3.5 opacity-0" />
          )}
        </button>

        {/* Month Selector */}
        <div className="relative flex items-center bg-slate-100 dark:bg-[#101522] border border-slate-200 dark:border-[#1c2436] rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="bg-transparent border-none text-slate-700 dark:text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
          >
            {months.map((m) => (
              <option
                key={m.value}
                value={m.value}
                className="bg-white dark:bg-[#101522] text-slate-900 dark:text-slate-200"
              >
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Refresh Sync Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#101522] dark:hover:bg-[#151c2c] active:scale-95 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1c2436] px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
          title={`Sinkronisasi terakhir: ${lastSyncTime}`}
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-500' : 'text-slate-400'}`}
          />
          <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
            {lastSyncTime}
          </span>
        </button>

        {/* Telegram Quick Launch */}
        <a
          href="https://t.me/freenancial_bot"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#141b2a] dark:hover:bg-[#1a2336] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#202b40] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          <span>Bot Telegram</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>
    </header>
  );
}
