import { supabase } from "./supabase";

export interface AppUser {
  id: string;
  username: string;
  displayName: string;
}

const SESSION_KEY = "thai-rt-session";

// --- Session persistence (localStorage) ---

export function getSession(): AppUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(user: AppUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

// --- Auth operations ---

export async function login(username: string, password: string): Promise<AppUser | null> {
  if (!supabase) return fallbackLogin(username);

  const { data, error } = await supabase.rpc("verify_user", {
    p_username: username,
    p_password: password,
  });

  if (error || !data || data.length === 0) return null;

  const row = data[0];
  const user: AppUser = {
    id: row.id,
    username: row.username,
    displayName: row.display_name || row.username,
  };
  setSession(user);
  return user;
}

export async function createAccount(
  username: string,
  password: string,
  displayName?: string
): Promise<{ user: AppUser | null; error: string | null }> {
  if (!supabase) return { user: null, error: "Database not available" };

  const { data, error } = await supabase.rpc("create_user", {
    p_username: username,
    p_password: password,
    p_display_name: displayName || username,
  });

  if (error) {
    if (error.message.includes("duplicate") || error.message.includes("unique")) {
      return { user: null, error: "Username already taken" };
    }
    return { user: null, error: error.message };
  }

  if (!data || data.length === 0) return { user: null, error: "Could not create account" };

  const row = data[0];
  const user: AppUser = {
    id: row.id,
    username: row.username,
    displayName: row.display_name || row.username,
  };
  setSession(user);
  return { user, error: null };
}

export function logout() {
  clearSession();
}

// Fallback for when Supabase is not configured (dev/local)
function fallbackLogin(username: string): AppUser {
  const user: AppUser = { id: "local-" + username, username, displayName: username };
  setSession(user);
  return user;
}
