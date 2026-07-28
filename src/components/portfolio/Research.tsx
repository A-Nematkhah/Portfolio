import { m } from "framer-motion";
import { RESEARCH } from "@/data/content";

export function Research() {
  return (
    <section id="research" className="py-20">
      <div data-lidar-object="RESEARCH" className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Research</p>
        <h2 className="mt-3 text-4xl font-bold md:text-5xl">Research &amp; AI</h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {RESEARCH.map((r, i) => (
          <m.div
            key={r.t}
            data-lidar-object={r.t}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl glass p-6 hover:border-primary/50 transition"
          >
            <r.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-semibold">{r.t}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{r.d}</p>
          </m.div>
        ))}
      </div>
    </section>
  );
}
