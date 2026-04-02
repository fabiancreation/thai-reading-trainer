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
  getActiveItems,
  getActiveConsonants,
  getActiveVowels,
} from "@/lib/data/groups";
import { reviewCard, inferCategory, buildDailyMix } from "@/lib/srs";
import { LessonItem } from "@/lib/data/types";
import { generateSyllablePool } from "@/lib/syllables";
import { updateStreak } from "@/lib/streak";
import { generateToneQuestions } from "@/lib/data/tones";

type View =
  | { kind: "home" }
  | { kind: "lessons" }
  | { kind: "lesson"; index: number }
  | { kind: "tones" }
  | { kind: "flash" }
  | { kind: "practice"; mode: PracticeMode }
  | { kind: "dailymix" };

interface AppShellProps {
  userName?: string;
  onLogout?: () => void;
}

export default function AppShell({ userName, onLogout }: AppShellProps = {}) {
  const { dark, toggleDark, T, loading, progress, updateProgress } = useTheme();
  const [view, setView] = useState<View>({ kind: "home" });

  if (loading) {
    return (
      <div style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: T.td, fontSize: 16 }}>Loading...</p>
      </div>
    );
  }

  const activeGroups = progress.activeGroups || [];
  const navView = view.kind === "home" ? "home" : view.kind === "tones" ? "tones" : view.kind === "flash" ? "flash" : (view.kind === "lessons" || view.kind === "lesson") ? "lessons" : view.kind === "dailymix" ? "home" : "home";

  function getPracticePool(mode: PracticeMode) {
    switch (mode.kind) {
      case "all":
        return getActiveItems(activeGroups);
      case "consonants":
        return getActiveConsonants(activeGroups);
      case "vowels":
        return getActiveVowels(activeGroups);
      case "reading":
        return generateSyllablePool(activeGroups);
      case "tones":
        return []; // tones use preGenerated questions
      case "group": {
        const group = ALL_GROUPS.find((g) => g.id === mode.groupId);
        return group ? group.items : [];
      }
    }
  }

  const handleAnswer = (item: LessonItem | { thai: string; pb: string; en: string }, correct: boolean) => {
    const cat = inferCategory(item as LessonItem);
    updateProgress((p) => ({
      ...p,
      srs: { ...p.srs, [item.thai]: reviewCard(p.srs[item.thai], correct, item.thai, cat) },
      streak: updateStreak(p.streak),
    }));
  };

  function getPracticeTitle(mode: PracticeMode): string {
    switch (mode.kind) {
      case "all":
        return "Practice All";
      case "consonants":
        return "Consonant Drill";
      case "vowels":
        return "Vowel Drill";
      case "reading":
        return "Reading Practice";
      case "tones":
        return "Tone Practice";
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
          {([["Lessons", "lessons"], ["Groups", "home"], ["Tones", "tones"], ["SRS", "flash"]] as [string, string][]).map(([l, v]) => (
            <button
              key={v}
              className="bt"
              onClick={() => {
                if (v === "home") setView({ kind: "home" });
                else if (v === "lessons") setView({ kind: "lessons" });
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
          {onLogout && (
            <button className="bt" onClick={onLogout} style={{ background: "transparent", color: T.td, padding: "4px 8px", fontSize: 11, fontWeight: 600 }} title={userName ? `Logged in as ${userName}` : "Log out"}>
              {userName ? userName.charAt(0).toUpperCase() : "?"}<span style={{ fontSize: 9, marginLeft: 2 }}>{"\u25BE"}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "18px 16px 80px" }}>
        {view.kind === "home" && (
          <Home
            onPractice={(mode) => setView({ kind: "practice", mode })}
            onDailyMix={() => setView({ kind: "dailymix" })}
          />
        )}
        {view.kind === "lessons" && (
          <LessonList
            T={T}
            done={progress.done || []}
            open={(i) => setView({ kind: "lesson", index: i })}
          />
        )}
        {view.kind === "lesson" && (
          <Lesson
            lessonIndex={view.index}
            back={() => setView({ kind: "lessons" })}
            next={() => {
              if (view.index < LESSONS.length - 1)
                setView({ kind: "lesson", index: view.index + 1 });
              else setView({ kind: "lessons" });
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
              preGenerated={view.mode.kind === "tones" ? generateToneQuestions(activeGroups.includes("tone_rules"), activeGroups.includes("tone_marks")) : undefined}
              srs={progress.srs}
              title={getPracticeTitle(view.mode)}
              onDone={() => setView({ kind: "home" })}
              onAnswer={handleAnswer}
            />
          </div>
        )}
        {view.kind === "dailymix" && (
          <DailyMixView T={T} activeGroups={activeGroups} srs={progress.srs} onAnswer={handleAnswer} onDone={() => setView({ kind: "home" })} />
        )}
      </main>
    </div>
  );
}

function DailyMixView({ T, activeGroups, srs, onAnswer, onDone }: {
  T: Record<string, string>;
  activeGroups: string[];
  srs: Record<string, import("@/lib/data/types").SRSCard>;
  onAnswer: (item: LessonItem | { thai: string; pb: string; en: string }, correct: boolean) => void;
  onDone: () => void;
}) {
  const [mix] = useState(() => buildDailyMix(activeGroups, srs));

  if (mix.items.length === 0) {
    return (
      <div className="fu" style={{ textAlign: "center", padding: "36px 0" }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>{"\uD83C\uDF1F"}</div>
        <h3 style={{ fontSize: 18, marginBottom: 5 }}>All caught up!</h3>
        <p style={{ fontSize: 15, color: T.td, marginBottom: 18 }}>No reviews due and no new items to learn.</p>
        <button className="bt" onClick={onDone} style={{ padding: "10px 24px", borderRadius: 9, background: T.ac, color: "#fff", fontSize: 15, fontWeight: 700 }}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="fu">
      <button className="bt" onClick={onDone} style={{ color: T.td, background: "none", fontSize: 14, marginBottom: 14 }}>
        {"\u2190 Back"}
      </button>
      <Quiz
        pool={mix.items}
        srs={srs}
        title={`Daily Mix \u00B7 ${mix.dueCount} due \u00B7 ${mix.newCount} new`}
        onDone={onDone}
        onAnswer={onAnswer}
      />
    </div>
  );
}

function LessonList({ T, done, open }: { T: Record<string, string>; done: number[]; open: (i: number) => void }) {
  const pct = Math.round((done.length / LESSONS.length) * 100);
  return (
    <div className="fu">
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 14, color: T.td }}>Progress</span>
          <span style={{ fontSize: 14, color: T.ac, fontWeight: 600 }}>{pct}%</span>
        </div>
        <div style={{ height: 5, background: T.sl, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: pct + "%", height: "100%", background: T.ac, borderRadius: 3, transition: "width .5s" }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {LESSONS.map((l, i) => {
          const dn = done.includes(l.id);
          return (
            <div
              key={l.id}
              className="fu ch"
              onClick={() => open(i)}
              style={{
                background: dn ? T.ok + "0d" : T.sf,
                border: "1px solid " + (dn ? T.ok + "33" : T.bd),
                borderRadius: 10,
                padding: "14px 16px",
                animationDelay: i * 40 + "ms",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: dn ? T.ok : T.ac, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {dn ? "\u2713" : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: dn ? T.ok : T.tm, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 1 }}>{l.phase}</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{l.title}</div>
                </div>
                {l.items.length > 0 && <div style={{ fontSize: 13, color: T.tm }}>{l.items.length}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
