import { useI18n } from "@/i18n";

export function Footer() {
  const { t, formatNumber } = useI18n();
  const year = formatNumber(new Date().getFullYear());

  return (
    <footer className="relative border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground md:flex-row">
        <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/15 text-primary font-display font-bold">
          AN
        </div>
        <p>{t("footer.copyright", { year })}</p>
        <p>
          <a
            href="https://github.com/A-Nematkhah/Portfolio"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary transition-colors"
          >
            {t("footer.source")}
          </a>
        </p>
      </div>
    </footer>
  );
}
