"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/auth";
import Link from "next/link";

export default function LandingPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => { getSession().then((s) => setLoggedIn(!!s)); }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0f1117 0%, #1a1d27 40%, #1e2538 100%)",
      color: "#e8e6e1",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      overflow: "hidden",
    }}>
      {/* Floating nav */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(15,17,23,0.85)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(232,185,49,0.1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: "#e8b931" }}>{"\u0e01"}</span>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.5 }}>{"\u0e2d\u0e48\u0e32\u0e19\u0e44\u0e17\u0e22"}</span>
        </div>
        <Link href={loggedIn ? "/app" : "/login"} style={{
          background: "#e8b931", color: "#0f1117",
          padding: "10px 24px", borderRadius: 8,
          fontSize: 14, fontWeight: 700, textDecoration: "none",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(232,185,49,0.3)"; }}
        onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
        >
          {loggedIn ? "Open App" : "Log in"}
        </Link>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "120px 24px 80px",
        position: "relative",
      }}>
        {/* Decorative Thai characters floating in background */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity: 0.04, pointerEvents: "none" }} aria-hidden="true">
          {["\u0e01", "\u0e02", "\u0e04", "\u0e07", "\u0e08", "\u0e14", "\u0e17", "\u0e19", "\u0e1a", "\u0e1b", "\u0e21", "\u0e23", "\u0e25", "\u0e27", "\u0e2a", "\u0e2d"].map((ch, i) => (
            <span key={i} style={{
              position: "absolute",
              fontSize: 60 + (i * 12) + "px",
              fontWeight: 700,
              left: (5 + (i * 6.2) % 90) + "%",
              top: (8 + (i * 7.3) % 85) + "%",
              transform: `rotate(${-15 + i * 5}deg)`,
            }}>{ch}</span>
          ))}
        </div>

        <div style={{
          display: "inline-block",
          background: "rgba(232,185,49,0.1)", border: "1px solid rgba(232,185,49,0.2)",
          borderRadius: 24, padding: "6px 16px", fontSize: 13, color: "#e8b931",
          fontWeight: 600, marginBottom: 32, letterSpacing: 0.5,
        }}>
          Your Thai class companion
        </div>

        <h1 style={{
          fontSize: "clamp(40px, 7vw, 72px)",
          fontWeight: 800, lineHeight: 1.05,
          marginBottom: 24, maxWidth: 700,
          letterSpacing: -1,
        }}>
          <span style={{ color: "#e8b931" }}>Read Thai</span>
          <br />with confidence
        </h1>

        <p style={{
          fontSize: "clamp(16px, 2.2vw, 20px)",
          color: "#9b9a97", lineHeight: 1.7,
          maxWidth: 520, marginBottom: 48,
        }}>
          Practice Thai script alongside your offline class.
          Activate what you learn, drill at your pace, never forget with spaced repetition.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href={loggedIn ? "/app" : "/login"} style={{
            background: "#e8b931", color: "#0f1117",
            padding: "16px 36px", borderRadius: 10,
            fontSize: 16, fontWeight: 700, textDecoration: "none",
            transition: "all 0.2s",
          }}
          onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(232,185,49,0.25)"; }}
          onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >
            {loggedIn ? "Open App" : "Get Started"}
          </Link>
          <a href="#features" style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#e8e6e1",
            padding: "16px 36px", borderRadius: 10,
            fontSize: 16, fontWeight: 600, textDecoration: "none",
            transition: "all 0.2s",
          }}
          onMouseOver={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
          onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
          >
            Learn more
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{
        padding: "80px 24px 100px",
        maxWidth: 900, margin: "0 auto",
      }}>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800,
          textAlign: "center", marginBottom: 16, letterSpacing: -0.5,
        }}>
          Built for <span style={{ color: "#e8b931" }}>your class</span>
        </h2>
        <p style={{
          textAlign: "center", color: "#9b9a97", fontSize: 17,
          maxWidth: 500, margin: "0 auto 56px", lineHeight: 1.6,
        }}>
          Not another language app with a fixed curriculum.
          You decide what to learn and when.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20,
        }}>
          {[
            {
              icon: "\u0e01",
              title: "44 Consonants, Your Pace",
              desc: "Activate groups as your class covers them. Mid, High, Low -- learn them in any order.",
            },
            {
              icon: "\u0e32",
              title: "30 Vowels, Paired Smart",
              desc: "Vowels split into long/short pairs. Activate only what you've learned this week.",
            },
            {
              icon: "\u2605",
              title: "Adaptive SRS",
              desc: "Spaced repetition that adjusts to you. Difficulty stars track what's hard. Leech detection for stubborn characters.",
            },
            {
              icon: "\u0e01\u0e32",
              title: "Reading Practice",
              desc: "Combine consonants + vowels into syllables. Read real Thai combinations, not isolated characters.",
            },
            {
              icon: "\u266B",
              title: "Tone Drills",
              desc: "Practice tone rules: class + syllable type + marks. Know which of the 5 tones to use.",
            },
            {
              icon: "\u2714",
              title: "11 Quiz Types",
              desc: "Name, sound, class, position, long/short, odd one out, syllable reading -- never boring.",
            },
          ].map((f, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: "28px 24px",
              transition: "all 0.25s",
            }}
            onMouseOver={e => { e.currentTarget.style.background = "rgba(232,185,49,0.05)"; e.currentTarget.style.borderColor = "rgba(232,185,49,0.15)"; }}
            onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              <div style={{ fontSize: 32, marginBottom: 14, color: "#e8b931" }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "#9b9a97", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{
        padding: "60px 24px 100px",
        maxWidth: 700, margin: "0 auto",
      }}>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800,
          textAlign: "center", marginBottom: 56, letterSpacing: -0.5,
        }}>
          How it works
        </h2>

        {[
          { step: "1", title: "Activate groups", desc: "Your class covers Mid consonants? Tap to activate. Next week it's High class? Add that too." },
          { step: "2", title: "Practice & drill", desc: "Daily Mix combines reviews with new items. Or drill a specific group right after class." },
          { step: "3", title: "Never forget", desc: "SRS schedules reviews at optimal intervals. Difficult characters get extra attention." },
        ].map((s, i) => (
          <div key={i} style={{
            display: "flex", gap: 20, marginBottom: 40, alignItems: "flex-start",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "rgba(232,185,49,0.12)", color: "#e8b931",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 800, flexShrink: 0,
            }}>{s.step}</div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{s.title}</h3>
              <p style={{ fontSize: 15, color: "#9b9a97", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={{
        padding: "60px 24px 100px",
        textAlign: "center",
      }}>
        <div style={{
          maxWidth: 500, margin: "0 auto",
          background: "rgba(232,185,49,0.06)",
          border: "1px solid rgba(232,185,49,0.15)",
          borderRadius: 20, padding: "48px 32px",
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
            Ready to read Thai?
          </h2>
          <p style={{ color: "#9b9a97", fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
            Free. No ads. Just you and the Thai script.
          </p>
          <Link href={loggedIn ? "/app" : "/login"} style={{
            display: "inline-block",
            background: "#e8b931", color: "#0f1117",
            padding: "16px 40px", borderRadius: 10,
            fontSize: 16, fontWeight: 700, textDecoration: "none",
            transition: "all 0.2s",
          }}
          onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(232,185,49,0.25)"; }}
          onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >
            {loggedIn ? "Open App" : "Create Account"}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "32px 24px",
        textAlign: "center",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        color: "#6b6a67", fontSize: 13,
      }}>
        {"\u0e2d\u0e48\u0e32\u0e19\u0e44\u0e17\u0e22"} Read Thai &middot; A companion for your Thai class
      </footer>
    </div>
  );
}
