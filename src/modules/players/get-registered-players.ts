import { supabase } from "@/lib/supabase/client";

export type RegisteredPlayer = {
  id: string;
  name: string;
  created_at: string;
};

export async function getRegisteredPlayers(): Promise<RegisteredPlayer[]> {
  const { data, error } = await supabase
    .from("registered_players")
    .select("id, name, created_at")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}
