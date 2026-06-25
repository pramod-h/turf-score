import Link from "next/link";
import { MatchListItem } from "@/modules/match/get-matches";

function getMatchResult(match: MatchListItem): string | null {
  if (match.status !== "COMPLETED") return null;
  const sorted = [...match.innings].sort(
    (a, b) => a.inning_number - b.inning_number,
  );
  if (sorted.length < 2) return null;
  const [inn1, inn2] = sorted;
  if (inn2.total_runs > inn1.total_runs) {
    const remaining = match.wickets_per_innings - inn2.wickets;
    return `${inn2.batting_team} won by ${remaining} wicket${remaining !== 1 ? "s" : ""}`;
  }
  if (inn1.total_runs > inn2.total_runs) {
    const margin = inn1.total_runs - inn2.total_runs;
    return `${inn1.batting_team} won by ${margin} run${margin !== 1 ? "s" : ""}`;
  }
  return "Match tied";
}

export function MatchCard({ match }: { match: MatchListItem }) {
  const isLive = match.status === "LIVE";
  const result = getMatchResult(match);
  const sortedInnings = [...match.innings].sort(
    (a, b) => a.inning_number - b.inning_number,
  );

  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: "var(--card)",
        boxShadow: isLive
          ? "var(--shadow-neu-card-lg)"
          : "var(--shadow-neu-card)",
      }}
    >
      {/* Live accent stripe */}
      {isLive ? (
        <div
          className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl"
          style={{ background: "linear-gradient(90deg, #EF4444, #F87171)" }}
        />
      ) : null}

      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold text-foreground leading-tight">
            {match.team_a_name}
            <span className="mx-1.5 font-normal text-muted-foreground text-sm">
              vs
            </span>
            {match.team_b_name}
          </p>
          {match.name ? (
            <p className="mt-0.5 text-xs text-muted-foreground truncate">
              {match.name}
            </p>
          ) : null}
          {result ? (
            <p className="mt-1 text-xs font-semibold text-primary">{result}</p>
          ) : null}
        </div>

        {isLive && (
          <span
            className="shrink-0 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              boxShadow: "var(--shadow-neu-red-sm)",
            }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
            Live
          </span>
        )}
      </div>

      {/* Innings score tiles */}
      {sortedInnings.length > 0 ? (
        <div className="px-4 pb-3 flex gap-2">
          {sortedInnings.map((inn) => {
            const isCurrent =
              isLive &&
              inn.inning_number ===
                sortedInnings[sortedInnings.length - 1]?.inning_number;

            return (
              <div
                key={inn.inning_number}
                className="flex-1 rounded-xl px-3 py-2.5"
                style={
                  isCurrent
                    ? {
                        background: "rgba(239,68,68,0.06)",
                        boxShadow: "inset 3px 3px 6px rgba(239,68,68,0.10), inset -2px -2px 5px var(--neu-highlight)",
                      }
                    : {
                        background: "var(--background)",
                        boxShadow: "var(--shadow-neu-inset-sm)",
                      }
                }
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
                  {inn.batting_team}
                </p>
                <p
                  className={`mt-0.5 font-scoreboard text-xl font-bold leading-none tabular-nums ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {inn.total_runs}/{inn.wickets}
                  {isCurrent ? (
                    <span className="ml-0.5 text-sm font-normal opacity-60">
                      *
                    </span>
                  ) : null}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Footer CTA */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
      >
        {isLive ? (
          <>
            <p className="text-xs text-muted-foreground">In progress</p>
            <Link
              href={`/match/${match.id}/live`}
              className="rounded-xl px-4 py-1.5 text-xs font-bold transition-all active:scale-95"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                boxShadow: "var(--shadow-neu-red-sm)",
              }}
            >
              Score →
            </Link>
          </>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">Completed</p>
            <Link
              href={`/match/${match.id}`}
              className="rounded-xl px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-all active:scale-95"
              style={{
                background: "var(--background)",
                boxShadow: "var(--shadow-neu-raised-xs)",
              }}
            >
              Scorecard →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
