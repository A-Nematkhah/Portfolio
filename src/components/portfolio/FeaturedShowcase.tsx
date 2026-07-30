import { CheckCircle2 } from "lucide-react";
import { pub } from "@/lib/pub";

export function FeaturedShowcase() {
  return (
    <section className="pb-20">
      <div className="rounded-2xl glass p-6 md:p-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-xl">
              <img
                src={pub("/projects/conveyor-v2.webp")}
                alt="Conveyor system"
                loading="lazy"
                width={1024}
                height={768}
                className="w-full object-cover"
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              3D Modeling
            </p>
            <h3 className="mt-2 text-3xl font-bold">Legbelt — Smart Bed Bug Trap System</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Designed a furniture-integrated bed bug trap system focused on discreet protection,
              modern aesthetics, and user-friendly integration. Developed the mechanical structure,
              industrial design, and product visualization with attention to manufacturability and
              structural stability.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {[
                "3D Modeling in SolidWorks",
                "FEA Analysis for Structural Validation",
                "Motion Study & Optimization",
                "Detailed Manufacturing Drawings",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {b}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {["SolidWorks", "Simulation", "FEA", "Design"].map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-border bg-secondary/40 px-3 py-1 text-xs text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
