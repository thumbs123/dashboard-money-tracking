'use client';

import React from 'react';
import { AccountSummary } from '@/types';
import { formatRupiah } from '@/lib/format';
import { Wallet, CreditCard, Landmark, Coins } from 'lucide-react';

interface AccountsWidgetProps {
  accounts: AccountSummary[];
  totalBalance: number;
}

export function AccountsWidget({ accounts, totalBalance }: AccountsWidgetProps) {
  const getIcon = (type?: string, name?: string) => {
    const n = (name || '').toLowerCase();
    if (n.includes('bank') || n.includes('bca') || n.includes('mandiri') || n.includes('bni') || n.includes('bri')) {
      return Landmark;
    }
    if (n.includes('gopay') || n.includes('ovo') || n.includes('dana') || n.includes('shopeepay')) {
      return CreditCard;
    }
    return Coins;
  };

  return (
    <div className="fintech-card p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
            Akun & Saldo Riil
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar saldo per kantong / rekening
          </p>
        </div>
        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#141b2a] border border-slate-200 dark:border-[#202b40] flex items-center justify-center text-slate-500 dark:text-slate-400">
          <Wallet className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Net Worth Showcase Box */}
      <div className="rounded-xl bg-slate-50 dark:bg-[#0c101c] border border-slate-200 dark:border-[#182030] p-4 mb-4">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
          <span className="font-mono tracking-wider uppercase">Total Saldo Terkonsolidasi</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">Aktif</span>
        </div>
        <div className="text-xl font-bold font-mono text-slate-900 dark:text-white tracking-tight tabular-nums">
          {formatRupiah(totalBalance)}
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2.5 mt-2.5 border-t border-slate-200 dark:border-[#161e2e]">
          <span>{accounts.length} Akun Terdata</span>
          <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">Sync Otomatis</span>
        </div>
      </div>

      {/* Account Items List */}
      <div className="space-y-1.5 flex-1">
        {accounts.map((acc) => {
          const Icon = getIcon(acc.type, acc.name);
          return (
            <div
              key={acc.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-[#0e1320] border border-slate-200 dark:border-[#182030] hover:border-slate-300 dark:hover:border-[#222e44] transition-colors text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-slate-200 dark:bg-[#141b2a] border border-slate-300 dark:border-[#1e2638] flex items-center justify-center text-slate-700 dark:text-slate-300">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 dark:text-slate-200 text-xs">{acc.name}</h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{acc.type || 'Akun'}</span>
                </div>
              </div>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums text-xs">
                {formatRupiah(acc.balance)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
