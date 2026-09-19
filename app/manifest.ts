import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DompetQ — Catatan Keuangan Pribadi",
    short_name: "DompetQ",
    description: "Catat pemasukan dan pengeluaran harian dengan mudah.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "window-controls-overlay"],
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
