import { CheckCircle2 } from "lucide-react";
import { pub } from "@/lib/pub";
import { useT } from "@/i18n";

export function FeaturedShowcase() {
  const t = useT();
  const bullets = [
    t("featured.bullet0"),
    t("featured.bullet1"),
    t("featured.bullet2"),
    t("featured.bullet3"),
  ];
  const tags = [t("featured.tag0"), t("featured.tag1"), t("featured.tag2"), t("featured.tag3")];

  return (
    <section className="pb-20">
      <div className="rounded-2xl glass p-6 md:p-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-xl">
              <img
                src={pub("/projects/conveyor-v2.webp")}
                alt={t("featured.imageAlt")}
                loading="lazy"
                width={1024}
                height={768}
                className="w-full object-cover"
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              {t("featured.eyebrow")}
            </p>
            <h3 className="mt-2 text-3xl font-bold">{t("featured.title")}</h3>
            <p className="mt-4 text-sm text-muted-foreground">{t("featured.body")}</p>
            <ul className="mt-6 space-y-2 text-sm">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> {b}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
