"use client";

import { useState, useMemo } from "react";
import { SRSCard } from "@/lib/data/types";
import { useTheme, Theme } from "./ThemeProvider";
import { reviewCard as srsReview, isDue } from "@/lib/srs";
import { ALL_GROUPS } from "@/lib/data/groups";

interface FlashCard {
  thai: string;
  pb: string;
  en: string;
  cls?: string;
}

const cc = (c: string, T: Theme) => c === "mid" ? T.mid : c === "high" ? T.high : T.low;
const CL = (c: string) => c === "mid" ? "MID" : c === "high" ? "HIGH" : "LOW";

/** For flashcard deck: new cards (no SRS entry) count as due */
function isFlashcardDue(card: SRSCard | undefined): boolean {
  if (!card) return true;
  return isDue(card);
}

export default function Flashcards() {
  const { T, progress, updateProgress } = useTheme();

  // All cards that have SRS entries (from any source: lessons, drills, daily mix)
  const allCards: FlashCard[] = useMemo(() => {
    const srsKeys = new Set(Object.keys(progress.srs));
    if (srsKeys.size === 0) return [];
    // Build lookup from all groups
    const cards: FlashCard[] = [];
    for (const g of ALL_GROUPS) {
      for (const it of g.items) {
        if (srsKeys.has(it.thai) && !it.thai.startsWith("-")) {
          cards.push({
            thai: it.thai,
            pb: it.pb,
            en: it.en,
            cls: "cls" in it ? it.cls : undefined,
          });
          srsKeys.delete(it.thai); // avoid duplicates
        }
      }
    }
    return cards;
  }, [progress.srs]);

  // Filter to only due cards
  const dueCards = useMemo(() =>
    allCards.filter((c) => isFlashcardDue(progress.srs[c.thai])),
    [allCards, progress.srs]);

  const [deck, setDeck] = useState(() => [...dueCards].sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(0);
  const [flip, setFlip] = useState(false);
  const [st, setSt] = useState({ r: 0, w: 0 });

  const reviewCard = (card: FlashCard, gotIt: boolean) => {
    const category = card.cls ? "consonant" as const : "vowel" as const;
    updateProgress((p) => ({
      ...p,
      srs: { ...p.srs, [card.thai]: srsReview(p.srs[card.thai], gotIt, card.thai, category) },
    }));
  };

  if (allCards.length === 0) {
    return (
      <div className="fu" style={{ textAlign: "center", padding: "36px 0" }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>{"\uD83D\uDCDA"}</div>
        <h3 style={{ fontSize: 18, marginBottom: 5 }}>No cards yet</h3>
        <p style={{ fontSize: 15, color: T.td }}>Complete a lesson first.</p>
      </div>
    );
  }

  if (deck.length === 0 || idx >= deck.length) {
    const totalReviewed = st.r + st.w;
    const nextDueCards = allCards.filter((c) => isFlashcardDue(progress.srs[c.thai]));

    return (
      <div className="fu" style={{ textAlign: "center", padding: "36px 0" }}>
        <div style={{ fontSize: 36, marginBottom: 10 }}>{totalReviewed > 0 ? "\u2705" : "\uD83C\uDF1F"}</div>
        <h3 style={{ fontSize: 18, marginBottom: 5 }}>
          {totalReviewed > 0 ? "Deck complete!" : "All caught up!"}
        </h3>
        {totalReviewed > 0 ? (
          <p style={{ fontSize: 15, color: T.td, marginBottom: 18 }}>{st.r} correct, {st.w} to review</p>
        ) : (
          <p style={{ fontSize: 15, color: T.td, marginBottom: 18 }}>No cards due right now. Come back later.</p>
        )}
        <div style={{ fontSize: 13, color: T.tm, marginBottom: 18 }}>
          {allCards.length} cards total &middot; {nextDueCards.length} due now
        </div>
        {nextDueCards.length > 0 && (
          <button className="bt" onClick={() => {
            setDeck([...nextDueCards].sort(() => Math.random() - 0.5));
            setIdx(0); setFlip(false); setSt({ r: 0, w: 0 });
          }} style={{ padding: "10px 24px", borderRadius: 9, background: T.ac, color: "#fff", fontSize: 15, fontWeight: 700 }}>
            Review {nextDueCards.length} cards
          </button>
        )}
      </div>
    );
  }

  const c = deck[idx];
  const go = (ok: boolean) => {
    reviewCard(c, ok);
    setSt((s) => ({ ...s, [ok ? "r" : "w"]: s[ok ? "r" : "w"] + 1 }));
    setFlip(false);
    setIdx((i) => i + 1);
  };

  return (
    <div className="fu">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 14, color: T.td }}>Card {idx + 1}/{deck.length}</span>
        <span style={{ fontSize: 14 }}>
          <span style={{ color: T.ok }}>{st.r}{"\u2713"}</span>{" "}
          <span style={{ color: T.no }}>{st.w}{"\u2717"}</span>
        </span>
      </div>
      <div onClick={() => setFlip(!flip)} style={{
        background: T.cd, border: "1px solid " + T.bd, borderRadius: 14,
        padding: "44px 20px", textAlign: "center", cursor: "pointer", minHeight: 180,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        {!flip ? (
          <>
            <div style={{ fontSize: 64, fontWeight: 700, color: T.ac, marginBottom: 6 }}>{c.thai}</div>
            <div style={{ fontSize: 14, color: T.tm }}>Tap to flip</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 32, fontWeight: 600, color: T.td, marginBottom: 6 }}>{c.thai}</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 3 }}>{c.pb}</div>
            <div style={{ fontSize: 15, color: T.td }}>{c.en}</div>
            {c.cls && <div style={{ display: "inline-block", fontSize: 11, color: cc(c.cls, T), background: cc(c.cls, T) + "15", padding: "2px 8px", borderRadius: 4, marginTop: 6, fontWeight: 700 }}>{CL(c.cls)}</div>}
          </>
        )}
      </div>
      {flip && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
          <button className="bt" onClick={() => go(false)} style={{ padding: "12px", borderRadius: 9, background: T.no + "18", border: "1px solid " + T.no + "33", color: T.no, fontSize: 15, fontWeight: 700 }}>Again</button>
          <button className="bt" onClick={() => go(true)} style={{ padding: "12px", borderRadius: 9, background: T.ok + "18", border: "1px solid " + T.ok + "33", color: T.ok, fontSize: 15, fontWeight: 700 }}>Got it!</button>
        </div>
      )}
    </div>
  );
}
