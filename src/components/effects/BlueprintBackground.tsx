import { useEffect, useRef } from "react";

// Line color follows the site's --foreground (deep navy). Update this if the
// theme's foreground color changes.
const LINE_RGB = "35,40,66";

const MINOR_SPACING = 20;
const MAJOR_EVERY = 5;
const SEGMENT = 10;
const DEFORM_RADIUS = 85;
const DEFORM_AMP = 12;
const EASE = 0.12;

type Tier = "desktop" | "tablet" | "mobile";

function getTier(width: number): Tier {
  if (width >= 1024) return "desktop";
  if (width >= 768) return "tablet";
  return "mobile";
}

export function BlueprintBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = window.innerWidth;
    let H = window.innerHeight;
    let tier = getTier(W);

    const mouse = { x: -9999, y: -9999 };
    const eased = { x: -9999, y: -9999 };
    let rafId = 0;

    function sizeCanvas() {
      W = window.innerWidth;
      H = window.innerHeight;
      tier = getTier(W);
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      updateSvgVisibility();
    }

    function updateSvgVisibility() {
      const svg = svgRef.current;
      if (!svg) return;
      svg.querySelectorAll<SVGElement>("[data-tier]").forEach((el) => {
        const need = el.dataset.tier;
        const show =
          need === "desktop" ? tier === "desktop" : need === "tablet-up" ? tier !== "mobile" : true;
        el.style.display = show ? "" : "none";
      });

      // Positions are computed in JS (not CSS %/calc) because SVG presentation
      // attributes don't support calc(), and percentage/CSS-transform behavior
      // on bare SVG elements is inconsistent across browsers.
      const set = (id: string, attrs: Record<string, number | string>) => {
        const el = svg.querySelector(`#${id}`);
        if (!el) return;
        for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
      };
      const originX = 56, originY = H - 70;
      const c1x = W * 0.76, c1y = H * 0.3;
      const c3x = W * 0.2, c3y = H * 0.75;

      set("bp-origin", { transform: `translate(${originX},${originY})` });
      set("bp-circle-outer", { cx: c1x, cy: c1y });
      set("bp-circle-inner", { cx: c1x, cy: c1y });
      set("bp-circle-small", { cx: c3x, cy: c3y });
      set("bp-tick1", { x1: c1x - 10, y1: c1y, x2: c1x + 10, y2: c1y });
      set("bp-tick2", { x1: c1x, y1: c1y - 10, x2: c1x, y2: c1y + 10 });
      set("bp-tick-circle", { cx: c1x, cy: c1y });
      const labelXs = [W * 0.04, W * 0.16, W * 0.28, W * 0.62, W * 0.74, W * 0.86];
      ["l1", "l2", "l3", "l4", "l5", "l6"].forEach((id, i) => set(id, { x: labelXs[i], y: H * 0.49 }));
    }

    function falloff(d: number) {
      if (d >= DEFORM_RADIUS) return 0;
      const t = 1 - d / DEFORM_RADIUS;
      return t * t * (3 - 2 * t);
    }

    function drawLineSet(positions: number[], isVertical: boolean) {
      for (let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        const isMajor = i % MAJOR_EVERY === 0;
        ctx!.beginPath();
        ctx!.strokeStyle = `rgba(${LINE_RGB},${isMajor ? 0.09 : 0.05})`;
        ctx!.lineWidth = 1;
        const len = isVertical ? H : W;
        for (let p = 0; p <= len; p += SEGMENT) {
          let x: number, y: number;
          if (isVertical) { x = pos; y = p; } else { x = p; y = pos; }
          if (!reduceMotion) {
            const dx = x - eased.x, dy = y - eased.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const f = falloff(dist);
            if (f > 0) {
              const push = f * DEFORM_AMP;
              if (isVertical) x += (dx === 0 ? 1 : dx / (Math.abs(dx) + 40)) * push;
              else y += (dy === 0 ? 1 : dy / (Math.abs(dy) + 40)) * push;
            }
          }
          if (p === 0) ctx!.moveTo(x, y); else ctx!.lineTo(x, y);
        }
        ctx!.stroke();
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      const vPositions: number[] = [];
      for (let x = 0; x <= W; x += MINOR_SPACING) vPositions.push(x);
      const hPositions: number[] = [];
      for (let y = 0; y <= H; y += MINOR_SPACING) hPositions.push(y);
      drawLineSet(vPositions, true);
      drawLineSet(hPositions, false);
    }

    function loop() {
      eased.x += (mouse.x - eased.x) * EASE;
      eased.y += (mouse.y - eased.y) * EASE;
      draw();
      rafId = requestAnimationFrame(loop);
    }

    sizeCanvas();
    draw();
    window.addEventListener("resize", sizeCanvas);

    if (!reduceMotion) {
      const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
      const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseleave", onLeave);
      rafId = requestAnimationFrame(loop);
      return () => {
        window.removeEventListener("resize", sizeCanvas);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseleave", onLeave);
        cancelAnimationFrame(rafId);
      };
    }

    return () => window.removeEventListener("resize", sizeCanvas);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full"
        style={{ overflow: "visible" }}
      >
        <g data-tier="tablet-up" fill={`rgba(${LINE_RGB},0.22)`} fontSize="10" fontFamily="monospace">
          <text id="l1">-300</text>
          <text id="l2">-200</text>
          <text id="l3">-100</text>
          <text id="l4">100</text>
          <text id="l5">200</text>
          <text id="l6">300</text>
        </g>
        <g id="bp-origin" data-tier="desktop" stroke={`rgba(${LINE_RGB},0.30)`} strokeWidth={1} fill="none">
          <line x1="0" y1="0" x2="34" y2="0" markerEnd="url(#bp-live-arrow)" />
          <line x1="0" y1="0" x2="0" y2="-34" markerEnd="url(#bp-live-arrow)" />
          <line x1="0" y1="0" x2="-20" y2="18" markerEnd="url(#bp-live-arrow)" />
          <circle cx="0" cy="0" r="2.5" fill={`rgba(${LINE_RGB},0.30)`} stroke="none" />
          <text x="40" y="4" fontSize="10" fontFamily="monospace" fill={`rgba(${LINE_RGB},0.28)`} stroke="none">X</text>
          <text x="-6" y="-40" fontSize="10" fontFamily="monospace" fill={`rgba(${LINE_RGB},0.28)`} stroke="none">Y</text>
          <text x="-32" y="26" fontSize="10" fontFamily="monospace" fill={`rgba(${LINE_RGB},0.28)`} stroke="none">Z</text>
        </g>
        <defs>
          <marker id="bp-live-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={`rgba(${LINE_RGB},0.30)`} />
          </marker>
        </defs>
        <g data-tier="desktop">
          <circle id="bp-circle-outer" r="72" fill="none" stroke={`rgba(${LINE_RGB},0.13)`} strokeWidth={1} strokeDasharray="3 4" />
          <circle id="bp-circle-inner" r="30" fill="none" stroke={`rgba(${LINE_RGB},0.13)`} strokeWidth={1} />
          <circle id="bp-circle-small" r="48" fill="none" stroke={`rgba(${LINE_RGB},0.11)`} strokeWidth={1} />
          <g stroke={`rgba(${LINE_RGB},0.20)`} strokeWidth={1}>
            <line id="bp-tick1" />
            <line id="bp-tick2" />
            <circle id="bp-tick-circle" r="6" fill="none" />
          </g>
        </g>
      </svg>
    </div>
  );
}
