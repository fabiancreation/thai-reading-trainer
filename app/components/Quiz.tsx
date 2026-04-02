"use client";

import { useState } from "react";
import { LessonItem, WordItem } from "@/lib/data/types";
import { useTheme } from "./ThemeProvider";

type QuizItem = LessonItem | WordItem;

interface QuizQuestion {
  item: QuizItem;
  opts: QuizItem[];
  n2t: boolean; // name-to-thai (true) vs thai-to-name (false)
}

interface QuizProps {
  /** Items to quiz on */
  pool: QuizItem[];
  /** Title shown at top */
  title?: string;
  onDone: () => void;
}

export default function Quiz({ pool, title, onDone }: QuizProps) {
  const { T } = useTheme();

  // Filter out items with dash-prefix (vowel placeholders) and leading Thai vowels for char-pick questions
  const quizzable = pool.filter(
    (it) =>
      it.thai &&
      !it.thai.startsWith("-") &&
      !it.thai.startsWith("\u0e40") &&
      !it.thai.startsWith("\u0e41") &&
      !it.thai.startsWith("\u0e42") &&
      !it.thai.startsWith("\u0e43") &&
      !it.thai.startsWith("\u0e44")
  );

  // For name→thai we need the full pool, for thai→name we use quizzable
  const usablePool = quizzable.length >= 2 ? quizzable : pool.filter((it) => it.thai);

  const [qi, setQi] = useState(0);
  const [sc, setSc] = useState(0);
  const [sel, setSel] = useState<{ o: QuizItem; ok: boolean } | null>(null);
  const [qs] = useState<QuizQuestion[]>(() => {
    if (usablePool.length < 2) return [];
    return [...usablePool]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(usablePool.length, 10))
      .map((item) => {
        const others = usablePool
          .filter((x) => x.thai !== item.thai)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        const n2t = "cls" in item || "type" in item;
        return { item, opts: [item, ...others].sort(() => Math.random() - 0.5), n2t };
      });
  });

  if (qs.length === 0 || qi >= qs.length) {
    return (
      <div className="fu" style={{ textAlign: "center", padding: "28px 0" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>
          {qs.length === 0 ? "📭" : sc >= (qs.length || 1) * 0.7 ? "🌟" : "📝"}
        </div>
        <h3 style={{ fontSize: 18, marginBottom: 6 }}>
          {qs.length === 0 ? "Not enough items to quiz" : `${sc}/${qs.length} correct`}
        </h3>
        <p style={{ fontSize: 15, color: T.td, marginBottom: 18 }}>
          {qs.length === 0
            ? "Activate more groups to start practicing."
            : sc >= (qs.length || 1) * 0.7
              ? "Great job!"
              : "Keep practicing!"}
        </p>
        <button
          className="bt"
          onClick={onDone}
          style={{ padding: "10px 24px", borderRadius: 9, background: T.ac, color: "#fff", fontSize: 15, fontWeight: 700 }}
        >
          Done
        </button>
      </div>
    );
  }

  const q = qs[qi];
  const ans = (o: QuizItem) => {
    const ok = o.thai === q.item.thai;
    setSel({ o, ok });
    if (ok) setSc((s) => s + 1);
    setTimeout(() => {
      setSel(null);
      setQi((i) => i + 1);
    }, 750);
  };

  return (
    <div className="fu">
      {title && (
        <div style={{ fontSize: 12, color: T.ac, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, fontWeight: 600 }}>
          {title}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 14, color: T.td }}>Q {qi + 1}/{qs.length}</span>
        <span style={{ fontSize: 14, color: T.ac }}>{sc} correct</span>
      </div>
      <div style={{ height: 3, background: T.sl, borderRadius: 2, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ width: ((qi / qs.length) * 100) + "%", height: "100%", background: T.ac, borderRadius: 2, transition: "width .3s" }} />
      </div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 15, color: T.td, marginBottom: 10 }}>
          {q.n2t ? "Which character is this?" : "How do you read this?"}
        </div>
        <div style={{ fontSize: q.n2t ? 24 : 56, fontWeight: 700, color: T.ac, lineHeight: 1.2 }}>
          {q.n2t ? q.item.pb : q.item.thai}
        </div>
        {q.item.en && <div style={{ fontSize: 13, color: T.tm, marginTop: 4 }}>{q.item.en}</div>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {q.opts.map((o, i) => {
          const isSel = sel?.o === o;
          const isOk = o.thai === q.item.thai;
          let bg = T.qz,
            bc = T.bd;
          if (sel) {
            if (isOk) { bg = T.ok + "22"; bc = T.ok; }
            else if (isSel) { bg = T.no + "22"; bc = T.no; }
          }
          return (
            <button
              key={i}
              className="bt"
              disabled={!!sel}
              onClick={() => ans(o)}
              style={{
                background: bg,
                border: "1px solid " + bc,
                borderRadius: 9,
                padding: "14px 10px",
                fontSize: q.n2t ? 32 : 15,
                fontWeight: 600,
                color: T.tx,
                opacity: sel && !isSel && !isOk ? 0.3 : 1,
                transition: "all .2s",
              }}
            >
              {q.n2t ? o.thai : o.pb}
            </button>
          );
        })}
      </div>
    </div>
  );
}
