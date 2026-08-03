import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../src/i18n/locales");
mkdirSync(outDir, { recursive: true });

const en = {
  meta: {
    title: "Amirhossein Nematkhah | Mechatronics Engineer Portfolio",
    description:
      "Portfolio of Amirhossein Nematkhah — Mechatronics Engineer specializing in mechanical design, industrial systems, project management, MATLAB, and intelligent automation.",
  },
  common: {
    scrollToTop: "Scroll to top",
    close: "Close",
    edit: "Edit",
    delete: "Delete",
    prev: "Previous",
    next: "Next",
    language: "Language",
    switchToEn: "Switch to English",
    switchToFa: "Switch to Persian",
    loading: "Loading…",
  },
  nav: {
    home: "Home",
    about: "About",
    skills: "Skills",
    projects: "Projects",
    experience: "Experience",
    certificates: "Certificates",
    contact: "Contact",
    downloadCv: "Download CV",
    themeToLight: "Switch to light mode",
    themeToDark: "Switch to dark mode",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    eyebrow: "Mechatronics Engineer",
    firstName: "Amirhossein",
    lastName: "Nematkhah",
    tagline1: "Mechanical Design • Industrial Systems • Project Control",
    tagline2: "AI & Automation • Simulation & Control",
    ctaWork: "View My Work",
    ctaContact: "Contact Me",
    portraitAlt: "Amirhossein Nematkhah, mechatronics engineer",
    boot0: "> loading profile... OK",
    boot1: "> mechanical_design: ONLINE",
    boot2: "> rl_agent: ONLINE",
    boot3: "> systems_check: PASS",
    stats: {
      projectsN: "12+",
      projectsLabel: "Projects Completed",
      experienceN: "3+",
      experienceLabel: "Years of Experience",
      technologiesN: "15+",
      technologiesLabel: "Technologies",
    },
  },
  about: {
    eyebrow: "About",
    title: "Engineering meets intelligent design.",
    body: "Mechatronics engineer with industrial experience in mechanical design, production systems, project management, industrial equipment development, and intelligent automation. Experienced in CAD design, simulation, industrial engineering workflows, and modern AI-based robotics research.",
    eduBscTitle: "B.Sc. Mechanical Engineering",
    eduBscSchool: "Sahand University of Technology",
    eduMscTitle: "M.Sc. Mechatronics Engineering",
    eduMscSchool: "Amirkabir University of Technology — Ongoing",
  },
  projects: {
    eyebrow: "Portfolio",
    title: "Featured Projects",
    adminAdd: "Add Project",
    deleteConfirm: "Delete this project? This cannot be undone.",
    imageUnavailable: "Image unavailable",
    noPreview: "No preview",
    videoThumb: "VIDEO",
    openLink: "Open link",
    filters: {
      All: "All",
      "3D Models": "3D Models",
      "2D Drawings": "2D Drawings",
      "Project Management": "Project Management",
      MATLAB: "MATLAB",
      Python: "Python",
      "PLC, Hydraulic & Pneumatic": "PLC, Hydraulic & Pneumatic",
    },
    items: {
      "housingless-rolling-stand": {
        tag: "3D Model",
        title: "Housingless Rolling Stand",
        tool: "SolidWorks",
        desc: "Detailed 3D model of a housingless rolling stand used in modern steel rolling mills. Designed for high rigidity, easy roll changes, and improved product tolerances.",
      },
      "housingless-stand-motion": {
        tag: "3D Model",
        title: "Housingless Stand — Motion Study",
        tool: "SolidWorks Motion",
        desc: "Motion study of the housingless rolling stand showing roll adjustment kinematics and clamping behavior under operating conditions.",
      },
      "start-stop-shear": {
        tag: "3D Model",
        title: "Start–Stop Shear",
        tool: "SolidWorks Motion",
        desc: "Mechanism design and motion simulation of a start–stop shear used to cut hot-rolled bars at line speed with synchronized blade motion.",
      },
      "iris-cap-mechanism": {
        tag: "3D Model",
        title: "Iris Cap Mechanism",
        tool: "SolidWorks Motion",
        desc: "Iris-style aperture mechanism modeled and animated to validate linkage geometry, contact, and synchronized blade motion.",
      },
      "winch-assembly": {
        tag: "2D Drawing",
        title: "Winch Assembly Drawing",
        tool: "SolidWorks",
        desc: "Production-ready 2D assembly drawing of an industrial winch with full BOM, part weights, and manufacturing notes.",
        media0:
          "Winch overall assembly — gantry-style structure with bridge, pillars and base, including BOM with part weights.",
        media1:
          "Winch base sub-assembly — detailed exploded view with numbered parts and weight table.",
      },
      "production-line-project": {
        tag: "Project Management",
        title: "Production Line Project",
        tool: "MS Project",
        desc: "Planning, scheduling and progress control of a full production line installation, including WBS, Gantt chart and resource leveling.",
      },
      "honda-cub-ev-msp": {
        tag: "Project Management",
        title: "Conversion of Honda Super Cub C125 to Electric Model MSP",
        tool: "MS Project",
        desc: "Full project plan for converting a Honda Super Cub C125 to an electric powertrain — WBS, scheduling, and progress tracking in MS Project, including detailed task breakdown and Gantt chart visualization.",
        media0:
          "WBS & task schedule — full work breakdown structure with durations, weights, start/finish dates and progress for each phase of the EV conversion.",
        media1:
          "Gantt chart — timeline view showing task dependencies, critical path and completion percentages across project phases.",
      },
      "sliding-mode-manipulator": {
        tag: "MATLAB",
        title: "Sliding Mode Control of a Robotic Manipulator",
        tool: "MATLAB/Simulink",
        desc: "Modeling, dynamic simulation and Sliding Mode Control of a multi-link robotic manipulator in MATLAB/Simulink. Includes workspace dexterity & manipulability analysis, full forward/inverse dynamics block diagrams, controller architecture, and 3D motion simulation of the robot tracking a desired trajectory.",
        media0:
          "Workspace analysis — dexterity and manipulability indices computed across the reachable workspace of the manipulator.",
        media1:
          "Simulink model — full multi-body forward dynamics with joint blocks, trajectory generator and sensor outputs.",
        media2:
          "Controller architecture — sliding mode and inverse dynamics control loops implemented as reusable Simulink subsystems.",
        media3:
          "3D simulation — manipulator executing the planned trajectory under sliding mode control.",
        media4:
          "Closed-loop response — tracking performance and chatter behavior of the sliding mode controller.",
      },
      "robot-path-planning": {
        tag: "Python",
        title: "Robot Path Planning",
        tool: "Python",
        desc: "Path planning and obstacle avoidance for a mobile robot using Python, with visualization of trajectories and cost maps.",
      },
      "a-b-nonstop-cycle": {
        tag: "PLC",
        title: "A+A−B+B− Nonstop Cycle",
        tool: "PLC Ladder Logic",
        desc: "Continuous A+A−B+B− pneumatic sequence implemented in PLC ladder logic, including start/stop interlocks and cycle counter.",
      },
      "hydraulic-circuit-sim": {
        tag: "Hydraulic",
        title: "Hydraulic Circuit Simulation",
        tool: "FluidSIM",
        desc: "Hydraulic circuit designed and simulated in FluidSIM, demonstrating actuator sequencing, pressure regulation and flow control.",
      },
      "pneumatic-sequence-control": {
        tag: "Pneumatic",
        title: "Pneumatic Sequence Control",
        tool: "FluidSIM",
        desc: "Pneumatic sequence controller validated in FluidSIM with sensors and limit switches driving multi-cylinder synchronized motion.",
      },
    },
  },
  featured: {
    imageAlt: "Conveyor system",
    eyebrow: "3D Modeling",
    title: "Legbelt — Smart Bed Bug Trap System",
    body: "Designed a furniture-integrated bed bug trap system focused on discreet protection, modern aesthetics, and user-friendly integration. Developed the mechanical structure, industrial design, and product visualization with attention to manufacturability and structural stability.",
    bullet0: "3D Modeling in SolidWorks",
    bullet1: "FEA Analysis for Structural Validation",
    bullet2: "Motion Study & Optimization",
    bullet3: "Detailed Manufacturing Drawings",
    tag0: "SolidWorks",
    tag1: "Simulation",
    tag2: "FEA",
    tag3: "Design",
  },
  toolWall: {
    eyebrowBrand: "Engineering Tool Wall",
    eyebrowSkills: "/ Skills",
    title: "My Engineering Toolkit.",
    subtitle:
      "The tools I use to design mechanical systems, build robots, and train intelligent agents.",
    reset: "Reset tools",
    quote: "Precision in tools, and in ideas, builds impact in engineering.",
    domains: {
      mechanical: "Mechanical Engineering",
      robotics: "Robotics & Automation",
      ai: "AI & Intelligent Systems",
    },
    panel: {
      detected: "TOOL DETECTED",
      category: "CATEGORY",
      usedFor: "USED FOR",
      connected: "CONNECTED PROJECTS",
      noProjects: "No linked projects yet — check back soon.",
      explore: "Explore related projects",
      close: "Close inspection panel",
    },
    aria: {
      inspect: "{name} — {tag}. Selected. Press to inspect.",
      move: "Move {alt}",
    },
    pegs: {
      micrometer: "Micrometer",
      wrench: "Wrench",
      caliper: "Digital caliper",
      bearing: "Ball bearing",
      pcb: "Microcontroller board",
      sbc: "Single-board computer",
      ultrasonic: "Ultrasonic sensor",
      chip: "AI accelerator chip",
      gear: "Gear",
      relay: "Relay module",
    },
    tools: {
      solidworks: {
        name: "SolidWorks",
        categoryTag: "CAD / CAE",
        u0: "Mechanical Design",
        u1: "Assembly Modeling",
        u2: "Motion Study",
      },
      catia: {
        name: "CATIA",
        categoryTag: "CAD / SURFACING",
        u0: "Surface Modeling",
        u1: "Assembly Design",
        u2: "Product Structure",
      },
      "ansys-fluent": {
        name: "ANSYS Fluent",
        categoryTag: "CFD SIMULATION",
        u0: "Fluid Flow Simulation",
        u1: "Thermal Analysis",
        u2: "CFD Modeling",
      },
      cad: {
        name: "AutoCAD",
        categoryTag: "DRAFTING / GD&T",
        u0: "2D Technical Drawings",
        u1: "GD&T",
        u2: "Manufacturing Documentation",
      },
      matlab: {
        name: "MATLAB",
        categoryTag: "SIMULATION / CONTROL",
        u0: "Dynamic Modeling",
        u1: "Controller Design",
        u2: "Simulink Simulation",
      },
      "hydraulics-pneumatics": {
        name: "Hydraulics & Pneumatics",
        categoryTag: "FLUID POWER",
        u0: "Circuit Design",
        u1: "Actuator Sizing",
        u2: "System Troubleshooting",
      },
      "mechanical-design": {
        name: "Mechanical Design",
        categoryTag: "DESIGN FUNDAMENTALS",
        u0: "Machine Elements",
        u1: "Tolerancing",
        u2: "DFM / DFA",
      },
      "ms-project": {
        name: "Microsoft Project",
        categoryTag: "SCHEDULING / GANTT",
        u0: "Project Scheduling",
        u1: "Resource Allocation",
        u2: "Gantt Tracking",
      },
      "project-planning": {
        name: "Project Planning",
        categoryTag: "MANAGEMENT",
        u0: "Milestone Planning",
        u1: "Risk Tracking",
        u2: "Team Coordination",
      },
      "simulation-analysis": {
        name: "Simulation & Analysis",
        categoryTag: "CAE WORKFLOWS",
        u0: "FEA",
        u1: "System-Level Simulation",
        u2: "Results Validation",
      },
      ros2: {
        name: "ROS 2",
        categoryTag: "ROBOTICS MIDDLEWARE",
        u0: "Node Communication",
        u1: "Sensor Integration",
        u2: "Robot Control",
      },
      gazebo: {
        name: "Gazebo",
        categoryTag: "PHYSICS SIMULATION",
        u0: "Robot Simulation",
        u1: "Sensor Modeling",
        u2: "Environment Testing",
      },
      "isaac-lab": {
        name: "Isaac Lab",
        categoryTag: "SIM-TO-REAL / RL",
        u0: "Parallel RL Training",
        u1: "Robot Learning",
        u2: "Sim-to-Real Transfer",
      },
      "siemens-logo": {
        name: "Siemens Logo PLC",
        categoryTag: "INDUSTRIAL CONTROL",
        u0: "Ladder Logic",
        u1: "I/O Wiring",
        u2: "Automation Panels",
      },
      arduino: {
        name: "Arduino",
        categoryTag: "EMBEDDED / PROTOTYPING",
        u0: "Sensor Prototyping",
        u1: "Microcontroller Firmware",
        u2: "Rapid Testing",
      },
      "intelligent-automation": {
        name: "Intelligent Automation",
        categoryTag: "SMART SYSTEMS",
        u0: "Process Automation",
        u1: "Sensor Fusion",
        u2: "Autonomous Control",
      },
      python: {
        name: "Python",
        categoryTag: "PROGRAMMING",
        u0: "Robotics Scripting",
        u1: "Data & Visualization",
        u2: "Automation",
      },
      rl: {
        name: "Reinforcement Learning",
        categoryTag: "MACHINE LEARNING",
        u0: "Reward Shaping",
        u1: "Policy Optimization",
        u2: "Agent Training",
      },
      llm: {
        name: "LLM",
        categoryTag: "LANGUAGE MODELS",
        u0: "Reward Design",
        u1: "Reasoning Agents",
        u2: "Tool-Use Automation",
      },
    },
  },
  experience: {
    eyebrow: "Experience",
    title: "Industrial Timeline",
    subtitleDesktop:
      "Scroll to follow the route — each checkpoint is a stop on the engineering journey.",
    subtitleMobile:
      "Each stop on the engineering journey — from first industrial role to current R&D.",
    currentBadge: "Current",
    logoPlaceholder: "Replace with Supishi logo",
    items: {
      mobtakeran: {
        co: "Mechatronic Mobtakeran Arg",
        role: "Industrial Designer",
        year: "2021",
        b0: "Laboratory printers",
        b1: "Dental milling systems",
        b2: "Dental scanners",
        b3: "Mechanical product development",
      },
      isdg: {
        co: "Iranian Steel Development Group",
        role: "Mechanical Designer & Engineer",
        year: "2022",
        b0: "Steel production line equipment",
        b1: "Industrial machinery design",
        b2: "Manufacturing supervision",
        b3: "Project scheduling and control",
      },
      nyop: {
        co: "NYOP — Netherlands",
        role: "Product Designer",
        year: "2024",
        b0: "Smart home products",
        b1: "Smart insect trap",
        b2: "Air quality monitoring",
        b3: "Prototype development & CAD optimization",
      },
      supishi: {
        co: "Supishi Co",
        role: "Mechatronics Engineer",
        year: "Present",
        dept: "Research & Development (R&D)",
        b0: "Custom conveyor systems for production lines",
        b1: "Label applicator mechanism design",
        b2: "Domino inkjet printer line integration",
        b3: "Custom industrial equipment and machine components",
        b4: "Mechatronic systems: mechanics, electronics, control",
      },
    },
  },
  research: {
    eyebrow: "Research",
    title: "Research & AI",
    items: {
      rl: { t: "Reinforcement Learning", d: "Reward shaping & policy optimization" },
      autonomous: { t: "Autonomous Systems", d: "Mobile robotics & navigation" },
      llmReward: { t: "LLM-Based Reward Shaping", d: "Language models guiding RL agents" },
      sensorFusion: { t: "Sensor Fusion", d: "Multi-modal perception & estimation" },
      intelligentControl: { t: "Intelligent Control", d: "MPC, adaptive & robust control" },
      roboticsSafety: { t: "Robotics Safety", d: "Constrained learning systems" },
    },
  },
  certificates: {
    eyebrow: "Credentials",
    title: "Certificates",
    subtitle:
      "Professional courses and credentials earned across engineering, simulation, and intelligent systems.",
    hint: "Drag to browse · Auto-slides",
    view: "View",
    instructedBy: "Instructed by {name}",
    verify: "Verify Certificate",
    fields: { issued: "Issued", certId: "Certificate ID", issuer: "Issuer" },
    items: {
      "1FB53901": {
        title: "Mastering Machine Learning with Python: A Comprehensive Online Course",
        issuer: "FaraDars",
        category: "Machine Learning",
        instructor: "Dr. Pejman Eqbali",
        issued: "July 22, 2025",
      },
      "05419F53": {
        title:
          "Mastering Microsoft Project 2019: Your Ultimate Guide to Project Management Success",
        issuer: "FaraDars",
        category: "Project Management",
        instructor: "Eng. Masoud Amini",
        issued: "March 8, 2025",
      },
      "38FA56B2": {
        title: "Mastering Python: Advanced Techniques for Reinforcement Learning",
        issuer: "FaraDars",
        category: "Reinforcement Learning",
        instructor: "Dr. Sadegh Eskandari",
        issued: "November 02, 2025",
      },
      "5377F27D": {
        title: "Fundamentals of Git with GitHub and GitLab",
        issuer: "FaraDars",
        category: "Version Control",
        instructor: "Jadi Mirmirani",
        issued: "May 29, 2026",
      },
      dc4fd977: {
        title: "CS50's Introduction to Programming with Python",
        issuer: "Harvard University",
        category: "Python",
        instructor: "David J. Malan",
        issued: "2026",
      },
    },
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's Connect",
    email: "Email",
    linkedin: "LinkedIn",
    github: "GitHub",
    location: "Location",
    emailValue: "a.h.nematkhah@gmail.com",
    linkedinValue: "/in/amirhossein-nematkhah",
    githubValue: "A-Nematkhah",
    locationValue: "Tehran, Iran",
  },
  footer: {
    copyright: "© {year} Amirhossein Nematkhah. All rights reserved.",
    source: "Source on GitHub",
  },
  robot: {
    name: "Archi",
    noteMeta: "{name} NOTE",
    srIdle: "Archi, portfolio guide robot",
    srActive: "Archi at {label}: {lines}",
    stops: {
      home: {
        label: "INTRO",
        line0: "Archi online. Local tour unit ready.",
        line1: "No liability for excessive engineering enthusiasm.",
      },
      about: {
        label: "MECHATRONICS",
        line0: "Mechanics, electronics, and control — in one chassis.",
        line1: "Also known as: why one major was never enough.",
      },
      projects: {
        label: "PROJECTS",
        line0: "These aren't mockups. They move.",
        line1: "Sometimes on purpose.",
      },
      "skills-mechanical": {
        label: "TOOL WALL",
        line0: "CAD, CFD, and a suspicious amount of coffee.",
        line1: "If it can be modeled, it will be modeled.",
      },
      "skills-robotics": {
        label: "ROBOTICS",
        line0: "Sensors online. World looks noisy from down here.",
        line1: "Perception first. Drama later.",
      },
      "skills-ai": {
        label: "AI / RL",
        line0: "Teaching machines to learn. Results may vary.",
        line1: "Reward shaping: 90% science, 10% negotiation.",
      },
      experience: {
        label: "FIELD LOG",
        line0: "Production floors. Deadlines. Real constraints.",
        line1: "Where PowerPoint slides go to meet physics.",
      },
      research: {
        label: "RESEARCH",
        line0: "Hypothesis detected. Experiment loading…",
        line1: "Failure is data. Especially the expensive kind.",
      },
      certificates: {
        label: "CREDENTIALS",
        line0: "Training complete. Sticker collection growing.",
        line1: "Proof that learning was logged, not just claimed.",
      },
      contact: {
        label: "CONTACT",
        line0: "End of route. Handshake protocol ready.",
        line1: "Got a problem worth building for?",
      },
    },
  },
  lidar: {
    idle: "SCANNING...",
    projectDetected: "PROJECT DETECTED",
    projectFallback: "PROJECT",
    objectLine: "OBJECT: {label}",
    distanceLine: "DISTANCE: {n} m",
    statusDetected: "STATUS: DETECTED",
    unknown: "UNKNOWN",
  },
  notFound: {
    code: "404",
    title: "Page not found",
    body: "The page you're looking for doesn't exist or has been moved.",
    goHome: "Go home",
  },
  error: {
    title: "This page didn't load",
    body: "Something went wrong on our end. You can try refreshing or head back home.",
    retry: "Try again",
    goHome: "Go home",
  },
};

