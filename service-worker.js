const CACHE_NAME = "tallerpro-cache-v1";
const OFFLINE_URLS = [
  "/",
  "/index.html",
  "/manifest.json"
  // Agrega aquí CSS/JS/íconos cuando los separes
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Solo GET
  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(request).catch(() => {
        // Fallback básico: si falla, intenta devolver index.html
        if (request.mode === "navigate") {
          return caches.match("/index.html");
        }
      });
    })
  );
});
