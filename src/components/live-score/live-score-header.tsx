import { Button } from "@/components/ui/button";
import { getOversDisplay } from "@/modules/cricket/engine/helpers";
import { NeuCard } from "@/components/ui/neu-card";
import { ConfettiOverlay } from "@/components/ui/confetti-banner";

type LiveScoreHeaderProps = {
  battingTeam: string;
  inningsNumber: number;
  totalRuns: number;
  wickets: number;
  legalBalls: number;
  target: number | null;
  saving: boolean;
  isMatchCompleted: boolean;
  isSecondInnings: boolean;
  inningsDone: boolean;
  secondInningsResult: string | null;
  startingSecondInnings: boolean;
  finishingMatch: boolean;
  onStartSecondInnings: () => void;
  onFinishMatch: () => void;
};

export function LiveScoreHeader({
  battingTeam,
  inningsNumber,
  totalRuns,
  wickets,
  legalBalls,
  target,
  saving,
  isMatchCompleted,
  isSecondInnings,
  inningsDone,
  secondInningsResult,
  startingSecondInnings,
  finishingMatch,
  onStartSecondInnings,
  onFinishMatch,
}: LiveScoreHeaderProps) {
  const isLive = !isMatchCompleted;

  return (
    <>
      <NeuCard variant="lg">
        {/* Innings label + badge */}
        <div className="px-4 pt-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Innings {inningsNumber}
              {isSecondInnings && !isMatchCompleted ? " · Chase" : ""}
            </p>
            <p className="mt-0.5 text-base font-bold text-foreground">
              {battingTeam}
            </p>
          </div>

          {isMatchCompleted ? (
            <span
              className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest text-muted-foreground"
              style={{
                background: "var(--background)",
                boxShadow: "var(--shadow-neu-raised-xs)",
              }}
            >
              Final
            </span>
          ) : (
            <span
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
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

        {/* Score */}
        <div className="px-4 pt-2 pb-4 flex items-end justify-between gap-2">
          <div
            className="font-scoreboard font-bold leading-none text-foreground"
            style={{ fontSize: "78px", lineHeight: 1 }}
          >
            {totalRuns}
            <span className="text-primary">/</span>
            {wickets}
          </div>

          <div className="pb-2 text-right">
            <div>
              <p className="font-scoreboard text-3xl font-bold leading-none text-foreground">
                {getOversDisplay(legalBalls)}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                overs
              </p>
            </div>
            {isSecondInnings && target !== null ? (
              <div className="mt-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Target
                </p>
                <p className="font-scoreboard text-2xl font-bold leading-none text-foreground">
                  {target}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-4 py-2.5 flex items-center justify-between"
          style={{
            background: "rgba(0,0,0,0.025)",
            borderTop: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <p className="text-xs text-muted-foreground">
            {saving
              ? "Saving…"
              : isMatchCompleted
                ? "Match locked"
                : "Tap pad to score"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isMatchCompleted ? "✓ Complete" : "● Live"}
          </p>
        </div>
      </NeuCard>

      {/* Innings-complete banner */}
      {inningsDone ? (
        <NeuCard
          className="p-4 space-y-3 relative overflow-hidden"
          style={{
            background: inningsNumber === 2 ? "rgba(239,68,68,0.08)" : "var(--card)",
          }}
        >
          {inningsNumber === 2 ? <ConfettiOverlay /> : null}
          <div className="flex items-start gap-3 relative">
            <span className="text-2xl">
              {inningsNumber === 1 ? "🏏" : "🏆"}
            </span>
            <div>
              <p className="text-sm font-bold text-primary">
                {inningsNumber === 1
                  ? "First innings complete"
                  : "Match complete"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {inningsNumber === 1
                  ? "Set the target — start the chase."
                  : (secondInningsResult ?? "Second innings is done.")}
              </p>
            </div>
          </div>

          {inningsNumber === 1 && !isMatchCompleted ? (
            <Button
              type="button"
              className="w-full"
              onClick={onStartSecondInnings}
              disabled={startingSecondInnings || finishingMatch}
            >
              {startingSecondInnings ? "Starting…" : "Start 2nd Innings"}
            </Button>
          ) : null}
          {inningsNumber === 2 && !isMatchCompleted ? (
            <Button
              type="button"
              className="w-full"
              onClick={onFinishMatch}
              disabled={finishingMatch}
            >
              {finishingMatch ? "Finishing…" : "Finish Match"}
            </Button>
          ) : null}
        </NeuCard>
      ) : null}
    </>
  );
}
