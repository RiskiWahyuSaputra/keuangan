export interface ParsedBankTransaction {
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

/**
 * Otomatis mendeteksi teks notifikasi transaksi Bank & E-Wallet di Indonesia:
 * DANA, SeaBank, BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay, QRIS, dsb.
 */
export function parseBankText(rawText: string): ParsedBankTransaction {
  const text = rawText.replace(/[\r\n]+/g, " ").trim();
  const lower = text.toLowerCase();

  // 1. Deteksi Tipe (Pemasukan vs Pengeluaran)
  let type: "income" | "expense" = "expense";

  if (
    lower.includes("uang masuk") ||
    lower.includes("transfer masuk") ||
    lower.includes("dana masuk") ||
    lower.includes("saldo bertambah") ||
    lower.includes("menerima uang") ||
    lower.includes("kamu menerima") ||
    lower.includes("cr ") ||
    lower.includes("kredit") ||
    lower.includes("diterima dari") ||
    lower.includes("top up berhasil") ||
    lower.includes("pengembalian dana") ||
    lower.includes("cashback")
  ) {
    type = "income";
  }

  // 2. Ekstraksi Nominal Uang (Rp XX.XXX atau IDR XX.XXX atau angka)
  let amount = 0;
  const rpRegex = /(?:rp\.?|idr)\s*([\d.,]+)/i;
  const rpMatch = text.match(rpRegex);

  if (rpMatch && rpMatch[1]) {
    let cleanNum = rpMatch[1].trim();
    if (cleanNum.includes(".") && cleanNum.includes(",")) {
      cleanNum = cleanNum.replace(/\./g, "").replace(",", ".");
    } else if (cleanNum.includes(".")) {
      cleanNum = cleanNum.replace(/\./g, "");
    } else if (cleanNum.includes(",")) {
      cleanNum = cleanNum.replace(/,/g, "");
    }
    const val = parseFloat(cleanNum);
    if (!isNaN(val) && val > 0) {
      amount = val;
    }
  }

  if (amount === 0) {
    const fallbackRegex = /(?:sebesar|nominal|jumlah)\s*[:=]?\s*([\d.,]+)/i;
    const fbMatch = text.match(fallbackRegex);
    if (fbMatch && fbMatch[1]) {
      const cleanNum = fbMatch[1].replace(/[.,]/g, "");
      const val = parseFloat(cleanNum);
      if (!isNaN(val)) amount = val;
    }
  }

  // 3. Ekstraksi Nama Toko / Penerima / Bank (misal SeaBank, DANA, BCA, dsb)
  let description = "Transaksi Otomatis";

  // Pola spesifik transfer bank / e-wallet
  // Contoh DANA: "Kirim Uang Rp 100.000 ke SEABANK - RISKI WAHYU SAPUTRA berhasil"
  // Contoh DANA: "Kamu berhasil kirim uang ke SEABANK"
  // Contoh SeaBank: "Transfer ke RISKI WAHYU (SeaBank) berhasil"
  const transferMatch =
    text.match(/(?:kirim uang ke|transfer ke|bayar ke|kirim ke)\s+([A-Za-z0-9\s&'.-]{3,35}?)(?:\s+(?:berhasil|sukses|pada|sebesar|\.|\,|-|$))/i) ||
    text.match(/(?:ke|penerima|merchant|di|toko)\s+([A-Za-z0-9\s&'.-]{3,35}?)(?:\s+(?:berhasil|sukses|pada|tanggal|\.|\,|$))/i);

  if (transferMatch && transferMatch[1]) {
    description = transferMatch[1].trim();
  } else if (lower.includes("seabank")) {
    description = type === "income" ? "Transfer dari SeaBank" : "Transfer ke SeaBank";
  } else if (lower.includes("dana")) {
    description = type === "income" ? "Terima Uang DANA" : "Transfer DANA";
  } else if (lower.includes("qris")) {
    description = "Pembayaran QRIS";
  } else if (lower.includes("gopay") || lower.includes("gojek")) {
    description = "Transaksi GoPay";
  } else if (lower.includes("shopee")) {
    description = "Transaksi Shopee";
  } else if (lower.includes("transfer")) {
    description = type === "income" ? "Transfer Masuk" : "Transfer Keluar";
  }

  // Bersihkan kata penghubung sisa
  description = description.replace(/\s+-\s+$/, "").trim();

  // 4. Kategori Otomatis berdasarkan Kata Kunci
  let category = "Lainnya";
  const descLower = `${description} ${text}`.toLowerCase();

  // Jika transfer antar bank sendiri / e-wallet (DANA ke SeaBank)
  if (
    (descLower.includes("dana") && descLower.includes("seabank")) ||
    descLower.includes("kirim uang") ||
    descLower.includes("transfer ke rekening") ||
    descLower.includes("tarik saldo") ||
    descLower.includes("pindah dana")
  ) {
    category = "Lainnya"; // Atau kategori Transfer
  } else if (
    descLower.includes("kopi") ||
    descLower.includes("resto") ||
    descLower.includes("cafe") ||
    descLower.includes("makan") ||
    descLower.includes("bakso") ||
    descLower.includes("mie") ||
    descLower.includes("ayam") ||
    descLower.includes("warung") ||
    descLower.includes("gofood") ||
    descLower.includes("grabfood") ||
    descLower.includes("shopeefood") ||
    descLower.includes("mcdonald") ||
    descLower.includes("kfc")
  ) {
    category = "Makanan & Minuman";
  } else if (
    descLower.includes("gojek") ||
    descLower.includes("grab") ||
    descLower.includes("maxim") ||
    descLower.includes("bensin") ||
    descLower.includes("pertamina") ||
    descLower.includes("shell") ||
    descLower.includes("parkir") ||
    descLower.includes("toll") ||
    descLower.includes("kereta") ||
    descLower.includes("kai")
  ) {
    category = "Transportasi";
  } else if (
    descLower.includes("indomaret") ||
    descLower.includes("alfamart") ||
    descLower.includes("supermarket") ||
    descLower.includes("tokopedia") ||
    descLower.includes("shopee") ||
    descLower.includes("mall") ||
    descLower.includes("belanja")
  ) {
    category = "Belanja";
  } else if (
    descLower.includes("pln") ||
    descLower.includes("listrik") ||
    descLower.includes("pdam") ||
    descLower.includes("wifi") ||
    descLower.includes("indihome") ||
    descLower.includes("telkomsel") ||
    descLower.includes("pulsa") ||
    descLower.includes("paket data") ||
    descLower.includes("tagihan")
  ) {
    category = "Tagihan";
  } else if (
    descLower.includes("bioskop") ||
    descLower.includes("cinema") ||
    descLower.includes("xxi") ||
    descLower.includes("netflix") ||
    descLower.includes("spotify") ||
    descLower.includes("game") ||
    descLower.includes("steam")
  ) {
    category = "Hiburan";
  } else if (
    descLower.includes("apotek") ||
    descLower.includes("obat") ||
    descLower.includes("dokter") ||
    descLower.includes("klinik") ||
    descLower.includes("kimia farma")
  ) {
    category = "Kesehatan";
  } else if (type === "income") {
    if (descLower.includes("gaji") || descLower.includes("salary") || descLower.includes("payroll")) {
      category = "Gaji";
    } else if (descLower.includes("dividen") || descLower.includes("reksadana") || descLower.includes("profit") || descLower.includes("bunga")) {
      category = "Investasi";
    } else {
      category = "Pendapatan Lain";
    }
  }

  const now = new Date();
  const date = now.toISOString().split("T")[0];

  return {
    type,
    amount,
    category,
    description,
    date,
  };
}
