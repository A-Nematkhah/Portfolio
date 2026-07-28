import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// GitHub Pages base path:
// - user/org site (A-Nematkhah.github.io) -> "/"
// - project site (repo "Portfolio")       -> "/Portfolio/"
// Set via GH_PAGES_BASE in GitHub Actions; defaults to "/" for local dev.
const base = process.env.GH_PAGES_BASE || "/";

export default defineConfig({
  base,
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
  preview: { host: "127.0.0.1", port: 4173 },
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      server: { entry: "server" },
      // Static SPA shell for GitHub Pages (no server runtime).
      spa: {
        enabled: true,
        prerender: { enabled: true, crawlLinks: true },
      },
    }),
    viteReact(),
    tailwindcss(),
  ],
});
