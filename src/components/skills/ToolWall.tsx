import { useMemo, useState, type CSSProperties, type KeyboardEvent } from "react";
import { m } from "framer-motion";
import {
  Box, Ruler, Activity, Radio, Globe, Bot, Code2, Brain, Sparkles,
  X, ArrowUpRight, CircleDot,
  Hammer, Cog, Nut, PencilRuler, Plug, CircuitBoard, ClipboardList,
  Boxes, Cpu, BrainCircuit,
} from "lucide-react";

/**
 * ================= ENGINEERING TOOL WALL =================
 *
 * A reusable, data-driven "pegboard" that stands in for the conventional
 * skills grid. Every tool is a plain <button>, so keyboard + screen reader
 * support come for free; hover/selection state is tracked in React (not
 * CSS :hover) so the exact same code path drives desktop hover, keyboard
 * focus, and mobile tap.
 *
 * Project connections are NOT hardcoded. `ToolWall` is handed the same
 * project list the Projects section renders, and each tool declares
 * `matchKeywords` used to find real, existing projects that used it. If a
 * tool has no matching project yet, the panel says so honestly instead of
 * inventing one. Extending the wall later is just: add an object to
 * `TOOLS` with the right `matchKeywords` / `filterCategory`.
 */

export type ToolDomainId = "mechanical" | "robotics" | "ai";

export type ToolItem = {
  id: string;
  name: string;
  domain: ToolDomainId;
  categoryTag: string;
  usedFor: string[];
  matchKeywords: string[];
  /** One of the Projects section's FILTERS values, if this tool maps cleanly to one. */
  filterCategory?: string;
  status: "ACTIVE" | "RESEARCH" | "EXPERIMENTAL";
  icon: typeof Box;
  tilt: number;
};

export type ProjectRef = { title: string; tool: string; cat: string };

const DOMAINS: { id: ToolDomainId; label: string; sublabel: string; icon: typeof Box }[] = [
  { id: "mechanical", label: "Mechanical Engineering", sublabel: "Design / Simulation / Analysis", icon: Boxes },
  { id: "robotics", label: "Robotics & Systems", sublabel: "Robotics / Simulation / Control", icon: Cpu },
  { id: "ai", label: "AI & Intelligent Systems", sublabel: "Programming / Learning / Autonomy", icon: BrainCircuit },
];

/** Real photographed tool sitting in a gutter column between two card
 * columns (col 2 or col 4 of the 5-column card|gutter|card|gutter|card
 * grid), optionally spanning multiple card rows. */
type GutterTool = {
  src: string;
  alt: string;
  col: 2 | 4;
  row: string; // CSS grid-row, e.g. "1 / 3" or "3"
  width: number;
  rotate: number;
  rot90?: boolean; // for tools photographed sideways (e.g. the caliper)
};

/** A single accent placed outside the card grid — either centered below
 * the whole section, or tucked into the board's outer margin. */
type AccentTool = { src: string; alt: string; width: number; rotate: number };

/** Resolves a /public/tools/* image against the app's actual base path.
 * A hardcoded "/tools/x.webp" breaks on the GitHub Pages project-site
 * deployment, which is served under "/Portfolio/" (see vite.config.ts) —
 * BASE_URL is "/" locally and "/Portfolio/" there, so this works in both. */
function toolAsset(file: string) {
  return `${import.meta.env.BASE_URL}tools/${file}`;
}

const GUTTERS: Record<ToolDomainId, GutterTool[]> = {
  mechanical: [
    { src: toolAsset("caliper.webp"), alt: "Digital caliper", col: 2, row: "1 / 3", width: 230, rotate: 0, rot90: true },
    { src: toolAsset("wrench.webp"), alt: "Wrench", col: 4, row: "1 / 3", width: 52, rotate: 3 },
    { src: toolAsset("micrometer.webp"), alt: "Micrometer", col: 2, row: "3", width: 66, rotate: -18 },
    { src: toolAsset("bearing.webp"), alt: "Ball bearing", col: 4, row: "3", width: 46, rotate: 10 },
  ],
  robotics: [
    { src: toolAsset("pcb-green.webp"), alt: "Microcontroller board", col: 2, row: "1 / 3", width: 58, rotate: -6 },
    { src: toolAsset("board.webp"), alt: "Single-board computer", col: 4, row: "1 / 3", width: 56, rotate: 7 },
  ],
  ai: [
    { src: toolAsset("ultrasonic-sensor.webp"), alt: "Ultrasonic sensor", col: 2, row: "1", width: 54, rotate: -8 },
    { src: toolAsset("ic-chip.webp"), alt: "AI accelerator chip", col: 4, row: "1", width: 44, rotate: 9 },
  ],
};

