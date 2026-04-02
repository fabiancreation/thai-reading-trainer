import { supabase } from "./supabase";
import { UserProgress } from "./data/types";

const STORAGE_KEY = "thai-reading-trainer";
const DEFAULT_PROGRESS: UserProgress = { done: [], srs: {} };

function localLoad(): { pg: UserProgress; dk: boolean } {
  if (typeof window === "undefined") return { pg: DEFAULT_PROGRESS, dk: false };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ pg, dk }));
  } catch {
    // quota exceeded — silently fail
  }
}

export async function loadProgress(): Promise<UserProgress> {
  if (!supabase) return localLoad().pg;
  try {
    const { data } = await supabase
      .from("user_progress")
      .select("completed_lessons, srs_cards")
      .eq("user_id", "default")
      .single();
    if (!data) return localLoad().pg;
    return {
      done: data.completed_lessons || [],
      srs: data.srs_cards || {},
    };
  } catch {
    return localLoad().pg;
  }
}

export async function saveProgress(progress: UserProgress, dark: boolean): Promise<void> {
  localSave(progress, dark);
  if (!supabase) return;
  try {
    await supabase.from("user_progress").upsert({
      user_id: "default",
      completed_lessons: progress.done,
      srs_cards: progress.srs,
      preferences: { dark },
      updated_at: new Date().toISOString(),
    });
  } catch {
    // Supabase write failed — local storage is the fallback
  }
}

export async function loadDarkMode(): Promise<boolean> {
  if (!supabase) return localLoad().dk;
  try {
    const { data } = await supabase
      .from("user_progress")
      .select("preferences")
      .eq("user_id", "default")
      .single();
    return data?.preferences?.dark ?? localLoad().dk;
  } catch {
    return localLoad().dk;
  }
}
