export type BallEventType =
  | "DOT"
  | "RUN_1"
  | "RUN_2"
  | "RUN_4"
  | "RUN_6"
  | "WIDE"
  | "NO_BALL"
  | "WICKET";

export type BallEventRow = {
  event_type: BallEventType;
  out_player_id: string | null;
  next_batter_id: string | null;
};

export type BallEventInput =
  | { type: "DOT" }
  | { type: "RUN_1" }
  | { type: "RUN_2" }
  | { type: "RUN_4" }
  | { type: "RUN_6" }
  | { type: "WIDE" }
  | { type: "NO_BALL" }
  | {
      type: "WICKET";
      outPlayerId: string;
      nextBatterId: string;
    };

export type BatterStats = {
  playerId: string;
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  isOut: boolean;
};

export type BowlerStats = {
  playerId: string;
  name: string;
  legalBalls: number;
  runsConceded: number;
  wickets: number;
};

export type RecentBall = {
  type: BallEventType;
  label: string;
};

export type LiveInningsState = {
  inningsId: string;
  battingTeam: string;
  bowlingTeam: string;
  oversLimit: number;
  wicketsLimit: number;

  totalRuns: number;
  wickets: number;
  legalBalls: number;

  strikerId: string | null;
  nonStrikerId: string | null;
  currentBowlerId: string | null;

  yetToBat: string[];

  battingStats: Record<string, BatterStats>;
  bowlingStats: Record<string, BowlerStats>;

  recentBalls: RecentBall[];
};
