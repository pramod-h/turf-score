import { supabase } from "@/lib/supabase/client";

export async function getLiveMatch(matchId: string) {
  // Round trip 1: fetch match to get current_innings number
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .single();

  if (matchError || !match) {
    throw new Error(matchError?.message || "Match not found");
  }

  // Round trip 2: fetch current innings, all innings, and players in parallel
  const [
    { data: innings, error: inningsError },
    { data: allInnings, error: allInningsError },
    { data: players, error: playersError },
  ] = await Promise.all([
    supabase
      .from("innings")
      .select("*")
      .eq("match_id", matchId)
      .eq("inning_number", match.current_innings)
      .single(),
    supabase
      .from("innings")
      .select("*")
      .eq("match_id", matchId)
      .order("inning_number", { ascending: true }),
    supabase
      .from("players")
      .select("*")
      .eq("match_id", matchId)
      .order("created_at", { ascending: true }),
  ]);

  if (inningsError || !innings) throw new Error(inningsError?.message || "Innings not found");
  if (allInningsError || !allInnings) throw new Error(allInningsError?.message || "All innings not found");
  if (playersError || !players) throw new Error(playersError?.message || "Players not found");

  // Round trip 3: fetch ball events (needs innings.id from round trip 2)
  const { data: ballEvents, error: ballEventsError } = await supabase
    .from("ball_events")
    .select("*")
    .eq("innings_id", innings.id)
    .order("sequence", { ascending: true });

  if (ballEventsError) throw new Error(ballEventsError.message || "Ball events not found");

  return {
    match,
    innings,
    allInnings,
    players,
    ballEvents: ballEvents ?? [],
  };
}
