// This file lets the app open even with no internet connection,
// by saving a copy of itself on the phone the first time it's opened.

const CACHE_NAME = 'gerald-tools-v1';
const FILES_TO_CACHE = [
  '/gerald-business-tools/receipt_generator.html',
  '/gerald-business-tools/inventory_tracker.html',
  '/gerald-business-tools/receipt-manifest.json',
  '/gerald-business-tools/inventory-manifest.json'
];

// When the app is first installed, save copies of these files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Remove old saved copies when a new version is installed
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// When the app requests a file, serve the saved copy if there's no internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
