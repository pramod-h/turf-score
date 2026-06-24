import { supabase } from "@/lib/supabase/client";

export async function getMatchScorecard(matchId: string) {
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .single();

  if (matchError || !match) {
    throw new Error(matchError?.message || "Match not found");
  }

  const { data: innings, error: inningsError } = await supabase
    .from("innings")
    .select("*")
    .eq("match_id", matchId)
    .order("inning_number", { ascending: true });

  if (inningsError || !innings) {
    throw new Error(inningsError?.message || "Innings not found");
  }

  const inningsIds = innings.map((item) => item.id);

  const { data: players, error: playersError } = await supabase
    .from("players")
    .select("*")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });

  if (playersError || !players) {
    throw new Error(playersError?.message || "Players not found");
  }

  let ballEvents: Array<{
    id: string;
    innings_id: string;
    sequence: number;
    event_type:
      | "DOT"
      | "RUN_1"
      | "RUN_2"
      | "RUN_4"
      | "RUN_6"
      | "WIDE"
      | "NO_BALL"
      | "WICKET";
    out_player_id: string | null;
    next_batter_id: string | null;
  }> = [];

  if (inningsIds.length > 0) {
    const { data, error } = await supabase
      .from("ball_events")
      .select("*")
      .in("innings_id", inningsIds)
      .order("innings_id", { ascending: true })
      .order("sequence", { ascending: true });

    if (error) {
      throw new Error(error.message || "Ball events not found");
    }

    ballEvents = data ?? [];
  }

  return {
    match,
    innings,
    players,
    ballEvents,
  };
}
