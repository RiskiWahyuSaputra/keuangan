import type { Metadata } from "next";
import { Geist } from "next/font/google";

import Footer from "@/components/layout/Footer";
import MobileTabBar from "@/components/layout/MobileTabBar";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import SplashScreen from "@/components/layout/SplashScreen";
import { QuickAddProvider } from "@/components/ui/QuickAddProvider";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DompetQ — Pencatatan Keuangan Pribadi",
    template: "%s · DompetQ",
  },
  description:
    "Catat pemasukan dan pengeluaran pribadi dengan mudah. Data tersimpan di browser tanpa server maupun database.",
  icons: {
    icon: "/favicon-64.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DompetQ",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-500/20 selection:text-blue-900 dark:selection:text-blue-200 pb-20 md:pb-0">
        <ThemeProvider>
          <ToastProvider>
            <QuickAddProvider>
              <SplashScreen />
              <Navbar />
              <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 lg:py-8">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
              <MobileTabBar />
            </QuickAddProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
