"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveBattingTable } from "@/components/live-score/live-batting-table";
import { LiveBowlingTable } from "@/components/live-score/live-bowling-table";
import { LiveChaseCard } from "@/components/live-score/live-chase-card";
import { LivePlayersPanel } from "@/components/live-score/live-players-panel";
import { LiveScoreHeader } from "@/components/live-score/live-score-header";
import { ScoringPad } from "@/components/live-score/scoring-pad";
import {
  LiveScoreClientProps,
  useLiveScoringController,
} from "@/components/live-score/use-live-scoring-controller";

function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-destructive/40 bg-destructive/15 px-4 py-3">
      <p className="text-sm font-medium text-destructive">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss error"
        className="shrink-0 text-destructive/70 hover:text-destructive"
      >
        ✕
      </button>
    </div>
  );
}

export function LiveScoreClient(props: LiveScoreClientProps) {
  const c = useLiveScoringController(props);

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto px-3 space-y-3 pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 pt-6 pb-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Matches
        </Link>

        {c.error ? (
          <ErrorBanner message={c.error} onDismiss={c.clearError} />
        ) : null}

        <LiveScoreHeader
          matchId={props.match.id}
          battingTeam={c.liveState.battingTeam}
          inningsNumber={props.innings.inning_number}
          totalRuns={c.liveState.totalRuns}
          wickets={c.liveState.wickets}
          legalBalls={c.liveState.legalBalls}
          saving={c.saving}
          isMatchCompleted={c.isMatchCompleted}
          isSecondInnings={c.isSecondInnings}
          inningsDone={c.inningsDone}
          secondInningsResult={c.secondInningsResult}
          startingSecondInnings={c.startingSecondInnings}
          finishingMatch={c.finishingMatch}
          onStartSecondInnings={() => void c.handleStartSecondInnings()}
          onFinishMatch={() => void c.handleFinishMatch()}
        />

        {c.isSecondInnings && c.target !== null ? (
          <LiveChaseCard
            target={c.target}
            runsNeeded={c.runsNeeded ?? 0}
            ballsLeft={c.ballsLeft}
            inningsDone={c.inningsDone}
            battingTeam={c.liveState.battingTeam}
            secondInningsResult={c.secondInningsResult}
          />
        ) : null}

        <LivePlayersPanel
          striker={c.striker}
          nonStriker={c.nonStriker}
          bowler={c.bowler}
          recentBalls={c.liveState.recentBalls}
          battingTeam={c.liveState.battingTeam}
          bowlingTeam={c.liveState.bowlingTeam}
          isMatchCompleted={c.isMatchCompleted}
          addingPlayer={c.addingPlayer}
          finishingMatch={c.finishingMatch}
          showAddPlayer={c.showAddPlayer}
          newPlayerTeam={c.newPlayerTeam}
          newPlayerName={c.newPlayerName}
          onToggleAddPlayer={c.toggleAddPlayer}
          onTeamChange={c.setNewPlayerTeam}
          onNameChange={c.setNewPlayerName}
          onAddPlayer={() => void c.handleAddPlayer()}
        />

        <LiveBattingTable
          battingStats={c.liveState.battingStats}
          strikerId={c.liveState.strikerId}
          nonStrikerId={c.liveState.nonStrikerId}
        />

        <LiveBowlingTable
          bowlingStats={c.liveState.bowlingStats}
          currentBowlerId={c.liveState.currentBowlerId}
        />
      </div>

      {/* ── Fixed bottom: pickers + scoring pad ── */}
      <div className="shrink-0 border-t border-border bg-background px-3 pt-2 pb-4 space-y-2">
        {/* Wicket picker — slides in above pad */}
        {c.pendingWicket ? (
          <div className="rounded-2xl bg-card border border-destructive/40 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-destructive">
              Wicket — Select Next Batter
            </p>
            <div className="flex flex-wrap gap-2">
              {c.nextBatterOptions.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => c.setSelectedNextBatterId(player.id)}
                  className={`flex-1 min-w-[30%] rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                    c.selectedNextBatterId === player.id
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {player.name}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Button type="button" variant="outline" onClick={c.cancelWicket}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => void c.confirmWicket()}
                disabled={!c.selectedNextBatterId || c.saving || c.finishingMatch}
              >
                Confirm
              </Button>
            </div>
          </div>
        ) : null}

        {/* Bowler picker — slides in above pad */}
        {c.pendingBowlerChange ? (
          <div className="rounded-2xl bg-card border border-primary/30 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Over complete — Select Bowler
            </p>
            <div className="flex flex-wrap gap-2">
              {c.bowlerOptions.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => c.setSelectedNextBowlerId(player.id)}
                  className={`flex-1 min-w-[30%] rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                    c.selectedNextBowlerId === player.id
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {player.name}
                </button>
              ))}
            </div>
            <Button
              type="button"
              className="w-full"
              onClick={c.confirmBowlerChange}
              disabled={!c.selectedNextBowlerId || c.finishingMatch}
            >
              Confirm Bowler
            </Button>
          </div>
        ) : null}

        {/* Always-visible scoring pad */}
        {!c.isMatchCompleted ? (
          <ScoringPad
            onDot={() => void c.apply("DOT")}
            onRun1={() => void c.apply("RUN_1")}
            onRun2={() => void c.apply("RUN_2")}
            onRun4={() => void c.apply("RUN_4")}
            onRun6={() => void c.apply("RUN_6")}
            onWide={() => void c.apply("WIDE")}
            onNoBall={() => void c.apply("NO_BALL")}
            onWicket={c.handleWicketClick}
            onUndo={() => void c.handleUndo()}
            canUndo={c.hasEvents}
          />
        ) : null}
      </div>
    </div>
  );
}