/** Centered below the entire card grid of that domain. */
const BELOW_ACCENT: Partial<Record<ToolDomainId, AccentTool>> = {
  mechanical: { src: toolAsset("gear.webp"), alt: "Gear", width: 46, rotate: 8 },
};

/** Tucked into the board's right margin, just past the last card column. */
const MARGIN_ACCENT: Partial<Record<ToolDomainId, AccentTool>> = {
  robotics: { src: toolAsset("relay.webp"), alt: "Relay module", width: 30, rotate: -10 },
};

const EDGE_PINS: { top: string; left?: string; right?: string; color: "brass" | "silver" | "red" | "green" }[] = [
  { top: "29%", right: "-5px", color: "brass" },
  { top: "60%", right: "-5px", color: "silver" },
  { top: "88%", left: "38%", color: "red" },
  { top: "82%", right: "-5px", color: "green" },
];
const EDGE_PIN_STYLE: Record<"brass" | "silver" | "red" | "green", string> = {
  brass: "bg-[radial-gradient(circle_at_35%_30%,#ffe6a3,#c99f3d)]",
  silver: "bg-[radial-gradient(circle_at_35%_30%,#f2f4f6,#8b9096)]",
  red: "bg-[radial-gradient(circle_at_35%_30%,#ff8a7a,#c23b28)]",
  green: "bg-[radial-gradient(circle_at_35%_30%,#a8e6b0,#3f9950)]",
};

/** Column index (1, 3, or 5 of the 5-col card|gutter|card|gutter|card
 * grid) and row for the nth card in a domain, assuming 3 cards per row. */
function cardPlacement(index: number) {
  const col = (index % 3) * 2 + 1;
  const row = Math.floor(index / 3) + 1;
  return { gridColumn: col, gridRow: row };
}

