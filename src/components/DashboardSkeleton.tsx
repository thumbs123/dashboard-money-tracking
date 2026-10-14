'use client';

import React from 'react';

export function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#090c15] text-slate-900 dark:text-slate-100 font-sans">
      {/* Sidebar Skeleton (Desktop) */}
      <aside className="w-64 flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0 bg-white dark:bg-[#090c15] border-r border-slate-200 dark:border-[#1c2436] px-4 py-4 space-y-6">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-[#141b2a] animate-pulse" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 w-20 bg-slate-200 dark:bg-[#141b2a] rounded animate-pulse" />
            <div className="h-2.5 w-14 bg-slate-100 dark:bg-[#101522] rounded animate-pulse" />
          </div>
        </div>

        <div className="space-y-2 flex-1 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-full bg-slate-100 dark:bg-[#101522] rounded-lg animate-pulse" />
          ))}
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-[#1c2436] space-y-2">
          <div className="h-12 w-full bg-slate-100 dark:bg-[#101522] rounded-lg animate-pulse" />
        </div>
      </aside>

      {/* Main Content Area Skeleton */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Skeleton */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#090c15]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#1c2436] px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="h-5 w-36 bg-slate-200 dark:bg-[#141b2a] rounded animate-pulse" />
            <div className="h-3 w-56 bg-slate-100 dark:bg-[#101522] rounded animate-pulse hidden sm:block" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-slate-200 dark:bg-[#141b2a] rounded-lg animate-pulse" />
            <div className="h-8 w-32 bg-slate-200 dark:bg-[#141b2a] rounded-lg animate-pulse" />
          </div>
        </header>

        {/* Content Body Skeleton */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="fintech-card p-5 space-y-3 border border-slate-200 dark:border-[#1c2436] bg-white dark:bg-[#101522]"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3 w-28 bg-slate-200 dark:bg-[#161f30] rounded animate-pulse" />
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#141b2a] animate-pulse" />
                </div>
                <div className="h-7 w-36 bg-slate-200 dark:bg-[#182236] rounded animate-pulse" />
                <div className="h-3 w-24 bg-slate-100 dark:bg-[#121826] rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Row 2: Chart & Accounts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 fintech-card p-6 border border-slate-200 dark:border-[#1c2436] bg-white dark:bg-[#101522] space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-slate-200 dark:bg-[#161f30] rounded animate-pulse" />
                <div className="h-4 w-20 bg-slate-100 dark:bg-[#121826] rounded animate-pulse" />
              </div>
              <div className="h-56 w-full bg-slate-50 dark:bg-[#0c101c] rounded-xl border border-slate-100 dark:border-[#141b28] animate-pulse" />
            </div>
            <div className="lg:col-span-1 fintech-card p-6 border border-slate-200 dark:border-[#1c2436] bg-white dark:bg-[#101522] space-y-3">
              <div className="h-4 w-28 bg-slate-200 dark:bg-[#161f30] rounded animate-pulse" />
              <div className="h-24 w-full bg-slate-50 dark:bg-[#0c101c] rounded-xl animate-pulse" />
              <div className="space-y-2 pt-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-10 w-full bg-slate-100 dark:bg-[#121826] rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Transactions & Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 fintech-card p-6 border border-slate-200 dark:border-[#1c2436] bg-white dark:bg-[#101522] space-y-4">
              <div className="h-4 w-36 bg-slate-200 dark:bg-[#161f30] rounded animate-pulse" />
              <div className="space-y-2.5">
                {[1, 2, 3, 4, 5].map((k) => (
                  <div key={k} className="h-11 w-full bg-slate-50 dark:bg-[#0c101c] rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-1 fintech-card p-6 border border-slate-200 dark:border-[#1c2436] bg-white dark:bg-[#101522] space-y-4">
              <div className="h-4 w-32 bg-slate-200 dark:bg-[#161f30] rounded animate-pulse" />
              <div className="h-2.5 w-full bg-slate-100 dark:bg-[#141b2a] rounded-full animate-pulse" />
              <div className="space-y-2 pt-2">
                {[1, 2, 3, 4].map((m) => (
                  <div key={m} className="h-9 w-full bg-slate-50 dark:bg-[#0c101c] rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
