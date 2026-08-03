import { LOCALE_CONFIG, LOCALES, type Locale } from "./config";
import { useI18n } from "./I18nProvider";

export function LanguageSwitcher({
  locale,
  onChange,
  className = "",
}: {
  locale: Locale;
  onChange: (locale: Locale) => void;
  className?: string;
}) {
  const { t } = useI18n();

  return (
    <div className={`lang-switch ${className}`} role="group" aria-label={t("common.language")}>
      <span className="lang-switch-thumb" data-locale={locale} aria-hidden />
      {LOCALES.map((code) => {
        const active = locale === code;
        const cfg = LOCALE_CONFIG[code];
        return (
          <button
            key={code}
            type="button"
            className={`lang-switch-btn ${active ? "is-active" : ""}`}
            aria-pressed={active}
            aria-label={code === "en" ? t("common.switchToEn") : t("common.switchToFa")}
            onClick={() => onChange(code)}
          >
            {cfg.shortLabel === "فا" ? "فارسی" : cfg.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
