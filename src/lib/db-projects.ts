import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

export type MediaItem = { type: "image" | "video"; src: string; caption?: string };

export type DbProject = {
  id: string;
  title: string;
  description: string;
  tag: string;
  tool: string;
  category: string;
  thumbnail_url: string;
  video_url: string | null;
  external_link: string | null;
  media: MediaItem[];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export async function fetchProjects(): Promise<DbProject[]> {
  // Without env locally, fall back to the static catalog in PortfolioPage.
  if (!isSupabaseConfigured()) {
    if (import.meta.env.DEV) {
      console.warn(
        "[projects] Supabase env missing — showing static catalog only. Copy .env.example to .env and fill keys.",
      );
    }
    return [];
  }

  // Public RLS policy "Projects are viewable by everyone" allows this to run
  // straight from the browser with the anon key — no server runtime needed,
  // which keeps this compatible with static hosting (e.g. GitHub Pages).
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, description, tag, tool, category, thumbnail_url, video_url, external_link, media, sort_order, created_at, updated_at",
    )
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    ...row,
    media: Array.isArray(row.media) ? (row.media as MediaItem[]) : [],
  })) as DbProject[];
}

/**
 * Upload a single media file to the project-media bucket.
 * Validates each step: storage upload -> public URL generation -> URL HEAD reachability.
 * Throws a descriptive error on any failure so the editor can surface it via toast.
 */
export async function uploadMedia(file: File): Promise<{ url: string; type: "image" | "video" }> {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured (.env missing)");
  if (!file || file.size === 0) throw new Error("File is empty");

  const ext =
    (file.name.split(".").pop() ?? "bin").toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const path = `${crypto.randomUUID()}.${ext}`;
  const inferredType: "image" | "video" = file.type.startsWith("video") ? "video" : "image";

  if (import.meta.env.DEV) {
    console.log("[uploadMedia] starting", {
      name: file.name,
      size: file.size,
      mime: file.type,
      path,
    });
  }

  const { error: uploadErr } = await supabase.storage.from("project-media").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });

  if (uploadErr) {
    console.error("[uploadMedia] storage upload failed", uploadErr);
    throw new Error(`Upload failed: ${uploadErr.message}`);
  }

  const { data: pub } = supabase.storage.from("project-media").getPublicUrl(path);
  const url = pub?.publicUrl;
  if (!url) {
    console.error("[uploadMedia] missing public URL after upload", { path });
    throw new Error("Upload succeeded but public URL could not be generated");
  }

  if (import.meta.env.DEV) {
    console.log("[uploadMedia] success", { path, url, type: inferredType });
  }
  return { url, type: inferredType };
}

/**
 * Rewrite a Supabase Storage public URL to use the on-the-fly image transform
 * endpoint so we can serve right-sized WebP variants for grid thumbnails.
 * Returns the original URL unchanged for non-Supabase / non-image assets
 * (bundled @/assets/*, /videos/*, /winch/*, etc.) so bundled optimization
 * pipelines keep working.
 */
export function toThumbUrl(url: string | undefined | null, width: number, quality = 75): string {
  if (!url) return "";
  // Only rewrite Supabase Storage public object URLs
  const marker = "/storage/v1/object/public/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  // Skip videos — render endpoint is image-only
  if (/\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url)) return url;
  const rewritten = url.replace(marker, "/storage/v1/render/image/public/");
  const sep = rewritten.includes("?") ? "&" : "?";
  return `${rewritten}${sep}width=${width}&quality=${quality}&resize=cover`;
}

export function thumbSrcSet(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  if (url.indexOf("/storage/v1/object/public/") === -1) return undefined;
  if (/\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url)) return undefined;
  return [480, 768, 1024].map((w) => `${toThumbUrl(url, w)} ${w}w`).join(", ");
}

export async function deleteProject(id: string) {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured (.env missing)");
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}
