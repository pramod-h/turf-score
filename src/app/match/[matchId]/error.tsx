"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function MatchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isNotFound =
    error.message?.toLowerCase().includes("not found") ||
    error.message?.toLowerCase().includes("no rows");

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-md flex-col items-center justify-center gap-4 p-4 text-center">
      <div className="space-y-1">
        <h1 className="text-xl font-bold">
          {isNotFound ? "Match not found" : "Something went wrong"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isNotFound
            ? "This match doesn't exist or has been removed."
            : "An error occurred loading this match."}
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          ← All matches
        </Link>

        {!isNotFound ? (
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black transition-colors"
          >
            Try again
          </button>
        ) : null}
      </div>
    </main>
  );
}
