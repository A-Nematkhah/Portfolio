import {
  useMemo,
  useState,
  useRef,
  useEffect,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { m } from "framer-motion";
import {
  Box, Ruler, Activity, Radio, Globe, Bot, Code2, Brain, Sparkles,
  X, ArrowUpRight, CircleDot,
  Hammer, Cog, Nut, PencilRuler, Plug, CircuitBoard, ClipboardList,
  Boxes, Cpu, BrainCircuit,
} from "lucide-react";

/**
 * Engineering Tool Wall — framed pegboard panel with original skill
 * card sizing, draggable decorative tools, and full-width board layout.
 */

export type ToolDomainId = "mechanical" | "robotics" | "ai";

export type ToolItem = {
  id: string;
  name: string;
  domain: ToolDomainId;
  categoryTag: string;
  usedFor: string[];
  matchKeywords: string[];
  filterCategory?: string;
  status: "ACTIVE" | "RESEARCH" | "EXPERIMENTAL";
  icon: typeof Box;
  tilt: number;
};

export type ProjectRef = { title: string; tool: string; cat: string };

const DOMAINS: { id: ToolDomainId; label: string; icon: typeof Box }[] = [
  { id: "mechanical", label: "Mechanical Engineering", icon: Boxes },
  { id: "robotics", label: "Robotics & Automation", icon: Cpu },
  { id: "ai", label: "AI & Intelligent Systems", icon: BrainCircuit },
];

type GutterTool = {
  id: string;
  src: string;
  alt: string;
  col: 2 | 4;
  row: string;
  width: number;
  rotate: number;
  rot90?: boolean;
  nudgeY?: number;
};

type AccentTool = { id: string; src: string; alt: string; width: number; rotate: number };

function toolAsset(file: string) {
  return `${import.meta.env.BASE_URL}tools/${file}`;
}

const GUTTERS: Record<ToolDomainId, GutterTool[]> = {
  mechanical: [
    { id: "micrometer", src: toolAsset("micrometer.webp"), alt: "Micrometer", col: 2, row: "1 / 3", width: 143, rotate: -12, nudgeY: -36 },
    { id: "wrench", src: toolAsset("wrench.webp"), alt: "Wrench", col: 4, row: "1 / 3", width: 78, rotate: 3 },
    { id: "caliper", src: toolAsset("caliper.webp"), alt: "Digital caliper", col: 2, row: "3", width: 240, rotate: 0, rot90: true },
    { id: "bearing", src: toolAsset("bearing.webp"), alt: "Ball bearing", col: 4, row: "3", width: 69, rotate: 10 },
  ],
  robotics: [
    { id: "pcb", src: toolAsset("pcb-green.webp"), alt: "Microcontroller board", col: 2, row: "1 / 3", width: 87, rotate: -6 },
    { id: "sbc", src: toolAsset("board.webp"), alt: "Single-board computer", col: 4, row: "1 / 3", width: 84, rotate: 7 },
  ],
  ai: [
    { id: "ultrasonic", src: toolAsset("ultrasonic-sensor.webp"), alt: "Ultrasonic sensor", col: 2, row: "1", width: 162, rotate: -8 },
    { id: "chip", src: toolAsset("ic-chip.webp"), alt: "AI accelerator chip", col: 4, row: "1", width: 132, rotate: 9 },
  ],
};

const BELOW_ACCENT: Partial<Record<ToolDomainId, AccentTool>> = {
  mechanical: { id: "gear", src: toolAsset("gear.webp"), alt: "Gear", width: 69, rotate: 8 },
};

const MARGIN_ACCENT: Partial<Record<ToolDomainId, AccentTool>> = {
  robotics: { id: "relay", src: toolAsset("relay.webp"), alt: "Relay module", width: 90, rotate: -10 },
};

const PEG_OFFSET_KEY = "toolwall-peg-offsets-v1";
type PegOffset = { x: number; y: number };

function loadPegOffsets(): Record<string, PegOffset> {
  try {
    const raw = localStorage.getItem(PEG_OFFSET_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, PegOffset>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function savePegOffsets(pos: Record<string, PegOffset>) {
  try {
    localStorage.setItem(PEG_OFFSET_KEY, JSON.stringify(pos));
  } catch {
    /* ignore */
  }
}

const EDGE_PINS: { top: string; left?: string; right?: string; color: "brass" | "silver" | "red" | "green" }[] = [
  { top: "22%", right: "20px", color: "brass" },
  { top: "48%", right: "18px", color: "silver" },
  { top: "72%", left: "20px", color: "red" },
  { top: "86%", right: "22px", color: "green" },
];

const EDGE_PIN_STYLE: Record<"brass" | "silver" | "red" | "green", string> = {
  brass: "bg-[radial-gradient(circle_at_35%_30%,#ffe6a3,#c99f3d)]",
  silver: "bg-[radial-gradient(circle_at_35%_30%,#f2f4f6,#8b9096)]",
  red: "bg-[radial-gradient(circle_at_35%_30%,#ff8a7a,#c23b28)]",
  green: "bg-[radial-gradient(circle_at_35%_30%,#a8e6b0,#3f9950)]",
};

function HexScrew({ id, className }: { id: string; className?: string }) {
  const gradId = `screwMetal-${id}`;
  return (
    <span aria-hidden className={`pegboard-screw ${className ?? ""}`}>
      <svg viewBox="0 0 32 32" width="100%" height="100%">
        <defs>
          <radialGradient id={gradId} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f4f6f8" />
            <stop offset="55%" stopColor="#b8c0c4" />
            <stop offset="100%" stopColor="#6e757c" />
          </radialGradient>
        </defs>
        <circle cx="16" cy="16" r="15" fill={`url(#${gradId})`} />
        <circle cx="16" cy="16" r="14.2" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="0.8" />
        <circle cx="16" cy="16" r="9.2" fill="rgba(45,50,55,0.95)" />
        <path
          d="M16 8.8 L19.55 14.9 L16 13.6 L12.45 14.9 Z M16 23.2 L12.45 17.1 L16 18.4 L19.55 17.1 Z M8.8 16 L14.9 12.45 L13.6 16 L14.9 19.55 Z M23.2 16 L17.1 19.55 L18.4 16 L17.1 12.45 Z"
          fill="#cfd5da"
        />
      </svg>
    </span>
  );
}

function cardPlacement(index: number) {
  const col = (index % 3) * 2 + 1;
  const row = Math.floor(index / 3) + 1;
  return { gridColumn: col, gridRow: row };
}

const TOOLS: ToolItem[] = [
  {
    id: "solidworks", name: "SolidWorks", domain: "mechanical", categoryTag: "CAD / CAE",
    usedFor: ["Mechanical Design", "Assembly Modeling", "Motion Study"],
    matchKeywords: ["solidworks"], filterCategory: "3D Models", status: "ACTIVE", icon: Box, tilt: -2,
  },
  {
    id: "catia", name: "CATIA", domain: "mechanical", categoryTag: "CAD / SURFACING",
    usedFor: ["Surface Modeling", "Assembly Design", "Product Structure"],
    matchKeywords: ["catia"], status: "ACTIVE", icon: PencilRuler, tilt: 1,
  },
  {
    id: "ansys-fluent", name: "ANSYS Fluent", domain: "mechanical", categoryTag: "CFD SIMULATION",
    usedFor: ["Fluid Flow Simulation", "Thermal Analysis", "CFD Modeling"],
    matchKeywords: ["ansys", "fluent"], status: "ACTIVE", icon: Cog, tilt: -1.5,
  },
  {
    id: "cad", name: "AutoCAD", domain: "mechanical", categoryTag: "DRAFTING / GD&T",
    usedFor: ["2D Technical Drawings", "GD&T", "Manufacturing Documentation"],
    matchKeywords: ["autocad"], filterCategory: "2D Drawings", status: "ACTIVE", icon: Ruler, tilt: 1.5,
  },
  {
    id: "matlab", name: "MATLAB", domain: "mechanical", categoryTag: "SIMULATION / CONTROL",
    usedFor: ["Dynamic Modeling", "Controller Design", "Simulink Simulation"],
    matchKeywords: ["matlab"], filterCategory: "MATLAB", status: "ACTIVE", icon: Activity, tilt: -1,
  },
  {
    id: "hydraulics-pneumatics", name: "Hydraulics & Pneumatics", domain: "mechanical", categoryTag: "FLUID POWER",
    usedFor: ["Circuit Design", "Actuator Sizing", "System Troubleshooting"],
    matchKeywords: ["hydraulic", "pneumatic"], status: "ACTIVE", icon: Nut, tilt: 1.5,
  },
  {
    id: "mechanical-design", name: "Mechanical Design", domain: "mechanical", categoryTag: "DESIGN FUNDAMENTALS",
    usedFor: ["Machine Elements", "Tolerancing", "DFM / DFA"],
    matchKeywords: ["mechanical design"], status: "ACTIVE", icon: Hammer, tilt: -2,
  },
  {
    id: "ms-project", name: "Microsoft Project", domain: "mechanical", categoryTag: "SCHEDULING / GANTT",
    usedFor: ["Project Scheduling", "Resource Allocation", "Gantt Tracking"],
    matchKeywords: ["microsoft project", "ms project"], status: "ACTIVE", icon: ClipboardList, tilt: 1,
  },
  {
    id: "project-planning", name: "Project Planning", domain: "mechanical", categoryTag: "MANAGEMENT",
    usedFor: ["Milestone Planning", "Risk Tracking", "Team Coordination"],
    matchKeywords: ["project planning"], status: "ACTIVE", icon: ClipboardList, tilt: -1,
  },
  {
    id: "simulation-analysis", name: "Simulation & Analysis", domain: "mechanical", categoryTag: "CAE WORKFLOWS",
    usedFor: ["FEA", "System-Level Simulation", "Results Validation"],
    matchKeywords: ["simulation", "analysis"], status: "ACTIVE", icon: Cog, tilt: 2,
  },
  {
    id: "ros2", name: "ROS 2", domain: "robotics", categoryTag: "ROBOTICS MIDDLEWARE",
    usedFor: ["Node Communication", "Sensor Integration", "Robot Control"],
    matchKeywords: ["ros 2", "ros2", "ros"], status: "RESEARCH", icon: Radio, tilt: -2,
  },
  {
    id: "gazebo", name: "Gazebo", domain: "robotics", categoryTag: "PHYSICS SIMULATION",
    usedFor: ["Robot Simulation", "Sensor Modeling", "Environment Testing"],
    matchKeywords: ["gazebo"], status: "RESEARCH", icon: Globe, tilt: 1.5,
  },
  {
    id: "isaac-lab", name: "Isaac Lab", domain: "robotics", categoryTag: "SIM-TO-REAL / RL",
    usedFor: ["Parallel RL Training", "Robot Learning", "Sim-to-Real Transfer"],
    matchKeywords: ["isaac lab", "isaac"], status: "EXPERIMENTAL", icon: Bot, tilt: -1,
  },
  {
    id: "siemens-logo", name: "Siemens Logo PLC", domain: "robotics", categoryTag: "INDUSTRIAL CONTROL",
    usedFor: ["Ladder Logic", "I/O Wiring", "Automation Panels"],
    matchKeywords: ["siemens", "logo plc", "plc"], status: "ACTIVE", icon: Plug, tilt: 2,
  },
  {
    id: "arduino", name: "Arduino", domain: "robotics", categoryTag: "EMBEDDED / PROTOTYPING",
    usedFor: ["Sensor Prototyping", "Microcontroller Firmware", "Rapid Testing"],
    matchKeywords: ["arduino"], status: "ACTIVE", icon: CircuitBoard, tilt: -1.5,
  },
  {
    id: "intelligent-automation", name: "Intelligent Automation", domain: "robotics", categoryTag: "SMART SYSTEMS",
    usedFor: ["Process Automation", "Sensor Fusion", "Autonomous Control"],
    matchKeywords: ["intelligent automation", "automation"], status: "RESEARCH", icon: Cog, tilt: 1,
  },
  {
    id: "python", name: "Python", domain: "ai", categoryTag: "PROGRAMMING",
    usedFor: ["Robotics Scripting", "Data & Visualization", "Automation"],
    matchKeywords: ["python"], filterCategory: "Python", status: "ACTIVE", icon: Code2, tilt: -2,
  },
  {
    id: "rl", name: "Reinforcement Learning", domain: "ai", categoryTag: "MACHINE LEARNING",
    usedFor: ["Reward Shaping", "Policy Optimization", "Agent Training"],
    matchKeywords: ["reinforcement learning", "reinforcement"], status: "RESEARCH", icon: Brain, tilt: 1.5,
  },
  {
    id: "llm", name: "LLM", domain: "ai", categoryTag: "LANGUAGE MODELS",
    usedFor: ["Reward Design", "Reasoning Agents", "Tool-Use Automation"],
    matchKeywords: ["llm", "language model"], status: "EXPERIMENTAL", icon: Sparkles, tilt: -1,
  },
];

const STATUS_STYLE: Record<ToolItem["status"], string> = {
  ACTIVE: "bg-emerald-400",
  RESEARCH: "bg-amber-400",
  EXPERIMENTAL: "bg-sky-400",
};

function getConnectedProjects(tool: ToolItem, projects: ProjectRef[]): ProjectRef[] {
  const seen = new Set<string>();
  return projects.filter((p) => {
    const hay = `${p.tool} ${p.title}`.toLowerCase();
    const hit = tool.matchKeywords.some((k) => hay.includes(k));
    if (!hit || seen.has(p.title)) return false;
    seen.add(p.title);
    return true;
  });
}

export function ToolWall({
  projects,
  onExploreProjects,
}: {
  projects: ProjectRef[];
  onExploreProjects: (category: string) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [offsets, setOffsets] = useState<Record<string, PegOffset>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useRef(false);
  const dragRef = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const offsetsRef = useRef(offsets);
  offsetsRef.current = offsets;

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setOffsets(loadPegOffsets());
  }, []);

  const activeId = hoveredId ?? selectedId;
  const selectedTool = useMemo(() => TOOLS.find((t) => t.id === selectedId) ?? null, [selectedId]);
  const connectedProjects = useMemo(
    () => (selectedTool ? getConnectedProjects(selectedTool, projects) : []),
    [selectedTool, projects],
  );

  const toggleSelect = (id: string) => setSelectedId((cur) => (cur === id ? null : id));
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (e.key === "Escape") setSelectedId(null);
    if (e.key === "Enter" || e.key === " ") toggleSelect(id);
  };

  const handleBoardPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (draggingId || reduceMotion.current || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    boardRef.current.style.transform = `perspective(1200px) rotateY(${x * 2.2}deg) rotateX(${-y * 1.6}deg)`;
  };

  const resetBoardTilt = () => {
    if (!boardRef.current || draggingId) return;
    boardRef.current.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg)";
  };

  const onPegPointerDown = (e: ReactPointerEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const cur = offsetsRef.current[id] ?? { x: 0, y: 0 };
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: cur.x,
      origY: cur.y,
    };
    setDraggingId(id);
    e.currentTarget.setPointerCapture(e.pointerId);
    if (boardRef.current) {
      boardRef.current.style.transform = "perspective(1200px) rotateY(0deg) rotateX(0deg)";
    }
  };

  const onPegPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== draggingId) return;
    e.preventDefault();
    e.stopPropagation();
    setOffsets((prev) => ({
      ...prev,
      [drag.id]: {
        x: drag.origX + (e.clientX - drag.startX),
        y: drag.origY + (e.clientY - drag.startY),
      },
    }));
  };

  const onPegPointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current) return;
    e.stopPropagation();
    dragRef.current = null;
    setDraggingId(null);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    savePegOffsets(offsetsRef.current);
  };

  const resetPegLayout = () => {
    setOffsets({});
    savePegOffsets({});
  };

  const pegTransform = (
    id: string,
    rotate: number,
    rot90?: boolean,
    centered?: boolean,
    nudgeY = 0,
  ) => {
    const o = offsets[id] ?? { x: 0, y: 0 };
    const rot = rot90 ? -90 : rotate;
    const y = o.y + nudgeY;
    if (centered) {
      return `translate(calc(-50% + ${o.x}px), calc(-50% + ${y}px)) rotate(${rot}deg)`;
    }
    return `translate(${o.x}px, ${y}px) rotate(${rot}deg)`;
  };

  return (
    <section id="skills" className="toolwall-section py-14 md:py-20">
      <div data-lidar-object="TOOL WALL" className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em]">
          <span className="text-primary">Engineering Tool Wall</span>
          <span className="text-muted-foreground"> / Skills</span>
        </p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground md:text-[2.75rem]">
          My Engineering Toolkit.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          The tools I use to design mechanical systems, build robots, simulate complex environments,
          and develop intelligent autonomous systems.
        </p>
      </div>

      <div
        ref={boardRef}
        className="pegboard-board relative mx-auto mt-10 w-full"
        onPointerMove={handleBoardPointerMove}
        onPointerLeave={resetBoardTilt}
      >
        <div className="pegboard-face" aria-hidden />
        <HexScrew id="tl" className="pegboard-screw-tl" />
        <HexScrew id="tr" className="pegboard-screw-tr" />
        <HexScrew id="bl" className="pegboard-screw-bl" />
        <HexScrew id="br" className="pegboard-screw-br" />

        {EDGE_PINS.map((p, i) => (
          <span
            key={i}
            aria-hidden
            className={`pointer-events-none absolute z-[6] h-[11px] w-[11px] rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.55)] ${EDGE_PIN_STYLE[p.color]}`}
            style={{ top: p.top, left: p.left, right: p.right }}
          />
        ))}

        <div className="pegboard-content relative px-6 py-10 sm:px-8 sm:py-12 md:px-12 md:py-14">
          <div className="relative z-[4] mb-2 hidden justify-end sm:flex">
            <button
              type="button"
              onClick={resetPegLayout}
              className="rounded-md border border-black/10 bg-white/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#5c564e] backdrop-blur-sm transition hover:bg-white/90"
            >
              Reset tools
            </button>
          </div>

          <div className="relative z-[2] space-y-8 md:space-y-10">
          {DOMAINS.map((domain) => {
            const DomainIcon = domain.icon;
            const domainTools = TOOLS.filter((t) => t.domain === domain.id);
            const below = BELOW_ACCENT[domain.id];
            const margin = MARGIN_ACCENT[domain.id];
            return (
              <div key={domain.id} id={`skills-${domain.id}`} className="relative">
                <div className="flex items-center gap-2.5 pb-2">
                  <DomainIcon className="h-4 w-4 text-foreground" strokeWidth={1.9} />
                  <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-foreground">
                    {domain.label}
                  </h3>
                  <span className="ml-1.5 h-px flex-1 bg-foreground/20" aria-hidden />
                </div>

                <div className="relative">
                <div className="relative mt-4 grid grid-cols-2 items-start gap-3 sm:grid-cols-[16.5rem_minmax(2.75rem,1fr)_16.5rem_minmax(2.75rem,1fr)_16.5rem] sm:justify-between sm:gap-x-8 sm:gap-y-5">
                  {domainTools.map((tool, i) => {
                    const isActive = activeId === tool.id;
                    const isSelected = selectedId === tool.id;
                    const Icon = tool.icon;
                    const { gridColumn, gridRow } = cardPlacement(i);
                    return (
                      <div
                        key={tool.id}
                        className="skill-card-slot relative z-[2] self-start"
                        style={{ "--gc": gridColumn, "--gr": gridRow } as CSSProperties}
                      >
                        <button
                          type="button"
                          data-lidar-object={tool.name}
                          aria-pressed={isSelected}
                          aria-label={`${tool.name} — ${tool.categoryTag}. ${isSelected ? "Selected. " : ""}Press to inspect.`}
                          onClick={() => toggleSelect(tool.id)}
                          onMouseEnter={() => setHoveredId(tool.id)}
                          onMouseLeave={() => setHoveredId(null)}
                          onFocus={() => setHoveredId(tool.id)}
                          onBlur={() => setHoveredId(null)}
                          onKeyDown={(e) => handleKeyDown(e, tool.id)}
                          className={`skill-card group relative flex w-full flex-col rounded-[14px] px-3 py-2.5 text-left outline-none ${isSelected ? "tool-plate-selected" : ""}`}
                          style={{
                            transform: isActive
                              ? "translateY(-4px) rotate(0deg)"
                              : `rotate(${tool.tilt}deg)`,
                          }}
                        >
                          <span
                            className={`absolute right-[11px] top-[10px] h-[7px] w-[7px] rounded-full ${STATUS_STYLE[tool.status]}`}
                            aria-hidden
                          />
                          <span className="flex items-start gap-2">
                            <Icon className="mt-0.5 h-[19px] w-[19px] shrink-0 text-foreground" strokeWidth={1.7} />
                            <span className="font-display text-[13.5px] font-bold leading-tight text-foreground">
                              {tool.name}
                            </span>
                          </span>
                          <span className="ml-[27px] mt-1 text-[11px] leading-snug text-muted-foreground">
                            {tool.categoryTag}
                          </span>
                        </button>

                        {isActive && (
                          <div className="tool-tooltip pointer-events-none absolute bottom-full left-1/2 z-20 mb-4 hidden w-52 -translate-x-1/2 md:block">
                            <p className="font-mono text-[9px] tracking-[0.2em] text-primary/90">TOOL DETECTED</p>
                            <p className="mt-1 font-display text-sm font-semibold text-foreground">{tool.name}</p>
                            <p className="mt-2 font-mono text-[9px] tracking-[0.15em] text-muted-foreground">CATEGORY</p>
                            <p className="text-xs text-foreground/80">{tool.categoryTag}</p>
                            <p className="mt-2 font-mono text-[9px] tracking-[0.15em] text-muted-foreground">USED FOR</p>
                            <ul className="text-xs text-foreground/80">
                              {tool.usedFor.map((u) => (
                                <li key={u}>{u}</li>
                              ))}
                            </ul>
                            <div className="tool-tooltip-notch" aria-hidden />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {GUTTERS[domain.id].map((g) => (
                    <div
                      key={g.id}
                      className="peg-gutter-slot relative z-[3] hidden min-w-0 self-stretch overflow-visible sm:block"
                      style={{ gridColumn: g.col, gridRow: g.row }}
                    >
                      <button
                        type="button"
                        aria-label={`Move ${g.alt}`}
                        className={`peg-draggable-inline absolute left-1/2 top-1/2 ${draggingId === g.id ? "is-dragging" : ""}`}
                        style={{ transform: pegTransform(g.id, g.rotate, g.rot90, true, g.nudgeY) }}
                        onPointerDown={(e) => onPegPointerDown(e, g.id)}
                        onPointerMove={onPegPointerMove}
                        onPointerUp={onPegPointerUp}
                        onPointerCancel={onPegPointerUp}
                      >
                        <img
                          src={g.src}
                          alt=""
                          draggable={false}
                          className="select-none drop-shadow-[0_8px_10px_rgba(20,20,40,0.4)]"
                          style={{ width: g.width }}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                {below && (
                  <div className="absolute bottom-0 left-1/2 z-[3] hidden -translate-x-1/2 overflow-visible sm:block">
                    <button
                      type="button"
                      aria-label={`Move ${below.alt}`}
                      className={`peg-draggable-inline ${draggingId === below.id ? "is-dragging" : ""}`}
                      onPointerDown={(e) => onPegPointerDown(e, below.id)}
                      onPointerMove={onPegPointerMove}
                      onPointerUp={onPegPointerUp}
                      onPointerCancel={onPegPointerUp}
                    >
                      <img
                        src={below.src}
                        alt=""
                        draggable={false}
                        className="select-none drop-shadow-[0_8px_10px_rgba(20,20,40,0.4)]"
                        style={{
                          width: below.width,
                          transform: pegTransform(below.id, below.rotate),
                        }}
                      />
                    </button>
                  </div>
                )}
                {margin && (
                  <div className="absolute right-[-30px] top-1 z-[3] hidden overflow-visible sm:block">
                    <button
                      type="button"
                      aria-label={`Move ${margin.alt}`}
                      className={`peg-draggable-inline ${draggingId === margin.id ? "is-dragging" : ""}`}
                      onPointerDown={(e) => onPegPointerDown(e, margin.id)}
                      onPointerMove={onPegPointerMove}
                      onPointerUp={onPegPointerUp}
                      onPointerCancel={onPegPointerUp}
                    >
                      <img
                        src={margin.src}
                        alt=""
                        draggable={false}
                        className="select-none drop-shadow-[0_6px_8px_rgba(20,20,40,0.4)]"
                        style={{
                          width: margin.width,
                          transform: pegTransform(margin.id, margin.rotate),
                        }}
                      />
                    </button>
                  </div>
                )}
                </div>

                {selectedTool?.domain === domain.id && (
                  <div className="relative z-[2] mt-6 rounded-xl border border-black/10 bg-[#fffdf8]/92 p-5 shadow-[0_12px_28px_-16px_rgba(20,20,40,0.35)]">
                    <m.div
                      key={selectedTool.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-[10px] tracking-[0.25em] text-primary/90">TOOL DETECTED</p>
                          <h4 className="mt-1 font-display text-lg font-semibold text-foreground">{selectedTool.name}</h4>
                          <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                            {selectedTool.categoryTag}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedId(null)}
                          aria-label="Close inspection panel"
                          className="rounded-md p-1.5 text-muted-foreground transition hover:bg-black/5 hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-4 grid gap-6 sm:grid-cols-2">
                        <div>
                          <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">USED FOR</p>
                          <ul className="mt-2 space-y-1 text-sm text-foreground/80">
                            {selectedTool.usedFor.map((u) => (
                              <li key={u} className="flex items-center gap-2">
                                <CircleDot className="h-3 w-3 text-primary/80" />
                                {u}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                            CONNECTED PROJECTS{" "}
                            <span className="text-foreground/70">
                              {String(connectedProjects.length).padStart(2, "0")}
                            </span>
                          </p>
                          {connectedProjects.length > 0 ? (
                            <ul className="mt-2 space-y-1 text-sm text-foreground/80">
                              {connectedProjects.map((p) => (
                                <li key={p.title}>{p.title}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-2 text-sm text-muted-foreground">
                              No linked projects yet — check back soon.
                            </p>
                          )}
                          {selectedTool.filterCategory && (
                            <button
                              type="button"
                              onClick={() => onExploreProjects(selectedTool.filterCategory!)}
                              className="mt-3 inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/25"
                            >
                              Explore related projects <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </m.div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

          <div className="pegboard-quote relative z-[2]">
            <p>Precision in tools, and in ideas, builds impact in engineering.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
