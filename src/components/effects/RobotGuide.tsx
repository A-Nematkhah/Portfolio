import { useEffect, useRef, useState } from "react";
import {
  ROBOT_ARRIVAL_PAUSE_MS,
  ROBOT_GUIDE_NAME,
  ROBOT_GUIDE_STOPS,
  ROBOT_NOTE_DURATION_MS,
  type RobotGuideStop,
} from "@/data/robot-guide";

const LERP = 0.075;
const MAX_STEP_PX = 10;
const MIN_VIEW_Y = 0.28;
const MAX_VIEW_Y = 0.58;
const SECTION_BLEND = 0.22; // slight pull toward active section — most motion from scroll

function GuideRobotSvg({ scanning }: { scanning: boolean }) {
  return (
    <svg viewBox="0 0 64 78" width="72" height="88" aria-hidden className="robot-guide-svg">
      <defs>
        <linearGradient id="rg-body" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.98 0.005 85)" />
          <stop offset="100%" stopColor="oklch(0.9 0.01 85)" />
        </linearGradient>
        <linearGradient id="rg-metal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="oklch(0.78 0.02 260)" />
          <stop offset="100%" stopColor="oklch(0.55 0.03 260)" />
        </linearGradient>
      </defs>

      <ellipse cx="32" cy="72" rx="16" ry="3.5" fill="oklch(0.22 0.04 260 / 0.12)" />

      <circle
        cx="18"
        cy="62"
        r="7"
        fill="url(#rg-metal)"
        stroke="oklch(0.22 0.04 260 / 0.2)"
        strokeWidth="1"
      />
      <circle
        cx="46"
        cy="62"
        r="7"
        fill="url(#rg-metal)"
        stroke="oklch(0.22 0.04 260 / 0.2)"
        strokeWidth="1"
      />
      <circle cx="18" cy="62" r="2.4" fill="oklch(0.22 0.04 260 / 0.45)" />
      <circle cx="46" cy="62" r="2.4" fill="oklch(0.22 0.04 260 / 0.45)" />

      <rect
        x="14"
        y="38"
        width="36"
        height="24"
        rx="6"
        fill="url(#rg-body)"
        stroke="oklch(0.22 0.04 260 / 0.14)"
        strokeWidth="1.2"
      />
      <rect x="18" y="42" width="28" height="8" rx="2" fill="oklch(0.22 0.04 260 / 0.06)" />
      <circle cx="22" cy="54" r="1.6" fill="var(--primary)" opacity="0.85" />
      <circle cx="28" cy="54" r="1.6" fill="oklch(0.22 0.04 260 / 0.25)" />
      <circle cx="34" cy="54" r="1.6" fill="oklch(0.22 0.04 260 / 0.25)" />

      <rect x="30" y="22" width="4" height="18" rx="1.5" fill="url(#rg-metal)" />

      <rect
        x="22"
        y="10"
        width="20"
        height="14"
        rx="4"
        fill="url(#rg-body)"
        stroke="oklch(0.22 0.04 260 / 0.16)"
        strokeWidth="1.2"
      />
      <circle cx="32" cy="17" r="4.2" fill="oklch(0.22 0.04 260 / 0.75)" />
      <circle
        cx="32"
        cy="17"
        r="2.2"
        className={scanning ? "robot-guide-lens is-scanning" : "robot-guide-lens"}
        fill="var(--primary)"
      />
      <line
        x1="40"
        y1="12"
        x2="46"
        y2="4"
        stroke="oklch(0.22 0.04 260 / 0.35)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle
        cx="46"
        cy="4"
        r="2"
        fill="var(--primary)"
        className={scanning ? "robot-guide-beacon" : ""}
      />
    </svg>
  );
}

