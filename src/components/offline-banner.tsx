"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    // Sync with actual network state on mount
    setOffline(!navigator.onLine);

    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-center gap-2 px-4 py-3"
      style={{
        background: "rgba(239,68,68,0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <WifiOff className="h-4 w-4 text-white shrink-0" />
      <p className="text-sm font-semibold text-white">
        You're offline — scores won't update until you reconnect
      </p>
    </div>
  );
}