// Deep clone helper
function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

const fa = clone(en);

fa.meta.title = "امیرحسین نعمت‌خواه | پورتفولیو مهندس مکاترونیک";
fa.meta.description =
  "پورتفولیو امیرحسین نعمت‌خواه — مهندس مکاترونیک متخصص طراحی مکانیکی، سیستم‌های صنعتی، مدیریت پروژه، MATLAB و اتوماسیون هوشمند.";

Object.assign(fa.common, {
  scrollToTop: "بازگشت به بالا",
  close: "بستن",
  edit: "ویرایش",
  delete: "حذف",
  prev: "قبلی",
  next: "بعدی",
  language: "زبان",
  switchToEn: "تغییر به انگلیسی",
  switchToFa: "تغییر به فارسی",
  loading: "در حال بارگذاری…",
});

Object.assign(fa.nav, {
  home: "خانه",
  about: "درباره من",
  skills: "مهارت‌ها",
  projects: "پروژه‌ها",
  experience: "سوابق کاری",
  certificates: "گواهینامه‌ها",
  contact: "ارتباط",
  downloadCv: "دانلود رزومه",
  themeToLight: "حالت روشن",
  themeToDark: "حالت تاریک",
  openMenu: "باز کردن منو",
  closeMenu: "بستن منو",
});

