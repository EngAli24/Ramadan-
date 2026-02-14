const CACHE = "noor-cache-v3";

self.addEventListener("install", event => {
  event.waitUntil(
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

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});

