"use client";

import { useTheme, Theme } from "./ThemeProvider";
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
import { getDueCount, getNewItems } from "@/lib/srs";

type PracticeMode =
  | { kind: "consonants" }
  | { kind: "vowels" }
  | { kind: "all" }
  | { kind: "reading" }
  | { kind: "tones" }
  | { kind: "group"; groupId: string };

interface HomeProps {
  onPractice: (mode: PracticeMode) => void;
  onDailyMix: () => void;
}

const cc = (c: string, T: Theme) =>
  c === "mid" ? T.mid : c === "high" ? T.high : T.low;

export type { PracticeMode };

export default function Home({ onPractice, onDailyMix }: HomeProps) {
  const { T, progress, updateProgress } = useTheme();
  const active = progress.activeGroups || [];

  const dueCount = getDueCount(progress.srs, active);
  const newCount = getNewItems(active, progress.srs).length;

  const toggleGroup = (id: string) => {
    updateProgress((p) => {
      const cur = p.activeGroups || [];
      const next = cur.includes(id)
        ? cur.filter((g) => g !== id)
        : [...cur, id];
      return { ...p, activeGroups: next };
    });
  };

  const toggleAllGroups = (groupIds: string[], activate: boolean) => {
    updateProgress((p) => {
      const cur = p.activeGroups || [];
      if (activate) {
        const next = [...new Set([...cur, ...groupIds])];
        return { ...p, activeGroups: next };
      } else {
        const remove = new Set(groupIds);
        return { ...p, activeGroups: cur.filter((g) => !remove.has(g)) };
      }
    });
  };

  const conCount = getActiveConsonants(active).length;
  const vowCount = getActiveVowels(active).length;
  const hasCon = hasActiveConsonants(active);
  const hasVow = hasActiveVowels(active);
  const totalActive = ALL_GROUPS.filter((g) => active.includes(g.id))
    .reduce((n, g) => n + g.items.length, 0);

  const streakDays = progress.streak?.current ?? 0;

  return (
    <div className="fu">
      {/* Streak */}
      {streakDays > 0 && (
        <div style={{ textAlign: "center", marginBottom: 16, padding: "10px", background: T.sf, borderRadius: 10, border: "1px solid " + T.bd }}>
          <span style={{ fontSize: 20 }}>{"\uD83D\uDD25"}</span>
          <span style={{ fontSize: 17, fontWeight: 700, marginLeft: 6 }}>
            {streakDays} day{streakDays !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Daily Mix */}
      {totalActive > 0 && (
        <div style={{ marginBottom: 16 }}>
          <button
            className="bt"
            onClick={onDailyMix}
            style={{
              width: "100%",
              background: T.ac,
              color: "#fff",
              borderRadius: 12,
              padding: "16px 18px",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700 }}>Daily Mix</div>
                <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>
                  {dueCount > 0 ? `${dueCount} due` : "No reviews due"}
                  {newCount > 0 ? ` \u00B7 ${newCount} new` : ""}
                </div>
              </div>
              <div style={{ fontSize: 24 }}>{"\u25B6"}</div>
            </div>
          </button>
        </div>
      )}

      {/* Practice buttons */}
      {totalActive > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: T.td, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, fontWeight: 600 }}>
            Targeted Practice
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <PracticeButton
              T={T}
              label="All Active"
              sub={`${totalActive} cards`}
              disabled={totalActive < 2}
              onClick={() => onPractice({ kind: "all" })}
            />
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
              onClick={() => onPractice({ kind: "reading" })}
            />
            <PracticeButton
              T={T}
              label="Tones"
              sub={active.includes("tone_rules") || active.includes("tone_marks") ? "Rules & Marks" : "Activate tone group"}
              disabled={!active.includes("tone_rules") && !active.includes("tone_marks")}
              onClick={() => onPractice({ kind: "tones" })}
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
        onToggleAll={toggleAllGroups}
        onDrill={(id) => onPractice({ kind: "group", groupId: id })}
      />
      <GroupSection
        T={T}
        title="Vowels"
        groups={VOWEL_GROUPS}
        active={active}
        onToggle={toggleGroup}
        onToggleAll={toggleAllGroups}
        onDrill={(id) => onPractice({ kind: "group", groupId: id })}
      />
      <GroupSection
        T={T}
        title="Tone System"
        groups={TONE_GROUPS}
        active={active}
        onToggle={toggleGroup}
        onToggleAll={toggleAllGroups}
        onDrill={(id) => onPractice({ kind: "group", groupId: id })}
      />

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

function GroupSection({ T, title, groups, active, onToggle, onToggleAll, onDrill }: {
  T: Theme; title: string; groups: CharacterGroup[]; active: string[];
  onToggle: (id: string) => void; onToggleAll: (groupIds: string[], activate: boolean) => void; onDrill: (id: string) => void;
}) {
  const groupIds = groups.filter((g) => g.items.length > 0).map((g) => g.id);
  const allActive = groupIds.length > 0 && groupIds.every((id) => active.includes(id));
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: T.td, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>
          {title}
        </div>
        {groupIds.length > 1 && (
          <button
            className="bt"
            onClick={() => onToggleAll(groupIds, !allActive)}
            style={{ fontSize: 11, color: T.ac, background: "none", fontWeight: 600 }}
          >
            {allActive ? "Deselect all" : "Select all"}
          </button>
        )}
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
