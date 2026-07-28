/** Prefix public/ paths with Vite BASE_URL (needed on GitHub Pages project sites). */
export function pub(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
