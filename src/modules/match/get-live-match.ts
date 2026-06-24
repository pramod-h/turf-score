import { supabase } from "@/lib/supabase/client";

export async function getLiveMatch(matchId: string) {
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
    .eq("inning_number", match.current_innings)
    .single();

  if (inningsError || !innings) {
    throw new Error(inningsError?.message || "Innings not found");
  }

  const { data: allInnings, error: allInningsError } = await supabase
    .from("innings")
    .select("*")
    .eq("match_id", matchId)
    .order("inning_number", { ascending: true });

  if (allInningsError || !allInnings) {
    throw new Error(allInningsError?.message || "All innings not found");
  }

  const { data: players, error: playersError } = await supabase
    .from("players")
    .select("*")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });

  if (playersError || !players) {
    throw new Error(playersError?.message || "Players not found");
  }

  const { data: ballEvents, error: ballEventsError } = await supabase
    .from("ball_events")
    .select("*")
    .eq("innings_id", innings.id)
    .order("sequence", { ascending: true });

  if (ballEventsError) {
    throw new Error(ballEventsError.message || "Ball events not found");
  }

  return {
    match,
    innings,
    allInnings,
    players,
    ballEvents: ballEvents ?? [],
  };
}
