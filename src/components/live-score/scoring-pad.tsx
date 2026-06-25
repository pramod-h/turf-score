import { Undo2 } from "lucide-react";

type ScoringPadProps = {
  onDot?: () => void;
  onRun1?: () => void;
  onRun2?: () => void;
  onRun4?: () => void;
  onRun6?: () => void;
  onWide?: () => void;
  onNoBall?: () => void;
  onWicket?: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
};

export function ScoringPad({
  onDot,
  onRun1,
  onRun2,
  onRun4,
  onRun6,
  onWide,
  onNoBall,
  onWicket,
  onUndo,
  canUndo = false,
}: ScoringPadProps) {
  const neuButton = {
    background: "var(--background)",
    boxShadow: "var(--shadow-neu-raised)",
  };

  return (
    <section
      className="rounded-2xl p-3 space-y-2"
      style={{
        background: "var(--background)",
        boxShadow: "var(--shadow-neu-pad)",
      }}
    >
      {/* Row 1: 0, 1, 2, 4 */}
      <div className="grid grid-cols-4 gap-2">
        <button type="button" onClick={onDot}
          className="flex h-16 w-full items-center justify-center rounded-xl font-scoreboard text-2xl font-bold text-muted-foreground transition-all active:scale-95"
          style={neuButton}>0</button>
        <button type="button" onClick={onRun1}
          className="flex h-16 w-full items-center justify-center rounded-xl font-scoreboard text-2xl font-bold text-foreground transition-all active:scale-95"
          style={neuButton}>1</button>
        <button type="button" onClick={onRun2}
          className="flex h-16 w-full items-center justify-center rounded-xl font-scoreboard text-2xl font-bold text-foreground transition-all active:scale-95"
          style={neuButton}>2</button>
        {/* 4 — boundary (blue) */}
        <button
          type="button"
          onClick={onRun4}
          className="flex h-16 w-full items-center justify-center rounded-xl font-scoreboard text-2xl font-bold transition-all active:scale-95"
          style={{
            background: "linear-gradient(145deg, #2979FF, #1565C0)",
            boxShadow: "5px 5px 12px rgba(21,101,192,0.38), -3px -3px 8px var(--neu-highlight)",
            color: "#E3F2FD",
          }}
        >
          4
        </button>
      </div>

      {/* Row 2: 6, WD, NB, Undo */}
      <div className="grid grid-cols-4 gap-2">
        {/* 6 — aerial boundary (green) */}
        <button
          type="button"
          onClick={onRun6}
          className="flex h-16 w-full items-center justify-center rounded-xl font-scoreboard text-2xl font-bold transition-all active:scale-95"
          style={{
            background: "linear-gradient(145deg, #43A047, #1B5E20)",
            boxShadow: "5px 5px 12px rgba(27,94,32,0.38), -3px -3px 8px var(--neu-highlight)",
            color: "#E8F5E9",
          }}
        >
          6
        </button>
        {/* WD */}
        <button
          type="button"
          onClick={onWide}
          className="flex h-16 w-full items-center justify-center rounded-xl font-sans text-sm font-bold text-muted-foreground transition-all active:scale-95"
          style={neuButton}
        >
          WD
        </button>
        {/* NB */}
        <button
          type="button"
          onClick={onNoBall}
          className="flex h-16 w-full items-center justify-center rounded-xl font-sans text-sm font-bold text-muted-foreground transition-all active:scale-95"
          style={neuButton}
        >
          NB
        </button>
        {/* Undo */}
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="flex h-16 w-full flex-col items-center justify-center gap-1 rounded-xl text-muted-foreground transition-all active:scale-95 disabled:opacity-30 hover:text-foreground"
          style={neuButton}
        >
          <Undo2 className="h-5 w-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider">Undo</span>
        </button>
      </div>

      {/* Row 3: WICKET */}
      <button
        type="button"
        onClick={onWicket}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-xl font-sans text-base font-bold uppercase tracking-widest transition-all active:scale-95"
        style={{
          background: "linear-gradient(145deg, #EF4444, #B91C1C)",
          boxShadow: "var(--shadow-neu-red-lg)",
          color: "#FFFFFF",
        }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
          <rect x="5" y="3" width="2" height="16" rx="1" />
          <rect x="11" y="3" width="2" height="16" rx="1" />
          <rect x="17" y="3" width="2" height="16" rx="1" />
          <rect x="4" y="2" width="5" height="1.5" rx="0.75" />
          <rect x="10" y="2" width="5" height="1.5" rx="0.75" />
          <rect x="16" y="2" width="5" height="1.5" rx="0.75" />
          <rect x="3" y="19" width="18" height="2" rx="1" />
        </svg>
        Wicket
      </button>
    </section>
  );
}
