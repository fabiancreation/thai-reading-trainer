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
  const { dark, toggleDark, T, loading } = useTheme();
  const [view, setView] = useState<View>("home");
  const [lessonIndex, setLessonIndex] = useState(0);

  if (loading) {
    return (
      <div style={{ background: T.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: T.td, fontSize: 16 }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "system-ui,-apple-system,sans-serif", color: T.tx, transition: "background .3s,color .3s" }}>
      {/* Header */}
      <header style={{ background: T.sf, borderBottom: "1px solid " + T.bd, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setView("home")}>
          <span style={{ fontSize: 24, fontWeight: 700, color: T.ac }}>{"\u0e01"}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{"\u0e2d\u0e48\u0e32\u0e19\u0e44\u0e17\u0e22"}</div>
            <div style={{ fontSize: 11, color: T.td, letterSpacing: 1, textTransform: "uppercase" }}>Read Thai</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {([["Lessons", "home"], ["Tones", "tones"], ["SRS", "flash"]] as [string, View][]).map(([l, v]) => (
            <button key={v} className="bt" onClick={() => setView(v)} style={{ background: view === v ? T.ac : "transparent", color: view === v ? (dark ? T.bg : "#fff") : T.td, padding: "6px 13px", borderRadius: 7, fontSize: 13, fontWeight: 600 }}>{l}</button>
          ))}
          <button className="bt" onClick={toggleDark} style={{ background: "transparent", color: T.td, padding: "4px 8px", fontSize: 16 }}>{dark ? "\u2600\ufe0f" : "\u263e"}</button>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "18px 16px 80px" }}>
        {view === "home" && (
          <Home open={(i) => { setLessonIndex(i); setView("lesson"); }} />
        )}
        {view === "lesson" && (
          <Lesson
            lessonIndex={lessonIndex}
            back={() => setView("home")}
            next={() => {
              if (lessonIndex < LESSONS.length - 1) setLessonIndex(lessonIndex + 1);
              else setView("home");
            }}
          />
        )}
        {view === "tones" && <ToneTable />}
        {view === "flash" && <Flashcards />}
      </main>
    </div>
  );
}
