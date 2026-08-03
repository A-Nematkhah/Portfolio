import fs from "node:fs";

const p = "src/components/portfolio/PortfolioPage.tsx";
let s = fs.readFileSync(p, "utf8");

if (!s.includes("useEffect")) {
  s = s.replace(
    "import { useMemo, useState } from \"react\";",
    "import { useEffect, useMemo, useState } from \"react\";",
  );
}

s = s.replace(
  /const \[fadeTick, setFadeTick\] = useState\(0\);\s*useEffect\(\(\) => \{\s*setFadeTick\(\(n\) => n \+ 1\);\s*\}, \[locale\]\);/,
  `const [fadeClass, setFadeClass] = useState("");

  useEffect(() => {
    setFadeClass("i18n-fade");
    const id = window.setTimeout(() => setFadeClass(""), 320);
    return () => window.clearTimeout(id);
  }, [locale]);`,
);

s = s.replace(
  'key={fadeTick} className="relative mx-auto max-w-7xl px-6 pt-[50px] i18n-fade"',
  "className={`relative mx-auto max-w-7xl px-6 pt-[50px] ${fadeClass}`}",
);

fs.writeFileSync(p, s);
console.log("patched", s.includes("fadeClass"), s.includes("fadeTick"));
