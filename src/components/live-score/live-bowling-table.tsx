import { BowlerStats } from "@/modules/cricket/types";
import { getOversDisplay } from "@/modules/cricket/engine/helpers";
import { NeuCard, NeuSectionHeader } from "@/components/ui/neu-card";

type LiveBowlingTableProps = {
  bowlingStats: Record<string, BowlerStats>;
  currentBowlerId: string | null;
};

export function LiveBowlingTable({
  bowlingStats,
  currentBowlerId,
}: LiveBowlingTableProps) {
  const rows = Object.values(bowlingStats);

  return (
    <NeuCard>
      <NeuSectionHeader title="Bowling" divider={false} className="pt-4 pb-2" />

      <table className="w-full text-sm">
        <thead>
          <tr className="border-t border-border bg-muted/30">
            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground"></th>
            <th className="px-2 py-2 text-right text-xs font-medium text-muted-foreground">O</th>
            <th className="px-2 py-2 text-right text-xs font-medium text-muted-foreground">R</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground">W</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((player) => {
            const isCurrent = currentBowlerId === player.playerId;

            return (
              <tr
                key={player.playerId}
                className={`border-t border-border ${isCurrent ? "bg-primary/10" : ""}`}
              >
                <td className="px-4 py-2.5">
                  <span className={`font-medium ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                    {player.name}
                  </span>
                  {isCurrent ? (
                    <span className="ml-1 text-primary font-bold">*</span>
                  ) : null}
                </td>
                <td className="px-2 py-2.5 text-right font-mono tabular-nums text-muted-foreground">
                  {getOversDisplay(player.legalBalls)}
                </td>
                <td className="px-2 py-2.5 text-right tabular-nums text-muted-foreground">
                  {player.runsConceded}
                </td>
                <td className="px-4 py-2.5 text-right font-scoreboard font-semibold tabular-nums">
                  {player.wickets}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </NeuCard>
  );
}
