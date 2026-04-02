"use client";

import { useState } from "react";
import { LESSONS } from "@/lib/data/lessons";
import { useTheme } from "./ThemeProvider";
import Home from "./Home";
import type { PracticeMode } from "./Home";
import Lesson from "./Lesson";
import ToneTable from "./ToneTable";
import Flashcards from "./Flashcards";
import Quiz from "./Quiz";
import {
  ALL_GROUPS,
  getActiveConsonants,
  getActiveVowels,
} from "@/lib/data/groups";

type View =
  | { kind: "home" }
  | { kind: "lesson"; index: number }
  | { kind: "tones" }
  | { kind: "flash" }
  | { kind: "practice"; mode: PracticeMode };

type NavTab = "home" | "tones" | "flash";

export default function AppShell() {
  const { dark, toggleDark, T, loading, progress } = useTheme();
  const [view, setView] = useState<View>({ kind: "home" });

  if (loading) {
    return (
      <div style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: T.td, fontSize: 16 }}>Loading...</p>
      </div>
    );
  }

  const activeGroups = progress.activeGroups || [];
  const navView: NavTab = view.kind === "tones" ? "tones" : view.kind === "flash" ? "flash" : "home";

  function getPracticePool(mode: PracticeMode) {
    switch (mode.kind) {
      case "consonants":
        return getActiveConsonants(activeGroups);
      case "vowels":
        return getActiveVowels(activeGroups);
      case "group": {
        const group = ALL_GROUPS.find((g) => g.id === mode.groupId);
        return group ? group.items : [];
      }
    }
  }

  function getPracticeTitle(mode: PracticeMode): string {
    switch (mode.kind) {
      case "consonants":
        return "Consonant Drill";
      case "vowels":
        return "Vowel Drill";
      case "group": {
        const group = ALL_GROUPS.find((g) => g.id === mode.groupId);
        return group ? group.name : "Drill";
      }
    }
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "system-ui,-apple-system,sans-serif", color: T.tx, transition: "background .3s,color .3s" }}>
      {/* Header */}
      <header style={{ background: T.sf, borderBottom: "1px solid " + T.bd, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setView({ kind: "home" })}>
          <span style={{ fontSize: 24, fontWeight: 700, color: T.ac }}>{"\u0e01"}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{"\u0e2d\u0e48\u0e32\u0e19\u0e44\u0e17\u0e22"}</div>
            <div style={{ fontSize: 11, color: T.td, letterSpacing: 1, textTransform: "uppercase" }}>Read Thai</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {([["Groups", "home"], ["Tones", "tones"], ["SRS", "flash"]] as [string, NavTab][]).map(([l, v]) => (
            <button
              key={v}
              className="bt"
              onClick={() => {
                if (v === "home") setView({ kind: "home" });
                else if (v === "tones") setView({ kind: "tones" });
                else if (v === "flash") setView({ kind: "flash" });
              }}
              style={{
                background: navView === v ? T.ac : "transparent",
                color: navView === v ? (dark ? T.bg : "#fff") : T.td,
                padding: "6px 10px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {l}
            </button>
          ))}
          <button className="bt" onClick={toggleDark} style={{ background: "transparent", color: T.td, padding: "4px 8px", fontSize: 16 }}>
            {dark ? "\u2600\ufe0f" : "\u263e"}
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "18px 16px 80px" }}>
        {view.kind === "home" && (
          <Home
            onPractice={(mode) => setView({ kind: "practice", mode })}
            openLesson={(i) => setView({ kind: "lesson", index: i })}
          />
        )}
        {view.kind === "lesson" && (
          <Lesson
            lessonIndex={view.index}
            back={() => setView({ kind: "home" })}
            next={() => {
              if (view.index < LESSONS.length - 1)
                setView({ kind: "lesson", index: view.index + 1 });
              else setView({ kind: "home" });
            }}
          />
        )}
        {view.kind === "tones" && <ToneTable />}
        {view.kind === "flash" && <Flashcards />}
        {view.kind === "practice" && (
          <div className="fu">
            <button
              className="bt"
              onClick={() => setView({ kind: "home" })}
              style={{ color: T.td, background: "none", fontSize: 14, marginBottom: 14 }}
            >
              {"\u2190 Back"}
            </button>
            <Quiz
              pool={getPracticePool(view.mode)}
              title={getPracticeTitle(view.mode)}
              onDone={() => setView({ kind: "home" })}
            />
          </div>
        )}
      </main>
    </div>
  );
}
