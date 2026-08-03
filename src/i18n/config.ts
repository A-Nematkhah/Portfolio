export const LOCALES = ["en", "fa"] as const;
export type Locale = (typeof LOCALES)[number];

export type LocaleConfig = {
  code: Locale;
  label: string;
  shortLabel: string;
  dir: "ltr" | "rtl";
  htmlLang: string;
  numberLocale: string;
};

export const LOCALE_CONFIG: Record<Locale, LocaleConfig> = {
  en: {
    code: "en",
    label: "English",
    shortLabel: "EN",
    dir: "ltr",
    htmlLang: "en",
    numberLocale: "en-US",
  },
  fa: {
    code: "fa",
    label: "فارسی",
    shortLabel: "فا",
    dir: "rtl",
    htmlLang: "fa",
    numberLocale: "fa-IR",
  },
};

export const DEFAULT_LOCALE: Locale = "en";
export const STORAGE_KEY = "portfolio-locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
