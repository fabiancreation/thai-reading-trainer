"use client";

import { useState } from "react";
import { LESSONS } from "@/lib/data/lessons";
import { useTheme } from "./ThemeProvider";
import Home from "./Home";
import Lesson from "./Lesson";
import ToneTable from "./ToneTable";
import Flashcards from "./Flashcards";

type View = "home" | "lesson" | "tones" | "flash";

export default function AppShell() {
  const { dark, toggleDark, loading } = useTheme();
  const [view, setView] = useState<View>("home");
  const [lessonIndex, setLessonIndex] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-muted text-base">Loading...</p>
      </div>
    );
  }

  const navItems: [string, View][] = [
    ["Lessons", "home"],
    ["Tones", "tones"],
    ["SRS", "flash"],
  ];

  return (
    <div className="min-h-screen bg-bg font-sans text-text transition-colors duration-300">
      {/* Header */}
      <header className="bg-surface border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setView("home")}
        >
          <span className="text-2xl font-bold text-accent">{"\u0e01"}</span>
          <div>
            <div className="text-base font-bold">{"\u0e2d\u0e48\u0e32\u0e19\u0e44\u0e17\u0e22"}</div>
            <div className="text-[11px] text-muted uppercase tracking-widest">Read Thai</div>
          </div>
        </div>
        <div className="flex gap-1.5 items-center">
          {navItems.map(([label, v]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3.5 py-1.5 rounded-[7px] text-[13px] font-semibold transition-colors btn-base ${
                view === v
                  ? "bg-accent text-white"
                  : "bg-transparent text-muted"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={toggleDark}
            className="bg-transparent text-muted px-2 py-1 text-base btn-base"
          >
            {dark ? "\u2600\ufe0f" : "\u263e"}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[700px] mx-auto px-4 pt-4 pb-20">
        {view === "home" && (
          <Home
            open={(i) => {
              setLessonIndex(i);
              setView("lesson");
            }}
          />
        )}
        {view === "lesson" && (
          <Lesson
            lessonIndex={lessonIndex}
            back={() => setView("home")}
            next={() => {
              if (lessonIndex < LESSONS.length - 1) {
                setLessonIndex(lessonIndex + 1);
              } else {
                setView("home");
              }
            }}
          />
        )}
        {view === "tones" && <ToneTable />}
        {view === "flash" && <Flashcards />}
      </main>
    </div>
  );
}
