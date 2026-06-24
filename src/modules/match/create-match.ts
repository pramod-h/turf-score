import { supabase } from "@/lib/supabase/client";
import { MatchSetupFormValues } from "./setup-schema";

function deriveInningsTeams(values: MatchSetupFormValues) {
  const tossWinnerName =
    values.tossWinner === "teamA" ? values.teamAName : values.teamBName;
  const otherTeamName =
    values.tossWinner === "teamA" ? values.teamBName : values.teamAName;

  if (values.tossDecision === "BAT") {
    return {
      battingFirstTeam: tossWinnerName,
      bowlingFirstTeam: otherTeamName,
    };
  }

  return {
    battingFirstTeam: otherTeamName,
    bowlingFirstTeam: tossWinnerName,
  };
}

export async function createMatch(values: MatchSetupFormValues) {
  const { battingFirstTeam, bowlingFirstTeam } = deriveInningsTeams(values);

  // 1) create match
  const { data: match, error: matchError } = await supabase
    .from("matches")
    .insert({
      name: values.name,
      overs_per_innings: values.oversPerInnings,
      wickets_per_innings: values.wicketsPerInnings,

      team_a_name: values.teamAName,
      team_b_name: values.teamBName,

      toss_winner:
        values.tossWinner === "teamA" ? values.teamAName : values.teamBName,
      toss_decision: values.tossDecision,
      batting_first_team: battingFirstTeam,
      bowling_first_team: bowlingFirstTeam,

      current_innings: 1,
      status: "LIVE",
    })
    .select()
    .single();

  if (matchError || !match) {
    throw new Error(matchError?.message || "Failed to create match");
  }

  // 2) create players
  const playerRows = [
    ...values.teamAPlayers.map((playerName) => ({
      match_id: match.id,
      team_key: "A",
      team_name: values.teamAName,
      player_name: playerName,
    })),
    ...values.teamBPlayers.map((playerName) => ({
      match_id: match.id,
      team_key: "B",
      team_name: values.teamBName,
      player_name: playerName,
    })),
  ];

  const { data: players, error: playersError } = await supabase
    .from("players")
    .insert(playerRows)
    .select();

  if (playersError || !players) {
    throw new Error(playersError?.message || "Failed to create players");
  }

  // 3) create innings 1
  const { data: innings, error: inningsError } = await supabase
    .from("innings")
    .insert({
      match_id: match.id,
      inning_number: 1,
      batting_team: battingFirstTeam,
      bowling_team: bowlingFirstTeam,
      total_runs: 0,
      wickets: 0,
      legal_balls: 0,
      is_completed: false,
    })
    .select()
    .single();

  if (inningsError || !innings) {
    throw new Error(inningsError?.message || "Failed to create innings");
  }

  return {
    match,
    players,
    innings,
  };
}
