import { BatterStats, BowlerStats, RecentBall } from "@/modules/cricket/types";
import { HatTrickIcon } from "@/components/cricket-icons";
import { getOversDisplay } from "@/modules/cricket/engine/helpers";
import { Button } from "@/components/ui/button";

type LivePlayersPanelProps = {
  striker: BatterStats | null;
  nonStriker: BatterStats | null;
  bowler: BowlerStats | null;
  recentBalls: RecentBall[];
  battingTeam: string;
  bowlingTeam: string;
  isMatchCompleted: boolean;
  addingPlayer: boolean;
  finishingMatch: boolean;
  showAddPlayer: boolean;
  newPlayerTeam: string;
  newPlayerName: string;
  onToggleAddPlayer: () => void;
  onTeamChange: (team: string) => void;
  onNameChange: (name: string) => void;
  onAddPlayer: () => void;
};

function BallPip({ type, label }: { type: string; label: string }) {
  const base =
    "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold tabular-nums";
  if (type === "WICKET")
    return (
      <div className="flex flex-col items-center gap-0.5">
        <span className={`${base} bg-destructive/25 text-destructive border border-destructive/50`}>
          W
        </span>
      </div>
    );
  if (type === "RUN_6")
    return <span className={`${base} bg-primary text-primary-foreground shadow-[0_0_8px_rgba(34,197,94,0.5)]`}>6</span>;
  if (type === "RUN_4")
    return <span className={`${base} bg-[#1E3A5F] text-[#60A5FA] border border-[#3B82F6]/40`}>4</span>;
  if (type === "WIDE" || type === "NO_BALL")
    return <span className={`${base} border border-border text-muted-foreground`}>{label}</span>;
  if (type === "DOT")
    return <span className={`${base} bg-muted text-muted-foreground`}>·</span>;
  return <span className={`${base} bg-secondary text-foreground`}>{label}</span>;
}

export function LivePlayersPanel({
  striker,
  nonStriker,
  bowler,
  recentBalls,
  battingTeam,
  bowlingTeam,
  isMatchCompleted,
  addingPlayer,
  finishingMatch,
  showAddPlayer,
  newPlayerTeam,
  newPlayerName,
  onToggleAddPlayer,
  onTeamChange,
  onNameChange,
  onAddPlayer,
}: LivePlayersPanelProps) {
  const lastTwo = recentBalls.slice(-2);
  const isHatTrickBall =
    lastTwo.length === 2 && lastTwo.every((b) => b.type === "WICKET");

  return (
    <>
      {/* Hat-trick alert */}
      {isHatTrickBall && !isMatchCompleted ? (
        <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 flex items-center gap-3">
          <HatTrickIcon className="h-9 w-9 shrink-0" />
          <div>
            <p className="text-sm font-bold text-yellow-400">Hat-trick ball!</p>
            <p className="text-xs text-muted-foreground">
              {bowler?.name ?? "Bowler"} is on a hat-trick
            </p>
          </div>
        </div>
      ) : null}

      {/* Current batters & bowler */}
      <section className="rounded-2xl bg-card border border-border p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            At the crease
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleAddPlayer}
            disabled={isMatchCompleted || addingPlayer || finishingMatch}
            className="text-xs"
          >
            {showAddPlayer ? "Cancel" : "+ Player"}
          </Button>
        </div>

        {showAddPlayer ? (
          <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Team
              </label>
              <select
                value={newPlayerTeam}
                onChange={(e) => onTeamChange(e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground"
                disabled={isMatchCompleted || addingPlayer || finishingMatch}
              >
                <option value={battingTeam}>{battingTeam}</option>
                <option value={bowlingTeam}>{bowlingTeam}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Name
              </label>
              <input
                value={newPlayerName}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Player name"
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                disabled={isMatchCompleted || addingPlayer || finishingMatch}
              />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={onAddPlayer}
              disabled={
                isMatchCompleted || !newPlayerName.trim() || addingPlayer || finishingMatch
              }
            >
              {addingPlayer ? "Adding…" : "Add Player"}
            </Button>
          </div>
        ) : null}

        <div className="space-y-2">
          {/* Striker */}
          <div className="flex items-center justify-between rounded-xl bg-primary/10 border border-primary/20 px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <div>
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {striker?.name ?? "—"}
                  <span className="ml-1 text-primary">*</span>
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Striker
                </p>
              </div>
            </div>
            {striker ? (
              <div className="text-right">
                <p className="font-scoreboard text-xl font-bold tabular-nums text-foreground">
                  {striker.runs}
                  <span className="text-xs font-normal text-muted-foreground ml-0.5">
                    ({striker.balls})
                  </span>
                </p>
              </div>
            ) : null}
          </div>

          {/* Non-striker */}
          <div className="flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
              <div>
                <p className="text-sm font-medium text-foreground leading-tight">
                  {nonStriker?.name ?? "—"}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Non-striker
                </p>
              </div>
            </div>
            {nonStriker ? (
              <p className="font-scoreboard text-xl font-bold tabular-nums text-muted-foreground">
                {nonStriker.runs}
                <span className="text-xs font-normal ml-0.5">({nonStriker.balls})</span>
              </p>
            ) : null}
          </div>

          {/* Bowler */}
          <div className="flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#60A5FA]/60" />
              <div>
                <p className="text-sm font-medium text-foreground leading-tight">
                  {bowler?.name ?? "—"}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Bowling
                </p>
              </div>
            </div>
            {bowler ? (
              <p className="font-mono text-sm tabular-nums text-[#60A5FA]">
                {bowler.runsConceded}/{bowler.wickets}
                <span className="text-muted-foreground">
                  {" "}({getOversDisplay(bowler.legalBalls)})
                </span>
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* This over */}
      <section className="rounded-2xl bg-card border border-border p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          This over
        </p>
        <div className="flex flex-wrap gap-2">
          {recentBalls.length === 0 ? (
            <span className="text-sm text-muted-foreground">Over starting…</span>
          ) : (
            recentBalls.map((ball, index) => (
              <BallPip key={`${ball.type}-${index}`} type={ball.type} label={ball.label} />
            ))
          )}
        </div>
      </section>
    </>
  );
}
