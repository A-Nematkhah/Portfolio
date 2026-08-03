import { Mail, Linkedin, Github, MapPin } from "lucide-react";
import { useT } from "@/i18n";

export function Contact() {
  const t = useT();

  const items = [
    {
      icon: Mail,
      labelKey: "contact.email" as const,
      valueKey: "contact.emailValue" as const,
      href: "mailto:a.h.nematkhah@gmail.com",
    },
    {
      icon: Linkedin,
      labelKey: "contact.linkedin" as const,
      valueKey: "contact.linkedinValue" as const,
      href: "https://www.linkedin.com/in/amirhossein-nematkhah",
    },
    {
      icon: Github,
      labelKey: "contact.github" as const,
      valueKey: "contact.githubValue" as const,
      href: "https://github.com/A-Nematkhah",
    },
    {
      icon: MapPin,
      labelKey: "contact.location" as const,
      valueKey: "contact.locationValue" as const,
      href: "#",
    },
  ];

  return (
    <section id="contact" className="py-20">
      <div data-lidar-object="CONTACT NODE" className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
          {t("contact.eyebrow")}
        </p>
        <h2 className="mt-3 text-4xl font-bold md:text-5xl">{t("contact.title")}</h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((i) => {
          const label = t(i.labelKey);
          return (
            <a
              key={i.labelKey}
              data-lidar-object={label}
              href={i.href}
              target={i.href.startsWith("http") ? "_blank" : undefined}
              rel={i.href.startsWith("http") ? "noreferrer" : undefined}
              className="group surface-card rounded-xl p-6 hover:glow-primary"
            >
              <i.icon className="h-5 w-5 text-primary" />
              <p className="mt-4 text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 text-sm font-medium group-hover:text-primary transition">
                {t(i.valueKey)}
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
