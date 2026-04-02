"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout, AppUser } from "@/lib/auth";
import AppShell from "../components/AppShell";

export default function AppPage() {
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        router.push("/login");
      } else {
        setUser(session);
        setReady(true);
      }
    });
  }, [router]);

  if (!ready) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f1117", color: "#9b9a97" }}>
        Loading...
      </div>
    );
  }

  return (
    <AppShell
      userName={user?.displayName}
      onLogout={async () => { await logout(); router.push("/"); }}
    />
  );
}
