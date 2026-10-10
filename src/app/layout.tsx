import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FinAssist AI — Financial Management Web Dashboard',
  description: 'Modern finance management web dashboard terintegrasi langsung dengan Telegram bot dan PostgreSQL.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-[#090d16] text-slate-100 min-h-screen antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
