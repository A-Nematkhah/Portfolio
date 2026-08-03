import { GraduationCap } from "lucide-react";
import { useT } from "@/i18n";

export function About() {
  const t = useT();

  const education = [
    {
      icon: GraduationCap,
      title: t("about.eduBscTitle"),
      school: t("about.eduBscSchool"),
    },
    {
      icon: GraduationCap,
      title: t("about.eduMscTitle"),
      school: t("about.eduMscSchool"),
    },
  ];

  return (
    <section id="about" className="py-20">
      <div data-lidar-object="ENGINEER PROFILE" className="grid items-start gap-10 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {t("about.eyebrow")}
          </p>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">{t("about.title")}</h2>
          <p className="mt-6 text-sm text-muted-foreground">{t("about.body")}</p>
        </div>
        <div className="space-y-4">
          {education.map((e) => (
            <div key={e.title} className="surface-card flex gap-4 rounded-xl p-5">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/15 text-primary">
                <e.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{e.title}</p>
                <p className="text-xs text-muted-foreground">{e.school}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
