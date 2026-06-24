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
      <span
        className={base}
        style={{
          background: "color-mix(in srgb, var(--destructive) 18%, transparent)",
          color: "var(--destructive)",
          border: "1px solid color-mix(in srgb, var(--destructive) 36%, transparent)",
        }}
      >
        W
      </span>
    );
  if (type === "RUN_6")
    return (
      <span
        className={base}
        style={{
          background: "linear-gradient(135deg,#2c5d75,#8ec5ff)",
          color: "#061923",
          boxShadow: "0 0 10px rgba(142,197,255,0.25)",
        }}
      >
        6
      </span>
    );
  if (type === "RUN_4")
    return (
      <span
        className={base}
        style={{
          background: "linear-gradient(135deg,#ffd166,#f4b942)",
          color: "var(--accent-foreground)",
          boxShadow: "0 0 8px rgba(255,209,102,0.25)",
        }}
      >
        4
      </span>
    );
  if (type === "WIDE" || type === "NO_BALL")
    return (
      <span
        className={base}
        style={{
          background: "var(--secondary)",
          color: "var(--muted-foreground)",
          border: "1px solid var(--border)",
        }}
      >
        {label}
      </span>
    );
  if (type === "DOT")
    return (
      <span className={`${base} bg-secondary text-muted-foreground`}>·</span>
    );
  return (
    <span className={`${base} bg-secondary text-foreground font-semibold`}>
      {label}
    </span>
  );
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
        <div
          className="rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{
          background: "rgba(245,158,11,0.12)",
            border: "1px solid color-mix(in srgb, var(--accent) 34%, transparent)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.24)",
          }}
        >
          <HatTrickIcon className="h-9 w-9 shrink-0" />
          <div>
            <p className="text-sm font-bold text-yellow-400">Hat-trick ball!</p>
            <p className="text-xs text-muted-foreground">
              {bowler?.name ?? "Bowler"} is on a hat-trick
            </p>
          </div>
        </div>
      ) : null}

      {/* This over */}
      <section
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
        }}
      >
        <div
          className="px-4 py-3"
          style={{
            background: "color-mix(in srgb, var(--primary) 9%, transparent)",
            borderBottom: "1px solid color-mix(in srgb, var(--primary) 20%, transparent)",
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            This over
          </p>
        </div>
        <div className="px-4 py-3 flex flex-wrap gap-2">
          {recentBalls.length === 0 ? (
            <span className="text-sm text-muted-foreground">
              Over starting…
            </span>
          ) : (
            recentBalls.map((ball, index) => (
              <BallPip
                key={`${ball.type}-${index}`}
                type={ball.type}
                label={ball.label}
              />
            ))
          )}
        </div>
      </section>

      {/* Current batters & bowler */}
      <section
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}
      >
        {/* Section header */}
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{
            background: "color-mix(in srgb, var(--primary) 10%, transparent)",
            borderBottom: "1px solid color-mix(in srgb, var(--primary) 20%, transparent)",
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            At the crease
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleAddPlayer}
            disabled={isMatchCompleted || addingPlayer || finishingMatch}
            className="text-xs h-7 px-2.5"
          >
            {showAddPlayer ? "Cancel" : "Add New Player"}
          </Button>
        </div>

        <div className="p-4 space-y-3">
          {showAddPlayer ? (
            <div
              className="space-y-3 rounded-xl p-3"
              style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
            >
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
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
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
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
                className="h-11 w-full rounded-xl text-sm font-bold"
                onClick={onAddPlayer}
                disabled={
                  isMatchCompleted ||
                  !newPlayerName.trim() ||
                  addingPlayer ||
                  finishingMatch
                }
              >
                {addingPlayer ? "Adding…" : "Add New Player"}
              </Button>
            </div>
          ) : null}

          <div className="space-y-2">
            {/* Striker */}
            <div
              className="flex items-center justify-between rounded-xl px-3 py-2.5"
              style={{
                background: "color-mix(in srgb, var(--primary) 14%, var(--card))",
                border: "1px solid color-mix(in srgb, var(--primary) 32%, transparent)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    {striker?.name ?? "—"}
                    <span className="ml-1 text-primary">*</span>
                  </p>
                  <p className="text-[10px] text-primary/70 font-semibold uppercase tracking-wider">
                    Striker
                  </p>
                </div>
              </div>
              {striker ? (
                <p className="font-scoreboard text-xl font-bold tabular-nums text-foreground">
                  {striker.runs}
                  <span className="text-xs font-normal text-muted-foreground ml-0.5">
                    ({striker.balls})
                  </span>
                </p>
              ) : null}
            </div>

            {/* Non-striker */}
            <div
              className="flex items-center justify-between rounded-xl px-3 py-2.5"
              style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
            >
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
                  <span className="text-xs font-normal ml-0.5">
                    ({nonStriker.balls})
                  </span>
                </p>
              ) : null}
            </div>

            {/* Bowler */}
            <div
              className="flex items-center justify-between rounded-xl px-3 py-2.5"
              style={{
                background: "color-mix(in srgb, #8ec5ff 10%, var(--card))",
                border: "1px solid color-mix(in srgb, #8ec5ff 28%, transparent)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: "#8ec5ff" }}
                />
                <div>
                  <p className="text-sm font-medium text-foreground leading-tight">
                    {bowler?.name ?? "—"}
                  </p>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: "#8ec5ff" }}
                  >
                    Bowling
                  </p>
                </div>
              </div>
              {bowler ? (
                <p
                  className="font-mono text-sm tabular-nums font-semibold"
                  style={{ color: "#8ec5ff" }}
                >
                  {bowler.runsConceded}/{bowler.wickets}
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    ({getOversDisplay(bowler.legalBalls)})
                  </span>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
