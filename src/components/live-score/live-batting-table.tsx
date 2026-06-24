import { BatterStats } from "@/modules/cricket/types";
import {
  DuckIcon,
  GoldenDuckIcon,
  DiamondDuckIcon,
  FiftyIcon,
  CenturyIcon,
} from "@/components/cricket-icons";

type LiveBattingTableProps = {
  battingStats: Record<string, BatterStats>;
  strikerId: string | null;
  nonStrikerId: string | null;
};

type Badge = {
  icon: React.ReactNode;
  label: string;
  scoreClass: string;
};

function getBatterBadge(player: BatterStats): Badge | null {
  if (player.isOut && player.runs === 0) {
    if (player.balls === 0)
      return {
        icon: <DiamondDuckIcon className="h-4 w-4" />,
        label: "Diamond Duck",
        scoreClass: "text-cyan-400",
      };
    if (player.balls === 1)
      return {
        icon: <GoldenDuckIcon className="h-4 w-4" />,
        label: "Golden Duck",
        scoreClass: "text-yellow-400",
      };
    return {
      icon: <DuckIcon className="h-4 w-4" />,
      label: "Duck",
      scoreClass: "text-orange-400",
    };
  }
  if (!player.isOut) {
    if (player.runs >= 100)
      return {
        icon: <CenturyIcon className="h-4 w-4" />,
        label: "Century",
        scoreClass: "text-yellow-400",
      };
    if (player.runs >= 50)
      return {
        icon: <FiftyIcon className="h-4 w-4" />,
        label: "Fifty",
        scoreClass: "text-primary",
      };
  }
  return null;
}

export function LiveBattingTable({
  battingStats,
  strikerId,
  nonStrikerId,
}: LiveBattingTableProps) {
  const rows = Object.values(battingStats);

  return (
    <section className="rounded-2xl bg-card border border-border overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Batting
        </p>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-t border-border bg-muted/30">
            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Batter</th>
            <th className="px-2 py-2 text-right text-xs font-medium text-muted-foreground">R</th>
            <th className="px-2 py-2 text-right text-xs font-medium text-muted-foreground">B</th>
            <th className="px-2 py-2 text-right text-xs font-medium text-muted-foreground">4s</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">6s</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((player) => {
            const isStriker = strikerId === player.playerId;
            const isNonStriker = nonStrikerId === player.playerId;
            const isActive = isStriker || isNonStriker;
            const badge = getBatterBadge(player);

            return (
              <tr
                key={player.playerId}
                className={`border-t border-border ${isStriker ? "bg-primary/10" : ""}`}
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-medium leading-tight ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                      {player.name}
                    </span>
                    {isStriker ? (
                      <span className="text-primary font-bold text-sm">*</span>
                    ) : isNonStriker ? (
                      <span className="text-xs text-muted-foreground">ns</span>
                    ) : null}
                    {player.isOut && !isActive ? (
                      <span className="text-[10px] text-destructive/60">out</span>
                    ) : null}
                    {badge ? (
                      <span title={badge.label} className="shrink-0">
                        {badge.icon}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className={`px-2 py-2.5 text-right font-scoreboard font-bold tabular-nums ${badge ? badge.scoreClass : "text-foreground"}`}>
                  {player.runs}
                </td>
                <td className="px-2 py-2.5 text-right tabular-nums text-muted-foreground">
                  {player.balls}
                </td>
                <td className="px-2 py-2.5 text-right tabular-nums text-muted-foreground">
                  {player.fours}
                </td>
                <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">
                  {player.sixes}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
