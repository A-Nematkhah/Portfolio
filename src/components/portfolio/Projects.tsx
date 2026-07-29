import {
  lazy,
  Suspense,
  memo,
  useRef,
  useState,
  useEffect,
  useCallback,
  type MouseEvent,
} from "react";
import { m, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import {
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useInView } from "@/hooks/use-in-view";
import { useModalA11y } from "@/hooks/use-modal-a11y";
import { deleteProject, toThumbUrl, thumbSrcSet, type DbProject } from "@/lib/db-projects";
import { FILTERS, type MediaItem, type Project } from "@/data/projects";

const ProjectEditor = lazy(() =>
  import("@/components/admin/ProjectEditor").then((mod) => ({ default: mod.ProjectEditor })),
);

const CARD_SIZES = "(min-width:1024px) 20vw, (min-width:768px) 33vw, 100vw";

function mapToDb(p: Project): Partial<DbProject> {
  return {
    id: p.dbId,
    title: p.title,
    description: p.desc,
    tag: p.tag,
    tool: p.tool,
    category: p.cat,
    thumbnail_url: p.img,
    video_url: p.video ?? null,
    external_link: p.externalLink ?? null,
    media: p.media ?? [],
  };
}

export function Projects({
  filter,
  setFilter,
  list,
  isAdmin,
}: {
  filter: string;
  setFilter: (s: string) => void;
  list: Project[];
  isAdmin: boolean;
}) {
  const [active, setActive] = useState<Project | null>(null);
  const [editing, setEditing] = useState<Partial<DbProject> | null>(null);
  const [creating, setCreating] = useState(false);
  const queryClient = useQueryClient();
  const refetch = () => queryClient.invalidateQueries({ queryKey: ["projects"] });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    await deleteProject(id);
    refetch();
  };

  return (
    <section id="projects" className="py-20 pt-[10px]">
      <div data-lidar-object="PROJECT ARCHIVE" className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Portfolio</p>
        <h2 className="mt-3 text-4xl font-bold md:text-5xl">Featured Projects</h2>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
              filter === f
                ? "bg-primary text-primary-foreground glow-primary"
                : "border border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
        {isAdmin && (
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-dashed border-primary/60 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition"
          >
            <Plus className="h-4 w-4" /> Add Project
          </button>
        )}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {list.map((p, i) => (
          <ProjectCard
            key={p.dbId ? `db-${p.dbId}` : `static-${p.cat}-${p.title}`}
            p={p}
            i={i}
            onOpen={() => setActive(p)}
            isAdmin={isAdmin}
            onEdit={p.dbId ? () => setEditing({ id: p.dbId }) : undefined}
            onDelete={p.dbId ? () => handleDelete(p.dbId!) : undefined}
          />
        ))}
      </div>

      <ProjectModal project={active} onClose={() => setActive(null)} />
      {(creating || editing) && (
        <Suspense fallback={null}>
          <ProjectEditor
            initial={
              editing
                ? list.find((p) => p.dbId === editing.id)
                  ? mapToDb(list.find((p) => p.dbId === editing.id)!)
                  : null
                : null
            }
            defaultCategory={filter !== "All" ? filter : undefined}
            onClose={() => {
              setCreating(false);
              setEditing(null);
            }}
            onSaved={refetch}
          />
        </Suspense>
      )}
    </section>
  );
}

