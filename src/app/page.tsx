export const dynamic = "force-dynamic";

import Link from "next/link";
import { AutoRefresh } from "@/components/dashboard/auto-refresh";
import { MatchCard } from "@/components/dashboard/match-card";
import { getMatches } from "@/modules/match/get-matches";
import { TennisBallIcon } from "@/components/cricket-icons";

export default async function HomePage() {
  const matches = await getMatches();

  const liveMatches = matches.filter((m) => m.status === "LIVE");
  const completedMatches = matches.filter((m) => m.status === "COMPLETED");

  return (
    <main className="min-h-[calc(100dvh-3.5rem)] px-3 pb-10 pt-4">
      {/* 10 s when a match is live so scores stay fresh; 60 s idle to catch newly started matches */}
      <AutoRefresh intervalMs={liveMatches.length > 0 ? 10_000 : 60_000} />

      {/* Live section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">
            Live
          </p>
        </div>

        {liveMatches.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{
              background: "var(--card)",
              boxShadow: "var(--shadow-neu-card)",
            }}
          >
            <TennisBallIcon className="h-14 w-14 text-primary mx-auto mb-4" />
            <p className="text-sm font-semibold text-foreground">No live matches</p>
            <p className="text-xs text-muted-foreground mt-1 mb-5">Start one to begin scoring</p>
            <Link
              href="/new-match"
              className="inline-block rounded-xl px-6 py-2.5 text-sm font-bold transition-all active:scale-95"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                boxShadow: "var(--shadow-neu-red)",
              }}
            >
              + New Match
            </Link>
          </div>
        ) : (
          liveMatches.map((match) => <MatchCard key={match.id} match={match} />)
        )}
      </section>

      {completedMatches.length > 0 ? (
        <section className="mt-8 space-y-3">
          <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
            Completed
          </p>

          {completedMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </section>
      ) : null}
    </main>
  );
}
