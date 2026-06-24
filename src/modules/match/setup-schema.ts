import { z } from "zod";

export const matchSetupSchema = z.object({
  name: z.string().min(1, "Match name is required"),
  oversPerInnings: z.coerce.number().min(1, "Overs must be at least 1"),
  wicketsPerInnings: z.coerce.number().min(1, "Wickets must be at least 1"),

  teamAName: z.string().min(1, "Team A name is required"),
  teamBName: z.string().min(1, "Team B name is required"),

  teamAPlayers: z
    .array(z.string().min(1, "Player name is required"))
    .min(2, "Add at least 2 players for Team A"),

  teamBPlayers: z
    .array(z.string().min(1, "Player name is required"))
    .min(2, "Add at least 2 players for Team B"),

  tossWinner: z.enum(["teamA", "teamB"]),
  tossDecision: z.enum(["BAT", "BOWL"]),
});

export type MatchSetupFormValues = z.infer<typeof matchSetupSchema>;
