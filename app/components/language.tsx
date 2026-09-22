"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Lang = "en" | "ta";

const STORAGE_KEY = "spv-blog-lang";

type LanguageValue = { lang: Lang; setLang: (lang: Lang) => void };

const LanguageContext = createContext<LanguageValue>({ lang: "en", setLang: () => {} });

/**
 * The stored preference lives in localStorage, which is outside React. Reading
 * it through useSyncExternalStore lets the server render "en" and the client
 * swap to the saved value during hydration, with no cascading effect render.
 */
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "ta" ? "ta" : "en";
  } catch {
    // Private mode / blocked storage — the English default is fine.
    return "en";
  }
}

function getServerSnapshot(): Lang {
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const update = useCallback((next: Lang) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore — the choice just will not persist across visits.
    }
    // `storage` only fires in other tabs, so notify this one directly.
    for (const listener of listeners) listener();
  }, []);

  const value = useMemo(() => ({ lang, setLang: update }), [lang, update]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): LanguageValue {
  return useContext(LanguageContext);
}

/** Picks the Tamil value when it exists and Tamil is selected. */
function pick(lang: Lang, en: string, ta?: string | null): { text: string; lang: Lang } {
  if (lang === "ta" && ta && ta.trim()) return { text: ta, lang: "ta" };
  return { text: en, lang: "en" };
}

export function Bilingual({
  en,
  ta,
  className,
}: {
  en: string;
  ta?: string | null;
  className?: string;
}) {
  const { lang } = useLang();
  const chosen = pick(lang, en, ta);
  return (
    <span className={className} lang={chosen.lang === "ta" ? "ta" : undefined}>
      {chosen.text}
    </span>
  );
}

/** Rich text body. The HTML is sanitised server-side before it is stored. */
export function BilingualHtml({
  en,
  ta,
  className,
}: {
  en: string;
  ta?: string | null;
  className?: string;
}) {
  const { lang } = useLang();
  const chosen = pick(lang, en, ta);
  return (
    <div
      className={className}
      lang={chosen.lang === "ta" ? "ta" : undefined}
      dangerouslySetInnerHTML={{ __html: chosen.text }}
    />
  );
}

export function LanguageToggle({ hasTamil = true }: { hasTamil?: boolean }) {
  const { lang, setLang } = useLang();
  if (!hasTamil) return null;

  return (
    <div className="lang-toggle" role="group" aria-label="Choose language">
      <button
        type="button"
        aria-pressed={lang === "en"}
        className={lang === "en" ? "is-active" : ""}
        onClick={() => setLang("en")}
      >
        English
      </button>
      <button
        type="button"
        aria-pressed={lang === "ta"}
        className={lang === "ta" ? "is-active" : ""}
        onClick={() => setLang("ta")}
        lang="ta"
      >
        தமிழ்
      </button>
    </div>
  );
}
