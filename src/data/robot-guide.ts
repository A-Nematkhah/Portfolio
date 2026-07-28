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
  /** Note index shown as ROBOT NOTE // NN */
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
      "Hi! I'm your guide.",
      "I'll show you around Amirhossein's engineering world.",
    ],
  },
  {
    id: "about",
    selector: "#about",
    label: "MECHATRONICS",
    code: "02",
    lines: [
      "Here, mechanical systems meet electronics, sensors, and control.",
    ],
  },
  {
    id: "projects",
    selector: "#projects",
    label: "PROJECTS",
    code: "03",
    lines: [
      "These are the systems we've built.",
      "Let's see what they can do.",
    ],
  },
  {
    id: "skills-mechanical",
    selector: "#skills-mechanical",
    label: "TOOL WALL",
    code: "04",
    lines: [
      "These are my engineering tools.",
      "From CAD and mechanical design to simulation and manufacturing.",
    ],
  },
  {
    id: "skills-robotics",
    selector: "#skills-robotics",
    label: "ROBOTICS",
    code: "05",
    lines: [
      "Now we're entering robotics.",
      "This is where machines start to perceive and interact with the world.",
    ],
  },
  {
    id: "skills-ai",
    selector: "#skills-ai",
    label: "AI / RL",
    code: "06",
    lines: [
      "Here is where I teach machines to learn.",
      "RL, LLMs, reward design, and intelligent behavior.",
    ],
  },
  {
    id: "experience",
    selector: "#experience",
    label: "FIELD LOG",
    code: "07",
    lines: [
      "Industrial deployments and project control.",
      "This is where engineering meets production floors.",
    ],
  },
  {
    id: "research",
    selector: "#research",
    label: "RESEARCH",
    code: "08",
    lines: [
      "This is where the experiments happen.",
      "Questions become hypotheses, and hypotheses become experiments.",
    ],
  },
  {
    id: "certificates",
    selector: "#certificates",
    label: "CREDENTIALS",
    code: "09",
    lines: [
      "Proof of completed missions.",
      "Training logged and verified.",
    ],
  },
  {
    id: "contact",
    selector: "#contact",
    label: "CONTACT",
    code: "10",
    lines: [
      "We've reached the end of the tour.",
      "Want to build something together?",
    ],
  },
];

/** How long the note stays open after arriving at a stop (ms). */
export const ROBOT_NOTE_DURATION_MS = 4200;

/** Brief pause before the note unfolds (ms). */
export const ROBOT_ARRIVAL_PAUSE_MS = 280;
