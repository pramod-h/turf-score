import { LiveInningsState } from "../types";

type MatchRow = {
  id: string;
  team_a_name: string;
  team_b_name: string;
  overs_per_innings: number;
  wickets_per_innings: number;
};

type InningsRow = {
  id: string;
  batting_team: string;
  bowling_team: string;
  total_runs: number;
  wickets: number;
  legal_balls: number;
  striker_id: string | null;
  non_striker_id: string | null;
  current_bowler_id: string | null;
};

type PlayerRow = {
  id: string;
  team_key: "A" | "B";
  team_name: string;
  player_name: string;
};

export function createInitialLiveState(
  match: MatchRow,
  innings: InningsRow,
  players: PlayerRow[],
): LiveInningsState {
  const battingPlayers = players.filter(
    (player) => player.team_name === innings.batting_team,
  );

  const bowlingPlayers = players.filter(
    (player) => player.team_name === innings.bowling_team,
  );

  const striker = innings.striker_id ?? battingPlayers[0]?.id ?? null;
  const nonStriker = innings.non_striker_id ?? battingPlayers[1]?.id ?? null;
  const currentBowler =
    innings.current_bowler_id ?? bowlingPlayers[0]?.id ?? null;

  const battingStats = Object.fromEntries(
    battingPlayers.map((player) => [
      player.id,
      {
        playerId: player.id,
        name: player.player_name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isOut: false,
      },
    ]),
  );

  const bowlingStats = Object.fromEntries(
    bowlingPlayers.map((player) => [
      player.id,
      {
        playerId: player.id,
        name: player.player_name,
        legalBalls: 0,
        runsConceded: 0,
        wickets: 0,
      },
    ]),
  );

  const yetToBat = battingPlayers
    .map((player) => player.id)
    .filter((id) => id !== striker && id !== nonStriker);

  return {
    inningsId: innings.id,
    battingTeam: innings.batting_team,
    bowlingTeam: innings.bowling_team,
    oversLimit: match.overs_per_innings,
    wicketsLimit: match.wickets_per_innings,

    totalRuns: innings.total_runs,
    wickets: innings.wickets,
    legalBalls: innings.legal_balls,

    strikerId: striker,
    nonStrikerId: nonStriker,
    currentBowlerId: currentBowler,

    yetToBat,

    battingStats,
    bowlingStats,

    recentBalls: [],
  };
}
