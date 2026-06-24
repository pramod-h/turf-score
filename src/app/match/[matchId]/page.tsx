import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getOversDisplay } from "@/modules/cricket/engine/helpers";
import { buildScorecard } from "@/modules/match/build-scorecard";
import { getMatchScorecard } from "@/modules/match/get-match-scorecard";
import { getMatchResultSummary } from "@/modules/match/get-match-result-summary";

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
    <main className="min-h-screen px-3 pb-10 space-y-3">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 pt-6 pb-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Matches
      </Link>

      {/* Match header */}
      <section className="rounded-2xl bg-card border border-border p-4 space-y-3">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Scorecard
          </p>
          <h1 className="font-scoreboard text-2xl font-bold leading-tight text-foreground">
            {match.team_a_name} vs {match.team_b_name}
          </h1>
        </div>

        {resultText ? (
          <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
            <p className="text-sm font-semibold text-primary">{resultText}</p>
          </div>
        ) : null}

        {match.status !== "COMPLETED" ? (
          <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground">
              Match in progress — scorecard updates as scoring continues.
            </p>
          </div>
        ) : null}

        <Link
          href={`/match/${match.id}/live`}
          className="inline-flex rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Open Scorer →
        </Link>
      </section>

      {inningsCards.length === 0 ? (
        <section className="rounded-2xl bg-card border border-border p-4">
          <p className="text-sm text-muted-foreground">No innings yet.</p>
        </section>
      ) : null}

      {inningsCards.map(({ inning, state }) => {
        const battingRows = Object.values(state.battingStats);
        const bowlingRows = Object.values(state.bowlingStats);

        return (
          <section key={inning.id} className="space-y-2">
            {/* Innings score header */}
            <div className="rounded-2xl bg-card border border-border px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Innings {inning.inning_number}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {inning.batting_team}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-scoreboard text-3xl font-bold leading-none text-foreground">
                    {state.totalRuns}/{state.wickets}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {getOversDisplay(state.legalBalls)} ov
                  </p>
                </div>
              </div>
            </div>

            {/* Batting table */}
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="px-4 pt-3 pb-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Batting
                </p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-border bg-muted/30">
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                      Batter
                    </th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-muted-foreground">R</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-muted-foreground">B</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-muted-foreground">4s</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">6s</th>
                  </tr>
                </thead>
                <tbody>
                  {battingRows.map((player) => (
                    <tr key={player.playerId} className="border-t border-border">
                      <td className="px-4 py-2.5">
                        <span
                          className={`font-medium ${player.isOut ? "text-muted-foreground" : "text-foreground"}`}
                        >
                          {player.name}
                        </span>
                        {player.isOut ? (
                          <span className="ml-1.5 text-xs text-destructive/60">out</span>
                        ) : null}
                      </td>
                      <td className="px-2 py-2.5 text-right font-scoreboard font-semibold tabular-nums text-foreground">
                        {player.runs}
                      </td>
                      <td className="px-2 py-2.5 text-right tabular-nums text-muted-foreground">
                        {player.balls}
                      </td>
                      <td className="px-2 py-2.5 text-right tabular-nums text-muted-foreground">
                        {player.fours}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                        {player.sixes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bowling table */}
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="px-4 pt-3 pb-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Bowling
                </p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-border bg-muted/30">
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                      Bowler
                    </th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-muted-foreground">O</th>
                    <th className="px-2 py-2 text-right text-xs font-medium text-muted-foreground">R</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">W</th>
                  </tr>
                </thead>
                <tbody>
                  {bowlingRows.map((player) => (
                    <tr key={player.playerId} className="border-t border-border">
                      <td className="px-4 py-2.5 font-medium text-foreground">
                        {player.name}
                      </td>
                      <td className="px-2 py-2.5 text-right font-mono tabular-nums text-muted-foreground">
                        {getOversDisplay(player.legalBalls)}
                      </td>
                      <td className="px-2 py-2.5 text-right tabular-nums text-muted-foreground">
                        {player.runsConceded}
                      </td>
                      <td className="px-4 py-2.5 text-right font-scoreboard font-semibold tabular-nums text-foreground">
                        {player.wickets}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </main>
  );
}
