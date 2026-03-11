const cacheName = "pos-cache-v1";

// Fichiers à mettre en cache pour que l'app fonctionne offline
const filesToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(filesToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
