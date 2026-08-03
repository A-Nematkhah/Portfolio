import { m } from "framer-motion";
import { RESEARCH } from "@/data/content";
import { useT } from "@/i18n";

export function Research() {
  const t = useT();

  return (
    <section id="research" className="py-20">
      <div data-lidar-object="RESEARCH" className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          {t("research.eyebrow")}
        </p>
        <h2 className="mt-3 text-4xl font-bold md:text-5xl">{t("research.title")}</h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {RESEARCH.map((r, i) => {
          const title = t(`research.items.${r.id}.t`);
          const desc = t(`research.items.${r.id}.d`);
          return (
            <m.div
              key={r.id}
              data-lidar-object={title}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="surface-card rounded-xl p-6"
            >
              <r.icon className="icon-chip h-6 w-6 text-primary" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
            </m.div>
          );
        })}
      </div>
    </section>
  );
}
