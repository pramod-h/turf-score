"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { createMatch } from "@/modules/match/create-match";
import { MatchSetupFormValues } from "@/modules/match/setup-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-border">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {title}
        </p>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

function PillToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
            value === opt.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "border border-border bg-transparent text-foreground hover:bg-muted"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function PlayerList({
  players,
  onUpdate,
  onAdd,
  onRemove,
}: {
  players: string[];
  onUpdate: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-2">
      {players.map((player, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span className="w-5 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
            {idx + 1}
          </span>
          <Input
            className="flex-1"
            placeholder={`Player ${idx + 1}`}
            value={player}
            onChange={(e) => onUpdate(idx, e.target.value)}
          />
          {players.length > 2 ? (
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="shrink-0 text-muted-foreground/60 hover:text-destructive transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : (
            <span className="w-4 shrink-0" />
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-1.5 pt-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Player
      </button>
    </div>
  );
}

export function MatchSetupForm() {
  const router = useRouter();

  const [name] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  });
  const [oversPerInnings, setOversPerInnings] = useState("5");
  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");
  const [teamAPlayers, setTeamAPlayers] = useState(["", ""]);
  const [teamBPlayers, setTeamBPlayers] = useState(["", ""]);
  const [tossWinner, setTossWinner] = useState<"teamA" | "teamB">("teamA");
  const [tossDecision, setTossDecision] = useState<"BAT" | "BOWL">("BAT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updatePlayer = (team: "A" | "B", index: number, value: string) => {
    if (team === "A") {
      setTeamAPlayers((prev) => { const n = [...prev]; n[index] = value; return n; });
    } else {
      setTeamBPlayers((prev) => { const n = [...prev]; n[index] = value; return n; });
    }
  };

  const addPlayer = (team: "A" | "B") => {
    if (team === "A") setTeamAPlayers((prev) => [...prev, ""]);
    else setTeamBPlayers((prev) => [...prev, ""]);
  };

  const removePlayer = (team: "A" | "B", index: number) => {
    if (team === "A") setTeamAPlayers((prev) => prev.filter((_, i) => i !== index));
    else setTeamBPlayers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload: MatchSetupFormValues = {
        name,
        oversPerInnings: Number(oversPerInnings),
        wicketsPerInnings: 10,
        teamAName,
        teamBName,
        teamAPlayers: teamAPlayers.map((p) => p.trim()).filter(Boolean),
        teamBPlayers: teamBPlayers.map((p) => p.trim()).filter(Boolean),
        tossWinner,
        tossDecision,
      };
      const result = await createMatch(payload);
      router.push(`/match/${result.match.id}/live`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create match");
    } finally {
      setLoading(false);
    }
  };

  const teamALabel = teamAName.trim() || "Team A";
  const teamBLabel = teamBName.trim() || "Team B";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Match details */}
      <SectionCard title="Match Details">
        <FieldRow label="Match Name">
          <div className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground pointer-events-none select-none tabular-nums">
            {name}
          </div>
        </FieldRow>
        <FieldRow label="Overs per Innings">
          <Input
            type="number"
            min="1"
            value={oversPerInnings}
            onChange={(e) => setOversPerInnings(e.target.value)}
          />
        </FieldRow>
      </SectionCard>

      {/* Team A */}
      <SectionCard title="Team A">
        <Input
          placeholder="Team A Name"
          value={teamAName}
          onChange={(e) => setTeamAName(e.target.value)}
        />
        <PlayerList
          players={teamAPlayers}
          onUpdate={(i, v) => updatePlayer("A", i, v)}
          onAdd={() => addPlayer("A")}
          onRemove={(i) => removePlayer("A", i)}
        />
      </SectionCard>

      {/* Team B */}
      <SectionCard title="Team B">
        <Input
          placeholder="Team B Name"
          value={teamBName}
          onChange={(e) => setTeamBName(e.target.value)}
        />
        <PlayerList
          players={teamBPlayers}
          onUpdate={(i, v) => updatePlayer("B", i, v)}
          onAdd={() => addPlayer("B")}
          onRemove={(i) => removePlayer("B", i)}
        />
      </SectionCard>

      {/* Toss */}
      <SectionCard title="Toss">
        <FieldRow label="Toss Winner">
          <PillToggle
            options={[
              { label: teamALabel, value: "teamA" },
              { label: teamBLabel, value: "teamB" },
            ]}
            value={tossWinner}
            onChange={setTossWinner}
          />
        </FieldRow>
        <FieldRow label="Decision">
          <PillToggle
            options={[
              { label: "Bat", value: "BAT" },
              { label: "Bowl", value: "BOWL" },
            ]}
            value={tossDecision}
            onChange={setTossDecision}
          />
        </FieldRow>
      </SectionCard>

      {error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Button
        className="w-full h-12 text-base font-semibold"
        type="submit"
        disabled={loading}
      >
        {loading ? "Creating match…" : "Start Match"}
      </Button>
    </form>
  );
}
