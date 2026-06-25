const PIECES = [
  { top: "10%", right: "7%",  w: 8,  h: 8,  color: "#EF4444", delay: "0s",    dur: "2.8s" },
  { top: "30%", right: "18%", w: 6,  h: 6,  color: "#F59E0B", delay: "0.3s",  dur: "3.1s" },
  { top: "55%", right: "5%",  w: 10, h: 10, color: "#22C55E", delay: "0.6s",  dur: "2.5s" },
  { top: "18%", right: "34%", w: 7,  h: 7,  color: "#EF4444", delay: "0.15s", dur: "2.9s" },
  { top: "42%", right: "13%", w: 9,  h: 4,  color: "#F59E0B", delay: "0.5s",  dur: "3.2s" },
  { top: "8%",  right: "44%", w: 5,  h: 9,  color: "#3B82F6", delay: "1.1s",  dur: "3.0s" },
  { top: "70%", right: "22%", w: 5,  h: 5,  color: "#EC4899", delay: "0.9s",  dur: "3.4s" },
  { top: "72%", right: "28%", w: 6,  h: 6,  color: "#22C55E", delay: "0.75s", dur: "2.6s" },
] as const;

export function ConfettiOverlay() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {PIECES.map((c, i) => (
        <span
          key={i}
          className="absolute rounded-sm"
          style={{
            top: c.top, right: c.right,
            width: c.w, height: c.h,
            background: c.color,
            opacity: 0.70,
            animation: `confetti-float ${c.dur} ${c.delay} ease-in-out infinite`,
            transform: `rotate(${i * 37}deg)`,
          }}
        />
      ))}
    </span>
  );
}

export function ConfettiBanner({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div
      className="rounded-2xl px-4 py-3 relative overflow-hidden"
      style={{
        background: "rgba(239,68,68,0.08)",
        boxShadow: "var(--shadow-neu-card)",
      }}
    >
      <ConfettiOverlay />
      <p className="text-sm font-bold text-primary relative">{title}</p>
      {subtitle ? (
        <p className="text-xs text-muted-foreground mt-0.5 relative">{subtitle}</p>
      ) : null}
    </div>
  );
}
