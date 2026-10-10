'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { MetricCard } from '@/components/MetricCard';
import { CashflowChart } from '@/components/CashflowChart';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';
import { AccountsWidget } from '@/components/AccountsWidget';
import { TransactionTable } from '@/components/TransactionTable';
import { DashboardOverview } from '@/types';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Send,
  ExternalLink,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async (month: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/overview?month=${encodeURIComponent(month)}`);
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (res.ok) {
        const json = await res.json();
        if (!json.currentUser) {
          router.push('/login');
          return;
        }
        setData(json);
      } else {
        router.push('/login');
      }
    } catch {
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData(selectedMonth);
  }, [selectedMonth, loadData]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/login');
    }
  };

  // Auth checking skeleton view
  if (!data) {
    return (
      <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#090c15] text-slate-800 dark:text-slate-100 items-center justify-center p-6 transition-colors">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center font-mono font-bold animate-pulse text-sm">
            F
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Memverifikasi sesi & memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#090c15] text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isLiveDb={data.isLiveDb}
        currentUser={data.currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          onRefresh={() => loadData(selectedMonth)}
          isLoading={isLoading}
          lastSyncTime={data.lastSyncTime}
        />

        <div className="p-8 space-y-7 max-w-7xl mx-auto w-full">
          {/* Top 4 KPI Metric Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="TOTAL SALDO TERKONSOLIDASI"
              amount={data.totalBalance}
              subtitle={`${data.accounts.length} Akun Terdata`}
              icon={Wallet}
              trend={{ value: 'Stabil', isPositive: true }}
            />
            <MetricCard
              title="PEMASUKAN BULANAN"
              amount={data.monthlyIncome}
              subtitle="Arus Kas Masuk"
              icon={TrendingUp}
              trend={{ value: '+14.2%', isPositive: true }}
            />
            <MetricCard
              title="PENGELUARAN BULANAN"
              amount={data.monthlyExpense}
              subtitle={`${data.transactionCount} Transaksi`}
              icon={TrendingDown}
              trend={{ value: '-8.5%', isPositive: false }}
            />
            <MetricCard
              title="NET SAVINGS / SISA"
              amount={data.monthlyNet}
              subtitle={`Rasio Tabungan ${data.savingsRate.toFixed(1)}%`}
              icon={PiggyBank}
              trend={{ value: `${data.savingsRate.toFixed(0)}% Tersimpan`, isPositive: true }}
            />
          </section>

          {/* Conditional / Tab Sections */}
          {currentTab === 'overview' && (
            <>
              {/* Analytics & Wallets Row */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <CashflowChart trends={data.trends} />
                </div>
                <div className="lg:col-span-1">
                  <AccountsWidget
                    accounts={data.accounts}
                    totalBalance={data.totalBalance}
                  />
                </div>
              </section>

              {/* Transactions & Categories Row */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TransactionTable transactions={data.recentTransactions} />
                </div>
                <div className="lg:col-span-1 space-y-6">
                  <CategoryBreakdown
                    categories={data.categories}
                    totalExpense={data.monthlyExpense}
                  />

                  {/* Telegram Helper Card */}
                  <div className="fintech-card p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white tracking-tight">
                          Format Pesan Catat Bot
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Contoh format input Telegram</p>
                      </div>
                      <Send className="w-3.5 h-3.5 text-slate-400" />
                    </div>

                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="p-2 rounded bg-slate-50 dark:bg-[#0b0e18] border border-slate-200 dark:border-[#182030] flex items-center justify-between">
                        <span className="text-slate-800 dark:text-slate-200">makan siang 25rb bca</span>
                        <span className="text-[10px] text-rose-600 dark:text-rose-400">Pengeluaran</span>
                      </div>
                      <div className="p-2 rounded bg-slate-50 dark:bg-[#0b0e18] border border-slate-200 dark:border-[#182030] flex items-center justify-between">
                        <span className="text-slate-800 dark:text-slate-200">gaji 10jt mandiri</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Pemasukan</span>
                      </div>
                      <div className="p-2 rounded bg-slate-50 dark:bg-[#0b0e18] border border-slate-200 dark:border-[#182030] flex items-center justify-between">
                        <span className="text-slate-800 dark:text-slate-200">/rekap</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">Google Sheets</span>
                      </div>
                    </div>

                    <a
                      href="https://t.me/freenancial_bot"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3.5 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#141b2a] dark:hover:bg-[#1a2336] text-[11px] font-medium text-slate-800 dark:text-slate-200 transition-colors border border-slate-200 dark:border-[#202b40]"
                    >
                      <span>Buka Obrolan Bot</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                </div>
              </section>
            </>
          )}

          {currentTab === 'transactions' && (
            <section className="space-y-6">
              <TransactionTable transactions={data.recentTransactions} />
            </section>
          )}

          {currentTab === 'analytics' && (
            <section className="space-y-6">
              <CashflowChart trends={data.trends} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CategoryBreakdown
                  categories={data.categories}
                  totalExpense={data.monthlyExpense}
                />
                <AccountsWidget
                  accounts={data.accounts}
                  totalBalance={data.totalBalance}
                />
              </div>
            </section>
          )}

          {currentTab === 'wallets' && (
            <section className="space-y-6">
              <AccountsWidget
                accounts={data.accounts}
                totalBalance={data.totalBalance}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
