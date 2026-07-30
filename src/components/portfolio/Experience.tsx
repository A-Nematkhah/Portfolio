import { useEffect, useMemo, useRef, useState } from "react";
import { EXPERIENCE } from "@/data/content";

const VIEW_W = 1000;
const PAD_Y = 72;
const SEG_H = 420;

type Point = { x: number; y: number };

function buildRoadPath(
  count: number,
  amplitude: number,
  centerX = VIEW_W / 2,
): { d: string; height: number; stops: number[] } {
  const height = PAD_Y * 2 + Math.max(1, count - 1) * SEG_H + 40;
  const cx = centerX;
  const stops: number[] = [];
  let d = `M ${cx} ${PAD_Y}`;
  stops.push(0);

  for (let i = 1; i < count; i++) {
    const y0 = PAD_Y + (i - 1) * SEG_H;
    const y1 = PAD_Y + i * SEG_H;
    const dir = i % 2 === 1 ? 1 : -1;
    const bulge = cx + dir * amplitude;
    d += ` C ${bulge} ${y0 + SEG_H * 0.22}, ${bulge} ${y1 - SEG_H * 0.22}, ${cx} ${y1}`;
    stops.push(i / Math.max(1, count - 1));
  }

  if (count === 1) {
    d = `M ${cx} ${PAD_Y} L ${cx} ${height - PAD_Y}`;
    stops[0] = 0.5;
  }

  return { d, height, stops };
}

