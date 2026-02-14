const CACHE = "noor-cache-v2";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./css/style.css",
        "./css/ramadan.css",
        "./js/script.js",
        "./js/wird.js",
        "./js/azkar.js",
        "./js/challenges.js",
        "./js/profile.js",
        "./js/ramadan.js",

        "./js/adhan.mp3"
      ])
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
