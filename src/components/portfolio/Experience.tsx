import { m } from "framer-motion";
import { EXPERIENCE } from "@/data/content";

export function Experience() {
  return (
    <section id="experience" className="py-20">
      <div data-lidar-object="CAREER TIMELINE" className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Experience</p>
        <h2 className="mt-3 text-4xl font-bold md:text-5xl">Industrial Timeline</h2>
      </div>
      <div className="relative mt-12 space-y-6">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/30 to-transparent md:left-1/2" />
        {EXPERIENCE.map((e, i) => (
          <m.div
            key={e.co}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative grid gap-6 md:grid-cols-2 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <div className={`pl-12 md:pl-0 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}>
              <div className="absolute left-3 top-2 grid h-3 w-3 place-items-center rounded-full bg-primary glow-primary md:left-1/2 md:-translate-x-1/2" />
              <div data-lidar-object={e.co} className="rounded-xl glass p-6">
                <p className="text-xs text-primary">{e.role}</p>
                <h3 className="mt-1 text-lg font-semibold">{e.co}</h3>
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  {e.bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div />
          </m.div>
        ))}
      </div>
    </section>
  );
}
