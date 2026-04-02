"use client";

import { useTheme, Theme } from "./ThemeProvider";
import { LESSONS } from "@/lib/data/lessons";
import {
  ALL_GROUPS,
  CONSONANT_GROUPS,
  VOWEL_GROUPS,
  TONE_GROUPS,
  CharacterGroup,
  hasActiveConsonants,
  hasActiveVowels,
  getActiveConsonants,
  getActiveVowels,
} from "@/lib/data/groups";

type PracticeMode =
  | { kind: "consonants" }
  | { kind: "vowels" }
  | { kind: "group"; groupId: string };

interface HomeProps {
  onPractice: (mode: PracticeMode) => void;
  openLesson: (index: number) => void;
}

const cc = (c: string, T: Theme) =>
  c === "mid" ? T.mid : c === "high" ? T.high : T.low;

export type { PracticeMode };

export default function Home({ onPractice, openLesson }: HomeProps) {
  const { T, progress, updateProgress } = useTheme();
  const active = progress.activeGroups || [];

  const toggleGroup = (id: string) => {
    updateProgress((p) => {
      const cur = p.activeGroups || [];
      const next = cur.includes(id)
        ? cur.filter((g) => g !== id)
        : [...cur, id];
      return { ...p, activeGroups: next };
    });
  };

  const conCount = getActiveConsonants(active).length;
  const vowCount = getActiveVowels(active).length;
  const hasCon = hasActiveConsonants(active);
  const hasVow = hasActiveVowels(active);
  const totalActive = ALL_GROUPS.filter((g) => active.includes(g.id))
    .reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="fu">
      {/* Practice buttons */}
      {totalActive > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: T.td, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontWeight: 600 }}>
            Targeted Practice
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <PracticeButton
              T={T}
              label="Consonants"
              sub={`${conCount} cards`}
              disabled={!hasCon}
              onClick={() => onPractice({ kind: "consonants" })}
            />
            <PracticeButton
              T={T}
              label="Vowels"
              sub={`${vowCount} cards`}
              disabled={!hasVow}
              onClick={() => onPractice({ kind: "vowels" })}
            />
            <PracticeButton
              T={T}
              label="Reading"
              sub={hasCon && hasVow ? "Syllables" : "Need both"}
              disabled={!hasCon || !hasVow}
              onClick={() => {}}
              comingSoon={!(hasCon && hasVow)}
            />
            <PracticeButton
              T={T}
              label="Tones"
              sub="Rules"
              disabled={!active.includes("tone_rules")}
              onClick={() => {}}
              comingSoon
            />
          </div>
        </div>
      )}

      {totalActive === 0 && (
        <div style={{
          background: T.ac + "0d",
          border: "1px solid " + T.ac + "22",
          borderRadius: 10,
          padding: "16px",
          marginBottom: 24,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>👆</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Activate your first group</div>
          <div style={{ fontSize: 13, color: T.td, lineHeight: 1.5 }}>
            Tap a group below to add it to your practice pool.
            Start with whatever your class is covering right now.
          </div>
        </div>
      )}

      {/* Groups */}
      <GroupSection
        T={T}
        title="Consonants"
        groups={CONSONANT_GROUPS}
        active={active}
        onToggle={toggleGroup}
        onDrill={(id) => onPractice({ kind: "group", groupId: id })}
      />
      <GroupSection
        T={T}
        title="Vowels"
        groups={VOWEL_GROUPS}
        active={active}
        onToggle={toggleGroup}
        onDrill={(id) => onPractice({ kind: "group", groupId: id })}
      />
      <GroupSection
        T={T}
        title="Tone System"
        groups={TONE_GROUPS}
        active={active}
        onToggle={toggleGroup}
        onDrill={(id) => onPractice({ kind: "group", groupId: id })}
      />

      {/* Lessons */}
      <LessonsSection T={T} done={progress.done || []} openLesson={openLesson} />

      {/* Stats bar */}
      {totalActive > 0 && (
        <div style={{ marginTop: 24, padding: "14px 16px", background: T.sf, border: "1px solid " + T.bd, borderRadius: 10 }}>
          <div style={{ fontSize: 12, color: T.td, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontWeight: 600 }}>
            Progress
          </div>
          <StatBar T={T} label="Consonants" current={conCount} total={44} />
          <StatBar T={T} label="Vowels" current={vowCount} total={30} />
        </div>
      )}
    </div>
  );
}