Object.assign(fa.hero, {
  eyebrow: "مهندس مکاترونیک",
  firstName: "امیرحسین",
  lastName: "نعمت‌خواه",
  tagline1: "طراحی مکانیکی • سیستم‌های صنعتی • کنترل پروژه",
  tagline2: "هوش مصنوعی و اتوماسیون • شبیه‌سازی و کنترل",
  ctaWork: "مشاهده کارها",
  ctaContact: "ارتباط با من",
  portraitAlt: "امیرحسین نعمت‌خواه، مهندس مکاترونیک",
  boot0: "> بارگذاری پروفایل... OK",
  boot1: "> mechanical_design: ONLINE",
  boot2: "> rl_agent: ONLINE",
  boot3: "> systems_check: PASS",
});
fa.hero.stats = {
  projectsN: "۱۲+",
  projectsLabel: "پروژه تکمیل‌شده",
  experienceN: "۳+",
  experienceLabel: "سال تجربه",
  technologiesN: "۱۵+",
  technologiesLabel: "فناوری",
};

Object.assign(fa.about, {
  eyebrow: "درباره",
  title: "مهندسی در تقاطع طراحی هوشمند.",
  body: "مهندس مکاترونیک با تجربه صنعتی در طراحی مکانیکی، سیستم‌های تولید، مدیریت پروژه، توسعه تجهیزات صنعتی و اتوماسیون هوشمند. مسلط به طراحی CAD، شبیه‌سازی، جریان‌های کاری مهندسی صنعتی و پژوهش رباتیک مبتنی بر هوش مصنوعی.",
  eduBscTitle: "کارشناسی مهندسی مکانیک",
  eduBscSchool: "دانشگاه صنعتی سهند",
  eduMscTitle: "کارشناسی ارشد مهندسی مکاترونیک",
  eduMscSchool: "دانشگاه صنعتی امیرکبیر — در حال تحصیل",
});

