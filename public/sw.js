const CACHE_NAME = 'web-caching-demo-v1'
const API_CACHE = 'api-cache-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/mock-api/products.json',
  '/mock-api/news.json',
  '/mock-api/profile.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') return

  if (request.url.includes('/mock-api/')) {
    event.respondWith(staleWhileRevalidate(request))
    return
  }

  event.respondWith(cacheFirst(request))
})

async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached

  const response = await fetch(request)
  const cache = await caches.open(CACHE_NAME)
  cache.put(request, response.clone())
  return response
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(API_CACHE)
  const cached = await cache.match(request)

  const networkFetch = fetch(request).then((response) => {
    cache.put(request, response.clone())
    return response
  })

  return cached || networkFetch
}