function GuideCar({
  blink,
  rolling,
  moving,
}: {
  blink: boolean;
  rolling: boolean;
  moving: boolean;
}) {
  return (
    <g
      className={`ir-vehicle ${rolling ? "is-rolling" : ""} ${blink ? "is-blink" : ""} ${moving ? "is-moving" : ""}`}
      transform="scale(1.55)"
    >
      <defs>
        <linearGradient id="ir-car-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.99 0.004 85)" />
          <stop offset="40%" stopColor="oklch(0.95 0.008 85)" />
          <stop offset="100%" stopColor="oklch(0.86 0.014 85)" />
        </linearGradient>
        <linearGradient id="ir-car-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.55 0.04 250 / 0.45)" />
          <stop offset="100%" stopColor="oklch(0.28 0.04 250 / 0.55)" />
        </linearGradient>
        <linearGradient id="ir-car-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.82 0.015 260)" />
          <stop offset="100%" stopColor="oklch(0.52 0.02 260)" />
        </linearGradient>
        <radialGradient id="ir-car-hub" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="oklch(0.9 0.01 260)" />
          <stop offset="55%" stopColor="oklch(0.7 0.015 260)" />
          <stop offset="100%" stopColor="oklch(0.45 0.02 260)" />
        </radialGradient>
        <linearGradient id="ir-car-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(1 0 0 / 0.45)" />
          <stop offset="100%" stopColor="oklch(1 0 0 / 0)" />
        </linearGradient>
      </defs>

      <ellipse cx="0" cy="12.8" rx="19" ry="2.8" className="ir-vehicle-shadow" />

      {/* lower rocker / side skirt */}
      <path
        d="M-18.5 6.2 C-16 8.2 -10 9.2 -4 9.2 L8 9.2 C14 9.2 17.5 8 19 6.2 L19 4.5 L-18.5 4.5 Z"
        className="ir-car-rocker"
      />

      {/* main body */}
      <path
        d="M-19.5 4.8
           C-19.8 1.5 -18.5 -2.2 -15.5 -3.8
           L-9.5 -4.2
           L-6.5 -11.2
           C-5.2 -13.4 -3.2 -14.4 -0.8 -14.4
           L7.2 -14.4
           C10.2 -14.4 12.4 -13.2 13.6 -11.2
           L16.2 -4.4
           L18.2 -3.6
           C20.2 -2.6 20.6 0.2 20.2 2.8
           L19.6 6.4
           C18.2 8.6 14.5 9.6 8.5 9.6
           L-5 9.6
           C-12.5 9.6 -17.8 8.4 -19.5 4.8 Z"
        fill="url(#ir-car-body)"
        className="ir-car-body"
      />

      {/* roof highlight */}
      <path
        d="M-5.8 -11.6 C-4.6 -13.2 -2.8 -13.9 -0.6 -13.9 L7 -13.9 C9.6 -13.9 11.5 -13.1 12.6 -11.5 L11.2 -8.2 L-4.6 -8.6 Z"
        fill="url(#ir-car-shine)"
      />

      {/* greenhouse / glass */}
      <path
        d="M-5.2 -4.5 L-2.8 -11.5 C-2 -12.8 -0.8 -13.4 0.6 -13.4 L7 -13.4 C8.8 -13.4 10.2 -12.7 11 -11.5 L13.4 -4.5 Z"
        fill="url(#ir-car-glass)"
        className="ir-car-glass"
      />
      {/* window divider */}
      <path d="M4.2 -13.2 L5.4 -4.6" className="ir-car-window-bar" />
      {/* glass reflection */}
      <path d="M-1.2 -12.8 L2.8 -12.8 L3.2 -8.2 L-0.4 -8.5 Z" className="ir-car-glass-shine" />

      {/* door line + handle */}
      <path d="M5.6 -4.2 L5.6 7.8" className="ir-car-seam" />
      <rect x="6.4" y="0.2" width="3.2" height="1.1" rx="0.5" className="ir-car-handle" />

      {/* front bumper / grille */}
      <path
        d="M16.8 -2.8 L19.4 -2.2 C20.4 -1.6 20.6 0.6 20.2 2.6 L19.6 5.2 L16.5 5.6 Z"
        fill="url(#ir-car-chrome)"
        className="ir-car-bumper"
      />
      <path d="M17.6 -0.8 H19.6 M17.6 1.2 H19.6 M17.6 3.2 H19.5" className="ir-car-grille-lines" />

      {/* headlights */}
      <ellipse cx="18.6" cy="-1.6" rx="1.7" ry="1.25" className="ir-vehicle-light" />
      <ellipse cx="18.8" cy="2.4" rx="1.2" ry="1" className="ir-vehicle-light dim" />

      {/* rear light */}
      <path d="M-18.8 -1.6 L-17.2 -2.4 L-16.8 1.8 L-18.6 2.4 Z" className="ir-car-tail" />
      {/* exhaust tip */}
      <rect x="-20.2" y="5.2" width="2.4" height="1.4" rx="0.4" className="ir-car-exhaust-tip" />

      {/* exhaust smoke — visible while moving */}
      <g className="ir-exhaust" transform="translate(-21, 5.6)" aria-hidden>
        <circle className="ir-smoke ir-smoke-1" cx="0" cy="0" r="2.2" />
        <circle className="ir-smoke ir-smoke-2" cx="-3" cy="-1" r="2.8" />
        <circle className="ir-smoke ir-smoke-3" cx="-7" cy="0.4" r="3.4" />
        <circle className="ir-smoke ir-smoke-4" cx="-11.5" cy="-0.8" r="4" />
      </g>

      {/* mirror */}
      <path d="M13.8 -5.2 L16.4 -6.4 L16.6 -4.8 L14.2 -4.2 Z" className="ir-car-mirror" />

      {/* wheels */}
      <g transform="translate(-9.5, 8.6)">
        <g className="ir-wheel">
          <circle r="6.4" className="ir-vehicle-tire" />
          <circle r="4.9" className="ir-vehicle-wheel" />
          <circle r="2.5" fill="url(#ir-car-hub)" className="ir-vehicle-hub" />
          <path
            d="M0 -2.6 L0.7 -0.8 L2.6 -0.8 L1.1 0.4 L1.7 2.3 L0 1.2 L-1.7 2.3 L-1.1 0.4 L-2.6 -0.8 L-0.7 -0.8 Z"
            className="ir-car-spoke"
          />
          <circle r="0.9" className="ir-car-cap" />
        </g>
      </g>
      <g transform="translate(9.2, 8.6)">
        <g className="ir-wheel">
          <circle r="6.4" className="ir-vehicle-tire" />
          <circle r="4.9" className="ir-vehicle-wheel" />
          <circle r="2.5" fill="url(#ir-car-hub)" className="ir-vehicle-hub" />
          <path
            d="M0 -2.6 L0.7 -0.8 L2.6 -0.8 L1.1 0.4 L1.7 2.3 L0 1.2 L-1.7 2.3 L-1.1 0.4 L-2.6 -0.8 L-0.7 -0.8 Z"
            className="ir-car-spoke"
          />
          <circle r="0.9" className="ir-car-cap" />
        </g>
      </g>
    </g>
  );
}

