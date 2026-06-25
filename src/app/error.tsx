"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-md flex-col items-center justify-center gap-4 p-4 text-center">
      <div className="space-y-1">
        <h1 className="text-xl font-bold">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred.
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          ← Home
        </Link>
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black transition-colors"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
