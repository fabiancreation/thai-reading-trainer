"use client";

import { useState, useRef } from "react";
import { LessonItem, WordItem, SRSCard } from "@/lib/data/types";
import { useTheme } from "./ThemeProvider";
import { getExplanation } from "@/lib/srs";
import { getConfusables } from "@/lib/data/difficulty";
import {
  type GeneratedQuestion,
  type QuizTypeId,
  getAvailableTypes,
  selectQuizType,
  generateQuestion,
} from "@/lib/quiz-types";

type QuizItem = LessonItem | WordItem;

interface QuizProps {
  pool: QuizItem[];
  preGenerated?: GeneratedQuestion[];
  srs?: Record<string, SRSCard>;
  title?: string;
  onDone: () => void;
  onAnswer?: (item: QuizItem, correct: boolean) => void;
}

export default function Quiz({ pool, preGenerated, title, onDone, onAnswer, srs }: QuizProps) {
  const { T } = useTheme();

  const lessonItems = pool.filter(
    (it): it is LessonItem => "cls" in it || ("type" in it && (it as LessonItem & { type: string }).type !== undefined)
  );
  const usablePool = lessonItems.length >= 2 ? lessonItems : (pool.filter((it) => it.thai) as LessonItem[]);

  const [qi, setQi] = useState(0);
  const [sc, setSc] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [sel, setSel] = useState<{ idx: number; ok: boolean } | null>(null);
  const [wrongInfo, setWrongInfo] = useState<{ item: LessonItem; explanation: string; confusables: string[] } | null>(null);
  const [focusCard, setFocusCard] = useState<LessonItem | null>(null);
  const [introCard, setIntroCard] = useState<LessonItem | null>(null);
  const [sessionStart] = useState(() => Date.now());
  const uniqueItems = useRef(new Set<string>());
  const focusShown = useRef(new Set<string>());
  const introShown = useRef(new Set<string>());

  const [qs, setQs] = useState<GeneratedQuestion[]>(() => {
    if (preGenerated && preGenerated.length > 0) return preGenerated;
    if (usablePool.length < 2) return [];
    const items = [...usablePool]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(usablePool.length, 10));

    let prevType: QuizTypeId | null = null;
    return items.map((item) => {
      const available = getAvailableTypes(item, usablePool, srs?.[item.thai]);
      const type = selectQuizType(available, srs?.[item.thai], prevType);
      prevType = type;
      return generateQuestion(type, item, usablePool);
    });
  });

  const requeued = useRef(new Set<string>());

  const isNewItem = (item: LessonItem) =>
    !srs?.[item.thai] &&
    !("type" in item && item.type === "syllable") &&
    !item.thai.startsWith("rule_") &&
    !item.thai.startsWith("mark_");

  // Check if first question needs intro or focus card
  const [initChecked] = useState(() => {
    if (qs.length > 0) {
      const first = qs[0].item;
      if (srs?.[first.thai]?.status === "leech") {
        setFocusCard(first);
        focusShown.current.add(first.thai);
      } else if (isNewItem(first)) {
        setIntroCard(first);
        introShown.current.add(first.thai);
      }
    }
    return true;
  });
  void initChecked;

  // Advance to next question, checking for focus/intro cards
  const advanceTo = (nextIdx: number) => {
    const nextQ = qs[nextIdx];
    if (!nextQ) { setQi(nextIdx); return; }
    const item = nextQ.item;
    if (srs?.[item.thai]?.status === "leech" && !focusShown.current.has(item.thai)) {
      focusShown.current.add(item.thai);
      setFocusCard(item);
      pendingQi.current = nextIdx;
    } else if (isNewItem(item) && !introShown.current.has(item.thai)) {
      introShown.current.add(item.thai);
      setIntroCard(item);
      pendingQi.current = nextIdx;
    } else {
      setQi(nextIdx);
    }
  };

  const pendingQi = useRef<number | null>(null);

  const dismissCard = () => {
    setFocusCard(null);
    setIntroCard(null);
    if (pendingQi.current !== null) {
      setQi(pendingQi.current);
      pendingQi.current = null;
    }
  };

  // --- End screen with session stats ---
  if (qs.length === 0 || qi >= qs.length) {
    const totalAnswered = sc + wrongCount;
    const accuracy = totalAnswered > 0 ? Math.round((sc / totalAnswered) * 100) : 0;
    const durationMs = Date.now() - sessionStart;
    const mins = Math.floor(durationMs / 60000);
    const secs = Math.floor((durationMs % 60000) / 1000);

    return (
      <div className="fu" style={{ textAlign: "center", padding: "28px 0" }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>
          {qs.length === 0 ? "\uD83D\uDCED" : accuracy >= 70 ? "\uD83C\uDF1F" : "\uD83D\uDCDD"}
        </div>
        <h3 style={{ fontSize: 18, marginBottom: 12 }}>
          {qs.length === 0 ? "Not enough items to quiz" : "Session Complete"}
        </h3>
        {qs.length > 0 && totalAnswered > 0 && (
          <div style={{ fontSize: 14, color: T.td, lineHeight: 2, marginBottom: 18 }}>
            <div><strong style={{ color: T.tx }}>{totalAnswered}</strong> questions answered</div>
            <div>
              <span style={{ color: T.ok, fontWeight: 700 }}>{sc}</span> correct{" "}
              <span style={{ color: T.no, fontWeight: 700 }}>{wrongCount}</span> wrong
            </div>
            <div><strong style={{ color: T.tx }}>{accuracy}%</strong> accuracy</div>
            <div>{mins > 0 ? `${mins}m ` : ""}{secs}s</div>
            <div>{uniqueItems.current.size} unique items</div>
          </div>
        )}
        {qs.length === 0 && (
          <p style={{ fontSize: 15, color: T.td, marginBottom: 18 }}>
            Activate more groups to start practicing.
          </p>
        )}
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
  const cardDifficulty = srs?.[q.item.thai]?.difficulty ?? 0;
  const isLeech = srs?.[q.item.thai]?.status === "leech";

  const ans = (optIdx: number) => {
    const ok = optIdx === q.correctIndex;
    setSel({ idx: optIdx, ok });
    uniqueItems.current.add(q.item.thai);
    if (ok) {
      setSc((s) => s + 1);
      onAnswer?.(q.item, true);
      setTimeout(() => {
        setSel(null);
        advanceTo(qi + 1);
      }, 750);
    } else {
      setWrongCount((w) => w + 1);
      onAnswer?.(q.item, false);
      if (!requeued.current.has(q.item.thai)) {
        requeued.current.add(q.item.thai);
        const offset = 3 + Math.floor(Math.random() * 3);
        const insertAt = Math.min(qi + offset, qs.length);
        const available = getAvailableTypes(q.item, usablePool, srs?.[q.item.thai]);
        const retryType = selectQuizType(available, srs?.[q.item.thai], q.type);
        const retryQ = generateQuestion(retryType, q.item, usablePool);
        setQs((prev) => {
          const next = [...prev];
          next.splice(insertAt, 0, retryQ);
          return next;
        });
      }
      const explanation = getExplanation(q.item);
      const confusables = getConfusables(q.item.thai);
      setWrongInfo({ item: q.item, explanation, confusables });
    }
  };

  const dismissWrong = () => {
    setWrongInfo(null);
    setSel(null);
    advanceTo(qi + 1);
  };

  const displayIsLargeThai = !q.display.match(/[a-zA-Z]/);
  const displayFontSize = displayIsLargeThai ? 56 : 24;

  return (
    <div className="fu">
      {title && (
        <div style={{ fontSize: 12, color: T.ac, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, fontWeight: 600 }}>
          {title}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 14, color: T.td }}>Q {qi + 1}/{qs.length}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {cardDifficulty > 0 && (
            <span style={{ fontSize: 12, color: T.ac }}>
              {"\u2605".repeat(Math.min(cardDifficulty, 5))}
            </span>
          )}
          {isLeech && (
            <span style={{ fontSize: 10, background: "#f59e0b22", color: "#f59e0b", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>
              {"\u26A0\uFE0F"} Leech
            </span>
          )}
          {cardDifficulty >= 3 && !isLeech && (
            <span style={{ fontSize: 10, background: T.no + "22", color: T.no, padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>
              Hard
            </span>
          )}
          <span style={{ fontSize: 14, color: T.ac }}>{sc} correct</span>
        </span>
      </div>
      <div style={{ height: 3, background: T.sl, borderRadius: 2, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ width: ((qi / qs.length) * 100) + "%", height: "100%", background: T.ac, borderRadius: 2, transition: "width .3s" }} />
      </div>

      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 15, color: T.td, marginBottom: 10 }}>
          {q.prompt}
        </div>
        {q.display && (
          <div style={{ fontSize: displayFontSize, fontWeight: 700, color: T.ac, lineHeight: 1.2 }}>
            {q.display}
          </div>
        )}
        {q.subtitle && (
          <div style={{ fontSize: 13, color: T.tm, marginTop: 4 }}>{q.subtitle}</div>
        )}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: q.options.length === 2 ? "1fr 1fr" : q.options.length === 3 ? "1fr 1fr 1fr" : "1fr 1fr",
        gap: 8,
      }}>
        {q.options.map((o, i) => {
          const isSel = sel?.idx === i;
          const isCorrect = i === q.correctIndex;
          let bg = T.qz, bc = T.bd;
          if (sel) {
            if (isCorrect) { bg = T.ok + "22"; bc = T.ok; }
            else if (isSel) { bg = T.no + "22"; bc = T.no; }
          }
          return (
            <button
              key={i}
              className="bt"
              disabled={!!sel}
              onClick={() => ans(i)}
              style={{
                background: bg,
                border: "1px solid " + bc,
                borderRadius: 9,
                padding: "14px 10px",
                fontSize: o.large ? 32 : 15,
                fontWeight: 600,
                color: T.tx,
                opacity: sel && !isSel && !isCorrect ? 0.3 : 1,
                transition: "all .2s",
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>

      {/* Wrong answer explanation overlay */}
      {wrongInfo && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, padding: 20,
        }}>
          <div style={{
            background: T.sf, borderRadius: 16, padding: "28px 24px",
            maxWidth: 340, width: "100%", textAlign: "center",
            border: "1px solid " + T.bd,
          }}>
            <div style={{ fontSize: 48, fontWeight: 700, color: T.ac, marginBottom: 8 }}>
              {wrongInfo.item.thai}
            </div>
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4, color: T.tx }}>
              {wrongInfo.item.pb}
            </div>
            {wrongInfo.explanation && (
              <div style={{ fontSize: 14, color: T.td, lineHeight: 1.5, marginBottom: 8 }}>
                {wrongInfo.explanation}
              </div>
            )}
            {wrongInfo.confusables.length > 0 && (
              <div style={{ fontSize: 13, color: T.no, marginBottom: 16 }}>
                Often confused with: {wrongInfo.confusables.join(", ")}
              </div>
            )}
            <button
              className="bt"
              onClick={dismissWrong}
              style={{
                padding: "12px 32px", borderRadius: 9,
                background: T.ac, color: "#fff",
                fontSize: 15, fontWeight: 700,
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Focus card for leech items */}
      {focusCard && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, padding: 20,
        }}>
          <div style={{
            background: T.sf, borderRadius: 16, padding: "32px 24px",
            maxWidth: 340, width: "100%", textAlign: "center",
            border: "2px solid #f59e0b",
          }}>
            <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
              {"\u26A0\uFE0F"} Focus Card
            </div>
            <div style={{ fontSize: 72, fontWeight: 700, color: T.ac, marginBottom: 8 }}>
              {focusCard.thai}
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4, color: T.tx }}>
              {focusCard.pb}
            </div>
            <div style={{ fontSize: 15, color: T.td, marginBottom: 4 }}>
              {focusCard.en}
            </div>
            {"cls" in focusCard && (
              <div style={{ fontSize: 13, color: T.td, marginBottom: 8 }}>
                Class: <strong>{focusCard.cls.charAt(0).toUpperCase() + focusCard.cls.slice(1)}</strong>
              </div>
            )}
            {(() => {
              const conf = getConfusables(focusCard.thai);
              return conf.length > 0 ? (
                <div style={{ fontSize: 13, color: T.no, marginBottom: 16 }}>
                  Often confused with: {conf.join(", ")}
                </div>
              ) : null;
            })()}
            <div style={{ fontSize: 13, color: "#f59e0b", marginBottom: 16 }}>
              This character needs extra attention
            </div>
            <button
              className="bt"
              onClick={dismissCard}
              style={{
                padding: "12px 32px", borderRadius: 9,
                background: T.ac, color: "#fff",
                fontSize: 15, fontWeight: 700,
              }}
            >
              Ready
            </button>
          </div>
        </div>
      )}

      {/* Introduction card for new items */}
      {introCard && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 200, padding: 20,
        }}>
          <div style={{
            background: T.sf, borderRadius: 16, padding: "32px 24px",
            maxWidth: 340, width: "100%", textAlign: "center",
            border: "2px solid " + T.ac,
          }}>
            <div style={{ fontSize: 12, color: T.ac, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
              New Character
            </div>
            <div style={{ fontSize: 72, fontWeight: 700, color: T.ac, marginBottom: 8 }}>
              {introCard.thai}
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 4, color: T.tx }}>
              {introCard.pb}
            </div>
            <div style={{ fontSize: 15, color: T.td, marginBottom: 4 }}>
              {introCard.en}
            </div>
            {"cls" in introCard && (
              <div style={{ fontSize: 13, color: T.td, marginBottom: 8 }}>
                Class: <strong>{introCard.cls.charAt(0).toUpperCase() + introCard.cls.slice(1)}</strong>
              </div>
            )}
            {"pos" in introCard && (
              <div style={{ fontSize: 13, color: T.td, marginBottom: 8 }}>
                Position: <strong>{(introCard as { pos: string }).pos}</strong>
              </div>
            )}
            <button
              className="bt"
              onClick={dismissCard}
              style={{
                padding: "12px 32px", borderRadius: 9,
                background: T.ac, color: "#fff",
                fontSize: 15, fontWeight: 700,
              }}
            >
              Start Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
