"use client";

import { useState } from "react";
import { LESSONS } from "@/lib/data/lessons";
import { useTheme } from "./ThemeProvider";

interface FlashCard {
  thai: string;
  pb: string;
  en: string;
  cls?: string;
}

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

function classLabel(cls: string): string {
  if (cls === "mid") return "MID";
  if (cls === "high") return "HIGH";
  return "LOW";
}

export default function Flashcards() {
  const { progress } = useTheme();

  const cards: FlashCard[] = LESSONS.filter((l) => (progress.done || []).includes(l.id)).flatMap(
    (l) => [
      ...l.items
        .filter((it) => !it.thai.startsWith("-"))
        .map((it) => ({
          thai: it.thai,
          pb: it.pb,
          en: it.en,
          cls: "cls" in it ? it.cls : undefined,
        })),
      ...(l.words || []).map((w) => ({ thai: w.thai, pb: w.pb, en: w.en })),
    ]
  );

  const [deck, setDeck] = useState(() => [...cards].sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);
  const [st, setSt] = useState({ r: 0, w: 0 });

  if (cards.length === 0) {
    return (
      <div className="animate-fade-up text-center py-9">
        <div className="text-4xl mb-2.5">{"\uD83D\uDCDA"}</div>
        <h3 className="text-lg mb-1">No cards yet</h3>
        <p className="text-[15px] text-muted">Complete a lesson first.</p>
      </div>
    );
  }

  if (idx >= deck.length) {
    return (
      <div className="animate-fade-up text-center py-9">
        <div className="text-4xl mb-2.5">{"\u2705"}</div>
        <h3 className="text-lg mb-1">Deck complete!</h3>
        <p className="text-[15px] text-muted mb-5">
          {st.r} correct, {st.w} to review
        </p>
        <button
          onClick={() => {
            setDeck([...cards].sort(() => Math.random() - 0.5));
            setIdx(0);
            setFlip(false);
            setSt({ r: 0, w: 0 });
          }}
          className="px-6 py-2.5 rounded-[9px] bg-accent text-white text-[15px] font-bold btn-base"
        >
          Again
        </button>
      </div>
    );
  }

  const c = deck[idx];
  const go = (ok: boolean) => {
    setSt((s) => ({ ...s, [ok ? "r" : "w"]: s[ok ? "r" : "w"] + 1 }));
    setFlip(false);
    setIdx((i) => i + 1);
  };

  return (
    <div className="animate-fade-up">
      <div className="flex justify-between mb-3.5">
        <span className="text-sm text-muted">
          Card {idx + 1}/{deck.length}
        </span>
        <span className="text-sm">
          <span className="text-ok">{st.r}{"\u2713"}</span>{" "}
          <span className="text-no">{st.w}{"\u2717"}</span>
        </span>
      </div>

      <div
        onClick={() => setFlip(!flip)}
        className="bg-card border border-border rounded-[14px] py-11 px-5 text-center cursor-pointer min-h-[180px] flex flex-col items-center justify-center"
      >
        {!flip ? (
          <>
            <div className="text-[64px] font-bold text-accent mb-1.5">{c.thai}</div>
            <div className="text-sm text-muted-light">Tap to flip</div>
          </>
        ) : (
          <>
            <div className="text-[32px] font-semibold text-muted mb-1.5">{c.thai}</div>
            <div className="text-[22px] font-bold mb-1">{c.pb}</div>
            <div className="text-[15px] text-muted">{c.en}</div>
            {c.cls && (
              <span
                className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded mt-1.5 ${classBg(
                  c.cls
                )}`}
              >
                {classLabel(c.cls)}
              </span>
            )}
          </>
        )}
      </div>

      {flip && (
        <div className="grid grid-cols-2 gap-2.5 mt-3.5">
          <button
            onClick={() => go(false)}
            className="py-3 rounded-[9px] bg-no/[0.09] border border-no/20 text-no text-[15px] font-bold btn-base"
          >
            Again
          </button>
          <button
            onClick={() => go(true)}
            className="py-3 rounded-[9px] bg-ok/[0.09] border border-ok/20 text-ok text-[15px] font-bold btn-base"
          >
            Got it!
          </button>
        </div>
      )}
    </div>
  );
}
