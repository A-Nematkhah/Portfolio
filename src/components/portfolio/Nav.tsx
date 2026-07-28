import { useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { NAV } from "@/data/content";
import { pub } from "@/lib/pub";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header id="top" className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto mt-4 max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between rounded-xl glass px-5">
          <a href="#top" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/15 text-primary font-bold">
              <span className="font-display">AN</span>
            </div>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n, i) => (
              <a
                key={n}
                href={`#${n.toLowerCase()}`}
                className={`relative text-sm transition-colors ${i === 0 ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {n}
                {i === 0 && <span className="absolute -bottom-1 left-0 h-px w-full bg-primary" />}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={pub("/cv.pdf")}
              download="Amirhossein-Nematkhah-CV.pdf"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-4 py-2 text-sm font-medium hover:border-primary/50 transition-colors"
            >
              Download CV <Download className="h-4 w-4" />
            </a>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-lg border border-border md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="mt-2 flex flex-col gap-1 rounded-xl glass p-3 md:hidden">
            {NAV.map((n) => (
              <a
                key={n}
                href={`#${n.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
              >
                {n}
              </a>
            ))}
            <a
              href={pub("/cv.pdf")}
              download="Amirhossein-Nematkhah-CV.pdf"
              onClick={() => setOpen(false)}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-sm font-medium"
            >
              Download CV <Download className="h-4 w-4" />
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
