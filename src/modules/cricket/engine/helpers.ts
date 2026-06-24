import { LiveInningsState } from "../types";

export function swapStrike(
  strikerId: string | null,
  nonStrikerId: string | null,
) {
  return {
    strikerId: nonStrikerId,
    nonStrikerId: strikerId,
  };
}

export function getOversDisplay(legalBalls: number) {
  const overs = Math.floor(legalBalls / 6);
  const balls = legalBalls % 6;
  return `${overs}.${balls}`;
}

export function isOverComplete(legalBalls: number) {
  return legalBalls > 0 && legalBalls % 6 === 0;
}

export function isInningsOver(state: LiveInningsState): boolean {
  const totalBatters = Object.keys(state.battingStats).length;
  // innings ends when only 1 batter remains — can't bat alone
  const lastBatterStanding = totalBatters > 0 && state.wickets >= totalBatters - 1;

  return (
    state.legalBalls >= state.oversLimit * 6 ||
    state.wickets >= state.wicketsLimit ||
    lastBatterStanding
  );
}

export function isChaseWon(params: {
  inningsNumber: number;
  target: number | null;
  totalRuns: number;
}): boolean {
  const { inningsNumber, target, totalRuns } = params;
  return inningsNumber === 2 && target !== null && totalRuns >= target;
}
