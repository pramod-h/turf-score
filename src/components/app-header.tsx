"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import { CricketBatIcon, TennisBallIcon } from "@/components/cricket-icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { useVoiceStore } from "@/stores/voice-store";

const ROUTES: Record<string, { title: string; back: string | null }> = {
  "/": { title: "Matches", back: null },
  "/new-match": { title: "New Match", back: "/" },
  "/players": { title: "Players", back: "/" },
};

function getConfig(pathname: string) {
  if (ROUTES[pathname]) return ROUTES[pathname];
  if (pathname.endsWith("/live")) return { title: "Live Score", back: "/" };
  if (pathname.startsWith("/match/")) return { title: "Scorecard", back: "/" };
  return { title: "Turf Score", back: "/" };
}

export function AppHeader() {
  const pathname = usePathname();
  const { title, back } = getConfig(pathname);
  const isLivePage = pathname.endsWith("/live");

  const { voiceEnabled, listening, supported, toggleVoice } = useVoiceStore();

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 flex items-center h-14 px-3 gap-3"
      style={{
        background: "var(--header-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--header-border)",
        boxShadow: "var(--header-shadow)",
      }}
    >
      {back && (
        <Link
          href={back}
          className="flex items-center justify-center h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground transition-all shrink-0 active:scale-95"
          style={{
            background: "var(--background)",
            boxShadow: "var(--shadow-neu-raised-sm)",
          }}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      )}

      <p className="flex-1 text-xl font-extrabold leading-none text-foreground tracking-tight">
        {title}
      </p>

      {/* Voice toggle — only on live scoring page */}
      {isLivePage && supported ? (
        <button
          type="button"
          onClick={toggleVoice}
          aria-label={voiceEnabled ? "Disable voice scoring" : "Enable voice scoring"}
          className="relative flex items-center justify-center h-9 w-9 rounded-xl transition-all shrink-0 active:scale-95"
          style={
            voiceEnabled
              ? {
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                  boxShadow: "var(--shadow-neu-red-sm)",
                }
              : {
                  background: "var(--background)",
                  color: "var(--muted-foreground)",
                  boxShadow: "var(--shadow-neu-raised-sm)",
                }
          }
        >
          {voiceEnabled ? (
            <Mic className="h-4 w-4" />
          ) : (
            <MicOff className="h-4 w-4" />
          )}
          {/* pulse ring when actively listening */}
          {listening ? (
            <span
              className="absolute inset-0 rounded-xl animate-ping opacity-40"
              style={{ background: "var(--primary)" }}
            />
          ) : null}
        </button>
      ) : null}

      <ThemeToggle />

      {pathname === "/" ? (
        <Link
          href="/players"
          className="rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all shrink-0 active:scale-95"
          style={{
            background: "var(--background)",
            boxShadow: "var(--shadow-neu-raised-sm)",
          }}
        >
          Players
        </Link>
      ) : null}
    </header>
  );
}
