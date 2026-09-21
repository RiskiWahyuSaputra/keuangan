import fs from "fs";
import os from "os";
import path from "path";
import { type NextRequest, NextResponse } from "next/server";
import { parseBankText } from "@/lib/bankParser";
import type { Transaction } from "@/types/transaction";

// In-memory buffer sebagai penyimpanan utama agar instan dan aman di serverless (Vercel/Netlify /var/task)
let memoryInbox: Transaction[] = [];

// Di serverless environment seperti Vercel, direktori runtime adalah read-only (/var/task).
// Gunakan os.tmpdir() (/tmp) yang writable di semua environment Linux/Vercel/Docker/Lokal.
const TMP_DATA_DIR = path.join(os.tmpdir(), "dompetq-data");
const TMP_DATA_FILE = path.join(TMP_DATA_DIR, "inbox.json");

function ensureInboxFile(): Transaction[] {
  try {
    if (!fs.existsSync(TMP_DATA_DIR)) {
      fs.mkdirSync(TMP_DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(TMP_DATA_FILE)) {
      fs.writeFileSync(TMP_DATA_FILE, JSON.stringify(memoryInbox, null, 2), "utf8");
      return memoryInbox;
    }
    const raw = fs.readFileSync(TMP_DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Gabungkan dengan in-memory buffer untuk mencegah kehilangan data
      const idSet = new Set(parsed.map((item: Transaction) => item.id));
      for (const m of memoryInbox) {
        if (!idSet.has(m.id)) {
          parsed.unshift(m);
        }
      }
      memoryInbox = parsed;
      return memoryInbox;
    }
    return memoryInbox;
  } catch {
    return memoryInbox;
  }
}

function writeInboxFile(items: Transaction[]): void {
  memoryInbox = items;
  try {
    if (!fs.existsSync(TMP_DATA_DIR)) {
      fs.mkdirSync(TMP_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(TMP_DATA_FILE, JSON.stringify(items, null, 2), "utf8");
  } catch {
    // Jika disk /tmp gagal, tetap selamat di memoryInbox
  }
}

// GET: Ambil transaksi masuk dari Apple Shortcuts / Otomasi
export async function GET() {
  const items = ensureInboxFile();
  return NextResponse.json({
    ok: true,
    total: items.length,
    items,
  });
}

// POST: Endpoint untuk menerima Webhook dari Apple Shortcuts / SMS Otomasi
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let parsedData = {
      type: (body.type === "income" ? "income" : "expense") as "income" | "expense",
      amount: Number(body.amount) || 0,
      category: typeof body.category === "string" ? body.category : "Lainnya",
      description: typeof body.description === "string" ? body.description : "Transaksi Baru",
      date: typeof body.date === "string" ? body.date : new Date().toISOString().split("T")[0],
    };

    const textToParse = body.text || body.raw || body.message || body.sms;
    if (typeof textToParse === "string" && textToParse.trim() !== "") {
      const parsed = parseBankText(textToParse);
      if (parsed.amount > 0) {
        parsedData = {
          type: parsed.type,
          amount: parsed.amount,
          category: parsed.category,
          description: parsed.description,
          date: parsed.date || parsedData.date,
        };
      }
    }

    if (parsedData.amount <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Nominal transaksi tidak valid atau tidak dapat diekstrak dari teks.",
        },
        { status: 400 },
      );
    }

    const newTransaction: Transaction = {
      id: `ios_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: parsedData.type,
      amount: parsedData.amount,
      category: parsedData.category,
      description: parsedData.description,
      date: parsedData.date,
      createdAt: new Date().toISOString(),
    };

    const currentItems = ensureInboxFile();
    const updated = [newTransaction, ...currentItems];
    writeInboxFile(updated);

    return NextResponse.json({
      ok: true,
      message: "Transaksi berhasil diterima dari iOS Automation!",
      transaction: newTransaction,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Terjadi kesalahan server.",
      },
      { status: 500 },
    );
  }
}

// DELETE: Hapus item dari inbox setelah disinkronkan ke localStorage browser
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const clearAll = searchParams.get("all") === "true";

    if (clearAll) {
      writeInboxFile([]);
      return NextResponse.json({ ok: true, message: "Semua inbox dibersihkan" });
    }

    if (id) {
      const current = ensureInboxFile();
      const filtered = current.filter((item) => item.id !== id);
      writeInboxFile(filtered);
      return NextResponse.json({ ok: true, message: `Transaksi ${id} disinkronkan` });
    }

    return NextResponse.json({ ok: false, error: "ID tidak disertakan" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Kesalahan server" },
      { status: 500 },
    );
  }
}
