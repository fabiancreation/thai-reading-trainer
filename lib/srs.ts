import { SRSCard, SRSCategory, LessonItem } from "./data/types";
import { getActiveItems } from "./data/groups";
import { getBaseDifficulty } from "./data/difficulty";

// --- SM-2 Algorithm ---

export function reviewCard(
  existing: SRSCard | undefined,
  correct: boolean,
  thai: string,
  category: SRSCategory
): SRSCard {
  const now = new Date();
  const baseDiff = getBaseDifficulty(thai);
  const prev = existing
    ? {
        ...existing,
        lapses: existing.lapses ?? 0,
        status: existing.status ?? "learning",
        difficulty: existing.difficulty ?? baseDiff,
        consecutiveCorrect: existing.consecutiveCorrect ?? 0,
      }
    : { thai, interval: 0, ease: 2.5, due: now.toISOString(), reps: 0, lapses: 0, category, status: "new" as const, difficulty: baseDiff, consecutiveCorrect: 0 };

  let interval: number;
  let ease = prev.ease;
  let reps: number;
  let lapses = prev.lapses;
  let status: SRSCard["status"];
  let difficulty = prev.difficulty;
  let consecutiveCorrect = prev.consecutiveCorrect;

  if (correct) {
    if (prev.reps === 0) interval = 1;
    else if (prev.reps === 1) interval = 3;
    else interval = Math.round(prev.interval * ease);
    reps = prev.reps + 1;
    ease = Math.min(3.0, ease + 0.1);
    status = reps >= 3 ? "review" : "learning";
    // Leech: keep status until 3 consecutive correct, cap interval at 3 days
    if (prev.status === "leech") {
      interval = Math.min(interval, 3);
      if (consecutiveCorrect + 1 < 3) status = "leech";
    }
    // Difficulty decay
    consecutiveCorrect += 1;
    if (consecutiveCorrect >= 3 && difficulty > baseDiff) {
      difficulty -= 1;
      consecutiveCorrect = 0;
    }
  } else {
    reps = 0;
    interval = 1;
    ease = Math.max(1.3, ease - 0.2);
    lapses += 1;
    status = lapses >= 5 ? "leech" : "learning";
    // Difficulty increase
    consecutiveCorrect = 0;
    if (difficulty < 5) {
      difficulty += 1;
    }
  }

  const due = new Date(now);
  due.setDate(due.getDate() + interval);

  return { thai, interval, ease, due: due.toISOString(), reps, lapses, category, status, difficulty, consecutiveCorrect };
}

export function isHard(card: SRSCard | undefined): boolean {
  return (card?.difficulty ?? 0) >= 3;
}

// --- Query helpers ---

export function isDue(card: SRSCard | undefined): boolean {
  if (!card) return false; // no card = never reviewed, not "due"
  return new Date(card.due) <= new Date();
}

export function inferCategory(item: LessonItem): SRSCategory {
  if ("cls" in item) return "consonant";
  if ("type" in item && item.type === "tone_mark") return "tone_mark";
  if ("type" in item && item.type === "syllable") return "syllable";
  return "vowel";
}

/** Count due SRS cards that belong to currently active groups */
export function getDueCount(srs: Record<string, SRSCard>, activeGroups: string[]): number {
  const activeItems = getActiveItems(activeGroups);
  const activeThais = new Set(activeItems.map((it) => it.thai));
  return Object.values(srs).filter((c) => activeThais.has(c.thai) && isDue(c)).length;
}

/** Items from active groups that have no SRS card yet */
export function getNewItems(activeGroups: string[], srs: Record<string, SRSCard>): LessonItem[] {
  return getActiveItems(activeGroups).filter((it) => !srs[it.thai]);
}

// --- Daily Mix builder ---

export function buildDailyMix(
  activeGroups: string[],
  srs: Record<string, SRSCard>
): { items: LessonItem[]; dueCount: number; newCount: number } {
  const allActive = getActiveItems(activeGroups);
  const lookup = new Map<string, LessonItem>();
  for (const it of allActive) lookup.set(it.thai, it);

  // Due items (have SRS card & are due)
  const dueItems = allActive.filter((it) => srs[it.thai] && isDue(srs[it.thai]));
  // New items (no SRS card)
  const newItems = allActive.filter((it) => !srs[it.thai]);

  // Target 15-25 items
  const available = dueItems.length + newItems.length;
  const target = Math.max(15, Math.min(25, available));

  // 70% due, 30% new, max 5 new per session
  let dueSlots = Math.min(Math.floor(target * 0.7), dueItems.length);
  let newSlots = Math.min(target - dueSlots, 5, newItems.length);

  // Fill remaining slots if one pool is short
  if (dueSlots + newSlots < target) {
    const remaining = target - dueSlots - newSlots;
    if (dueItems.length > dueSlots) {
      dueSlots = Math.min(dueSlots + remaining, dueItems.length);
    } else if (newItems.length > newSlots) {
      newSlots = Math.min(newSlots + remaining, newItems.length);
    }
  }

  // Sort by difficulty descending so hard items are picked first
  const sortedDue = [...dueItems].sort((a, b) => {
    const da = srs[a.thai]?.difficulty ?? 0;
    const db = srs[b.thai]?.difficulty ?? 0;
    return db - da;
  });
  const pickedDue = shuffle(sortedDue.slice(0, dueSlots));
  const pickedNew = shuffle([...newItems]).slice(0, newSlots);
  const items = shuffle([...pickedDue, ...pickedNew]);

  return { items, dueCount: dueItems.length, newCount: newItems.length };
}

// --- Explanation generator ---

export function getExplanation(item: LessonItem): string {
  if ("cls" in item) {
    const cls = item.cls.charAt(0).toUpperCase() + item.cls.slice(1);
    return `${item.thai} is ${item.pb} (${item.en}). ${cls} class.`;
  }
  if ("type" in item && item.type === "tone_mark") {
    return `${item.thai} is ${item.pb} (${item.en}).`;
  }
  if ("type" in item && item.type === "syllable") {
    const s = item as import("./data/types").SyllableItem;
    return `${s.thai} = ${s.consonant.thai} (${s.consonant.sound}) + ${s.vowel.thai} (${s.en.split(" + ")[1]}) = "${s.pb}"`;
  }
  // vowel
  const vowel = item as import("./data/types").VowelItem;
  return `${vowel.thai} is ${vowel.pb} (${vowel.en}). Position: ${vowel.pos}.`;
}

// --- Util ---

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