Object.assign(fa.projects, {
  eyebrow: "نمونه کارها",
  title: "پروژه‌های منتخب",
  adminAdd: "افزودن پروژه",
  deleteConfirm: "این پروژه حذف شود؟ این عمل قابل بازگشت نیست.",
  imageUnavailable: "تصویر در دسترس نیست",
  noPreview: "بدون پیش‌نمایش",
  videoThumb: "ویدیو",
  openLink: "باز کردن لینک",
});
fa.projects.filters = {
  All: "همه",
  "3D Models": "مدل‌های سه‌بعدی",
  "2D Drawings": "نقشه‌های دوبعدی",
  "Project Management": "مدیریت پروژه",
  MATLAB: "MATLAB",
  Python: "Python",
  "PLC, Hydraulic & Pneumatic": "PLC، هیدرولیک و پنوماتیک",
};

const pFa = fa.projects.items;
pFa["housingless-rolling-stand"] = {
  tag: "مدل سه‌بعدی",
  title: "استند نورد بدون هاوزینگ",
  tool: "SolidWorks",
  desc: "مدل سه‌بعدی دقیق استند نورد بدون هاوزینگ مورد استفاده در نورد فولاد مدرن. طراحی‌شده برای صلبیت بالا، تعویض آسان رول و بهبود تلرانس محصول.",
};
pFa["housingless-stand-motion"] = {
  tag: "مدل سه‌بعدی",
  title: "استند بدون هاوزینگ — مطالعه حرکت",
  tool: "SolidWorks Motion",
  desc: "مطالعه حرکت استند نورد بدون هاوزینگ شامل سینماتیک تنظیم رول و رفتار قفل تحت شرایط کاری.",
};
pFa["start-stop-shear"] = {
  tag: "مدل سه‌بعدی",
  title: "قیچی استارت–استاپ",
  tool: "SolidWorks Motion",
  desc: "طراحی مکانیزم و شبیه‌سازی حرکت قیچی استارت–استاپ برای برش میلگرد گرم در سرعت خط با حرکت هم‌زمان تیغه‌ها.",
};
pFa["iris-cap-mechanism"] = {
  tag: "مدل سه‌بعدی",
  title: "مکانیزم درپوش آیریس",
  tool: "SolidWorks Motion",
  desc: "مکانیزم دیافراگم‌مانند آیریس مدل‌سازی و متحرک‌سازی شده برای اعتبارسنجی هندسه لینکاژ، تماس و حرکت هم‌زمان تیغه‌ها.",
};
pFa["winch-assembly"] = {
  tag: "نقشه دوبعدی",
  title: "نقشه اسمبلی وینچ",
  tool: "SolidWorks",
  desc: "نقشه اسمبلی دوبعدی آماده تولید یک وینچ صنعتی با BOM کامل، وزن قطعات و یادداشت‌های ساخت.",
  media0:
    "اسمبلی کلی وینچ — سازه دروازه‌ای با پل، ستون‌ها و پایه، همراه BOM و وزن قطعات.",
  media1: "زیراسمبلی پایه وینچ — نمای انفجاری با قطعات شماره‌گذاری‌شده و جدول وزن.",
};
pFa["production-line-project"] = {
  tag: "مدیریت پروژه",
  title: "پروژه خط تولید",
  tool: "MS Project",
  desc: "برنامه‌ریزی، زمان‌بندی و کنترل پیشرفت نصب کامل یک خط تولید شامل WBS، گانت و تراز منابع.",
};
pFa["honda-cub-ev-msp"] = {
  tag: "مدیریت پروژه",
  title: "تبدیل هوندا سوپر کاب C125 به مدل برقی MSP",
  tool: "MS Project",
  desc: "برنامه کامل پروژه برای تبدیل هوندا سوپر کاب C125 به پیشرانه برقی — WBS، زمان‌بندی و ردیابی پیشرفت در MS Project همراه شکست کار و گانت.",
  media0:
    "WBS و برنامه وظایف — ساختار شکست کامل با مدت، وزن، تاریخ شروع/پایان و پیشرفت هر فاز تبدیل EV.",
  media1:
    "نمودار گانت — نمای زمانی وابستگی وظایف، مسیر بحرانی و درصد تکمیل فازها.",
};
pFa["sliding-mode-manipulator"] = {
  tag: "MATLAB",
  title: "کنترل مود لغزشی بازوی رباتیک",
  tool: "MATLAB/Simulink",
  desc: "مدل‌سازی، شبیه‌سازی دینامیکی و کنترل مود لغزشی یک بازوی چندلینکی در MATLAB/Simulink. شامل تحلیل چابکی و دست‌کاری‌پذیری فضای کاری، دیاگرام دینامیک مستقیم/معکوس، معماری کنترلر و شبیه‌سازی سه‌بعدی ردیابی مسیر.",
  media0: "تحلیل فضای کاری — شاخص‌های چابکی و دست‌کاری‌پذیری در فضای قابل دسترس بازو.",
  media1: "مدل سیمولینک — دینامیک چندجسمی کامل با بلوک‌های مفصل، مولد مسیر و خروجی حسگر.",
  media2: "معماری کنترلر — حلقه‌های مود لغزشی و دینامیک معکوس به‌صورت زیرسیستم‌های قابل استفاده مجدد.",
  media3: "شبیه‌سازی سه‌بعدی — اجرای مسیر برنامه‌ریزی‌شده تحت کنترل مود لغزشی.",
  media4: "پاسخ حلقه‌بسته — عملکرد ردیابی و رفتار چتر کنترلر مود لغزشی.",
};
pFa["robot-path-planning"] = {
  tag: "Python",
  title: "برنامه‌ریزی مسیر ربات",
  tool: "Python",
  desc: "برنامه‌ریزی مسیر و اجتناب از مانع برای ربات متحرک با Python همراه نمایش مسیرها و نقشه‌های هزینه.",
};
pFa["a-b-nonstop-cycle"] = {
  tag: "PLC",
  title: "چرخه پیوسته A+A−B+B−",
  tool: "PLC Ladder Logic",
  desc: "توالی پنوماتیک پیوسته A+A−B+B− پیاده‌سازی‌شده در منطق نردبانی PLC با اینترلاک استارت/استاپ و شمارنده سیکل.",
};
pFa["hydraulic-circuit-sim"] = {
  tag: "هیدرولیک",
  title: "شبیه‌سازی مدار هیدرولیک",
  tool: "FluidSIM",
  desc: "مدار هیدرولیک طراحی و شبیه‌سازی‌شده در FluidSIM با نمایش توالی عملگر، تنظیم فشار و کنترل جریان.",
};
pFa["pneumatic-sequence-control"] = {
  tag: "پنوماتیک",
  title: "کنترل توالی پنوماتیک",
  tool: "FluidSIM",
  desc: "کنترلر توالی پنوماتیک اعتبارسنجی‌شده در FluidSIM با حسگرها و لیمیت‌سوییچ‌ها برای حرکت هم‌زمان چند سیلندر.",
};

