import { supabase } from "./supabase";
import { UserProgress } from "./data/types";
import { getUserId } from "./user";

/** Cached auth readiness -- once true, stays true for the session */
let authReady = false;

/** Wait for Supabase auth session to be restored (max 3s) */
async function waitForAuth(): Promise<boolean> {
  if (authReady) return true;
  if (!supabase) return false;
  const { data } = await supabase.auth.getSession();
  if (data?.session) { authReady = true; return true; }
  // Session not ready yet -- wait for onAuthStateChange
  return new Promise((resolve) => {
    const timeout = setTimeout(() => { resolve(false); }, 3000);
    const { data: listener } = supabase!.auth.onAuthStateChange((_event, session) => {
      if (session) {
        authReady = true;
        clearTimeout(timeout);
        listener.subscription.unsubscribe();
        resolve(true);
      }
    });
  });
}

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
  if (!supabase || userId === "anonymous") return localLoad().pg;
  const hasAuth = await waitForAuth();
  if (!hasAuth) return localLoad().pg;
  try {
    const { data } = await supabase
      .from("user_progress")
      .select("completed_lessons, srs_cards, active_groups, preferences")
      .eq("user_id", userId)
      .single();
    if (!data) { console.log("[load] No data from Supabase, falling back to local"); return localLoad().pg; }
    const srsKeys = Object.keys(data.srs_cards || {}).length;
    console.log("[load] Supabase OK, srsKeys:", srsKeys, "userId:", userId);
    return {
      done: data.completed_lessons || [],
      srs: data.srs_cards || {},
      activeGroups: data.active_groups || [],
      streak: (data.preferences as Record<string, unknown>)?.streak as UserProgress["streak"],
    };
  } catch (e) {
    console.error("[load] Exception:", e);
    return localLoad().pg;
  }
}

export async function saveProgress(progress: UserProgress, dark: boolean): Promise<void> {
  const userId = getUserId();
  localSave(progress, dark);
  if (!supabase || userId === "anonymous") return;
  // Must have auth for RLS to allow the upsert
  if (!authReady) {
    const hasAuth = await waitForAuth();
    if (!hasAuth) return; // localStorage is the fallback
  }
  try {
    const { error } = await supabase.from("user_progress").upsert({
      user_id: userId,
      completed_lessons: progress.done,
      srs_cards: progress.srs,
      active_groups: progress.activeGroups,
      preferences: { dark, streak: progress.streak },
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    if (error) console.error("[save] Supabase error:", error.message, "userId:", userId, "srsKeys:", Object.keys(progress.srs).length);
    else console.log("[save] OK, srsKeys:", Object.keys(progress.srs).length);
  } catch (e) {
    console.error("[save] Exception:", e);
  }
}

export async function loadDarkMode(): Promise<boolean> {
  const userId = getUserId();
  if (!supabase || userId === "anonymous") return localLoad().dk;
  const hasAuth = await waitForAuth();
  if (!hasAuth) return localLoad().dk;
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
