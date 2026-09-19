"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function SplashScreen() {
  // Langsung true di client mount sebelum dicek, atau SSR safe
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const seen = sessionStorage.getItem("dompetq_splash_seen");
    if (!seen) {
      setShow(true);

      // Splash logo tampil lebih lama (2.2 detik) agar animasi dinikmati pengguna
      const fadeTimer = setTimeout(() => {
        setFading(true);
      }, 2200);

      // Selesai fade out di 2.8 detik
      const removeTimer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("dompetq_splash_seen", "true");
        document.documentElement.classList.remove("dompetq-splash-active");
      }, 2800);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  // Inline script di root layout akan langsung mencegah flash dashboard jika belum seen
  if (!show) return null;

  return (
    <div
      id="dompetq-splash-screen"
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center select-none transition-all duration-700 cubic-bezier(0.16,1,0.3,1) ${
        fading
          ? "opacity-0 pointer-events-none scale-110"
          : "opacity-100 pointer-events-auto scale-100"
      }`}
      style={{
        background: "var(--splash-bg, #090d16)",
      }}
    >
      {/* Dynamic Background Radial Glow Glass Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-blue-500/20 dark:bg-blue-600/30 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative flex flex-col items-center justify-center gap-5">
        {/* Logo Icon Card dengan Apple iOS Glass Frame */}
        <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-[2.25rem] ios-glass-modal p-5 shadow-2xl flex items-center justify-center border border-white/60 dark:border-white/15 animate-ios-splash-logo">
          <Image
            src="/logo-icon.png"
            alt="DompetQ"
            width={120}
            height={120}
            className="w-full h-full object-contain drop-shadow-lg"
            priority
          />
        </div>

        {/* Teks DompetQ */}
        <div className="flex flex-col items-center animate-ios-splash-text">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Dompet<span className="text-blue-500 dark:text-blue-400">Q</span>
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400">
            Catatan Keuangan Pribadi
          </p>
        </div>
      </div>
    </div>
  );
}
