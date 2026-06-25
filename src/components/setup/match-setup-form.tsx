"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { createMatch } from "@/modules/match/create-match";
import { MatchSetupFormValues } from "@/modules/match/setup-schema";
import {
  getRegisteredPlayers,
  RegisteredPlayer,
} from "@/modules/players/get-registered-players";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ACCENTS = {
  blue: {
    border: "color-mix(in srgb, #60A5FA 28%, var(--border))",
    headerBg: "color-mix(in srgb, #60A5FA 10%, var(--card))",
    headerBorder: "color-mix(in srgb, #60A5FA 22%, var(--border))",
    color: "#60A5FA",
  },
  amber: {
    border: "color-mix(in srgb, #FBBF24 28%, var(--border))",
    headerBg: "color-mix(in srgb, #FBBF24 10%, var(--card))",
    headerBorder: "color-mix(in srgb, #FBBF24 22%, var(--border))",
    color: "#FBBF24",
  },
} as const;

function SectionCard({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent?: keyof typeof ACCENTS;
}) {
  const a = accent ? ACCENTS[accent] : null;
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--card)",
        boxShadow: "var(--shadow-neu-card)",
      }}
    >
      <div
        className="px-4 pt-4 pb-3"
        style={
          a
            ? { background: a.headerBg, borderBottom: `1px solid rgba(0,0,0,0.05)` }
            : { borderBottom: "1px solid rgba(0,0,0,0.05)" }
        }
      >
        <p
          className="text-sm font-extrabold uppercase tracking-widest"
          style={{ color: a ? a.color : "var(--foreground)" }}
        >
          {title}
        </p>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  );
}

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-foreground">{label}</label>
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
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="flex-1 rounded-xl py-2.5 text-sm font-bold transition-all active:scale-95"
            style={
              isActive
                ? {
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                    boxShadow: "var(--shadow-neu-red)",
                  }
                : {
                    background: "var(--background)",
                    color: "var(--muted-foreground)",
                    boxShadow: "var(--shadow-neu-raised-sm)",
                  }
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function PlayerPicker({
  registeredPlayers,
  loading,
  selected,
  takenByOther,
  onChange,
}: {
  registeredPlayers: RegisteredPlayer[];
  loading: boolean;
  selected: string[];
  takenByOther: string[];
  onChange: (names: string[]) => void;
}) {
  const [customInput, setCustomInput] = useState("");
  const [search, setSearch] = useState("");

  const registeredLower = new Set(
    registeredPlayers.map((p) => p.name.toLowerCase())
  );
  const takenLower = new Set(takenByOther.map((n) => n.toLowerCase()));
  const customSelected = selected.filter(
    (n) => !registeredLower.has(n.toLowerCase())
  );
  const filtered =
    search.trim()
      ? registeredPlayers.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      : registeredPlayers;

  const toggle = (name: string) => {
    const lower = name.toLowerCase();
    if (takenLower.has(lower)) return;
    if (selected.some((n) => n.toLowerCase() === lower)) {
      onChange(selected.filter((n) => n.toLowerCase() !== lower));
    } else {
      onChange([...selected, name]);
    }
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (
      trimmed &&
      !selected.some((n) => n.toLowerCase() === trimmed.toLowerCase())
    ) {
      onChange([...selected, trimmed]);
      setCustomInput("");
    }
  };

  return (
    <div className="space-y-3">
      {loading ? (
        <p className="text-xs text-muted-foreground">Loading roster…</p>
      ) : registeredPlayers.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No players in roster.{" "}
          <Link
            href="/players"
            className="text-primary hover:underline underline-offset-2"
          >
            Add players →
          </Link>
        </p>
      ) : (
        <>
          {registeredPlayers.length > 8 ? (
            <Input
              placeholder="Search roster…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm"
            />
          ) : null}
          <div className="flex flex-wrap gap-2">
            {filtered.map((p) => {
              const isSelected = selected.some(
                (n) => n.toLowerCase() === p.name.toLowerCase()
              );
              const isTaken = takenLower.has(p.name.toLowerCase());
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggle(p.name)}
                  disabled={isTaken}
                  title={isTaken ? "Already in the other team" : undefined}
                  className="rounded-full px-3 py-1.5 text-sm font-semibold transition-all active:scale-95"
                  style={
                    isTaken
                      ? { background: "var(--background)", color: "rgba(136,146,164,0.4)", textDecoration: "line-through", cursor: "not-allowed", boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.07), inset -2px -2px 4px var(--neu-highlight-lg)" }
                      : isSelected
                      ? { background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "var(--shadow-neu-red-sm)" }
                      : { background: "var(--background)", color: "var(--foreground)", boxShadow: "var(--shadow-neu-raised-xs)" }
                  }
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Unlisted player input */}
      <div className="flex gap-2">
        <Input
          placeholder="Add unlisted player…"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          className="flex-1 text-sm"
        />
        <Button
          type="button"
          variant="outline"
          className="h-11 px-4 shrink-0"
          onClick={addCustom}
          disabled={!customInput.trim()}
        >
          Add
        </Button>
      </div>

      {/* Custom player chips */}
      {customSelected.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {customSelected.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{
                background: "var(--background)",
                boxShadow: "var(--shadow-neu-raised-xs)",
              }}
            >
              {name}
              <button
                type="button"
                onClick={() => onChange(selected.filter((n) => n !== name))}
                className="text-muted-foreground hover:text-destructive ml-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <p className="text-xs text-muted-foreground">
        {selected.length < 2
          ? `${selected.length}/2 players selected — min. 2 required`
          : `${selected.length} player${selected.length !== 1 ? "s" : ""} selected`}
      </p>
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
  const [teamAPlayers, setTeamAPlayers] = useState<string[]>([]);
  const [teamBPlayers, setTeamBPlayers] = useState<string[]>([]);
  const [tossWinner, setTossWinner] = useState<"teamA" | "teamB">("teamA");
  const [tossDecision, setTossDecision] = useState<"BAT" | "BOWL">("BAT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [registeredPlayers, setRegisteredPlayers] = useState<
    RegisteredPlayer[]
  >([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  useEffect(() => {
    getRegisteredPlayers()
      .then(setRegisteredPlayers)
      .catch(() => {})
      .finally(() => setLoadingPlayers(false));
  }, []);

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
        teamAPlayers: teamAPlayers.filter(Boolean),
        teamBPlayers: teamBPlayers.filter(Boolean),
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
          <div
            className="w-full rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground pointer-events-none select-none"
            style={{
              background: "var(--background)",
              boxShadow: "var(--shadow-neu-inset)",
            }}
          >
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
      <SectionCard title="Team A" accent="blue">
        <Input
          placeholder="Team A Name"
          value={teamAName}
          onChange={(e) => setTeamAName(e.target.value)}
        />
        <FieldRow label="Players">
          <PlayerPicker
            registeredPlayers={registeredPlayers}
            loading={loadingPlayers}
            selected={teamAPlayers}
            takenByOther={teamBPlayers}
            onChange={setTeamAPlayers}
          />
        </FieldRow>
      </SectionCard>

      {/* Team B */}
      <SectionCard title="Team B" accent="amber">
        <Input
          placeholder="Team B Name"
          value={teamBName}
          onChange={(e) => setTeamBName(e.target.value)}
        />
        <FieldRow label="Players">
          <PlayerPicker
            registeredPlayers={registeredPlayers}
            loading={loadingPlayers}
            selected={teamBPlayers}
            takenByOther={teamAPlayers}
            onChange={setTeamBPlayers}
          />
        </FieldRow>
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

      <button
        type="submit"
        disabled={loading}
        className="w-full h-14 rounded-2xl text-base font-bold uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50"
        style={{
          background: "var(--primary)",
          color: "var(--primary-foreground)",
          boxShadow: "var(--shadow-neu-red-lg)",
        }}
      >
        {loading ? "Creating match…" : "Start Match"}
      </button>
    </form>
  );
}
