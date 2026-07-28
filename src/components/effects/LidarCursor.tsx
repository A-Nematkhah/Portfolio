import { useEffect, useRef } from "react";

/**
 * LidarCursor
 * ------------------------------------------------------------------
 * Replaces the desktop pointer with a small LiDAR-scanner-style
 * reticle: a dashed scan ring, a rotating radar sweep, a pulsing
 * center dot, and a floating monospace readout that reports
 * context-aware "scan" data for whatever is under the cursor.
 *
 * Hoverable targets opt in via data attributes in the markup:
 *   data-lidar-object="RESEARCH"   → OBJECT / DISTANCE / STATUS readout
 *   data-lidar-project="Title"     → PROJECT DETECTED readout (name only)
 *
 * Attributes are placed on actual content blocks (headings, text,
 * cards) rather than whole <section> elements, so hovering empty
 * section padding/margins falls through to the idle "SCANNING..."
 * state instead of falsely detecting something.
 *
 * Perf notes:
 * - Fully disabled on coarse-pointer / touch devices — no listeners
 *   are attached and the native cursor is left untouched.
 * - Position and label text are written straight to the DOM via refs
 *   on every pointermove. There is no React state and no re-render
 *   on mouse movement, so this can't cost frames.
 * - The sweep, ring rotation, and pulse are CSS keyframe animations,
 *   which run on the compositor thread rather than in JS.
 */

const OBJECT_SELECTOR = "[data-lidar-object]";
const PROJECT_SELECTOR = "[data-lidar-project]";
const TEXT_INPUT_SELECTOR = "input, textarea, select, [contenteditable='true']";

function isCoarsePointer() {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(hover: none)").matches;
}

type Mode = "idle" | "object" | "project";

export function LidarCursor() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);
  const line3Ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (isCoarsePointer()) return; // touch/mobile: native cursor stays untouched

    const root = document.documentElement;
    root.classList.add("lidar-cursor-active");

    const wrapper = wrapperRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const line3 = line3Ref.current;
    if (!wrapper || !line1 || !line2 || !line3) return;

    let visible = false;
    let mode: Mode = "idle";
    let key = "";

    const setReadout = (nextMode: Mode, nextKey: string, l1: string, l2: string, l3: string) => {
      if (nextMode === mode && nextKey === key) return;
      mode = nextMode;
      key = nextKey;
      wrapper.dataset.mode = nextMode;
      line1.textContent = l1;
      line2.textContent = l2;
      line3.textContent = l3;
    };

    const onPointerMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const overTextField = !!target?.closest(TEXT_INPUT_SELECTOR);

      if (overTextField) {
        if (visible) {
          visible = false;
          wrapper.style.opacity = "0";
        }
        return;
      }
      if (!visible) {
        visible = true;
        wrapper.style.opacity = "1";
      }
      wrapper.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      const projectEl = target?.closest(PROJECT_SELECTOR) as HTMLElement | null;
      const objectEl = target?.closest(OBJECT_SELECTOR) as HTMLElement | null;

      if (projectEl) {
        const title = (projectEl.dataset.lidarProject || "PROJECT").toUpperCase();
        setReadout("project", title, "PROJECT DETECTED", title, "");
      } else if (objectEl) {
        const rect = objectEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const raw = Math.hypot(e.clientX - cx, e.clientY - cy) / 260;
        const jitter = Math.sin(performance.now() / 280) * 0.01;
        const dist = Math.max(0.05, raw + jitter).toFixed(2);
        const label = objectEl.dataset.lidarObject || "UNKNOWN";
        setReadout("object", label, `OBJECT: ${label}`, `DISTANCE: ${dist} m`, "STATUS: DETECTED");
      } else {
        setReadout("idle", "", "SCANNING...", "", "");
      }
    };

    const onPointerLeave = () => {
      visible = false;
      wrapper.style.opacity = "0";
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      root.classList.remove("lidar-cursor-active");
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="lidar-cursor" data-mode="idle" aria-hidden="true">
      <div className="lidar-sweep" />
      <svg className="lidar-rings" viewBox="0 0 46 46" width="46" height="46">
        <circle className="lidar-ring-outer" cx="23" cy="23" r="19" />
        <circle className="lidar-ring-inner" cx="23" cy="23" r="9" />
        <line x1="23" y1="1" x2="23" y2="7" className="lidar-tick" />
        <line x1="23" y1="39" x2="23" y2="45" className="lidar-tick" />
        <line x1="1" y1="23" x2="7" y2="23" className="lidar-tick" />
        <line x1="39" y1="23" x2="45" y2="23" className="lidar-tick" />
        <circle className="lidar-dot" cx="23" cy="23" r="1.5" />
      </svg>
      <div className="lidar-label">
        <span ref={line1Ref} className="lidar-line lidar-line-primary">SCANNING...</span>
        <span ref={line2Ref} className="lidar-line" />
        <span ref={line3Ref} className="lidar-line" />
      </div>
    </div>
  );
}
