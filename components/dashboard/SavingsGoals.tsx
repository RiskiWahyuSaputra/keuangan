"use client";

import { useEffect, useState } from "react";
import { Plus, Sparkles, Trash2, PiggyBank } from "lucide-react";

import Card, { CardHeader } from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { formatCurrency, formatNumberID } from "@/lib/formatCurrency";
import { formatDateID } from "@/lib/date";
import { haptic } from "@/lib/haptic";
import { useToast } from "@/components/ui/ToastProvider";
import {
  DEFAULT_GOAL_EMOJIS,
  SAVINGS_GOALS_STORAGE_KEY,
  type SavingsGoal,
} from "@/types/savingsGoal";

export default function SavingsGoals() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [activeGoal, setActiveGoal] = useState<SavingsGoal | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [targetAmountInput, setTargetAmountInput] = useState("");
  const [initialDepositInput, setInitialDepositInput] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [emoji, setEmoji] = useState("🎯");

  // Deposit Field
  const [depositAmountInput, setDepositAmountInput] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(SAVINGS_GOALS_STORAGE_KEY);
      if (raw) {
        setGoals(JSON.parse(raw));
      }
    } catch {}
  }, []);

  const saveGoalsToStorage = (updated: SavingsGoal[]) => {
    setGoals(updated);
    try {
      localStorage.setItem(SAVINGS_GOALS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAmount = Number(targetAmountInput.replace(/\D/g, ""));
    const initialDeposit = Number(initialDepositInput.replace(/\D/g, "")) || 0;

    if (!title.trim() || targetAmount <= 0) {
      toast("Judul dan target nominal wajib diisi.", "error");
      return;
    }

    const newGoal: SavingsGoal = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      targetAmount,
      currentAmount: Math.min(initialDeposit, targetAmount),
      targetDate: targetDate || undefined,
      emoji,
      createdAt: new Date().toISOString(),
    };

    const next = [newGoal, ...goals];
    saveGoalsToStorage(next);
    haptic.medium();
    toast("Celengan impian berhasil dibuat 🎯", "success");

    // Reset form
    setTitle("");
    setTargetAmountInput("");
    setInitialDepositInput("");
    setTargetDate("");
    setEmoji("🎯");
    setIsModalOpen(false);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGoal) return;
    const addAmount = Number(depositAmountInput.replace(/\D/g, ""));
    if (addAmount <= 0) {
      toast("Masukkan nominal tabungan yang valid.", "error");
      return;
    }

    const nextAmount = activeGoal.currentAmount + addAmount;
    const nextGoals = goals.map((g) =>
      g.id === activeGoal.id ? { ...g, currentAmount: nextAmount } : g,
    );

    saveGoalsToStorage(nextGoals);
    haptic.success();
    toast(
      nextAmount >= activeGoal.targetAmount
        ? "Selamat! Target impianmu sudah tercapai! 🎉"
        : `Berhasil menabung ${formatCurrency(addAmount)} 💰`,
      "success",
    );

    setDepositAmountInput("");
    setActiveGoal(null);
    setIsDepositModalOpen(false);
  };

  const handleDeleteGoal = (id: string, goalTitle: string) => {
    haptic.warning();
    const next = goals.filter((g) => g.id !== id);
    saveGoalsToStorage(next);
    toast(`Celengan "${goalTitle}" dihapus`, "delete");
  };

  if (!mounted) return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader
        title="Celengan Impian"
        description="Rencanakan target tabungan dan wujudkan impianmu."
        action={
          <button
            type="button"
            onClick={() => {
              haptic.light();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 active:scale-95 transition-all shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Buat Target</span>
          </button>
        }
      />

      <div className="p-6">
        {goals.length === 0 ? (
          <div
            onClick={() => {
              haptic.light();
              setIsModalOpen(true);
            }}
            className="cursor-pointer group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-7 text-center transition-all hover:bg-white/50 dark:hover:bg-slate-800/40"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <PiggyBank className="h-6 w-6" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
              Belum ada target celengan
            </h3>
            <p className="mt-1 text-xs text-slate-400 max-w-xs">
              Mulai buat target impianmu seperti gadget baru, dana liburan, atau dana darurat.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {goals.map((goal) => {
              const percent = Math.min(
                100,
                Math.round((goal.currentAmount / goal.targetAmount) * 100),
              );
              const isAchieved = goal.currentAmount >= goal.targetAmount;
              const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

              return (
                <div
                  key={goal.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/60 dark:border-white/10 bg-white/50 dark:bg-slate-800/50 p-4.5 backdrop-blur-md shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 dark:bg-slate-700 text-xl shadow-2xs">
                        {goal.emoji}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {goal.title}
                        </h4>
                        {goal.targetDate ? (
                          <p className="text-[11px] text-slate-400">
                            Target: {formatDateID(goal.targetDate)}
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-400">Tanpa batas waktu</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteGoal(goal.id, goal.title)}
                      aria-label="Hapus celengan"
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-all p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Nominal Terkumpul vs Target */}
                  <div className="mt-4 flex items-baseline justify-between text-xs">
                    <span className="font-bold tabular-nums text-slate-900 dark:text-slate-100 text-sm">
                      {formatCurrency(goal.currentAmount)}
                    </span>
                    <span className="text-slate-400">
                      dari <span className="font-medium">{formatCurrency(goal.targetAmount)}</span>
                    </span>
                  </div>

                  {/* iOS Style Pill Progress Bar */}
                  <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200/80 dark:bg-slate-700/60 overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${
                        isAchieved
                          ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                          : "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Status & Action Button */}
                  <div className="mt-3 flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      {isAchieved ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          <Sparkles className="h-3 w-3" />
                          Tercapai!
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          Sisa: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(remaining)}</span> ({percent}%)
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        haptic.light();
                        setActiveGoal(goal);
                        setDepositAmountInput("");
                        setIsDepositModalOpen(true);
                      }}
                      className="rounded-xl border border-blue-500/20 bg-blue-500/10 dark:bg-blue-500/20 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 active:scale-95 transition-all"
                    >
                      + Nabung
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Buat Target Celengan Baru */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Target Celengan Baru"
        description="Tentukan impian yang ingin kamu wujudkan dan target nominalnya."
        size="sm"
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Pilih Ikon Emoji
            </label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_GOAL_EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => {
                    haptic.light();
                    setEmoji(e);
                  }}
                  className={`grid h-9 w-9 place-items-center rounded-xl text-lg transition-all ${
                    emoji === e
                      ? "bg-blue-500 text-white shadow-md scale-110"
                      : "bg-white/60 dark:bg-slate-800/80 border border-white/60 dark:border-white/10"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="goal-title" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Nama Impian
            </label>
            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Beli Laptop Baru, Liburan ke Bali"
              className="w-full rounded-2xl ios-glass-input px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus-visible:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="goal-target" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Target Nominal (Rp)
            </label>
            <input
              id="goal-target"
              type="text"
              inputMode="numeric"
              value={targetAmountInput ? formatNumberID(Number(targetAmountInput.replace(/\D/g, ""))) : ""}
              onChange={(e) => setTargetAmountInput(e.target.value)}
              placeholder="0"
              className="w-full rounded-2xl ios-glass-input px-3.5 py-2.5 text-base font-semibold tabular-nums text-slate-900 dark:text-slate-100 focus-visible:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="goal-initial" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Tabungan Awal (Opsional)
            </label>
            <input
              id="goal-initial"
              type="text"
              inputMode="numeric"
              value={initialDepositInput ? formatNumberID(Number(initialDepositInput.replace(/\D/g, ""))) : ""}
              onChange={(e) => setInitialDepositInput(e.target.value)}
              placeholder="0"
              className="w-full rounded-2xl ios-glass-input px-3.5 py-2.5 text-sm font-medium tabular-nums text-slate-900 dark:text-slate-100 focus-visible:outline-none"
            />
          </div>

          <div>
            <label htmlFor="goal-date" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Target Tanggal (Opsional)
            </label>
            <input
              id="goal-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full rounded-2xl ios-glass-input px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-slate-100 focus-visible:outline-none"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-3 border-t border-white/40 dark:border-white/10">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">
              Batal
            </Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              Simpan Target
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Setor Tabungan (+ Nabung) */}
      <Modal
        open={isDepositModalOpen}
        onClose={() => {
          setIsDepositModalOpen(false);
          setActiveGoal(null);
        }}
        title={`Nabung untuk ${activeGoal?.title || "Impian"}`}
        description="Berapa banyak yang ingin kamu sisihkan hari ini?"
        size="sm"
      >
        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label htmlFor="deposit-amount" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Nominal Setoran (Rp)
            </label>
            <input
              id="deposit-amount"
              type="text"
              inputMode="numeric"
              value={depositAmountInput ? formatNumberID(Number(depositAmountInput.replace(/\D/g, ""))) : ""}
              onChange={(e) => setDepositAmountInput(e.target.value)}
              placeholder="Contoh: 50.000"
              className="w-full rounded-2xl ios-glass-input px-3.5 py-2.5 text-base font-semibold tabular-nums text-slate-900 dark:text-slate-100 focus-visible:outline-none"
              autoFocus
              required
            />
          </div>

          {/* Quick Preset Nabung */}
          <div className="flex flex-wrap gap-1.5">
            {[20000, 50000, 100000, 250000, 500000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  haptic.light();
                  const cur = Number(depositAmountInput.replace(/\D/g, "")) || 0;
                  setDepositAmountInput(String(cur + val));
                }}
                className="rounded-xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-slate-800/60 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 transition-all"
              >
                +{val >= 1000 ? `${val / 1000}rb` : val}
              </button>
            ))}
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-3 border-t border-white/40 dark:border-white/10">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsDepositModalOpen(false);
                setActiveGoal(null);
              }}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              Setor Tabungan
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
