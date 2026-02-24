/**
 * Service Worker for PWA Support
 * Provides offline functionality and caching
 */

const CACHE_NAME = 'vophuthinh-portfolio-v2';
const OFFLINE_URL = './offline.html';

const STATIC_CACHE_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './assets/css/style.css',
  './assets/css/style-switcher.css',
  './assets/css/skins/color-1.css',
  './js/config.js',
  './js/utils.js',
  './js/projects-data.js',
  './js/interests-data.js',
  './js/style-switcher.js',
  './assets/favicon/manifest.json',
  './assets/images/logo.png',
  './assets/images/hero.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_CACHE_ASSETS).catch((err) => {
          console.warn('[SW] Some assets failed to cache:', err);
          return Promise.resolve();
        });
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            if (request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

