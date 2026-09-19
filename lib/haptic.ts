/**
 * Helper utilitas untuk haptic feedback ringan ala iOS/Android (Taptic Engine)
 */
export const haptic = {
  /** Getaran sangat halus untuk navigasi tab, tombol kecil, toggle */
  light: () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(15);
    }
  },
  /** Getaran medium untuk aksi sukses simpan / tambah transaksi */
  medium: () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(30);
    }
  },
  /** Getaran ganda (warning) saat tombol hapus atau peringatan */
  warning: () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([25, 40, 30]);
    }
  },
  /** Getaran sukses ritmis */
  success: () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([20, 30, 20]);
    }
  },
};
