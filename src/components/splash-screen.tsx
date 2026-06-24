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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: "var(--background)",
        transition: "opacity 0.6s ease",
        opacity: phase === "fading" ? 0 : 1,
      }}
    >
      {/* cricket ball */}
      <div className="relative mb-10 z-10 flex items-center justify-center">
        {/* soft ambient glow */}
        <div
          className="absolute h-36 w-36 rounded-full blur-3xl opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(239,68,68,0.28) 0%, rgba(220,38,38,0.16) 42%, rgba(0,0,0,0) 72%)",
          }}
        />

        {/* orbit ring */}
        <div
          className="absolute h-32 w-32 rounded-full"
          style={{
            animation: "cricket-orbit-rotate 7s linear infinite",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
          <div
            className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
            style={{
              background: "#ef4444",
              boxShadow: "0 0 18px rgba(239,68,68,0.9)",
            }}
          />
        </div>

        {/* pulse ring */}
        <div
          className="absolute h-24 w-24 rounded-full"
          style={{
            border: "1.5px solid rgba(255,255,255,0.12)",
            animation: "cricket-ring-pulse 2s ease-out infinite",
          }}
        />

        {/* floating ball wrapper */}
        <div
          className="relative h-24 w-24"
          style={{
            animation: "cricket-ball-float 3.2s ease-in-out infinite",
          }}
        >
          {/* ball */}
          <div
            className="relative h-24 w-24 overflow-hidden rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 28%, #ff9a9a 0%, #ef4444 18%, #b91c1c 46%, #7f1d1d 70%, #3f0a0a 100%)",
              boxShadow: `
          inset -12px -16px 20px rgba(0,0,0,0.35),
          inset 10px 12px 14px rgba(255,255,255,0.08),
          0 16px 34px rgba(239,68,68,0.22),
          0 6px 16px rgba(0,0,0,0.45)
        `,
            }}
          >
            {/* top glossy highlight */}
            <div
              className="absolute rounded-full blur-md"
              style={{
                top: "11%",
                left: "14%",
                width: "42%",
                height: "30%",
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.15) 58%, rgba(255,255,255,0) 100%)",
              }}
            />

            {/* subtle leather shine streak */}
            <div
              className="absolute"
              style={{
                top: "16%",
                left: "23%",
                width: "18%",
                height: "54%",
                borderRadius: "9999px",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.02), rgba(255,255,255,0))",
                filter: "blur(1px)",
              }}
            />

            <svg
              viewBox="0 0 96 96"
              className="absolute inset-0 h-full w-full"
              fill="none"
            >
              {/* center seam strip */}
              <path
                d="M48 2 C48 18, 48 32, 48 48 C48 64, 48 78, 48 94"
                stroke="rgba(70,10,10,0.95)"
                strokeWidth="9"
                strokeLinecap="round"
              />

              {/* seam inner highlight */}
              <path
                d="M48 2 C48 18, 48 32, 48 48 C48 64, 48 78, 48 94"
                stroke="rgba(255,90,90,0.22)"
                strokeWidth="1.8"
                strokeLinecap="round"
                style={{
                  animation: "cricket-seam-glow 2.6s ease-in-out infinite",
                }}
              />

              {/* seam side grooves */}
              <path
                d="M43.5 2 C43.5 18, 43.5 32, 43.5 48 C43.5 64, 43.5 78, 43.5 94"
                stroke="rgba(0,0,0,0.28)"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
              <path
                d="M52.5 2 C52.5 18, 52.5 32, 52.5 48 C52.5 64, 52.5 78, 52.5 94"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.1"
                strokeLinecap="round"
              />

              {/* left stitch row */}
              <path
                d="M40.5 4 C40.5 18, 40.5 32, 40.5 48 C40.5 64, 40.5 78, 40.5 92"
                stroke="#fffaf5"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeDasharray="1.15 6.3"
              />

              {/* right stitch row */}
              <path
                d="M55.5 4 C55.5 18, 55.5 32, 55.5 48 C55.5 64, 55.5 78, 55.5 92"
                stroke="#fffaf5"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeDasharray="1.15 6.3"
              />

              {/* faint outer stitch depth */}
              <path
                d="M36.5 4 C36.5 18, 36.5 32, 36.5 48 C36.5 64, 36.5 78, 36.5 92"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="0.9"
                strokeLinecap="round"
                strokeDasharray="1 8"
              />
              <path
                d="M59.5 4 C59.5 18, 59.5 32, 59.5 48 C59.5 64, 59.5 78, 59.5 92"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="0.9"
                strokeLinecap="round"
                strokeDasharray="1 8"
              />
            </svg>

            {/* subtle bottom red glow */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2"
              style={{
                width: "72%",
                height: "20%",
                background:
                  "radial-gradient(circle, rgba(255,70,70,0.22) 0%, rgba(255,70,70,0.06) 52%, rgba(255,70,70,0) 100%)",
                filter: "blur(6px)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Wordmark */}
      <div className="text-center z-10">
        <h1
          className="font-scoreboard text-5xl font-bold tracking-widest uppercase"
          style={{ color: "var(--foreground)", letterSpacing: "0.2em" }}
        >
          Turf<span style={{ color: "var(--primary)" }}>Score</span>
        </h1>
        <p
          className="mt-2 text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: "var(--muted-foreground)" }}
        >
          Live Cricket Scorer
        </p>
      </div>

      {/* Loading dots */}
      <div className="mt-12 flex gap-2 z-10">
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
