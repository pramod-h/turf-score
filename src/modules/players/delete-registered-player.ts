import { supabase } from "@/lib/supabase/client";

export async function deleteRegisteredPlayer(id: string): Promise<void> {
  const { error } = await supabase
    .from("registered_players")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}
