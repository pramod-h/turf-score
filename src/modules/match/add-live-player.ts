import { supabase } from "@/lib/supabase/client";

type AddLivePlayerParams = {
  matchId: string;
  teamName: string;
  teamKey: "A" | "B";
  playerName: string;
};

export async function addLivePlayer({
  matchId,
  teamName,
  teamKey,
  playerName,
}: AddLivePlayerParams) {
  const trimmedName = playerName.trim();

  if (!trimmedName) {
    throw new Error("Player name is required");
  }

  const { data, error } = await supabase
    .from("players")
    .insert({
      match_id: matchId,
      team_name: teamName,
      team_key: teamKey,
      player_name: trimmedName,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to add player");
  }

  return data;
}