Object.assign(fa.featured, {
  imageAlt: "سیستم کانوایر",
  eyebrow: "مدل‌سازی سه‌بعدی",
  title: "Legbelt — سیستم هوشمند تله ساس تخت",
  body: "طراحی سیستم تله ساس یکپارچه با مبلمان با تمرکز بر حفاظت نامحسوس، زیبایی مدرن و یکپارچگی کاربرپسند. توسعه سازه مکانیکی، طراحی صنعتی و بصری‌سازی محصول با توجه به قابلیت ساخت و پایداری سازه‌ای.",
  bullet0: "مدل‌سازی سه‌بعدی در SolidWorks",
  bullet1: "تحلیل FEA برای اعتبارسنجی سازه‌ای",
  bullet2: "مطالعه حرکت و بهینه‌سازی",
  bullet3: "نقشه‌های ساخت جزئی",
  tag0: "SolidWorks",
  tag1: "شبیه‌سازی",
  tag2: "FEA",
  tag3: "طراحی",
});

Object.assign(fa.toolWall, {
  eyebrowBrand: "دیوار ابزار مهندسی",
  eyebrowSkills: "/ مهارت‌ها",
  title: "جعبه ابزار مهندسی من.",
  subtitle: "ابزارهایی که برای طراحی سیستم‌های مکانیکی، ساخت ربات و آموزش عامل‌های هوشمند به‌کار می‌برم.",
  reset: "بازنشانی ابزارها",
  quote: "دقت در ابزار و در ایده، تأثیر مهندسی می‌سازد.",
});
fa.toolWall.domains = {
  mechanical: "مهندسی مکانیک",
  robotics: "رباتیک و اتوماسیون",
  ai: "هوش مصنوعی و سیستم‌های هوشمند",
};
fa.toolWall.panel = {
  detected: "ابزار شناسایی شد",
  category: "دسته",
  usedFor: "کاربرد",
  connected: "پروژه‌های مرتبط",
  noProjects: "هنوز پروژه مرتبطی نیست — به‌زودی.",
  explore: "مشاهده پروژه‌های مرتبط",
  close: "بستن پنل بازرسی",
};
fa.toolWall.aria = {
  inspect: "{name} — {tag}. انتخاب شد. برای بازرسی فشار دهید.",
  move: "جابه‌جایی {alt}",
};
fa.toolWall.pegs = {
  micrometer: "میکرومتر",
  wrench: "آچار",
  caliper: "کولیس دیجیتال",
  bearing: "بلبرینگ",
  pcb: "برد میکروکنترلر",
  sbc: "کامپیوتر تک‌بردی",
  ultrasonic: "حسگر فراصوت",
  chip: "چیپ شتاب‌دهنده AI",
  gear: "چرخ‌دنده",
  relay: "ماژول رله",
};

