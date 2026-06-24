import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getOversDisplay } from "@/modules/cricket/engine/helpers";

type LiveScoreHeaderProps = {
  matchId: string;
  battingTeam: string;
  inningsNumber: number;
  totalRuns: number;
  wickets: number;
  legalBalls: number;
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
  matchId,
  battingTeam,
  inningsNumber,
  totalRuns,
  wickets,
  legalBalls,
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
  return (
    <>
      <section
        className="rounded-2xl overflow-hidden border border-border"
        style={{
          background: isMatchCompleted
            ? "linear-gradient(135deg, #131525 0%, #1a1c2e 100%)"
            : "linear-gradient(135deg, #0d1f17 0%, #131525 60%, #131525 100%)",
        }}
      >
        {/* Innings label + badge */}
        <div className="px-4 pt-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Innings {inningsNumber}
              {isSecondInnings && !isMatchCompleted ? " · Chase" : ""}
            </p>
            <p className="mt-0.5 text-base font-semibold text-foreground">
              {battingTeam}
            </p>
          </div>

          {isMatchCompleted ? (
            <span className="rounded-full border border-border px-3 py-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Final
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-destructive/90 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              Live
            </span>
          )}
        </div>

        {/* Score — centrepiece */}
        <div className="px-4 pt-3 pb-4 flex items-end justify-between gap-2">
          <div
            className="font-scoreboard font-bold leading-none text-foreground"
            style={{ fontSize: "88px", lineHeight: 1 }}
          >
            {totalRuns}
            <span className="text-primary">/</span>
            {wickets}
          </div>

          <div className="pb-2 text-right space-y-1">
            <p className="font-scoreboard text-3xl font-bold leading-none text-foreground">
              {getOversDisplay(legalBalls)}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              overs
            </p>
            <Link
              href={`/match/${matchId}`}
              className="inline-block text-xs font-semibold text-[#60A5FA] hover:underline underline-offset-2"
            >
              Scorecard →
            </Link>
          </div>
        </div>

        {/* Footer strip */}
        <div className="border-t border-border/60 bg-black/10 px-4 py-2.5 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {saving ? "Saving…" : isMatchCompleted ? "Match locked" : "Tap to score"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isMatchCompleted ? "✓ Complete" : "● Live scoring"}
          </p>
        </div>
      </section>

      {/* Innings-complete action banner */}
      {inningsDone ? (
        <section className="rounded-2xl border border-primary/30 bg-primary/10 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">
              {inningsNumber === 1 ? "🏏" : "🏆"}
            </span>
            <div>
              <p className="text-sm font-bold text-primary">
                {inningsNumber === 1 ? "First innings complete" : "Match complete"}
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
