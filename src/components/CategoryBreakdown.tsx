'use client';

import React from 'react';
import { CategorySummary } from '@/types';
import { formatRupiah } from '@/lib/format';
import { PieChart } from 'lucide-react';

interface CategoryBreakdownProps {
  categories: CategorySummary[];
  totalExpense: number;
}

export function CategoryBreakdown({ categories, totalExpense }: CategoryBreakdownProps) {
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  return (
    <div className="fintech-card p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
            Kategori Pengeluaran
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Alokasi beban belanja bulan ini
          </p>
        </div>
        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#141b2a] border border-slate-200 dark:border-[#202b40] flex items-center justify-center text-slate-500 dark:text-slate-400">
          <PieChart className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Progress Allocation Bar */}
      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#141b2a] overflow-hidden flex mb-5 p-0.5 gap-0.5">
        {expenseCategories.map((cat) => (
          <div
            key={cat.name}
            style={{
              width: `${Math.max(cat.percentage, 2)}%`,
              backgroundColor: cat.color || '#3b82f6',
            }}
            className="h-full rounded-sm transition-all"
            title={`${cat.name}: ${cat.percentage.toFixed(1)}% (${formatRupiah(cat.total)})`}
          />
        ))}
      </div>

      {/* Categories List */}
      <div className="space-y-2 flex-1 overflow-y-auto max-h-56 pr-1">
        {expenseCategories.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">Belum ada pengeluaran di periode ini.</p>
        ) : (
          expenseCategories.map((cat) => (
            <div
              key={cat.name}
              className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-[#0e1320] border border-slate-200 dark:border-[#182030] hover:border-slate-300 dark:hover:border-[#222e44] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color || '#3b82f6' }}
                />
                <div>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{cat.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1.5 font-mono">
                    ({cat.count})
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 font-mono">
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">{cat.percentage.toFixed(1)}%</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs tabular-nums">
                  {formatRupiah(cat.total)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-3 border-t border-slate-200 dark:border-[#182030] mt-3 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">Total Pengeluaran:</span>
        <span className="font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
          {formatRupiah(totalExpense)}
        </span>
      </div>
    </div>
  );
}
