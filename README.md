# FinAssist Dashboard 📊

Web dashboard analitik keuangan personal terintegrasi langsung dengan Telegram Bot & PostgreSQL. Dibangun menggunakan Next.js 14, Tailwind CSS, TypeScript, dan Lucide Icons.

---

## Fitur Utama

- **Institutional Fintech UI**: Desain minimalis terinspirasi platform keuangan modern, angka tabular (`tabular-nums font-mono`), bebas elemen neon/glow berlebihan.
- **Dark & Light Mode Toggle**: Penggantian tema instan dengan persistensi via `localStorage` dan class `.dark` Tailwind CSS.
- **Multi-Tenant Data Isolation**: Data disaring ketat berdasarkan `user_id` Telegram. Pengguna hanya dapat melihat transaksi, saldo, dan kategori milik sendiri.
- **Server-Side Route Guard**: Next.js Middleware memeriksa cookie sesi terautentikasi (`finassist_telegram_id`), otomatis mengalihkan pengguna yang belum login ke `/login`.
- **Statistik & Visualisasi**:
  - Total Saldo Terkonsolidasi (Kas, Bank, E-Wallet)
  - Arus Kas Bulanan (Pemasukan vs Pengeluaran & Rasio Tabungan)
  - Diagram Alokasi Kategori Belanja
  - Buku Mutasi Transaksi dengan pencarian dan filter cepat

---

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: PostgreSQL (Driver: `pg`)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Menjalankan Secara Lokal

### 1. Kloning & Masuk ke Folder
```bash
git clone https://github.com/thumbs123/dashboard-money-tracking.git
cd dashboard-money-tracking
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Sesuaikan konfigurasi koneksi database:
```env
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5433
POSTGRES_USER=finassist
POSTGRES_PASSWORD=PasswordDatabaseKamu
POSTGRES_DB=finassist
```

### 4. Jalankan Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser. Masuk menggunakan Telegram ID yang sudah terdaftar.
