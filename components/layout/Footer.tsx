import { HardDrive } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/50 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 sm:px-6">
        <p className="flex items-start gap-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
          <HardDrive aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
          <span>
            Data disimpan secara lokal di browser ini. Menghapus data browser atau menggunakan
            perangkat/browser lain tidak akan membawa data ini.
          </span>
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          DompetQ · Aplikasi pencatatan keuangan pribadi tanpa server.
        </p>
      </div>
    </footer>
  );
}
