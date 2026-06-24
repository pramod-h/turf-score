import { supabase } from "@/lib/supabase/client";

export async function saveInningsOpeners(params: {
  inningsId: string;
  strikerId: string;
  nonStrikerId: string;
  currentBowlerId: string;
}) {
  const { inningsId, strikerId, nonStrikerId, currentBowlerId } = params;

  const { error } = await supabase
    .from("innings")
    .update({
      striker_id: strikerId,
      non_striker_id: nonStrikerId,
      current_bowler_id: currentBowlerId,
    })
    .eq("id", inningsId);

  if (error) throw new Error(error.message || "Failed to save opening lineup");
}
