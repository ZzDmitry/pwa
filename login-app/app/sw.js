/* eslint-disable no-console */
/* global caches fetch */

// eslint-disable-next-line no-undef,no-restricted-globals
const swSelf = self;

const version = '0.6.59';
const cacheName = `login-app-${version}`;
swSelf.addEventListener('install', (e) => {
  console.log('SW_install');
  e.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll([
      './',
      'index.html',
      'styles/main.css',
      'scripts/main.js',
      'scripts/comlink.global.js',
      'scripts/messagechanneladapter.global.js',
      'scripts/pwacompat.min.js',
    ])
      .then(() => swSelf.skipWaiting())),
  );
});

swSelf.addEventListener('activate', (event) => {
  console.log('SW_active');
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
    caches.open(cacheName)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => response || fetch(event.request)),
  );
});
