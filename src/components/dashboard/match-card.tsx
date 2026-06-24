import Link from "next/link";
import { MatchListItem } from "@/modules/match/get-matches";

function getMatchResult(match: MatchListItem): string | null {
  if (match.status !== "COMPLETED") return null;
  const sorted = [...match.innings].sort((a, b) => a.inning_number - b.inning_number);
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
      className="rounded-2xl overflow-hidden border"
      style={
        isLive
          ? {
              background: "var(--card)",
              borderColor: "color-mix(in srgb, var(--primary) 34%, var(--border))",
              boxShadow: "0 6px 20px rgba(0,0,0,0.28)",
            }
          : {
              background: "var(--card)",
              borderColor: "var(--border)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }
      }
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
          {result ? (
            <p className="mt-1 text-xs font-semibold text-primary">{result}</p>
          ) : null}
        </div>

        {isLive ? (
          <span className="shrink-0 flex items-center gap-1.5 rounded-full bg-secondary border border-border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
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
                    ? "color-mix(in srgb, var(--primary) 10%, var(--secondary))"
                    : "var(--secondary)",
                  border: isCurrent
                    ? "1px solid color-mix(in srgb, var(--primary) 30%, var(--border))"
                    : "1px solid var(--border)",
                }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
                  {inn.batting_team}
                </p>
                <p className={`mt-0.5 font-scoreboard text-xl font-bold leading-none tabular-nums ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                  {inn.total_runs}/{inn.wickets}
                  {isCurrent ? <span className="ml-0.5 text-sm font-normal opacity-60">*</span> : null}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Footer CTA */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {isLive ? (
          <>
            <p className="text-xs text-muted-foreground">In progress</p>
            <Link
              href={`/match/${match.id}/live`}
              className="rounded-xl px-4 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90 active:opacity-75"
              style={{
                background: "var(--primary)",
                boxShadow: "0 2px 8px rgba(127,215,166,0.24)",
                color: "var(--primary-foreground)",
              }}
            >
              Scorecard →
            </Link>
          </>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">Completed</p>
            <Link
              href={`/match/${match.id}`}
              className="rounded-xl border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              Scorecard →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
