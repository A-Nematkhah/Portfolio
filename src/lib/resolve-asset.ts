import { pub } from "@/lib/pub";

/** Resolve site-relative media paths from DB for GitHub Pages base URL. */
export function resolveAssetUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  // Vite-bundled assets already absolute from import
  if (url.startsWith("/assets/") || url.includes("/assets/")) return url;
  return pub(url.startsWith("/") ? url : `/${url}`);
}

export function resolveMediaList<T extends { src: string }>(media: T[] | null | undefined): T[] {
  if (!Array.isArray(media)) return [];
  return media.map((m) => ({ ...m, src: resolveAssetUrl(m.src) }));
}
