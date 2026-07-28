/**
 * Generate a printable CV PDF into public/cv.pdf
 * Run: node scripts/generate-cv.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "public", "cv.pdf");

function escapePdf(text) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdf(lines) {
  // Simple single-page PDF with Helvetica text
  const contentLines = [];
  let y = 800;
  for (const line of lines) {
    const { text, size = 11, bold = false } = typeof line === "string" ? { text: line } : line;
    const font = bold ? "F2" : "F1";
    contentLines.push(`BT /${font} ${size} Tf 50 ${y} Td (${escapePdf(text)}) Tj ET`);
    y -= size + (bold && size >= 16 ? 10 : 6);
    if (y < 50) break;
  }
  const stream = contentLines.join("\n");
  const streamLen = Buffer.byteLength(stream, "utf8");

  const objects = [];
  objects.push("1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n");
  objects.push("2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n");
  objects.push(
    "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>endobj\n",
  );
  objects.push(`4 0 obj<< /Length ${streamLen} >>stream\n${stream}\nendstream\nendobj\n`);
  objects.push("5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj\n");
  objects.push("6 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>endobj\n");

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += obj;
  }
  const xrefPos = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  return Buffer.from(pdf, "utf8");
}

const lines = [
  { text: "Amirhossein Nematkhah", size: 22, bold: true },
  { text: "Mechatronics Engineer", size: 13, bold: true },
  { text: "Tehran, Iran  |  a.h.nematkhah@gmail.com", size: 10 },
  { text: "linkedin.com/in/amirhossein-nematkhah  |  github.com/A-Nematkhah", size: 10 },
  { text: " ", size: 8 },
  { text: "PROFILE", size: 12, bold: true },
  {
    text: "Mechatronics engineer with industrial experience in mechanical design,",
    size: 10,
  },
  {
    text: "production systems, project management, and intelligent automation.",
    size: 10,
  },
  { text: "CAD, simulation, industrial workflows, and AI-based robotics research.", size: 10 },
  { text: " ", size: 8 },
  { text: "EDUCATION", size: 12, bold: true },
  { text: "M.Sc. Mechatronics Engineering — Amirkabir University of Technology (Ongoing)", size: 10 },
  { text: "B.Sc. Mechanical Engineering — Sahand University of Technology", size: 10 },
  { text: " ", size: 8 },
  { text: "EXPERIENCE", size: 12, bold: true },
  { text: "Industrial Designer — Mechatronic Mobtakeran Arg", size: 10, bold: true },
  { text: "Laboratory printers, dental milling systems, scanners, product development", size: 10 },
  { text: "Mechanical Designer & Engineer — Iranian Steel Development Group", size: 10, bold: true },
  { text: "Steel line equipment, industrial machinery, manufacturing, scheduling", size: 10 },
  { text: "Product Designer — NYOP (Netherlands)", size: 10, bold: true },
  { text: "Smart home products, insect trap, air quality monitoring, CAD optimization", size: 10 },
  { text: " ", size: 8 },
  { text: "SKILLS", size: 12, bold: true },
  { text: "SolidWorks, CATIA, AutoCAD, GD&T, FEA, Motion Study", size: 10 },
  { text: "MATLAB/Simulink, Python, PLC Ladder, FluidSIM, MS Project, Primavera", size: 10 },
  { text: "Robotics, RL, Sensor Fusion, Intelligent Control", size: 10 },
  { text: " ", size: 8 },
  { text: "SELECTED PROJECTS", size: 12, bold: true },
  { text: "Housingless Rolling Stand — SolidWorks industrial mill equipment", size: 10 },
  { text: "Sliding Mode Control of Robotic Manipulator — MATLAB/Simulink", size: 10 },
  { text: "Honda Super Cub C125 EV Conversion Plan — MS Project", size: 10 },
  { text: "Legbelt Smart Bed Bug Trap — Product design & FEA", size: 10 },
  { text: " ", size: 8 },
  { text: "CERTIFICATES", size: 12, bold: true },
  { text: "Machine Learning with Python — FaraDars (1FB53901)", size: 10 },
  { text: "Microsoft Project 2019 — FaraDars (05419F53)", size: 10 },
  { text: "Advanced RL with Python — FaraDars (38FA56B2)", size: 10 },
];

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, buildPdf(lines));
console.log(`Wrote ${outPath}`);
