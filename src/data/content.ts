import { Bot, Cpu, Sparkles, Layers, Activity, Shield, type LucideIcon } from "lucide-react";
import { pub } from "@/lib/pub";

export const NAV_ITEMS = [
  { id: "home", labelKey: "nav.home" },
  { id: "about", labelKey: "nav.about" },
  { id: "skills", labelKey: "nav.skills" },
  { id: "projects", labelKey: "nav.projects" },
  { id: "experience", labelKey: "nav.experience" },
  { id: "certificates", labelKey: "nav.certificates" },
  { id: "contact", labelKey: "nav.contact" },
] as const;

export type ExperienceId = "mobtakeran" | "isdg" | "nyop" | "supishi";

export type ExperienceItem = {
  id: ExperienceId;
  /** Fallback English (also used as seed / SEO); UI prefers i18n */
  co: string;
  role: string;
  year: string;
  bullets: readonly string[];
  dept?: string;
  current?: boolean;
  tags?: readonly string[];
  /** Optional logo asset path; omit to show a replaceable placeholder */
  logo?: string;
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "mobtakeran",
    co: "Mechatronic Mobtakeran Arg",
    role: "Industrial Designer",
    year: "2021",
    bullets: [
      "Laboratory printers",
      "Dental milling systems",
      "Dental scanners",
      "Mechanical product development",
    ],
  },
  {
    id: "isdg",
    co: "Iranian Steel Development Group",
    role: "Mechanical Designer & Engineer",
    year: "2022",
    bullets: [
      "Steel production line equipment",
      "Industrial machinery design",
      "Manufacturing supervision",
      "Project scheduling and control",
    ],
  },
  {
    id: "nyop",
    co: "NYOP — Netherlands",
    role: "Product Designer",
    year: "2024",
    bullets: [
      "Smart home products",
      "Smart insect trap",
      "Air quality monitoring",
      "Prototype development & CAD optimization",
    ],
  },
  {
    id: "supishi",
    co: "Supishi Co",
    role: "Mechatronics Engineer",
    year: "Present",
    dept: "Research & Development (R&D)",
    current: true,
    bullets: [
      "Custom conveyor systems for production lines",
      "Label applicator mechanism design",
      "Domino inkjet printer line integration",
      "Custom industrial equipment and machine components",
      "Mechatronic systems: mechanics, electronics, control",
    ],
  },
];

export type ResearchId =
  | "rl"
  | "autonomous"
  | "llmReward"
  | "sensorFusion"
  | "intelligentControl"
  | "roboticsSafety";

export const RESEARCH: { id: ResearchId; icon: LucideIcon }[] = [
  { id: "rl", icon: Bot },
  { id: "autonomous", icon: Cpu },
  { id: "llmReward", icon: Sparkles },
  { id: "sensorFusion", icon: Layers },
  { id: "intelligentControl", icon: Activity },
  { id: "roboticsSafety", icon: Shield },
];

export type Certificate = {
  src: string;
  width: number;
  height: number;
  /** i18n key suffix under certificates.items.* */
  i18nKey: string;
  title: string;
  issuer: string;
  category: string;
  instructor: string;
  issued: string;
  certId: string;
  verifyUrl: string;
};

export const CERTIFICATES: Certificate[] = [
  {
    src: pub("/pictures/cert-1.png"),
    width: 1218,
    height: 858,
    i18nKey: "1FB53901",
    title: "Mastering Machine Learning with Python: A Comprehensive Online Course",
    issuer: "FaraDars",
    category: "Machine Learning",
    instructor: "Dr. Pejman Eqbali",
    issued: "July 22, 2025",
    certId: "1FB53901",
    verifyUrl: "https://faradars.org/verify/1FB53901",
  },
  {
    src: pub("/pictures/cert-2.png"),
    width: 1216,
    height: 858,
    i18nKey: "05419F53",
    title: "Mastering Microsoft Project 2019: Your Ultimate Guide to Project Management Success",
    issuer: "FaraDars",
    category: "Project Management",
    instructor: "Eng. Masoud Amini",
    issued: "March 8, 2025",
    certId: "05419F53",
    verifyUrl: "https://faradars.org/verify/05419F53",
  },
  {
    src: pub("/pictures/cert-3.png"),
    width: 1140,
    height: 805,
    i18nKey: "38FA56B2",
    title: "Mastering Python: Advanced Techniques for Reinforcement Learning",
    issuer: "FaraDars",
    category: "Reinforcement Learning",
    instructor: "Dr. Sadegh Eskandari",
    issued: "November 02, 2025",
    certId: "38FA56B2",
    verifyUrl: "https://faradars.org/verify/38FA56B2",
  },
  {
    src: pub("/pictures/cert-4.png"),
    width: 1024,
    height: 715,
    i18nKey: "5377F27D",
    title: "Fundamentals of Git with GitHub and GitLab",
    issuer: "FaraDars",
    category: "Version Control",
    instructor: "Jadi Mirmirani",
    issued: "May 29, 2026",
    certId: "5377F27D",
    verifyUrl: "https://faradars.org/verify/5377F27D",
  },
  {
    src: pub("/pictures/cert-5.png"),
    width: 1024,
    height: 724,
    i18nKey: "dc4fd977",
    title: "CS50's Introduction to Programming with Python",
    issuer: "Harvard University",
    category: "Python",
    instructor: "David J. Malan",
    issued: "2026",
    certId: "dc4fd977-1147-415a-8811-136975cc588c",
    verifyUrl: "https://cs50.harvard.edu/certificates/dc4fd977-1147-415a-8811-136975cc588c",
  },
];
