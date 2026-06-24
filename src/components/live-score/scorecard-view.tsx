"use client";

import { useState } from "react";
import { getOversDisplay } from "@/modules/cricket/engine/helpers";
import { LiveInningsState } from "@/modules/cricket/types";
import { LiveBattingTable } from "@/components/live-score/live-batting-table";
import { LiveBowlingTable } from "@/components/live-score/live-bowling-table";

type InningsCard = {
  inning: {
    id: string;
    inning_number: number;
    batting_team: string;
    bowling_team: string;
    total_runs: number;
    wickets: number;
    legal_balls: number;
  };
  state: LiveInningsState;
};

type ScorecardViewProps = {
  inningsCards: InningsCard[];
  resultText: string | null;
};

export function ScorecardView({ inningsCards, resultText }: ScorecardViewProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (inningsCards.length === 0) {
    return (
      <section
        className="rounded-2xl p-4"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm text-muted-foreground">No innings yet.</p>
      </section>
    );
  }

  const active = inningsCards[activeTab] ?? inningsCards[0];

  return (
    <div className="space-y-3">
      {/* Result banner */}
      {resultText ? (
        <div
          className="rounded-2xl px-4 py-3"
          style={{
            background: "color-mix(in srgb, var(--primary) 10%, var(--card))",
            border: "1px solid color-mix(in srgb, var(--primary) 30%, transparent)",
          }}
        >
          <p className="text-sm font-bold text-primary">{resultText}</p>
        </div>
      ) : null}

      {/* Cricbuzz-style innings tab bar */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        {/* Tabs */}
        <div className="flex" style={{ borderBottom: "1px solid var(--border)" }}>
          {inningsCards.map((card, idx) => {
            const isActive = idx === activeTab;
            return (
              <button
                key={card.inning.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className="flex-1 py-3 px-4 text-xs font-bold uppercase tracking-widest transition-colors relative"
                style={{
                  color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
                  background: isActive
                    ? "color-mix(in srgb, var(--primary) 10%, transparent)"
                    : "transparent",
                }}
              >
                {card.inning.batting_team}
                <span className="ml-1.5 font-scoreboard text-base font-bold tabular-nums" style={{ color: isActive ? "var(--primary)" : "var(--muted-foreground)" }}>
                  {card.inning.total_runs}/{card.inning.wickets}
                </span>
                {isActive ? (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                    style={{ background: "var(--primary)" }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Innings summary row */}
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Innings {active.inning.inning_number}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {active.inning.bowling_team} bowling
            </p>
          </div>
          <div className="text-right">
            <p className="font-scoreboard text-3xl font-bold leading-none text-foreground tabular-nums">
              {active.state.totalRuns}/{active.state.wickets}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {getOversDisplay(active.state.legalBalls)} ov
            </p>
          </div>
        </div>
      </div>

      <LiveBattingTable
        battingStats={active.state.battingStats}
        strikerId={active.state.strikerId}
        nonStrikerId={active.state.nonStrikerId}
      />

      <LiveBowlingTable
        bowlingStats={active.state.bowlingStats}
        currentBowlerId={active.state.currentBowlerId}
      />
    </div>
  );
}
