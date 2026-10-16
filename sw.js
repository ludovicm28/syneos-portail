const CACHE = 'syneos-portal-v5';
const SHELL = ['/', '/index.html', '/mobile.css', '/launch.js', '/install.js', '/favicon.svg', '/syneos-touch-20261014.png', '/syneos-icon-192-20261014.png', '/syneos-icon-512-20261014.png', '/manifest.json', '/mateos/', '/mateos/mateos_logo_horizontal.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([self.clients.claim(), caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))]));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => (await caches.match(request)) || (await caches.match('/index.html'))));
  } else {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
  }
});
