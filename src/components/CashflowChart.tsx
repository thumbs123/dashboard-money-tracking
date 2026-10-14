'use client';

import React, { useState } from 'react';
import { MonthlyTrend } from '@/types';
import { formatRupiah } from '@/lib/format';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
              Dinamika Arus Kas (Cashflow)
            </h3>
            <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#141b2a] border border-slate-200 dark:border-[#202b40] px-1.5 py-0.5 rounded">
              {trends.length} Bulan
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
      <div className="relative h-64 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
        {/* Subtle horizontal grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-4">
          <div className="border-b border-slate-200/60 dark:border-[#182030] border-dashed w-full" />
          <div className="border-b border-slate-200/60 dark:border-[#182030] border-dashed w-full" />
          <div className="border-b border-slate-200/60 dark:border-[#182030] border-dashed w-full" />
          <div className="border-b border-slate-200 dark:border-[#182030] w-full" />
        </div>

        {trends.map((item, idx) => {
          const incHeight = Math.max((item.income / maxVal) * 100, 4);
          const expHeight = Math.max((item.expense / maxVal) * 100, 4);
          const isHovered = hoveredIdx === idx;
          const netDiff = item.income - item.expense;
          const isNetPositive = netDiff >= 0;

          return (
            <div
              key={item.month}
              className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip HUD Card */}
              {isHovered && (
                <div className="absolute -top-20 z-30 bg-white dark:bg-[#0c101c] border border-slate-200 dark:border-[#1e2638] rounded-xl p-3 shadow-xl min-w-[160px] pointer-events-none transform -translate-y-1 transition-transform">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#182030] pb-1.5 mb-1.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white font-mono">
                      {item.monthLabel}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-medium ${
                        isNetPositive ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {isNetPositive ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                      {formatRupiah(Math.abs(netDiff), true)}
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px] font-mono">
                    <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                      <span>Pemasukan:</span>
                      <span className="font-semibold">{formatRupiah(item.income, true)}</span>
                    </div>
                    <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
                      <span>Pengeluaran:</span>
                      <span className="font-semibold">{formatRupiah(item.expense, true)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Chart Bars with Active Hover States */}
              <div className="w-full flex items-end justify-center gap-1.5 sm:gap-2 h-44 pb-1">
                <div
                  style={{ height: `${incHeight}%` }}
                  className={`w-3 sm:w-5 rounded-t-sm bg-emerald-500 transition-all ${
                    isHovered ? 'bg-emerald-400 brightness-110 shadow-sm' : 'opacity-85'
                  }`}
                />
                <div
                  style={{ height: `${expHeight}%` }}
                  className={`w-3 sm:w-5 rounded-t-sm bg-rose-500 transition-all ${
                    isHovered ? 'bg-rose-400 brightness-110 shadow-sm' : 'opacity-85'
                  }`}
                />
              </div>

              {/* Month Label with Tabular Styling */}
              <span
                className={`text-[11px] font-mono mt-2 transition-colors ${
                  isHovered
                    ? 'text-slate-950 dark:text-white font-bold'
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
