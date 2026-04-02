import { supabase } from "./supabase";
import { UserProgress } from "./data/types";
import { getUserId } from "./user";

const DEFAULT_PROGRESS: UserProgress = { done: [], srs: {}, activeGroups: [] };

function storageKey(): string {
  return "thai-rt-" + getUserId();
}

function localLoad(): { pg: UserProgress; dk: boolean } {
  if (typeof window === "undefined") return { pg: DEFAULT_PROGRESS, dk: false };
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw) return { pg: DEFAULT_PROGRESS, dk: false };
    const parsed = JSON.parse(raw);
    return { pg: parsed.pg || DEFAULT_PROGRESS, dk: parsed.dk || false };
  } catch {
    return { pg: DEFAULT_PROGRESS, dk: false };
  }
}

function localSave(pg: UserProgress, dk: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(), JSON.stringify({ pg, dk }));
  } catch {
    // quota exceeded
  }
}

export async function loadProgress(): Promise<UserProgress> {
  const userId = getUserId();
  if (!supabase) return localLoad().pg;
  try {
    const { data } = await supabase
      .from("user_progress")
      .select("completed_lessons, srs_cards, active_groups, preferences")
      .eq("user_id", userId)
      .single();
    if (!data) return localLoad().pg;
    return {
      done: data.completed_lessons || [],
      srs: data.srs_cards || {},
      activeGroups: data.active_groups || [],
      streak: (data.preferences as Record<string, unknown>)?.streak as UserProgress["streak"],
    };
  } catch {
    return localLoad().pg;
  }
}

export async function saveProgress(progress: UserProgress, dark: boolean): Promise<void> {
  const userId = getUserId();
  localSave(progress, dark);
  if (!supabase) return;
  try {
    await supabase.from("user_progress").upsert({
      user_id: userId,
      completed_lessons: progress.done,
      srs_cards: progress.srs,
      active_groups: progress.activeGroups,
      preferences: { dark, streak: progress.streak },
      updated_at: new Date().toISOString(),
    });
  } catch {
    // local storage is the fallback
  }
}

export async function loadDarkMode(): Promise<boolean> {
  const userId = getUserId();
  if (!supabase) return localLoad().dk;
  try {
    const { data } = await supabase
      .from("user_progress")
      .select("preferences")
      .eq("user_id", userId)
      .single();
    return data?.preferences?.dark ?? localLoad().dk;
  } catch {
    return localLoad().dk;
  }
}
