/**
 * 🔧 SERVICE WORKER CACHE TECHNIQUE
 * 
 * Purpose: Programmable network proxy for offline-first applications
 * 
 * Key Characteristics:
 * - Speed: Very Fast (similar to memory cache)
 * - Persistence: Survives refresh, separate from main thread
 * - Capacity: Large (100MB+ depending on browser)
 * - Use Cases: PWAs, offline support, background sync
 * 
 * Why Use Service Workers?
 * - Intercept ALL network requests
 * - Work even when page is closed
 * - Enable true offline functionality
 * - Can implement ANY caching strategy
 * 
 * Performance: Near-instant responses, enables offline apps
 */

// Cache version names - increment version to force cache refresh
const CACHE_NAME = 'web-caching-demo-v1'
const API_CACHE = 'api-cache-v1'

// Assets to pre-cache on Service Worker installation
// These will be available IMMEDIATELY, even offline
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/mock-api/products.json',
  '/mock-api/news.json',
  '/mock-api/profile.json'
]

/**
 * INSTALL EVENT: Runs when Service Worker is first installed
 * This is where we pre-cache critical assets
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...')
  
  event.waitUntil(
    // Open cache and store all static assets
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets')
      return cache.addAll(STATIC_ASSETS)
    })
  )
  
  // Force new SW to activate immediately (don't wait for tab close)
  self.skipWaiting()
})

/**
 * ACTIVATE EVENT: Runs when Service Worker takes control
 * Good place to clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker activated')
  
  // Take control of all pages immediately
  event.waitUntil(self.clients.claim())
})

/**
 * FETCH EVENT: Intercepts ALL network requests
 * This is where the magic happens - we can return cached responses!
 */
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Only handle GET requests (not POST, PUT, DELETE, etc)
  if (request.method !== 'GET') return

  // Route 1: API requests → Use Stale-While-Revalidate
  if (request.url.includes('/mock-api/')) {
    event.respondWith(staleWhileRevalidate(request))
    return
  }

  // Route 2: Static assets → Use Cache-First
  event.respondWith(cacheFirst(request))
})

/**
 * CACHE-FIRST STRATEGY
 * 
 * Flow:
 * 1. Check cache first
 * 2. Return cached response if found (fast!)
 * 3. If not cached, fetch from network
 * 4. Store network response in cache for next time
 * 
 * Best for: Static assets that don't change (images, CSS, JS)
 */
async function cacheFirst(request) {
  const cached = await caches.match(request)
  
  if (cached) {
    console.log('[SW Cache-First] Cache HIT:', request.url)
    return cached // Ultra fast - no network needed!
  }

  console.log('[SW Cache-First] Cache MISS, fetching:', request.url)
  
  // Not in cache - fetch from network
  const response = await fetch(request)
  
  // Store in cache for future requests
  const cache = await caches.open(CACHE_NAME)
  cache.put(request, response.clone()) // clone() because response can only be read once
  
  return response
}

/**
 * STALE-WHILE-REVALIDATE STRATEGY
 * 
 * Flow:
 * 1. Return cached response immediately (even if stale)
 * 2. Meanwhile, fetch fresh data from network
 * 3. Update cache with fresh data for next request
 * 
 * Best for: Data that changes but stale data is acceptable (news, feeds)
 * Gives users instant response while ensuring fresh data next time!
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(API_CACHE)
  const cached = await cache.match(request)

  // Background fetch to update cache (don't await - let it run async)
  const networkFetch = fetch(request).then((response) => {
    console.log('[SW SWR] Updating cache in background:', request.url)
    cache.put(request, response.clone())
    return response
  }).catch(err => {
    console.log('[SW SWR] Network failed, using cached version')
    return cached
  })

  // Return cached immediately if available, otherwise wait for network
  if (cached) {
    console.log('[SW SWR] Serving stale cache:', request.url)
    return cached // Instant response!
  }
  
  console.log('[SW SWR] No cache, waiting for network')
  return networkFetch
}

/**
 * DEMO TALKING POINTS:
 * 
 * 1. "Service Worker runs in background, separate from your app"
 * 2. "It intercepts ALL network requests - we control everything!"
 * 3. "This enables TRUE offline functionality - app works without internet"
 * 4. "Different strategies for different content types"
 * 5. "Go offline (DevTools → Network → Offline) and see it still works!"
 */
