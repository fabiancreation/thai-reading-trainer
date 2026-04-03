import { supabase } from "./supabase";

export interface AppUser {
  id: string;
  username: string;
  displayName: string;
}

function usernameToEmail(username: string): string {
  return `${username.toLowerCase()}@users.readthai.com`;
}

function emailToUsername(email: string): string {
  return email.replace(/@users\.readthai\.com$/, "");
}

// --- Session ---

export async function getSession(): Promise<AppUser | null> {
  if (!supabase) return getLocalSession();
  const { data } = await supabase.auth.getSession();
  const user = data?.session?.user;
  if (!user) {
    // Supabase session not yet restored -- fall back to localStorage cache
    return getLocalSession();
  }
  const appUser: AppUser = {
    id: user.id,
    username: emailToUsername(user.email ?? ""),
    displayName: user.user_metadata?.display_name || emailToUsername(user.email ?? ""),
  };
  cacheSession(appUser); // keep cache in sync
  return appUser;
}

export function getSessionSync(): AppUser | null {
  // Synchronous fallback for initial render -- reads from localStorage cache
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("thai-rt-user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function cacheSession(user: AppUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem("thai-rt-user", JSON.stringify(user));
  } else {
    localStorage.removeItem("thai-rt-user");
  }
}

function getLocalSession(): AppUser | null {
  return getSessionSync();
}

// --- Auth operations ---

export async function login(username: string, password: string): Promise<AppUser | null> {
  if (!supabase) return fallbackLogin(username);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: usernameToEmail(username),
    password,
  });

  if (error || !data.user) return null;

  const user: AppUser = {
    id: data.user.id,
    username,
    displayName: data.user.user_metadata?.display_name || username,
  };
  cacheSession(user);
  return user;
}

export async function createAccount(
  username: string,
  password: string,
  displayName?: string
): Promise<{ user: AppUser | null; error: string | null }> {
  if (!supabase) return { user: null, error: "Database not available" };

  const { data, error } = await supabase.auth.signUp({
    email: usernameToEmail(username),
    password,
    options: {
      data: { display_name: displayName || username },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { user: null, error: "Username already taken" };
    }
    return { user: null, error: error.message };
  }

  if (!data.user) return { user: null, error: "Could not create account" };

  const user: AppUser = {
    id: data.user.id,
    username,
    displayName: displayName || username,
  };
  cacheSession(user);
  return { user, error: null };
}

export async function logout() {
  if (supabase) await supabase.auth.signOut();
  cacheSession(null);
}

// Fallback for when Supabase is not configured
function fallbackLogin(username: string): AppUser {
  const user: AppUser = { id: "local-" + username, username, displayName: username };
  cacheSession(user);
  return user;
}
