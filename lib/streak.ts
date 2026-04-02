import { StreakData } from "./data/types";

function getToday(): string {
  return new Date().toLocaleDateString("en-CA"); // "YYYY-MM-DD" in local time
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA");
}

export function updateStreak(prev: StreakData | undefined): StreakData {
  const today = getToday();
  if (!prev) return { current: 1, lastPracticeDate: today };
  if (prev.lastPracticeDate === today) return prev; // already practiced today
  if (prev.lastPracticeDate === getYesterday()) {
    return { current: prev.current + 1, lastPracticeDate: today };
  }
  return { current: 1, lastPracticeDate: today }; // streak broken
}
