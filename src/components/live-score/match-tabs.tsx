import Link from "next/link";

type MatchTabsProps = {
  matchId: string;
  active: "live" | "scorecard";
};

export function MatchTabs({ matchId, active }: MatchTabsProps) {
  const tabs = [
    { key: "live", label: "Live", href: `/match/${matchId}/live` },
    { key: "scorecard", label: "Scorecard", href: `/match/${matchId}` },
  ] as const;

  return (
    <nav
      aria-label="Match views"
      className="flex gap-2"
    >
      {tabs.map((tab) => {
        const isActive = tab.key === active;

        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95"
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
            {tab.key === "live" ? (
              <span
                className="h-1.5 w-1.5 rounded-full shrink-0"
                style={{
                  background: isActive ? "var(--neu-highlight-lg)" : "var(--muted-foreground)",
                  boxShadow: isActive ? `0 0 5px var(--neu-highlight-lg)` : "none",
                }}
              />
            ) : null}
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
