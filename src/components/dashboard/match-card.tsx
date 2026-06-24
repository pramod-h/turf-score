import Link from "next/link";
import { MatchListItem } from "@/modules/match/get-matches";

export function MatchCard({ match }: { match: MatchListItem }) {
  const isLive = match.status === "LIVE";
  const sortedInnings = [...match.innings].sort(
    (a, b) => a.inning_number - b.inning_number,
  );

  return (
    <div
      className="rounded-2xl border border-border overflow-hidden"
      style={{
        background: isLive
          ? "linear-gradient(135deg, #0d1f17 0%, #131525 70%)"
          : "#131525",
      }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold text-foreground leading-tight">
            {match.team_a_name}
            <span className="mx-1.5 font-normal text-muted-foreground text-sm">vs</span>
            {match.team_b_name}
          </p>
          {match.name ? (
            <p className="mt-0.5 text-xs text-muted-foreground truncate">{match.name}</p>
          ) : null}
        </div>

        {isLive ? (
          <span className="shrink-0 flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Live
          </span>
        ) : (
          <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Done
          </span>
        )}
      </div>

      {/* Innings score tiles */}
      {sortedInnings.length > 0 ? (
        <div className="px-4 pb-3 flex gap-2">
          {sortedInnings.map((inn) => {
            const isCurrent =
              isLive &&
              inn.inning_number === sortedInnings[sortedInnings.length - 1]?.inning_number;

            return (
              <div
                key={inn.inning_number}
                className="flex-1 rounded-xl px-3 py-2.5"
                style={{
                  background: isCurrent
                    ? "rgba(34,197,94,0.08)"
                    : "rgba(28,31,53,0.8)",
                  border: isCurrent
                    ? "1px solid rgba(34,197,94,0.25)"
                    : "1px solid rgba(28,31,53,1)",
                }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
                  {inn.batting_team}
                </p>
                <p
                  className={`mt-0.5 font-scoreboard text-xl font-bold leading-none tabular-nums ${
                    isCurrent ? "text-primary" : "text-foreground"
                  }`}
                >
                  {inn.total_runs}/{inn.wickets}
                  {isCurrent ? (
                    <span className="ml-0.5 text-sm font-normal opacity-50">*</span>
                  ) : null}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Footer CTA */}
      <div className="border-t border-border/50 px-4 py-3 flex items-center justify-between">
        {isLive ? (
          <>
            <p className="text-xs text-muted-foreground">In progress</p>
            <Link
              href={`/match/${match.id}/live`}
              className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90 active:opacity-75"
            >
              Open Scorer →
            </Link>
          </>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">Completed</p>
            <Link
              href={`/match/${match.id}`}
              className="rounded-xl border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Scorecard →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
