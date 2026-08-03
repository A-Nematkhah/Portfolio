import { useEffect, useState, type CSSProperties } from "react";
import { m } from "framer-motion";
import { ArrowRight, Send, Github, Linkedin } from "lucide-react";
import heroPortrait from "@/assets/amirhossein-hero-corrected-portrait.webp";
import { useI18n } from "@/i18n";

export function Hero() {
  const [bootState, setBootState] = useState<"running" | "done">("running");
  const { t, formatNumber } = useI18n();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMdUp = window.matchMedia("(min-width: 768px)").matches;

    if (reduce || !isMdUp) {
      setBootState("done");
      return;
    }

    const doneTimer = window.setTimeout(() => setBootState("done"), 1500);
    return () => window.clearTimeout(doneTimer);
  }, []);

  const showBoot = bootState === "running";
  const portraitReady = bootState === "done";

  const bootLines = [t("hero.boot0"), t("hero.boot1"), t("hero.boot2"), t("hero.boot3")];
  const stats = [
    { n: formatNumber(t("hero.stats.projectsN")), l: t("hero.stats.projectsLabel") },
    { n: formatNumber(t("hero.stats.experienceN")), l: t("hero.stats.experienceLabel") },
    { n: formatNumber(t("hero.stats.technologiesN")), l: t("hero.stats.technologiesLabel") },
  ];

  return (
    <section id="home" className="relative py-12 md:py-20 pt-0">
      <div className="hero-sheet">
        <div className="hero-sheet-ticks" aria-hidden="true" />

        <div className="hero-sheet-inner relative grid items-center gap-10 md:grid-cols-2">
          <m.div
            data-lidar-object="OVERVIEW"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div
              className={`hero-boot-log ${showBoot ? "is-visible" : ""} ${portraitReady ? "is-done" : ""}`}
              aria-hidden="true"
            >
              {bootLines.map((line, i) => (
                <p key={i} className="hero-boot-line" style={{ "--boot-i": i } as CSSProperties}>
                  {line}
                </p>
              ))}
            </div>

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              {t("hero.eyebrow")}
            </p>
            <h1 className="text-[2.35rem] font-bold leading-[1.05] min-[400px]:text-5xl md:text-7xl">
              {t("hero.firstName")}
              <br />
              <span className="text-gradient-violet">{t("hero.lastName")}</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground">
              {t("hero.tagline1")}
              <br />
              {t("hero.tagline2")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#projects" className="btn-primary">
                {t("hero.ctaWork")} <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#contact" className="btn-secondary">
                {t("hero.ctaContact")} <Send className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-8 flex gap-3">
              {[
                { Icon: Github, href: "https://github.com/A-Nematkhah", label: "GitHub" },
                {
                  Icon: Linkedin,
                  href: "https://www.linkedin.com/in/amirhossein-nematkhah",
                  label: "LinkedIn",
                },
                { Icon: Send, href: "mailto:a.h.nematkhah@gmail.com", label: "Email" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="icon-chip grid h-10 w-10 place-items-center rounded-full glass text-foreground hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </m.div>

          <m.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="hero-spotlight" aria-hidden="true" />
            <div className="hero-vignette" aria-hidden="true" />
            <div
              className={`hero-portrait-wrap relative z-10 mx-auto w-full max-w-[14.5rem] sm:max-w-xs md:max-w-md ${
                portraitReady ? "is-ready" : "is-scanning"
              }`}
            >
              <img
                src={heroPortrait}
                alt={t("hero.portraitAlt")}
                width={765}
                height={765}
                fetchPriority="high"
                decoding="async"
                className="hero-portrait relative z-10 mx-auto aspect-square w-full object-cover object-top drop-shadow-[0_24px_50px_rgba(0,0,0,0.45)] dark:drop-shadow-[0_28px_60px_rgba(0,0,0,0.65)]"
              />
              <span className="hero-scanline" aria-hidden="true" />
            </div>

            <div className="hero-spec-strip relative z-10 mt-6" role="list">
              {stats.map((s) => (
                <div key={s.l} className="hero-spec-item" role="listitem">
                  <span className="hero-spec-value">{s.n}</span>
                  <span className="hero-spec-label">{s.l}</span>
                </div>
              ))}
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
