/**
 * 💾 DISK CACHE TECHNIQUE
 * 
 * Purpose: Persistent storage using localStorage (browser disk storage)
 * 
 * Key Characteristics:
 * - Speed: Fast (5-15ms) - Slower than memory, faster than network
 * - Persistence: Survives page refresh, browser restart
 * - Capacity: 5-10MB per domain (browser dependent)
 * - Use Cases: Data that should persist across sessions
 * 
 * Performance: ~100x faster than network requests
 */

// Prefix to namespace our cache and avoid conflicts with other localStorage data
const DISK_PREFIX = 'disk-cache:'

/**
 * Retrieve cached data from localStorage (disk)
 * @param {string} key - Cache key (usually URL)
 * @returns {Object|null} Cached data or null if not found
 */
export function getDiskCache(key) {
  const raw = localStorage.getItem(DISK_PREFIX + key)
  return raw ? JSON.parse(raw) : null
}

/**
 * Store data in localStorage (disk) with timestamp
 * @param {string} key - Cache key (usually URL)
 * @param {Object} value - Data to cache (must be JSON serializable)
 */
export function setDiskCache(key, value) {
  // Add timestamp for cache expiration logic (if needed in future)
  localStorage.setItem(DISK_PREFIX + key, JSON.stringify({
    ...value,
    cachedAt: new Date().toISOString() // ISO format: "2026-03-13T10:30:00Z"
  }))
}

/**
 * Remove specific cache entry from disk
 * @param {string} key - Cache key to remove
 */
export function clearDiskCache(key) {
  localStorage.removeItem(DISK_PREFIX + key)
}

/**
 * Clear ALL disk cache entries while preserving other localStorage data
 * This is safer than localStorage.clear() which removes everything
 * @returns {number} Number of cache entries removed
 */
export function clearAllDiskCache() {
  const keys = Object.keys(localStorage)
  // Only remove keys with our cache prefix - keeps other app data safe
  const diskCacheKeys = keys.filter(key => key.startsWith(DISK_PREFIX))
  
  console.log(`[clearAllDiskCache] Removing ${diskCacheKeys.length} cached items`)
  diskCacheKeys.forEach(key => {
    console.log(`[clearAllDiskCache] Removing: ${key}`)
    localStorage.removeItem(key)
  })
  
  return diskCacheKeys.length
}

/**
 * Get list of all cached keys (for debugging and status display)
 * @returns {string[]} Array of cache keys
 */
export function getAllDiskCacheKeys() {
  const keys = Object.keys(localStorage)
  return keys.filter(key => key.startsWith(DISK_PREFIX))
}

/**
 * Generate example HTTP cache headers
 * 
 * HTTP CACHE HEADERS TECHNIQUE:
 * These headers tell browsers and CDNs HOW to cache responses
 * 
 * Common Headers Explained:
 * - Cache-Control: Primary cache directive
 *   - max-age=60: Cache for 60 seconds
 *   - stale-while-revalidate=30: Serve stale for 30s while refreshing
 *   - no-cache: Must revalidate before using
 *   - no-store: Never cache
 * 
 * - ETag: Resource version identifier (for conditional requests)
 * - Last-Modified: When resource was last changed
 * - Expires: Absolute expiration date/time
 * - Age: How long resource has been in cache
 * 
 * @param {string} strategy - Cache-Control directive
 * @returns {Object} Example cache headers
 */
export function getCacheHeadersExample(strategy = 'max-age=60, stale-while-revalidate=30') {
  return {
    // Main caching directive - controls ALL caching behavior
    'Cache-Control': strategy,
    
    // Entity tag - weak validator (W/) for conditional requests
    // Server can check: "If-None-Match: W/demo-resource-v1" → 304 Not Modified
    'ETag': 'W/"demo-resource-v1"',
    'Last-Modified': new Date(Date.now() - 3600 * 1000).toUTCString(),
    'Expires': new Date(Date.now() + 60 * 1000).toUTCString(),
    'Age': '12'
  }
}
