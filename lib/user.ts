import { getSession } from "./auth";

// Dynamic user ID from session, fallback to "fabian" for backwards compatibility
export function getUserId(): string {
  const session = getSession();
  return session?.username ?? "fabian";
}

// Legacy export for existing code that imports USER_ID directly
export const USER_ID = "fabian";
