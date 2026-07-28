import { useState, useRef, useCallback } from "react";
import { X, Upload, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { uploadMedia, toThumbUrl, type DbProject, type MediaItem } from "@/lib/db-projects";
import { useModalA11y } from "@/hooks/use-modal-a11y";

const CATEGORIES = ["3D Models", "2D Drawings", "Project Management", "MATLAB", "Python", "PLC, Hydraulic & Pneumatic"];

type Props = {
  initial: Partial<DbProject> | null;
  defaultCategory?: string;
  onClose: () => void;
  onSaved: () => void;
};

export function ProjectEditor({ initial, defaultCategory, onClose, onSaved }: Props) {
  const close = useCallback(() => onClose(), [onClose]);
  const dialogRef = useModalA11y(true, close);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [tag, setTag] = useState(initial?.tag ?? "");
  const [tool, setTool] = useState(initial?.tool ?? "");
  const [category, setCategory] = useState(initial?.category ?? defaultCategory ?? CATEGORIES[0]);
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail_url ?? "");
  const [videoUrl, setVideoUrl] = useState(initial?.video_url ?? "");
  const [externalLink, setExternalLink] = useState(initial?.external_link ?? "");
  const [media, setMedia] = useState<MediaItem[]>(initial?.media ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    setErr(null);
    setUploading(true);
    setProgress(0);
    const arr = Array.from(files);
    const newMedia: MediaItem[] = [];
    let failed = 0;
    try {
      for (let i = 0; i < arr.length; i++) {
        try {
          const { url, type } = await uploadMedia(arr[i]);
          newMedia.push({ type, src: url });
        } catch (uploadErr: any) {
          failed++;
          console.error("[ProjectEditor] upload failed for", arr[i]?.name, uploadErr);
          toast.error(`Failed to upload ${arr[i]?.name ?? "file"}: ${uploadErr?.message ?? "unknown error"}`);
        }
        setProgress(Math.round(((i + 1) / arr.length) * 100));
      }
      if (newMedia.length > 0) {
        setMedia((m) => {
          const merged = [...m, ...newMedia];
          if (!thumbnail) {
            const firstImage = newMedia.find((x) => x.type === "image");
            if (firstImage) setThumbnail(firstImage.src);
          }
          return merged;
        });
        toast.success(`Uploaded ${newMedia.length} file${newMedia.length === 1 ? "" : "s"}${failed ? ` (${failed} failed)` : ""}`);
      } else if (failed > 0) {
        setErr(`All ${failed} uploads failed. Check that you're signed in as admin and try again.`);
      }
    } catch (e: any) {
      setErr(e?.message ?? "Upload failed");
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    // Source-of-truth rule: thumbnail must always be a member of `media`.
    // If the current `thumbnail` was removed from `media` (or never matched),
    // snap it back to the first image in media so the card preview always
    // matches the first slide of the modal — no crossover possible.
    const firstImage = media.find((m) => m.type === "image")?.src ?? "";
    const firstVideo = media.find((m) => m.type === "video")?.src ?? "";
    const thumbInMedia = thumbnail && media.some((m) => m.src === thumbnail);
    const resolvedThumb = thumbInMedia ? thumbnail : firstImage;
    const payload = {
      title: title.trim(),
      description: description.trim(),
      tag: tag.trim() || category,
      tool: tool.trim(),
      category,
      thumbnail_url: resolvedThumb,
      video_url: videoUrl.trim() || firstVideo || null,
      external_link: externalLink.trim() || null,
      media,
    };
    if (!payload.title) { setErr("Title is required"); setSaving(false); return; }
    if (!payload.thumbnail_url && !payload.video_url) {
      setErr("Add at least one image or video, or set a video URL"); setSaving(false); return;
    }
    console.log("[ProjectEditor] saving payload", payload);
    const op = initial?.id
      ? supabase.from("projects").update(payload).eq("id", initial.id).select().single()
      : supabase.from("projects").insert(payload).select().single();
    const { data, error } = await op;
    setSaving(false);
    if (error) {
      console.error("[ProjectEditor] save failed", error);
      setErr(error.message);
      toast.error(`Save failed: ${error.message}`);
      return;
    }
    console.log("[ProjectEditor] saved row", data);
    toast.success(initial?.id ? "Project updated" : "Project created");
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/85 backdrop-blur-sm p-4" onClick={close}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={initial?.id ? "Edit project" : "New project"}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl glass border border-border p-6 md:p-8 outline-none"
      >
        <button onClick={close} aria-label="Close" data-modal-close className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-background/80 hover:text-primary transition">
          <X className="h-4 w-4" />
        </button>
        <h2 className="text-2xl font-bold">{initial?.id ? "Edit project" : "New project"}</h2>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title">
              <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200}
                className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary" />
            </Field>
            <Field label="Category">
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Tag (short label)">
              <input value={tag} onChange={(e) => setTag(e.target.value)} maxLength={60} placeholder="e.g. 3D Model"
                className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary" />
            </Field>
            <Field label="Software / tool">
              <input value={tool} onChange={(e) => setTool(e.target.value)} maxLength={120} placeholder="SolidWorks, MATLAB, ..."
                className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary" />
            </Field>
            <Field label="External link (optional)">
              <input value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://..."
                className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary" />
            </Field>
            <Field label="Video URL (YouTube/Vimeo or direct)">
              <input value={videoUrl ?? ""} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..."
                className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary" />
            </Field>
          </div>

          <Field label="Description">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={2000}
              className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary" />
          </Field>

          <Field label="Media (drag-and-drop or click — images & videos)">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); }}
              onClick={() => fileInput.current?.click()}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer transition ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
            >
              {uploading ? <><Loader2 className="h-5 w-5 animate-spin text-primary" /><p className="text-xs text-muted-foreground">Uploading… {progress}%</p></>
                : <><Upload className="h-5 w-5 text-primary" /><p className="text-xs text-muted-foreground">Drop files here or click to upload</p></>}
              <input ref={fileInput} type="file" multiple accept="image/*,video/*" className="hidden"
                onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ""; }} />
            </div>
            {media.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {media.map((m, i) => (
                  <div key={`${m.src}-${i}`} className="relative group">
                    {m.type === "image"
                      ? <img src={toThumbUrl(m.src, 240)} alt="" loading="lazy" decoding="async" className="h-20 w-full rounded-md object-cover" />
                      : <div className="grid h-20 w-full place-items-center rounded-md bg-black/60 text-[10px] text-primary">VIDEO</div>}
                    <button type="button" onClick={() => setMedia(media.filter((_, idx) => idx !== i))}
                      className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-background border border-border text-destructive opacity-0 group-hover:opacity-100 transition">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          {err && <p className="text-sm text-destructive">{err}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={close} className="rounded-lg border border-border px-4 py-2 text-sm hover:border-primary/50 transition">Cancel</button>
            <button type="submit" disabled={saving || uploading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground glow-primary hover:opacity-90 disabled:opacity-60 transition">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {initial?.id ? "Save changes" : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
