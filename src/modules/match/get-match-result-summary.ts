export type MatchResultSummary = {
  text: string;
  winner: string | null;
  marginType: "runs" | "wickets" | "tie";
  marginValue: number;
};

type MatchResultInput = {
  firstInningsRuns: number;
  firstInningsBattingTeam: string;
  secondInningsRuns: number;
  secondInningsWickets: number;
  secondInningsBattingTeam: string;
  battingTeamPlayerCount: number;
};

export function getMatchResultSummary(
  input: MatchResultInput,
): MatchResultSummary {
  const {
    firstInningsRuns,
    firstInningsBattingTeam,
    secondInningsRuns,
    secondInningsWickets,
    secondInningsBattingTeam,
    battingTeamPlayerCount,
  } = input;

  if (secondInningsRuns > firstInningsRuns) {
    const wicketsRemaining = Math.max(
      battingTeamPlayerCount - secondInningsWickets - 1,
      0,
    );
    return {
      text: `${secondInningsBattingTeam} won by ${wicketsRemaining} wicket${wicketsRemaining === 1 ? "" : "s"}`,
      winner: secondInningsBattingTeam,
      marginType: "wickets",
      marginValue: wicketsRemaining,
    };
  }

  if (secondInningsRuns === firstInningsRuns) {
    return {
      text: "Match tied",
      winner: null,
      marginType: "tie",
      marginValue: 0,
    };
  }

  const runsMargin = firstInningsRuns - secondInningsRuns;
  return {
    text: `${firstInningsBattingTeam} won by ${runsMargin} run${runsMargin === 1 ? "" : "s"}`,
    winner: firstInningsBattingTeam,
    marginType: "runs",
    marginValue: runsMargin,
  };
}
