import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { applyBallEvent } from "@/modules/cricket/engine/apply-ball-event";
import {
  isChaseWon,
  isInningsOver,
  isOverComplete,
} from "@/modules/cricket/engine/helpers";
import {
  BallEventInput,
  BallEventRow,
  BatterStats,
  BowlerStats,
  LiveInningsState,
} from "@/modules/cricket/types";
import { mapRowToEvent } from "@/modules/match/rebuild-innings-from-events";
import { getMatchResultSummary } from "@/modules/match/get-match-result-summary";
import { saveLiveEvent } from "@/modules/match/save-live-event";
import { undoLastLiveEvent } from "@/modules/match/undo-last-live-event";
import { startSecondInnings } from "@/modules/match/start-second-innings";
import { addLivePlayer } from "@/modules/match/add-live-player";
import { finishMatch } from "@/modules/match/finish-match";


export type MatchRow = {
  id: string;
  team_a_name: string;
  team_b_name: string;
  current_innings: number;
  status: string;
};

export type InningsRow = {
  id: string;
  inning_number: number;
  batting_team: string;
  bowling_team: string;
};

export type FirstInningsRow = {
  id: string;
  inning_number: number;
  batting_team: string;
  bowling_team: string;
  total_runs: number;
  wickets: number;
  legal_balls: number;
} | null;

export type PlayerRow = {
  id: string;
  team_name: string;
  player_name: string;
};

export type LiveScoreClientProps = {
  match: MatchRow;
  innings: InningsRow;
  firstInnings: FirstInningsRow;
  players: PlayerRow[];
  baseState: LiveInningsState;
  initialState: LiveInningsState;
  initialEventRows: BallEventRow[];
};

type RunType = "DOT" | "RUN_1" | "RUN_2" | "RUN_4" | "RUN_6" | "WIDE" | "NO_BALL";

export type LiveScoringController = {
  liveState: LiveInningsState;
  playersState: PlayerRow[];

  saving: boolean;
  startingSecondInnings: boolean;
  finishingMatch: boolean;
  addingPlayer: boolean;

  pendingWicket: boolean;
  selectedNextBatterId: string | null;
  setSelectedNextBatterId: (id: string | null) => void;
  nextBatterOptions: Array<{ id: string; name: string }>;

  pendingBowlerChange: boolean;
  selectedNextBowlerId: string | null;
  setSelectedNextBowlerId: (id: string | null) => void;
  bowlerOptions: Array<{ id: string; name: string }>;

  showAddPlayer: boolean;
  newPlayerTeam: string;
  setNewPlayerTeam: (v: string) => void;
  newPlayerName: string;
  setNewPlayerName: (v: string) => void;

  isSecondInnings: boolean;
  target: number | null;
  runsNeeded: number | null;
  ballsLeft: number;
  inningsDone: boolean;
  isMatchCompleted: boolean;
  secondInningsResult: string | null;

  striker: BatterStats | null;
  nonStriker: BatterStats | null;
  bowler: BowlerStats | null;

  hasEvents: boolean;

  error: string | null;
  clearError: () => void;

  apply: (type: RunType) => Promise<void>;
  handleWicketClick: () => void;
  confirmWicket: () => Promise<void>;
  cancelWicket: () => void;
  handleUndo: () => Promise<void>;
  confirmBowlerChange: () => void;
  handleStartSecondInnings: () => Promise<void>;
  handleFinishMatch: () => Promise<void>;
  handleAddPlayer: () => Promise<void>;
  toggleAddPlayer: () => void;
};

