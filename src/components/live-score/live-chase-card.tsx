type LiveChaseCardProps = {
  target: number;
  runsNeeded: number;
  ballsLeft: number;
  inningsDone: boolean;
  battingTeam: string;
  secondInningsResult: string | null;
};

export function LiveChaseCard({
  target,
  runsNeeded,
  ballsLeft,
  inningsDone,
  battingTeam,
  secondInningsResult,
}: LiveChaseCardProps) {
  const runsScored = target - runsNeeded;
  const progress = target > 0 ? Math.min(runsScored / target, 1) : 0;

  return (
    <section className="rounded-2xl bg-card border border-border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Chase
        </p>
        {secondInningsResult ? (
          <span className="text-xs font-semibold text-primary">
            {secondInningsResult}
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-2 font-variant-numeric">
        <div className="rounded-xl bg-muted/60 p-3 text-center">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Target
          </p>
          <p className="mt-1 font-scoreboard text-2xl font-bold leading-none text-foreground">
            {target}
          </p>
        </div>

        <div className="rounded-xl bg-primary/[0.12] border border-primary/30 p-3 text-center">
          <p className="text-[10px] font-medium uppercase tracking-wider text-primary">
            Need
          </p>
          <p className="mt-1 font-scoreboard text-2xl font-bold leading-none text-primary">
            {runsNeeded}
          </p>
        </div>

        <div className="rounded-xl bg-muted/60 p-3 text-center">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Balls
          </p>
          <p className="mt-1 font-scoreboard text-2xl font-bold leading-none text-foreground">
            {ballsLeft}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      {!inningsDone ? (
        <div className="space-y-1.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {runsNeeded > 0
              ? `${battingTeam} need ${runsNeeded} from ${ballsLeft} ball${ballsLeft === 1 ? "" : "s"}`
              : `${battingTeam} have won`}
          </p>
        </div>
      ) : null}
    </section>
  );
}