const toolFaNames = {
  solidworks: ["SolidWorks", "CAD / CAE", "طراحی مکانیکی", "مدل‌سازی اسمبلی", "مطالعه حرکت"],
  catia: ["CATIA", "CAD / SURFACING", "مدل‌سازی سطحی", "طراحی اسمبلی", "ساختار محصول"],
  "ansys-fluent": ["ANSYS Fluent", "CFD SIMULATION", "شبیه‌سازی جریان سیال", "تحلیل حرارتی", "مدل‌سازی CFD"],
  cad: ["AutoCAD", "DRAFTING / GD&T", "نقشه‌های فنی دوبعدی", "GD&T", "مستندات ساخت"],
  matlab: ["MATLAB", "SIMULATION / CONTROL", "مدل‌سازی دینامیکی", "طراحی کنترلر", "شبیه‌سازی سیمولینک"],
  "hydraulics-pneumatics": ["هیدرولیک و پنوماتیک", "FLUID POWER", "طراحی مدار", "سایزینگ عملگر", "عیب‌یابی سیستم"],
  "mechanical-design": ["طراحی مکانیکی", "DESIGN FUNDAMENTALS", "عناصر ماشین", "تلرانس‌گذاری", "DFM / DFA"],
  "ms-project": ["Microsoft Project", "SCHEDULING / GANTT", "زمان‌بندی پروژه", "تخصیص منابع", "ردیابی گانت"],
  "project-planning": ["برنامه‌ریزی پروژه", "MANAGEMENT", "برنامه‌ریزی مایلستون", "ردیابی ریسک", "هماهنگی تیم"],
  "simulation-analysis": ["شبیه‌سازی و تحلیل", "CAE WORKFLOWS", "FEA", "شبیه‌سازی سطح سیستم", "اعتبارسنجی نتایج"],
  ros2: ["ROS 2", "ROBOTICS MIDDLEWARE", "ارتباط نودها", "یکپارچه‌سازی حسگر", "کنترل ربات"],
  gazebo: ["Gazebo", "PHYSICS SIMULATION", "شبیه‌سازی ربات", "مدل‌سازی حسگر", "آزمون محیط"],
  "isaac-lab": ["Isaac Lab", "SIM-TO-REAL / RL", "آموزش موازی RL", "یادگیری ربات", "انتقال Sim-to-Real"],
  "siemens-logo": ["Siemens Logo PLC", "INDUSTRIAL CONTROL", "منطق نردبانی", "سیم‌کشی I/O", "پنل اتوماسیون"],
  arduino: ["Arduino", "EMBEDDED / PROTOTYPING", "نمونه‌سازی حسگر", "فریمور میکروکنترلر", "آزمون سریع"],
  "intelligent-automation": ["اتوماسیون هوشمند", "SMART SYSTEMS", "اتوماسیون فرایند", "فیوژن حسگر", "کنترل خودمختار"],
  python: ["Python", "PROGRAMMING", "اسکریپت‌نویسی رباتیک", "داده و بصری‌سازی", "اتوماسیون"],
  rl: ["یادگیری تقویتی", "MACHINE LEARNING", "شکل‌دهی پاداش", "بهینه‌سازی سیاست", "آموزش عامل"],
  llm: ["LLM", "LANGUAGE MODELS", "طراحی پاداش", "عامل‌های استدلالی", "اتوماسیون Tool-Use"],
};
for (const [id, [name, categoryTag, u0, u1, u2]] of Object.entries(toolFaNames)) {
  fa.toolWall.tools[id] = { name, categoryTag, u0, u1, u2 };
}

