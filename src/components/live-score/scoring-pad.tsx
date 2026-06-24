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

function PadButton({
  label,
  onClick,
  className = "",
  disabled = false,
}: {
  label: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-16 w-full items-center justify-center rounded-xl font-scoreboard text-2xl font-bold transition-all active:scale-95 disabled:opacity-30 ${className}`}
    >
      {label}
    </button>
  );
}

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
    <section className="rounded-2xl bg-card border border-border p-3 space-y-2">
      {/* Row 1: 0, 1, 2, 4 */}
      <div className="grid grid-cols-4 gap-2">
        <PadButton
          label="0"
          onClick={onDot}
          className="bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
        />
        <PadButton
          label="1"
          onClick={onRun1}
          className="bg-secondary text-foreground hover:bg-secondary/80"
        />
        <PadButton
          label="2"
          onClick={onRun2}
          className="bg-secondary text-foreground hover:bg-secondary/80"
        />
        {/* 4 — blue boundary */}
        <button
          type="button"
          onClick={onRun4}
          className="flex h-16 w-full items-center justify-center rounded-xl bg-[#1E3A5F] font-scoreboard text-2xl font-bold text-[#60A5FA] transition-all active:scale-95 hover:bg-[#1E4070]"
        >
          4
        </button>
      </div>

      {/* Row 2: 6, WD, NB, UNDO */}
      <div className="grid grid-cols-4 gap-2">
        {/* 6 — green primary */}
        <button
          type="button"
          onClick={onRun6}
          className="flex h-16 w-full items-center justify-center rounded-xl bg-primary font-scoreboard text-2xl font-bold text-primary-foreground transition-all active:scale-95 hover:bg-primary/90"
        >
          6
        </button>
        <PadButton
          label={<span className="font-sans text-sm font-semibold">WD</span>}
          onClick={onWide}
          className="bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
        />
        <PadButton
          label={<span className="font-sans text-sm font-semibold">NB</span>}
          onClick={onNoBall}
          className="bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
        />
        {/* Undo */}
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="flex h-16 w-full flex-col items-center justify-center gap-1 rounded-xl bg-secondary text-muted-foreground transition-all active:scale-95 disabled:opacity-25 hover:text-foreground hover:bg-secondary/80"
        >
          <Undo2 className="h-5 w-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider">Undo</span>
        </button>
      </div>

      {/* Row 3: WICKET — full width red */}
      <button
        type="button"
        onClick={onWicket}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-destructive font-sans text-base font-bold uppercase tracking-widest text-destructive-foreground transition-all active:scale-95 hover:bg-destructive/90"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
          {/* Cricket stumps icon */}
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
