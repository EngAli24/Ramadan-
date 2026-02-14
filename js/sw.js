const CACHE_NAME = "noor-app-v1";

const FILES = [
 "/Ramadan_/",
 "/Ramadan_/index.html",

 "/Ramadan_/css/style.css",

 "/Ramadan-/js/script.js",
 "/Ramadan-/js/wird.js",
 "/Ramadan-/js/azkar.js",
 "/Ramadan-/js/challenges.js",
 "/Ramadan-/js/profile.js",
 "/Ramadan-/js/ramadan.js",

 "/Ramadan-/js/adhan.mp3"
];

self.addEventListener("install", e => {
 e.waitUntil(
  caches.open(CACHE_NAME).then(c => c.addAll(FILES))
 );
});

self.addEventListener("fetch", e => {
 e.respondWith(
  caches.match(e.request).then(r => r || fetch(e.request))
 );
});
