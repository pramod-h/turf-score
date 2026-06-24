import { supabase } from "@/lib/supabase/client";

type FinishMatchParams = {
  matchId: string;
};

export async function finishMatch({ matchId }: FinishMatchParams) {
  const { data, error } = await supabase
    .from("matches")
    .update({
      status: "COMPLETED",
    })
    .eq("id", matchId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to finish match");
  }

  return data;
}
