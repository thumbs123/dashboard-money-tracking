'use client';

import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '@/types';
import { formatRupiah, formatDateIndo } from '@/lib/format';
import { Search, ArrowUpRight, ArrowDownRight, ReceiptText } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [limit, setLimit] = useState(15);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const descMatch = (t.description || '').toLowerCase().includes(q);
        const merchMatch = (t.merchant || '').toLowerCase().includes(q);
        const catMatch = (t.category || '').toLowerCase().includes(q);
        const accMatch = (t.account || '').toLowerCase().includes(q);
        return descMatch || merchMatch || catMatch || accMatch;
      }
      return true;
    });
  }, [transactions, filterType, searchQuery]);

  const displayed = filtered.slice(0, limit);

  return (
    <div className="fintech-card p-6">
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
              Buku Transaksi
            </h3>
            <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#141b2a] border border-slate-200 dark:border-[#202b40] px-1.5 py-0.5 rounded">
              {filtered.length} entri
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log mutasi masuk dan keluar yang tercatat dari bot.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari deskripsi, merchant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0c101c] border border-slate-200 dark:border-[#1c2436] focus:border-emerald-500/60 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Filter Type Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-[#0c101c] p-0.5 rounded-lg border border-slate-200 dark:border-[#1c2436] text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-white dark:bg-[#182030] text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterType === 'expense'
                  ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Pengeluaran
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                filterType === 'income'
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Pemasukan
            </button>
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#182030] text-slate-500 dark:text-slate-400 text-[11px] font-mono">
              <th className="pb-2.5 pl-2 font-medium">TRANSAKSI & MERCHANT</th>
              <th className="pb-2.5 font-medium">KATEGORI</th>
              <th className="pb-2.5 font-medium">AKUN</th>
              <th className="pb-2.5 font-medium">TANGGAL</th>
              <th className="pb-2.5 pr-2 text-right font-medium">NOMINAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#141b2a]">
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  <ReceiptText className="w-6 h-6 mx-auto mb-1.5 opacity-30" />
                  <p className="text-xs">Tidak ada data transaksi yang cocok.</p>
                </td>
              </tr>
            ) : (
              displayed.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-[#121826] transition-colors">
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                            isIncome
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                              : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">
                            {tx.description}
                          </p>
                          {tx.merchant && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">{tx.merchant}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-[#141b2a] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#202b40]">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400 text-xs">
                      {tx.account || 'Kas Utama'}
                    </td>
                    <td className="py-3 text-slate-500 dark:text-slate-400 text-[11px] font-mono">
                      {formatDateIndo(tx.date)}
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <span
                        className={`font-mono font-medium text-xs tabular-nums ${
                          isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-200'
                        }`}
                      >
                        {isIncome ? '+' : '-'}{formatRupiah(tx.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > limit && (
        <div className="pt-3 mt-1 border-t border-slate-200 dark:border-[#182030] flex items-center justify-center">
          <button
            onClick={() => setLimit((prev) => prev + 15)}
            className="text-[11px] font-mono text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-1 px-3 rounded bg-slate-100 dark:bg-[#141b2a] hover:bg-slate-200 dark:hover:bg-[#1a2336] transition-colors border border-slate-200 dark:border-[#202b40]"
          >
            Tampilkan 15 Lagi ({filtered.length - limit} tersisa)
          </button>
        </div>
      )}
    </div>
  );
}
