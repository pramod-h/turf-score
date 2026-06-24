export const dynamic = "force-dynamic";

import Link from "next/link";
import { AutoRefresh } from "@/components/dashboard/auto-refresh";
import { MatchCard } from "@/components/dashboard/match-card";
import { getMatches } from "@/modules/match/get-matches";

export default async function HomePage() {
  const matches = await getMatches();

  const liveMatches = matches.filter((m) => m.status === "LIVE");
  const completedMatches = matches.filter((m) => m.status === "COMPLETED");

  return (
    <main className="min-h-screen px-3 pb-10">
      {liveMatches.length > 0 ? <AutoRefresh /> : null}

      {/* Branding header */}
      <div
        className="rounded-2xl border border-border bg-card px-4 py-5 mt-6 mb-5 flex items-center justify-between"
        style={{
          boxShadow: "0 8px 24px rgba(0,0,0,0.24)",
        }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">🏏</span>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Turf Score
            </p>
          </div>
          <h1 className="font-scoreboard text-4xl font-bold leading-none text-foreground">
            Matches
          </h1>
        </div>

        <Link
          href="/new-match"
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 active:opacity-80"
        >
          + New Match
        </Link>
      </div>

      {/* Live section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Live
          </p>
        </div>

        {liveMatches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-3xl mb-3">🏟️</p>
            <p className="text-sm text-muted-foreground">No live matches</p>
            <Link
              href="/new-match"
              className="mt-2 inline-block text-sm font-semibold text-primary hover:underline underline-offset-2"
            >
              Start one →
            </Link>
          </div>
        ) : (
          liveMatches.map((match) => <MatchCard key={match.id} match={match} />)
        )}
      </section>

      {completedMatches.length > 0 ? (
        <section className="mt-8 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
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
