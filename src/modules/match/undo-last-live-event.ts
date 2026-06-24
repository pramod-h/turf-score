import { supabase } from "@/lib/supabase/client";
import { BallEventRow, LiveInningsState } from "@/modules/cricket/types";
import { rebuildInningsFromEventRows } from "./rebuild-innings-from-events";

type BallEventRowWithId = BallEventRow & { id: string };

export async function undoLastLiveEvent(params: {
  inningsId: string;
  initialState: LiveInningsState;
}) {
  const { inningsId, initialState } = params;

  // 1) get latest event
  const { data: latestEvent, error: latestEventError } = await supabase
    .from("ball_events")
    .select("id, event_type, out_player_id, next_batter_id, sequence")
    .eq("innings_id", inningsId)
    .order("sequence", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestEventError) {
    throw new Error(latestEventError.message || "Failed to fetch latest event");
  }

  if (!latestEvent) {
    return {
      state: initialState,
      deletedEventId: null,
      remainingEvents: [] as BallEventRowWithId[],
    };
  }

  // 2) delete latest event
  const { error: deleteError } = await supabase
    .from("ball_events")
    .delete()
    .eq("id", latestEvent.id);

  if (deleteError) {
    throw new Error(deleteError.message || "Failed to delete latest event");
  }

  // 3) fetch remaining events
  const { data: remainingEvents, error: remainingEventsError } = await supabase
    .from("ball_events")
    .select("id, event_type, out_player_id, next_batter_id")
    .eq("innings_id", inningsId)
    .order("sequence", { ascending: true });

  if (remainingEventsError || !remainingEvents) {
    throw new Error(
      remainingEventsError?.message || "Failed to fetch remaining events",
    );
  }

  // 4) rebuild innings state
  const rebuiltState = rebuildInningsFromEventRows(
    initialState,
    remainingEvents as BallEventRowWithId[],
  );

  // 5) update innings snapshot
  const { error: inningsError } = await supabase
    .from("innings")
    .update({
      total_runs: rebuiltState.totalRuns,
      wickets: rebuiltState.wickets,
      legal_balls: rebuiltState.legalBalls,
      striker_id: rebuiltState.strikerId,
      non_striker_id: rebuiltState.nonStrikerId,
      current_bowler_id: rebuiltState.currentBowlerId,
    })
    .eq("id", inningsId);

  if (inningsError) {
    throw new Error(
      inningsError.message || "Failed to update innings snapshot",
    );
  }

  return {
    state: rebuiltState,
    deletedEventId: latestEvent.id,
    remainingEvents: remainingEvents as BallEventRowWithId[],
  };
}
