import { useEffect, useRef } from "react";

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

function readLineRgb(): string {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--blueprint-line-rgb")
    .trim();
  return raw || "167, 176, 188";
}

export function BlueprintBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const lineRgbRef = useRef("167, 176, 188");

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
    lineRgbRef.current = readLineRgb();

    const mouse = { x: -9999, y: -9999 };
    const eased = { x: -9999, y: -9999 };
    let rafId = 0;

    function syncThemeColors() {
      lineRgbRef.current = readLineRgb();
      paintSvg();
      if (reduceMotion) draw();
    }

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
      paintSvg();
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

    function paintSvg() {
      const svg = svgRef.current;
      if (!svg) return;
      const rgb = lineRgbRef.current;
      svg.querySelectorAll<SVGElement>("[data-bp-stroke]").forEach((el) => {
        const a = el.dataset.bpStroke || "0.13";
        el.setAttribute("stroke", `rgba(${rgb},${a})`);
      });
      svg.querySelectorAll<SVGElement>("[data-bp-fill]").forEach((el) => {
        const a = el.dataset.bpFill || "0.22";
        el.setAttribute("fill", `rgba(${rgb},${a})`);
      });
    }

    function falloff(d: number) {
      if (d >= DEFORM_RADIUS) return 0;
      const t = 1 - d / DEFORM_RADIUS;
      return t * t * (3 - 2 * t);
    }

    function drawLineSet(positions: number[], isVertical: boolean) {
      const rgb = lineRgbRef.current;
      for (let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        const isMajor = i % MAJOR_EVERY === 0;
        ctx!.beginPath();
        ctx!.strokeStyle = `rgba(${rgb},${isMajor ? 0.09 : 0.045})`;
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

    const mo = new MutationObserver(syncThemeColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });

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
        mo.disconnect();
        cancelAnimationFrame(rafId);
      };
    }

    return () => {
      window.removeEventListener("resize", sizeCanvas);
      mo.disconnect();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-[0.85] dark:opacity-100" />
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full opacity-90"
        style={{ overflow: "visible" }}
      >
        <g data-tier="tablet-up" data-bp-fill="0.22" fill="rgba(167,176,188,0.22)" fontSize="10" fontFamily="monospace">
          <text id="l1">-300</text>
          <text id="l2">-200</text>
          <text id="l3">-100</text>
          <text id="l4">100</text>
          <text id="l5">200</text>
          <text id="l6">300</text>
        </g>
        <g id="bp-origin" data-tier="desktop" data-bp-stroke="0.30" stroke="rgba(167,176,188,0.30)" strokeWidth={1} fill="none">
          <line x1="0" y1="0" x2="34" y2="0" markerEnd="url(#bp-live-arrow)" />
          <line x1="0" y1="0" x2="0" y2="-34" markerEnd="url(#bp-live-arrow)" />
          <line x1="0" y1="0" x2="-20" y2="18" markerEnd="url(#bp-live-arrow)" />
          <circle cx="0" cy="0" r="2.5" data-bp-fill="0.30" fill="rgba(167,176,188,0.30)" stroke="none" />
          <text x="40" y="4" fontSize="10" fontFamily="monospace" data-bp-fill="0.28" fill="rgba(167,176,188,0.28)" stroke="none">X</text>
          <text x="-6" y="-40" fontSize="10" fontFamily="monospace" data-bp-fill="0.28" fill="rgba(167,176,188,0.28)" stroke="none">Y</text>
          <text x="-32" y="26" fontSize="10" fontFamily="monospace" data-bp-fill="0.28" fill="rgba(167,176,188,0.28)" stroke="none">Z</text>
        </g>
        <defs>
          <marker id="bp-live-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" data-bp-fill="0.30" fill="rgba(167,176,188,0.30)" />
          </marker>
        </defs>
        <g data-tier="desktop">
          <circle id="bp-circle-outer" r="72" fill="none" data-bp-stroke="0.13" stroke="rgba(167,176,188,0.13)" strokeWidth={1} strokeDasharray="3 4" />
          <circle id="bp-circle-inner" r="30" fill="none" data-bp-stroke="0.13" stroke="rgba(167,176,188,0.13)" strokeWidth={1} />
          <circle id="bp-circle-small" r="48" fill="none" data-bp-stroke="0.11" stroke="rgba(167,176,188,0.11)" strokeWidth={1} />
          <g data-bp-stroke="0.20" stroke="rgba(167,176,188,0.20)" strokeWidth={1}>
            <line id="bp-tick1" />
            <line id="bp-tick2" />
            <circle id="bp-tick-circle" r="6" fill="none" />
          </g>
        </g>
      </svg>
    </div>
  );
}
