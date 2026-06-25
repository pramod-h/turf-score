import { supabase } from "@/lib/supabase/client";
import { RegisteredPlayer } from "./get-registered-players";

export async function addRegisteredPlayer(name: string): Promise<RegisteredPlayer> {
  const { data, error } = await supabase
    .from("registered_players")
    .insert({ name: name.trim() })
    .select()
    .single();
  if (error || !data) throw new Error(error?.message ?? "Failed to add player");
  return data as RegisteredPlayer;
}