export function Experience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const progressGlowRef = useRef<SVGPathElement>(null);
  const vehicleRef = useRef<SVGGElement>(null);
  const progressValue = useRef(0);
  const targetProgress = useRef(0);
  const rafRef = useRef(0);
  const lastActive = useRef(-1);
  const reduceMotion = useRef(false);

  const [tier, setTier] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeIdx, setActiveIdx] = useState(0);
  const [blink, setBlink] = useState(false);
  const [moving, setMoving] = useState(false);
  const [markers, setMarkers] = useState<Point[]>([]);
  const lastProgressRef = useRef(0);
  const [sides, setSides] = useState<("left" | "right")[]>([]);

  const amplitude = tier === "mobile" ? 55 : tier === "tablet" ? 160 : 240;
  const centerX = tier === "mobile" ? 150 : VIEW_W / 2;
  const road = useMemo(
    () => buildRoadPath(EXPERIENCE.length, amplitude, centerX),
    [amplitude, centerX],
  );

  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotion.current = mqMotion.matches;
    const onMotion = () => {
      reduceMotion.current = mqMotion.matches;
    };
    mqMotion.addEventListener("change", onMotion);

    const syncTier = () => {
      const w = window.innerWidth;
      setTier(w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop");
    };
    syncTier();
    window.addEventListener("resize", syncTier);
    return () => {
      mqMotion.removeEventListener("change", onMotion);
      window.removeEventListener("resize", syncTier);
    };
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    const progressPath = progressRef.current;
    const progressGlow = progressGlowRef.current;
    if (!path || !progressPath) return;

    const total = path.getTotalLength();
    progressPath.style.strokeDasharray = `${total}`;
    progressPath.style.strokeDashoffset = `${total}`;
    if (progressGlow) {
      progressGlow.style.strokeDasharray = `${total}`;
      progressGlow.style.strokeDashoffset = `${total}`;
    }

    const nextMarkers: Point[] = [];
    const nextSides: ("left" | "right")[] = [];
    for (let i = 0; i < EXPERIENCE.length; i++) {
      const t = road.stops[i] ?? i / Math.max(1, EXPERIENCE.length - 1);
      const pt = path.getPointAtLength(t * total);
      nextMarkers.push(pt);
      nextSides.push(tier === "mobile" ? "right" : i % 2 === 0 ? "left" : "right");
    }
    setMarkers(nextMarkers);
    setSides(nextSides);

    const placeVehicle = (p: number) => {
      const vehicle = vehicleRef.current;
      if (!vehicle) return;
      const len = Math.max(0, Math.min(1, p)) * total;
      const pt = path.getPointAtLength(len);
      const look = path.getPointAtLength(Math.min(total, len + 2));
      const angle = (Math.atan2(look.y - pt.y, look.x - pt.x) * 180) / Math.PI;
      vehicle.setAttribute("transform", `translate(${pt.x}, ${pt.y}) rotate(${angle})`);
      progressPath.style.strokeDashoffset = `${total * (1 - p)}`;
      if (progressGlow) progressGlow.style.strokeDashoffset = `${total * (1 - p)}`;
    };

    /** Map viewport focus line → path progress so the truck arrives with each station. */
    const progressForViewY = (targetY: number) => {
      let lo = 0;
      let hi = total;
      for (let i = 0; i < 28; i++) {
        const mid = (lo + hi) / 2;
        if (path.getPointAtLength(mid).y < targetY) lo = mid;
        else hi = mid;
      }
      return lo / total;
    };

    const syncTargetFromScroll = () => {
      const track = trackRef.current;
      const svg = track?.querySelector("svg");
      if (!track || !svg) return;
      const svgRect = svg.getBoundingClientRect();
      if (svgRect.height < 1) return;

      // Focus band in the viewport — truck stays on the road at this screen line
      const focusScreenY = window.innerHeight * 0.45;
      const viewY = ((focusScreenY - svgRect.top) / svgRect.height) * road.height;
      const clampedY = Math.max(PAD_Y, Math.min(road.height - PAD_Y, viewY));
      targetProgress.current = progressForViewY(clampedY);

      // Before the road enters the focus line → stay at start
      if (svgRect.top > focusScreenY) targetProgress.current = 0;
      // After the road leaves the focus line → stay at end
      if (svgRect.bottom < focusScreenY) targetProgress.current = 1;
    };

    const activateCheckpoint = (idx: number) => {
      if (idx === lastActive.current) return;
      lastActive.current = idx;
      setActiveIdx(idx);
      setBlink(true);
      window.setTimeout(() => setBlink(false), 520);
    };

    const tick = () => {
      syncTargetFromScroll();
      const target = targetProgress.current;
      if (reduceMotion.current) {
        progressValue.current = target;
      } else {
        // Smooth follow — slightly slower near stops so arrival feels deliberate
        let nearestDist = 1;
        for (const s of road.stops) {
          nearestDist = Math.min(nearestDist, Math.abs(s - progressValue.current));
        }
        const near = nearestDist < 0.06;
        const lerp = near ? 0.055 : 0.1;
        progressValue.current += (target - progressValue.current) * lerp;
        if (Math.abs(target - progressValue.current) < 0.0008) {
          progressValue.current = target;
        }
      }
      placeVehicle(progressValue.current);

      const delta = Math.abs(progressValue.current - lastProgressRef.current);
      lastProgressRef.current = progressValue.current;
      const isMoving = delta > 0.00015;
      setMoving((prev) => (prev === isMoving ? prev : isMoving));

      // Activate checkpoint when the truck is close to that stop
      let idx = 0;
      let best = Infinity;
      for (let i = 0; i < road.stops.length; i++) {
        const d = Math.abs(progressValue.current - road.stops[i]);
        if (d < best) {
          best = d;
          idx = i;
        }
      }
      // Prefer the stop we've reached / passed if two are similar
      for (let i = 0; i < road.stops.length; i++) {
        if (progressValue.current + 0.03 >= road.stops[i]) idx = i;
      }
      activateCheckpoint(idx);

      rafRef.current = requestAnimationFrame(tick);
    };

    syncTargetFromScroll();
    placeVehicle(0);
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [road, tier]);

  return (
    <section id="experience" className="py-20">
      <div data-lidar-object="CAREER TIMELINE" className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Experience</p>
        <h2 className="mt-3 text-4xl font-bold md:text-5xl">Industrial Timeline</h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
          Scroll to follow the route — each checkpoint is a stop on the engineering journey.
        </p>
      </div>

      <div ref={trackRef} className="industrial-road relative mt-14">
        <svg
          className="industrial-road-svg"
          viewBox={`0 0 ${VIEW_W} ${road.height}`}
          preserveAspectRatio="xMidYMin meet"
          aria-hidden
        >
          <defs>
            <linearGradient id="ir-road-asphalt" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.42 0.02 260 / 0.14)" />
              <stop offset="18%" stopColor="oklch(0.32 0.02 260 / 0.2)" />
              <stop offset="50%" stopColor="oklch(0.28 0.02 260 / 0.24)" />
              <stop offset="82%" stopColor="oklch(0.32 0.02 260 / 0.2)" />
              <stop offset="100%" stopColor="oklch(0.42 0.02 260 / 0.14)" />
            </linearGradient>
            <linearGradient id="ir-road-curb" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.22 0.04 260 / 0.06)" />
              <stop offset="50%" stopColor="oklch(0.22 0.04 260 / 0.14)" />
              <stop offset="100%" stopColor="oklch(0.22 0.04 260 / 0.06)" />
            </linearGradient>
            <filter id="ir-progress-soft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d={road.d}
            className="ir-road-ground"
            fill="none"
            strokeWidth={tier === "mobile" ? 48 : 64}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={road.d}
            className="ir-road-shoulder"
            fill="none"
            stroke="url(#ir-road-curb)"
            strokeWidth={tier === "mobile" ? 40 : 54}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={road.d}
            className="ir-road-rim"
            fill="none"
            strokeWidth={tier === "mobile" ? 30 : 40}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={road.d}
            className="ir-road-bed"
            fill="none"
            stroke="url(#ir-road-asphalt)"
            strokeWidth={tier === "mobile" ? 24 : 32}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={road.d}
            className="ir-road-lane"
            fill="none"
            strokeWidth={tier === "mobile" ? 16 : 22}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            ref={pathRef}
            d={road.d}
            className="ir-road-base"
            fill="none"
            strokeWidth={tier === "mobile" ? 2 : 2.75}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            ref={progressGlowRef}
            d={road.d}
            className="ir-road-progress-glow"
            fill="none"
            strokeWidth={tier === "mobile" ? 12 : 16}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#ir-progress-soft)"
          />
          <path
            ref={progressRef}
            d={road.d}
            className="ir-road-progress"
            fill="none"
            strokeWidth={tier === "mobile" ? 3.25 : 4.25}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* real-road style center dashed line (always on top) */}
          <path
            d={road.d}
            className="ir-road-dash"
            fill="none"
            strokeWidth={tier === "mobile" ? 2.4 : 3.1}
            strokeLinecap="butt"
            strokeLinejoin="round"
            strokeDasharray={tier === "mobile" ? "14 12" : "18 14"}
          />

          {/* checkpoint markers on path */}
          {markers.map((pt, i) => (
            <g key={`mk-${EXPERIENCE[i].co}`} transform={`translate(${pt.x}, ${pt.y})`}>
              <circle
                r={activeIdx === i ? 9 : 7}
                className={`ir-marker-ring ${activeIdx === i ? "is-active" : ""}`}
              />
              <circle r={3.2} className={`ir-marker-dot ${activeIdx === i ? "is-active" : ""}`} />
              {activeIdx === i && (
                <g className="ir-flag" transform="translate(10,-18)">
                  <line x1="0" y1="0" x2="0" y2="18" className="ir-flag-pole" />
                  <path d="M0 0 L14 4 L0 8 Z" className="ir-flag-cloth" />
                </g>
              )}
            </g>
          ))}

          <g ref={vehicleRef}>
            <GuideCar blink={blink} rolling moving={moving} />
          </g>
        </svg>

        {/* HTML cards anchored to path points */}
        <div className="industrial-road-cards" style={{ paddingBottom: "2rem" }}>
          {EXPERIENCE.map((e, i) => {
            const pt = markers[i];
            if (!pt) return null;
            const side = sides[i] ?? (i % 2 === 0 ? "left" : "right");
            const topPct = (pt.y / road.height) * 100;
            const active = activeIdx === i;
            return (
              <div
                key={e.co}
                className={`ir-checkpoint ${side} ${active ? "is-active" : ""}`}
                style={{ top: `${topPct}%` }}
                data-lidar-object={e.co}
              >
                <div className="ir-checkpoint-meta">
                  <span className="ir-checkpoint-year">{e.year}</span>
                  <span className="ir-checkpoint-code">CP-{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="ir-checkpoint-card rounded-xl glass p-5 md:p-6">
                  <div className="flex items-start gap-3">
                    {e.logo ? (
                      <img
                        src={e.logo}
                        alt=""
                        className="mt-0.5 h-9 w-9 shrink-0 rounded-lg border border-border object-contain bg-background/80 p-1"
                      />
                    ) : e.current ? (
                      <div
                        className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-secondary/50 text-[10px] font-semibold tracking-wide text-primary"
                        aria-hidden
                        data-logo-placeholder="supishi"
                        title="Replace with Supishi logo"
                      >
                        SP
                      </div>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs text-primary">{e.role}</p>
                        {e.current && (
                          <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-primary">
                            Current
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 text-lg font-semibold">{e.co}</h3>
                      {e.dept && (
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{e.dept}</p>
                      )}
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                    {e.bullets.map((b) => (
                      <li key={b}>• {b}</li>
                    ))}
                  </ul>
                  {e.tags && e.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {e.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
