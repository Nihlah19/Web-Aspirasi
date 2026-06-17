import { defineConfig } from "vite";
import { tanstackViteConfig } from "@tanstack/react-start/vite";
import { react } from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    tanstackViteConfig({
      // Tambahkan ini agar Nitro tahu harus deploy ke mana
      server: {
        preset: "vercel",
      },
    }),
    react(),
  ],
});
