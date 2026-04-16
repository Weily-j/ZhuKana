const CACHE_NAME = "zhuyin-jp-keyboard-pwa-v5";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./lib/core.js",
  "./manifest.json",
  "./data/phonetic-map.json",
  "./data/candidates.json",
  "./icons/app-icon-192.png",
  "./icons/app-icon-512.png",
  "./icons/app-icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse.status !== 200) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache)).catch(() => {}),
        );
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        if (event.request.mode === "navigate") {
          const fallback = await caches.match("./index.html");
          if (fallback) return fallback;
        }

        throw new Error(`Offline and no cache entry for ${event.request.url}`);
      }),
  );
});
