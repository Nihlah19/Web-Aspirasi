import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  judul: z.string().min(1),
  deskripsi: z.string().min(1),
  kategori: z.string().optional(),
  lokasi: z.string().optional(),
});

export type UrgencyResult = {
  skor: number; // 1-10
  level: "rendah" | "sedang" | "tinggi" | "darurat";
  alasan: string;
  rekomendasi: string;
};

/**
 * Analisis tingkat urgensi laporan menggunakan Google AI Studio (Gemini).
 * API key dibaca dari env GEMINI_API_KEY (server-only).
 */
export const analisisUrgensi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<UrgencyResult> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY belum diset di .env");

    const prompt = `Kamu adalah asisten analisis laporan warga. Nilai tingkat urgensi laporan berikut dalam skala 1-10.
Judul: ${data.judul}
Deskripsi: ${data.deskripsi}
Kategori: ${data.kategori ?? "-"}
Lokasi: ${data.lokasi ?? "-"}

Balas HANYA JSON valid dengan format:
{"skor": <1-10>, "level": "rendah|sedang|tinggi|darurat", "alasan": "<1-2 kalimat>", "rekomendasi": "<tindakan singkat>"}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      },
    );

    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Gemini error ${res.status}: ${t}`);
    }
    const json = await res.json();
    const text: string =
      json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const parsed = JSON.parse(text) as UrgencyResult;
    return parsed;
  });