// --- Sub-components ---

function PracticeButton({ T, label, sub, disabled, onClick, comingSoon }: {
  T: Theme; label: string; sub: string; disabled: boolean;
  onClick: () => void; comingSoon?: boolean;
}) {
  return (
    <button
      className="bt"
      disabled={disabled}
      onClick={onClick}
      style={{
        background: disabled ? T.sl : T.ac,
        color: disabled ? T.tm : "#fff",
        borderRadius: 10,
        padding: "14px 12px",
        textAlign: "left",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
        {comingSoon && disabled ? "Coming soon" : sub}
      </div>
    </button>
  );
}

function GroupSection({ T, title, groups, active, onToggle, onDrill }: {
  T: Theme; title: string; groups: CharacterGroup[]; active: string[];
  onToggle: (id: string) => void; onDrill: (id: string) => void;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, color: T.td, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {groups.map((g) => {
          const isActive = active.includes(g.id);
          const hasItems = g.items.length > 0;
          return (
            <div
              key={g.id}
              style={{
                background: isActive ? T.ok + "0d" : T.sf,
                border: "1px solid " + (isActive ? T.ok + "33" : T.bd),
                borderRadius: 10,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              {/* Toggle */}
              <button
                className="bt"
                onClick={() => onToggle(g.id)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: isActive ? T.ok : T.sl,
                  color: isActive ? "#fff" : T.tm,
                  fontSize: 14,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isActive ? "✓" : ""}
              </button>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{g.name}</div>
                {hasItems && (
                  <div style={{ fontSize: 12, color: T.tm, marginTop: 1 }}>
                    {g.items.length} {g.items.length === 1 ? "item" : "items"}
                    {g.category === "consonant" && (
                      <span> · {g.items.map((it) => it.thai).join(" ")}</span>
                    )}
                    {g.pairLabel && (
                      <span> · {g.items.map((it) => it.thai).join("  ")}</span>
                    )}
                  </div>
                )}
                {!hasItems && g.id === "tone_rules" && (
                  <div style={{ fontSize: 12, color: T.tm, marginTop: 1 }}>Theory reference</div>
                )}
              </div>

              {/* Drill button */}
              {isActive && hasItems && (
                <button
                  className="bt"
                  onClick={(e) => { e.stopPropagation(); onDrill(g.id); }}
                  style={{
                    background: T.ac,
                    color: "#fff",
                    borderRadius: 7,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  Drill
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LessonsSection({ T, done, openLesson }: { T: Theme; done: number[]; openLesson: (i: number) => void }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, color: T.td, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>
        Lessons
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {LESSONS.map((l, i) => {
          const isDone = done.includes(l.id);
          return (
            <div
              key={l.id}
              className="ch"
              onClick={() => openLesson(i)}
              style={{
                background: isDone ? T.ok + "0d" : T.sf,
                border: "1px solid " + (isDone ? T.ok + "33" : T.bd),
                borderRadius: 10,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: isDone ? T.ok : T.sl,
                color: isDone ? "#fff" : T.tm,
                fontSize: 13,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                {isDone ? "✓" : i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{l.title}</div>
                <div style={{ fontSize: 12, color: T.tm, marginTop: 1 }}>
                  {l.phase}{l.items.length > 0 ? ` · ${l.items.length} items` : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatBar({ T, label, current, total }: { T: Theme; label: string; current: number; total: number }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 13, color: T.td }}>{label}</span>
        <span style={{ fontSize: 13, color: T.ac, fontWeight: 600 }}>{current}/{total}</span>
      </div>
      <div style={{ height: 5, background: T.sl, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: pct + "%", height: "100%", background: T.ac, borderRadius: 3, transition: "width .5s" }} />
      </div>
    </div>
  );
}