export function RobotGuide() {
  const motionRef = useRef<HTMLDivElement>(null);
  const yRef = useRef(typeof window !== "undefined" ? window.innerHeight * 0.4 : 280);
  const targetYRef = useRef(yRef.current);
  const tiltRef = useRef(0);
  const rafRef = useRef(0);
  const noteTimerRef = useRef<number | null>(null);
  const pauseTimerRef = useRef<number | null>(null);
  const lastStopIdRef = useRef<string | null>(null);
  const reduceMotionRef = useRef(false);
  const pausedRef = useRef(false);
  const lastScrollYRef = useRef(0);

  const noteOpenRef = useRef(false);
  const [entered, setEntered] = useState(false);
  const [activeStop, setActiveStop] = useState<RobotGuideStop | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [hidden, setHidden] = useState(false);

  const setNoteOpenSafe = (open: boolean) => {
    noteOpenRef.current = open;
    setNoteOpen(open);
  };

  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqNarrow = window.matchMedia("(max-width: 1023px)");
    reduceMotionRef.current = mqMotion.matches;
    setHidden(mqNarrow.matches);

    const onMotion = () => {
      reduceMotionRef.current = mqMotion.matches;
    };
    const onNarrow = () => setHidden(mqNarrow.matches);
    mqMotion.addEventListener("change", onMotion);
    mqNarrow.addEventListener("change", onNarrow);

    const enterId = window.setTimeout(() => setEntered(true), reduceMotionRef.current ? 0 : 420);

    return () => {
      mqMotion.removeEventListener("change", onMotion);
      mqNarrow.removeEventListener("change", onNarrow);
      window.clearTimeout(enterId);
    };
  }, []);

  useEffect(() => {
    if (hidden) return;

    const ratios = new Map<string, number>();

    const clampY = (y: number) => {
      const min = window.innerHeight * MIN_VIEW_Y;
      const max = window.innerHeight * MAX_VIEW_Y;
      return Math.min(max, Math.max(min, y));
    };

    /** Continuous scroll-driven baseline — no section jumps. */
    const scrollBaselineY = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const t = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      const min = window.innerHeight * MIN_VIEW_Y;
      const max = window.innerHeight * MAX_VIEW_Y;
      return min + t * (max - min);
    };

    const sectionIdealY = (stop: RobotGuideStop) => {
      const el = document.querySelector(stop.selector);
      if (!el) return scrollBaselineY();
      const rect = el.getBoundingClientRect();
      return clampY(rect.top + Math.min(Math.max(rect.height * 0.25, 48), 120));
    };

    const updateTargetY = (stop: RobotGuideStop | null) => {
      const base = scrollBaselineY();
      if (!stop) {
        targetYRef.current = base;
        return;
      }
      // Soft blend only — never hard-snap to section position
      targetYRef.current = base * (1 - SECTION_BLEND) + sectionIdealY(stop) * SECTION_BLEND;
    };

    const pickActive = (): RobotGuideStop | null => {
      let bestId: string | null = null;
      let bestRatio = 0;
      for (const stop of ROBOT_GUIDE_STOPS) {
        const r = ratios.get(stop.id) ?? 0;
        if (r > bestRatio) {
          bestRatio = r;
          bestId = stop.id;
        }
      }
      if (bestRatio < 0.12) {
        let nearest: { id: string; dist: number } | null = null;
        const mid = window.innerHeight * 0.42;
        for (const stop of ROBOT_GUIDE_STOPS) {
          const el = document.querySelector(stop.selector);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.bottom < 80 || rect.top > window.innerHeight - 80) continue;
          const center = rect.top + rect.height * 0.3;
          const dist = Math.abs(center - mid);
          if (!nearest || dist < nearest.dist) nearest = { id: stop.id, dist };
        }
        bestId = nearest?.id ?? bestId;
      }
      return ROBOT_GUIDE_STOPS.find((s) => s.id === bestId) ?? null;
    };

    const scheduleNoteDismiss = (ms: number) => {
      if (noteTimerRef.current) window.clearTimeout(noteTimerRef.current);
      noteTimerRef.current = window.setTimeout(() => {
        setNoteOpenSafe(false);
      }, ms);
    };

    const announceStop = (stop: RobotGuideStop) => {
      if (stop.id === lastStopIdRef.current) return;
      lastStopIdRef.current = stop.id;
      setActiveStop(stop);

      if (noteTimerRef.current) window.clearTimeout(noteTimerRef.current);
      if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current);

      // Visual "pause" for the note only — do NOT snap / freeze Y (that caused jumps)
      pausedRef.current = true;
      setNoteOpenSafe(false);
      setScanning(true);

      const pause = reduceMotionRef.current ? 0 : ROBOT_ARRIVAL_PAUSE_MS;
      pauseTimerRef.current = window.setTimeout(() => {
        setNoteOpenSafe(true);
        pausedRef.current = false;
        // Longer while the visitor is idle and reading
        scheduleNoteDismiss(ROBOT_NOTE_DURATION_MS);
      }, pause);
    };

    const sync = () => {
      const stop = pickActive();
      updateTargetY(stop);
      if (stop) announceStop(stop);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.robotStop;
          if (!id) continue;
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        sync();
      },
      {
        root: null,
        threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8],
        rootMargin: "-12% 0px -38% 0px",
      },
    );

    const observed: Element[] = [];
    for (const stop of ROBOT_GUIDE_STOPS) {
      const el = document.querySelector(stop.selector);
      if (!el) continue;
      (el as HTMLElement).dataset.robotStop = stop.id;
      observer.observe(el);
      observed.push(el);
    }

    sync();

    let scrollRaf = 0;
    let idleRestartTimer: number | null = null;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        const sy = window.scrollY;
        const dy = sy - lastScrollYRef.current;
        lastScrollYRef.current = sy;
        if (!reduceMotionRef.current) {
          tiltRef.current = Math.max(-3.5, Math.min(3.5, tiltRef.current + dy * 0.02));
        }
        // Keep note up while moving; when the user stops, give a full idle read window
        if (noteOpenRef.current && Math.abs(dy) > 1) {
          if (noteTimerRef.current) window.clearTimeout(noteTimerRef.current);
          if (idleRestartTimer) window.clearTimeout(idleRestartTimer);
          idleRestartTimer = window.setTimeout(() => {
            scheduleNoteDismiss(ROBOT_NOTE_DURATION_MS);
          }, 450);
        }
        sync();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", sync, { passive: true });

    const tick = () => {
      const motion = motionRef.current;
      if (motion) {
        const target = targetYRef.current;
        if (reduceMotionRef.current) {
          yRef.current = target;
        } else {
          // Always ease — never snap. Cap step so section changes can't jerk.
          const diff = target - yRef.current;
          const eased = diff * LERP;
          const step = Math.sign(eased) * Math.min(Math.abs(eased), MAX_STEP_PX);
          // While note is arriving, ease a bit slower (hold feel) without freezing
          yRef.current += pausedRef.current ? step * 0.45 : step;
        }
        tiltRef.current *= 0.9;
        motion.style.setProperty("--rg-y", `${yRef.current.toFixed(2)}px`);
        motion.style.setProperty("--rg-tilt", `${tiltRef.current.toFixed(2)}deg`);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      for (const el of observed) {
        delete (el as HTMLElement).dataset.robotStop;
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", sync);
      cancelAnimationFrame(rafRef.current);
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (noteTimerRef.current) window.clearTimeout(noteTimerRef.current);
      if (pauseTimerRef.current) window.clearTimeout(pauseTimerRef.current);
      if (idleRestartTimer) window.clearTimeout(idleRestartTimer);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      className={`robot-guide ${entered ? "is-entered" : ""} ${noteOpen ? "is-note-open" : ""}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div ref={motionRef} className="robot-guide-motion">
        <div className="robot-guide-stack">
          <div
            className={`robot-guide-note ${noteOpen && activeStop ? "is-open" : ""}`}
            role="status"
          >
            {activeStop && (
              <>
                <p className="robot-guide-note-meta">
                  <span>{ROBOT_GUIDE_NAME.toUpperCase()} NOTE</span>
                  <span aria-hidden> // </span>
                  <span>{activeStop.code}</span>
                  <span className="robot-guide-note-label">{activeStop.label}</span>
                </p>
                <p className="robot-guide-note-body">
                  {activeStop.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                <span className="robot-guide-note-stem" aria-hidden />
              </>
            )}
          </div>

          <div className="robot-guide-unit" aria-hidden>
            <GuideRobotSvg scanning={scanning && noteOpen === false} />
            <p className="robot-guide-name">{ROBOT_GUIDE_NAME}</p>
          </div>
        </div>
      </div>

      <span className="sr-only">
        {activeStop
          ? `${ROBOT_GUIDE_NAME} at ${activeStop.label}: ${activeStop.lines.join(" ")}`
          : `${ROBOT_GUIDE_NAME}, portfolio guide robot`}
      </span>
    </div>
  );
}
