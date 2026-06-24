import { supabase } from "@/lib/supabase/client";
import { BallEventInput, LiveInningsState } from "@/modules/cricket/types";

function mapEventToRow(event: BallEventInput) {
  switch (event.type) {
    case "DOT":
      return { event_type: "DOT", runs: 0, is_legal_ball: true };
    case "RUN_1":
      return { event_type: "RUN_1", runs: 1, is_legal_ball: true };
    case "RUN_2":
      return { event_type: "RUN_2", runs: 2, is_legal_ball: true };
    case "RUN_4":
      return { event_type: "RUN_4", runs: 4, is_legal_ball: true };
    case "RUN_6":
      return { event_type: "RUN_6", runs: 6, is_legal_ball: true };
    case "WIDE":
      return { event_type: "WIDE", runs: 0, is_legal_ball: false };
    case "NO_BALL":
      return { event_type: "NO_BALL", runs: 0, is_legal_ball: false };
    case "WICKET":
      return { event_type: "WICKET", runs: 0, is_legal_ball: true };
    default:
      return { event_type: "DOT", runs: 0, is_legal_ball: true };
  }
}

export async function saveLiveEvent(params: {
  inningsId: string;
  event: BallEventInput;
  stateAfter: LiveInningsState;
  sequence: number;
}) {
  const { inningsId, event, stateAfter, sequence } = params;

  const mapped = mapEventToRow(event);

  const { error: eventError } = await supabase.from("ball_events").insert({
    innings_id: inningsId,
    sequence,
    event_type: mapped.event_type,
    runs: mapped.runs,
    is_legal_ball: mapped.is_legal_ball,

    striker_id: stateAfter.strikerId,
    non_striker_id: stateAfter.nonStrikerId,
    bowler_id: stateAfter.currentBowlerId,

    out_player_id: event.type === "WICKET" ? event.outPlayerId : null,
    next_batter_id: event.type === "WICKET" ? event.nextBatterId : null,

    team_runs_after: stateAfter.totalRuns,
    wickets_after: stateAfter.wickets,
    legal_balls_after: stateAfter.legalBalls,
  });

  if (eventError) {
    throw new Error(eventError.message || "Failed to save ball event");
  }

  const { error: inningsError } = await supabase
    .from("innings")
    .update({
      total_runs: stateAfter.totalRuns,
      wickets: stateAfter.wickets,
      legal_balls: stateAfter.legalBalls,
      striker_id: stateAfter.strikerId,
      non_striker_id: stateAfter.nonStrikerId,
      current_bowler_id: stateAfter.currentBowlerId,
    })
    .eq("id", inningsId);

  if (inningsError) {
    throw new Error(inningsError.message || "Failed to update innings");
  }
}
