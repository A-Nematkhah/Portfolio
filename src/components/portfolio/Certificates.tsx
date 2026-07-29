import { useCallback } from "react";
import { m } from "framer-motion";
import { ArrowRight, X, ExternalLink } from "lucide-react";
import { useState } from "react";
import { CERTIFICATES, type Certificate } from "@/data/content";
import { useModalA11y } from "@/hooks/use-modal-a11y";

export function Certificates() {
  const [active, setActive] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="py-20">
      <div data-lidar-object="CREDENTIALS" className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Credentials</p>
        <h2 className="mt-3 text-4xl font-bold md:text-5xl">Certificates</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          Professional courses and credentials earned across engineering, simulation, and intelligent
          systems.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {CERTIFICATES.map((c, i) => (
          <m.button
            key={c.src}
            data-lidar-object={c.title}
            type="button"
            onClick={() => setActive(c)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="group relative block w-full overflow-hidden rounded-xl surface-card p-3 text-left hover:glow-primary"
          >
            <div className="overflow-hidden rounded-lg bg-muted">
              <img
                src={c.src}
                alt={c.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="mt-3 flex items-center justify-between px-1">
              <span className="text-xs font-medium text-muted-foreground">{c.issuer}</span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                View <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </m.button>
        ))}
      </div>

      <CertificateModal certificate={active} onClose={() => setActive(null)} />
    </section>
  );
}

function CertificateModal({
  certificate,
  onClose,
}: {
  certificate: Certificate | null;
  onClose: () => void;
}) {
  const close = useCallback(() => onClose(), [onClose]);
  const dialogRef = useModalA11y(!!certificate, close);

  if (!certificate) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-fade-in"
      onClick={close}
    >
      <m.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={certificate.title}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl glass border border-border outline-none"
      >
        <button
          onClick={close}
          aria-label="Close"
          data-modal-close
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-background/80 text-foreground hover:text-primary hover:glow-primary transition"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="bg-black/40">
          <img
            src={certificate.src}
            alt={certificate.title}
            className="h-auto max-h-[75vh] w-full object-contain"
          />
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            {certificate.category} <span className="mx-2 opacity-60">•</span> {certificate.issuer}
          </p>
          <h3 className="mt-3 text-2xl font-bold md:text-3xl">{certificate.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">Instructed by {certificate.instructor}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { l: "Issued", v: certificate.issued },
              { l: "Certificate ID", v: certificate.certId },
              { l: "Issuer", v: certificate.issuer },
            ].map((f) => (
              <div key={f.l} className="rounded-xl border border-border bg-secondary/30 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {f.l}
                </p>
                <p className="mt-2 font-mono text-sm text-foreground">{f.v}</p>
              </div>
            ))}
          </div>

          <a
            href={certificate.verifyUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-6"
          >
            <ExternalLink className="h-4 w-4" /> Verify Certificate
          </a>
        </div>
      </m.div>
    </div>
  );
}