export function useLiveScoringController({
  match,
  innings,
  firstInnings,
  players,
  initialState,
  initialEventRows,
}: LiveScoreClientProps): LiveScoringController {
  const router = useRouter();

  const [playersState, setPlayersState] = useState<PlayerRow[]>(players);
  const [currentBaseState, setCurrentBaseState] =
    useState<LiveInningsState>(initialState);
  const [events, setEvents] = useState<BallEventInput[]>(
    initialEventRows.map(mapRowToEvent),
  );
  const [liveState, setLiveState] = useState<LiveInningsState>(initialState);

  const [pendingWicket, setPendingWicket] = useState(false);
  const [selectedNextBatterId, setSelectedNextBatterId] = useState<
    string | null
  >(null);

  const [pendingBowlerChange, setPendingBowlerChange] = useState(false);
  const [selectedNextBowlerId, setSelectedNextBowlerId] = useState<
    string | null
  >(null);

  const [saving, setSaving] = useState(false);
  const [startingSecondInnings, setStartingSecondInnings] = useState(false);
  const [finishingMatch, setFinishingMatch] = useState(false);

  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerTeam, setNewPlayerTeam] = useState(liveState.battingTeam);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [addingPlayer, setAddingPlayer] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!error) return;
    const id = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(id);
  }, [error]);

  const isSecondInnings = innings.inning_number === 2;
  const target =
    isSecondInnings && firstInnings ? firstInnings.total_runs + 1 : null;
  const runsNeeded =
    isSecondInnings && target !== null
      ? Math.max(target - liveState.totalRuns, 0)
      : null;
  const totalBalls = liveState.oversLimit * 6;
  const ballsLeft = Math.max(totalBalls - liveState.legalBalls, 0);

  const inningsDone =
    isInningsOver(liveState) ||
    isChaseWon({
      inningsNumber: innings.inning_number,
      target,
      totalRuns: liveState.totalRuns,
    });

  const isMatchReadyToFinish = isSecondInnings && inningsDone;
  const isMatchCompleted = match.status === "COMPLETED";

  const striker = liveState.strikerId
    ? liveState.battingStats[liveState.strikerId] ?? null
    : null;
  const nonStriker = liveState.nonStrikerId
    ? liveState.battingStats[liveState.nonStrikerId] ?? null
    : null;
  const bowler = liveState.currentBowlerId
    ? liveState.bowlingStats[liveState.currentBowlerId] ?? null
    : null;

  const nextBatterOptions = useMemo(
    () =>
      liveState.yetToBat.map((playerId) => ({
        id: playerId,
        name: liveState.battingStats[playerId]?.name ?? "Player",
      })),
    [liveState],
  );

  const bowlerOptions = useMemo(
    () =>
      Object.values(liveState.bowlingStats).map((player) => ({
        id: player.playerId,
        name: player.name,
      })),
    [liveState],
  );

  const secondInningsResult =
    isSecondInnings && inningsDone && target !== null && firstInnings
      ? getMatchResultSummary({
          firstInningsRuns: firstInnings.total_runs,
          firstInningsBattingTeam: firstInnings.batting_team,
          secondInningsRuns: liveState.totalRuns,
          secondInningsWickets: liveState.wickets,
          secondInningsBattingTeam: liveState.battingTeam,
          battingTeamPlayerCount: playersState.filter(
            (p) => p.team_name === liveState.battingTeam,
          ).length,
        }).text
      : null;

  const rebuildFromEvents = (nextEvents: BallEventInput[]) => {
    let state = currentBaseState;
    for (const event of nextEvents) {
      state = applyBallEvent(state, event);
    }
    return state;
  };

  const maybeTriggerBowlerChange = (
    previousBalls: number,
    nextState: LiveInningsState,
  ) => {
    const done =
      isInningsOver(nextState) ||
      isChaseWon({
        inningsNumber: innings.inning_number,
        target,
        totalRuns: nextState.totalRuns,
      });

    if (done) return;

    const overJustCompleted =
      nextState.legalBalls !== previousBalls &&
      isOverComplete(nextState.legalBalls);

    if (overJustCompleted) {
      setPendingBowlerChange(true);
      setSelectedNextBowlerId(
        Object.keys(nextState.bowlingStats).find(
          (id) => id !== nextState.currentBowlerId,
        ) ?? null,
      );
    }
  };

  const persistEvent = async (
    event: BallEventInput,
    nextState: LiveInningsState,
    nextEvents: BallEventInput[],
  ) => {
    try {
      setSaving(true);
      await saveLiveEvent({
        inningsId: nextState.inningsId,
        event,
        stateAfter: nextState,
        sequence: nextEvents.length,
      });
    } catch {
      setError("Couldn't save last ball — tap Undo and try again.");
    } finally {
      setSaving(false);
    }
  };

  const apply = async (type: RunType) => {
    if (
      isMatchCompleted ||
      pendingWicket ||
      pendingBowlerChange ||
      saving ||
      inningsDone ||
      startingSecondInnings ||
      finishingMatch ||
      addingPlayer
    ) {
      return;
    }

    const event: BallEventInput = { type };
    const nextEvents = [...events, event];
    const nextState = rebuildFromEvents(nextEvents);

    setEvents(nextEvents);
    setLiveState(nextState);

    maybeTriggerBowlerChange(liveState.legalBalls, nextState);
    await persistEvent(event, nextState, nextEvents);
  };

  const handleWicketClick = () => {
    if (
      isMatchCompleted ||
      pendingBowlerChange ||
      saving ||
      inningsDone ||
      startingSecondInnings ||
      finishingMatch ||
      addingPlayer
    ) {
      return;
    }
    if (!liveState.strikerId) return;

    if (liveState.yetToBat.length === 0) {
      const event: BallEventInput = {
        type: "WICKET",
        outPlayerId: liveState.strikerId,
        nextBatterId: liveState.strikerId,
      };
      const nextEvents = [...events, event];
      const nextState = rebuildFromEvents(nextEvents);
      setEvents(nextEvents);
      setLiveState(nextState);
      void persistEvent(event, nextState, nextEvents);
      return;
    }

    setPendingWicket(true);
    setSelectedNextBatterId(liveState.yetToBat[0] ?? null);
  };

  const confirmWicket = async () => {
    if (
      isMatchCompleted ||
      !liveState.strikerId ||
      !selectedNextBatterId ||
      saving ||
      inningsDone ||
      finishingMatch
    ) {
      return;
    }

    const event: BallEventInput = {
      type: "WICKET",
      outPlayerId: liveState.strikerId,
      nextBatterId: selectedNextBatterId,
    };
    const nextEvents = [...events, event];
    const nextState = rebuildFromEvents(nextEvents);

    setEvents(nextEvents);
    setLiveState(nextState);
    setPendingWicket(false);
    setSelectedNextBatterId(null);

    maybeTriggerBowlerChange(liveState.legalBalls, nextState);
    await persistEvent(event, nextState, nextEvents);
  };

  const cancelWicket = () => {
    setPendingWicket(false);
    setSelectedNextBatterId(null);
  };

  const handleUndo = async () => {
    if (
      isMatchCompleted ||
      events.length === 0 ||
      saving ||
      startingSecondInnings ||
      finishingMatch ||
      addingPlayer
    ) {
      return;
    }

    try {
      setSaving(true);
      const result = await undoLastLiveEvent({
        inningsId: liveState.inningsId,
        initialState: currentBaseState,
      });
      const rebuiltEvents = result.remainingEvents.map(mapRowToEvent);
      setEvents(rebuiltEvents);
      setLiveState(result.state);
      setPendingWicket(false);
      setSelectedNextBatterId(null);
      setPendingBowlerChange(false);
      setSelectedNextBowlerId(null);
    } catch {
      setError("Couldn't undo — please try again.");
    } finally {
      setSaving(false);
    }
  };

  const confirmBowlerChange = () => {
    if (isMatchCompleted || !selectedNextBowlerId || finishingMatch) return;
    setLiveState((prev) => ({ ...prev, currentBowlerId: selectedNextBowlerId }));
    setPendingBowlerChange(false);
    setSelectedNextBowlerId(null);
  };

  const handleStartSecondInnings = async () => {
    if (
      isMatchCompleted ||
      innings.inning_number !== 1 ||
      !inningsDone ||
      startingSecondInnings ||
      finishingMatch
    ) {
      return;
    }

    try {
      setStartingSecondInnings(true);
      await startSecondInnings({ match, firstInnings: innings, players: playersState });
      router.refresh();
    } catch {
      setError("Couldn't start 2nd innings — please try again.");
      setStartingSecondInnings(false);
    }
  };

  const handleFinishMatch = async () => {
    if (isMatchCompleted || !isMatchReadyToFinish || finishingMatch) return;

    try {
      setFinishingMatch(true);
      await finishMatch({ matchId: match.id });
      router.refresh();
      setFinishingMatch(false);
    } catch {
      setError("Couldn't finish match — please try again.");
      setFinishingMatch(false);
    }
  };

  const handleAddPlayer = async () => {
    const trimmedName = newPlayerName.trim();
    if (isMatchCompleted || !trimmedName || addingPlayer || finishingMatch)
      return;

    try {
      setAddingPlayer(true);

      const createdPlayer = await addLivePlayer({
        matchId: match.id,
        teamName: newPlayerTeam,
        teamKey: newPlayerTeam === match.team_a_name ? "A" : "B",
        playerName: trimmedName,
      });

      setPlayersState((prev) => [
        ...prev,
        {
          id: createdPlayer.id,
          team_name: createdPlayer.team_name,
          player_name: createdPlayer.player_name,
        },
      ]);

      const patchState = (prev: LiveInningsState): LiveInningsState => {
        const next = { ...prev };
        if (createdPlayer.team_name === prev.battingTeam) {
          next.yetToBat = [...prev.yetToBat, createdPlayer.id];
          next.battingStats = {
            ...prev.battingStats,
            [createdPlayer.id]: {
              playerId: createdPlayer.id,
              name: createdPlayer.player_name,
              runs: 0,
              balls: 0,
              fours: 0,
              sixes: 0,
              isOut: false,
            },
          };
        }
        if (createdPlayer.team_name === prev.bowlingTeam) {
          next.bowlingStats = {
            ...prev.bowlingStats,
            [createdPlayer.id]: {
              playerId: createdPlayer.id,
              name: createdPlayer.player_name,
              legalBalls: 0,
              runsConceded: 0,
              wickets: 0,
            },
          };
        }
        return next;
      };

      setLiveState(patchState);
      setCurrentBaseState(patchState);

      setNewPlayerName("");
      setShowAddPlayer(false);
    } catch {
      setError("Couldn't add player — please try again.");
    } finally {
      setAddingPlayer(false);
    }
  };

  const toggleAddPlayer = () => {
    setShowAddPlayer((prev) => !prev);
    setNewPlayerTeam(liveState.battingTeam);
  };

  return {
    liveState,
    playersState,

    saving,
    startingSecondInnings,
    finishingMatch,
    addingPlayer,

    pendingWicket,
    selectedNextBatterId,
    setSelectedNextBatterId,
    nextBatterOptions,

    pendingBowlerChange,
    selectedNextBowlerId,
    setSelectedNextBowlerId,
    bowlerOptions,

    showAddPlayer,
    newPlayerTeam,
    setNewPlayerTeam,
    newPlayerName,
    setNewPlayerName,

    isSecondInnings,
    target,
    runsNeeded,
    ballsLeft,
    inningsDone,
    isMatchCompleted,
    secondInningsResult,

    striker,
    nonStriker,
    bowler,

    hasEvents: events.length > 0,

    error,
    clearError: () => setError(null),

    apply,
    handleWicketClick,
    confirmWicket,
    cancelWicket,
    handleUndo,
    confirmBowlerChange,
    handleStartSecondInnings,
    handleFinishMatch,
    handleAddPlayer,
    toggleAddPlayer,
  };
}
