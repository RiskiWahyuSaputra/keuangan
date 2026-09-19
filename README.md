# DompetQ (Catatan Keuangan)

Website pencatatan keuangan pribadi untuk mencatat pemasukan dan pengeluaran sehari-hari dengan antarmuka modern Glassmorphism ala iOS.
Seluruh data disimpan di **LocalStorage** browser — tanpa database, tanpa backend, tanpa login —
sehingga aplikasi bisa langsung di-deploy ke Vercel.

## Fitur

- **CRUD transaksi lengkap** — tambah, lihat, edit, dan hapus pemasukan/pengeluaran.
- **Dashboard** — saldo saat ini, total pemasukan, total pengeluaran, dan transaksi terbaru.
- **Filter & pencarian** — berdasarkan jenis (pemasukan/pengeluaran), bulan, kategori, dan kata kunci deskripsi/kategori.
- **Sorting** — tanggal terbaru/terlama atau nominal terbesar/terkecil.
- **Statistik** — grafik batang pemasukan vs pengeluaran, grafik donat pengeluaran per kategori, ringkasan bulanan, dan kategori pengeluaran terbesar.
- **Backup** — export data ke file JSON dan import kembali (gabungkan atau ganti semua data).
- **Hapus semua data** dengan konfirmasi dua tahap.
- **Responsif** — tabel di desktop berubah menjadi daftar kartu di mobile, lengkap dengan menu hamburger.
- **Aman untuk SSR** — LocalStorage hanya diakses di client lewat `useSyncExternalStore`, sehingga tidak ada hydration mismatch.

## Teknologi

| Bagian | Teknologi |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Bahasa | TypeScript (strict) |
| UI | React 19 + Tailwind CSS v4 |
| Ikon | lucide-react |
| Grafik | Recharts |
| Penyimpanan | LocalStorage browser |
| Deployment | Vercel |

Tidak ada MySQL, PostgreSQL, MongoDB, Firebase, Supabase, Prisma, backend API, atau authentication.

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
```

Build dan jalankan versi production:

```bash
npm run build
npm start
```

Pemeriksaan kode:

```bash
npm run lint
npm run typecheck
```

## Penyimpanan Data

Semua transaksi disimpan sebagai array objek di satu key LocalStorage:

```text
personal_finance_transactions
```

Contoh satu transaksi:

```json
{
  "id": "1723456789012",
  "type": "expense",
  "amount": 25000,
  "category": "Makanan",
  "description": "Makan siang",
  "date": "2026-09-18",
  "createdAt": "2026-09-18T12:00:00.000Z"
}
```

- `amount` selalu berupa angka positif (`25000`), bukan string Rupiah. Format `Rp 25.000` hanya dipakai pada tampilan.
- `date` memakai format `YYYY-MM-DD`.
- Data disimpan lokal di browser. Menghapus data browser atau memakai perangkat/browser lain tidak akan membawa data ini.
- Tidak ada data transaksi yang dikirim ke server.

Jika data LocalStorage rusak (JSON tidak valid atau field tidak sesuai), aplikasi tidak crash:
data lama dicadangkan ke key `personal_finance_transactions_corrupt_backup`, aplikasi kembali kosong,
dan pengguna diberi notifikasi.

## Struktur Folder

```text
app/
├── page.tsx               # Dashboard
├── transactions/page.tsx  # Halaman transaksi
├── statistics/page.tsx    # Halaman statistik
├── settings/page.tsx      # Halaman pengaturan
├── layout.tsx             # Navbar, footer, toast provider
├── icon.svg               # Favicon
└── globals.css
components/
├── layout/                # Navbar, Footer, PageHeader
├── dashboard/             # SummaryCards, RecentTransactions, MonthlySummary
├── transactions/          # Form, Table, Card, Filters, DeleteDialog
├── statistics/            # IncomeExpenseChart, CategoryChart, TopExpenseCategories
├── settings/              # SettingsView
└── ui/                    # Button, Modal, ConfirmDialog, Card, Toast, EmptyState, dll
hooks/
└── useTransactions.ts     # CRUD + toast, dipakai semua halaman
lib/
├── transactionStore.ts    # External store di atas LocalStorage
├── storage.ts             # Baca/tulis/validasi LocalStorage, export-import
├── formatCurrency.ts      # formatCurrency(), formatNumberID(), dll
├── calculations.ts        # calculateTotalIncome(), calculateBalance(), dll
├── categories.ts          # Daftar kategori & warna grafik
└── date.ts                # Helper tanggal (YYYY-MM-DD, bulan)
types/
└── transaction.ts
```

## Deploy ke Vercel

Aplikasi murni client-side dan tidak membutuhkan database maupun environment variable.

1. Push repository ini ke GitHub.
2. Import project di [vercel.com/new](https://vercel.com/new).
3. Deploy — Vercel otomatis mendeteksi Next.js (`npm run build`).

Atau lewat CLI:

```bash
npx vercel
```
