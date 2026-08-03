import { en } from "./locales/en";
import { fa } from "./locales/fa";
import type { Locale } from "./config";

export type Messages = typeof en;

export const catalogs: Record<Locale, Messages> = {
  en,
  fa: fa as Messages,
};

type Primitive = string | number | boolean | null | undefined;

export type TranslationParams = Record<string, Primitive>;

function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function translate(
  locale: Locale,
  key: string,
  params?: TranslationParams,
  fallbackLocale: Locale = "en",
): string {
  const raw =
    getPath(catalogs[locale], key) ??
    getPath(catalogs[fallbackLocale], key) ??
    key;

  if (typeof raw !== "string") return key;

  if (!params) return raw;

  return raw.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = params[name];
    return value == null ? "" : String(value);
  });
}
