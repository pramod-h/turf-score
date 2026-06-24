import { createBaseLiveState } from "@/modules/cricket/engine/create-base-live-state";
import { applyBallEvent } from "@/modules/cricket/engine/apply-ball-event";
import { BallEventRow } from "@/modules/cricket/types";
import { mapRowToEvent } from "@/modules/match/rebuild-innings-from-events";

type BuildScorecardMatch = {
  overs_per_innings: number;
  wickets_per_innings: number;
};

type BuildScorecardInnings = {
  id: string;
  batting_team: string;
  bowling_team: string;
  striker_id: string | null;
  non_striker_id: string | null;
  current_bowler_id: string | null;
};

type BuildScorecardPlayer = {
  id: string;
  team_name: string;
  player_name: string;
};

export function buildScorecard({
  match,
  innings,
  players,
  ballEvents,
}: {
  match: BuildScorecardMatch;
  innings: BuildScorecardInnings;
  players: BuildScorecardPlayer[];
  ballEvents: BallEventRow[];
}) {
  let state = createBaseLiveState(match, innings, players);

  for (const row of ballEvents) {
    state = applyBallEvent(state, mapRowToEvent(row));
  }

  return state;
}