const TOOLS: ToolItem[] = [
  // ---- Mechanical Engineering ----
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

  // ---- Robotics & Systems ----
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

  // ---- AI & Intelligent Systems ----
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

  const activeId = hoveredId ?? selectedId;
  const activeTool = useMemo(() => TOOLS.find((t) => t.id === activeId) ?? null, [activeId]);
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

  return (
    <section id="skills" className="toolwall-grid-bg py-12 md:py-16">
      <div data-lidar-object="TOOL WALL" className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Engineering Tool Wall / Skills</p>
        <h2 className="mt-3 text-4xl font-bold md:text-5xl">My Engineering Toolkit.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          The tools I use to design mechanical systems, build robots, simulate complex environments,
          and develop intelligent autonomous systems.
        </p>
      </div>

      {/* Pegboard panel. Texture lives on an absolute layer behind the content
         so the rounded corners can clip it without ever clipping the hover
         tooltips, which need to be able to escape the panel bounds. */}
      <div className="relative mt-6 pegboard-depth">
        <div className="pointer-events-none absolute inset-0 rounded-3xl pegboard-surface pegboard-frame" />
        <span aria-hidden className="pegboard-rivet pegboard-rivet-tl" />
        <span aria-hidden className="pegboard-rivet pegboard-rivet-tr" />
        <span aria-hidden className="pegboard-rivet pegboard-rivet-bl" />
        <span aria-hidden className="pegboard-rivet pegboard-rivet-br" />
        {EDGE_PINS.map((p, i) => (
          <span
            key={i}
            aria-hidden
            className={`pointer-events-none absolute z-[6] h-[11px] w-[11px] rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.5)] ${EDGE_PIN_STYLE[p.color]}`}
            style={{ top: p.top, left: p.left, right: p.right }}
          />
        ))}
        <div className="relative rounded-3xl p-4 sm:p-6 md:p-8">
          <div className="space-y-6 md:space-y-8">
            {DOMAINS.map((domain) => {
              const DomainIcon = domain.icon;
              const domainTools = TOOLS.filter((t) => t.domain === domain.id);
              const below = BELOW_ACCENT[domain.id];
              const margin = MARGIN_ACCENT[domain.id];
              return (
              <div key={domain.id} className="relative">
                <div className="flex items-center gap-2.5 pb-2">
                  <DomainIcon className="h-4 w-4 text-foreground" strokeWidth={1.9} />
                  <h3 className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-foreground">{domain.label}</h3>
                  <span className="ml-1.5 h-px flex-1 bg-foreground/20" aria-hidden />
                </div>

                <div className="relative mt-4 grid grid-cols-2 items-stretch gap-2.5 sm:grid-cols-[1fr_44px_1fr_44px_1fr] sm:gap-x-3 sm:gap-y-3">
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
                          className={`skill-card group relative flex w-full flex-col rounded-[14px] bg-card px-3 py-2.5 text-left outline-none ${isSelected ? "tool-plate-selected" : ""}`}
                          style={{
                            transform: isActive ? "translateY(-4px) rotate(0deg)" : `rotate(${tool.tilt}deg)`,
                          }}
                        >
                          <span className={`absolute right-[11px] top-[10px] h-[7px] w-[7px] rounded-full ${STATUS_STYLE[tool.status]}`} aria-hidden />
                          <span className="flex items-start gap-2">
                            <Icon className="mt-0.5 h-[19px] w-[19px] shrink-0 text-foreground" strokeWidth={1.7} />
                            <span className="font-display text-[13.5px] font-bold leading-tight text-foreground">{tool.name}</span>
                          </span>
                          <span className="ml-[27px] mt-1 text-[11px] leading-snug text-muted-foreground">{tool.categoryTag}</span>
                        </button>

                        {/* Hover inspection tooltip — desktop only; mobile relies on
                           the always-in-flow inspection panel below the board so
                           nothing can ever overflow the viewport. */}
                        {isActive && (
                          <div className="tool-tooltip pointer-events-none absolute bottom-full left-1/2 z-20 mb-4 hidden w-52 -translate-x-1/2 md:block">
                            <p className="font-mono text-[9px] tracking-[0.2em] text-primary/90">TOOL DETECTED</p>
                            <p className="mt-1 font-display text-sm font-semibold text-foreground">{tool.name}</p>
                            <p className="mt-2 font-mono text-[9px] tracking-[0.15em] text-muted-foreground">CATEGORY</p>
                            <p className="text-xs text-foreground/80">{tool.categoryTag}</p>
                            <p className="mt-2 font-mono text-[9px] tracking-[0.15em] text-muted-foreground">USED FOR</p>
                            <ul className="text-xs text-foreground/80">
                              {tool.usedFor.map((u) => <li key={u}>{u}</li>)}
                            </ul>
                            <div className="tool-tooltip-notch" aria-hidden />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Real photographed tools, slotted into the gutter columns
                     between the card columns — purely decorative, not tied
                     to any one skill card. */}
                  {GUTTERS[domain.id].map((g) => (
                    <div
                      key={g.src}
                      aria-hidden
                      className="pointer-events-none relative z-[1] hidden items-center justify-center sm:flex"
                      style={{ gridColumn: g.col, gridRow: g.row }}
                    >
                      <img
                        src={g.src}
                        alt={g.alt}
                        className="block max-w-none drop-shadow-[0_8px_10px_rgba(20,20,40,0.4)] drop-shadow-[0_2px_3px_rgba(20,20,40,0.3)]"
                        style={{
                          width: g.width,
                          transform: g.rot90 ? "rotate(-90deg)" : `rotate(${g.rotate}deg)`,
                        }}
                      />
                    </div>
                  ))}
                </div>

                {below && (
                  <div aria-hidden className="pointer-events-none relative z-[1] mt-3 hidden justify-center sm:flex">
                    <img src={below.src} alt={below.alt} style={{ width: below.width, transform: `rotate(${below.rotate}deg)` }} className="block max-w-none drop-shadow-[0_8px_10px_rgba(20,20,40,0.4)]" />
                  </div>
                )}
                {margin && (
                  <div aria-hidden className="pointer-events-none absolute right-[-30px] top-1 z-[1] hidden sm:block" style={{ width: margin.width }}>
                    <img src={margin.src} alt={margin.alt} style={{ transform: `rotate(${margin.rotate}deg)` }} className="block w-full max-w-none drop-shadow-[0_6px_8px_rgba(20,20,40,0.4)]" />
                  </div>
                )}
              </div>
              );
            })}
          </div>

          {/* Inspection panel — pinned detail for the selected tool. Only
             rendered once something is actually selected. */}
          {selectedTool && (
            <div className="mt-12 rounded-xl border border-border bg-secondary/40 p-5">
              <m.div key={selectedTool.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.25em] text-primary/90">TOOL DETECTED</p>
                    <h4 className="mt-1 font-display text-lg font-semibold text-foreground">{selectedTool.name}</h4>
                    <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">{selectedTool.categoryTag}</p>
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
                        <li key={u} className="flex items-center gap-2"><CircleDot className="h-3 w-3 text-primary/80" />{u}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                      CONNECTED PROJECTS <span className="text-foreground/70">{String(connectedProjects.length).padStart(2, "0")}</span>
                    </p>
                    {connectedProjects.length > 0 ? (
                      <ul className="mt-2 space-y-1 text-sm text-foreground/80">
                        {connectedProjects.map((p) => <li key={p.title}>{p.title}</li>)}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">No linked projects yet — check back soon.</p>
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
      </div>
    </section>
  );
}
