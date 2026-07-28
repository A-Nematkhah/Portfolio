import { GraduationCap } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-20">
      <div data-lidar-object="ENGINEER PROFILE" className="grid items-start gap-10 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">About</p>
          <h2 className="mt-3 text-4xl font-bold md:text-5xl">Engineering meets intelligent design.</h2>
          <p className="mt-6 text-sm text-muted-foreground">
            Mechatronics engineer with industrial experience in mechanical design, production systems,
            project management, industrial equipment development, and intelligent automation. Experienced
            in CAD design, simulation, industrial engineering workflows, and modern AI-based robotics
            research.
          </p>
        </div>
        <div className="space-y-4">
          {[
            { icon: GraduationCap, t: "B.Sc. Mechanical Engineering", d: "Sahand University of Technology" },
            {
              icon: GraduationCap,
              t: "M.Sc. Mechatronics Engineering",
              d: "Amirkabir University of Technology — Ongoing",
            },
          ].map((e) => (
            <div key={e.t} className="flex gap-4 rounded-xl glass p-5">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/15 text-primary">
                <e.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{e.t}</p>
                <p className="text-xs text-muted-foreground">{e.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
