import { applyBallEvent } from "@/modules/cricket/engine/apply-ball-event";
import {
  BallEventInput,
  BallEventRow,
  LiveInningsState,
} from "@/modules/cricket/types";

export function mapRowToEvent(row: BallEventRow): BallEventInput {
  switch (row.event_type) {
    case "DOT":
      return { type: "DOT" };
    case "RUN_1":
      return { type: "RUN_1" };
    case "RUN_2":
      return { type: "RUN_2" };
    case "RUN_4":
      return { type: "RUN_4" };
    case "RUN_6":
      return { type: "RUN_6" };
    case "WIDE":
      return { type: "WIDE" };
    case "NO_BALL":
      return { type: "NO_BALL" };
    case "WICKET":
      return {
        type: "WICKET",
        outPlayerId: row.out_player_id!,
        nextBatterId: row.next_batter_id!,
      };
    default:
      return { type: "DOT" };
  }
}

export function rebuildInningsFromEventRows(
  initialState: LiveInningsState,
  rows: BallEventRow[],
) {
  let state = initialState;

  for (const row of rows) {
    state = applyBallEvent(state, mapRowToEvent(row));
  }

  return state;
}
