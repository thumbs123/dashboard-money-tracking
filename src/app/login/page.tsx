'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Shield, AlertCircle, HelpCircle, Lock, Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '@/lib/useTheme';

export default function LoginPage() {
  const router = useRouter();
  const { theme, toggleTheme, mounted } = useTheme();
  const [telegramId, setTelegramId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = telegramId.trim();

    if (!cleanId) {
      setErrorMsg('Masukkan Telegram ID Anda untuk melanjutkan.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: cleanId }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg(
          data.error ||
            'ID Telegram tidak ditemukan. Pastikan Anda sudah pernah mengirim pesan ke bot agar profil terdaftar.'
        );
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setErrorMsg('Gagal menghubungkan ke server autentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: 'demo' }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrorMsg('Gagal masuk mode demo.');
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setErrorMsg('Gagal menghubungkan ke server autentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090c15] text-slate-800 dark:text-slate-100 flex flex-col justify-between p-6 transition-colors">
      {/* Top Navbar Minimal */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold text-sm tracking-tight">
            F
          </div>
          <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-slate-200">
            FinAssist Console
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sesi Terisolasi & Terenkripsi</span>
          </div>
          <button
            onClick={toggleTheme}
            aria-label="Toggle tema"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-[#1c2436] bg-slate-100 dark:bg-[#101522] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#151c2c] transition-colors"
          >
            {mounted ? (
              theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-700" />
              )
            ) : (
              <Sun className="w-3.5 h-3.5 opacity-0" />
            )}
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-sm mx-auto my-auto">
        <div className="fintech-card p-7 shadow-xl">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Masuk ke Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Autentikasi menggunakan ID Telegram Anda. Data keuangan disaring ketat per akun pengguna.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-xs text-rose-600 dark:text-rose-300 flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-rose-500 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Telegram User ID
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Contoh: 9861476313"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0c101c] border border-slate-200 dark:border-[#1e2638] focus:border-emerald-500/80 rounded-lg px-3.5 py-2.5 text-sm font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-colors"
                disabled={isLoading}
              />
            </div>

            <div className="p-3 rounded-lg bg-slate-100 dark:bg-[#0b0e18] border border-slate-200 dark:border-[#182030] text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-300">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span>Cara Mengetahui ID Telegram:</span>
              </div>
              <p className="leading-relaxed">
                1. Buka bot{' '}
                <a
                  href="https://t.me/userinfobot"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-mono"
                >
                  @userinfobot
                </a>{' '}
                di Telegram lalu tekan Start.
              </p>
              <p className="leading-relaxed">
                2. Salin deretan angka pada kolom <strong>Id</strong>.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 font-semibold py-2.5 px-4 rounded-lg text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 shadow-sm"
            >
              <span>{isLoading ? 'Memverifikasi ID...' : 'Akses Dashboard'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-[#182030] w-full" />
              <span className="bg-[#ffffff] dark:bg-[#101522] px-2 text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono absolute">
                atau
              </span>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-[#0c101c] dark:hover:bg-[#141b2a] text-slate-700 dark:text-slate-200 font-medium py-2.5 px-4 rounded-lg text-xs transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-[#1e2638] cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Masuk sebagai Demo</span>
            </button>
          </form>
        </div>

        <div className="mt-5 text-center flex items-center justify-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
          <Shield className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          <span>Multi-tenant data isolation aktif</span>
        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="max-w-6xl mx-auto w-full text-center py-2 text-[11px] text-slate-400 dark:text-slate-500">
        FinAssist AI Financial Intelligence &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
