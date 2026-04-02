"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { loadProgress, saveProgress, loadDarkMode } from "@/lib/storage";
import { UserProgress } from "@/lib/data/types";

interface ThemeContextValue {
  dark: boolean;
  toggleDark: () => void;
  progress: UserProgress;
  updateProgress: (fn: UserProgress | ((prev: UserProgress) => UserProgress)) => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const [progress, setProgress] = useState<UserProgress>({ done: [], srs: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([loadProgress(), loadDarkMode()]).then(([pg, dk]) => {
      setProgress(pg);
      setDark(dk);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggleDark = useCallback(() => {
    setDark((d) => {
      const v = !d;
      saveProgress(progress, v);
      return v;
    });
  }, [progress]);

  const updateProgress = useCallback(
    (fn: UserProgress | ((prev: UserProgress) => UserProgress)) => {
      setProgress((p) => {
        const n = typeof fn === "function" ? fn(p) : fn;
        saveProgress(n, dark);
        return n;
      });
    },
    [dark]
  );

  return (
    <ThemeContext.Provider value={{ dark, toggleDark, progress, updateProgress, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}
