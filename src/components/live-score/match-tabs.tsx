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
      className="grid grid-cols-2 overflow-hidden rounded-2xl"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === active;

        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className="relative flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors"
            style={{
              color: isActive ? "var(--foreground)" : "var(--muted-foreground)",
              background: isActive
                ? "color-mix(in srgb, var(--primary) 12%, transparent)"
                : "transparent",
            }}
          >
            {tab.key === "live" ? (
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: isActive
                    ? "var(--primary)"
                    : "var(--muted-foreground)",
                }}
              />
            ) : null}
            {tab.label}
            {isActive ? (
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: "var(--primary)" }}
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
