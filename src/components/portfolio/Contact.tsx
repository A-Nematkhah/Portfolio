import { Mail, Linkedin, Github, MapPin } from "lucide-react";

export function Contact() {
  const items = [
    {
      icon: Mail,
      t: "Email",
      v: "a.h.nematkhah@gmail.com",
      href: "mailto:a.h.nematkhah@gmail.com",
    },
    {
      icon: Linkedin,
      t: "LinkedIn",
      v: "/in/amirhossein-nematkhah",
      href: "https://www.linkedin.com/in/amirhossein-nematkhah",
    },
    { icon: Github, t: "GitHub", v: "A-Nematkhah", href: "https://github.com/A-Nematkhah" },
    { icon: MapPin, t: "Location", v: "Tehran, Iran", href: "#" },
  ];

  return (
    <section id="contact" className="py-20">
      <div data-lidar-object="CONTACT NODE" className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Contact</p>
        <h2 className="mt-3 text-4xl font-bold md:text-5xl">Let's Connect</h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((i) => (
          <a
            key={i.t}
            data-lidar-object={i.t}
            href={i.href}
            target={i.href.startsWith("http") ? "_blank" : undefined}
            rel={i.href.startsWith("http") ? "noreferrer" : undefined}
            className="group surface-card rounded-xl p-6 hover:glow-primary"
          >
            <i.icon className="h-5 w-5 text-primary" />
            <p className="mt-4 text-xs text-muted-foreground">{i.t}</p>
            <p className="mt-1 text-sm font-medium group-hover:text-primary transition">{i.v}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
