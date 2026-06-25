"use client";

import { useEffect, useRef } from "react";
import { Mic } from "lucide-react";
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
import { useVoiceScore, isVoiceSupported } from "@/hooks/use-voice-score";
import { useVoiceStore } from "@/stores/voice-store";

const ACTION_LABELS: Record<string, string> = {
  DOT: "Dot",
  RUN_1: "1 Run",
  RUN_2: "2 Runs",
  RUN_4: "Four!",
  RUN_6: "Six!",
  WIDE: "Wide",
  NO_BALL: "No Ball",
  WICKET: "Wicket!",
  UNDO: "Undo",
};

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

  const {
    voiceEnabled,
    listening,
    lastAction,
    lastTranscript,
    setListening,
    setLastAction,
    setLastTranscript,
    setSupported,
  } = useVoiceStore();

  // Tell the store whether this device supports voice
  useEffect(() => {
    setSupported(isVoiceSupported());
  }, [setSupported]);

  const applyRef = useRef(c.apply);
  applyRef.current = c.apply;
  const handleWicketRef = useRef(c.handleWicketClick);
  handleWicketRef.current = c.handleWicketClick;
  const handleUndoRef = useRef(c.handleUndo);
  handleUndoRef.current = c.handleUndo;

  const { start, stop } = useVoiceScore({
    handlers: {
      DOT: () => void applyRef.current("DOT"),
      RUN_1: () => void applyRef.current("RUN_1"),
      RUN_2: () => void applyRef.current("RUN_2"),
      RUN_4: () => void applyRef.current("RUN_4"),
      RUN_6: () => void applyRef.current("RUN_6"),
      WIDE: () => void applyRef.current("WIDE"),
      NO_BALL: () => void applyRef.current("NO_BALL"),
      WICKET: () => handleWicketRef.current(),
      UNDO: () => void handleUndoRef.current(),
    },
    onListening: setListening,
    onAction: (a) => {
      setLastAction(a);
      setTimeout(() => setLastAction(null), 2500);
    },
    onTranscript: setLastTranscript,
    autoRestart: true,
  });

  // Start / stop based on voiceEnabled toggle
  useEffect(() => {
    if (voiceEnabled) {
      start();
    } else {
      stop();
      setLastAction(null);
      setLastTranscript("");
    }
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceEnabled]);

  const hasBottomChoice =
    c.pendingWicket || c.pendingBowlerChange || c.needsOpenerSelection;
  const shouldShowScorePad =
    !c.isMatchCompleted &&
    !c.inningsDone &&
    !c.showAddPlayer &&
    !c.addingPlayer &&
    !hasBottomChoice &&
    !voiceEnabled;
  const shouldShowVoicePanel =
    voiceEnabled &&
    !c.isMatchCompleted &&
    !hasBottomChoice;
  const shouldShowBottomControls =
    hasBottomChoice || shouldShowScorePad || shouldShowVoicePanel;
  const bottomLabel = c.pendingWicket
    ? "Next batter"
    : c.pendingBowlerChange
      ? "Next bowler"
      : c.needsOpenerSelection
        ? "Lineup"
        : voiceEnabled
          ? "Voice scoring"
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

      {/* ── Fixed bottom: pickers + scoring pad + voice panel ── */}
      {shouldShowBottomControls ? (
        <div className="shrink-0 bg-background">
          {/* Drag handle */}
          <div className="flex items-center justify-center gap-3 py-2.5">
            <div className="h-[3px] w-7 rounded-full bg-border" />
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
              {bottomLabel}
            </span>
            <div className="h-[3px] w-7 rounded-full bg-border" />
          </div>
          <div className="border-t border-border px-3 pb-4 pt-2 space-y-2">
            {/* Wicket picker */}
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

            {/* Bowler picker */}
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

            {/* Opener selection */}
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
                                background: "var(--primary)",
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
                                  background: "var(--primary)",
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
                                background:
                                  "linear-gradient(145deg,#2979FF,#1565C0)",
                                color: "#E3F2FD",
                                boxShadow:
                                  "4px 4px 10px rgba(21,101,192,0.38), -2px -2px 6px var(--neu-highlight)",
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
            ) : shouldShowVoicePanel ? (
              <VoicePanel
                listening={listening}
                lastAction={lastAction}
                lastTranscript={lastTranscript}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function VoicePanel({
  listening,
  lastAction,
  lastTranscript,
}: {
  listening: boolean;
  lastAction: string | null;
  lastTranscript: string;
}) {
  return (
    <section
      className="rounded-2xl p-5 flex flex-col items-center gap-3"
      style={{
        background: "var(--background)",
        boxShadow: "var(--shadow-neu-pad)",
      }}
    >
      {/* Mic icon with animated ring */}
      <div className="relative flex items-center justify-center">
        {listening ? (
          <>
            <span
              className="absolute h-16 w-16 rounded-full animate-ping opacity-20"
              style={{ background: "var(--primary)" }}
            />
            <span
              className="absolute h-12 w-12 rounded-full animate-ping opacity-30"
              style={{ background: "var(--primary)", animationDelay: "0.3s" }}
            />
          </>
        ) : null}
        <div
          className="relative flex h-14 w-14 items-center justify-center rounded-full"
          style={
            listening
              ? {
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                  boxShadow: "var(--shadow-neu-red-lg)",
                }
              : {
                  background: "var(--background)",
                  color: "var(--muted-foreground)",
                  boxShadow: "var(--shadow-neu-raised)",
                }
          }
        >
          <Mic className="h-6 w-6" />
        </div>
      </div>

      {/* Status text */}
      <div className="text-center min-h-[2.5rem] flex flex-col items-center justify-center">
        {lastAction ? (
          <>
            <p className="text-lg font-extrabold text-foreground tracking-wide">
              {ACTION_LABELS[lastAction] ?? lastAction}
            </p>
            {lastTranscript ? (
              <p className="text-xs text-muted-foreground mt-0.5">
                "{lastTranscript}"
              </p>
            ) : null}
          </>
        ) : listening ? (
          <p className="text-sm font-semibold text-primary animate-pulse">
            Listening…
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Say "dot", "one", "four", "six", "wide", "wicket"…
          </p>
        )}
      </div>
    </section>
  );
}
