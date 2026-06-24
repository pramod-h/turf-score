"use client";

import { useEffect, useState } from "react";

export function SplashScreen() {
  const [phase, setPhase] = useState<"visible" | "fading" | "gone">("visible");

  useEffect(() => {
    const fade = setTimeout(() => setPhase("fading"), 1600);
    const gone = setTimeout(() => setPhase("gone"), 2200);
    return () => {
      clearTimeout(fade);
      clearTimeout(gone);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0C0E1A]"
      style={{
        transition: "opacity 0.6s ease",
        opacity: phase === "fading" ? 0 : 1,
      }}
    >
      {/* Cricket ball */}
      <div className="relative mb-8">
        <div
          className="h-20 w-20 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 35%, #e53e3e, #7f1d1d)",
            boxShadow: "0 0 40px rgba(239,68,68,0.4), 0 0 80px rgba(239,68,68,0.15)",
          }}
        >
          {/* Seam lines */}
          <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full" fill="none">
            <path
              d="M 40 8 Q 55 20 55 40 Q 55 60 40 72"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 40 8 Q 25 20 25 40 Q 25 60 40 72"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            <path d="M 12 34 Q 25 38 38 36" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
            <path d="M 12 46 Q 25 42 38 44" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
            <path d="M 68 34 Q 55 38 42 36" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
            <path d="M 68 46 Q 55 42 42 44" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* Glow pulse ring */}
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            background: "transparent",
            border: "2px solid rgba(239,68,68,0.3)",
            animationDuration: "1.4s",
          }}
        />
      </div>

      {/* Wordmark */}
      <div className="text-center">
        <h1
          className="font-scoreboard text-5xl font-bold tracking-widest uppercase"
          style={{ color: "#F0F2FF", letterSpacing: "0.2em" }}
        >
          Turf
          <span style={{ color: "#22C55E" }}>Score</span>
        </h1>
        <p
          className="mt-2 text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: "#6B7094" }}
        >
          Live Cricket Scorer
        </p>
      </div>

      {/* Loading dots */}
      <div className="mt-12 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
