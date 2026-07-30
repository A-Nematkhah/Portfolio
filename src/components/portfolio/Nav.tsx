import { useEffect, useState } from "react";
import { Download, Menu, Moon, Sun, X } from "lucide-react";
import { NAV } from "@/data/content";
import { pub } from "@/lib/pub";
import { useTheme } from "@/components/theme/ThemeProvider";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(NAV[0]?.toLowerCase() ?? "home");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV.map((n) => n.toLowerCase());
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header id="top" className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto mt-4 max-w-7xl px-6">
        <div
          className={`nav-shell flex items-center justify-between rounded-xl glass px-5 ${
            scrolled ? "is-scrolled h-14" : "h-16"
          }`}
        >
          <a
            href="#home"
            className="flex items-center gap-2"
            onClick={(e) => {
              setOpen(false);
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/15 text-primary font-bold">
              <span className="font-display">AN</span>
            </div>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => {
              const id = n.toLowerCase();
              const isActive = active === id;
              return (
                <a
                  key={n}
                  href={`#${id}`}
                  className={`nav-link text-sm ${
                    isActive ? "is-active" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-secondary/30 text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <a
              href={pub("/cv.pdf")}
              download="Amirhossein-Nematkhah-CV.pdf"
              className="btn-secondary hidden !px-4 !py-2 sm:inline-flex"
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
            {NAV.map((n) => {
              const id = n.toLowerCase();
              return (
                <a
                  key={n}
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    active === id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  {n}
                </a>
              );
            })}
            <a
              href={pub("/cv.pdf")}
              download="Amirhossein-Nematkhah-CV.pdf"
              onClick={() => setOpen(false)}
              className="btn-secondary mt-1 inline-flex justify-center !px-3 !py-2.5"
            >
              Download CV <Download className="h-4 w-4" />
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
