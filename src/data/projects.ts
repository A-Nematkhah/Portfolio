import { pub } from "@/lib/pub";

export type MediaItem = { type: "image" | "video"; src: string; caption?: string };

export type Project = {
  tag: string;
  title: string;
  tool: string;
  img: string;
  cat: string;
  video?: string;
  desc: string;
  media?: MediaItem[];
  dbId?: string;
  externalLink?: string;
  /** Stable key for deduping against DB rows after seed */
  slug?: string;
};

export const FILTERS = [
  "All",
  "3D Models",
  "2D Drawings",
  "Project Management",
  "MATLAB",
  "Python",
  "PLC, Hydraulic & Pneumatic",
] as const;

/**
 * Bundled catalog — also mirrored in supabase/migrations/*_seed_static_projects.sql.
 * Paths are site-relative under /public so GitHub Pages + Supabase seed stay in sync.
 * When the DB has rows, PortfolioPage prefers DB and only keeps static items
 * whose slug is not already present in the DB.
 */
export const PROJECTS: Project[] = [
  {
    slug: "housingless-rolling-stand",
    tag: "3D Model",
    title: "Housingless Rolling Stand",
    tool: "SolidWorks",
    img: pub("/projects/proj-rolling-mill.webp"),
    cat: "3D Models",
    desc: "Detailed 3D model of a housingless rolling stand used in modern steel rolling mills. Designed for high rigidity, easy roll changes, and improved product tolerances.",
  },
  {
    slug: "housingless-stand-motion",
    tag: "3D Model",
    title: "Housingless Stand — Motion Study",
    tool: "SolidWorks Motion",
    img: pub("/projects/proj-rolling-mill.webp"),
    video: pub("/videos/housingless-stand.mp4"),
    cat: "3D Models",
    desc: "Motion study of the housingless rolling stand showing roll adjustment kinematics and clamping behavior under operating conditions.",
  },
  {
    slug: "start-stop-shear",
    tag: "3D Model",
    title: "Start–Stop Shear",
    tool: "SolidWorks Motion",
    img: pub("/projects/proj-rolling-mill.webp"),
    video: pub("/videos/start-stop-shear.mp4"),
    cat: "3D Models",
    desc: "Mechanism design and motion simulation of a start–stop shear used to cut hot-rolled bars at line speed with synchronized blade motion.",
  },
  {
    slug: "iris-cap-mechanism",
    tag: "3D Model",
    title: "Iris Cap Mechanism",
    tool: "SolidWorks Motion",
    img: pub("/projects/proj-rolling-mill.webp"),
    video: pub("/videos/iris-cap.mp4"),
    cat: "3D Models",
    desc: "Iris-style aperture mechanism modeled and animated to validate linkage geometry, contact, and synchronized blade motion.",
  },
  {
    slug: "winch-assembly",
    tag: "2D Drawing",
    title: "Winch Assembly Drawing",
    tool: "SolidWorks",
    img: pub("/winch/winch-assembly-1.webp"),
    cat: "2D Drawings",
    desc: "Production-ready 2D assembly drawing of an industrial winch with full BOM, part weights, and manufacturing notes.",
    media: [
      {
        type: "image",
        src: pub("/winch/winch-assembly-1.webp"),
        caption:
          "Winch overall assembly — gantry-style structure with bridge, pillars and base, including BOM with part weights.",
      },
      {
        type: "image",
        src: pub("/winch/winch-assembly-2.webp"),
        caption: "Winch base sub-assembly — detailed exploded view with numbered parts and weight table.",
      },
    ],
  },
  {
    slug: "production-line-project",
    tag: "Project Management",
    title: "Production Line Project",
    tool: "MS Project",
    img: pub("/projects/proj-gantt-new.webp"),
    cat: "Project Management",
    desc: "Planning, scheduling and progress control of a full production line installation, including WBS, Gantt chart and resource leveling.",
  },
  {
    slug: "honda-cub-ev-msp",
    tag: "Project Management",
    title: "Conversion of Honda Super Cub C125 to Electric Model MSP",
    tool: "MS Project",
    img: pub("/honda/honda-cub-msp-1.webp"),
    cat: "Project Management",
    desc: "Full project plan for converting a Honda Super Cub C125 to an electric powertrain — WBS, scheduling, and progress tracking in MS Project, including detailed task breakdown and Gantt chart visualization.",
    media: [
      {
        type: "image",
        src: pub("/honda/honda-cub-msp-1.webp"),
        caption:
          "WBS & task schedule — full work breakdown structure with durations, weights, start/finish dates and progress for each phase of the EV conversion.",
      },
      {
        type: "image",
        src: pub("/honda/honda-cub-msp-2.webp"),
        caption:
          "Gantt chart — timeline view showing task dependencies, critical path and completion percentages across project phases.",
      },
    ],
  },
  {
    slug: "sliding-mode-manipulator",
    tag: "MATLAB",
    title: "Sliding Mode Control of a Robotic Manipulator",
    tool: "MATLAB/Simulink",
    img: pub("/matlab/dexterity-manipulability.webp"),
    video: pub("/matlab/part1.mp4"),
    cat: "MATLAB",
    desc: "Modeling, dynamic simulation and Sliding Mode Control of a multi-link robotic manipulator in MATLAB/Simulink. Includes workspace dexterity & manipulability analysis, full forward/inverse dynamics block diagrams, controller architecture, and 3D motion simulation of the robot tracking a desired trajectory.",
    media: [
      {
        type: "image",
        src: pub("/matlab/dexterity-manipulability.webp"),
        caption:
          "Workspace analysis — dexterity and manipulability indices computed across the reachable workspace of the manipulator.",
      },
      {
        type: "image",
        src: pub("/matlab/simulink-dynamics.webp"),
        caption:
          "Simulink model — full multi-body forward dynamics with joint blocks, trajectory generator and sensor outputs.",
      },
      {
        type: "image",
        src: pub("/matlab/simulink-controllers.webp"),
        caption:
          "Controller architecture — sliding mode and inverse dynamics control loops implemented as reusable Simulink subsystems.",
      },
      {
        type: "video",
        src: pub("/matlab/part1.mp4"),
        caption: "3D simulation — manipulator executing the planned trajectory under sliding mode control.",
      },
      {
        type: "video",
        src: pub("/matlab/part4-sim.mp4"),
        caption:
          "Closed-loop response — tracking performance and chatter behavior of the sliding mode controller.",
      },
    ],
  },
  {
    slug: "robot-path-planning",
    tag: "Python",
    title: "Robot Path Planning",
    tool: "Python",
    img: pub("/projects/proj-robot.webp"),
    cat: "Python",
    desc: "Path planning and obstacle avoidance for a mobile robot using Python, with visualization of trajectories and cost maps.",
  },
  {
    slug: "a-b-nonstop-cycle",
    tag: "PLC",
    title: "A+A−B+B− Nonstop Cycle",
    tool: "PLC Ladder Logic",
    img: pub("/projects/proj-gearbox-new.webp"),
    video: pub("/videos/a-b-nonstop.mp4"),
    cat: "PLC, Hydraulic & Pneumatic",
    desc: "Continuous A+A−B+B− pneumatic sequence implemented in PLC ladder logic, including start/stop interlocks and cycle counter.",
  },
  {
    slug: "hydraulic-circuit-sim",
    tag: "Hydraulic",
    title: "Hydraulic Circuit Simulation",
    tool: "FluidSIM",
    img: pub("/projects/proj-gearbox-new.webp"),
    video: pub("/videos/hydraulic-sim.mp4"),
    cat: "PLC, Hydraulic & Pneumatic",
    desc: "Hydraulic circuit designed and simulated in FluidSIM, demonstrating actuator sequencing, pressure regulation and flow control.",
  },
  {
    slug: "pneumatic-sequence-control",
    tag: "Pneumatic",
    title: "Pneumatic Sequence Control",
    tool: "FluidSIM",
    img: pub("/projects/proj-gearbox-new.webp"),
    video: pub("/videos/pneumatic-sim.mp4"),
    cat: "PLC, Hydraulic & Pneumatic",
    desc: "Pneumatic sequence controller validated in FluidSIM with sensors and limit switches driving multi-cylinder synchronized motion.",
  },
];
