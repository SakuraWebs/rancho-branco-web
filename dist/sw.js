self.addEventListener('fetch', (event) => {
  // Bypass para requisições do Firebase (POST e APIs do Google)
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