Object.assign(fa.experience, {
  eyebrow: "سوابق کاری",
  title: "خط زمانی صنعتی",
  subtitleDesktop: "اسکرول کنید و مسیر را دنبال کنید — هر ایستگاه یک توقف در مسیر مهندسی است.",
  subtitleMobile: "هر توقف در مسیر مهندسی — از اولین نقش صنعتی تا R&D فعلی.",
  currentBadge: "فعلی",
  logoPlaceholder: "جایگزین با لوگوی سوپیشی",
});
fa.experience.items = {
  mobtakeran: {
    co: "مکاترونیک مبتکران آرگ",
    role: "طراح صنعتی",
    year: "۱۴۰۰",
    b0: "پرینترهای آزمایشگاهی",
    b1: "سیستم‌های فرز دندان‌پزشکی",
    b2: "اسکنرهای دندان‌پزشکی",
    b3: "توسعه محصول مکانیکی",
  },
  isdg: {
    co: "گروه توسعه فولاد ایرانیان",
    role: "طراح و مهندس مکانیک",
    year: "۱۴۰۱",
    b0: "تجهیزات خط تولید فولاد",
    b1: "طراحی ماشین‌آلات صنعتی",
    b2: "نظارت بر ساخت",
    b3: "زمان‌بندی و کنترل پروژه",
  },
  nyop: {
    co: "NYOP — هلند",
    role: "طراح محصول",
    year: "۱۴۰۳",
    b0: "محصولات خانه هوشمند",
    b1: "تله حشره هوشمند",
    b2: "پایش کیفیت هوا",
    b3: "توسعه نمونه و بهینه‌سازی CAD",
  },
  supishi: {
    co: "شرکت سوپیشی",
    role: "مهندس مکاترونیک",
    year: "اکنون",
    dept: "تحقیق و توسعه (R&D)",
    b0: "سیستم‌های کانوایر سفارشی برای خطوط تولید",
    b1: "طراحی مکانیزم لیبل‌زن",
    b2: "یکپارچه‌سازی خط پرینتر جوهرافشان Domino",
    b3: "تجهیزات صنعتی سفارشی و قطعات ماشین",
    b4: "سیستم‌های مکاترونیک: مکانیک، الکترونیک، کنترل",
  },
};

Object.assign(fa.research, {
  eyebrow: "پژوهش",
  title: "پژوهش و هوش مصنوعی",
});
fa.research.items = {
  rl: { t: "یادگیری تقویتی", d: "شکل‌دهی پاداش و بهینه‌سازی سیاست" },
  autonomous: { t: "سیستم‌های خودمختار", d: "رباتیک متحرک و ناوبری" },
  llmReward: { t: "شکل‌دهی پاداش مبتنی بر LLM", d: "مدل‌های زبانی راهنمای عامل‌های RL" },
  sensorFusion: { t: "فیوژن حسگر", d: "ادراک چندحالته و تخمین" },
  intelligentControl: { t: "کنترل هوشمند", d: "MPC، کنترل تطبیقی و مقاوم" },
  roboticsSafety: { t: "ایمنی رباتیک", d: "سیستم‌های یادگیری مقید" },
};

