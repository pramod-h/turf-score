import { BatterStats, BowlerStats, RecentBall } from "@/modules/cricket/types";
import { HatTrickIcon } from "@/components/cricket-icons";
import { getOversDisplay } from "@/modules/cricket/engine/helpers";
import { Button } from "@/components/ui/button";
import { NeuCard, NeuSectionHeader } from "@/components/ui/neu-card";
import { NEU_INSET_SM } from "@/lib/neu-styles";

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
          background: "rgba(239,68,68,0.10)",
          color: "var(--primary)",
          boxShadow: "inset 2px 2px 4px rgba(239,68,68,0.12), inset -2px -2px 4px var(--neu-highlight-lg)",
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
          background: "linear-gradient(135deg,#1B5E20,#43A047)",
          color: "#E8F5E9",
          boxShadow: "3px 3px 8px rgba(27,94,32,0.35), -1px -1px 4px var(--neu-highlight)",
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
          background: "linear-gradient(135deg,#1565C0,#2979FF)",
          color: "#E3F2FD",
          boxShadow: "3px 3px 8px rgba(21,101,192,0.35), -1px -1px 4px var(--neu-highlight)",
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
          background: "var(--background)",
          color: "var(--muted-foreground)",
          boxShadow: "var(--shadow-neu-inset-sm)",
        }}
      >
        {label}
      </span>
    );
  if (type === "DOT")
    return (
      <span
        className={base}
        style={{
          background: "var(--background)",
          color: "var(--muted-foreground)",
          boxShadow: "var(--shadow-neu-inset-sm)",
        }}
      >
        ·
      </span>
    );
  return (
    <span
      className={base}
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        fontWeight: 600,
        boxShadow: "var(--shadow-neu-inset-sm)",
      }}
    >
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
            background: "var(--card)",
            boxShadow: "var(--shadow-neu-card)",
            borderLeft: "3px solid var(--accent)",
          }}
        >
          <HatTrickIcon className="h-9 w-9 shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-500">Hat-trick ball!</p>
            <p className="text-xs text-muted-foreground">
              {bowler?.name ?? "Bowler"} is on a hat-trick
            </p>
          </div>
        </div>
      ) : null}

      {/* This over */}
      <NeuCard>
        <NeuSectionHeader title="This over" titleColor="var(--primary)" />
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
      </NeuCard>

      {/* Current batters & bowler */}
      <NeuCard>
        <NeuSectionHeader title="At the crease" titleColor="var(--primary)">
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
        </NeuSectionHeader>

        <div className="p-4 space-y-3">
          {showAddPlayer ? (
            <div
              className="space-y-3 rounded-xl p-3"
              style={{
                background: "var(--background)",
                boxShadow: "var(--shadow-neu-inset)",
              }}
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
                background: "rgba(239,68,68,0.05)",
                boxShadow: "inset 2px 2px 5px rgba(239,68,68,0.08), inset -2px -2px 5px var(--neu-highlight-lg)",
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
              style={NEU_INSET_SM}
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
                background: "rgba(41,121,255,0.05)",
                boxShadow: "inset 2px 2px 5px rgba(41,121,255,0.08), inset -2px -2px 5px var(--neu-highlight-lg)",
              }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: "#2979FF" }}
                />
                <div>
                  <p className="text-sm font-medium text-foreground leading-tight">
                    {bowler?.name ?? "—"}
                  </p>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: "#2979FF" }}
                  >
                    Bowling
                  </p>
                </div>
              </div>
              {bowler ? (
                <p
                  className="font-mono text-sm tabular-nums font-semibold"
                  style={{ color: "#2979FF" }}
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
      </NeuCard>
    </>
  );
}
