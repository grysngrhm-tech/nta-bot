/**
 * NTA Bot Service Worker
 * Provides offline support and caching for the PWA
 */

const STATIC_CACHE = 'nta-bot-static-v16.1';
const DYNAMIC_CACHE = 'nta-bot-dynamic-v16.1';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './dashboard.html',
  './manifest.json',
  './assets/icons/nta-logo.svg',
  './assets/icons/favicon-16.png',
  './assets/icons/favicon-32.png',
  './assets/icons/icon-72.png',
  './assets/icons/icon-96.png',
  './assets/icons/icon-120.png',
  './assets/icons/icon-128.png',
  './assets/icons/icon-144.png',
  './assets/icons/icon-152.png',
  './assets/icons/icon-167.png',
  './assets/icons/icon-180.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-384.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-192.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png'
];

// External resources to cache when fetched
const CACHEABLE_EXTERNAL = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
];

// Install event - precache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(async (cache) => {
        console.log('[SW] Precaching static assets');
        for (const asset of PRECACHE_ASSETS) {
          try {
            await cache.add(asset);
          } catch (error) {
            console.warn('[SW] Failed to precache:', asset, error.message);
          }
        }
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return name.startsWith('nta-bot-') &&
                     name !== STATIC_CACHE &&
                     name !== DYNAMIC_CACHE;
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip API requests - always go to network
  if (url.hostname.includes('n8n.srv1208741.hstgr.cloud') ||
      url.hostname.includes('supabase.co') ||
      url.hostname.includes('ipapi.co') ||
      url.hostname.includes('api.openai.com')) {
    event.respondWith(networkOnly(request));
    return;
  }

  // For same-origin HTML - network first (always get latest code)
  if (url.origin === self.location.origin && (url.pathname.endsWith('.html') || url.pathname.endsWith('/'))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // For same-origin static assets (SVG, icons) - cache first
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // For external fonts and resources - stale while revalidate
  if (CACHEABLE_EXTERNAL.some(domain => url.href.startsWith(domain))) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Default - network first with cache fallback
  event.respondWith(networkFirst(request));
});

// Cache-first strategy (for static assets)
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return offlineFallback(request);
  }
}

// Network-first strategy (for dynamic content)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return offlineFallback(request);
  }
}

// Network-only strategy (for API calls)
async function networkOnly(request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);
  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    return new Response(
      JSON.stringify({
        error: error.name === 'AbortError' ? 'timeout' : 'offline',
        message: error.name === 'AbortError'
          ? 'The request timed out. Please try again.'
          : 'You appear to be offline. Please check your internet connection.'
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Stale-while-revalidate strategy (for fonts)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// Offline fallback response
function offlineFallback(request) {
  if (request.mode === 'navigate') {
    // Try cached index first, then show offline page
    return caches.match('./index.html').then(cached => {
      if (cached) return cached;
      return new Response(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>NTA Bot — Offline</title>
<style>
  body{font-family:'Montserrat',system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100svh;margin:0;background:#f5f5f0;color:#1a1a1a;text-align:center;padding:2rem;}
  .offline{max-width:360px;}
  .offline-icon{font-size:3rem;margin-bottom:1rem;}
  h1{font-size:1.5rem;margin-bottom:0.5rem;color:#1a1a1a;}
  p{color:#4a4a4a;margin-bottom:1.5rem;line-height:1.6;}
  button{padding:0.75rem 1.5rem;background:#4a7c59;color:#fff;border:none;border-radius:25px;font-size:1rem;font-family:inherit;cursor:pointer;transition:background 0.2s;}
  button:hover{background:#3d6b4a;}
</style></head><body>
<div class="offline">
  <div class="offline-icon">&#x1F4F6;</div>
  <h1>You're Offline</h1>
  <p>NTA Bot requires an internet connection to search the knowledge base. Please check your connection and try again.</p>
  <button onclick="location.reload()">Retry</button>
</div></body></html>`, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    });
  }

  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: STATIC_CACHE });
  }
});
