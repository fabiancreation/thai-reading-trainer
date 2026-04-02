"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout } from "@/lib/auth";
import AppShell from "../components/AppShell";

export default function AppPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<{ displayName: string } | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
    } else {
      setUser({ displayName: session.displayName });
      setReady(true);
    }
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
      onLogout={() => { logout(); router.push("/"); }}
    />
  );
}
