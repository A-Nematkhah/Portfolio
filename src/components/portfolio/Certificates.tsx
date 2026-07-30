import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { m } from "framer-motion";
import { ArrowRight, X, ExternalLink } from "lucide-react";
import { CERTIFICATES, type Certificate } from "@/data/content";
import { useModalA11y } from "@/hooks/use-modal-a11y";

const AUTO_PX_PER_SEC = 36;
const RESUME_DELAY_MS = 1400;

export function Certificates() {
  const [active, setActive] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="py-20">
      <div data-lidar-object="CREDENTIALS" className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Credentials</p>
        <h2 className="mt-3 text-4xl font-bold md:text-5xl">Certificates</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          Professional courses and credentials earned across engineering, simulation, and
          intelligent systems.
        </p>
      </div>

      <CertRail paused={!!active} onOpen={setActive} />

      <CertificateModal certificate={active} onClose={() => setActive(null)} />
    </section>
  );
}

function CertRail({
  paused,
  onOpen,
}: {
  paused: boolean;
  onOpen: (c: Certificate) => void;
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const loopWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const lastXRef = useRef(0);
  const resumeAtRef = useRef(0);
  const reduceMotionRef = useRef(false);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);

  const loop = [...CERTIFICATES, ...CERTIFICATES];

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // Half of duplicated track = one full set
    loopWidthRef.current = track.scrollWidth / 2;
  }, []);

  const applyTransform = useCallback(() => {
    const track = trackRef.current;
    const loopW = loopWidthRef.current;
    if (!track || loopW <= 0) return;
    // Keep offset in [0, loopW)
    let x = offsetRef.current % loopW;
    if (x < 0) x += loopW;
    offsetRef.current = x;
    track.style.transform = `translate3d(${-x}px, 0, 0)`;
  }, []);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    measure();
    applyTransform();

    const ro = new ResizeObserver(() => {
      measure();
      applyTransform();
    });
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);

    const tick = (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min(48, ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      const autoAllowed =
        !reduceMotionRef.current &&
        !paused &&
        !draggingRef.current &&
        performance.now() >= resumeAtRef.current;

      if (autoAllowed && loopWidthRef.current > 0) {
        // Positive offset → content moves left (RTL travel)
        offsetRef.current += AUTO_PX_PER_SEC * dt;
        applyTransform();
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [applyTransform, measure, paused]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    draggingRef.current = true;
    movedRef.current = false;
    pointerIdRef.current = e.pointerId;
    lastXRef.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || pointerIdRef.current !== e.pointerId) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    if (Math.abs(dx) > 1) movedRef.current = true;
    // Drag right → content follows finger (offset decreases)
    offsetRef.current -= dx;
    applyTransform();
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    draggingRef.current = false;
    pointerIdRef.current = null;
    resumeAtRef.current = performance.now() + RESUME_DELAY_MS;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  };

  const onCardClick = (c: Certificate) => {
    // Ignore click if this was a drag gesture
    if (movedRef.current) return;
    onOpen(c);
  };

  return (
    <div
      ref={viewportRef}
      className="cert-marquee mt-12"
      data-lidar-object="CERTIFICATE RAIL"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div ref={trackRef} className="cert-marquee-track is-interactive">
        {loop.map((c, i) => (
          <button
            key={`${c.certId}-${i}`}
            type="button"
            data-lidar-object={i < CERTIFICATES.length ? c.title : undefined}
            onClick={() => onCardClick(c)}
            className="cert-marquee-card group relative overflow-hidden rounded-xl surface-card p-3 text-left hover:glow-primary"
          >
            <div className="overflow-hidden rounded-lg bg-muted aspect-[16/11]">
              <img
                src={c.src}
                alt={c.title}
                width={c.width}
                height={c.height}
                loading="lazy"
                draggable={false}
                className="pointer-events-none h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 px-1">
              <span className="truncate text-xs font-medium text-muted-foreground">{c.issuer}</span>
              <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
                View <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function CertificateModal({
  certificate,
  onClose,
}: {
  certificate: Certificate | null;
  onClose: () => void;
}) {
  const close = useCallback(() => onClose(), [onClose]);
  const dialogRef = useModalA11y(!!certificate, close);

  if (!certificate) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fade-in"
      onClick={close}
    >
      <m.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={certificate.title}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl glass border border-border outline-none"
      >
        <button
          onClick={close}
          aria-label="Close"
          data-modal-close
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-background/80 text-foreground hover:text-primary hover:glow-primary transition"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="bg-black/40">
          <img
            src={certificate.src}
            alt={certificate.title}
            width={certificate.width}
            height={certificate.height}
            className="h-auto max-h-[75vh] w-full object-contain"
          />
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {certificate.category} <span className="mx-2 opacity-60">•</span> {certificate.issuer}
          </p>
          <h3 className="mt-3 text-2xl font-bold md:text-3xl">{certificate.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Instructed by {certificate.instructor}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { l: "Issued", v: certificate.issued },
              { l: "Certificate ID", v: certificate.certId },
              { l: "Issuer", v: certificate.issuer },
            ].map((f) => (
              <div key={f.l} className="rounded-xl border border-border bg-secondary/30 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {f.l}
                </p>
                <p className="mt-2 font-mono text-sm text-foreground">{f.v}</p>
              </div>
            ))}
          </div>

          <a
            href={certificate.verifyUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-6"
          >
            <ExternalLink className="h-4 w-4" /> Verify Certificate
          </a>
        </div>
      </m.div>
    </div>
  );
}
