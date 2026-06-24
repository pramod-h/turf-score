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
  return (
    <section
      className="rounded-2xl p-3 space-y-2"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
      }}
    >
      {/* Row 1: 0, 1, 2, 4 */}
      <div className="grid grid-cols-4 gap-2">
        <button type="button" onClick={onDot}
          className="flex h-16 w-full items-center justify-center rounded-xl font-scoreboard text-2xl font-bold text-muted-foreground transition-all active:scale-95"
          style={{ background: "var(--secondary)" }}>0</button>
        <button type="button" onClick={onRun1}
          className="flex h-16 w-full items-center justify-center rounded-xl font-scoreboard text-2xl font-bold text-foreground transition-all active:scale-95"
          style={{ background: "var(--secondary)" }}>1</button>
        <button type="button" onClick={onRun2}
          className="flex h-16 w-full items-center justify-center rounded-xl font-scoreboard text-2xl font-bold text-foreground transition-all active:scale-95"
          style={{ background: "var(--secondary)" }}>2</button>
        {/* 4 — boundary */}
        <button
          type="button"
          onClick={onRun4}
          className="flex h-16 w-full items-center justify-center rounded-xl font-scoreboard text-2xl font-bold text-white transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #ffd166 0%, #f4b942 100%)",
            boxShadow: "0 4px 14px rgba(255,209,102,0.25)",
            color: "var(--accent-foreground)",
          }}
        >
          4
        </button>
      </div>

      {/* Row 2: 6, WD, NB, Undo */}
      <div className="grid grid-cols-4 gap-2">
        {/* 6 — aerial boundary */}
        <button
          type="button"
          onClick={onRun6}
          className="flex h-16 w-full items-center justify-center rounded-xl font-scoreboard text-2xl font-bold text-white transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #2c5d75 0%, #8ec5ff 100%)",
            boxShadow: "0 4px 14px rgba(142,197,255,0.25)",
            color: "#061923",
          }}
        >
          6
        </button>
        {/* WD — neutral */}
        <button
          type="button"
          onClick={onWide}
          className="flex h-16 w-full items-center justify-center rounded-xl font-sans text-sm font-bold text-muted-foreground transition-all active:scale-95"
          style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
        >
          WD
        </button>
        {/* NB — neutral */}
        <button
          type="button"
          onClick={onNoBall}
          className="flex h-16 w-full items-center justify-center rounded-xl font-sans text-sm font-bold text-muted-foreground transition-all active:scale-95"
          style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
        >
          NB
        </button>
        {/* Undo */}
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="flex h-16 w-full flex-col items-center justify-center gap-1 rounded-xl text-muted-foreground transition-all active:scale-95 disabled:opacity-25 hover:text-foreground"
          style={{ background: "var(--secondary)" }}
        >
          <Undo2 className="h-5 w-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider">Undo</span>
        </button>
      </div>

      {/* Row 3: WICKET */}
      <button
        type="button"
        onClick={onWicket}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-xl font-sans text-base font-bold uppercase tracking-widest text-white transition-all active:scale-95"
        style={{
          background: "linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)",
          boxShadow: "0 4px 16px rgba(255,180,171,0.22)",
          color: "#2d0604",
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
