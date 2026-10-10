'use client';

import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatRupiah } from '@/lib/format';

interface MetricCardProps {
  title: string;
  amount: number;
  subtitle: string;
  icon: LucideIcon;
  variant?: 'emerald' | 'rose' | 'indigo' | 'amber';
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function MetricCard({
  title,
  amount,
  subtitle,
  icon: Icon,
  trend,
}: MetricCardProps) {
  return (
    <div className="fintech-card p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#141b2a] border border-slate-200 dark:border-[#202b40] flex items-center justify-center text-slate-700 dark:text-slate-300">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="my-1">
        <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight tabular-nums">
          {formatRupiah(amount)}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs pt-3 mt-2 border-t border-slate-200 dark:border-[#182030]">
        <span className="text-slate-500 dark:text-slate-400 truncate text-[11px]">{subtitle}</span>
        {trend && (
          <div
            className={`flex items-center gap-1 font-mono text-[11px] font-medium px-2 py-0.5 rounded-md ${
              trend.isPositive
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
            }`}
          >
            {trend.isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}
