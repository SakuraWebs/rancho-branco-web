// Service Worker for Rancho Branco PWA Support
const CACHE_NAME = 'rancho-branco-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Bypass non-GET requests or Firebase API requests (googleapis.com)
  if (event.request.method !== 'GET' || event.request.url.includes('googleapis.com')) {
    return;
  }

  // Pass-through fetch for regular online execution while keeping the PWA installable
  // We force cache-busting to ensure updates propagate immediately.
  event.respondWith(
    fetch(event.request, { cache: 'no-store' }).catch(() => {
      // In case of offline, fallback to normal fetch (which will likely fail if no cache)
      return fetch(event.request);
    })
  );
});
