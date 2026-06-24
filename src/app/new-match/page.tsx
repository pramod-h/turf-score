import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MatchSetupForm } from "@/components/setup/match-setup-form";

export default function NewMatchPage() {
  return (
    <main className="min-h-screen px-3 pb-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 pt-6 pb-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Matches
      </Link>

      <div className="pt-2 pb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Turf Score
        </p>
        <h1 className="mt-1 font-scoreboard text-4xl font-bold leading-none text-foreground">
          New Match
        </h1>
      </div>

      <MatchSetupForm />
    </main>
  );
}
