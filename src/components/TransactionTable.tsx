'use client';

import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '@/types';
import { formatRupiah, formatDateIndo } from '@/lib/format';
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  ReceiptText,
  Download,
  ArrowUpDown,
  X,
} from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
}

type SortField = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortField>('date-desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [limit, setLimit] = useState(15);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, [transactions]);

  const filtered = useMemo(() => {
    let list = transactions.filter((t) => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
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

    list = [...list].sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

    return list;
  }, [transactions, filterType, selectedCategory, searchQuery, sortBy]);

  const displayed = filtered.slice(0, limit);

  // Export to CSV function (zero dependency, native browser Blob)
  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ['ID', 'Tanggal', 'Tipe', 'Deskripsi', 'Merchant', 'Kategori', 'Akun', 'Nominal (IDR)'];
    const rows = filtered.map((t) => [
      t.id,
      t.date,
      t.type,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      `"${(t.merchant || '').replace(/"/g, '""')}"`,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      `"${(t.account || '').replace(/"/g, '""')}"`,
      t.amount,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `finassist-transaksi-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fintech-card p-4 sm:p-6">
      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3.5 mb-5">
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

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[160px] sm:w-52">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0c101c] border border-slate-200 dark:border-[#1c2436] focus:border-emerald-500/60 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter Type Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-[#0c101c] p-0.5 rounded-lg border border-slate-200 dark:border-[#1c2436] text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white dark:bg-[#182030] text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                filterType === 'expense'
                  ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Keluar
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                filterType === 'income'
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Masuk
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-100 dark:bg-[#0c101c] border border-slate-200 dark:border-[#1c2436] rounded-lg px-2 py-1.5 text-[11px] text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-white dark:bg-[#101522] text-slate-900 dark:text-slate-200">
                {cat}
              </option>
            ))}
          </select>

          {/* Sort Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-[#0c101c] border border-slate-200 dark:border-[#1c2436] rounded-lg px-2 py-1.5 text-[11px] text-slate-700 dark:text-slate-200">
            <ArrowUpDown className="w-3 h-3 text-slate-400 mr-1.5 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortField)}
              className="bg-transparent border-none text-[11px] text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="date-desc" className="bg-white dark:bg-[#101522]">Terbaru</option>
              <option value="date-asc" className="bg-white dark:bg-[#101522]">Terlama</option>
              <option value="amount-desc" className="bg-white dark:bg-[#101522]">Nominal Terbesar</option>
              <option value="amount-asc" className="bg-white dark:bg-[#101522]">Nominal Terkecil</option>
            </select>
          </div>

          {/* CSV Export Button */}
          <button
            onClick={handleExportCSV}
            title="Download CSV"
            className="p-1.5 sm:px-2.5 sm:py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#101522] dark:hover:bg-[#151c2c] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1c2436] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline text-[11px] font-mono">CSV</span>
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full text-left text-xs min-w-[560px] sm:min-w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#182030] text-slate-500 dark:text-slate-400 text-[11px] font-mono">
              <th className="pb-2.5 pl-3 font-medium">TRANSAKSI & MERCHANT</th>
              <th className="pb-2.5 font-medium">KATEGORI</th>
              <th className="pb-2.5 font-medium">AKUN</th>
              <th className="pb-2.5 font-medium">TANGGAL</th>
              <th className="pb-2.5 pr-3 text-right font-medium">NOMINAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#141b2a]">
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-slate-400">
                  <ReceiptText className="w-6 h-6 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Tidak ada data transaksi yang cocok dengan filter.</p>
                </td>
              </tr>
            ) : (
              displayed.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-[#121826] transition-colors">
                    <td className="py-3 pl-3">
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
                    <td className="py-3 pr-3 text-right">
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
        <div className="pt-3.5 mt-1 border-t border-slate-200 dark:border-[#182030] flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400 font-mono">
            Menampilkan {displayed.length} dari {filtered.length} data
          </span>
          <button
            onClick={() => setLimit((prev) => prev + 15)}
            className="text-[11px] font-mono text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white py-1 px-3 rounded-md bg-slate-100 dark:bg-[#141b2a] hover:bg-slate-200 dark:hover:bg-[#1a2336] transition-colors border border-slate-200 dark:border-[#202b40] cursor-pointer"
          >
            Muat 15 Lagi
          </button>
        </div>
      )}
    </div>
  );
}
