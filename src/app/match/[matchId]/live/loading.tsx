export default function Loading() {
  return (
    <div className="flex flex-col h-[calc(100dvh-3.5rem)]">
      <div className="flex-1 px-3 pt-4 space-y-3">
        <div className="h-10 rounded-2xl animate-pulse" style={{ background: "rgba(0,0,0,0.07)" }} />
        <div className="h-40 rounded-2xl animate-pulse" style={{ background: "rgba(0,0,0,0.07)" }} />
        <div className="h-32 rounded-2xl animate-pulse" style={{ background: "rgba(0,0,0,0.07)" }} />
        <div className="h-28 rounded-2xl animate-pulse" style={{ background: "rgba(0,0,0,0.07)" }} />
      </div>
      <div
        className="shrink-0 h-48 animate-pulse"
        style={{ borderTop: "1px solid rgba(0,0,0,0.06)", background: "rgba(0,0,0,0.04)" }}
      />
    </div>
  );
}
