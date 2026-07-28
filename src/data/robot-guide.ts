/**
 * Robot Guide stops — edit messages here without touching the component.
 * `selector` must match an element id present in the portfolio page.
 */
export type RobotGuideStop = {
  id: string;
  /** CSS selector for the section/marker to observe */
  selector: string;
  /** Short uppercase label shown in the note header */
  label: string;
  /** Note index shown as ARCHI NOTE // NN */
  code: string;
  /** First-person lines from the robot */
  lines: string[];
};

export const ROBOT_GUIDE_STOPS: RobotGuideStop[] = [
  {
    id: "home",
    selector: "#home",
    label: "INTRO",
    code: "01",
    lines: [
      "Archi online. Local tour unit ready.",
      "No liability for excessive engineering enthusiasm.",
    ],
  },
  {
    id: "about",
    selector: "#about",
    label: "MECHATRONICS",
    code: "02",
    lines: [
      "Mechanics, electronics, and control — in one chassis.",
      "Also known as: why one major was never enough.",
    ],
  },
  {
    id: "projects",
    selector: "#projects",
    label: "PROJECTS",
    code: "03",
    lines: [
      "These aren't mockups. They move.",
      "Sometimes on purpose.",
    ],
  },
  {
    id: "skills-mechanical",
    selector: "#skills-mechanical",
    label: "TOOL WALL",
    code: "04",
    lines: [
      "CAD, CFD, and a suspicious amount of coffee.",
      "If it can be modeled, it will be modeled.",
    ],
  },
  {
    id: "skills-robotics",
    selector: "#skills-robotics",
    label: "ROBOTICS",
    code: "05",
    lines: [
      "Sensors online. World looks noisy from down here.",
      "Perception first. Drama later.",
    ],
  },
  {
    id: "skills-ai",
    selector: "#skills-ai",
    label: "AI / RL",
    code: "06",
    lines: [
      "Teaching machines to learn. Results may vary.",
      "Reward shaping: 90% science, 10% negotiation.",
    ],
  },
  {
    id: "experience",
    selector: "#experience",
    label: "FIELD LOG",
    code: "07",
    lines: [
      "Production floors. Deadlines. Real constraints.",
      "Where PowerPoint slides go to meet physics.",
    ],
  },
  {
    id: "research",
    selector: "#research",
    label: "RESEARCH",
    code: "08",
    lines: [
      "Hypothesis detected. Experiment loading…",
      "Failure is data. Especially the expensive kind.",
    ],
  },
  {
    id: "certificates",
    selector: "#certificates",
    label: "CREDENTIALS",
    code: "09",
    lines: [
      "Training complete. Sticker collection growing.",
      "Proof that learning was logged, not just claimed.",
    ],
  },
  {
    id: "contact",
    selector: "#contact",
    label: "CONTACT",
    code: "10",
    lines: [
      "End of route. Handshake protocol ready.",
      "Got a problem worth building for?",
    ],
  },
];

/** How long the note stays open after the user stops scrolling (ms). */
export const ROBOT_NOTE_DURATION_MS = 9000;

/** Brief pause before the note unfolds (ms). */
export const ROBOT_ARRIVAL_PAUSE_MS = 280;

/** Display name for the guide robot. */
export const ROBOT_GUIDE_NAME = "Archi";
