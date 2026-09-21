"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { useTransactions } from "@/hooks/useTransactions";
import { haptic } from "@/lib/haptic";
import type { Transaction } from "@/types/transaction";

export default function SyncInboxListener() {
  const { addTransaction, isLoaded } = useTransactions();
  const { toast } = useToast();
  const [syncedIds, setSyncedIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (!isLoaded) return;

    async function checkInbox() {
      try {
        const res = await fetch("/api/webhook/transaction");
        if (!res.ok) return;
        const data = await res.json();

        if (data.ok && Array.isArray(data.items) && data.items.length > 0) {
          for (const item of data.items as Transaction[]) {
            if (syncedIds.has(item.id)) continue;

            // Masukkan transaksi baru ke local store aplikasi
            addTransaction({
              type: item.type,
              amount: item.amount,
              category: item.category,
              description: item.description,
              date: item.date,
            });

            // Tandai sudah disinkronkan
            setSyncedIds((prev) => new Set(prev).add(item.id));

            // Beri notifikasi toast Dynamic Island & getaran haptic
            haptic.success();
            toast(
              `⚡ Otomatis Masuk: ${item.description} (${item.type === "expense" ? "-" : "+"}Rp ${item.amount.toLocaleString("id-ID")})`,
              "success",
            );

            // Hapus dari queue inbox server
            await fetch(`/api/webhook/transaction?id=${item.id}`, {
              method: "DELETE",
            });
          }
        }
      } catch {
        // Abaikan jika network offline
      }
    }

    // Periksa inbox saat pertama kali komponen dimuat
    checkInbox();

    // Polling berkala setiap 3 detik agar instan saat ada transaksi masuk
    const interval = setInterval(checkInbox, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [isLoaded, addTransaction, toast, syncedIds]);

  return null;
}
