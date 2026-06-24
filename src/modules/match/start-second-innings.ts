import { supabase } from "@/lib/supabase/client";

type MatchRow = {
  id: string;
};

type PlayerRow = {
  id: string;
  team_name: string;
  player_name: string;
};

type FirstInningsRow = {
  inning_number: number;
  batting_team: string;
  bowling_team: string;
};

export async function startSecondInnings(params: {
  match: MatchRow;
  firstInnings: FirstInningsRow;
  players: PlayerRow[];
}) {
  const { match, firstInnings, players } = params;

  if (firstInnings.inning_number !== 1) {
    throw new Error("Second innings can only be started after first innings");
  }

  // batting/bowling teams swap for innings 2
  const battingTeam = firstInnings.bowling_team;
  const bowlingTeam = firstInnings.batting_team;

  const battingPlayers = players.filter(
    (player) => player.team_name === battingTeam,
  );
  const bowlingPlayers = players.filter(
    (player) => player.team_name === bowlingTeam,
  );

  if (battingPlayers.length < 2) {
    throw new Error("Second innings requires at least 2 batting players");
  }

  if (bowlingPlayers.length < 1) {
    throw new Error("Second innings requires at least 1 bowling player");
  }

  const strikerId = battingPlayers[0].id;
  const nonStrikerId = battingPlayers[1].id;
  const currentBowlerId = bowlingPlayers[0].id;

  // prevent duplicate second innings creation
  const { data: existingSecondInnings, error: existingError } = await supabase
    .from("innings")
    .select("id")
    .eq("match_id", match.id)
    .eq("inning_number", 2)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message || "Failed to check second innings");
  }

  if (existingSecondInnings) {
    await supabase
      .from("matches")
      .update({ current_innings: 2 })
      .eq("id", match.id);

    return {
      inningsId: existingSecondInnings.id,
      alreadyExists: true,
    };
  }

  const { data: secondInnings, error: inningsError } = await supabase
    .from("innings")
    .insert({
      match_id: match.id,
      inning_number: 2,
      batting_team: battingTeam,
      bowling_team: bowlingTeam,
      total_runs: 0,
      wickets: 0,
      legal_balls: 0,
      striker_id: strikerId,
      non_striker_id: nonStrikerId,
      current_bowler_id: currentBowlerId,
    })
    .select("id")
    .single();

  if (inningsError || !secondInnings) {
    throw new Error(inningsError?.message || "Failed to create second innings");
  }

  const { error: matchError } = await supabase
    .from("matches")
    .update({
      current_innings: 2,
      status: "LIVE",
    })
    .eq("id", match.id);

  if (matchError) {
    throw new Error(matchError.message || "Failed to switch to second innings");
  }

  return {
    inningsId: secondInnings.id,
    alreadyExists: false,
  };
}
