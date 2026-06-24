import { supabase } from "@/lib/supabase/client";

export type MatchInningsSummary = {
  inning_number: number;
  batting_team: string;
  total_runs: number;
  wickets: number;
  legal_balls: number;
};

export type MatchListItem = {
  id: string;
  name: string;
  team_a_name: string;
  team_b_name: string;
  status: string;
  created_at: string;
  innings: MatchInningsSummary[];
};

export async function getMatches(): Promise<MatchListItem[]> {
  const { data, error } = await supabase
    .from("matches")
    .select(
      "id, name, team_a_name, team_b_name, status, created_at, innings(inning_number, batting_team, total_runs, wickets, legal_balls)",
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as MatchListItem[];
}
