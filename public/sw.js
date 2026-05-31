// Service Worker for Rancho Branco PWA Support
const CACHE_NAME = 'rancho-branco-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through fetch for regular online execution while keeping the PWA installable
});
