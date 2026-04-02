"use client";

const TONE_COLORS: Record<string, string> = {
  mid: "bg-[#5a8c6a]/[0.13] text-[#5a8c6a]",
  low: "bg-[#4a7ab5]/[0.13] text-[#4a7ab5]",
  falling: "bg-[#b56a4a]/[0.13] text-[#b56a4a]",
  high: "bg-[#c9a84c]/[0.13] text-[#c9a84c]",
  rising: "bg-[#9b6bb5]/[0.13] text-[#9b6bb5]",
};

function ToneCell({ tone }: { tone: string }) {
  return (
    <td className={`px-1.5 py-2 text-center text-[13px] font-semibold rounded-[5px] ${TONE_COLORS[tone] || ""}`}>
      {tone.charAt(0).toUpperCase() + tone.slice(1)}
    </td>
  );
}

function EmptyCell() {
  return <td className="px-2 py-2 text-center text-muted-light text-[13px]">--</td>;
}

export default function ToneTable() {
  return (
    <div className="animate-fade-up">
      <h2 className="text-xl font-bold mb-1.5">Tone Rules</h2>
      <p className="text-sm text-muted mb-1.5 leading-normal">
        Thai has 5 tones: mid, low, falling, high, rising.
      </p>
      <p className="text-sm text-muted mb-4 leading-normal">
        Without tone marks: class + syllable type + vowel length = tone
      </p>

      {/* Base tone table */}
      <div className="overflow-x-auto mb-5">
        <table className="w-full border-separate" style={{ borderSpacing: "3px" }}>
          <thead>
            <tr>
              <th className="p-2 text-left text-muted-light text-xs">Class</th>
              <th className="p-2 text-center text-muted-light text-xs">Live</th>
              <th className="p-2 text-center text-muted-light text-xs">Dead (long)</th>
              <th className="p-2 text-center text-muted-light text-xs">Dead (short)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 font-semibold text-cls-mid">Mid</td>
              <ToneCell tone="mid" />
              <ToneCell tone="low" />
              <ToneCell tone="low" />
            </tr>
            <tr>
              <td className="p-2 font-semibold text-cls-high">High</td>
              <ToneCell tone="rising" />
              <ToneCell tone="low" />
              <ToneCell tone="low" />
            </tr>
            <tr>
              <td className="p-2 font-semibold text-cls-low">Low</td>
              <ToneCell tone="mid" />
              <ToneCell tone="falling" />
              <ToneCell tone="high" />
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tone marks table */}
      <h3 className="text-lg font-bold mb-2.5">With Tone Marks</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-separate" style={{ borderSpacing: "3px" }}>
          <thead>
            <tr>
              <th className="p-2 text-left text-muted-light text-xs">Class</th>
              <th className="p-2 text-center text-muted-light text-xs">No mark</th>
              <th className="p-2 text-center text-muted-light text-xs">{"\u0e48"} Mai Eek</th>
              <th className="p-2 text-center text-muted-light text-xs">{"\u0e49"} Mai Too</th>
              <th className="p-2 text-center text-muted-light text-xs">{"\u0e4a"} Dtrii</th>
              <th className="p-2 text-center text-muted-light text-xs">{"\u0e4b"} Jat</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 font-semibold text-cls-mid">Mid</td>
              <ToneCell tone="mid" />
              <ToneCell tone="low" />
              <ToneCell tone="falling" />
              <ToneCell tone="high" />
              <ToneCell tone="rising" />
            </tr>
            <tr>
              <td className="p-2 font-semibold text-cls-high">High</td>
              <ToneCell tone="rising" />
              <ToneCell tone="low" />
              <ToneCell tone="falling" />
              <EmptyCell />
              <EmptyCell />
            </tr>
            <tr>
              <td className="p-2 font-semibold text-cls-low">Low</td>
              <ToneCell tone="mid" />
              <ToneCell tone="falling" />
              <ToneCell tone="high" />
              <EmptyCell />
              <EmptyCell />
            </tr>
          </tbody>
        </table>
      </div>

      {/* Remember box */}
      <div className="bg-accent/5 border border-accent/[0.13] rounded-lg py-3 px-3.5 mt-4">
        <div className="text-[13px] font-bold text-accent mb-1">Remember</div>
        <div className="text-sm leading-relaxed">
          {
            "Mai \u00c8ek: Mid/High \u2192 Low, Low \u2192 Falling. Mai T\u00f4o: Mid/High \u2192 Falling, Low \u2192 High. Mai Dtrii & Mai J\u00e0t only work with Mid class."
          }
        </div>
      </div>
    </div>
  );
}
