"use client";

import { LESSONS } from "@/lib/data/lessons";
import { useTheme } from "./ThemeProvider";

interface HomeProps {
  open: (index: number) => void;
}

export default function Home({ open }: HomeProps) {
  const { progress } = useTheme();
  const d = progress.done || [];
  const pct = Math.round((d.length / LESSONS.length) * 100);

  return (
    <div className="animate-fade-up">
      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-muted">Progress</span>
          <span className="text-sm text-accent font-semibold">{pct}%</span>
        </div>
        <div className="h-1.5 bg-surface-alt rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Lesson list */}
      <div className="flex flex-col gap-2">
        {LESSONS.map((l, i) => {
          const dn = d.includes(l.id);
          return (
            <div
              key={l.id}
              onClick={() => open(i)}
              className={`animate-fade-up cursor-pointer hover:-translate-y-0.5 transition-transform rounded-[10px] px-4 py-3.5 border ${
                dn
                  ? "bg-ok/5 border-ok/20"
                  : "bg-surface border-border"
              }`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-[34px] h-[34px] rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0 ${
                    dn ? "bg-ok" : "bg-accent"
                  }`}
                >
                  {dn ? "\u2713" : i + 1}
                </div>
                <div className="flex-1">
                  <div
                    className={`text-[11px] uppercase tracking-wider mb-0.5 ${
                      dn ? "text-ok" : "text-muted-light"
                    }`}
                  >
                    {l.phase}
                  </div>
                  <div className="text-base font-semibold">{l.title}</div>
                </div>
                {l.items.length > 0 && (
                  <div className="text-[13px] text-muted-light">{l.items.length}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
