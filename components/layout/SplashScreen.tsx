"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [show, setShow] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Cek apakah sudah pernah melihat splash screen di sesi tab browser saat ini
    const seen = sessionStorage.getItem("dompetq_splash_seen");
    if (!seen) {
      setShow(true);

      // Mulai fade out setelah 1.2 detik
      const fadeTimer = setTimeout(() => {
        setFading(true);
      }, 1300);

      // Unmount splash screen setelah animasi fade out selesai
      const removeTimer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("dompetq_splash_seen", "true");
      }, 1750);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-500 ease-out select-none ${
        fading
          ? "opacity-0 pointer-events-none scale-105"
          : "opacity-100 pointer-events-auto scale-100"
      }`}
      style={{
        background: "var(--splash-bg, #090d16)",
      }}
    >
      {/* Dynamic Background Glow Glass Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 dark:bg-blue-600/25 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative flex flex-col items-center justify-center gap-4">
        {/* Logo Icon Card dengan Apple iOS Glass Frame */}
        <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-[2rem] ios-glass-modal p-4 shadow-2xl flex items-center justify-center border border-white/60 dark:border-white/15 animate-ios-splash-logo">
          <Image
            src="/logo-icon.png"
            alt="DompetQ"
            width={100}
            height={100}
            className="w-full h-full object-contain drop-shadow-md"
            priority
          />
        </div>

        {/* Teks DompetQ */}
        <div className="flex flex-col items-center animate-ios-splash-text">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Dompet<span className="text-blue-500 dark:text-blue-400">Q</span>
          </h1>
          <p className="mt-1 text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">
            Catatan Keuangan Pribadi
          </p>
        </div>
      </div>
    </div>
  );
}
