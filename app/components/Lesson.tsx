"use client";

import { useState } from "react";
import { LESSONS } from "@/lib/data/lessons";
import { LessonItem } from "@/lib/data/types";
import { useTheme, Theme } from "./ThemeProvider";
import Quiz from "./Quiz";

const cc = (c: string, T: Theme) => c === "mid" ? T.mid : c === "high" ? T.high : T.low;
const CL = (c: string) => c === "mid" ? "MID" : c === "high" ? "HIGH" : "LOW";

interface LessonProps {
  lessonIndex: number;
  back: () => void;
  next: () => void;
}

export default function Lesson({ lessonIndex, back, next }: LessonProps) {
  const { T, updateProgress } = useTheme();
  const l = LESSONS[lessonIndex];
  const [step, setStep] = useState<"learn" | "practice" | "done">("learn");

  const done = () => {
    updateProgress((p) => ({ ...p, done: [...new Set([...(p.done || []), l.id])] }));
    setStep("done");
  };

  return (
    <div className="fu">
      <button className="bt" onClick={back} style={{ color: T.td, background: "none", fontSize: 14, marginBottom: 14 }}>{"\u2190 Back"}</button>

      {step === "learn" && (
        <>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: T.ac, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>{"Lesson " + (lessonIndex + 1) + " \u00b7 " + l.phase}</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 5 }}>{l.title}</h2>
            <p style={{ fontSize: 15, color: T.td, lineHeight: 1.6 }}>{l.desc}</p>
          </div>

          {l.items.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 7, marginBottom: 18 }}>
              {l.items.map((it: LessonItem, i: number) => {
                const hasCls = "cls" in it;
                const hasPos = "pos" in it;
                return (
                  <div key={i} className="fu" style={{
                    background: T.cd,
                    border: "1px solid " + (hasCls ? cc(it.cls, T) + "33" : T.bd),
                    borderRadius: 9,
                    padding: "12px 10px",
                    textAlign: "center",
                    animationDelay: i * 25 + "ms",
                  }}>
                    <div style={{ fontSize: 36, fontWeight: 700, color: hasCls ? cc(it.cls, T) : T.ac, marginBottom: 4 }}>{it.thai}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>{it.pb}</div>
                    {hasCls && <div style={{ display: "inline-block", fontSize: 10, color: cc(it.cls, T), background: cc(it.cls, T) + "15", padding: "2px 7px", borderRadius: 4, marginTop: 3, fontWeight: 700 }}>{CL(it.cls)}</div>}
                    {hasPos && <div style={{ display: "inline-block", fontSize: 10, color: T.tm, background: T.sl, padding: "2px 7px", borderRadius: 4, marginTop: 3 }}>pos: {(it as { pos: string }).pos}</div>}
                    <div style={{ fontSize: 12, color: T.tm, marginTop: 3 }}>{it.en}</div>
                  </div>
                );
              })}
            </div>
          )}

          {l.theory && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
              {l.theory.map((t, i) => (
                <div key={i} style={{ background: T.cd, border: "1px solid " + T.bd, borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.ac, marginBottom: 3 }}>{t.label}</div>
                  <div style={{ fontSize: 14, color: T.td, lineHeight: 1.5 }}>{t.text}</div>
                </div>
              ))}
            </div>
          )}

          {l.words && (
            <div style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 15, color: T.td, marginBottom: 8, fontWeight: 600 }}>First Words</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {l.words.map((w, i) => (
                  <div key={i} style={{ background: T.cd, border: "1px solid " + T.bd, borderRadius: 7, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 24, fontWeight: 600 }}>{w.thai}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{w.pb}</div>
                      <div style={{ fontSize: 12, color: T.tm }}>{w.en}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {l.tip && (
            <div style={{ background: T.ac + "0d", border: "1px solid " + T.ac + "22", borderRadius: 8, padding: "12px 14px", marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ac, marginBottom: 3 }}>Tip</div>
              <div style={{ fontSize: 14, color: T.tx, lineHeight: 1.6 }}>{l.tip}</div>
            </div>
          )}

          <button className="bt" onClick={() => setStep("practice")} style={{ width: "100%", padding: "13px", borderRadius: 9, background: T.ac, color: "#fff", fontSize: 16, fontWeight: 700 }}>Start Practice</button>
        </>
      )}

      {step === "practice" && <Quiz lesson={l} onDone={done} />}

      {step === "done" && (
        <div className="fu" style={{ textAlign: "center", padding: "36px 0" }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>{"\uD83C\uDF89"}</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Lesson complete!</h2>
          <p style={{ fontSize: 15, color: T.td, marginBottom: 20 }}>Characters added to your SRS deck.</p>
          <button className="bt" onClick={next} style={{ padding: "11px 28px", borderRadius: 9, background: T.ac, color: "#fff", fontSize: 16, fontWeight: 700 }}>
            {lessonIndex < LESSONS.length - 1 ? "Next Lesson \u2192" : "Back to Overview"}
          </button>
        </div>
      )}
    </div>
  );
}
