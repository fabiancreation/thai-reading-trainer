"use client";

import { useState } from "react";
import { LESSONS } from "@/lib/data/lessons";
import { LessonItem } from "@/lib/data/types";
import { useTheme } from "./ThemeProvider";
import Quiz from "./Quiz";

function classColor(cls: string): string {
  if (cls === "mid") return "text-cls-mid";
  if (cls === "high") return "text-cls-high";
  return "text-cls-low";
}

function classBg(cls: string): string {
  if (cls === "mid") return "bg-cls-mid/[0.08] text-cls-mid";
  if (cls === "high") return "bg-cls-high/[0.08] text-cls-high";
  return "bg-cls-low/[0.08] text-cls-low";
}

function classBorder(cls: string): string {
  if (cls === "mid") return "border-cls-mid/20";
  if (cls === "high") return "border-cls-high/20";
  return "border-cls-low/20";
}

function classLabel(cls: string): string {
  if (cls === "mid") return "MID";
  if (cls === "high") return "HIGH";
  return "LOW";
}

interface LessonProps {
  lessonIndex: number;
  back: () => void;
  next: () => void;
}

export default function Lesson({ lessonIndex, back, next }: LessonProps) {
  const { updateProgress } = useTheme();
  const l = LESSONS[lessonIndex];
  const [step, setStep] = useState<"learn" | "practice" | "done">("learn");

  const done = () => {
    updateProgress((p) => ({
      ...p,
      done: [...new Set([...(p.done || []), l.id])],
    }));
    setStep("done");
  };

  return (
    <div className="animate-fade-up">
      <button onClick={back} className="text-muted text-sm mb-3.5 bg-transparent btn-base">
        {"\u2190 Back"}
      </button>

      {step === "learn" && (
        <>
          <div className="mb-5">
            <div className="text-xs text-accent uppercase tracking-widest mb-1">
              {"Lesson " + (lessonIndex + 1) + " \u00b7 " + l.phase}
            </div>
            <h2 className="text-[22px] font-bold mb-1">{l.title}</h2>
            <p className="text-[15px] text-muted leading-relaxed">{l.desc}</p>
          </div>

          {/* Character grid */}
          {l.items.length > 0 && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-[7px] mb-4">
              {l.items.map((it: LessonItem, i: number) => {
                const hasCls = "cls" in it;
                const hasPos = "pos" in it;
                return (
                  <div
                    key={i}
                    className={`animate-fade-up bg-card border rounded-[9px] py-3 px-2.5 text-center ${
                      hasCls ? classBorder(it.cls) : "border-border"
                    }`}
                    style={{ animationDelay: `${i * 25}ms` }}
                  >
                    <div
                      className={`text-4xl font-bold mb-1 ${
                        hasCls ? classColor(it.cls) : "text-accent"
                      }`}
                    >
                      {it.thai}
                    </div>
                    <div className="text-sm font-semibold leading-tight">{it.pb}</div>
                    {hasCls && (
                      <span
                        className={`inline-block text-[10px] font-bold px-[7px] py-0.5 rounded mt-1 ${classBg(
                          it.cls
                        )}`}
                      >
                        {classLabel(it.cls)}
                      </span>
                    )}
                    {hasPos && (
                      <span className="inline-block text-[10px] text-muted-light bg-surface-alt px-[7px] py-0.5 rounded mt-1">
                        pos: {(it as { pos: string }).pos}
                      </span>
                    )}
                    <div className="text-xs text-muted-light mt-1">{it.en}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Theory */}
          {l.theory && (
            <div className="flex flex-col gap-1.5 mb-4">
              {l.theory.map((t, i) => (
                <div key={i} className="bg-card border border-border rounded-lg py-2.5 px-3.5">
                  <div className="text-sm font-bold text-accent mb-1">{t.label}</div>
                  <div className="text-sm text-muted leading-normal">{t.text}</div>
                </div>
              ))}
            </div>
          )}

          {/* Words */}
          {l.words && (
            <div className="mb-4">
              <h3 className="text-[15px] text-muted font-semibold mb-2">First Words</h3>
              <div className="flex flex-wrap gap-1.5">
                {l.words.map((w, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-[7px] py-2 px-3.5 flex items-center gap-2"
                  >
                    <span className="text-2xl font-semibold">{w.thai}</span>
                    <div>
                      <div className="text-sm font-semibold">{w.pb}</div>
                      <div className="text-xs text-muted-light">{w.en}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tip */}
          {l.tip && (
            <div className="bg-accent/5 border border-accent/[0.13] rounded-lg py-3 px-3.5 mb-5">
              <div className="text-[13px] font-bold text-accent mb-1">Tip</div>
              <div className="text-sm leading-relaxed">{l.tip}</div>
            </div>
          )}

          <button
            onClick={() => setStep("practice")}
            className="w-full py-3.5 rounded-[9px] bg-accent text-white text-base font-bold btn-base"
          >
            Start Practice
          </button>
        </>
      )}

      {step === "practice" && <Quiz lesson={l} onDone={done} />}

      {step === "done" && (
        <div className="animate-fade-up text-center py-9">
          <div className="text-[44px] mb-3.5">{"\uD83C\uDF89"}</div>
          <h2 className="text-xl font-bold mb-1.5">Lesson complete!</h2>
          <p className="text-[15px] text-muted mb-5">Characters added to your SRS deck.</p>
          <button
            onClick={next}
            className="py-3 px-7 rounded-[9px] bg-accent text-white text-base font-bold btn-base"
          >
            {lessonIndex < LESSONS.length - 1 ? "Next Lesson \u2192" : "Back to Overview"}
          </button>
        </div>
      )}
    </div>
  );
}
