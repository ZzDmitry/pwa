/* global caches fetch */

// eslint-disable-next-line no-undef,no-restricted-globals
const swSelf = self;

const version = '0.6.12';
const cacheName = `login-app-${version}`;
swSelf.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll([
      '/',
      '/index.html',
      '/styles/main.css',
      '/scripts/main.js',
      '/scripts/comlink.global.js',
      '/scripts/messagechanneladapter.global.js',
      '/scripts/pwacompat.min.js',
    ])
      .then(() => swSelf.skipWaiting())),
  );
});

swSelf.addEventListener('activate', (event) => {
  event.waitUntil(swSelf.clients.claim());
});

swSelf.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => response || fetch(event.request)),
  );
});
