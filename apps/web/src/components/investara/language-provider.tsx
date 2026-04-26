"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { defaultLanguage, languages, translate, type TranslationKey } from "@/lib/i18n";
import type { LanguageCode } from "@/types/investara";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: TranslationKey) => string;
};

const storageKey = "investara-language";
const languageCodes = new Set(languages.map((language) => language.code));
const LanguageContext = createContext<LanguageContextValue | null>(null);
const listeners = new Set<() => void>();

function isLanguageCode(value: string | null): value is LanguageCode {
  return value !== null && languageCodes.has(value as LanguageCode);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribe,
    getLanguageSnapshot,
    getServerLanguageSnapshot,
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((nextLanguage: LanguageCode) => {
    window.localStorage.setItem(storageKey, nextLanguage);
    document.documentElement.lang = nextLanguage;
    listeners.forEach((listener) => listener());
  }, []);

  const t = useCallback((key: TranslationKey) => translate(language, key), [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }

  return context;
}

function getLanguageSnapshot(): LanguageCode {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  const storedLanguage = window.localStorage.getItem(storageKey);
  return isLanguageCode(storedLanguage) ? storedLanguage : defaultLanguage;
}

function getServerLanguageSnapshot(): LanguageCode {
  return defaultLanguage;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}
