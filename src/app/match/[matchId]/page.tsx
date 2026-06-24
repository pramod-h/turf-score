import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buildScorecard } from "@/modules/match/build-scorecard";
import { getMatchScorecard } from "@/modules/match/get-match-scorecard";
import { getMatchResultSummary } from "@/modules/match/get-match-result-summary";
import { MatchTabs } from "@/components/live-score/match-tabs";
import { ScorecardView } from "@/components/live-score/scorecard-view";

export const dynamic = "force-dynamic";

type MatchScorecardPageProps = {
  params: Promise<{
    matchId: string;
  }>;
};

export default async function MatchScorecardPage({
  params,
}: MatchScorecardPageProps) {
  const { matchId } = await params;
  const { match, innings, players, ballEvents } =
    await getMatchScorecard(matchId);

  const inningsCards = innings.map((inning) => {
    const inningEvents = ballEvents.filter(
      (event) => event.innings_id === inning.id,
    );

    const state = buildScorecard({
      match,
      innings: inning,
      players,
      ballEvents: inningEvents,
    });

    return { inning, state };
  });

  const firstInnings = innings.find((i) => i.inning_number === 1);
  const secondInnings = innings.find((i) => i.inning_number === 2);

  const resultText =
    firstInnings && secondInnings
      ? getMatchResultSummary({
          firstInningsRuns: firstInnings.total_runs,
          firstInningsBattingTeam: firstInnings.batting_team,
          secondInningsRuns: secondInnings.total_runs,
          secondInningsWickets: secondInnings.wickets,
          secondInningsBattingTeam: secondInnings.batting_team,
          battingTeamPlayerCount: players.filter(
            (p) => p.team_name === secondInnings.batting_team,
          ).length,
        }).text
      : null;

  return (
    <main className="min-h-screen px-3 pb-10 space-y-3" style={{ background: "var(--background)" }}>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 pt-6 pb-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Matches
      </Link>

      <MatchTabs matchId={match.id} active="scorecard" />

      {/* Match header */}
      <section
        className="rounded-2xl border border-border bg-card px-4 py-4"
        style={{
          boxShadow: "0 6px 20px rgba(0,0,0,0.24)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Scorecard</p>
            <h1 className="mt-0.5 font-scoreboard text-xl font-bold leading-tight text-foreground truncate">
              {match.team_a_name} <span className="text-muted-foreground font-normal text-base">vs</span> {match.team_b_name}
            </h1>
          </div>
          <Link
            href={`/match/${match.id}/live`}
            className="shrink-0 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-80"
          >
            Live →
          </Link>
        </div>

        {match.status !== "COMPLETED" ? (
          <p className="mt-2 text-xs text-muted-foreground">Match in progress</p>
        ) : null}
      </section>

      <ScorecardView inningsCards={inningsCards} resultText={resultText} />
    </main>
  );
}
