"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, createAccount, getSession } from "@/lib/auth";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (typeof window !== "undefined" && getSession()) {
    router.push("/app");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    setLoading(true);

    if (mode === "login") {
      const user = await login(username.trim(), password);
      if (user) {
        router.push("/app");
      } else {
        setError("Invalid username or password");
        setLoading(false);
      }
    } else {
      const { user, error: err } = await createAccount(
        username.trim(),
        password,
        displayName.trim() || undefined
      );
      if (user) {
        router.push("/app");
      } else {
        setError(err || "Could not create account");
        setLoading(false);
      }
    }
  };

  const T = {
    bg: "#0f1117", sf: "#1a1d27", ac: "#e8b931",
    tx: "#e8e6e1", td: "#9b9a97", bd: "#2d3140",
    no: "#e06456",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${T.bg} 0%, ${T.sf} 40%, #1e2538 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "block", textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontSize: 48, fontWeight: 700, color: T.ac }}>{"\u0e01"}</span>
          <div style={{ fontSize: 20, fontWeight: 700, color: T.tx, marginTop: 4 }}>{"\u0e2d\u0e48\u0e32\u0e19\u0e44\u0e17\u0e22"}</div>
          <div style={{ fontSize: 12, color: T.td, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 2 }}>Read Thai</div>
        </Link>

        {/* Card */}
        <div style={{
          background: T.sf, border: "1px solid " + T.bd,
          borderRadius: 16, padding: "32px 28px",
        }}>
          {/* Tab toggle */}
          <div style={{
            display: "flex", background: T.bg, borderRadius: 10,
            padding: 3, marginBottom: 28,
          }}>
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 8,
                  background: mode === m ? T.ac : "transparent",
                  color: mode === m ? T.bg : T.td,
                  fontSize: 14, fontWeight: 700, border: "none",
                  cursor: "pointer", transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
              >
                {m === "login" ? "Log in" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <label style={{ display: "block", marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: T.td, fontWeight: 600, display: "block", marginBottom: 6 }}>Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                style={{
                  width: "100%", padding: "12px 14px",
                  background: T.bg, border: "1px solid " + T.bd,
                  borderRadius: 9, color: T.tx, fontSize: 15,
                  outline: "none", fontFamily: "inherit",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => { e.target.style.borderColor = T.ac; }}
                onBlur={e => { e.target.style.borderColor = T.bd; }}
              />
            </label>

            {mode === "signup" && (
              <label style={{ display: "block", marginBottom: 16 }}>
                <span style={{ fontSize: 13, color: T.td, fontWeight: 600, display: "block", marginBottom: 6 }}>Display Name (optional)</span>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 14px",
                    background: T.bg, border: "1px solid " + T.bd,
                    borderRadius: 9, color: T.tx, fontSize: 15,
                    outline: "none", fontFamily: "inherit",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => { e.target.style.borderColor = T.ac; }}
                  onBlur={e => { e.target.style.borderColor = T.bd; }}
                />
              </label>
            )}

            <label style={{ display: "block", marginBottom: 24 }}>
              <span style={{ fontSize: 13, color: T.td, fontWeight: 600, display: "block", marginBottom: 6 }}>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                style={{
                  width: "100%", padding: "12px 14px",
                  background: T.bg, border: "1px solid " + T.bd,
                  borderRadius: 9, color: T.tx, fontSize: 15,
                  outline: "none", fontFamily: "inherit",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => { e.target.style.borderColor = T.ac; }}
                onBlur={e => { e.target.style.borderColor = T.bd; }}
              />
            </label>

            {error && (
              <div style={{
                background: T.no + "15", border: "1px solid " + T.no + "33",
                borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                fontSize: 13, color: T.no, fontWeight: 600,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "14px",
                background: loading ? T.bd : T.ac,
                color: T.bg, borderRadius: 10,
                fontSize: 15, fontWeight: 700,
                border: "none", cursor: loading ? "wait" : "pointer",
                fontFamily: "inherit", transition: "all 0.2s",
              }}
            >
              {loading ? "..." : mode === "login" ? "Log in" : "Create Account"}
            </button>
          </form>
        </div>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Link href="/" style={{ color: T.td, fontSize: 13, textDecoration: "none" }}>
            &larr; Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
