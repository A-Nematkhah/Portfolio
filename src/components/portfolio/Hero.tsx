import { m } from "framer-motion";
import { ArrowRight, Send, Github, Linkedin, Briefcase, Award, Wrench } from "lucide-react";
import heroMachine from "@/assets/hero-machine-v2.webp";

export function Hero() {
  return (
    <section
      id="home"
      className="relative grid items-center gap-10 py-12 md:grid-cols-2 md:py-20 pt-0"
    >
      <m.div
        data-lidar-object="OVERVIEW"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          Mechatronics Engineer
        </p>
        <h1 className="text-5xl font-bold leading-[1.05] md:text-7xl">
          Amirhossein
          <br />
          <span className="text-gradient-violet">Nematkhah</span>
        </h1>
        <p className="mt-6 max-w-md text-base text-muted-foreground">
          Mechanical Design • Industrial Systems • Project Control
          <br />
          AI &amp; Automation • Simulation &amp; Control
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#projects" className="btn-primary">
            View My Work <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#contact" className="btn-secondary">
            Contact Me <Send className="h-4 w-4" />
          </a>
        </div>
        <div className="mt-8 flex gap-3">
          {[
            { Icon: Github, href: "https://github.com/A-Nematkhah" },
            { Icon: Linkedin, href: "https://www.linkedin.com/in/amirhossein-nematkhah" },
            { Icon: Send, href: "mailto:a.h.nematkhah@gmail.com" },
          ].map(({ Icon, href }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noreferrer"
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
        <m.img
          src={heroMachine}
          alt="Mechatronics 3D engine wireframe"
          width={1024}
          height={1024}
          fetchPriority="high"
          decoding="async"
          className="relative z-10 mx-auto w-full max-w-xl drop-shadow-[0_24px_50px_rgba(0,0,0,0.45)] dark:drop-shadow-[0_28px_60px_rgba(0,0,0,0.65)]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10 mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: Briefcase, n: "12+", l: "Projects Completed" },
            { icon: Award, n: "3+", l: "Years of Experience" },
            { icon: Wrench, n: "15+", l: "Technologies" },
          ].map((s) => (
            <div key={s.l} className="surface-card flex items-center gap-3 rounded-xl p-4">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold leading-none">{s.n}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{s.l}</p>
              </div>
            </div>
          ))}
        </div>
      </m.div>
    </section>
  );
}
