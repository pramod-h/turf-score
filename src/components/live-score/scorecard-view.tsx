"use client";

import { useState } from "react";
import { getOversDisplay } from "@/modules/cricket/engine/helpers";
import { LiveInningsState } from "@/modules/cricket/types";
import { LiveBattingTable } from "@/components/live-score/live-batting-table";
import { LiveBowlingTable } from "@/components/live-score/live-bowling-table";
import { NeuCard } from "@/components/ui/neu-card";
import { ConfettiBanner } from "@/components/ui/confetti-banner";
import { NEU_INSET_SM } from "@/lib/neu-styles";

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
      <NeuCard className="p-4">
        <p className="text-sm text-muted-foreground">No innings yet.</p>
      </NeuCard>
    );
  }

  const active = inningsCards[activeTab] ?? inningsCards[0];

  return (
    <div className="space-y-3">
      {resultText ? (
        <ConfettiBanner title={resultText} subtitle="🏆 Match complete" />
      ) : null}

      <NeuCard>
        {/* Tabs — segmented control */}
        <div
          className="flex gap-1.5 mx-3 mt-3 mb-1 p-1.5 rounded-xl"
          style={NEU_INSET_SM}
        >
          {inningsCards.map((card, idx) => {
            const isActive = idx === activeTab;
            return (
              <button
                key={card.inning.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className="flex-1 py-2 px-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all active:scale-95"
                style={
                  isActive
                    ? {
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                        boxShadow: "var(--shadow-neu-red-sm)",
                      }
                    : {
                        background: "transparent",
                        color: "var(--muted-foreground)",
                      }
                }
              >
                {card.inning.batting_team}
                <span
                  className="ml-1 font-scoreboard text-sm font-bold tabular-nums"
                  style={{ color: isActive ? "rgba(255,255,255,0.82)" : "var(--muted-foreground)" }}
                >
                  {card.inning.total_runs}/{card.inning.wickets}
                </span>
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
      </NeuCard>

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
