export default function Loading() {
  return (
    <main className="min-h-[calc(100dvh-3.5rem)] px-3 pb-10 pt-4 space-y-3">
      <div className="h-10 rounded-2xl animate-pulse" style={{ background: "rgba(0,0,0,0.07)" }} />
      <div className="h-24 rounded-2xl animate-pulse" style={{ background: "rgba(0,0,0,0.07)" }} />
      <div className="h-64 rounded-2xl animate-pulse" style={{ background: "rgba(0,0,0,0.07)" }} />
    </main>
  );
}