const ProjectCard = memo(function ProjectCard({
  p,
  i,
  onOpen,
  isAdmin,
  onEdit,
  onDelete,
}: {
  p: Project;
  i: number;
  onOpen: () => void;
  isAdmin: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [holderRef, inView] = useInView<HTMLDivElement>("200px");

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 25, mass: 0.5 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 25, mass: 0.5 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glowBackground = useMotionTemplate`radial-gradient(180px circle at ${glowX}% ${glowY}%, var(--glow), transparent 70%)`;
  const reducedMotionRef = useRef(
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const handleCardMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reducedMotionRef.current || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 4);
    rotateX.set((0.5 - py) * 4);
    glowX.set(px * 100);
    glowY.set(py * 100);
  };
  const handleCardMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleEnter = () => {
    const v = videoRef.current;
    if (v) v.play().catch(() => {});
  };
  const handleLeave = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  const posterSrc = p.img ? toThumbUrl(p.img, 768) : undefined;
  const imgSrc = p.img ? toThumbUrl(p.img, 768) : "";
  const imgSrcSet = p.img ? thumbSrcSet(p.img) : undefined;

  return (
    <m.div
      ref={cardRef}
      data-lidar-project={p.title}
      onMouseEnter={handleEnter}
      onMouseMove={handleCardMouseMove}
      onMouseLeave={() => {
        handleLeave();
        handleCardMouseLeave();
      }}
      initial={{ opacity: 0, y: 20, filter: "blur(3px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ delay: Math.min(i, 5) * 0.05 }}
      style={{ rotateX: springRotateX, rotateY: springRotateY, transformPerspective: 800 }}
      className="project-card group relative overflow-hidden rounded-xl glass text-left"
    >
      <m.div
        aria-hidden="true"
        style={{ background: glowBackground }}
        className="pointer-events-none absolute inset-0 z-10 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-40"
      />
      {isAdmin && (onEdit || onDelete) && (
        <div className="absolute right-2 top-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              aria-label="Edit"
              className="grid h-8 w-8 place-items-center rounded-full bg-background/90 text-primary hover:glow-primary transition"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              aria-label="Delete"
              className="grid h-8 w-8 place-items-center rounded-full bg-background/90 text-destructive hover:bg-destructive hover:text-destructive-foreground transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={onOpen}
        onFocus={handleEnter}
        onBlur={handleLeave}
        className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-primary/60 rounded-xl"
      >
        <div ref={holderRef} className="relative aspect-[4/3] overflow-hidden bg-black/40">
          {p.video ? (
            <>
              {inView ? (
                <video
                  ref={videoRef}
                  src={p.video}
                  poster={posterSrc}
                  preload="none"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  muted
                  loop
                  playsInline
                />
              ) : posterSrc ? (
                <img
                  src={posterSrc}
                  srcSet={imgSrcSet}
                  sizes={CARD_SIZES}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  // @ts-expect-error fetchpriority is a valid HTML attr
                  fetchpriority="low"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="h-full w-full" />
              )}
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-background/70 backdrop-blur-sm text-primary opacity-90 group-hover:opacity-0 transition">
                  <Play className="h-5 w-5 fill-current" />
                </div>
              </div>
            </>
          ) : p.img ? (
            <img
              src={imgSrc}
              srcSet={imgSrcSet}
              sizes={CARD_SIZES}
              alt={p.title}
              loading="lazy"
              decoding="async"
              width={1024}
              height={768}
              // @ts-expect-error fetchpriority is a valid HTML attr
              fetchpriority="low"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = "none";
                const parent = el.parentElement;
                if (parent && !parent.querySelector("[data-fallback]")) {
                  const fb = document.createElement("div");
                  fb.setAttribute("data-fallback", "true");
                  fb.className =
                    "absolute inset-0 grid place-items-center text-xs text-muted-foreground bg-secondary/40";
                  fb.textContent = "Image unavailable";
                  parent.appendChild(fb);
                }
              }}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground bg-secondary/40">
              No preview
            </div>
          )}
        </div>

        <div className="space-y-1 p-4">
          <p className="text-xs font-medium text-primary">{p.tag}</p>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold leading-tight">{p.title}</h3>
            <div className="project-arrow grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/15 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{p.tool}</p>
        </div>
      </button>
    </m.div>
  );
});

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const projectKey = project?.dbId ?? project?.title ?? "";
  const close = useCallback(() => onClose(), [onClose]);
  useEffect(() => {
    setIdx(0);
  }, [projectKey]);

  if (!project) return null;
  return (
    <ProjectModalInner
      key={projectKey}
      project={project}
      onClose={close}
      idx={idx}
      setIdx={setIdx}
    />
  );
}

function ProjectModalInner({
  project,
  onClose,
  idx,
  setIdx,
}: {
  project: Project;
  onClose: () => void;
  idx: number;
  setIdx: (n: number) => void;
}) {
  const dialogRef = useModalA11y(true, onClose);
  const media: MediaItem[] = project.media ?? [
    project.video
      ? { type: "video", src: project.video, caption: project.desc }
      : { type: "image", src: project.img, caption: project.desc },
  ];
  const safeIdx = Math.min(idx, media.length - 1);
  const current = media[safeIdx];
  const hasMany = media.length > 1;
  const go = (delta: number) => {
    setIdx((safeIdx + delta + media.length) % media.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <m.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl glass border border-border outline-none"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          data-modal-close
          className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-background/80 text-foreground hover:text-primary hover:glow-primary transition"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="relative bg-black/40">
          {current.type === "video" ? (
            <video
              key={current.src}
              src={current.src}
              poster={project.img}
              className="h-auto max-h-[65vh] w-full object-contain"
              controls
              autoPlay
              loop
              playsInline
            />
          ) : (
            <img
              key={current.src}
              src={current.src}
              alt={project.title}
              decoding="async"
              className="h-auto max-h-[65vh] w-full object-contain"
            />
          )}

          {hasMany && (
            <>
              <button
                onClick={() => go(-1)}
                aria-label="Previous"
                className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground hover:text-primary hover:glow-primary transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Next"
                className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground hover:text-primary hover:glow-primary transition"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1 text-xs text-muted-foreground">
                {safeIdx + 1} / {media.length}
              </div>
            </>
          )}
        </div>

        {hasMany && (
          <div className="flex gap-2 overflow-x-auto border-b border-border bg-background/40 p-3">
            {media.map((mItem, i) => (
              <button
                key={mItem.src}
                onClick={() => setIdx(i)}
                className={`relative shrink-0 overflow-hidden rounded-md border transition ${
                  i === safeIdx ? "border-primary glow-primary" : "border-border opacity-70 hover:opacity-100"
                }`}
              >
                {mItem.type === "video" ? (
                  <div className="grid h-14 w-20 place-items-center bg-black/60 text-[10px] text-primary">
                    VIDEO
                  </div>
                ) : (
                  <img
                    src={toThumbUrl(mItem.src, 160)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-14 w-20 object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        )}

        <div className="p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{project.tag}</p>
          <h3 className="mt-2 text-2xl font-bold md:text-3xl">{project.title}</h3>
          {current.caption && hasMany && (
            <p className="mt-3 text-sm italic text-primary/90">{current.caption}</p>
          )}
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{project.desc}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-md border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
              {project.tool}
            </span>
            <span className="rounded-md border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
              {project.cat}
            </span>
            {project.externalLink && (
              <a
                href={project.externalLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-90 transition"
              >
                <ExternalLink className="h-3 w-3" /> Open link
              </a>
            )}
          </div>
        </div>
      </m.div>
    </div>
  );
}
