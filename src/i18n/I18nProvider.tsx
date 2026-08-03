import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_CONFIG,
  STORAGE_KEY,
  isLocale,
  type Locale,
  type LocaleConfig,
} from "./config";
import { translate, type TranslationParams } from "./translate";

type I18nContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  config: LocaleConfig;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: string, params?: TranslationParams) => string;
  formatNumber: (value: number | string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function applyDocumentLocale(locale: Locale) {
  const cfg = LOCALE_CONFIG[locale];
  const root = document.documentElement;
  root.lang = cfg.htmlLang;
  root.dir = cfg.dir;
  root.dataset.locale = locale;
}

export function resolveInitialLocale(): Locale {
  if (typeof document !== "undefined") {
    const fromDom = document.documentElement.dataset.locale;
    if (isLocale(fromDom)) return fromDom;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => resolveInitialLocale());

  useEffect(() => {
    applyDocumentLocale(locale);
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
    document.title = translate(locale, "meta.title");
    const desc = translate(locale, "meta.description");
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === "en" ? "fa" : "en"));
  }, []);

  const t = useCallback(
    (key: string, params?: TranslationParams) => translate(locale, key, params),
    [locale],
  );

  const formatNumber = useCallback(
    (value: number | string) => {
      const cfg = LOCALE_CONFIG[locale];
      if (typeof value === "number" && Number.isFinite(value)) {
        return new Intl.NumberFormat(cfg.numberLocale).format(value);
      }
      const str = String(value);
      if (locale !== "fa") return str;
      return str.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)] ?? d);
    },
    [locale],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      dir: LOCALE_CONFIG[locale].dir,
      config: LOCALE_CONFIG[locale],
      setLocale,
      toggleLocale,
      t,
      formatNumber,
    }),
    [locale, setLocale, toggleLocale, t, formatNumber],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useT() {
  return useI18n().t;
}
