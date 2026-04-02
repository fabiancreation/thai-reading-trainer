"use client";

import { useState } from "react";
import { Lesson, LessonItem, WordItem } from "@/lib/data/types";

interface QuizQuestion {
  item: LessonItem | WordItem;
  opts: (LessonItem | WordItem)[];
  n2t: boolean; // name-to-thai (show name, pick character)
}

interface QuizProps {
  lesson: Lesson;
  onDone: () => void;
}

export default function Quiz({ lesson, onDone }: QuizProps) {
  const pool = [
    ...lesson.items.filter(
      (it) =>
        !it.thai.startsWith("-") &&
        !it.thai.startsWith("\u0e40") &&
        !it.thai.startsWith("\u0e41") &&
        !it.thai.startsWith("\u0e42") &&
        !it.thai.startsWith("\u0e43") &&
        !it.thai.startsWith("\u0e44")
    ),
    ...(lesson.words || []),
  ].filter((it) => it.thai);

  const [qi, setQi] = useState(0);
  const [sc, setSc] = useState(0);
  const [sel, setSel] = useState<{ o: LessonItem | WordItem; ok: boolean } | null>(null);
  const [qs] = useState<QuizQuestion[]>(() => {
    if (pool.length < 2) return [];
    return [...pool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8)
      .map((item) => {
        const others = pool
          .filter((x) => x.thai !== item.thai)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        const n2t = "cls" in item || "type" in item;
        return { item, opts: [item, ...others].sort(() => Math.random() - 0.5), n2t };
      });
  });

  if (qs.length === 0 || qi >= qs.length) {
    return (
      <div className="animate-fade-up text-center py-7">
        <div className="text-[40px] mb-2.5">{sc >= (qs.length || 1) * 0.7 ? "\uD83C\uDF1F" : "\uD83D\uDCDD"}</div>
        <h3 className="text-lg mb-1.5">
          {sc}/{qs.length} correct
        </h3>
        <p className="text-[15px] text-muted mb-5">
          {sc >= (qs.length || 1) * 0.7 ? "Great job!" : "Try again!"}
        </p>
        <button
          onClick={onDone}
          className="px-6 py-2.5 rounded-[9px] bg-accent text-white text-[15px] font-bold btn-base"
        >
          Continue
        </button>
      </div>
    );
  }

  const q = qs[qi];
  const ans = (o: LessonItem | WordItem) => {
    const ok = o.thai === q.item.thai;
    setSel({ o, ok });
    if (ok) setSc((s) => s + 1);
    setTimeout(() => {
      setSel(null);
      setQi((i) => i + 1);
    }, 750);
  };

  return (
    <div className="animate-fade-up">
      <div className="flex justify-between mb-3">
        <span className="text-sm text-muted">
          Q {qi + 1}/{qs.length}
        </span>
        <span className="text-sm text-accent">{sc} correct</span>
      </div>
      <div className="h-[3px] bg-surface-alt rounded-sm mb-5 overflow-hidden">
        <div
          className="h-full bg-accent rounded-sm transition-[width] duration-300"
          style={{ width: `${(qi / qs.length) * 100}%` }}
        />
      </div>
      <div className="text-center mb-6">
        <div className="text-[15px] text-muted mb-2.5">
          {q.n2t ? "Which character is this?" : "How do you read this?"}
        </div>
        <div
          className={`font-bold text-accent leading-tight ${q.n2t ? "text-2xl" : "text-[56px]"}`}
        >
          {q.n2t ? q.item.pb : q.item.thai}
        </div>
        {q.item.en && <div className="text-[13px] text-muted-light mt-1">{q.item.en}</div>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {q.opts.map((o, i) => {
          const isSel = sel?.o === o;
          const isOk = o.thai === q.item.thai;
          let cls = "bg-quiz border-border";
          if (sel) {
            if (isOk) cls = "bg-ok/[0.13] border-ok";
            else if (isSel) cls = "bg-no/[0.13] border-no";
          }
          return (
            <button
              key={i}
              disabled={!!sel}
              onClick={() => ans(o)}
              className={`border rounded-[9px] py-3.5 px-2.5 font-semibold transition-all duration-200 btn-base ${cls} ${
                q.n2t ? "text-[32px]" : "text-[15px]"
              } ${sel && !isSel && !isOk ? "opacity-30" : "opacity-100"}`}
            >
              {q.n2t ? o.thai : o.pb}
            </button>
          );
        })}
      </div>
    </div>
  );
}
