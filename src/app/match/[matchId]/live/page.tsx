import { LiveScoreClient } from "@/components/live-score/live-score-client";
import { createBaseLiveState } from "@/modules/cricket/engine/create-base-live-state";
import { rebuildInningsFromEventRows } from "@/modules/match/rebuild-innings-from-events";
import { getLiveMatch } from "@/modules/match/get-live-match";

type LiveMatchPageProps = {
  params: Promise<{
    matchId: string;
  }>;
};

export default async function LiveMatchPage({ params }: LiveMatchPageProps) {
  const { matchId } = await params;
  const { match, innings, allInnings, players, ballEvents } =
    await getLiveMatch(matchId);

  const baseState = createBaseLiveState(match, innings, players);
  const initialState = rebuildInningsFromEventRows(baseState, ballEvents);

  const firstInnings =
    allInnings.find((item) => item.inning_number === 1) ?? null;

  return (
    <LiveScoreClient
      key={innings.id}
      match={match}
      innings={innings}
      firstInnings={firstInnings}
      players={players}
      baseState={baseState}
      initialState={initialState}
      initialEventRows={ballEvents}
    />
  );
}
