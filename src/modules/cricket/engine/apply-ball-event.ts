import { BallEventInput, LiveInningsState } from "../types";
import { isOverComplete, swapStrike } from "./helpers";

export function applyBallEvent(
  state: LiveInningsState,
  input: BallEventInput,
): LiveInningsState {
  const next: LiveInningsState = {
    ...state,
    battingStats: { ...state.battingStats },
    bowlingStats: { ...state.bowlingStats },
    recentBalls: [...state.recentBalls],
  };

  const strikerId = next.strikerId;
  const bowlerId = next.currentBowlerId;

  if (!strikerId || !bowlerId) return next;

  const striker = next.battingStats[strikerId];
  const bowler = next.bowlingStats[bowlerId];

  if (!striker || !bowler) return next;

  const pushRecent = (
    label: string,
    type: LiveInningsState["recentBalls"][number]["type"],
  ) => {
    next.recentBalls = [...next.recentBalls.slice(-5), { label, type }];
  };

  const completeLegalBall = () => {
    next.legalBalls += 1;

    bowler.legalBalls += 1;

    if (isOverComplete(next.legalBalls)) {
      const swapped = swapStrike(next.strikerId, next.nonStrikerId);
      next.strikerId = swapped.strikerId;
      next.nonStrikerId = swapped.nonStrikerId;
    }
  };

  switch (input.type) {
    case "DOT": {
      striker.balls += 1;
      pushRecent("•", "DOT");
      completeLegalBall();
      return next;
    }

    case "RUN_1": {
      striker.runs += 1;
      striker.balls += 1;
      next.totalRuns += 1;

      bowler.runsConceded += 1;

      pushRecent("1", "RUN_1");
      completeLegalBall();

      const swapped = swapStrike(next.strikerId, next.nonStrikerId);
      next.strikerId = swapped.strikerId;
      next.nonStrikerId = swapped.nonStrikerId;

      return next;
    }

    case "RUN_2": {
      striker.runs += 2;
      striker.balls += 1;
      next.totalRuns += 2;

      bowler.runsConceded += 2;

      pushRecent("2", "RUN_2");
      completeLegalBall();
      return next;
    }

    case "RUN_4": {
      striker.runs += 4;
      striker.balls += 1;
      striker.fours += 1;
      next.totalRuns += 4;

      bowler.runsConceded += 4;

      pushRecent("4", "RUN_4");
      completeLegalBall();
      return next;
    }

    case "RUN_6": {
      striker.runs += 6;
      striker.balls += 1;
      striker.sixes += 1;
      next.totalRuns += 6;

      bowler.runsConceded += 6;

      pushRecent("6", "RUN_6");
      completeLegalBall();
      return next;
    }

    case "WIDE": {
      pushRecent("Wd", "WIDE");
      return next;
    }

    case "NO_BALL": {
      pushRecent("Nb", "NO_BALL");
      return next;
    }

    case "WICKET": {
      striker.balls += 1;
      striker.isOut = true;

      next.wickets += 1;
      bowler.wickets += 1;

      pushRecent("W", "WICKET");
      completeLegalBall();

      next.strikerId = input.nextBatterId;
      next.yetToBat = next.yetToBat.filter((id) => id !== input.nextBatterId);

      return next;
    }

    default:
      return next;
  }
}
