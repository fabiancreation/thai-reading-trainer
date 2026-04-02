"use client";

import { useTheme, Theme } from "./ThemeProvider";

const TC: Record<string, string> = {
  mid: "#5a8c6a", low: "#4a7ab5", falling: "#b56a4a", high: "#c9a84c", rising: "#9b6bb5",
};

function ToneCell({ tone }: { tone: string }) {
  const c = TC[tone] || "#888";
  return (
    <td style={{ background: c + "22", color: c, padding: "8px 6px", textAlign: "center", fontSize: 13, fontWeight: 600, borderRadius: 5 }}>
      {tone.charAt(0).toUpperCase() + tone.slice(1)}
    </td>
  );
}

function EmptyCell({ T }: { T: Theme }) {
  return <td style={{ padding: 8, textAlign: "center", color: T.tm, fontSize: 13 }}>--</td>;
}

export default function ToneTable() {
  const { T } = useTheme();
  const th = { padding: 8, textAlign: "center" as const, color: T.tm, fontSize: 12 };

  return (
    <div className="fu">
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Tone Rules</h2>
      <p style={{ fontSize: 14, color: T.td, marginBottom: 6, lineHeight: 1.5 }}>Thai has 5 tones: mid, low, falling, high, rising.</p>
      <p style={{ fontSize: 14, color: T.td, marginBottom: 16, lineHeight: 1.5 }}>Without tone marks: class + syllable type + vowel length = tone</p>

      <div style={{ overflowX: "auto", marginBottom: 20 }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 3 }}>
          <thead>
            <tr>
              <th style={{ ...th, textAlign: "left" }}>Class</th>
              <th style={th}>Live</th>
              <th style={th}>Dead (long)</th>
              <th style={th}>Dead (short)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: 8, fontWeight: 600, color: T.mid }}>Mid</td><ToneCell tone="mid" /><ToneCell tone="low" /><ToneCell tone="low" /></tr>
            <tr><td style={{ padding: 8, fontWeight: 600, color: T.high }}>High</td><ToneCell tone="rising" /><ToneCell tone="low" /><ToneCell tone="low" /></tr>
            <tr><td style={{ padding: 8, fontWeight: 600, color: T.low }}>Low</td><ToneCell tone="mid" /><ToneCell tone="falling" /><ToneCell tone="high" /></tr>
          </tbody>
        </table>
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>With Tone Marks</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 3 }}>
          <thead>
            <tr>
              <th style={{ ...th, textAlign: "left" }}>Class</th>
              <th style={th}>No mark</th>
              <th style={th}>{"\u0e48"} Mai Eek</th>
              <th style={th}>{"\u0e49"} Mai Too</th>
              <th style={th}>{"\u0e4a"} Dtrii</th>
              <th style={th}>{"\u0e4b"} Jat</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: 8, fontWeight: 600, color: T.mid }}>Mid</td><ToneCell tone="mid" /><ToneCell tone="low" /><ToneCell tone="falling" /><ToneCell tone="high" /><ToneCell tone="rising" /></tr>
            <tr><td style={{ padding: 8, fontWeight: 600, color: T.high }}>High</td><ToneCell tone="rising" /><ToneCell tone="low" /><ToneCell tone="falling" /><EmptyCell T={T} /><EmptyCell T={T} /></tr>
            <tr><td style={{ padding: 8, fontWeight: 600, color: T.low }}>Low</td><ToneCell tone="mid" /><ToneCell tone="falling" /><ToneCell tone="high" /><EmptyCell T={T} /><EmptyCell T={T} /></tr>
          </tbody>
        </table>
      </div>

      <div style={{ background: T.ac + "0d", border: "1px solid " + T.ac + "22", borderRadius: 8, padding: "12px 14px", marginTop: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.ac, marginBottom: 3 }}>Remember</div>
        <div style={{ fontSize: 14, color: T.tx, lineHeight: 1.6 }}>
          {"Mai \u00c8ek: Mid/High \u2192 Low, Low \u2192 Falling. Mai T\u00f4o: Mid/High \u2192 Falling, Low \u2192 High. Mai Dtrii & Mai J\u00e0t only work with Mid class."}
        </div>
      </div>
    </div>
  );
}
