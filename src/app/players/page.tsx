"use client";

import { useState, useEffect } from "react";
import { Trash2, UserPlus } from "lucide-react";
import {
  getRegisteredPlayers,
  RegisteredPlayer,
} from "@/modules/players/get-registered-players";
import { addRegisteredPlayer } from "@/modules/players/add-registered-player";
import { deleteRegisteredPlayer } from "@/modules/players/delete-registered-player";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PlayersPage() {
  const [players, setPlayers] = useState<RegisteredPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getRegisteredPlayers()
      .then(setPlayers)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load players")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setAdding(true);
    setError("");
    try {
      const player = await addRegisteredPlayer(trimmed);
      setPlayers((prev) =>
        [...prev, player].sort((a, b) => a.name.localeCompare(b.name))
      );
      setNewName("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to add player");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRegisteredPlayer(id);
      setPlayers((prev) => prev.filter((p) => p.id !== id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete player");
    }
  };

  return (
    <main className="min-h-[calc(100dvh-3.5rem)] px-3 pb-10 pt-4">

      {/* Add player */}
      <div
        className="rounded-2xl overflow-hidden mb-4"
        style={{
          background: "var(--card)",
          boxShadow: "var(--shadow-neu-card)",
        }}
      >
        <div className="px-4 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          <p className="text-sm font-bold uppercase tracking-widest text-foreground">
            Add to Roster
          </p>
        </div>
        <div className="p-4 flex gap-2">
          <Input
            placeholder="Player name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            className="flex-1"
          />
          <Button
            onClick={handleAdd}
            disabled={adding || !newName.trim()}
            className="h-11 px-5 shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-4">
          {error}
        </div>
      ) : null}

      {/* Roster list */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--card)",
          boxShadow: "var(--shadow-neu-card)",
        }}
      >
        <div className="px-4 pt-4 pb-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          <p className="text-sm font-bold uppercase tracking-widest text-foreground">
            Roster
          </p>
          {players.length > 0 ? (
            <span className="text-xs text-muted-foreground">
              {players.length} player{players.length !== 1 ? "s" : ""}
            </span>
          ) : null}
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Loading…
            </div>
          ) : players.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-2xl mb-2">👤</p>
              <p className="text-sm text-muted-foreground">No players yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add players above to build your roster
              </p>
            </div>
          ) : (
            players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="text-sm font-bold text-foreground">{player.name}</span>
                <button
                  type="button"
                  onClick={() => handleDelete(player.id)}
                  className="text-muted-foreground/60 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
