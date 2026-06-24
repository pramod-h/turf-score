import { Button } from "@/components/ui/button";
import { getOversDisplay } from "@/modules/cricket/engine/helpers";

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
      <section
        className="rounded-2xl overflow-hidden relative"
        style={
          isLive
            ? {
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow:
                  "0 8px 24px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)",
              }
            : {
                background: "var(--card)",
                border: "1px solid var(--border)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
              }
        }
      >
        {/* Innings label + badge */}
        <div className="relative px-4 pt-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
              Innings {inningsNumber}
              {isSecondInnings && !isMatchCompleted ? " · Chase" : ""}
            </p>
            <p className="mt-0.5 text-base font-semibold text-white">
              {battingTeam}
            </p>
          </div>

          {isMatchCompleted ? (
            <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white/50">
              Final
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/12 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-[0_2px_8px_rgba(0,0,0,0.28)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
              </span>
              Live
            </span>
          )}
        </div>

        {/* Score */}
        <div className="relative px-4 pt-2 pb-4 flex items-end justify-between gap-2">
          <div
            className="font-scoreboard font-bold leading-none text-white"
            style={{ fontSize: "78px", lineHeight: 1 }}
          >
            {totalRuns}
            <span className="text-primary">/</span>
            {wickets}
          </div>

          <div className="pb-2 text-right">
            <div>
              <p className="font-scoreboard text-3xl font-bold leading-none text-white">
                {getOversDisplay(legalBalls)}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/60">
                overs
              </p>
            </div>
            {isSecondInnings && target !== null ? (
              <div className="mt-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
                  Target
                </p>
                <p className="font-scoreboard text-2xl font-bold leading-none text-white">
                  {target}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div
          className="relative px-4 py-2.5 flex items-center justify-between"
          style={{
            background: "rgba(0,0,0,0.18)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <p className="text-xs text-white/50">
            {saving
              ? "Saving…"
              : isMatchCompleted
                ? "Match locked"
                : "Tap pad to score"}
          </p>
          <p className="text-xs text-white/50">
            {isMatchCompleted ? "✓ Complete" : "● Live"}
          </p>
        </div>
      </section>

      {/* Innings-complete banner */}
      {inningsDone ? (
        <section
          className="rounded-2xl border border-primary/30 p-4 space-y-3"
          style={{
            background: "color-mix(in srgb, var(--primary) 10%, var(--card))",
            boxShadow: "0 2px 12px rgba(0,0,0,0.24)",
          }}
        >
          <div className="flex items-start gap-3">
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
        </section>
      ) : null}
    </>
  );
}
