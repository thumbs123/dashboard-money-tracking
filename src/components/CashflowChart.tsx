'use client';

import React, { useState } from 'react';
import { MonthlyTrend } from '@/types';
import { formatRupiah } from '@/lib/format';

interface CashflowChartProps {
  trends: MonthlyTrend[];
}

export function CashflowChart({ trends }: CashflowChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!trends || trends.length === 0) {
    return (
      <div className="fintech-card p-6 flex items-center justify-center h-72 text-slate-400 text-xs">
        Belum ada data riwayat arus kas.
      </div>
    );
  }

  const maxVal = Math.max(
    ...trends.flatMap((t) => [t.income, t.expense]),
    1_000_000
  );

  return (
    <div className="fintech-card p-6 flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
              Dinamika Arus Kas (Cashflow)
            </h3>
            <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#141b2a] border border-slate-200 dark:border-[#202b40] px-1.5 py-0.5 rounded">
              6 Bulan
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Komparasi pemasukan dan pengeluaran per siklus bulanan.
          </p>
        </div>

        {/* Minimal Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">Pemasukan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
            <span className="text-slate-600 dark:text-slate-300">Pengeluaran</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="relative h-60 flex items-end justify-between gap-3 pt-4 px-2">
        {/* Subtle horizontal grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7">
          <div className="border-b border-slate-200 dark:border-[#182030] border-dashed w-full" />
          <div className="border-b border-slate-200 dark:border-[#182030] border-dashed w-full" />
          <div className="border-b border-slate-200 dark:border-[#182030] border-dashed w-full" />
          <div className="border-b border-slate-200 dark:border-[#182030] w-full" />
        </div>

        {trends.map((item, idx) => {
          const incHeight = Math.max((item.income / maxVal) * 100, 3);
          const expHeight = Math.max((item.expense / maxVal) * 100, 3);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={item.month}
              className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip HUD */}
              {isHovered && (
                <div className="absolute -top-16 z-30 bg-white dark:bg-[#0e1320] border border-slate-200 dark:border-[#222e44] rounded-lg p-2.5 shadow-xl min-w-[140px] pointer-events-none">
                  <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 mb-1 border-b border-slate-100 dark:border-[#182030] pb-1 font-mono">
                    {item.monthLabel}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                    <span>Masuk:</span>
                    <span>{formatRupiah(item.income, true)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-rose-600 dark:text-rose-400 font-mono">
                    <span>Keluar:</span>
                    <span>{formatRupiah(item.expense, true)}</span>
                  </div>
                </div>
              )}

              {/* Bars */}
              <div className="w-full flex items-end justify-center gap-1.5 h-44 pb-1">
                <div
                  style={{ height: `${incHeight}%` }}
                  className={`w-3.5 sm:w-5 rounded-t-sm bg-emerald-500 transition-all ${
                    isHovered ? 'bg-emerald-400' : 'opacity-90'
                  }`}
                />
                <div
                  style={{ height: `${expHeight}%` }}
                  className={`w-3.5 sm:w-5 rounded-t-sm bg-rose-500 transition-all ${
                    isHovered ? 'bg-rose-400' : 'opacity-90'
                  }`}
                />
              </div>

              {/* Month Label */}
              <span
                className={`text-[11px] font-mono mt-2 transition-colors ${
                  isHovered
                    ? 'text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.monthLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
