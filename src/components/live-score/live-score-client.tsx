"use client";

import { Button } from "@/components/ui/button";
import { LiveChaseCard } from "@/components/live-score/live-chase-card";
import { MatchTabs } from "@/components/live-score/match-tabs";
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
  const hasBottomChoice =
    c.pendingWicket || c.pendingBowlerChange || c.needsOpenerSelection;
  const shouldShowScorePad =
    !c.isMatchCompleted &&
    !c.inningsDone &&
    !c.showAddPlayer &&
    !c.addingPlayer &&
    !hasBottomChoice;
  const shouldShowBottomControls = hasBottomChoice || shouldShowScorePad;
  const bottomLabel = c.pendingWicket
    ? "Next batter"
    : c.pendingBowlerChange
      ? "Next bowler"
      : c.needsOpenerSelection
        ? "Lineup"
        : "Score pad";

  return (
    <div className="flex flex-col h-[calc(100dvh-3.5rem)] bg-background">
      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto px-3 space-y-3 pb-4 pt-4">
        <MatchTabs matchId={props.match.id} active="live" />

        {c.error ? (
          <ErrorBanner message={c.error} onDismiss={c.clearError} />
        ) : null}

        <LiveScoreHeader
          battingTeam={c.liveState.battingTeam}
          inningsNumber={props.innings.inning_number}
          totalRuns={c.liveState.totalRuns}
          wickets={c.liveState.wickets}
          legalBalls={c.liveState.legalBalls}
          target={c.target}
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
      </div>

      {/* ── Fixed bottom: pickers + scoring pad ── */}
      {shouldShowBottomControls ? (
        <div className="shrink-0 bg-background">
          {/* Drag handle — acts as a scroll buffer so fingers don't land on buttons */}
          <div className="flex items-center justify-center gap-3 py-2.5">
            <div className="h-[3px] w-7 rounded-full bg-border" />
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
              {bottomLabel}
            </span>
            <div className="h-[3px] w-7 rounded-full bg-border" />
          </div>
          <div className="border-t border-border px-3 pb-4 pt-2 space-y-2">
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
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-xl text-sm font-bold"
                    onClick={c.cancelWicket}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="h-11 rounded-xl text-sm font-bold"
                    onClick={() => void c.confirmWicket()}
                    disabled={
                      !c.selectedNextBatterId || c.saving || c.finishingMatch
                    }
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
                  className="h-11 w-full rounded-xl text-sm font-bold"
                  onClick={c.confirmBowlerChange}
                  disabled={!c.selectedNextBowlerId || c.finishingMatch}
                >
                  Confirm Bowler
                </Button>
              </div>
            ) : null}

            {/* Opener selection — shown before first ball */}
            {c.needsOpenerSelection ? (
              <div
                className="rounded-2xl p-4 space-y-4"
                style={{
                  background: "var(--card)",
                  boxShadow: "var(--shadow-neu-card)",
                }}
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-0.5">
                    Select Opening Lineup
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pick batters and the opening bowler before scoring begins
                  </p>
                </div>

                {/* Opener 1 — Striker */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Opener 1 (Striker)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {c.battingPlayerOptions.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          c.setOpenerStrikerId(p.id);
                          if (c.openerNonStrikerId === p.id)
                            c.setOpenerNonStrikerId("");
                        }}
                        className="flex-1 min-w-[30%] rounded-xl py-2.5 px-3 text-sm font-semibold transition-all active:scale-95"
                        style={
                          c.openerStrikerId === p.id
                            ? {
                                background:
                                  "var(--primary)",
                                color: "var(--primary-foreground)",
                                boxShadow: "var(--shadow-neu-red)",
                              }
                            : {
                                background: "var(--background)",
                                color: "var(--muted-foreground)",
                                boxShadow: "var(--shadow-neu-raised-xs)",
                              }
                        }
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opener 2 — Non-striker */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Opener 2 (Non-striker)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {c.battingPlayerOptions
                      .filter((p) => p.id !== c.openerStrikerId)
                      .map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => c.setOpenerNonStrikerId(p.id)}
                          className="flex-1 min-w-[30%] rounded-xl py-2.5 px-3 text-sm font-semibold transition-all active:scale-95"
                          style={
                            c.openerNonStrikerId === p.id
                            ? {
                                background:
                                  "var(--primary)",
                                color: "var(--primary-foreground)",
                                boxShadow: "var(--shadow-neu-red)",
                              }
                            : {
                                background: "var(--background)",
                                color: "var(--muted-foreground)",
                                boxShadow: "var(--shadow-neu-raised-xs)",
                              }
                          }
                        >
                          {p.name}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Opening Bowler */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Opening Bowler
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {c.bowlingPlayerOptions.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => c.setOpenerBowlerId(p.id)}
                        className="flex-1 min-w-[30%] rounded-xl py-2.5 px-3 text-sm font-semibold transition-all active:scale-95"
                        style={
                          c.openerBowlerId === p.id
                          ? {
                              background: "linear-gradient(145deg,#2979FF,#1565C0)",
                              color: "#E3F2FD",
                              boxShadow: "4px 4px 10px rgba(21,101,192,0.38), -2px -2px 6px var(--neu-highlight)",
                            }
                          : {
                              background: "var(--background)",
                              color: "var(--muted-foreground)",
                              boxShadow: "var(--shadow-neu-raised-xs)",
                            }
                        }
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={
                    !c.openerStrikerId ||
                    !c.openerNonStrikerId ||
                    !c.openerBowlerId ||
                    c.confirmingOpeners
                  }
                  onClick={() => void c.confirmOpeners()}
                  className="w-full rounded-xl py-3 text-sm font-bold text-white uppercase tracking-widest transition-all active:scale-95 disabled:opacity-40"
                style={{
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                  boxShadow: "var(--shadow-neu-red-lg)",
                }}
                >
                  {c.confirmingOpeners ? "Saving…" : "Start Match →"}
                </button>
              </div>
            ) : shouldShowScorePad ? (
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
      ) : null}
    </div>
  );
}