Object.assign(fa.certificates, {
  eyebrow: "مدارک",
  title: "گواهینامه‌ها",
  subtitle: "دوره‌ها و مدارک حرفه‌ای در مهندسی، شبیه‌سازی و سیستم‌های هوشمند.",
  hint: "برای مرور بکشید · اسلاید خودکار",
  view: "مشاهده",
  instructedBy: "مدرس: {name}",
  verify: "اعتبارسنجی گواهینامه",
});
fa.certificates.fields = { issued: "تاریخ صدور", certId: "شناسه گواهینامه", issuer: "صادرکننده" };
fa.certificates.items = {
  "1FB53901": {
    title: "تسلط بر یادگیری ماشین با Python: دوره جامع آنلاین",
    issuer: "فرادرس",
    category: "یادگیری ماشین",
    instructor: "دکتر پژمان اقبالی",
    issued: "۳۱ تیر ۱۴۰۴",
  },
  "05419F53": {
    title: "تسلط بر Microsoft Project 2019: راهنمای موفقیت در مدیریت پروژه",
    issuer: "فرادرس",
    category: "مدیریت پروژه",
    instructor: "مهندس مسعود امینی",
    issued: "۱۸ اسفند ۱۴۰۳",
  },
  "38FA56B2": {
    title: "تسلط بر Python: تکنیک‌های پیشرفته یادگیری تقویتی",
    issuer: "فرادرس",
    category: "یادگیری تقویتی",
    instructor: "دکتر صادق اسکندری",
    issued: "۱۱ آبان ۱۴۰۴",
  },
  "5377F27D": {
    title: "مبانی Git با GitHub و GitLab",
    issuer: "فرادرس",
    category: "کنترل نسخه",
    instructor: "جادی میرمیرانی",
    issued: "۸ خرداد ۱۴۰۵",
  },
  dc4fd977: {
    title: "مقدمه‌ای بر برنامه‌نویسی با Python — CS50",
    issuer: "دانشگاه هاروارد",
    category: "Python",
    instructor: "David J. Malan",
    issued: "۱۴۰۵",
  },
};

Object.assign(fa.contact, {
  eyebrow: "ارتباط",
  title: "در ارتباط باشیم",
  email: "ایمیل",
  linkedin: "لینکدین",
  github: "گیت‌هاب",
  location: "موقعیت",
  emailValue: "a.h.nematkhah@gmail.com",
  linkedinValue: "/in/amirhossein-nematkhah",
  githubValue: "A-Nematkhah",
  locationValue: "تهران، ایران",
});

fa.footer = {
  copyright: "© {year} امیرحسین نعمت‌خواه. تمامی حقوق محفوظ است.",
  source: "سورس در گیت‌هاب",
};

fa.robot.name = "Archi";
fa.robot.noteMeta = "یادداشت {name}";
fa.robot.srIdle = "Archi، ربات راهنمای پورتفولیو";
fa.robot.srActive = "Archi در {label}: {lines}";
fa.robot.stops = {
  home: {
    label: "مقدمه",
    line0: "Archi آنلاین است. واحد تور محلی آماده.",
    line1: "مسئولیتی بابت شور بیش‌ازحد مهندسی نداریم.",
  },
  about: {
    label: "مکاترونیک",
    line0: "مکانیک، الکترونیک و کنترل — در یک شاسی.",
    line1: "معروف به: چرا یک رشته کافی نبود.",
  },
  projects: {
    label: "پروژه‌ها",
    line0: "این‌ها ماکاپ نیستند. حرکت می‌کنند.",
    line1: "گاهی هم عمداً.",
  },
  "skills-mechanical": {
    label: "دیوار ابزار",
    line0: "CAD، CFD و مقدار مشکوکی قهوه.",
    line1: "اگر مدل‌پذیر باشد، مدل می‌شود.",
  },
  "skills-robotics": {
    label: "رباتیک",
    line0: "حسگرها آنلاین. دنیا از پایین اینجا شلوغ به‌نظر می‌رسد.",
    line1: "اول ادراک. درام بعداً.",
  },
  "skills-ai": {
    label: "AI / RL",
    line0: "آموزش یادگیری به ماشین‌ها. نتایج متغیر است.",
    line1: "شکل‌دهی پاداش: ۹۰٪ علم، ۱۰٪ مذاکره.",
  },
  experience: {
    label: "گزارش میدان",
    line0: "کف کارخانه. مهلت‌ها. قیود واقعی.",
    line1: "جایی که اسلایدهای پاورپوینت با فیزیک روبه‌رو می‌شوند.",
  },
  research: {
    label: "پژوهش",
    line0: "فرضیه شناسایی شد. آزمایش در حال بارگذاری…",
    line1: "شکست هم داده است. مخصوصاً نوع گرانش.",
  },
  certificates: {
    label: "مدارک",
    line0: "آموزش کامل شد. مجموعه استیکر در حال رشد.",
    line1: "اثبات اینکه یادگیری ثبت شده، نه فقط ادعا شده.",
  },
  contact: {
    label: "ارتباط",
    line0: "پایان مسیر. پروتکل دست‌دادن آماده.",
    line1: "مسئله‌ای دارید که ارزش ساختن داشته باشد؟",
  },
};

fa.lidar = {
  idle: "در حال اسکن...",
  projectDetected: "پروژه شناسایی شد",
  projectFallback: "پروژه",
  objectLine: "شیء: {label}",
  distanceLine: "فاصله: {n} m",
  statusDetected: "وضعیت: شناسایی‌شده",
  unknown: "نامشخص",
};

fa.notFound = {
  code: "۴۰۴",
  title: "صفحه پیدا نشد",
  body: "صفحه‌ای که دنبال آن هستید وجود ندارد یا جابه‌جا شده است.",
  goHome: "بازگشت به خانه",
};
fa.error = {
  title: "صفحه بارگذاری نشد",
  body: "مشکلی از سمت ما پیش آمد. می‌توانید تازه کنید یا به خانه برگردید.",
  retry: "تلاش مجدد",
  goHome: "خانه",
};

function toTs(name, obj) {
  const json = JSON.stringify(obj, null, 2);
  if (name === "en") {
    return `export const en = ${json} as const;\n\nexport type Messages = typeof en;\n`;
  }
  return `import type { Messages } from "./en";\n\nexport const fa = ${json} as unknown as Messages;\n`;
}

writeFileSync(join(outDir, "en.ts"), toTs("en", en), "utf8");
writeFileSync(join(outDir, "fa.ts"), toTs("fa", fa), "utf8");
console.log("Wrote en.ts and fa.ts");
