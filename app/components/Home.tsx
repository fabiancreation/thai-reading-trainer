"use client";

import { LESSONS } from "@/lib/data/lessons";
import { useTheme } from "./ThemeProvider";

interface HomeProps {
  open: (index: number) => void;
}

export default function Home({ open }: HomeProps) {
  const { T, progress } = useTheme();
  const d = progress.done || [];
  const pct = Math.round((d.length / LESSONS.length) * 100);

  return (
    <div className="fu">
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 14, color: T.td }}>Progress</span>
          <span style={{ fontSize: 14, color: T.ac, fontWeight: 600 }}>{pct}%</span>
        </div>
        <div style={{ height: 5, background: T.sl, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: pct + "%", height: "100%", background: T.ac, borderRadius: 3, transition: "width .5s" }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {LESSONS.map((l, i) => {
          const dn = d.includes(l.id);
          return (
            <div
              key={l.id}
              className="fu ch"
              onClick={() => open(i)}
              style={{
                background: dn ? T.ok + "0d" : T.sf,
                border: "1px solid " + (dn ? T.ok + "33" : T.bd),
                borderRadius: 10,
                padding: "14px 16px",
                animationDelay: i * 40 + "ms",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: dn ? T.ok : T.ac, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {dn ? "\u2713" : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: dn ? T.ok : T.tm, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 1 }}>{l.phase}</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{l.title}</div>
                </div>
                {l.items.length > 0 && <div style={{ fontSize: 13, color: T.tm }}>{l.items.length}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
