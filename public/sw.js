const CACHE = "turf-score-v1";
const PRECACHE = ["/", "/offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // Only handle same-origin GET requests; skip API / Supabase calls
  if (
    request.method !== "GET" ||
    !request.url.startsWith(self.location.origin)
  )
    return;

  // API routes — network only
  if (request.url.includes("/api/") || request.url.includes("supabase.co"))
    return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached ?? caches.match("/offline.html"));

      // Stale-while-revalidate: return cache immediately, update in background
      return cached ?? networkFetch;
    })
  );
});
