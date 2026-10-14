'use client';

import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  BarChart3,
  Wallet,
  FileSpreadsheet,
  Send,
  ExternalLink,
  LogOut,
  User,
  X,
} from 'lucide-react';
import { UserProfile } from '@/types';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isLiveDb: boolean;
  currentUser?: UserProfile | null;
  onLogout: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  currentTab,
  onTabChange,
  isLiveDb,
  currentUser,
  onLogout,
  mobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const navItems = [
    { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'transactions', label: 'Buku Transaksi', icon: ReceiptText },
    { id: 'analytics', label: 'Arus Kas', icon: BarChart3 },
    { id: 'wallets', label: 'Akun & Saldo', icon: Wallet },
  ];

  const handleNavClick = (id: string) => {
    onTabChange(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Element (Drawer on Mobile, Sticky Column on Desktop) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 flex-shrink-0 flex flex-col bg-white dark:bg-[#090c15] border-r border-slate-200 dark:border-[#1c2436] px-3.5 py-4 select-none z-50 md:z-30 transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-sm tracking-tight shadow-sm">
              F
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-semibold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
                  FinAssist
                </h1>
                <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#141b2a] border border-slate-200 dark:border-[#202b40] px-1 py-0.2 rounded">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Financial Management</p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141b2a] transition-colors"
            aria-label="Tutup navigasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 space-y-1">
          <p className="px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 font-mono">
            Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-100 dark:bg-[#141b2a] text-slate-900 dark:text-white border border-slate-200 dark:border-[#222e44] shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#101522]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400'}`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-5">
            <p className="px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 font-mono">
              Tautan Cepat
            </p>
            <a
              href="https://t.me/freenancial_bot"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#101522] transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Send className="w-3.5 h-3.5 text-slate-400" />
                <span>Chat Telegram</span>
              </div>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
            </a>

            <a
              href="https://sheets.google.com"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#101522] transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                <span>Spreadsheet Rekap</span>
              </div>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
            </a>
          </div>
        </div>

        {/* Footer Area: User Profile & Database Status */}
        <div className="pt-3 border-t border-slate-200 dark:border-[#1c2436] space-y-2 mt-auto">
          {currentUser && (
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#101522] border border-slate-200 dark:border-[#1c2436] flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-md bg-slate-200 dark:bg-[#161f30] border border-slate-300 dark:border-[#222e44] flex items-center justify-center text-slate-700 dark:text-slate-300 flex-shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-900 dark:text-slate-200 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                    ID: {currentUser.telegramId}
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Keluar Akun"
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-[#161f30] transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="px-2 py-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Engine DB:</span>
            <div className="flex items-center gap-1.5 font-mono">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isLiveDb ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span className={isLiveDb ? 'text-slate-700 dark:text-slate-300' : 'text-amber-500'}>
                {isLiveDb ? 'PostgreSQL' : 'Simulasi'}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
