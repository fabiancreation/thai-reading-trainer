import { getSessionSync } from "./auth";

// Dynamic user ID from Supabase Auth session
export function getUserId(): string {
  const session = getSessionSync();
  return session?.id ?? "anonymous";
}
