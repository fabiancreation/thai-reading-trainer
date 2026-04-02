"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { loadProgress, saveProgress, loadDarkMode } from "@/lib/storage";
import { UserProgress } from "@/lib/data/types";

const LT = {
  bg: "#f5f3ef", sf: "#fff", sl: "#ece9e3", ac: "#c4880d", ad: "#a06f08",
  mid: "#2d8659", high: "#c94a3e", low: "#3670b5",
  tx: "#1a1a1a", td: "#6b6660", tm: "#9e9892",
  ok: "#2d8659", no: "#c94a3e", bd: "#ddd8d0", cd: "#faf9f7", qz: "#f0ede8",
};

const DK = {
  bg: "#0f1117", sf: "#1a1d27", sl: "#242836", ac: "#e8b931", ad: "#c49a1f",
  mid: "#5ba87b", high: "#e06456", low: "#4a90d9",
  tx: "#e8e6e1", td: "#9b9a97", tm: "#6b6a67",
  ok: "#5ba87b", no: "#e06456", bd: "#2d3140", cd: "#1e2130", qz: "#242836",
};

export type Theme = typeof LT;

interface ThemeContextValue {
  dark: boolean;
  toggleDark: () => void;
  T: Theme;
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
  const T = dark ? DK : LT;

  useEffect(() => {
    Promise.all([loadProgress(), loadDarkMode()]).then(([pg, dk]) => {
      setProgress(pg);
      setDark(dk);
      setLoading(false);
    });
  }, []);

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
    <ThemeContext.Provider value={{ dark, toggleDark, T, progress, updateProgress, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}
