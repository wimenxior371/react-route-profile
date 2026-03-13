import { createContext, type ReactNode, useContext, useMemo } from "react";
import { de } from "./translations/de";
import { en } from "./translations/en";
import { sk } from "./translations/sk";
import type { RouteMapLang, Translations } from "./types";

const translations: Record<RouteMapLang, Translations> = {
  de,
  en,
  sk,
};

const I18nContext = createContext<Translations>(translations.en);

export const I18nProvider = ({
  lang,
  children,
}: {
  lang?: RouteMapLang;
  children: ReactNode;
}) => {
  const value = useMemo(() => translations[lang ?? "en"], [lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);

export type { RouteMapLang, Translations } from "./types";
export { de } from "./translations/de";
export { en } from "./translations/en";
export { sk } from "./translations/sk";
