/* eslint-disable no-console */
/* global caches fetch */

// eslint-disable-next-line no-undef,no-restricted-globals
const swSelf = self;

const version = '@@CONFIG.VERSION';
const currentCacheName = `login-app-${version}`;
swSelf.addEventListener('install', (e) => {
  console.log('SW_install');
  e.waitUntil(
    caches.open(currentCacheName).then(cache => cache.addAll([
      './',
      'index.html',
      'styles/main.css',
      'scripts/main.js',
      'scripts/pwacompat.min.js',
    ])
      .then(() => swSelf.skipWaiting())),
  );
});

swSelf.addEventListener('activate', (event) => {
  console.log('SW_active');
  event.waitUntil(
    caches.keys().then(cacheNames => (
      Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== currentCacheName)
          .map(cacheName => caches.delete(cacheName)),
      )
    )),
  );
  event.waitUntil(swSelf.clients.claim());
  swSelf.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage('reload-page');
    });
  });
});

swSelf.addEventListener('fetch', (event) => {
  console.log('SW_fetch');
  event.respondWith(
    caches.open(currentCacheName)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => response || fetch(event.request)),
  );
});
